using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Auth;
using eFormAPI.Common.Models.Settings.User;
using eFormAPI.Common.Models.User;
using eFormAPI.Core.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        // GET api/account/user-info
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
                var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new OperationResult(false, string.Join(" ", allErrors.Select(x => x.ErrorMessage)));
            }

            return await _accountService.ChangePassword(model);
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
        public async Task<OperationResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new OperationResult(false, string.Join(" ", allErrors));
            }

            return await _accountService.ResetPassword(model);
        }
    }
}