using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Http;
using Castle.Core.Internal;
using eFormAPI.Web.Infrastructure.Data;
using eFormAPI.Web.Infrastructure.Data.Entities;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormAPI.Web.Infrastructure.Identity;
using eFormAPI.Web.Infrastructure.Models.Auth;
using eFormAPI.Web.Infrastructure.Models.Settings.User;
using eFormAPI.Web.Infrastructure.Models.User;
using EformBase.Pn.Consts;
using EformBase.Pn.Infrastructure.Models.API;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    [RoutePrefix("api/account")]
    public class AccountController : ApiController
    {
        private EformUserManager _userManager;
        private readonly EformRoleManager _eformRoleManager;
        private readonly BaseDbContext _dbContext;

        public AccountController(BaseDbContext dbContext)
        {
            _eformRoleManager = new EformRoleManager(
                new EformRoleStore(new BaseDbContext()));
            _dbContext = dbContext;
        }

        private EformUserManager UserManager =>
            _userManager ?? Request.GetOwinContext().GetUserManager<EformUserManager>();

        // GET api/account/user-info
        [Route("user-info")]
        public UserInfoViewModel GetUserInfo()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());
            if (user == null)
            {
                return null;
            }
            var rolemanager = new EformRoleManager(new EformRoleStore(BaseDbContext.Create()));
            var roleId = user.Roles.FirstOrDefault()?.RoleId;
            string role = null;
            if (roleId != null) role = rolemanager.FindById((int) roleId)?.Name;
            return new UserInfoViewModel
            {
                Email = user.Email,
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = role
            };
        }

        // GET api/account/user-settings
        [HttpGet]
        [Route("user-settings")]
        public OperationDataResult<UserSettingsModel> GetUserSettings()
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());
            if (user == null)
            {
                return new OperationDataResult<UserSettingsModel>(false, LocaleHelper.GetString("UserNotFound"));
            }
            var locale = user.Locale;
            if (locale.IsNullOrEmpty())
            {
                var configuration = WebConfigurationManager.OpenWebConfiguration("~");
                var section = (AppSettingsSection)configuration.GetSection("appSettings");
                locale = section.Settings["general:defaultLocale"].Value;
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

        // POST api/account/user-settings
        [HttpPost]
        [Route("user-settings")]
        public OperationResult UpdateUserSettings(UserSettingsModel model)
        {
            var user = UserManager.FindById(User.Identity.GetUserId<int>());
            if (user == null)
            {
                return new OperationResult(false, LocaleHelper.GetString("UserNotFound"));
            }
            user.Locale = model.Locale;
            var updateResult = UserManager.UpdateAsync(user).Result;
            if (!updateResult.Succeeded)
            {
                return new OperationResult(false,
                    $"Error while updating user settings: {string.Join(", ", updateResult.Errors.Select(x => x.ToString()).ToArray())}");
            }
            return new OperationResult(true);
        }


        [HttpPost]
        [Route("change-password")]
        public async Task<OperationResult> ChangePassword(ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new OperationResult(false, string.Join(" ", allErrors.Select(x => x.ErrorMessage)));
            }
            var result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId<int>(),
                model.OldPassword,
                model.NewPassword);

            if (!result.Succeeded)
            {
                return new OperationResult(false, string.Join(" ", result.Errors));
            }
            return new OperationResult(true);
        }

        // POST: /account/forgot-password
        [HttpPost]
        [Route("forgot-password")]
        [AllowAnonymous]
        public async Task<OperationResult> ForgotPassword(ForgotPasswordModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    return new OperationResult(false);
                }
                var code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                var link = ConfigurationManager.AppSettings["app:siteLink"];
                link = $"{link}/login/restore-password?userId={user.Id}&code={code}";
                await UserManager.SendEmailAsync(user.Id, "Reset Password",
                    "Please reset your password by clicking <a href=\"" + link + "\">here</a>");
                return new OperationResult(true);
            }
            return new OperationResult(false);
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("reset-admin-password")]
        public async Task<OperationResult> ResetAdminPassword(string code)
        {
            var securityCode = ConfigurationManager.AppSettings["restore:securityCode"];
            if (string.IsNullOrEmpty(securityCode))
            {
                return new OperationResult(false, LocaleHelper.GetString("PleaseSetupSecurityCode"));
            }
            var defaultPassword = ConfigurationManager.AppSettings["restore:defaultPassword"];
            if (code != securityCode)
            {
                return new OperationResult(false, "InvalidSecurityCode");
            }
            var role = await _eformRoleManager.FindByNameAsync(EformRoles.Admin);
            var user = _dbContext.Users.Include(x => x.Roles)
                .FirstOrDefault(x => x.Roles.Any(y => y.RoleId == role.Id));
            if (user == null)
            {
                return new OperationResult(false, LocaleHelper.GetString("AdminUserNotFound"));
            }
            var removeResult = await UserManager.RemovePasswordAsync(user.Id);
            if (!removeResult.Succeeded)
            {
                return new OperationResult(false,
                    LocaleHelper.GetString("ErrorWhileRemovingOldPassword") + ". \n" + string.Join(" ", removeResult.Errors));
            }
            var addPasswordResult = await UserManager.AddPasswordAsync(user.Id, defaultPassword);
            if (!addPasswordResult.Succeeded)
            {
                return new OperationResult(false,
                    LocaleHelper.GetString("ErrorWhileAddNewPassword") + ". \n" + string.Join(" ", addPasswordResult.Errors));
            }
            return new OperationResult(true, LocaleHelper.GetString("YourEmailPasswordHasBeenReset", user.Email));
        }

        // POST: /account/reset-password
        [HttpPost]
        [Route("reset-password")]
        [AllowAnonymous]
        public async Task<OperationResult> ResetPassword(ResetPasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new OperationResult(false, string.Join(" ", allErrors));
            }
            var user = await UserManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                return new OperationResult(false);
            }
            var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
            if (result.Succeeded)
            {
                return new OperationResult(true);
            }
            return new OperationResult(false, string.Join(" ", result));
        }

        #region Helpers

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

        #endregion
    }
}