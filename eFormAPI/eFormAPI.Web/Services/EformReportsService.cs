using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Castle.MicroKernel.Registration;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Models.Reports;
using eFormData;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
    public class EformReportsService : IEformReportsService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;
        private readonly BaseDbContext _dbContext;
        private readonly ILogger<EformReportsService> _logger;

        public EformReportsService(
            IEFormCoreService coreHelper,
            ILocalizationService localizationService,
            BaseDbContext dbContext,
            ILogger<EformReportsService> logger)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
            _dbContext = dbContext;
            _logger = logger;
        }

        private static List<EformReportElementsModel> GetReportElementsList(EformReportElement parent)
        {
            return parent.NestedElements
                .Where(c => c.ParentId == parent.Id)
                .Select(x => new EformReportElementsModel()
                {
                    Id = x.Id,
                    ElementId = x.ElementId,
                    ElementList = GetReportElementsList(x),
                    DataItemList = GetReportDataItemListFromElement(x),
                }).ToList();
        }

        private static List<EformReportDataItemModel> GetReportDataItemList(EformReportDataItem parent)
        {
            var list = parent.NestedDataItems
                .Where(c => c.ParentId == parent.Id)
                .OrderBy(c => c.Position)
                .Select(x => new EformReportDataItemModel()
                {
                    Id = x.Id,
                    DataItemId = x.DataItemId,
                    Position = x.Position,
                    Visibility = x.Visibility,
                    DataItemList = GetReportDataItemList(x),
                }).ToList();

            return list;
        }


        private static List<EformReportDataItemModel> GetReportDataItemListFromElement(EformReportElement parent)
        {
            var list = parent.DataItems
                .Where(c => c.ParentId == parent.Id)
                .OrderBy(c => c.Position)
                .Select(x => new EformReportDataItemModel()
                {
                    Id = x.Id,
                    DataItemId = x.DataItemId,
                    Position = x.Position,
                    Visibility = x.Visibility,
                    DataItemList = GetReportDataItemList(x)
                }).ToList();

            return list;
        }


        public async Task<OperationDataResult<EformReportFullModel>> GetEformReport(int templateId)
        {
            try
            {
                var result = new EformReportFullModel();
                var core = _coreHelper.GetCore();
                MainElement template = core.TemplateRead(templateId);
                if (template == null)
                {
                    return new OperationDataResult<EformReportFullModel>(false,
                        _localizationService.GetString(""));
                }

                //          result.EformMainElement = template;

                var eformReport = await _dbContext.EformReports
                    .Where(x => x.TemplateId == templateId)
                    .Select(x => new EformReportModel()
                    {
                        Id = x.Id,
                        TemplateId = x.TemplateId,
                        Description = x.Description,
                        HeaderImage = x.HeaderImage == null ? string.Empty : Encoding.UTF8.GetString(x.HeaderImage),
                        HeaderVisibility = x.HeaderVisibility,
                        IsDateVisible = x.IsDateVisible,
                        IsWorkerNameVisible = x.IsWorkerNameVisible,
                    }).FirstOrDefaultAsync();

                if (eformReport == null)
                {
                    return new OperationDataResult<EformReportFullModel>(true, result);
                }

                var reportElements = await _dbContext.EformReportElements
                    .Include(x=>x.DataItems)
                    .ThenInclude(x=>x.NestedDataItems)
                    .Include(x=>x.NestedElements)
                    .ThenInclude(x=>x.DataItems)
                    .ThenInclude(x=>x.NestedDataItems)
                    .Where(x => x.EformReportId == eformReport.Id)
                    .ToListAsync();
                

                var reportElementsOrdered = reportElements
                    .Where(p => p.Parent == null)
                    .OrderBy(p => p.Id)
                    .Select(p => new EformReportElementsModel()
                        {
                            Id = p.Id,
                            ElementId = p.ElementId,
                            ElementList = GetReportElementsList(p),
                            DataItemList = GetReportDataItemListFromElement(p),
                        }
                    ).ToList();

                if (reportElementsOrdered.Any())
                {
                    result.EformMainElement = new EformMainElement()
                    {
                        ElementList = reportElementsOrdered
                    };
                }
                result.EformReport = eformReport;
                return new OperationDataResult<EformReportFullModel>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogCritical(e, e.Message);
                return new OperationDataResult<EformReportFullModel>(false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> UpdateEformReport(EformReportModel requestModel)
        {
            try
            {
                var result = new EformReportFullModel();
                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    transaction.Commit();
                }

                return new OperationDataResult<EformReportFullModel>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogCritical(e, e.Message);
                return new OperationDataResult<EformReportFullModel>(false,
                    _localizationService.GetString(""));
            }
        }
    }
}