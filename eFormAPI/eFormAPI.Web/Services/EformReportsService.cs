using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
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


        public async Task<OperationDataResult<EformReportFullModel>> GetEformReport(int templateId)
        {
            try
            {
                var result = new EformReportFullModel();
                var core = _coreHelper.GetCore();
                var template = core.TemplateRead(templateId);
                if (template == null)
                {
                    return new OperationDataResult<EformReportFullModel>(false,
                        _localizationService.GetString(""));
                }
                result.EformMainElement = template;

                var eformReport = await _dbContext.EformReports
                    .Where(x=>x.TemplateId == templateId)
                    .Select(x => new EformReportModel()
                    {
                        Id = x.Id,
                        TemplateId = x.TemplateId,
                        HeaderImage = Encoding.UTF8.GetString(x.HeaderImage),
                        HeaderVisibility = x.HeaderVisibility,
                        IsDateVisible = x.IsDateVisible,
                        IsWorkerNameVisible = x.IsWorkerNameVisible,
                    }).FirstOrDefaultAsync();
                
                if (eformReport == null)
                {
                    return new OperationDataResult<EformReportFullModel>(true, result);
                }
                var reportElements = await _dbContext.EformReportElements
                    .Where(x => x.EformReportId == eformReport.Id)
                    .ToListAsync();

                //Func<List<> >

                var reportElementsOrdered = reportElements
                    .Where(p => p.Parent == null)
                    .OrderBy(p => p.Position)
                    .Select(p => new EformReportElementsModel()
                        {
                            Id = p.Id,
                            ElementId = p.ElementId,
                            Position = p.Position,
                            Visibility = p.Visibility,
                            NestedElements = reportElements
                                .Where(c => c.ParentId == p.Id)
                                .OrderBy(c => c.Position)
                                .Select(x => new EformReportElementsModel()
                                {
                                    Id = p.Id,
                                    ElementId = p.ElementId,
                                    Position = p.Position,
                                    Visibility = p.Visibility,
                                }).ToList()
                        }
                    ).ToList();
                eformReport.Elements = reportElementsOrdered;
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