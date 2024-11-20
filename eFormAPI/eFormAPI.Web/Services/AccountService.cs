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


using System.Globalization;
using System.Web;
using eFormAPI.Web.Infrastructure.Models.Auth;
using Microsoft.Extensions.Localization;

namespace eFormAPI.Web.Services;

using Microsoft.EntityFrameworkCore;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abstractions;
using Hosting.Helpers.DbOptions;
using Infrastructure.Models.Settings;
using Infrastructure.Models.Settings.User;
using Infrastructure.Models.Users;
using Mailing.EmailService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microting.eForm.Dto;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;

public class AccountService(
    IEFormCoreService coreHelper,
    UserManager<EformUser> userManager,
    IUserService userService,
    IDbOptions<ApplicationSettings> appSettings,
    ILocalizationService localizationService,
    BaseDbContext context,
    IEmailService emailService)
    : IAccountService
{
    public async Task<UserInfoViewModel> GetUserInfo()
    {
        var user = await userService.GetCurrentUserAsync();
        if (user == null)
        {
            return null;
        }

        var roles = await userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault();
        return new UserInfoViewModel
        {
            Email = user.Email,
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = role
        };
    }

    public async Task<OperationDataResult<UserSettingsModel>> GetUserSettings()
    {
        var user = await userService.GetCurrentUserAsync();
        if (user == null)
        {
            return new OperationDataResult<UserSettingsModel>(false, localizationService.GetString("UserNotFound"));
        }

        var timeZone = string.IsNullOrEmpty(user.TimeZone) ? "Europe/Copenhagen" : user.TimeZone;
        var formats = string.IsNullOrEmpty(user.Formats) ? "de-DE" : user.Formats;
        var darkTheme = user.DarkTheme;
        var locale = string.IsNullOrEmpty(user.Locale) ? "da" : user.Locale;
        var core = await coreHelper.GetCore();
        var dbContextHelper = core.DbContextHelper;
        var dbContext = dbContextHelper.GetDbContext();
        var languageId = await dbContext.Languages
            .Where(x => x.LanguageCode == locale)
            .Select(x => x.Id)
            .FirstOrDefaultAsync();

        var securityGroupRedirectLink = await context.SecurityGroupUsers
            .Where(x => x.EformUserId == user.Id)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => x.SecurityGroup.RedirectLink)
            .FirstOrDefaultAsync();

        return new OperationDataResult<UserSettingsModel>(true, new UserSettingsModel()
        {
            Locale = locale,
            LanguageId = languageId,
            DarkTheme = darkTheme,
            Formats = formats,
            TimeZone = timeZone,
            LoginRedirectUrl = securityGroupRedirectLink
        });
    }

    public OperationDataResult<TimeZonesModel> AllTimeZones()
    {
        TimeZonesModel timeZones = new TimeZonesModel();
        timeZones.TimeZoneModels = new List<TimeZoneModel>();
        foreach (TimeZoneInfo timeZoneInfo in TimeZoneInfo.GetSystemTimeZones().OrderBy(x => x.Id))
        {
            TimeZoneModel timeZoneModel = new TimeZoneModel()
            {
                Id = timeZoneInfo.Id,
                Name = timeZoneInfo.Id
            };
            timeZones.TimeZoneModels.Add(timeZoneModel);
        }
        return new OperationDataResult<TimeZonesModel>(true, timeZones);
    }

    public async Task<OperationResult> UpdateUserSettings(UserSettingsModel model)
    {
        var user = await userService.GetCurrentUserAsync();
        if (user == null)
        {
            return new OperationResult(false, localizationService.GetString("UserNotFound"));
        }

        user.Locale = model.Locale;
        user.TimeZone = model.TimeZone;
        user.Formats = model.Formats;
        user.DarkTheme = model.DarkTheme;
        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            return new OperationResult(false,
                $"Error while updating user settings: {string.Join(", ", updateResult.Errors.Select(x => x.Description).ToArray())}");
        }

        return new OperationResult(true);
    }

    public async Task<OperationResult> ChangePassword(ChangePasswordModel model)
    {
        var user = await userService.GetCurrentUserAsync();

        var result = await userManager.ChangePasswordAsync(
            user,
            model.OldPassword,
            model.NewPassword);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(x => x.Description).ToArray();
            return new OperationResult(false, string.Join(" ", errors));
        }

        return new OperationResult(true, localizationService.GetString("PasswordSuccessfullyUpdated"));
    }

    public async Task<OperationResult> AdminChangePassword(ChangePasswordAdminModel model)
    {
        var user = await userService.GetByUsernameAsync(model.Email);

        await userManager.RemovePasswordAsync(user);
        var result = await userManager.AddPasswordAsync(user, model.NewPassword);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(x => x.Description).ToArray();
            return new OperationResult(false, string.Join(" ", errors));
        }

        return new OperationResult(true, localizationService.GetString("PasswordSuccessfullyUpdated"));
    }

    public async Task<OperationResult> ForgotPassword(ForgotPasswordModel model)
    {
        var core = await coreHelper.GetCore();
        var user = await userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return new OperationResult(false, $"User with {model.Email} not found");
        }

        // Set the culture based on user locale
        if (!string.IsNullOrEmpty(user.Locale))
        {
            var culture = new CultureInfo(user.Locale);
            CultureInfo.CurrentCulture = culture;
            CultureInfo.CurrentUICulture = culture;
        }


        var code = HttpUtility.UrlEncode(await userManager.GeneratePasswordResetTokenAsync(user));
        var link = await core.GetSdkSetting(Settings.httpServerAddress);
        link = $"{link}/auth/restore-password-confirmation?userId={user.Id}&code={code}";
