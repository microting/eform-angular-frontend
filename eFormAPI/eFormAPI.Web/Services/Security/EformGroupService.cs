using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Models.EformPermissions;
using eFormAPI.Web.Infrastructure.Models.Templates;
using eFormCore;
using eFormShared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services.Security
{
    public class EformGroupService : IEformGroupService
    {
        private readonly ILogger<EformGroupService> _logger;
        private readonly BaseDbContext _dbContext;
        private readonly IUserService _userService;
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;

        public EformGroupService(ILogger<EformGroupService> logger,
            BaseDbContext dbContext,
            ILocalizationService localizationService,
            IEFormCoreService coreHelper, IUserService userService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _localizationService = localizationService;
            _coreHelper = coreHelper;
            _userService = userService;
        }

        public async Task<OperationDataResult<TemplateListModel>> GetAvailableEforms(
            TemplateRequestModel templateRequestModel,
            int groupId)
        {
            try
            {
                TemplateListModel result = new TemplateListModel
                {
                    Templates = new List<Template_Dto>()
                };
                Core core = _coreHelper.GetCore();
                List<Template_Dto> templatesDto = core.TemplateItemReadAll(false,
                    "",
                    templateRequestModel.NameFilter,
                    templateRequestModel.IsSortDsc,
                    templateRequestModel.Sort,
                    templateRequestModel.TagIds);

                List<int> eformsInGroup = await _dbContext.EformInGroups
                    .Where(x => x.SecurityGroupId == groupId)
                    .Select(x => x.TemplateId)
                    .ToListAsync();

                if (templatesDto.Any())
                {
                    foreach (Template_Dto templateDto in templatesDto)
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
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationDataResult<TemplateListModel>(false,
                    _localizationService.GetString("ErrorWhileObtainingAvailableEForms"));
            }
        }

        public async Task<OperationResult> AddEformToGroup(EformBindGroupModel requestModel)
        {
            try
            {
                if (!await _dbContext.SecurityGroups.AnyAsync(x => x.Id == requestModel.GroupId))
                {
                    return new OperationResult(false, _localizationService.GetString("SecurityGroupNotFound"));
                }

                if (await _dbContext.EformInGroups.AnyAsync(x => x.TemplateId == requestModel.EformId
                                                                 && x.SecurityGroupId == requestModel.GroupId))
                {
                    return new OperationResult(false, _localizationService.GetString("eFormAlreadyInGroup"));
                }

                EformInGroup newEformInGroup = new EformInGroup()
                {
                    SecurityGroupId = requestModel.GroupId,
                    TemplateId = requestModel.EformId
                };
                await _dbContext.EformInGroups.AddAsync(newEformInGroup);
                await _dbContext.SaveChangesAsync();
                return new OperationResult(true);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationResult(true,
                    _localizationService.GetString("ErrorWhileBindingEformToGroup"));
            }
        }

        public async Task<OperationDataResult<EformsPermissionsModel>> GetGroupEforms(int groupId)
        {
            try
            {
                EformsPermissionsModel result = new EformsPermissionsModel();
                string[] eformClaims = new[]
                {
                    AuthConsts.EformClaims.EformsClaims.UpdateColumns,
                    AuthConsts.EformClaims.EformsClaims.DownloadXml,
                    AuthConsts.EformClaims.EformsClaims.UploadZip,
                    AuthConsts.EformClaims.CasesClaims.CasesRead,
                    AuthConsts.EformClaims.CasesClaims.CaseRead,
                    AuthConsts.EformClaims.CasesClaims.CaseUpdate,
                    AuthConsts.EformClaims.CasesClaims.CaseDelete,
                    AuthConsts.EformClaims.CasesClaims.CaseGetPdf,
                    AuthConsts.EformClaims.EformsClaims.PairingUpdate,
                    AuthConsts.EformClaims.EformsClaims.UpdateTags,
                    AuthConsts.EformClaims.EformsClaims.GetCsv
                };
                List<EformPermissionsModel> eformsInGroup = await _dbContext.EformInGroups
                    .Where(x => x.SecurityGroupId == groupId)
                    .Select(e => new EformPermissionsModel()
                    {
                        GroupName = e.SecurityGroup.Name,
                        EformInGroupId = e.Id,
                        TemplateId = e.TemplateId,
                        Permissions = _dbContext.Permissions
                            .Where(x => eformClaims.Contains(x.ClaimName))
                            .Select(x => new EformPermissionModel()
                            {
                                Id = x.Id,
                                EformPermissionId = e.EformPermissions
                                    .Where(w => w.EformInGroupId == e.Id
                                                && w.PermissionId == x.Id)
                                    .Select(w => w.Id)
                                    .FirstOrDefault(),
                                ClaimName = x.ClaimName,
                                PermissionName = x.PermissionName,
                                PermissionType = x.PermissionType.Name,
                                PermissionTypeId = x.PermissionTypeId,
                                IsEnabled = _dbContext.EformPermissions.Any(g =>
                                    g.EformInGroup.SecurityGroupId == groupId
                                    && g.PermissionId == x.Id && g.EformInGroupId == e.Id)
                            }).ToList()
                    })
                    .ToListAsync();
                Core core = _coreHelper.GetCore();
                List<Template_Dto> templatesDto = core.TemplateItemReadAll(false);
                foreach (EformPermissionsModel eformInGroups in eformsInGroup)
                {
                    Template_Dto template = templatesDto.FirstOrDefault(x => x.Id == eformInGroups.TemplateId);
                    if (template != null)
                    {
                        eformInGroups.Label = template.Label;
                        eformInGroups.CreatedAt = template.CreatedAt;
                    }
                }

                foreach (EformPermissionsModel eformInGroup in eformsInGroup)
                {
                    List<EformPermissionTypeModel> permissionTypes = eformInGroup.Permissions
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
                    result.GroupName = _dbContext.SecurityGroups
                        .Where(x => x.Id == groupId)
                        .Select(x => x.Name)
                        .FirstOrDefault();
                }

                result.GroupId = groupId;
                result.EformsList = eformsInGroup;
                result.Total = _dbContext.EformInGroups
                    .Where(x => x.SecurityGroupId == groupId)
                    .Select(x => x.Id)
                    .Count();

                return new OperationDataResult<EformsPermissionsModel>(true, result);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationDataResult<EformsPermissionsModel>(false,
                    _localizationService.GetString("ErrorWhileObtainingEformInfo"));
            }
        }


        public async Task<OperationDataResult<List<EformPermissionsSimpleModel>>> GetEformSimpleInfo()
        {
            try
            {
                List<EformPermissionsSimpleModel> result = await _dbContext.EformInGroups
                    .Where(x => x.SecurityGroup.SecurityGroupUsers.Any(y =>
                        y.EformUserId == _userService.UserId))
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
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationDataResult<List<EformPermissionsSimpleModel>>(false,
                    _localizationService.GetString("ErrorWhileObtainingEformInfo"));
            }
        }

        public async Task<OperationResult> UpdateGroupEformPermissions(EformPermissionsModel requestModel)
        {
            try
            {
                requestModel.Permissions.Clear();
                foreach (EformPermissionTypeModel permissionType in requestModel.PermissionTypes)
                {
                    foreach (EformPermissionModel permission in permissionType.Permissions)
                    {
                        requestModel.Permissions.Add(permission);
                    }
                }
                
                using (IDbContextTransaction transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    List<int> enabledEformPermission = new List<int>();
                    foreach (EformPermissionModel eformPermission in requestModel.Permissions)
                    {
                        if (eformPermission.IsEnabled)
                        {
                            enabledEformPermission.Add(eformPermission.EformPermissionId);
                        }
                    }

                    // for delete
                    List<EformPermission> forDelete = _dbContext.EformPermissions
                        .Where(x => !enabledEformPermission.Contains(x.Id)
                                    && x.EformInGroupId == requestModel.EformInGroupId)
                        .ToList();

                    _dbContext.EformPermissions.RemoveRange(forDelete);
                    await _dbContext.SaveChangesAsync();

                    List<int> list = _dbContext.EformPermissions
                        .Where(x => x.EformInGroupId == requestModel.EformInGroupId)
                        .Where(x => enabledEformPermission.Contains(x.Id))
                        .Select(x => x.PermissionId)
                        .ToList();

                    List<int> enabledPermissions = new List<int>();
                    foreach (EformPermissionModel eformPermission in requestModel.Permissions)
                    {
                        if (eformPermission.IsEnabled)
                        {
                            enabledPermissions.Add(eformPermission.Id);
                        }
                    }

                    foreach (int permissionId in enabledPermissions)
                    {
                        if (!list.Contains(permissionId))
                        {
                            EformPermissionModel permissionModel = requestModel.Permissions.FirstOrDefault(x =>
                                x.Id == permissionId && x.IsEnabled);
                            if (permissionModel != null)
                            {
                                await _dbContext.EformPermissions.AddAsync(new EformPermission()
                                {
                                    EformInGroupId = requestModel.EformInGroupId,
                                    PermissionId = permissionModel.Id,
                                });
                            }
                        }
                    }

                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                }

                return new OperationResult(true, _localizationService.GetString("PermissionForEformHasBeenUpdated"));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationDataResult<EformsPermissionsModel>(false,
                    _localizationService.GetString("ErrorWhileObtainingEformInfo"));
            }
        }

        public async Task<OperationResult> DeleteEformFromGroup(int templateId, int groupId)
        {
            try
            {
                EformInGroup eformInGroup = await _dbContext.EformInGroups
                    .FirstOrDefaultAsync(x => x.TemplateId == templateId
                                              && x.SecurityGroupId == groupId);
                if (eformInGroup == null)
                {
                    return new OperationDataResult<EformsPermissionsModel>(false,
                        _localizationService.GetString("eFormNotFound"));
                }

                _dbContext.EformInGroups.Remove(eformInGroup);
                await _dbContext.SaveChangesAsync();
                return new OperationResult(true,
                    _localizationService.GetString("eFormHasBeenDeletedFromGroup"));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationDataResult<EformsPermissionsModel>(false,
                    _localizationService.GetString("ErrorWhileDeletingEformFromGroup"));
            }
        }
    }
}