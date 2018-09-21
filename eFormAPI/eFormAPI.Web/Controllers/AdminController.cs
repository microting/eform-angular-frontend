using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Models.Common;
using Microting.eFormApi.BasePn.Models.User;

namespace eFormAPI.Web.Controllers
{
    [Authorize(Roles = EformRole.Admin)]
    public class AdminController : Controller
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        [Route("api/admin/user/{userId}")]
        public Task<OperationDataResult<UserRegisterModel>> GetUser(int userId)
        {
            return _adminService.GetUser(userId);
        }

        [HttpPost]
        [Route("api/admin/get-users")]
        public OperationDataResult<UserInfoModelList> GetAllUsers([FromBody] PaginationModel paginationModel)
        {
            return _adminService.GetAllUsers(paginationModel);
        }

        [HttpPost]
        [Route("api/admin/update-user")]
        public Task<OperationResult> UpdateUser([FromBody] UserRegisterModel userRegisterModel)
        {
            return _adminService.UpdateUser(userRegisterModel);
        }

        [HttpPost]
        [Route("api/admin/create-user")]
        public Task<OperationResult> CreateUser([FromBody] UserRegisterModel userRegisterModel)
        {
            return _adminService.CreateUser(userRegisterModel);
        }

        [HttpGet]
        [Route("api/admin/delete-user/{userId}")]
        public Task<OperationResult> DeleteUser(int userId)
        {
            return _adminService.DeleteUser(userId);
        }

        [HttpGet]
        [Route("api/admin/enable-two-factor")]
        [Authorize(Roles = EformRole.Admin)]
        public OperationResult EnableTwoFactorAuthForce()
        {
            return _adminService.EnableTwoFactorAuthForce();
        }

        [HttpGet]
        [Route("api/admin/disable-two-factor")]
        [Authorize(Roles = EformRole.Admin)]
        public OperationResult DisableTwoFactorAuthForce()
        {
            return _adminService.DisableTwoFactorAuthForce();
        }
    }
}