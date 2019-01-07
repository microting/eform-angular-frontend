using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure.Models.EformPermissions;
using eFormAPI.Web.Infrastructure.Models.Templates;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers.Security
{
    [Authorize]
    public class EformGroupController : Controller
    {
        private readonly IEformGroupService _eformGroupService;

        public EformGroupController(IEformGroupService eformGroupService)
        {
            _eformGroupService = eformGroupService;
        }

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/security/eforms/{groupId}")]
        public async Task<OperationDataResult<TemplateListModel>> GetAvailableEforms(TemplateRequestModel model,
            int groupId)
        {
            return await _eformGroupService.GetAvailableEforms(model, groupId);
        }

        [HttpPut]
        [Route("api/security/eforms")]
        [Authorize(Roles = EformRole.Admin)]
        public async Task<OperationResult> AddEformToGroup([FromBody] EformBindGroupModel model)
        {
            return await _eformGroupService.AddEformToGroup(model);
        }

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/security/eforms-permissions/{groupId}")]
        public async Task<OperationDataResult<EformsPermissionsModel>> GetGroupEforms(int groupId)
        {
            return await _eformGroupService.GetGroupEforms(groupId);
        }

        [HttpPost]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/security/eforms-permissions")]
        public async Task<OperationResult> UpdateGroupEformPermissions([FromBody] EformPermissionsModel model)
        {
            return await _eformGroupService.UpdateGroupEformPermissions(model);
        }

        [HttpGet]
        [Route("api/security/eforms-permissions/simple")]
        public async Task<IActionResult> GetEformSimpleInfo()
        {
            return Ok(await _eformGroupService.GetEformSimpleInfo());
        }

        [HttpDelete]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/security/eforms/{eformId}/{groupId}")]
        public async Task<OperationResult> DeleteEformFromGroup(int eformId, int groupId)
        {
            return await _eformGroupService.DeleteEformFromGroup(eformId, groupId);
        }
    }
}