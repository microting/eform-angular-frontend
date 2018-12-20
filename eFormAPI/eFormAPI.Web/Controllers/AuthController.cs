using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;
        private readonly ILocalizationService _localizationService;

        public AuthController(IUserService userService,
            UserManager<EformUser> userManager,
            IAuthService authService,
            ILocalizationService localizationService)
        {
            _authService = authService;
            _localizationService = localizationService;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("api/auth/token")]
        public async Task<OperationResult> AuthenticateUser(LoginModel model)
        {
            return await _authService.AuthenticateUser(model);
        }

        [HttpGet]
        [Route("api/auth/logout")]
        public async Task<OperationResult> Logout()
        {
            OperationResult result = await _authService.LogOut();
            if (result.Success)
                Response.Cookies.Delete("Authorization");
            return new OperationResult(true);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/auth/two-factor-info")]
        public OperationDataResult<bool> TwoFactorAuthForceInfo()
        {
            return _authService.TwoFactorAuthForceInfo();
        }

        [HttpGet]
        [Route("api/auth/google-auth-info")]
        public async Task<OperationDataResult<GoogleAuthInfoModel>> GetGoogleAuthenticatorInfo()
        {
            return await _authService.GetGoogleAuthenticatorInfo();
        }

        [HttpPost]
        [Route("api/auth/google-auth-info")]
        public async Task<OperationResult> UpdateGoogleAuthenticatorInfo([FromBody] GoogleAuthInfoModel requestModel)
        {
            return await _authService.UpdateGoogleAuthenticatorInfo(requestModel);
        }

        [HttpDelete]
        [Route("api/auth/google-auth-info")]
        public async Task<OperationResult> DeleteGoogleAuthenticatorInfo()
        {
            return await _authService.DeleteGoogleAuthenticatorInfo();
        }

        /// <summary>
        /// Get secret key and barcode to enable GoogleAuthenticator for account
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("api/auth/google-auth-key")]
        public async Task<OperationDataResult<GoogleAuthenticatorModel>> GetGoogleAuthenticator(
            [FromBody] LoginModel loginModel)
        {
            // check model
            if (!ModelState.IsValid)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(false,
                    _localizationService.GetString("InvalidUserNameOrPassword"));
            }

            return await _authService.GetGoogleAuthenticator(loginModel);
        }
    }
}