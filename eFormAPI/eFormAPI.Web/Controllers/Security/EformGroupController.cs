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
        public async Task<OperationDataResult<TemplateListModel>> GetAvailableEforms(TemplateRequestModel model,
            int groupId)
        {
            return await _eformGroupService.GetAvailableEforms(model, groupId);
        }

        [HttpPut]
        [Route("api/security/eforms")]
        public async Task<OperationResult> AddEformToGroup([FromBody] EformBindGroupModel model)
        {
            return await _eformGroupService.AddEformToGroup(model);
        }

        [HttpGet]
        [Route("api/security/eforms-permissions/{groupId}")]
        public async Task<OperationDataResult<EformsPermissionsModel>> GetGroupEforms(int groupId)
        {
            return await _eformGroupService.GetGroupEforms(groupId);
        }

        [HttpPost]
        [Route("api/security/eforms-permissions")]
        public async Task<OperationResult> UpdateGroupEformPermissions([FromBody] EformPermissionsModel model)
        {
            return await _eformGroupService.UpdateGroupEformPermissions(model);
        }


        [HttpDelete]
        [Route("api/security/eforms/{eformId}/{groupId}")]
        public async Task<OperationResult> DeleteEformFromGroup(int eformId, int groupId)
        {
            return await _eformGroupService.DeleteEformFromGroup(eformId, groupId);
        }
    }
}