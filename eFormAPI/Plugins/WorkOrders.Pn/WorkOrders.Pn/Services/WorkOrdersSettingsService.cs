using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.WorkOrderBase.Infrastructure.Data;
using Microting.WorkOrderBase.Infrastructure.Data.Entities;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eForm.Infrastructure.Models;
using Rebus.Bus;
using WorkOrders.Pn.Abstractions;
using WorkOrders.Pn.Infrastructure.Models;
using WorkOrders.Pn.Infrastructure.Models.Settings;
using WorkOrders.Pn.Messages;

namespace WorkOrders.Pn.Services
{
    using Microting.eForm.Dto;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;

    public class WorkOrdersSettingsService : IWorkOrdersSettingsService
    {
        private readonly WorkOrderPnDbContext _dbContext;
        private readonly ILogger<WorkOrdersSettingsService> _logger;
        private readonly IWorkOrdersLocalizationService _workOrdersLocalizationService;
        private readonly IEFormCoreService _core;
        private readonly IPluginDbOptions<WorkOrdersBaseSettings> _options;
        private readonly IUserService _userService;
        private readonly IRebusService _rebusService;
        private readonly IBus _bus;

        public WorkOrdersSettingsService(WorkOrderPnDbContext dbContext,
            ILogger<WorkOrdersSettingsService> logger,
            IWorkOrdersLocalizationService workOrdersLocalizationService,
            IEFormCoreService core,
            IPluginDbOptions<WorkOrdersBaseSettings> options,
            IUserService userService,
            IRebusService rebusService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _workOrdersLocalizationService = workOrdersLocalizationService;
            _core = core;
            _options = options;
            _userService = userService;
            _rebusService = rebusService;
            _bus = rebusService.GetBus();
        }

        public async Task<OperationDataResult<WorkOrdersSettingsModel>> GetAllSettingsAsync()
        {
            try
            {
                List<int> assignedSitesIds = await _dbContext.AssignedSites.Where(y => y.WorkflowState != Constants.WorkflowStates.Removed).Select(x => x.SiteMicrotingUid).ToListAsync();
                WorkOrdersSettingsModel workOrdersSettings = new WorkOrdersSettingsModel()
                {
                    AssignedSites = new List<SiteNameModel>()
                };

                if (assignedSitesIds.Count > 0)
                {
                    List<SiteDto> allSites = await _core.GetCore().Result.SiteReadAll(false);

                    foreach (int id in assignedSitesIds)
                    {
                        SiteNameModel siteNameModel = allSites.Where(x => x.SiteId == id).Select(x => new SiteNameModel()
                        {
                            SiteName = x.SiteName,
                            SiteUId = x.SiteId
                        }).FirstOrDefault();
                        workOrdersSettings.AssignedSites.Add(siteNameModel);
                    }
                }

                var option = _options.Value;

                if (option.FolderId > 0)
                {
                    workOrdersSettings.FolderId = option.FolderId;
                }
                else
                {
                    workOrdersSettings.FolderId = null;
                }
                if (option.FolderTasksId > 0)
                {
                    workOrdersSettings.FolderTasksId = option.FolderTasksId;
                }
                else
                {
                    workOrdersSettings.FolderTasksId = null;
                }

                return new OperationDataResult<WorkOrdersSettingsModel>(true, workOrdersSettings);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<WorkOrdersSettingsModel>(false,
                    _workOrdersLocalizationService.GetString("ErrorWhileObtainingWorkOrdersSettings"));
            }
        }

