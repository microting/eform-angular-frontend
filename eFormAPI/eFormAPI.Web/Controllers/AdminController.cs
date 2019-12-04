/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
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

        [HttpPost]
        [Route("api/admin/get-users")]
        [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Read)]
        public async Task<OperationDataResult<UserInfoModelList>> Index([FromBody] PaginationModel paginationModel)
        {
            return await _adminService.GetAllUsers(paginationModel);
        }

        [HttpPost]
        [Route("api/admin/create-user")]
        [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Create)]
        public async Task<OperationResult> Create([FromBody] UserRegisterModel userRegisterModel)
        {
            return await _adminService.CreateUser(userRegisterModel);
        }

        [HttpGet]
        [Route("api/admin/user/{userId}")]
        [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Read)]
        public Task<OperationDataResult<UserRegisterModel>> Read(int userId)
        {
            return _adminService.GetUser(userId);
        }
        
        [HttpPost]
        [Route("api/admin/update-user")]
        [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Update)]
        public async Task<OperationResult> Update([FromBody] UserRegisterModel userRegisterModel)
        {
            return await _adminService.UpdateUser(userRegisterModel);
        }
        
        [HttpGet]
        [Route("api/admin/delete-user/{userId}")]
        [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Delete)]
        public Task<OperationResult> Delete(int userId)
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