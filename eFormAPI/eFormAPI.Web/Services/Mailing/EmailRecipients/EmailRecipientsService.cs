/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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
namespace eFormAPI.Web.Services.Mailing.EmailRecipients
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Database;
    using Infrastructure.Database.Entities.Mailing;
    using Infrastructure.Models.Mailing;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Infrastructure.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public class EmailRecipientsService : IEmailRecipientsService
    {
        private readonly ILogger<EmailRecipientsService> _logger;
        private readonly IUserService _userService;
        private readonly ILocalizationService _localizationService;
        private readonly BaseDbContext _dbContext;

        public EmailRecipientsService(
            ILogger<EmailRecipientsService> logger,
            IUserService userService,
            ILocalizationService localizationService,
            BaseDbContext dbContext)
        {
            _logger = logger;
            _userService = userService;
            _localizationService = localizationService;
            _dbContext = dbContext;
        }

        public async Task<OperationDataResult<EmailRecipientsListModel>> GetEmailRecipients(
            EmailRecipientsRequestModel requestModel)
        {
            try
            {
                var emailRecipientsModel = new EmailRecipientsListModel();
                var emailRecipientsQuery = _dbContext.EmailRecipients.AsQueryable();
                if (!string.IsNullOrEmpty(requestModel.Sort))
                {
                    if (requestModel.IsSortDsc)
                    {
                        emailRecipientsQuery = emailRecipientsQuery
                            .CustomOrderByDescending(requestModel.Sort);
                    }
                    else
                    {
                        emailRecipientsQuery = emailRecipientsQuery
                            .CustomOrderBy(requestModel.Sort);
                    }
                }
                else
                {
                    emailRecipientsQuery = emailRecipientsQuery
                        .OrderBy(x => x.Id);
                }

                emailRecipientsModel.Total = await emailRecipientsQuery.CountAsync();

                emailRecipientsQuery = emailRecipientsQuery
                    .Skip(requestModel.Offset)
                    .Take(requestModel.PageSize);

                var emailRecipientList = await emailRecipientsQuery
                    .Select(x => new EmailRecipientModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Email = x.Email,
                        Tags = x.TagRecipients
                            .Select(u => new EmailRecipientTagModel()
                            {
                                Id = u.EmailTag.Id,
                                Name = u.EmailTag.Name,
                            }).ToList()
                    }).ToListAsync();

                emailRecipientsModel.EmailRecipientsList = emailRecipientList;

                return new OperationDataResult<EmailRecipientsListModel>(
                    true,
                    emailRecipientsModel);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationDataResult<EmailRecipientsListModel>(false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> UpdateEmailRecipient(
            EmailRecipientUpdateModel requestModel)
        {
            try
            {
                var emailRecipient = await _dbContext.EmailRecipients
                    .FirstOrDefaultAsync(x => x.Id == requestModel.Id);

                if (emailRecipient == null)
                {
                    return new OperationResult(false,
                        _localizationService.GetString(""));
                }

                emailRecipient.Name = requestModel.Name;
                emailRecipient.Email = requestModel.Email;
                emailRecipient.UpdatedAt = DateTime.UtcNow;
                emailRecipient.UpdatedByUserId = _userService.UserId;

                // TODO Update tags for Email recipient

                _dbContext.EmailRecipients.Update(emailRecipient);
                await _dbContext.SaveChangesAsync();

                return new OperationResult(true,
                    _localizationService.GetString(""));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> DeleteEmailRecipient(int id)
        {
            try
            {
                var emailRecipient = await _dbContext.EmailRecipients
                    .FirstOrDefaultAsync(x => x.Id == id);

                if (emailRecipient == null)
                {
                    return new OperationResult(false,
                        _localizationService.GetString(""));
                }

                _dbContext.EmailRecipients.Remove(emailRecipient);
                await _dbContext.SaveChangesAsync();

                return new OperationResult(true,
                    _localizationService.GetString(""));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> CreateEmailRecipient(EmailRecipientsCreateModel createModel)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var tagIds = new List<int>();
                    // Create tags
                    var tagNames = createModel.NewTags
                        .Replace(" ", "")
                        .Split(',');

                    foreach (var tagName in tagNames)
                    {
                        var emailTag = new EmailTag
                        {
                            Name = tagName,
                            CreatedAt = DateTime.UtcNow,
                            CreatedByUserId = _userService.UserId,
                            UpdatedAt = DateTime.UtcNow,
                            UpdatedByUserId = _userService.UserId,
                            Version = 1,
                        };
                        await _dbContext.EmailTags.AddAsync(emailTag);
                        await _dbContext.SaveChangesAsync();
                        tagIds.Add(emailTag.Id);
                    }

                    tagIds.AddRange(createModel.TagsIds);

                    foreach (var recipientCreateModel in createModel.EmailRecipientsList)
                    {
                        var emailRecipient = new EmailRecipient
                        {
                            Name = recipientCreateModel.Name,
                            Email = recipientCreateModel.Email,
                            CreatedAt = DateTime.UtcNow,
                            CreatedByUserId = _userService.UserId,
                            UpdatedAt = DateTime.UtcNow,
                            UpdatedByUserId = _userService.UserId,
                            Version = 1,
                            TagRecipients = new List<EmailTagRecipient>(),
                        };

                        // add new tags
                        foreach (var tagId in tagIds)
                        {
                            emailRecipient.TagRecipients.Add(
                                new EmailTagRecipient
                                {
                                    CreatedAt = DateTime.UtcNow,
                                    CreatedByUserId = _userService.UserId,
                                    UpdatedAt = DateTime.UtcNow,
                                    UpdatedByUserId = _userService.UserId,
                                    Version = 1,
                                    EmailTagId = tagId,
                                });
                        }

                        await _dbContext.EmailRecipients.AddAsync(emailRecipient);
                    }

                    await _dbContext.SaveChangesAsync();

                    transaction.Commit();
                    return new OperationResult(true,
                        _localizationService.GetString(""));
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    _logger.LogError(e.Message);
                    transaction.Commit();
                    return new OperationResult(false,
                        _localizationService.GetString(""));
                }
            }
        }
    }
}
