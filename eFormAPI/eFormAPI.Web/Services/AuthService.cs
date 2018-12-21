using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.WritableOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;
using OtpSharp;

namespace eFormAPI.Web.Services
{
    public class AuthService : IAuthService
    {
        private readonly IOptions<EformTokenOptions> _tokenOptions;
        private readonly IUserService _userService;
        private readonly IWritableOptions<ApplicationSettings> _appSettings;
        private readonly IClaimsService _claimsService;
        private readonly IUserClaimsPrincipalFactory<EformUser> _userClaimsPrincipalFactory;
        private readonly ILocalizationService _localizationService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<AuthService> _logger;
        private readonly UserManager<EformUser> _userManager;
        private readonly RoleManager<EformRole> _roleManager;
        private readonly SignInManager<EformUser> _signInManager;

        public AuthService(IOptions<EformTokenOptions> tokenOptions,
            ILogger<AuthService> logger,
            IWritableOptions<ApplicationSettings> appSettings,
            RoleManager<EformRole> roleManager,
            SignInManager<EformUser> signInManager,
            UserManager<EformUser> userManager,
            IUserService userService,
            ILocalizationService localizationService,
            IClaimsService claimsService,
            IUserClaimsPrincipalFactory<EformUser> userClaimsPrincipalFactory, IHttpContextAccessor httpContextAccessor)
        {
            _tokenOptions = tokenOptions;
            _logger = logger;
            _appSettings = appSettings;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _userManager = userManager;
            _userService = userService;
            _localizationService = localizationService;
            _claimsService = claimsService;
            _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<OperationDataResult<AuthorizeResult>> AuthenticateUser(LoginModel model)
        {
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
                return new OperationDataResult<AuthorizeResult>(false, "Empty username or password");

            SignInResult signInResult =
                await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, lockoutOnFailure: true);

            if (!signInResult.Succeeded && !signInResult.RequiresTwoFactor)
            {
                if (signInResult.IsLockedOut)
                {
                    return new OperationDataResult<AuthorizeResult>(false,
                        "Locked Out. Please, try again after 10 mins");
                }

                // Credentials are invalid, or account doesn't exist
                return new OperationDataResult<AuthorizeResult>(false, "Incorrect password.");
            }

            EformUser user = await _userService.GetByUsernameAsync(model.Username);
            if (user == null)
                return new OperationDataResult<AuthorizeResult>(false,
                    $"User with username {model.Username} not found");

            // Confirmed email check
            if (!user.EmailConfirmed)
            {
                return new OperationDataResult<AuthorizeResult>(false, $"Email {user.Email} not confirmed");
            }

            // TwoFactor check
            string psk = user.GoogleAuthenticatorSecretKey;
            string code = model.Code;
            bool isTwoFactorAuthForced = _appSettings.Value.IsTwoFactorForced;
            if (user.TwoFactorEnabled || isTwoFactorAuthForced)
            {
                // check input params
                if (string.IsNullOrEmpty(psk) || string.IsNullOrEmpty(code))
                {
                    return new OperationDataResult<AuthorizeResult>(false, "PSK or code is empty");
                }

                if (psk != user.GoogleAuthenticatorSecretKey)
                {
                    return new OperationDataResult<AuthorizeResult>(false, "PSK is invalid");
                }

                // check code
                Totp otp = new Totp(Base32.FromBase32String(user.GoogleAuthenticatorSecretKey));
                bool isCodeValid = otp.VerifyTotp(code, out long timeStepMatched, new VerificationWindow(300, 300));
                if (!isCodeValid)
                {
                    return new OperationDataResult<AuthorizeResult>(false, "Invalid code");
                }

                // update user entity
                if (!user.IsGoogleAuthenticatorEnabled)
                {
                    user.IsGoogleAuthenticatorEnabled = true;
                    IdentityResult updateResult = _userManager.UpdateAsync(user).Result;
                    if (!updateResult.Succeeded)
                    {
                        return new OperationDataResult<AuthorizeResult>(false, "PSK or code is empty");
                    }
                }
            }

            string token = await GenerateToken(user);
            IList<string> roleList = _userManager.GetRolesAsync(user).Result;
            if (!roleList.Any())
            {
                return new OperationDataResult<AuthorizeResult>(false, $"Role for user {model.Username} not found");
            }

            return new OperationDataResult<AuthorizeResult>(true, new AuthorizeResult
            {
                Id = user.Id,
                access_token = token,
                userName = user.UserName,
                role = roleList.FirstOrDefault()
            });
        }

        public async Task<string> GenerateToken(EformUser user)
        {
            if (user != null)
            {
                List<Claim> claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };
                if (!string.IsNullOrEmpty(user.Locale))
                {
                    claims.Add(new Claim("locale", user.Locale));
                }

                // Add user and roles claims
                IList<Claim> userClaims = _userManager.GetClaimsAsync(user).Result;
                IList<string> userRoles = _userManager.GetRolesAsync(user).Result;
                claims.AddRange(userClaims);
                foreach (string userRole in userRoles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, userRole));
                    EformRole role = _roleManager.FindByNameAsync(userRole).Result;
                    if (role != null)
                    {
                        IList<Claim> roleClaims = _roleManager.GetClaimsAsync(role).Result;
                        foreach (Claim roleClaim in roleClaims)
                        {
                            claims.Add(roleClaim);
                        }
                    }
                }

