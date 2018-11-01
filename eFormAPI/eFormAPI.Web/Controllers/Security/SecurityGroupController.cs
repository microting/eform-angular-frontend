using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Models.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers.Security
{
    [Authorize]
    public class SecurityGroupController : Controller
    {
        private readonly ISecurityGroupService _securityGroupService;

        public SecurityGroupController(ISecurityGroupService securityGroupService)
        {
            _securityGroupService = securityGroupService;
        }

        [HttpGet]
        [Route("api/security/groups")]
        [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Read)]
        public async Task<OperationDataResult<SecurityGroupsModel>> GetEntityGroups(SecurityGroupRequestModel requestModel)
        {
            return await _securityGroupService.GetSecurityGroups(requestModel);
        }

        [HttpGet]
        [Route("api/security/groups/{id}")]
        [Authorize(Roles = EformRole.Admin)]
        public async Task<OperationDataResult<SecurityGroupModel>> GetEntityGroup(int id)
        {
            return await _securityGroupService.GetSecurityGroup(id);
        }

        [HttpPost]
        [Route("api/security/groups")]
        [Authorize(Roles = EformRole.Admin)]
        public async Task<OperationResult> CreateSecurityGroup([FromBody] SecurityGroupCreateModel model)
        {
            return await _securityGroupService.CreateSecurityGroup(model);
        }

        [HttpPut]
        [Route("api/security/groups")]
        [Authorize(Roles = EformRole.Admin)]
        public async Task<OperationResult> UpdateSecurityGroup([FromBody] SecurityGroupUpdateModel model)
        {
            return await _securityGroupService.UpdateSecurityGroup(model);
        }

        [HttpDelete]
        [Route("api/security/groups/{id}")]
        [Authorize(Roles = EformRole.Admin)]
        public async Task<OperationResult> DeleteSecurityGroup(int id)
        {
            return await _securityGroupService.DeleteSecurityGroup(id);
        }
    }
}
