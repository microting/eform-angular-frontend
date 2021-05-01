

namespace WorkOrders.Pn.Services
{
    using System;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Models;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.WorkOrderBase.Infrastructure.Data;
    using Microting.WorkOrderBase.Infrastructure.Data.Entities;

    public class WorkOrdersService : IWorkOrdersService
    {
        private readonly ILogger<WorkOrdersService> _logger;
        private readonly WorkOrderPnDbContext _dbContext;
        private readonly IWorkOrdersLocalizationService _workOrdersLocalizationService;
        private readonly IEFormCoreService _coreService;
        private readonly IUserService _userService;

        public WorkOrdersService(
            WorkOrderPnDbContext dbContext,
            IWorkOrdersLocalizationService workOrdersLocalizationService,
            ILogger<WorkOrdersService> logger,
            IEFormCoreService coreService,
            IUserService userService)
        {
            _dbContext = dbContext;
            _workOrdersLocalizationService = workOrdersLocalizationService;
            _logger = logger;
            _coreService = coreService;
            _userService = userService;
        }

        public async Task<OperationDataResult<WorkOrdersModel>> GetWorkOrdersAsync(WorkOrdersRequestModel pnRequestModel)
        {
            try
            {
                var core = await _coreService.GetCore();
                var sites = await core.Advanced_SiteItemReadAll(false);
                var workOrdersModel = new WorkOrdersModel();
                var workOrdersQuery = _dbContext.WorkOrders
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .AsQueryable();

                // add serch
                if(!string.IsNullOrEmpty(pnRequestModel.SearchString))
                {
                    workOrdersQuery = workOrdersQuery.Where(x =>
                        x.Description.ToLower().Contains(pnRequestModel.SearchString.ToLower()) ||
                        x.DescriptionOfTaskDone.ToLower().Contains(pnRequestModel.SearchString.ToLower()));
                }

                // sort
                if (!string.IsNullOrEmpty(pnRequestModel.Sort))
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        workOrdersQuery = workOrdersQuery.CustomOrderByDescending(pnRequestModel.Sort);
                    }
                    else
                    {
                        workOrdersQuery = workOrdersQuery.CustomOrderBy(pnRequestModel.Sort);
                    }
                }
                else
                {
                    workOrdersQuery = _dbContext.WorkOrders.OrderBy(x => x.Id);
                }

                // pagination
                workOrdersQuery = workOrdersQuery
                                    .Skip(pnRequestModel.Offset)
                                    .Take(pnRequestModel.PageSize);
                
                // add select
                var workOrderList = await AddSelectToQuery(workOrdersQuery).Result.ToListAsync();

                foreach (var workOrderModel in workOrderList)
                {
                    workOrderModel.CreatedBy = sites
                        .Where(x => x.SiteUId == workOrderModel.CreatedByUserId)
                        .Select(x => x.SiteName)
                        .FirstOrDefault();

                    workOrderModel.DoneBy = sites
                        .Where(x => x.SiteUId == workOrderModel.DoneBySiteId)
                        .Select(x => x.SiteName)
                        .FirstOrDefault();
                }

                workOrdersModel.Total = await _dbContext.WorkOrders.CountAsync(x =>
                            x.WorkflowState != Constants.WorkflowStates.Removed);
                workOrdersModel.WorkOrders = workOrderList;

                return new OperationDataResult<WorkOrdersModel>(true, workOrdersModel);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<WorkOrdersModel>(false,
                    _workOrdersLocalizationService.GetString("ErrorWhileObtainingWorkOrders"));
            }
        }

        public async Task<OperationResult> Delete(int id)
        {
            var core = await _coreService.GetCore();
            var workOrder = await _dbContext.WorkOrders.SingleOrDefaultAsync(x => x.Id == id);
            if (workOrder != null)
            {
                if (workOrder.DoneAt == null)
                {
                    var wotListToDelete = await _dbContext.WorkOrdersTemplateCases.Where(x =>
                        x.WorkOrderId == workOrder.Id).ToListAsync();

                    foreach(var wotToDelete in wotListToDelete)
                    {
                        await core.CaseDelete(wotToDelete.CaseId);
                        wotToDelete.WorkflowState = Constants.WorkflowStates.Retracted;
                        await wotToDelete.Update(_dbContext);
                    }
                }
                await workOrder.Delete(_dbContext);
                return new OperationResult(true);
            }

            return new OperationDataResult<WorkOrdersModel>(false,
                _workOrdersLocalizationService.GetString("ErrorWhileObtainingWorkOrders"));
        }

        private async Task<IQueryable<WorkOrderModel>> AddSelectToQuery(IQueryable<WorkOrder> query)
        {
            var timeZoneInfo = await _userService.GetCurrentUserTimeZoneInfo();

            return query.Select(x => new WorkOrderModel
            {
                Id = x.Id,
                CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(x.CreatedAt, timeZoneInfo),
                CreatedByUserId = x.CreatedByUserId,
                Description = x.Description,
                CorrectedAtLatest = x.CorrectedAtLatest,
                DoneAt = x.DoneAt != null
                    ? TimeZoneInfo.ConvertTimeFromUtc((DateTime) x.DoneAt, timeZoneInfo)
                    : (DateTime?) null,
                DoneBySiteId = x.DoneBySiteId,
                DescriptionOfTaskDone = x.DescriptionOfTaskDone,
                AssignedArea = x.AssignedArea,
                AssignedWorker = x.AssignedWorker,
                PicturesOfTask = x.PicturesOfTasks
                    .Select(y => y.FileName)
                    .ToList(),
                PicturesOfTaskDone = x.PicturesOfTaskDone
                    .Select(y => y.FileName)
                    .ToList(),
            });
        }
    }
}
