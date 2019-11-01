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
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Infrastructure.Models.Settings.User;
using eFormAPI.Web.Infrastructure.Models.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;

namespace eFormAPI.Web.Services
{
    public class AccountService : IAccountService
    {
        private readonly IUserService _userService;
        private readonly IEmailSender _emailSender;
        private readonly IDbOptions<ApplicationSettings> _appSettings;
        private readonly ILogger<AccountService> _logger;
        private readonly ILocalizationService _localizationService;
        private readonly UserManager<EformUser> _userManager;

        public AccountService(UserManager<EformUser> userManager,
            IUserService userService,
            IDbOptions<ApplicationSettings> appSettings, 
            ILogger<AccountService> logger,
            ILocalizationService localizationService, 
            IEmailSender emailSender)
        {
            _userManager = userManager;
            _userService = userService;
            _appSettings = appSettings;
            _logger = logger;
            _localizationService = localizationService;
            _emailSender = emailSender;
        }

        public async Task<UserInfoViewModel> GetUserInfo()
        {
            var user = await _userService.GetCurrentUserAsync();
            if (user == null)
            {
                return null;
            }

            var roles = await _userManager.GetRolesAsync(user);
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
            var user = await _userService.GetCurrentUserAsync();
            if (user == null)
            {
                return new OperationDataResult<UserSettingsModel>(false, _localizationService.GetString("UserNotFound"));
            }

            var locale = user.Locale;
            if (string.IsNullOrEmpty(locale))
            {
                locale = _appSettings.Value.DefaultLocale;
                if (locale == null)
                {
                    locale = "en-US";
                }
            }

            return new OperationDataResult<UserSettingsModel>(true, new UserSettingsModel()
            {
                Locale = locale
            });
        }

        public async Task<OperationResult> UpdateUserSettings(UserSettingsModel model)
        {
            var user = await _userService.GetCurrentUserAsync();
            if (user == null)
            {
                return new OperationResult(false, _localizationService.GetString("UserNotFound"));
            }

            user.Locale = model.Locale;
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return new OperationResult(false,
                    $"Error while updating user settings: {string.Join(", ", updateResult.Errors.Select(x => x.Description).ToArray())}");
            }

            return new OperationResult(true);
        }

        public async Task<OperationResult> ChangePassword(ChangePasswordModel model)
        {
            var user = await _userService.GetCurrentUserAsync();
            var result = await _userManager.ChangePasswordAsync(
                user,
                model.OldPassword,
                model.NewPassword);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(x => x.Description).ToArray();
                return new OperationResult(false, string.Join(" ", errors));
            }

            return new OperationResult(true, _localizationService.GetString("PasswordSuccessfullyUpdated"));
        }

        public async Task<OperationResult> ForgotPassword(ForgotPasswordModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return new OperationResult(false, $"User with {model.Email} not found");
            }

            var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            var link = _appSettings.Value.SiteLink;
            link = $"{link}/auth/restore-password-confirmation?userId={user.Id}&code={code}";
            await _emailSender.SendEmailAsync(user.Email, "EForm Password Reset",
                "Please reset your password by clicking <a href=\"" + link + "\">here</a>");
            return new OperationResult(true);
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("reset-admin-password")]
        public async Task<OperationResult> ResetAdminPassword(string code)
        {
            var securityCode = _appSettings.Value.SecurityCode;
            if (string.IsNullOrEmpty(securityCode))
            {
                return new OperationResult(false, _localizationService.GetString("PleaseSetupSecurityCode"));
            }

            var defaultPassword = _appSettings.Value.DefaultPassword;
            if (code != securityCode)
            {
                return new OperationResult(false, _localizationService.GetString("InvalidSecurityCode"));
            }

            var users = await _userManager.GetUsersInRoleAsync(EformRole.Admin);
            var user = users.FirstOrDefault();

            if (user == null)
            {
                return new OperationResult(false, _localizationService.GetString("AdminUserNotFound"));
            }

            var removeResult = await _userManager.RemovePasswordAsync(user);
            if (!removeResult.Succeeded)
            {
                return new OperationResult(false,
                    _localizationService.GetString("ErrorWhileRemovingOldPassword") + ". \n" +
                    string.Join(" ", removeResult.Errors.Select(x=>x.Description).ToArray()));
            }

            var addPasswordResult = await _userManager.AddPasswordAsync(user, defaultPassword);
            if (!addPasswordResult.Succeeded)
            {
                return new OperationResult(false,
                    _localizationService.GetString("ErrorWhileAddNewPassword") + ". \n" +
                    string.Join(" ", addPasswordResult.Errors.Select(x=>x.Description).ToArray()));
            }

            return new OperationResult(true, _localizationService.GetStringWithFormat("YourEmailPasswordHasBeenReset", user.Email));
        }

        public async Task<OperationResult> ResetPassword(ResetPasswordModel model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId.ToString());
            if (user == null)
            {
                return new OperationResult(false);
            }

            var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
            if (result.Succeeded)
            {
                return new OperationResult(true);
            }

            return new OperationResult(false, string.Join(" ", result.Errors.Select(x=>x.Description).ToArray()));
        }
    }
}