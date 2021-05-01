/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using System.Collections.Generic;
using DocumentFormat.OpenXml.Office2010.ExcelAc;
using Microting.eForm.Dto;
using Microting.eForm.Infrastructure;
using Microting.eFormApi.BasePn.Abstractions;

namespace Monitoring.Pn.Services
{
    using System;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using Abstractions;
    using Helpers;
    using Infrastructure.Models;
    using Microsoft.AspNetCore.Http;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.EformMonitoringBase.Infrastructure.Data;
    using Microting.EformMonitoringBase.Infrastructure.Data.Entities;
    using Microting.EformMonitoringBase.Infrastructure.Enums;
    using Microting.EformMonitoringBase.Infrastructure.Models;
    using Microting.EformMonitoringBase.Infrastructure.Models.Blocks;
    using Newtonsoft.Json;

    public class RulesService : IRulesService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILogger<RulesService> _logger;
        private readonly EformMonitoringPnDbContext _dbContext;
        private readonly IMonitoringLocalizationService _localizationService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RulesService(
            EformMonitoringPnDbContext dbContext,
            IEFormCoreService coreHelper,
            IMonitoringLocalizationService localizationService,
            IHttpContextAccessor httpContextAccessor,
            ILogger<RulesService> logger)
        {
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _localizationService = localizationService;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        public async Task<OperationDataResult<NotificationRulesListModel>> Index(NotificationListRequestModel requestModel)
        {
            var core = await _coreHelper.GetCore();
            await using MicrotingDbContext dbContext = core.DbContextHelper.GetDbContext();
            List<KeyValuePair<int, string>> eForms = new List<KeyValuePair<int, string>>();
            try
            {
                var rules = await _dbContext.Rules
                    .AsNoTracking()
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Skip(requestModel.Offset)
                    .Take(requestModel.PageSize)
                    .Include(x => x.Recipients)
                    .Include(x => x.DeviceUsers)
                    .ToListAsync();

                var result = new NotificationRulesListModel();
                foreach (var rule in rules)
                {
                    string eFormName;
                    if (eForms.Any(x => x.Key == rule.CheckListId))
                    {
                        eFormName = eForms.First(x => x.Key == rule.CheckListId).Value;
                    }
                    else
                    {
                        eForms.Add( new KeyValuePair<int, string>(rule.CheckListId, dbContext.CheckLists.Single( x => x.Id == rule.CheckListId).Label));
                        eFormName = eForms.First(x => x.Key == rule.CheckListId).Value;
                    }

                    var ruleModel = new NotificationRuleSimpleModel
                    {
                        Id = rule.Id,
                        EFormName = eFormName,
                        Event = "Email"
                    };

                    if (rule.Data != null && !string.IsNullOrEmpty(rule.Data))
                    {
                        try
                        {
                            ruleModel.Trigger = RulesBlockHelper.GetRuleTriggerString(rule, dbContext);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(ex.Message);
                        }
                    }

                    result.Rules.Add(ruleModel);
                }

                result.Total = await _dbContext.Rules.CountAsync(x =>
                    x.WorkflowState != Constants.WorkflowStates.Removed);

                return new OperationDataResult<NotificationRulesListModel>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<NotificationRulesListModel>(
                    false,
                    _localizationService.GetString("ErrorWhileObtainingNotificationRulesInfo"));
            }
        }

        public async Task<OperationResult> Create(NotificationRuleModel ruleModel)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var notificationRule = new NotificationRule()
                    {
                        Subject = ruleModel.Subject,
                        Text = ruleModel.Text,
                        AttachReport = ruleModel.AttachReport,
                        AttachLink = ruleModel.AttachLink,
                        IncludeValue = ruleModel.IncludeValue,
                        DataItemId = ruleModel.DataItemId,
                        CheckListId = ruleModel.CheckListId,
                        RuleType = ruleModel.RuleType,
                        CreatedByUserId = UserId,
                        UpdatedByUserId = UserId,
                    };

                    if (ruleModel.Data != null)
                    {
                        notificationRule.Data = ruleModel.Data?.ToString();
                    }

                    await notificationRule.Create(_dbContext);

                    foreach (var recipientModel in ruleModel.Recipients)
                    {
                        var recipient = new Recipient()
                        {
                            CreatedByUserId = UserId,
                            UpdatedByUserId = UserId,
                            Email = recipientModel.Email,
                            NotificationRuleId = notificationRule.Id,
                        };
                        await recipient.Create(_dbContext);
                    }

                    var deviceUsersGroupedIds = ruleModel.DeviceUsers
                        .Where(x=> x.Id != null)
                        .GroupBy(x => x.Id)
                        .Select(x => x.Key)
                        .ToList();

                    foreach (var deviceUserId in deviceUsersGroupedIds)
                    {
                        if (deviceUserId != null)
                        {
                            var deviceUser = new DeviceUser()
                            {
                                CreatedByUserId = UserId,
                                UpdatedByUserId = UserId,
                                NotificationRuleId = notificationRule.Id,
                                DeviceUserId = (int) deviceUserId,
                            };
                            await deviceUser.Create(_dbContext);
                        }
                    }

                    transaction.Commit();

                    return new OperationResult(
                        true,
                        _localizationService.GetString("NotificationRuleCreatedSuccessfully"));
                }
                catch (Exception e)
                {
                    transaction.Rollback();
                    _logger.LogError(e.Message);
                    return new OperationResult(
                        false,
                        _localizationService.GetString("ErrorWhileCreatingNotificationRule"));
                }
            }
        }

        public async Task<OperationDataResult<NotificationRuleModel>> Read(int id)
        {
            try
            {
                var rule = await _dbContext.Rules
                    .FirstOrDefaultAsync(
                        x => x.Id == id
                             && x.WorkflowState != Constants.WorkflowStates.Removed);

                if (rule == null)
                {
                    return new OperationDataResult<NotificationRuleModel>(false,
                        _localizationService.GetString("NotificationRuleNotFound"));
                }

                var recipients = await _dbContext.Recipients
                    .Where(x => x.NotificationRuleId == rule.Id
                                && x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => new RecipientModel()
                    {
                        Id = x.Id,
                        Email = x.Email,
                    }).ToListAsync();

                var deviceUsers = await _dbContext.DeviceUsers
                    .Where(x => x.NotificationRuleId == rule.Id
                                && x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => new DeviceUserModel()
                    {
                        Id = x.DeviceUserId,
                    }).ToListAsync();

                var core = await _coreHelper.GetCore();
                foreach (var deviceUserModel in deviceUsers)
                {
                    if (deviceUserModel.Id != null)
                    {
                        var sdkDeviceUser = await core.SiteRead((int) deviceUserModel.Id);
                        deviceUserModel.FirstName = sdkDeviceUser.FirstName;
                        deviceUserModel.LastName = sdkDeviceUser.LastName;
                    }
                }

                var ruleModel = new NotificationRuleModel()
                {
                    Id = rule.Id,
                    CheckListId = rule.CheckListId,
                    DataItemId = rule.DataItemId,
                    RuleType = rule.RuleType,
                    AttachReport = rule.AttachReport,
                    AttachLink = rule.AttachLink,
                    IncludeValue = rule.IncludeValue,
                    Subject = rule.Subject,
                    Text = rule.Text,
                    Recipients = recipients,
                    DeviceUsers = deviceUsers,
                };

                if (!string.IsNullOrEmpty(rule.Data))
                {
                    var jsonSettings = new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Include
                    };

                    switch (rule.RuleType)
                    {
                        case RuleType.Select:
                            ruleModel.Data = JsonConvert.DeserializeObject<SelectBlock>(rule.Data, jsonSettings);
                            break;
                        case RuleType.CheckBox:
                            ruleModel.Data = JsonConvert.DeserializeObject<CheckBoxBlock>(rule.Data, jsonSettings);
                            break;
                        case RuleType.Number:
                            ruleModel.Data = JsonConvert.DeserializeObject<NumberBlock>(rule.Data, jsonSettings);
                            break;
                        default:
                            ruleModel.Data = JsonConvert.DeserializeObject<BaseDataItem>(rule.Data, jsonSettings);
                            break;
                    }
                }
                return new OperationDataResult<NotificationRuleModel>(true, ruleModel);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<NotificationRuleModel>(
                    false,
                    _localizationService.GetString("ErrorWhileObtainingNotificationRulesInfo"));
            }
        }

        public async Task<OperationResult> Update(NotificationRuleModel ruleModel)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var rule = await _dbContext.Rules
                        .Include(x=>x.Recipients)
                        .FirstOrDefaultAsync(x => x.WorkflowState != Constants.WorkflowStates.Removed
                                                  && x.Id == ruleModel.Id);

                    if (rule == null)
                    {
                        return new OperationResult(false,
                            _localizationService.GetString("NotificationRuleNotFound"));
                    }

                    rule.AttachReport = ruleModel.AttachReport;
                    rule.AttachLink = ruleModel.AttachLink;
                    rule.IncludeValue = ruleModel.IncludeValue;
                    rule.RuleType = ruleModel.RuleType;
                    rule.Subject = ruleModel.Subject;
                    rule.CheckListId = ruleModel.CheckListId;
                    rule.Text = ruleModel.Text;
                    rule.DataItemId = ruleModel.DataItemId;

                    if (ruleModel.Data != null)
                    {
                        rule.Data = ruleModel.Data.ToString();
                    }

                    await rule.Update(_dbContext);

                    // work with recipients
                    var currentRecipients = ruleModel.Recipients.Select(x => x.Id).ToList();
                    var recipientsDelete = await _dbContext.Recipients
                        .Where(r => r.NotificationRuleId == rule.Id && !currentRecipients.Contains(r.Id))
                        .ToListAsync();

                    foreach (var rd in recipientsDelete)
                    {
                        await rd.Delete(_dbContext);
                    }

                    foreach (var recipientModel in ruleModel.Recipients.Where(r => r.Id == null))
                    {
                        var recipient = new Recipient
                        {
                            Email = recipientModel.Email,
                            NotificationRuleId = rule.Id,
                            CreatedByUserId = UserId,
                            UpdatedByUserId = UserId
                        };

                        await recipient.Create(_dbContext);
                    }

                    // work with device users
                    var currentDeviseUserId = ruleModel.DeviceUsers.Select(x => x.Id).ToList();
                    var deviceUsersDelete = await _dbContext.DeviceUsers
                        .Where(r => r.NotificationRuleId == rule.Id && !currentDeviseUserId.Contains(r.DeviceUserId))
                        .ToListAsync();

                    foreach (var dud in deviceUsersDelete)
                    {
                        await dud.Delete(_dbContext);
                    }

                    foreach (var deviceUserModel in ruleModel.DeviceUsers)
                    {
                        if (!await _dbContext.DeviceUsers.AnyAsync(
                            x => x.DeviceUserId == deviceUserModel.Id &&
                                 x.NotificationRuleId == rule.Id &&
                                 x.WorkflowState != Constants.WorkflowStates.Removed))
                        {
                            if (deviceUserModel.Id != null)
                            {
                                var deviceUser = new DeviceUser()
                                {
                                    NotificationRuleId = rule.Id,
                                    CreatedByUserId = UserId,
                                    UpdatedByUserId = UserId,
                                    DeviceUserId = (int)deviceUserModel.Id,
                                };

                                await deviceUser.Create(_dbContext);
                            }
                        }
                    }

                    transaction.Commit();
                    return new OperationResult(
                        true,
                        _localizationService.GetString("NotificationRuleHasBeenUpdated"));
                }
                catch (Exception e)
                {
                    transaction.Rollback();
                    _logger.LogError(e.Message);
                    return new OperationResult(
                        false,
                        _localizationService.GetString("ErrorWhileUpdatingNotificationRule"));
                }
            }
        }

        public async Task<OperationResult> Delete(int id)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var notificationRule = await _dbContext.Rules
                        .FirstOrDefaultAsync(x => x.Id == id);

                    if (notificationRule == null)
                    {
                        return new OperationResult(
                            false,
                            _localizationService.GetString("NotificationRuleNotFound"));
                    }

                    // recipients
                    var recipients = await _dbContext.Recipients
                        .Where(x => x.NotificationRuleId == notificationRule.Id)
                        .ToListAsync();

                    foreach (var recipient in recipients)
                    {
                        await recipient.Delete(_dbContext);
                    }

                    // device users
                    var deviceUsers = await _dbContext.DeviceUsers
                        .Where(x => x.NotificationRuleId == notificationRule.Id)
                        .ToListAsync();

                    foreach (var deviceUser in deviceUsers)
                    {
                        await deviceUser.Delete(_dbContext);
                    }

                    await notificationRule.Delete(_dbContext);
                    transaction.Commit();
                    return new OperationResult(
                        true,
                        _localizationService.GetString("NotificationRuleDeletedSuccessfully"));
                }
                catch (Exception e)
                {
                    transaction.Rollback();
                    _logger.LogError(e.Message);
                    return new OperationResult(false, _localizationService.GetString("ErrorWhileRemovingNotificationRule"));
                }
            }
        }

        private int UserId
        {
            get
            {
                var value = _httpContextAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return value == null ? 0 : int.Parse(value);
            }
        }
    }
}