/*            await _emailSender.SendEmailAsync(user.Email, "EForm Password Reset",
                "Please reset your password by clicking <a href=\"" + link + "\">here</a>");*/

        var html = string.Format(localizationService.GetString("ForgotPasswordEmailHtml"),
            user.FirstName,
            user.LastName,
            link);

        await emailService.SendAsync(
            EformEmailConst.FromEmail,
            "no-reply@microting.com",
            localizationService.GetString("ForgotPasswordEmailSubject"),
            user.Email,
            html: html);

        return new OperationResult(true);
    }


    [HttpGet]
    [AllowAnonymous]
    [Route("reset-admin-password")]
    public async Task<OperationResult> ResetAdminPassword(string code)
    {
        var securityCode = appSettings.Value.SecurityCode;
        if (string.IsNullOrEmpty(securityCode))
        {
            return new OperationResult(false, localizationService.GetString("PleaseSetupSecurityCode"));
        }

        var defaultPassword = appSettings.Value.DefaultPassword;
        if (code != securityCode)
        {
            return new OperationResult(false, localizationService.GetString("InvalidSecurityCode"));
        }

        var users = await userManager.GetUsersInRoleAsync(EformRole.Admin);
        var user = users.FirstOrDefault();

        if (user == null)
        {
            return new OperationResult(false, localizationService.GetString("AdminUserNotFound"));
        }

        var removeResult = await userManager.RemovePasswordAsync(user);
        if (!removeResult.Succeeded)
        {
            return new OperationResult(false,
                localizationService.GetString("ErrorWhileRemovingOldPassword") + ". \n" +
                string.Join(" ", removeResult.Errors.Select(x=>x.Description).ToArray()));
        }

        var addPasswordResult = await userManager.AddPasswordAsync(user, defaultPassword);
        if (!addPasswordResult.Succeeded)
        {
            return new OperationResult(false,
                localizationService.GetString("ErrorWhileAddNewPassword") + ". \n" +
                string.Join(" ", addPasswordResult.Errors.Select(x=>x.Description).ToArray()));
        }

        return new OperationResult(true, localizationService.GetStringWithFormat("YourEmailPasswordHasBeenReset", user.Email));
    }

    public async Task<OperationResult> ResetPassword(Infrastructure.Models.ResetPasswordModel model)
    {
        var user = await userManager.FindByIdAsync(model.UserId.ToString());
        if (user == null)
        {
            return new OperationResult(false);
        }

        var result = await userManager.ResetPasswordAsync(user, model.Code, model.NewPassword);
        if (result.Succeeded)
        {
            return new OperationResult(true);
        }

        return new OperationResult(false, string.Join(" ", result.Errors.Select(x=>x.Description).ToArray()));
    }
}