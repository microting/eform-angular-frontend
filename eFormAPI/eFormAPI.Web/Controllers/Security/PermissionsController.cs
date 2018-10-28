using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.Permissions;
using eFormAPI.Web.Services.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers.Security
{
    [Authorize(Roles = EformRole.Admin)]
    public class PermissionsController : Controller
    {
        private readonly IPermissionsService _permissionsService;

        public PermissionsController(IPermissionsService permissionsService)
        {
            _permissionsService = permissionsService;
        }

        [HttpGet]
        [Route("api/security/permissions/{groupId}")]
        public async Task<OperationDataResult<PermissionsModel>> GetEntityGroup(int groupId)
        {
            return await _permissionsService.GetGroupPermissions(groupId);
        }

        [HttpPut]
        [Route("api/security/permissions")]
        public async Task<OperationResult> UpdateSecurityGroup([FromBody] PermissionsUpdateModel model)
        {
            return await _permissionsService.UpdatePermissions(model);
        }
    }
}
