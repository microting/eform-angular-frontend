using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using eFormAPI.Common.Infrastructure.Helpers;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Auth;
using eFormAPI.Core.Abstractions;
using eFormAPI.Core.Helpers;
using eFormAPI.Database.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using OtpSharp;

namespace eFormAPI.Core.Services.Identity
{
    public class AuthorizeResult
    {
        public int Id { get; set; }
        public string role { get; set; }
        public string access_token { get; set; }
        public string token_type { get; set; }
        public string expires_in { get; set; }
        public string userName { get; set; }
    }

    public class AuthService : IAuthService
    {
        private readonly IOptions<EformTokenOptions> _tokenOptions;
        private readonly IUserService _userService;
        private readonly IOptions<ApplicationSettings> _appSettings;
        private readonly ILogger<AuthService> _logger;
        private readonly UserManager<EformUser> _userManager;
        private readonly RoleManager<EformRole> _roleManager;
        private readonly SignInManager<EformUser> _signInManager;

        public AuthService(IOptions<EformTokenOptions> tokenOptions, ILogger<AuthService> logger,
            IOptions<ApplicationSettings> appSettings, RoleManager<EformRole> roleManager,
            SignInManager<EformUser> signInManager, UserManager<EformUser> userManager, IUserService userService)
        {
            _tokenOptions = tokenOptions;
            _logger = logger;
            _appSettings = appSettings;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _userManager = userManager;
            _userService = userService;
        }

        public async Task<OperationDataResult<AuthorizeResult>> AuthenticateUser(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return new OperationDataResult<AuthorizeResult>(false, "Empty username or password");

            var signInResult =
                await _signInManager.PasswordSignInAsync(username, password, false, lockoutOnFailure: true);

            if (!signInResult.Succeeded)
            {
                if (signInResult.IsLockedOut)
                {
                    return new OperationDataResult<AuthorizeResult>(false,
                        "Locked Out. Please, try again after 10 mins");
                }

                // Credentials are invalid, or account doesn't exist
                return new OperationDataResult<AuthorizeResult>(false, "Incorrect password.");
            }

            var user = await _userService.GetByUsernameAsync(username);
            if (user == null)
                return new OperationDataResult<AuthorizeResult>(false, "User with username {username} not found");

            // Confirmed email check
            if (!user.EmailConfirmed)
            {
                return new OperationDataResult<AuthorizeResult>(false, $"Email {user.Email} not confirmed");
            }

            var token = GenerateToken(user);
            var roleList = _userManager.GetRolesAsync(user).Result;
            if (!roleList.Any())
            {
                return new OperationDataResult<AuthorizeResult>(false, $"Role for user {username} not found");
            }

            // update last sign in date
            return new OperationDataResult<AuthorizeResult>(true, new AuthorizeResult
            {
                Id = user.Id,
                access_token = token,
                userName = user.UserName,
                role = roleList.FirstOrDefault()
            });
        }

        public string GenerateToken(EformUser user)
        {
            if (user != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                // Add user and roles claims
                var userClaims = _userManager.GetClaimsAsync(user).Result;
                var userRoles = _userManager.GetRolesAsync(user).Result;
                claims.AddRange(userClaims);
                foreach (var userRole in userRoles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, userRole));
                    var role = _roleManager.FindByNameAsync(userRole).Result;
                    if (role != null)
                    {
                        var roleClaims = _roleManager.GetClaimsAsync(role).Result;
                        foreach (var roleClaim in roleClaims)
                        {
                            claims.Add(roleClaim);
                        }
                    }
                }

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenOptions.Value.SigningKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(_tokenOptions.Value.Issuer,
                    _tokenOptions.Value.Issuer,
                    claims.ToArray(),
                    expires: DateTime.Now.AddMinutes(600),
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
                var user = await _userService.GetCurrentUserAsync();
                if (user != null)
                {
                    var model = new GoogleAuthInfoModel()
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

        public async Task<OperationDataResult<GoogleAuthenticatorModel>> GetGoogleAuthenticator(LoginModel loginModel)
        {
            // try to sign in with user creds
            var user = await _userManager.FindByNameAsync(loginModel.Username);
            if (user == null)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(false,
                    LocaleHelper.GetString("UserNameOrPasswordIncorrect"));
            }

            var signInResult =
                await _signInManager.PasswordSignInAsync(loginModel.Username, loginModel.Password, false, lockoutOnFailure: true);

            if (!signInResult.Succeeded)
            {
                if (signInResult.IsLockedOut)
                {
                    return new OperationDataResult<GoogleAuthenticatorModel>(false,
                        "Locked Out. Please, try again after 10 mins");
                }

                // Credentials are invalid, or account doesn't exist
                return new OperationDataResult<GoogleAuthenticatorModel>(false, 
                    LocaleHelper.GetString("UserNameOrPasswordIncorrect"));
            }

            //if (await _userManager.CheckPasswordAsync(user, loginModel.Password))
            //{
            //    return new OperationDataResult<GoogleAuthenticatorModel>(false,
            //        LocaleHelper.GetString("UserNameOrPasswordIncorrect"));
            //}

            // check if two factor is enabled
            var isTwoFactorAuthForced = _appSettings.Value.IsTwoFactorForced;
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