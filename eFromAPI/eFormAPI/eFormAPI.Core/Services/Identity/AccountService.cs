using System.Linq;
using System.Threading.Tasks;
using Castle.Core.Internal;
using eFormAPI.Common.Infrastructure.Helpers;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Auth;
using eFormAPI.Common.Models.Settings.User;
using eFormAPI.Common.Models.User;
using eFormAPI.Core.Abstractions;
using eFormAPI.Core.Helpers.WritableOptions;
using eFormAPI.Database.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace eFormAPI.Core.Services.Identity
{
    public class AccountService : IAccountService
    {
        private readonly IUserService _userService;
        private readonly IWritableOptions<ApplicationSettings> _appSettings;
        private readonly ILogger<AccountService> _logger;
        private readonly UserManager<EformUser> _userManager;

        public AccountService(UserManager<EformUser> userManager,
            IUserService userService,
            IWritableOptions<ApplicationSettings> appSettings, 
            ILogger<AccountService> logger)
        {
            _userManager = userManager;
            _userService = userService;
            _appSettings = appSettings;
            _logger = logger;
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
                return new OperationDataResult<UserSettingsModel>(false, LocaleHelper.GetString("UserNotFound"));
            }

            var locale = user.Locale;
            if (locale.IsNullOrEmpty())
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
                return new OperationResult(false, LocaleHelper.GetString("UserNotFound"));
            }

            user.Locale = model.Locale;
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return new OperationResult(false,
                    $"Error while updating user settings: {string.Join(", ", updateResult.Errors.Select(x => x.ToString()).ToArray())}");
            }

            return new OperationResult(true);
        }

        public async Task<OperationResult> ChangePassword(ChangePasswordModel model)
        {
            var result = await _userManager.ChangePasswordAsync(
                await _userService.GetCurrentUserAsync(),
                model.OldPassword,
                model.NewPassword);

            if (!result.Succeeded)
            {
                return new OperationResult(false, string.Join(" ", result.Errors));
            }

            return new OperationResult(true);
        }

        public async Task<OperationResult> ForgotPassword(ForgotPasswordModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return new OperationResult(false);
            }

            var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            var link = _appSettings.Value.SiteLink;
            link = $"{link}/login/restore-password?userId={user.Id}&code={code}";
            await _userManager.SetEmailAsync(user,
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
                return new OperationResult(false, LocaleHelper.GetString("PleaseSetupSecurityCode"));
            }

            var defaultPassword = _appSettings.Value.DefaultPassword;
            if (code != securityCode)
            {
                return new OperationResult(false, "InvalidSecurityCode");
            }

            var users = await _userManager.GetUsersInRoleAsync(EformRole.Admin);
            var user = users.FirstOrDefault();

            if (user == null)
            {
                return new OperationResult(false, LocaleHelper.GetString("AdminUserNotFound"));
            }

            var removeResult = await _userManager.RemovePasswordAsync(user);
            if (!removeResult.Succeeded)
            {
                return new OperationResult(false,
                    LocaleHelper.GetString("ErrorWhileRemovingOldPassword") + ". \n" +
                    string.Join(" ", removeResult.Errors));
            }

            var addPasswordResult = await _userManager.AddPasswordAsync(user, defaultPassword);
            if (!addPasswordResult.Succeeded)
            {
                return new OperationResult(false,
                    LocaleHelper.GetString("ErrorWhileAddNewPassword") + ". \n" +
                    string.Join(" ", addPasswordResult.Errors));
            }

            return new OperationResult(true, LocaleHelper.GetString("YourEmailPasswordHasBeenReset", user.Email));
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

            return new OperationResult(false, string.Join(" ", result));
        }
    }
}