using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using eFormAPI.Common.API;
using eFormAPI.Common.Models.Auth;
using eFormAPI.Common.Models.User;
using eFormAPI.Web.Infrastructure.Data;
using eFormAPI.Web.Infrastructure.Data.Entities;
using eFormAPI.Web.Infrastructure.Identity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    [RoutePrefix("api/account")]
    public class AccountController : ApiController
    {
        private EformUserManager _userManager;

        public AccountController()
        {
        }

        public AccountController(EformUserManager userManager,
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public EformUserManager UserManager
        {
            get => _userManager ?? Request.GetOwinContext().GetUserManager<EformUserManager>();
            private set => _userManager = value;
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

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