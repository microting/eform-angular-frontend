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

using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models.Auth;
using eFormAPI.Web.Infrastructure.Models.Settings;
using eFormAPI.Web.Infrastructure.Models.Settings.User;
using eFormAPI.Web.Infrastructure.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;

namespace eFormAPI.Web.Controllers;

[Authorize]
public class AccountController : Controller
{
    private readonly IAccountService _accountService;

    public AccountController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    // GET api/account/user-info
    [HttpGet]
    [Route("api/account/user-info")]
    public Task<UserInfoViewModel> GetUserInfo()
    {
        return _accountService.GetUserInfo();
    }

    // GET api/account/user-settings
    [HttpGet]
    [Route("api/account/user-settings")]
    public Task<OperationDataResult<UserSettingsModel>> GetUserSettings()
    {
        return _accountService.GetUserSettings();
    }

    // POST api/account/user-settings
    [HttpPost]
    [Route("api/account/user-settings")]
    public Task<OperationResult> UpdateUserSettings([FromBody] UserSettingsModel model)
    {
        return _accountService.UpdateUserSettings(model);
    }


    [HttpPost]
    [Route("api/account/change-password")]
    public async Task<OperationResult> ChangePassword([FromBody] ChangePasswordModel model)
    {
        if (!ModelState.IsValid)
        {
            var allErrors = ModelState.Values.SelectMany(v => v.Errors).Select(x => x.ErrorMessage);
            return new OperationResult(false, string.Join(" ", allErrors));
        }

        return await _accountService.ChangePassword(model);
    }

    [HttpPost]
    [Route("api/account/change-password-admin")]
    public async Task<OperationResult> ChangePasswordAdmin([FromBody] ChangePasswordAdminModel model)
    {
        if (!ModelState.IsValid)
        {
            var allErrors = ModelState.Values.SelectMany(v => v.Errors).Select(x => x.ErrorMessage);
            return new OperationResult(false, string.Join(" ", allErrors));
        }

        return await _accountService.AdminChangePassword(model);
    }

    // POST: /account/forgot-password
    [HttpPost]
    [Route("api/account/forgot-password")]
    [AllowAnonymous]
    public async Task<OperationResult> ForgotPassword([FromBody] ForgotPasswordModel model)
    {
        if (ModelState.IsValid)
        {
            return await _accountService.ForgotPassword(model);
        }

        return new OperationResult(false);
    }


    [HttpGet]
    [AllowAnonymous]
    [Route("api/account/reset-admin-password")]
    public async Task<OperationResult> ResetAdminPassword(string code)
    {
        return await _accountService.ResetAdminPassword(code);
    }

    // POST: /account/reset-password
    [HttpPost]
    [Route("api/account/reset-password")]
    [AllowAnonymous]
    public async Task<OperationResult> ResetPassword([FromBody] Infrastructure.Models.ResetPasswordModel model)
    {
        if (!ModelState.IsValid)
        {
            var allErrors = ModelState.Values.SelectMany(v => v.Errors).Select(x => x.ErrorMessage);
            return new OperationResult(false, string.Join(" ", allErrors));
        }

        return await _accountService.ResetPassword(model);
    }

    [HttpGet]
    [Route("api/account/timezones")]
    [AllowAnonymous]
    public OperationDataResult<TimeZonesModel> AllTimeZones()
    {
        return _accountService.AllTimeZones();
    }
}