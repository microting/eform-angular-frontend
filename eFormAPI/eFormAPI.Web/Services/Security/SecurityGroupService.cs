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

using Microting.eForm.Infrastructure.Constants;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Permissions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abstractions;
using eFormAPI.Web.Abstractions.Security;
using Infrastructure.Models.Permissions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

public class SecurityGroupService(
    BaseDbContext dbContext,
    ILogger<SecurityGroupService> logger,
    ILocalizationService localizationService,
    IClaimsService claimsService)
    : ISecurityGroupService
{
    public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetSecurityGroupsDictionary()
    {
        try
        {
            var result = await dbContext.SecurityGroups.Select(x => new CommonDictionaryModel
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .ToListAsync();

            return new OperationDataResult<List<CommonDictionaryModel>>(true, result);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<List<CommonDictionaryModel>>(false,
                localizationService.GetString("ErrorWhileObtainingSecurityGroups"));
        }
    }

    public async Task<OperationDataResult<Paged<SecurityGroupModel>>> GetSecurityGroups(
        SecurityGroupRequestModel requestModel)
    {
        try
        {
            var securityGroupsModel = new Paged<SecurityGroupModel>();
            var securityGroupsQuery = dbContext.SecurityGroups
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .AsQueryable();

            if (!string.IsNullOrEmpty(requestModel.NameFilter))
            {
                securityGroupsQuery = securityGroupsQuery.Where(x => x.Name.Contains(requestModel.NameFilter));
            }

            securityGroupsModel.Total = await securityGroupsQuery.Select(x => x.Id).CountAsync();

            var securityGroupsQueryWithSelect = AddSelectToQuery(securityGroupsQuery);

            if (!string.IsNullOrEmpty(requestModel.Sort))
            {
                if (requestModel.IsSortDsc)
                {
                    securityGroupsQueryWithSelect = securityGroupsQueryWithSelect
                        .CustomOrderByDescending(requestModel.Sort);
                }
                else
                {
                    securityGroupsQueryWithSelect = securityGroupsQueryWithSelect
                        .CustomOrderBy(requestModel.Sort);
                }
            }
            else
            {
                securityGroupsQueryWithSelect = securityGroupsQueryWithSelect
                    .OrderBy(x => x.Id);
            }

            securityGroupsQueryWithSelect = securityGroupsQueryWithSelect
                .Skip(requestModel.Offset)
                .Take(requestModel.PageSize);

            var securityGroupList = await securityGroupsQueryWithSelect.ToListAsync();
            securityGroupsModel.Entities = securityGroupList;
            return new OperationDataResult<Paged<SecurityGroupModel>>(true, securityGroupsModel);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<Paged<SecurityGroupModel>>(false,
                localizationService.GetString("ErrorWhileObtainingSecurityGroups"));
        }
    }

    public async Task<OperationDataResult<SecurityGroupModel>> GetSecurityGroup(int id)
    {
        try
        {
            var query = dbContext.SecurityGroups
                .Where(x => x.Id == id)
                .AsQueryable();


            var securityGroupModel = await AddSelectToQuery(query).FirstOrDefaultAsync();
            if (securityGroupModel == null)
            {
                return new OperationDataResult<SecurityGroupModel>(false,
                    localizationService.GetString("SecurityGroupNotFound"));
            }

            return new OperationDataResult<SecurityGroupModel>(true, securityGroupModel);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<SecurityGroupModel>(false,
                localizationService.GetString("ErrorWhileObtainingSecurityGroup"));
        }
    }

    public async Task<OperationResult> CreateSecurityGroup(SecurityGroupCreateModel requestModel)
    {
        try
        {
            if (string.IsNullOrEmpty(requestModel.Name))
            {
                return new OperationResult(false,
                    localizationService.GetString("SecurityGroupNameIsEmpty"));
            }

            //using (var transaction = await _dbContext.Database.BeginTransactionAsync())
//                {
            var securityGroup = new SecurityGroup
            {
                Name = requestModel.Name
            };
            foreach (var userId in requestModel.UserIds)
            {
                securityGroup.SecurityGroupUsers.Add(new SecurityGroupUser()
                {
                    EformUserId = userId
                });
            }

            await dbContext.SecurityGroups.AddAsync(securityGroup);
            await dbContext.SaveChangesAsync();

            // Update claims in store
            await claimsService.UpdateAuthenticatedUsers(new List<int> { securityGroup.Id });

            //transaction.Commit();
//                }

            return new OperationResult(true,
                localizationService.GetString("SecurityGroupCreatedSuccessfully"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetString("ErrorWhileCreatingSecurityGroup"));
        }
    }

    public async Task<OperationResult> UpdateSecurityGroup(SecurityGroupUpdateModel requestModel)
    {
        try
        {
            //using (var transaction = await _dbContext.Database.BeginTransactionAsync())
//                {
            var securityGroup = await dbContext.SecurityGroups
                .Include(x => x.SecurityGroupUsers)
                .FirstOrDefaultAsync(x => x.Id == requestModel.Id);

            if (securityGroup == null)
            {
                //transaction.Rollback();
                return new OperationResult(false,
                    localizationService.GetString("SecurityGroupNotFound"));
            }

            securityGroup.Name = requestModel.Name;
            // delete old
            var usersForDelete = dbContext.SecurityGroupUsers
                .Where(x => x.SecurityGroupId == requestModel.Id
                            && !requestModel.UserIds.Contains(x.EformUserId));
            dbContext.SecurityGroupUsers.RemoveRange(usersForDelete);
            // add new
            foreach (var userId in requestModel.UserIds)
            {
                if (securityGroup.SecurityGroupUsers.All(x => x.EformUserId != userId))
                {
                    securityGroup.SecurityGroupUsers.Add(new SecurityGroupUser()
                    {
                        EformUserId = userId,
                        SecurityGroupId = requestModel.Id
                    });
                }
            }

            dbContext.SecurityGroups.Update(securityGroup);
            await dbContext.SaveChangesAsync();

            // Update claims in store
            await claimsService.UpdateAuthenticatedUsers(new List<int> { requestModel.Id });

            //transaction.Commit();
//                }

            return new OperationResult(true,
                localizationService.GetString("SecurityGroupUpdatedSuccessfully"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetString("ErrorWhileUpdatingSecurityGroup"));
        }
    }

    public async Task<OperationResult> UpdateSecurityGroupSettings(SecurityGroupSettingsUpdateModel requestModel)
    {
        try
        {
            var securityGroup = await dbContext.SecurityGroups
                .FirstOrDefaultAsync(x => x.Id == requestModel.Id);

            if (securityGroup == null)
            {
                return new OperationResult(false,
                    localizationService.GetString("SecurityGroupNotFound"));
            }

            securityGroup.RedirectLink = requestModel.RedirectLink;

            dbContext.SecurityGroups.Update(securityGroup);
            await dbContext.SaveChangesAsync();

            return new OperationResult(true,
                localizationService.GetString("SecurityGroupUpdatedSuccessfully"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetString("ErrorWhileUpdatingSecurityGroup"));
        }
    }

    public async Task<OperationResult> DeleteSecurityGroup(int id)
    {
        //using (var transaction = await _dbContext.Database.BeginTransactionAsync())
//                {
        try
        {
            var securityGroup = await dbContext.SecurityGroups.FirstOrDefaultAsync(x => x.Id == id);
            if (securityGroup == null)
            {
                //transaction.Rollback();
                return new OperationResult(false,
                    localizationService.GetString("SecurityGroupNotFound"));
            }
            dbContext.SecurityGroups.Remove(securityGroup);
            await dbContext.SaveChangesAsync();

            // Update claims in store
            await claimsService.UpdateAuthenticatedUsers(new List<int> {id});

            //transaction.Commit();
            return new OperationResult(true,
                localizationService.GetString("SecurityGroupRemovedSuccessfully"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<SecurityGroupModel>(false,
                localizationService.GetString("ErrorWhileDeletingSecurityGroup"));
        }
        //}
    }

    private static IQueryable<SecurityGroupModel> AddSelectToQuery(IQueryable<SecurityGroup> query)
    {
        return query
            .Select(x => new SecurityGroupModel()
            {
                Id = x.Id,
                GroupName = x.Name,
                RedirectLink = x.RedirectLink,
                UserAmount = x.SecurityGroupUsers.Count,
                UsersList = x.SecurityGroupUsers.Select(u => new SecurityGroupUserModel()
                {
                    Id = u.EformUser.Id,
                    FirstName = u.EformUser.FirstName,
                    LastName = u.EformUser.LastName,
                    Email = u.EformUser.Email
                }).ToList()
            });
    }
}