        public async Task<OperationResult> AddSiteToSettingsAsync(int siteId)
        {
            var result = await _dbContext.PluginConfigurationValues.SingleAsync(x => x.Name == "WorkOrdersBaseSettings:NewTaskId");
            var folderResult = await _dbContext.PluginConfigurationValues.SingleAsync(x => x.Name == "WorkOrdersBaseSettings:FolderId");
            var theCore = await _core.GetCore();
            await using var sdkDbContext = theCore.DbContextHelper.GetDbContext();
            string folderId = sdkDbContext.Folders.Single(x => x.Id == int.Parse(folderResult.Value)).MicrotingUid.ToString();
            Site site = await sdkDbContext.Sites.SingleAsync(x => x.MicrotingUid == siteId);
            Language language = await sdkDbContext.Languages.SingleAsync(x => x.Id == site.LanguageId);
            MainElement mainElement = await theCore.ReadeForm(int.Parse(result.Value), language);
            switch (language.Name)
            {
                case "Danish":
                    mainElement.Label = "Ny opgave";
                    break;
                case "English":
                    mainElement.Label = "New task";
                    break;
                case "German":
                    mainElement.Label = "Neue Aufgabe";
                    break;
            }

            mainElement.CheckListFolderName = folderId;
            mainElement.EndDate = DateTime.UtcNow.AddYears(10);
            mainElement.Repeated = 0;
            mainElement.PushMessageTitle = mainElement.Label;

            //await using IDbContextTransaction transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                int? caseId = await theCore.CaseCreate(mainElement, "", siteId, int.Parse(folderResult.Value));
                AssignedSite assignedSite = new AssignedSite() { SiteMicrotingUid = siteId, CaseMicrotingUid = (int)caseId};

                await assignedSite.Create(_dbContext);
                //await transaction.CommitAsync();
                await _bus.SendLocal(new SiteAdded(siteId));
                return new OperationResult(true, _workOrdersLocalizationService.GetString("SiteAddedSuccessfully"));
            }
            catch (Exception e)
            {
                //await transaction.RollbackAsync();
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _workOrdersLocalizationService.GetString("ErrorWhileAddingSiteToSettings"));
            }
        }

        public async Task<OperationResult> UpdateFolder(int folderId)
        {
            try
            {
                if (folderId > 0)
                {
                    await _options.UpdateDb(settings =>
                        {
                            settings.FolderId = folderId;
                        },
                        _dbContext,
                        _userService.UserId);

                    return new OperationResult(
                        true,
                        _workOrdersLocalizationService.GetString("FolderUpdatedSuccessfully"));
                }

                throw new ArgumentException($"{nameof(folderId)} is 0");
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _workOrdersLocalizationService.GetString("ErrorWhileUpdatingFolder"));
            }
        }

        public async Task<OperationResult> UpdateTaskFolder(int folderId)
        {
            try
            {
                if (folderId > 0)
                {
                    await _options.UpdateDb(settings =>
                        {
                            settings.FolderTasksId = folderId;
                        },
                        _dbContext,
                        _userService.UserId);

                    return new OperationResult(
                        true,
                        _workOrdersLocalizationService.GetString("FolderUpdatedSuccessfully"));
                }

                throw new ArgumentException($"{nameof(folderId)} is 0");
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _workOrdersLocalizationService.GetString("ErrorWhileUpdatingFolder"));
            }
        }

        public async Task<OperationResult> RemoveSiteFromSettingsAsync(int siteId)
        {
            try
            {
                AssignedSite assignedSite = await _dbContext.AssignedSites.FirstOrDefaultAsync(x => x.SiteMicrotingUid == siteId
                        && x.WorkflowState != Constants.WorkflowStates.Removed);
                var theCore = await _core.GetCore();
                await theCore.CaseDelete((int)assignedSite.CaseMicrotingUid);
                await assignedSite.Delete(_dbContext);
                List<WorkOrdersTemplateCase> workOrdersTemplateCases = await _dbContext.WorkOrdersTemplateCases
                    .Where(x => x.SdkSiteMicrotingUid == siteId && x.WorkflowState != Constants.WorkflowStates.Removed)
                    .ToListAsync();

                foreach (WorkOrdersTemplateCase workOrdersTemplateCase in workOrdersTemplateCases)
                {
                    await theCore.CaseDelete(workOrdersTemplateCase.CaseId);
                    await workOrdersTemplateCase.Delete(_dbContext);
                }

                return new OperationResult(true,
                    _workOrdersLocalizationService.GetString("SiteDeletedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _workOrdersLocalizationService.GetString("ErrorWhileDeletingSiteFromSettings"));
            }
        }
    }
}
