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

using Sentry;

namespace eFormAPI.Web.Services.Security;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abstractions;
using eFormAPI.Web.Abstractions.Security;
using Infrastructure.Models;
using Infrastructure.Models.EformPermissions;
using Infrastructure.Models.Templates;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microsoft.EntityFrameworkCore;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Permissions;

public class EformGroupService(
    ILogger<EformGroupService> logger,
    BaseDbContext dbContext,
    ILocalizationService localizationService,
    IEFormCoreService coreHelper,
    IUserService userService,
    IHttpContextAccessor httpContextAccessor)
    : IEformGroupService
{
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    public async Task<OperationDataResult<TemplateListModel>> GetAvailableEforms(
        TemplateRequestModel templateRequestModel,
        int groupId)
    {
        try
        {
            TimeZoneInfo timeZoneInfo = await userService.GetCurrentUserTimeZoneInfo();

            var result = new TemplateListModel
            {
                Templates = new List<TemplateDto>()
            };
            var core = await coreHelper.GetCore();
            var language = await userService.GetCurrentUserLanguage();
            var templatesDto = await core.TemplateItemReadAll(false,
                "",
                templateRequestModel.NameFilter,
                templateRequestModel.IsSortDsc,
                templateRequestModel.Sort,
                templateRequestModel.TagIds, timeZoneInfo, language).ConfigureAwait(false);

            var eformsInGroup = await dbContext.EformInGroups
                .Where(x => x.SecurityGroupId == groupId)
                .Select(x => x.TemplateId)
                .ToListAsync();

            if (templatesDto.Any())
            {
                foreach (var templateDto in templatesDto)
                {
                    if (!eformsInGroup.Contains(templateDto.Id))
                    {
                        result.Templates.Add(templateDto);
                    }
                }

                result.NumOfElements = templatesDto.Count;
                result.PageNum = 1;
            }

            return new OperationDataResult<TemplateListModel>(true, result);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<TemplateListModel>(false,
                localizationService.GetString("ErrorWhileObtainingAvailableEForms"));
        }
    }

    public async Task<OperationResult> AddEformToGroup(EformBindGroupModel requestModel)
    {
        try
        {
            if (!await dbContext.SecurityGroups.AnyAsync(x => x.Id == requestModel.GroupId))
            {
                return new OperationResult(false, localizationService.GetString("SecurityGroupNotFound"));
            }

            if (await dbContext.EformInGroups.AnyAsync(x => x.TemplateId == requestModel.EformId
                                                             && x.SecurityGroupId == requestModel.GroupId))
            {
                return new OperationResult(false, localizationService.GetString("eFormAlreadyInGroup"));
            }

            var newEformInGroup = new EformInGroup()
            {
                SecurityGroupId = requestModel.GroupId,
                TemplateId = requestModel.EformId
            };
            await dbContext.EformInGroups.AddAsync(newEformInGroup);
            await dbContext.SaveChangesAsync();
            return new OperationResult(true);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(true,
                localizationService.GetString("ErrorWhileBindingEformToGroup"));
        }
    }

    public async Task<OperationDataResult<EformsPermissionsModel>> GetGroupEforms(int groupId)
    {
        try
        {
            TimeZoneInfo timeZoneInfo = await userService.GetCurrentUserTimeZoneInfo();
            var result = new EformsPermissionsModel();
            var eformClaims = new[]
            {
                AuthConsts.EformClaims.EformsClaims.UpdateColumns,
                AuthConsts.EformClaims.EformsClaims.DownloadXml,
                AuthConsts.EformClaims.EformsClaims.UploadZip,
                AuthConsts.EformClaims.CasesClaims.CasesRead,
                AuthConsts.EformClaims.CasesClaims.CaseRead,
                AuthConsts.EformClaims.CasesClaims.CaseUpdate,
                AuthConsts.EformClaims.CasesClaims.CaseDelete,
                AuthConsts.EformClaims.CasesClaims.CaseGetPdf,
                AuthConsts.EformClaims.CasesClaims.CaseGetDocx,
                AuthConsts.EformClaims.CasesClaims.CaseGetPptx,
                AuthConsts.EformClaims.EformsClaims.PairingUpdate,
                AuthConsts.EformClaims.EformsClaims.UpdateTags,
                AuthConsts.EformClaims.EformsClaims.GetCsv,
                AuthConsts.EformClaims.EformsClaims.ReadJasperReport,
                AuthConsts.EformClaims.EformsClaims.UpdateJasperReport,
                AuthConsts.EformClaims.EformsClaims.ExportEformExcel
            };

            List<EformPermissionsModel> eformsInGroup = await dbContext.EformInGroups
                .Where(x => x.SecurityGroupId == groupId)
                .Select(e => new EformPermissionsModel()
                {
                    GroupName = e.SecurityGroup.Name,
                    EformInGroupId = e.Id,
                    TemplateId = e.TemplateId
                    // Permissions = _dbContext.Permissions
                    //     .Where(x => eformClaims.Contains(x.ClaimName))
                    //     .Select(x => new EformPermissionModel()
                    //     {
                    //         Id = x.Id,
                    //         EformPermissionId = e.EformPermissions
                    //             .Where(w => w.EformInGroupId == e.Id
                    //                         && w.PermissionId == x.Id)
                    //             .Select(w => w.Id)
                    //             .FirstOrDefault(),
                    //         ClaimName = x.ClaimName,
                    //         PermissionName = x.PermissionName,
                    //         PermissionType = x.PermissionType.Name,
                    //         PermissionTypeId = x.PermissionTypeId,
                    //         IsEnabled = _dbContext.EformPermissions.Any(g =>
                    //             g.EformInGroup.SecurityGroupId == groupId
                    //             && g.PermissionId == x.Id && g.EformInGroupId == e.Id)
                    //     }).ToList()
                })
                .ToListAsync();
            foreach (EformPermissionsModel eformPermissionsModel in eformsInGroup)
            {
                eformPermissionsModel.Permissions = await dbContext.Permissions
                    .Where(x => eformClaims.Contains(x.ClaimName))
                    .Select(x => new EformPermissionModel()
                    {
                        Id = x.Id,
                        ClaimName = x.ClaimName,
                        PermissionName = x.PermissionName,
                        PermissionType = x.PermissionType.Name,
                        PermissionTypeId = x.PermissionTypeId
                    }).ToListAsync();
                foreach (EformPermissionModel permission in eformPermissionsModel.Permissions)
                {
                    permission.IsEnabled = dbContext.EformPermissions.Any(g =>
                        g.EformInGroup.SecurityGroupId == groupId
                        && g.PermissionId == permission.Id
                        && g.EformInGroupId == eformPermissionsModel.EformInGroupId);
                }
            }
            var core = await coreHelper.GetCore();
            var language = await userService.GetCurrentUserLanguage();
            var templatesDto = await core.TemplateItemReadAll(false, timeZoneInfo, language);
            foreach (var eformInGroups in eformsInGroup)
            {
                var template = templatesDto.FirstOrDefault(x => x.Id == eformInGroups.TemplateId);
                if (template != null)
                {
                    eformInGroups.Label = template.Label;
                    eformInGroups.CreatedAt = template.CreatedAt;
                }
            }

            foreach (var eformInGroup in eformsInGroup)
            {
                var permissionTypes = eformInGroup.Permissions
                    .OrderBy(x => x.PermissionType)
                    .GroupBy(x => x.PermissionType)
                    .Select(g => new EformPermissionTypeModel()
                    {
                        Name = g.Key,
                        Permissions = g.Select(permission => permission).ToList()
                    }).ToList();
                eformInGroup.PermissionTypes = permissionTypes;
            }

            if (eformsInGroup.Any())
            {
                result.GroupName = eformsInGroup.First().GroupName;
            }
            else
            {
                result.GroupName = dbContext.SecurityGroups
                    .Where(x => x.Id == groupId)
                    .Select(x => x.Name)
                    .FirstOrDefault();
            }

            result.GroupId = groupId;
            result.EformsList = eformsInGroup;
            result.Total = dbContext.EformInGroups
                .Where(x => x.SecurityGroupId == groupId)
                .Select(x => x.Id)
                .Count();

            return new OperationDataResult<EformsPermissionsModel>(true, result);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<EformsPermissionsModel>(false,
                localizationService.GetString("ErrorWhileObtainingEformInfo"));
        }
    }


    public async Task<OperationDataResult<List<EformPermissionsSimpleModel>>> GetEformSimpleInfo()
    {
        try
        {
            List<EformPermissionsSimpleModel> result = await dbContext.EformInGroups
                .Where(x => x.SecurityGroup.SecurityGroupUsers.Any(y =>
                    y.EformUserId == userService.UserId))
                .Select(x => new EformPermissionsSimpleModel()
                {
                    TemplateId = x.TemplateId,
                    PermissionsSimpleList = x.EformPermissions.Select(y => y.Permission.ClaimName).ToList()
                })
                .ToListAsync();
            return new OperationDataResult<List<EformPermissionsSimpleModel>>(true, result);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<List<EformPermissionsSimpleModel>>(false,
                localizationService.GetString("ErrorWhileObtainingEformInfo"));
        }
    }

    public async Task<OperationResult> UpdateGroupEformPermissions(EformPermissionsModel requestModel)
    {
        try
        {
            requestModel.Permissions.Clear();
            foreach (var permissionType in requestModel.PermissionTypes)
            {
                foreach (var permission in permissionType.Permissions)
                {
                    requestModel.Permissions.Add(permission);
                }
            }

            //using (var transaction = await _dbContext.Database.BeginTransactionAsync())
//                {
            var enabledEformPermission = new List<int>();
            foreach (var eformPermission in requestModel.Permissions)
            {
                if (eformPermission.IsEnabled)
                {
                    enabledEformPermission.Add(eformPermission.EformPermissionId);
                }
            }

            // for delete
            var forDelete = dbContext.EformPermissions
                .Where(x => !enabledEformPermission.Contains(x.Id)
                            && x.EformInGroupId == requestModel.EformInGroupId)
                .ToList();

            dbContext.EformPermissions.RemoveRange(forDelete);
            await dbContext.SaveChangesAsync();

            var list = dbContext.EformPermissions
                .Where(x => x.EformInGroupId == requestModel.EformInGroupId)
                .Where(x => enabledEformPermission.Contains(x.Id))
                .Select(x => x.PermissionId)
                .ToList();

            var enabledPermissions = new List<int>();
            foreach (var eformPermission in requestModel.Permissions)
            {
                if (eformPermission.IsEnabled)
                {
                    enabledPermissions.Add(eformPermission.Id);
                }
            }

            foreach (var permissionId in enabledPermissions)
            {
                if (!list.Contains(permissionId))
                {
                    var permissionModel = requestModel.Permissions.FirstOrDefault(x =>
                        x.Id == permissionId && x.IsEnabled);
                    if (permissionModel != null)
                    {
                        await dbContext.EformPermissions.AddAsync(new EformPermission()
                        {
                            EformInGroupId = requestModel.EformInGroupId,
                            PermissionId = permissionModel.Id
                        });
                    }
                }
            }

            await dbContext.SaveChangesAsync();
            //transaction.Commit();
//                }

            return new OperationResult(true, localizationService.GetString("PermissionForEformHasBeenUpdated"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<EformsPermissionsModel>(false,
                localizationService.GetString("ErrorWhileObtainingEformInfo"));
        }
    }

    public async Task<OperationResult> DeleteEformFromGroup(int templateId, int groupId)
    {
        try
        {
            var eformInGroup = await dbContext.EformInGroups
                .FirstOrDefaultAsync(x => x.TemplateId == templateId
                                          && x.SecurityGroupId == groupId);
            if (eformInGroup == null)
            {
                return new OperationDataResult<EformsPermissionsModel>(false,
                    localizationService.GetString("eFormNotFound"));
            }

            dbContext.EformInGroups.Remove(eformInGroup);
            await dbContext.SaveChangesAsync();
            return new OperationResult(true,
                localizationService.GetString("eFormHasBeenDeletedFromGroup"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<EformsPermissionsModel>(false,
                localizationService.GetString("ErrorWhileDeletingEformFromGroup"));
        }
    }
}