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
using System.Linq;
using System.Threading.Tasks;
using Abstractions;
using eFormAPI.Web.Abstractions.Security;
using Infrastructure.Models.Permissions;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Permissions;

public class PermissionsService(
    BaseDbContext dbContext,
    ILocalizationService localizationService,
    ILogger<PermissionsService> logger,
    IClaimsService claimsService)
    : IPermissionsService
{
    public async Task<OperationDataResult<PermissionsModel>> GetGroupPermissions(int groupId)
    {
        try
        {
            SecurityGroup group = await dbContext.SecurityGroups.FirstOrDefaultAsync(x => x.Id == groupId);
            if (group == null)
            {
                return new OperationDataResult<PermissionsModel>(false,
                    localizationService.GetString("SecurityGroupNotFound"));
            }

            var permissionModels = await dbContext.Permissions
                .Select(x => new PermissionModel()
                {
                    Id = x.Id,
                    ClaimName = x.ClaimName,
                    PermissionName = x.PermissionName,
                    PermissionType = x.PermissionType.Name,
                    PermissionTypeId = x.PermissionTypeId,
                    IsEnabled = dbContext.GroupPermissions.Any(g => g.SecurityGroupId == groupId
                                                                     && g.PermissionId == x.Id)
                })
                .ToListAsync();

            var permissionTypes = permissionModels
                .OrderBy(x => x.PermissionType)
                .GroupBy(x => x.PermissionType)
                .Select(g => new PermissionTypeModel()
                {
                    Name = g.Key,
                    Permissions = g.Select(permission => permission).ToList()
                }).ToList();

            var result = new PermissionsModel
            {
                GroupId = groupId,
                GroupName = group.Name,
                PermissionTypes = permissionTypes
            };
            return new OperationDataResult<PermissionsModel>(true, result);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<PermissionsModel>(false,
                localizationService.GetString("ErrorWhileObtainingPermissions"));
        }
    }

    public async Task<OperationResult> UpdatePermissions(PermissionsUpdateModel requestModel)
    {
        try
        {
            if (!await dbContext.SecurityGroups.AnyAsync(x => x.Id == requestModel.GroupId))
            {
                return new OperationDataResult<PermissionsModel>(false,
                    localizationService.GetString("SecurityGroupNotFound"));
            }

            //using (var transaction = await _dbContext.Database.BeginTransactionAsync())
//                {
            var enabledList = requestModel.Permissions
                .Where(x => x.IsEnabled)
                .Select(x => x.Id)
                .ToList();

            // for delete
            var forDelete = dbContext.GroupPermissions
                .Where(x => x.SecurityGroupId == requestModel.GroupId)
                .Where(x => !enabledList.Contains(x.Permission.Id));

            dbContext.GroupPermissions.RemoveRange(forDelete);
            await dbContext.SaveChangesAsync();

            var list = dbContext.GroupPermissions
                .Where(x => x.SecurityGroupId == requestModel.GroupId)
                .Where(x => enabledList.Contains(x.Permission.Id))
                .Select(x => x.Permission.Id)
                .ToList();

            foreach (var permissionId in enabledList)
            {
                if (!list.Contains(permissionId))
                {
                    await dbContext.GroupPermissions.AddAsync(new GroupPermission()
                    {
                        PermissionId = permissionId,
                        SecurityGroupId = requestModel.GroupId
                    });
                }
            }

            await dbContext.SaveChangesAsync();

            // Update claims in memory store
            await claimsService.UpdateAuthenticatedUsers(new List<int> { requestModel.GroupId });

            //transaction.Commit();
//                }

            return new OperationResult(true,
                localizationService.GetString("PermissionsUpdatedSuccessfully"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetString("ErrorWhileUpdatingPermissions"));
        }
    }
}