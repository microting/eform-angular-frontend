/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

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

namespace eFormAPI.Web.Controllers;

using System.Threading.Tasks;
using Abstractions;
using Infrastructure.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using Microting.EformAngularFrontendBase.Infrastructure.Const;

[Authorize]
[Route("api/admin")]
public class AdminController(IAdminService adminService) : Controller
{
    [HttpPost]
    [Route("get-users")]
    [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Read)]
    public async Task<OperationDataResult<Paged<UserInfoViewModel>>> Index([FromBody] UserInfoRequest paginationModel)
    {
        return await adminService.Index(paginationModel);
    }

    [HttpPost]
    [Route("create-user")]
    [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Create)]
    public async Task<OperationResult> Create([FromBody] UserRegisterModel userRegisterModel)
    {
        return await adminService.Create(userRegisterModel);
    }

    [HttpGet]
    [Route("user/{userId}")]
    [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Read)]
    public Task<OperationDataResult<UserRegisterModel>> Read(int userId)
    {
        return adminService.Read(userId);
    }
        
    [HttpPost]
    [Route("update-user")]
    [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Update)]
    public async Task<OperationResult> Update([FromBody] UserRegisterModel userRegisterModel)
    {
        return await adminService.Update(userRegisterModel);
    }
        
    [HttpGet]
    [Route("delete-user/{userId}")]
    [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Delete)]
    public Task<OperationResult> Delete(int userId)
    {
        return adminService.Delete(userId);
    }

    [HttpGet]
    [Route("enable-two-factor")]
    [Authorize(Roles = EformRole.Admin)]
    public Task<OperationResult> EnableTwoFactorAuthForce()
    {
        return adminService.EnableTwoFactorAuthForce();
    }

    [HttpGet]
    [Route("disable-two-factor")]
    [Authorize(Roles = EformRole.Admin)]
    public Task<OperationResult> DisableTwoFactorAuthForce()
    {
        return adminService.DisableTwoFactorAuthForce();
    }
}