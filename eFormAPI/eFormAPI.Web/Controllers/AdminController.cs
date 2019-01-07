using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class AdminController : Controller
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        [Route("api/admin/user/{userId}")]
        [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Read)]
        public Task<OperationDataResult<UserRegisterModel>> GetUser(int userId)
        {
            return _adminService.GetUser(userId);
        }

        [HttpPost]
        [Route("api/admin/get-users")]
        [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Read)]
        public OperationDataResult<UserInfoModelList> GetAllUsers([FromBody] PaginationModel paginationModel)
        {
            return _adminService.GetAllUsers(paginationModel);
        }

        [HttpPost]
        [Route("api/admin/update-user")]
        [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Update)]
        public Task<OperationResult> UpdateUser([FromBody] UserRegisterModel userRegisterModel)
        {
            return _adminService.UpdateUser(userRegisterModel);
        }

        [HttpPost]
        [Route("api/admin/create-user")]
        [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Create)]
        public Task<OperationResult> CreateUser([FromBody] UserRegisterModel userRegisterModel)
        {
            return _adminService.CreateUser(userRegisterModel);
        }

        [HttpGet]
        [Route("api/admin/delete-user/{userId}")]
        [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Delete)]
        public Task<OperationResult> DeleteUser(int userId)
        {
            return _adminService.DeleteUser(userId);
        }

        [HttpGet]
        [Route("api/admin/enable-two-factor")]
        [Authorize(Roles = EformRole.Admin)]
        public Task<OperationResult> EnableTwoFactorAuthForce()
        {
            return _adminService.EnableTwoFactorAuthForce();
        }

        [HttpGet]
        [Route("api/admin/disable-two-factor")]
        [Authorize(Roles = EformRole.Admin)]
        public Task<OperationResult> DisableTwoFactorAuthForce()
        {
            return _adminService.DisableTwoFactorAuthForce();
        }
    }
}