                // Permissions
                if (userRoles.Contains(EformRole.Admin))
                {
                    claims.AddRange(_claimsService.GetAllAuthClaims());
                }
                else
                {
                    claims.AddRange(_claimsService.GetUserClaims(user.Id));
                }

                ClaimsPrincipal principal = await _userClaimsPrincipalFactory.CreateAsync(user);
                foreach (Claim claim in claims)
                {
                    ((ClaimsIdentity) principal.Identity).AddClaim(claim);
                }

                await _httpContextAccessor.HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                    principal, new AuthenticationProperties
                    {
                        IsPersistent = false
                    });


                SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenOptions.Value.SigningKey));
                SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                JwtSecurityToken token = new JwtSecurityToken(_tokenOptions.Value.Issuer,
                    _tokenOptions.Value.Issuer,
                    claims.ToArray(),
                    expires: DateTime.Now.AddHours(10),
                    signingCredentials: creds);

                return new JwtSecurityTokenHandler().WriteToken(token);
            }

            return null;
        }


        public async Task<OperationResult> LogOut()
        {
            try
            {
                await _signInManager.SignOutAsync();
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                Console.WriteLine(e);
                return new OperationResult(false, e.Message);
            }

            return new OperationResult(true);
        }

        public OperationDataResult<bool> TwoFactorAuthForceInfo()
        {
            try
            {
                return new OperationDataResult<bool>(true, _appSettings.Value.IsTwoFactorForced);
            }
            catch (Exception)
            {
                return new OperationDataResult<bool>(false);
            }
        }

        public async Task<OperationDataResult<GoogleAuthInfoModel>> GetGoogleAuthenticatorInfo()
        {
            try
            {
                EformUser user = await _userService.GetCurrentUserAsync();
                if (user != null)
                {
                    GoogleAuthInfoModel model = new GoogleAuthInfoModel()
                    {
                        PSK = user.GoogleAuthenticatorSecretKey,
                        IsTwoFactorEnabled = user.TwoFactorEnabled,
                        IsTwoFactorForced = _appSettings.Value.IsTwoFactorForced
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

        public async Task<OperationResult> UpdateGoogleAuthenticatorInfo(GoogleAuthInfoModel requestModel)
        {
            try
            {
                EformUser user = await _userService.GetCurrentUserAsync();
                if (user != null)
                {
                    user.TwoFactorEnabled = requestModel.IsTwoFactorEnabled;
                    IdentityResult updateResult = _userManager.UpdateAsync(user).Result;
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

        public async Task<OperationResult> DeleteGoogleAuthenticatorInfo()
        {
            try
            {
                EformUser user = await _userService.GetCurrentUserAsync();
                if (user != null)
                {
                    user.GoogleAuthenticatorSecretKey = null;
                    user.IsGoogleAuthenticatorEnabled = false;
                    IdentityResult updateResult = _userManager.UpdateAsync(user).Result;
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

        public async Task<OperationDataResult<GoogleAuthenticatorModel>> GetGoogleAuthenticator(LoginModel loginModel)
        {
            // try to sign in with user creds
            EformUser user = await _userManager.FindByNameAsync(loginModel.Username);
            if (user == null)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(false,
                    _localizationService.GetString("UserNameOrPasswordIncorrect"));
            }

            SignInResult signInResult =
                await _signInManager.CheckPasswordSignInAsync(user, loginModel.Password, true);

            if (!signInResult.Succeeded)
            {
                if (signInResult.IsLockedOut)
                {
                    return new OperationDataResult<GoogleAuthenticatorModel>(false,
                        "Locked Out. Please, try again after 10 mins");
                }

                // Credentials are invalid, or account doesn't exist
                return new OperationDataResult<GoogleAuthenticatorModel>(false,
                    _localizationService.GetString("UserNameOrPasswordIncorrect"));
            }

            // check if two factor is enabled
            bool isTwoFactorAuthForced = _appSettings.Value.IsTwoFactorForced;
            if (!user.TwoFactorEnabled && !isTwoFactorAuthForced)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(true);
            }

            // generate PSK and barcode
            if (!string.IsNullOrEmpty(user.GoogleAuthenticatorSecretKey) && user.IsGoogleAuthenticatorEnabled)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(true, new GoogleAuthenticatorModel());
            }

            byte[] psk = KeyGeneration.GenerateRandomKey(20);
            string barcodeUrl = KeyUrl.GetTotpUrl(psk, user.UserName) + "&issuer=EformApplication";
            GoogleAuthenticatorModel model = new GoogleAuthenticatorModel
            {
                PSK = Base32.ToBase32String(psk),
                BarcodeUrl = HttpUtility.UrlEncode(barcodeUrl)
            };
            // write PSK to the user entity
            user.GoogleAuthenticatorSecretKey = model.PSK;
            IdentityResult updateResult = _userManager.UpdateAsync(user).Result;
            if (!updateResult.Succeeded)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(false,
                    _localizationService.GetString("ErrorWhileUpdatingPSK"));
            }

            // return
            return new OperationDataResult<GoogleAuthenticatorModel>(true, model);
        }
    }
}