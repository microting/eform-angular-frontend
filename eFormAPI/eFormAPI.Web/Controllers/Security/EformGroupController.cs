using System.Threading.Tasks;
using eFormAPI.Web.Services.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Templates;

namespace eFormAPI.Web.Controllers.Security
{
    [Authorize(Roles = EformRole.Admin)]
    public class EformGroupController : Controller
    {
        private readonly IEformGroupService _eformGroupService;

        public EformGroupController(IEformGroupService eformGroupService)
        {
            _eformGroupService = eformGroupService;
        }

        [HttpGet]
        [Route("api/security/eforms/{groupId}")]
        public async Task<OperationDataResult<EformsPermissionsModel>> GetAvailableEforms(TemplateRequestModel model, int groupId)
        {
            return await _eformGroupService.GetAvailableEforms(model, groupId);
        }

        [HttpPut]
        [Route("api/security/eforms")]
        public async Task<OperationResult> AddEformToGroup([FromBody] EformBindGroupModel model)
        {
            return await _eformGroupService.AddEformToGroup(model);
        }
    }
}
