using System;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Base32;
using eFormAPI.Web.Infrastructure.Identity;
using eFormAPI.Web.Infrastructure.Models.API;
using eFormAPI.Web.Infrastructure.Models.Auth;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using OtpSharp;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class AuthController : ApiController
    {
        private EformUserManager _userManager;

        public AuthController()
        {
        }

        public AuthController(EformUserManager userManager,
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; }
        private IAuthenticationManager Authentication => Request.GetOwinContext().Authentication;

        public EformUserManager UserManager
        {
            get => _userManager ?? Request.GetOwinContext().GetUserManager<EformUserManager>();
            private set => _userManager = value;
        }

        [HttpGet]
        [Route("api/auth/logout")]
        public OperationResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            Authentication.SignOut(OAuthDefaults.AuthenticationType);
            return new OperationResult(true);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/auth/two-factor-info")]
        public OperationDataResult<bool> TwoFactorAuthForceInfo()
        {
            try
            {
                var user = UserManager.Users.FirstOrDefault();
                if (user != null)
                {
                    var twoFactorEnabled = user.TwoFactorEnabled;
                    return new OperationDataResult<bool>(true, twoFactorEnabled);
                }
            }
            catch (Exception)
            {
                return new OperationDataResult<bool>(false);
            }
            return new OperationDataResult<bool>(false);
        }

        [HttpGet]
        [Route("api/auth/google-auth-info")]
        public OperationDataResult<GoogleAuthInfoModel> GetGoogleAuthenticatorInfo()
        {
            try
            {
                var user = UserManager.FindById(User.Identity.GetUserId<int>());
                if (user != null)
                {
                    var model = new GoogleAuthInfoModel()
                    {
                        PSK = user.GoogleAuthenticatorSecretKey
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

        [HttpDelete]
        [Route("api/auth/google-auth-info")]
        public OperationResult DeleteGoogleAuthenticatorInfo()
        {
            try
            {
                var user = UserManager.FindById(User.Identity.GetUserId<int>());
                if (user != null)
                {
                    user.GoogleAuthenticatorSecretKey = null;
                    user.IsGoogleAuthenticatorEnabled = false;
                    var updateResult = UserManager.UpdateAsync(user).Result;
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
        public OperationDataResult<GoogleAuthenticatorModel> GetGoogleAuthenticator(LoginModel loginModel)
        {
            // check model
            if (!ModelState.IsValid)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(false, "Invalid username or password");
            }
            // try to sign in with user creds
            var user = UserManager.Find(loginModel.Username, loginModel.Password);
            if (user == null)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(false,
                    "The user name or password is incorrect.");
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
                PSK = Base32Encoder.Encode(psk),
                BarcodeUrl = HttpUtility.UrlEncode(barcodeUrl)
            };
            // write PSK to the user entity
            user.GoogleAuthenticatorSecretKey = model.PSK;
            var updateResult = UserManager.UpdateAsync(user).Result;
            if (!updateResult.Succeeded)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(false, "Error while updating user PSK");
            }
            // return
            return new OperationDataResult<GoogleAuthenticatorModel>(true, model);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }
    }
}