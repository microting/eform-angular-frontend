using System;
using System.Threading.Tasks;
using System.Web;
using eFormAPI.Common.Infrastructure.Helpers;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Auth;
using eFormAPI.Core.Abstractions;
using eFormAPI.Core.Helpers;
using eFormAPI.Database.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OtpSharp;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class AuthController : Controller
    {
        private readonly UserManager<EformUser> _userManager;
        private readonly IUserService _userService;
        private readonly IAuthService _authService;

        public AuthController(IUserService userService,
            UserManager<EformUser> userManager,
            IAuthService authService)
        {
            _userService = userService;
            _userManager = userManager;
            _authService = authService;
        }


        [HttpGet]
        [Route("api/auth/logout")]
        public async Task<OperationResult> Logout()
        {
            var result = await _authService.LogOut();
            if (result.Success)
                Response.Cookies.Delete("Authorization");
            return new OperationResult(true);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/auth/two-factor-info")]
        public OperationDataResult<bool> TwoFactorAuthForceInfo()
        {
            try
            {
                return new OperationDataResult<bool>(true, SettingsHelper.GetTwoFactorAuthForceInfo());
            }
            catch (Exception)
            {
                return new OperationDataResult<bool>(false);
            }
        }

        [HttpGet]
        [Route("api/auth/google-auth-info")]
        public async Task<OperationDataResult<GoogleAuthInfoModel>> GetGoogleAuthenticatorInfo()
        {
            try
            {
                var user = await _userService.GetCurrentUserAsync();
                if (user != null)
                {
                    var model = new GoogleAuthInfoModel()
                    {
                        PSK = user.GoogleAuthenticatorSecretKey,
                        IsTwoFactorEnabled = user.TwoFactorEnabled,
                        IsTwoFactorForced = SettingsHelper.GetTwoFactorAuthForceInfo()
                    };
                    return new OperationDataResult<GoogleAuthInfoModel>(true, model);
                }
            }
            catch (Exception)
            {
                return new OperationDataResult<GoogleAuthInfoModel>(false);
            }

            return new OperationDataResult<GoogleAuthInfoModel>(false);
        }

        [HttpPost]
        [Route("api/auth/google-auth-info")]
        public async Task<OperationResult> UpdateGoogleAuthenticatorInfo(GoogleAuthInfoModel requestModel)
        {
            try
            {
                var user = await _userService.GetCurrentUserAsync();
                if (user != null)
                {
                    user.TwoFactorEnabled = requestModel.IsTwoFactorEnabled;
                    var updateResult = _userManager.UpdateAsync(user).Result;
                    if (updateResult.Succeeded)
                    {
                        return new OperationResult(true);
                    }
                }
            }
            catch (Exception)
            {
                return new OperationResult(false);
            }

            return new OperationResult(false);
        }

        [HttpDelete]
        [Route("api/auth/google-auth-info")]
        public async Task<OperationResult> DeleteGoogleAuthenticatorInfo()
        {
            try
            {
                var user = await _userService.GetCurrentUserAsync();
                if (user != null)
                {
                    user.GoogleAuthenticatorSecretKey = null;
                    user.IsGoogleAuthenticatorEnabled = false;
                    var updateResult = _userManager.UpdateAsync(user).Result;
                    if (updateResult.Succeeded)
                    {
                        return new OperationResult(true);
                    }
                }
            }
            catch (Exception)
            {
                return new OperationResult(false);
            }

            return new OperationResult(false);
        }

        /// <summary>
        /// Get secret key and barcode to enable GoogleAuthenticator for account
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [Route("api/auth/google-auth-key")]
        public async Task<OperationDataResult<GoogleAuthenticatorModel>> GetGoogleAuthenticator(LoginModel loginModel)
        {
            // check model
            if (!ModelState.IsValid)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(false,
                    LocaleHelper.GetString("InvalidUserNameOrPassword"));
            }

            // try to sign in with user creds
            var user = await _userManager.FindByNameAsync(loginModel.Username);
            if (user == null)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(false,
                    LocaleHelper.GetString("UserNameOrPasswordIncorrect"));
            }

            if (await _userManager.CheckPasswordAsync(user, loginModel.Password))
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(false,
                    LocaleHelper.GetString("UserNameOrPasswordIncorrect"));
            }

            // check if two factor is enabled
            var isTwoFactorAuthForced = SettingsHelper.GetTwoFactorAuthForceInfo();
            if (!user.TwoFactorEnabled && !isTwoFactorAuthForced)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(true);
            }

            // generate PSK and barcode
            if (!string.IsNullOrEmpty(user.GoogleAuthenticatorSecretKey) && user.IsGoogleAuthenticatorEnabled)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(true, new GoogleAuthenticatorModel());
            }

            var psk = KeyGeneration.GenerateRandomKey(20);
            var barcodeUrl = KeyUrl.GetTotpUrl(psk, user.UserName) + "&issuer=EformApplication";
            var model = new GoogleAuthenticatorModel
            {
                PSK = Base32Helper.ToBase32String(psk),
                BarcodeUrl = HttpUtility.UrlEncode(barcodeUrl)
            };
            // write PSK to the user entity
            user.GoogleAuthenticatorSecretKey = model.PSK;
            var updateResult = _userManager.UpdateAsync(user).Result;
            if (!updateResult.Succeeded)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(false,
                    LocaleHelper.GetString("ErrorWhileUpdatingPSK"));
            }

            // return
            return new OperationDataResult<GoogleAuthenticatorModel>(true, model);
        }
    }
}