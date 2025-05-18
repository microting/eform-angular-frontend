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

using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models.Auth;
using eFormAPI.Web.Infrastructure.Models.Settings;
using eFormAPI.Web.Infrastructure.Models.Settings.User;
using eFormAPI.Web.Infrastructure.Models.Users;
using ImageMagick;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;

namespace eFormAPI.Web.Controllers;

[Authorize]
public class AccountController(
    IAccountService accountService,
    IEFormCoreService coreHelper,
    IUserService userService,
    UserManager<EformUser> userManager,
    ILocalizationService localizationService) : Controller
{
    // GET api/account/user-info
    [HttpGet]
    [Route("api/account/user-info")]
    public Task<UserInfoViewModel> GetUserInfo()
    {
        return accountService.GetUserInfo();
    }

    // GET api/account/user-settings
    [HttpGet]
    [Route("api/account/user-settings")]
    public Task<OperationDataResult<UserSettingsModel>> GetUserSettings()
    {
        return accountService.GetUserSettings();
    }

    // POST api/account/user-settings
    [HttpPost]
    [Route("api/account/user-settings")]
    public Task<OperationResult> UpdateUserSettings([FromBody] UserSettingsModel model)
    {
        return accountService.UpdateUserSettings(model);
    }

    [HttpPost]
    [Route("api/account/profile-picture-upload")]
    public async Task<IActionResult> ProfilePictureUpload(IFormFile file)
    {
        try
        {
            if (file.Length > 0)
            {
                await using (var baseMemoryStream = new MemoryStream())
                {

                    var core = await coreHelper.GetCore();
                    if (core.GetSdkSetting(Settings.swiftEnabled).Result.ToLower() == "true" ||
                        core.GetSdkSetting(Settings.s3Enabled).Result.ToLower() == "true")
                    {

                        await file.CopyToAsync(baseMemoryStream);
                        baseMemoryStream.Position = 0; // Reset the stream position to the beginning

                        var fileExtension = Path.GetExtension(file.FileName);

                        string checkSumConvertedFile;
                        using (var md5 = MD5.Create())
                        {
                            var grr = md5.ComputeHash(baseMemoryStream.ToArray());
                            checkSumConvertedFile = BitConverter.ToString(grr).Replace("-", "").ToLower();
                        }

                        baseMemoryStream.Seek(0, SeekOrigin.Begin);
                        MemoryStream memoryStream = new MemoryStream();
                        await baseMemoryStream.CopyToAsync(memoryStream);
                        await core.PutFileToS3Storage(memoryStream, checkSumConvertedFile + fileExtension);

                        // find the current user and update the profile picture
                        var user = await userService.GetCurrentUserAsync();
                        user.ProfilePicture = checkSumConvertedFile + fileExtension;

                        baseMemoryStream.Seek(0, SeekOrigin.Begin);

                        using (var image = new MagickImage(baseMemoryStream))
                        {
                            image.Resize(32, 32);
                            MemoryStream newMemoryStream = new MemoryStream();
                            await image.WriteAsync(newMemoryStream);

                            await core.PutFileToS3Storage(newMemoryStream,
                                checkSumConvertedFile + "_32" + fileExtension);
                            await newMemoryStream.DisposeAsync().ConfigureAwait(false);
                            newMemoryStream.Close();
                            user.ProfilePictureSnapshot = checkSumConvertedFile + "_32" + fileExtension;
                        }

                        await userManager.UpdateAsync(user);
                    }
                }


                return Ok();
            }

            return BadRequest(localizationService.GetString("InvalidRequest"));
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete]
    [Route("api/account/profile-picture-delete")]
    public async Task<OperationResult> ProfilePictureDelete()
    {
        return await accountService.ProfilePictureDelete();
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

        return await accountService.ChangePassword(model);
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

        return await accountService.AdminChangePassword(model);
    }

    // POST: /account/forgot-password
    [HttpPost]
    [Route("api/account/forgot-password")]
    [AllowAnonymous]
    public async Task<OperationResult> ForgotPassword([FromBody] ForgotPasswordModel model)
    {
        if (ModelState.IsValid)
        {
            return await accountService.ForgotPassword(model);
        }

        return new OperationResult(false);
    }


    [HttpGet]
    [AllowAnonymous]
    [Route("api/account/reset-admin-password")]
    public async Task<OperationResult> ResetAdminPassword(string code)
    {
        return await accountService.ResetAdminPassword(code);
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

        return await accountService.ResetPassword(model);
    }

    [HttpGet]
    [Route("api/account/timezones")]
    [AllowAnonymous]
    public OperationDataResult<TimeZonesModel> AllTimeZones()
    {
        return accountService.AllTimeZones();
    }
}