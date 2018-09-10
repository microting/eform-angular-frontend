//using System;
//using System.Web;
//using eFormAPI.Web.Infrastructure.Helpers;
//using eFormAPI.Web.Infrastructure.Identity;
//using eFormAPI.Web.Infrastructure.Models.Auth;

//namespace eFormAPI.Web.Controllers
//{
//    [Authorize]
//    public class AuthController : ApiController
//    {
//        private EformUserManager _userManager;

//        public AuthController()
//        {
//        }

//        public AuthController(EformUserManager userManager,
//            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
//        {
//            UserManager = userManager;
//            AccessTokenFormat = accessTokenFormat;
//        }

//        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; }
//        private IAuthenticationManager Authentication => Request.GetOwinContext().Authentication;

//        public EformUserManager UserManager
//        {
//            get => _userManager ?? Request.GetOwinContext().GetUserManager<EformUserManager>();
//            private set => _userManager = value;
//        }

//        [HttpGet]
//        [Route("api/auth/logout")]
//        public OperationResult Logout()
//        {
//            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
//            Authentication.SignOut(OAuthDefaults.AuthenticationType);
//            return new OperationResult(true);
//        }

//        [HttpGet]
//        [AllowAnonymous]
//        [Route("api/auth/two-factor-info")]
//        public OperationDataResult<bool> TwoFactorAuthForceInfo()
//        {
//            try
//            {
//                return new OperationDataResult<bool>(true, SettingsHelper.GetTwoFactorAuthForceInfo());
//            }
//            catch (Exception)
//            {
//                return new OperationDataResult<bool>(false);
//            }
//        }

//        [HttpGet]
//        [Route("api/auth/google-auth-info")]
//        public OperationDataResult<GoogleAuthInfoModel> GetGoogleAuthenticatorInfo()
//        {
//            try
//            {
//                var user = UserManager.FindById(User.Identity.GetUserId<int>());
//                if (user != null)
//                {
//                    var model = new GoogleAuthInfoModel()
//                    {
//                        PSK = user.GoogleAuthenticatorSecretKey,
//                        IsTwoFactorEnabled = user.TwoFactorEnabled,
//                        IsTwoFactorForced = SettingsHelper.GetTwoFactorAuthForceInfo()
//                    };
//                    return new OperationDataResult<GoogleAuthInfoModel>(true, model);
//                }
//            }
//            catch (Exception)
//            {
//                return new OperationDataResult<GoogleAuthInfoModel>(false);
//            }
//            return new OperationDataResult<GoogleAuthInfoModel>(false);
//        }

//        [HttpPost]
//        [Route("api/auth/google-auth-info")]
//        public OperationResult UpdateGoogleAuthenticatorInfo(GoogleAuthInfoModel requestModel)
//        {
//            try
//            {
//                var user = UserManager.FindById(User.Identity.GetUserId<int>());
//                if (user != null)
//                {
//                    user.TwoFactorEnabled = requestModel.IsTwoFactorEnabled;
//                    var updateResult = UserManager.UpdateAsync(user).Result;
//                    if (updateResult.Succeeded)
//                    {
//                        return new OperationResult(true);
//                    }
//                }
//            }
//            catch (Exception)
//            {
//                return new OperationResult(false);
//            }
//            return new OperationResult(false);
//        }

//        [HttpDelete]
//        [Route("api/auth/google-auth-info")]
//        public OperationResult DeleteGoogleAuthenticatorInfo()
//        {
//            try
//            {
//                var user = UserManager.FindById(User.Identity.GetUserId<int>());
//                if (user != null)
//                {
//                    user.GoogleAuthenticatorSecretKey = null;
//                    user.IsGoogleAuthenticatorEnabled = false;
//                    var updateResult = UserManager.UpdateAsync(user).Result;
//                    if (updateResult.Succeeded)
//                    {
//                        return new OperationResult(true);
//                    }
//                }
//            }
//            catch (Exception)
//            {
//                return new OperationResult(false);
//            }
//            return new OperationResult(false);
//        }

//        /// <summary>
//        /// Get secret key and barcode to enable GoogleAuthenticator for account
//        /// </summary>
//        /// <returns></returns>
//        [HttpPost]
//        [AllowAnonymous]
//        [Route("api/auth/google-auth-key")]
//        public OperationDataResult<GoogleAuthenticatorModel> GetGoogleAuthenticator(LoginModel loginModel)
//        {
//            // check model
//            if (!ModelState.IsValid)
//            {
//                return new OperationDataResult<GoogleAuthenticatorModel>(false, LocaleHelper.GetString("InvalidUserNameOrPassword"));
//            }
//            // try to sign in with user creds
//            var user = UserManager.Find(loginModel.Username, loginModel.Password);
//            if (user == null)
//            {
//                return new OperationDataResult<GoogleAuthenticatorModel>(false,
//                    LocaleHelper.GetString("UserNameOrPasswordIncorrect"));
//            }
//            // check if two factor is enabled
//            var isTwoFactorAuthForced = SettingsHelper.GetTwoFactorAuthForceInfo();
//            if (!user.TwoFactorEnabled && !isTwoFactorAuthForced)
//            {
//                return new OperationDataResult<GoogleAuthenticatorModel>(true);
//            }
//            // generate PSK and barcode
//            if (!string.IsNullOrEmpty(user.GoogleAuthenticatorSecretKey) && user.IsGoogleAuthenticatorEnabled)
//            {
//                return new OperationDataResult<GoogleAuthenticatorModel>(true, new GoogleAuthenticatorModel());
//            }
//            var psk = KeyGeneration.GenerateRandomKey(20);
//            var barcodeUrl = KeyUrl.GetTotpUrl(psk, user.UserName) + "&issuer=EformApplication";
//            var model = new GoogleAuthenticatorModel
//            {
//                PSK = Base32Encoder.Encode(psk),
//                BarcodeUrl = HttpUtility.UrlEncode(barcodeUrl)
//            };
//            // write PSK to the user entity
//            user.GoogleAuthenticatorSecretKey = model.PSK;
//            var updateResult = UserManager.UpdateAsync(user).Result;
//            if (!updateResult.Succeeded)
//            {
//                return new OperationDataResult<GoogleAuthenticatorModel>(false, LocaleHelper.GetString("ErrorWhileUpdatingPSK"));
//            }
//            // return
//            return new OperationDataResult<GoogleAuthenticatorModel>(true, model);
//        }

//        protected override void Dispose(bool disposing)
//        {
//            if (disposing && _userManager != null)
//            {
//                _userManager.Dispose();
//                _userManager = null;
//            }

//            base.Dispose(disposing);
//        }
//    }
//}