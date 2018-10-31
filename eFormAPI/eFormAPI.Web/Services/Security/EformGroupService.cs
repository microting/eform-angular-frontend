using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Models.Permissions;
using eFormShared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Templates;

namespace eFormAPI.Web.Services.Security
{
    public class EformBindGroupModel
    {
        public int EformId { get; set; }
        public int GroupId { get; set; }
    }


    public class EformsPermissionsModel
    {
        public int Total { get; set; }

        public List<EformPermissionsModel> EformsList { get; set; }
            = new List<EformPermissionsModel>();
    }

    public class EformPermissionsModel
    {
        public int Id { get; set; }
        public string Label { get; set; }
        public DateTime? CreatedAt { get; set; }

        public List<PermissionModel> Permissions { get; set; }
            = new List<PermissionModel>();
    }

    public class EformGroupService : IEformGroupService
    {
        private readonly ILogger<EformGroupService> _logger;
        private readonly BaseDbContext _dbContext;
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;

        public EformGroupService(ILogger<EformGroupService> logger,
            BaseDbContext dbContext,
            ILocalizationService localizationService,
            IEFormCoreService coreHelper)
        {
            _logger = logger;
            _dbContext = dbContext;
            _localizationService = localizationService;
            _coreHelper = coreHelper;
        }

        public async Task<OperationDataResult<TemplateListModel>> GetAvailableEforms(
            TemplateRequestModel templateRequestModel,
            int groupId)
        {
            try
            {
                var result = new TemplateListModel
                {
                    Templates = new List<Template_Dto>()
                };
                var core = _coreHelper.GetCore();
                var templatesDto = core.TemplateItemReadAll(false,
                    "",
                    templateRequestModel.NameFilter,
                    templateRequestModel.IsSortDsc,
                    templateRequestModel.Sort,
                    templateRequestModel.TagIds);

                var eformsInGroup = await _dbContext.EformInGroups
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
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationDataResult<TemplateListModel>(false,
                    "Error while obtaining available eForms");
            }
        }

        public async Task<OperationResult> AddEformToGroup(EformBindGroupModel requestModel)
        {
            try
            {
                if (!await _dbContext.SecurityGroups.AnyAsync(x => x.Id == requestModel.GroupId))
                {
                    return new OperationResult(false, "Security group not found");
                }

                if (await _dbContext.EformInGroups.AnyAsync(x => x.TemplateId == requestModel.EformId
                                                                 && x.SecurityGroupId == requestModel.GroupId))
                {
                    return new OperationResult(false, "eForm already in group");
                }

                var newEformInGroup = new EformInGroup()
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
                return new OperationResult(true, "Error while binding eform to group");
            }
        }

        public async Task<OperationDataResult<EformsPermissionsModel>> GetGroupEforms(int groupId)
        {
            try
            {
                var result = new EformsPermissionsModel();

                var eformClaims = new[]
                {
                    AuthConsts.EformClaims.EformsClaims.UpdateColumns,
                    AuthConsts.EformClaims.EformsClaims.DownloadXml,
                    AuthConsts.EformClaims.EformsClaims.UploadZip,
                    AuthConsts.EformClaims.EformsClaims.CaseRead,
                    AuthConsts.EformClaims.EformsClaims.CasesRead,
                    AuthConsts.EformClaims.EformsClaims.CasesUpdate,
                    AuthConsts.EformClaims.EformsClaims.CasesDelete,
                    AuthConsts.EformClaims.EformsClaims.GetPdf,
                    AuthConsts.EformClaims.EformsClaims.PairingRead,
                    AuthConsts.EformClaims.EformsClaims.PairingUpdate,
                    AuthConsts.EformClaims.EformsClaims.ReadTags,
                    AuthConsts.EformClaims.EformsClaims.UpdateTags,
                    AuthConsts.EformClaims.EformsClaims.GetCsv
                };

                var eformsInGroup = await _dbContext.EformInGroups
                    .Where(x => x.SecurityGroupId == groupId)
                    .Select(e => new EformPermissionsModel()
                    {
                        Id = e.TemplateId,
                        Permissions = _dbContext.Permissions
                            .Where(x => eformClaims.Contains(x.ClaimName))
                            .Select(x => new PermissionModel()
                            {
                                Id = x.Id,
                                ClaimName = x.ClaimName,
                                PermissionName = x.PermissionName,
                                PermissionType = x.PermissionType.Name,
                                PermissionTypeId = x.PermissionTypeId,
                                IsEnabled = _dbContext.EformPermissions.Any(g =>
                                    g.EformInGroup.SecurityGroupId == groupId
                                    && g.PermissionId == x.Id)
                            }).ToList()
                    })
                    .ToListAsync();
                var core = _coreHelper.GetCore();
                var templatesDto = core.TemplateItemReadAll(false);
                foreach (var eformInGroups in eformsInGroup)
                {
                    var template = templatesDto.FirstOrDefault(x => x.Id == eformInGroups.Id);
                    if (template != null)
                    {
                        eformInGroups.Label = template.Label;
                        eformInGroups.CreatedAt = template.CreatedAt;
                    }
                }

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
                return new OperationDataResult<EformsPermissionsModel>(false,
                    "Error while obtaining eform info");
            }
        }
    }
}