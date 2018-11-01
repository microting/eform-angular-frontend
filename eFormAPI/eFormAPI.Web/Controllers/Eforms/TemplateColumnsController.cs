using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Templates;

namespace eFormAPI.Web.Controllers.Eforms
{
    [Authorize]
    public class TemplateColumnsController : Controller
    {
        private readonly ITemplateColumnsService _templateColumnsService;
        private readonly IEformPermissionsService _permissionsService;

        public TemplateColumnsController(ITemplateColumnsService templateColumnsService,
            IEformPermissionsService permissionsService)
        {
            _templateColumnsService = templateColumnsService;
            _permissionsService = permissionsService;
        }

        [HttpGet]
        [Route("api/template-columns/{templateId}")]
        public OperationDataResult<List<TemplateColumnModel>> GetAvailableColumns(int templateId)
        {
            return _templateColumnsService.GetAvailableColumns(templateId);
        }

        [HttpGet]
        [Route("api/template-columns/current/{templateId}")]
        public OperationDataResult<DisplayTemplateColumnsModel> GetCurrentColumns(int templateId)
        {
            return _templateColumnsService.GetCurrentColumns(templateId);
        }

        [HttpPost]
        [Route("api/template-columns")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateColumns)]
        public async Task<IActionResult> UpdateColumns([FromBody] UpdateTemplateColumnsModel model)
        {
            if (model.TemplateId != null
                && !await _permissionsService.CheckEform((int) model.TemplateId,
                    AuthConsts.EformClaims.EformsClaims.UpdateColumns))
            {
                return Forbid();
            }

            return Ok(_templateColumnsService.UpdateColumns(model));
        }
    }
}