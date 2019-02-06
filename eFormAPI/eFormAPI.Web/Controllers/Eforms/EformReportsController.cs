using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Models.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eFormAPI.Web.Controllers.Eforms
{
    [Authorize]
    public class EformReportsController : Controller
    {
        private readonly IEformReportsService _eformReportsService;
        private readonly IEformPermissionsService _permissionsService;

        public EformReportsController(IEformReportsService eformReportsService,
            IEformPermissionsService permissionsService)
        {
            _eformReportsService = eformReportsService;
            _permissionsService = permissionsService;
        }

        [HttpGet]
        [Route("api/templates/{templateId}/report")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.ReadJasperReport)]
        public async Task<IActionResult> GetEformReport(int templateId)
        {
            if (!await _permissionsService.CheckEform(templateId,
                AuthConsts.EformClaims.EformsClaims.ReadJasperReport))
            {
                return Forbid();
            }

            return Ok(await _eformReportsService.GetEformReport(templateId));
        }

        [HttpPut]
        [Route("api/templates/report")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateJasperReport)]
        public async Task<IActionResult> UpdateEformReport([FromBody] EformReportFullModel eformReportModel)
        {
            if (!await _permissionsService.CheckEform(eformReportModel.EformReport.TemplateId,
                AuthConsts.EformClaims.EformsClaims.UpdateJasperReport))
            {
                return Forbid();
            }

            return Ok(await _eformReportsService.UpdateEformReport(eformReportModel));
        }
    }
}