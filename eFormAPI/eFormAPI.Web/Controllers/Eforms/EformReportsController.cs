using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Infrastructure.Models.Reports;
using eFormAPI.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers.Eforms
{
    [Authorize]
    public class EformReportsController : Controller
    {
        private readonly IEformReportsService _eformReportsService;

        public EformReportsController(IEformReportsService eformReportsService)
        {
            _eformReportsService = eformReportsService;
        }

        [HttpGet]
        [Route("api/templates/{templateId}/report")]
        public async Task<OperationDataResult<EformReportFullModel>> GetEformReport(int templateId)
        {
            return await _eformReportsService.GetEformReport(templateId);
        }

        [HttpPut]
        [Route("api/templates/report")]
        public async Task<OperationResult> UpdateEformReport([FromBody] EformReportFullModel eformReportModel)
        {
            return await _eformReportsService.UpdateEformReport(eformReportModel);
        }
    }
}