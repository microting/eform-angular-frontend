using System;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Models.Permissions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services.Security
{
    public class SecurityGroupService : ISecurityGroupService
    {
        private readonly ILogger<SecurityGroupService> _logger;
        private readonly BaseDbContext _dbContext;

        public SecurityGroupService(BaseDbContext dbContext,
            ILogger<SecurityGroupService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<OperationDataResult<SecurityGroupsModel>> GetSecurityGroups(
            SecurityGroupRequestModel requestModel)
        {
            try
            {
                var securityGroupsModel = new SecurityGroupsModel();
                var securityGroupsQuery = _dbContext.SecurityGroups.AsQueryable();
                if (!string.IsNullOrEmpty(requestModel.Sort))
                {
                    if (requestModel.IsSortDsc)
                    {
                        securityGroupsQuery = securityGroupsQuery
                            .CustomOrderByDescending(requestModel.Sort);
                    }
                    else
                    {
                        securityGroupsQuery = securityGroupsQuery
                            .CustomOrderBy(requestModel.Sort);
                    }
                }
                else
                {
                    securityGroupsQuery = _dbContext.SecurityGroups
                        .OrderBy(x => x.Id);
                }

                if (!string.IsNullOrEmpty(requestModel.NameFilter))
                {
                    securityGroupsQuery = securityGroupsQuery.Where(x => x.Name.Contains(requestModel.NameFilter));
                }

                securityGroupsQuery = securityGroupsQuery
                    .Skip(requestModel.Offset)
                    .Take(requestModel.PageSize);

                var securityGroupList = await securityGroupsQuery.Select(x => new SecurityGroupModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    UserAmount = x.SecurityGroupUsers.Count,
                    UsersList = x.SecurityGroupUsers.Select(u => new SecurityGroupUserModel()
                    {
                        Id = u.EformUser.Id,
                        FirstName = u.EformUser.FirstName,
                        LastName = u.EformUser.LastName,
                        Email = u.EformUser.Email,
                    }).ToList()
                }).ToListAsync();
                securityGroupsModel.Total = await _dbContext.SecurityGroups.CountAsync();
                securityGroupsModel.SecurityGroupList = securityGroupList;
                return new OperationDataResult<SecurityGroupsModel>(true, securityGroupsModel);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<SecurityGroupsModel>(false, "Error while obtaining security groups");
            }
        }

        public async Task<OperationDataResult<SecurityGroupModel>> GetSecurityGroup(int id)
        {
            try
            {
                var securityGroupModel = await _dbContext.SecurityGroups
                    .Where(x => x.Id == id)
                    .Select(x => new SecurityGroupModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        UserAmount = x.SecurityGroupUsers.Count,
                        UsersList = x.SecurityGroupUsers.Select(u => new SecurityGroupUserModel()
                        {
                            Id = u.EformUser.Id,
                            FirstName = u.EformUser.FirstName,
                            LastName = u.EformUser.LastName,
                            Email = u.EformUser.Email,
                        }).ToList()
                    }).FirstOrDefaultAsync();
                if (securityGroupModel == null)
                {
                    return new OperationDataResult<SecurityGroupModel>(false, "Security group not found");
                }

                return new OperationDataResult<SecurityGroupModel>(true, securityGroupModel);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<SecurityGroupModel>(false, "Error while obtaining security group");
            }
        }

        public async Task<OperationResult> CreateSecurityGroup(SecurityGroupCreateModel requestModel)
        {
            try
            {
                if (string.IsNullOrEmpty(requestModel.Name))
                {
                    return new OperationDataResult<SecurityGroupsModel>(false, "Security group name is empty");
                }

                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    var securityGroup = new SecurityGroup
                    {
                        Name = requestModel.Name,
                    };
                    foreach (var userId in requestModel.UserIds)
                    {
                        securityGroup.SecurityGroupUsers.Add(new SecurityGroupUser()
                        {
                            EformUserId = userId,
                        });
                    }

                    await _dbContext.SecurityGroups.AddAsync(securityGroup);
                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                }

                return new OperationResult(true, "Security group created successfully");
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<SecurityGroupsModel>(false, "Error while creating security group");
            }
        }

        public async Task<OperationResult> UpdateSecurityGroup(SecurityGroupUpdateModel requestModel)
        {
            try
            {
                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    var securityGroup = await _dbContext.SecurityGroups
                        .Include(x => x.SecurityGroupUsers)
                        .FirstOrDefaultAsync(x => x.Id == requestModel.Id);

                    if (securityGroup == null)
                    {
                        transaction.Rollback();
                        return new OperationDataResult<SecurityGroupsModel>(false,
                            "Security group not found");
                    }

                    securityGroup.Name = requestModel.Name;
                    // delete old
                    var usersForDelete = _dbContext.SecurityGroupUsers
                        .Where(x => x.SecurityGroupId == requestModel.Id
                                    && !requestModel.UserIds.Contains(x.EformUserId));
                    _dbContext.SecurityGroupUsers.RemoveRange(usersForDelete);
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

                    _dbContext.SecurityGroups.Update(securityGroup);
                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                }

                return new OperationResult(true, "Security group updated successfully");
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<SecurityGroupsModel>(false, "Error while updating security group");
            }
        }


        public async Task<OperationResult> DeleteSecurityGroup(int id)
        {
            try
            {
                var securityGroup = await _dbContext.SecurityGroups.FirstOrDefaultAsync(x => x.Id == id);
                if (securityGroup == null)
                {
                    return new OperationResult(false, "Security group not found");
                }

                _dbContext.SecurityGroups.Remove(securityGroup);
                await _dbContext.SaveChangesAsync();
                return new OperationResult(true, "Security group removed successfully");
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<SecurityGroupModel>(false, "Error while deleting security group");
            }
        }
    }

}