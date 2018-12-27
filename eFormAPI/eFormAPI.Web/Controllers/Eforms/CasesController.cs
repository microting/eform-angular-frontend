using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Models.Cases.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eFormAPI.Web.Controllers.Eforms
{
    [Authorize]
    public class CasesController : Controller
    {
        private readonly ICasesService _casesService;
        private readonly IEformPermissionsService _permissionsService;

        public CasesController(ICasesService casesService,
            IEformPermissionsService permissionsService)
        {
            _casesService = casesService;
            _permissionsService = permissionsService;
        }

        [HttpPost]
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CasesRead)]
        public async Task<IActionResult> Index([FromBody] CaseRequestModel requestModel)
        {
            if (requestModel.TemplateId != null
                && ! await _permissionsService.CheckEform((int) requestModel.TemplateId,
                    AuthConsts.EformClaims.CasesClaims.CasesRead))
            {
                return Forbid();
            }

            return Ok(_casesService.Index(requestModel));
        }

        [HttpGet]
        [Route("api/cases/getcase")]
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseRead)]
        public async Task<IActionResult> GetCase(int id, int templateId)
        {
            if (! await _permissionsService.CheckEform(templateId, 
                AuthConsts.EformClaims.CasesClaims.CaseRead))
            {
                return Forbid();
            }

            return Ok(_casesService.GetCase(id));
        }

        [HttpGet]
        [Route("/api/cases/delete")]
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseDelete)]
        public async Task<IActionResult> Delete(int id, int templateId)
        {
            if (! await _permissionsService.CheckEform(templateId,
                AuthConsts.EformClaims.CasesClaims.CaseDelete))
            {
                return Forbid();
            }

            return Ok(_casesService.Delete(id));
        }

        [HttpPost]
        [Route("/api/cases/update/{templateId}")]
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseUpdate)]
        public async Task<IActionResult> Update([FromBody] ReplyRequest model, int templateId)
        {
            if (!await _permissionsService.CheckEform(templateId,
                AuthConsts.EformClaims.CasesClaims.CaseUpdate))
            {
                return Forbid();
            }

            return Ok(_casesService.Update(model));
        }
    }
}