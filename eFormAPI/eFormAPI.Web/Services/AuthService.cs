/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using PureOtp;

namespace eFormAPI.Web.Services
{
    using Cache.AuthCache;
    using Infrastructure.Models.Auth;
    using System;
    using System.Collections.Generic;
    using System.IdentityModel.Tokens.Jwt;
    using System.Linq;
    using System.Security.Claims;
    using System.Text;
    using System.Threading.Tasks;
    using System.Web;
    using Abstractions;
    using eFormAPI.Web.Abstractions.Security;
    using Hosting.Helpers.DbOptions;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.IdentityModel.Tokens;
    using Microting.EformAngularFrontendBase.Infrastructure.Const;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;

    public class AuthService : IAuthService
    {
        private readonly IOptions<EformTokenOptions> _tokenOptions;
        private readonly IUserService _userService;
        private readonly IDbOptions<ApplicationSettings> _appSettings;
        private readonly IClaimsService _claimsService;
        private readonly ILocalizationService _localizationService;
        private readonly IAuthCacheService _authCacheService;
        private readonly ILogger<AuthService> _logger;
        private readonly UserManager<EformUser> _userManager;
        private readonly RoleManager<EformRole> _roleManager;
        private readonly SignInManager<EformUser> _signInManager;

        public AuthService(IOptions<EformTokenOptions> tokenOptions,
            ILogger<AuthService> logger,
            IDbOptions<ApplicationSettings> appSettings,
            RoleManager<EformRole> roleManager,
            SignInManager<EformUser> signInManager,
            UserManager<EformUser> userManager,
            IUserService userService,
            ILocalizationService localizationService,
            IClaimsService claimsService,
            IAuthCacheService authCacheService)
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
            _authCacheService = authCacheService;
        }

        public async Task<OperationDataResult<EformAuthorizeResult>> AuthenticateUser(LoginModel model)
        {
            Log.LogEvent("AuthService.AuthenticateUser: called");
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
                return new OperationDataResult<EformAuthorizeResult>(false, "Empty username or password");

            var user = await _userService.GetByUsernameAsync(model.Username);
            if (user == null)
                return new OperationDataResult<EformAuthorizeResult>(false,
                    $"User with username {model.Username} not found");

            var signInResult =
                await _signInManager.CheckPasswordSignInAsync(user, model.Password, true);

            if (!signInResult.Succeeded && !signInResult.RequiresTwoFactor)
            {
                if (signInResult.IsLockedOut)
                {
                    return new OperationDataResult<EformAuthorizeResult>(false,
                        "Locked Out. Please, try again after 10 min");
                }

                // Credentials are invalid, or account doesn't exist
                return new OperationDataResult<EformAuthorizeResult>(false, "Incorrect password.");
            }

            // Confirmed email check
            if (!user.EmailConfirmed)
            {
                return new OperationDataResult<EformAuthorizeResult>(false, $"Email {user.Email} not confirmed");
            }

            // TwoFactor check
            var psk = user.GoogleAuthenticatorSecretKey;
            var code = model.Code;
            var isTwoFactorAuthForced = _appSettings.Value.IsTwoFactorForced;
            if (user.TwoFactorEnabled || isTwoFactorAuthForced)
            {
                // check input params
                if (string.IsNullOrEmpty(psk) || string.IsNullOrEmpty(code))
                {
                    return new OperationDataResult<EformAuthorizeResult>(false, "PSK or code is empty");
                }

                if (psk != user.GoogleAuthenticatorSecretKey)
                {
                    return new OperationDataResult<EformAuthorizeResult>(false, "PSK is invalid");
                }

                // check code
                var otp = new Totp(Base32.FromBase32String(user.GoogleAuthenticatorSecretKey));
                var isCodeValid = otp.VerifyTotp(code, out _, new VerificationWindow(300, 300));
                if (!isCodeValid)
                {
                    return new OperationDataResult<EformAuthorizeResult>(false, "Invalid code");
                }

                // update user entity
                if (!user.IsGoogleAuthenticatorEnabled)
                {
                    user.IsGoogleAuthenticatorEnabled = true;
                    var updateResult = _userManager.UpdateAsync(user).Result;
                    if (!updateResult.Succeeded)
                    {
                        return new OperationDataResult<EformAuthorizeResult>(false, "PSK or code is empty");
                    }
                }
            }

            var token = await GenerateToken(user);
            var roleList = _userManager.GetRolesAsync(user).Result;
            if (!roleList.Any())
            {
                return new OperationDataResult<EformAuthorizeResult>(false,
                    $"Role for user {model.Username} not found");
            }

            return new OperationDataResult<EformAuthorizeResult>(true, new EformAuthorizeResult
            {
                Id = user.Id,
                access_token = token,
                userName = user.UserName,
                role = roleList.FirstOrDefault(),
                FirstName = user.FirstName,
                LastName = user.LastName
            });
        }

        public async Task<OperationDataResult<EformAuthorizeResult>> RefreshToken()
        {
            var user = await _userService.GetByIdAsync(_userService.UserId);
            if (user == null)
                return new OperationDataResult<EformAuthorizeResult>(false,
                    $"User with id {_userService.UserId} not found");

            var token = await GenerateToken(user);
            var roleList = await _userManager.GetRolesAsync(user);
            if (!roleList.Any())
            {
                return new OperationDataResult<EformAuthorizeResult>(false,
                    $"Role for user {_userService.UserId} not found");
            }

            return new OperationDataResult<EformAuthorizeResult>(true, new EformAuthorizeResult
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
                var timeStamp = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeMilliseconds();
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(AuthConsts.ClaimLastUpdateKey, timeStamp.ToString())
                };

                if (!string.IsNullOrEmpty(user.Locale))
                {
                    claims.Add(new Claim("locale", user.Locale));
                }

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

                var userInMemoryClaims = await _claimsService.GetUserPermissions(
                    user.Id,
                    userRoles.Contains(EformRole.Admin));

                // Add to memory
                var authItem = new AuthItem
                {
                    TimeStamp = timeStamp,
                    Claims = userInMemoryClaims
                };

                _authCacheService.Set(authItem, user.Id);

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenOptions.Value.SigningKey));
                var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(_tokenOptions.Value.Issuer,
                    _tokenOptions.Value.Issuer,
                    claims.ToArray(),
                    expires: DateTime.Now.AddHours(24),
                    signingCredentials: credentials);

                return new JwtSecurityTokenHandler().WriteToken(token);
            }

            return null;
        }


        public OperationDataResult<Dictionary<string, string>> GetCurrentUserClaims()
        {
            try
            {
                var result = new Dictionary<string, string>();
                var userId = _userService.UserId;
                if (userId < 1)
                {
                    throw new Exception("Current user not found!");
                }

                var auth = _authCacheService.TryGetValue(_userService.UserId);

                if (auth == null)
                {
                    // TODO if user info is null
                    return new OperationDataResult<Dictionary<string, string>>(true, result);
                }

                foreach (var authClaim in auth.Claims)
                {
                    result.Add(authClaim.Type, authClaim.Value);
                }

                return new OperationDataResult<Dictionary<string, string>>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<Dictionary<string, string>>(false, e.Message);
            }
        }

        public OperationResult LogOut()
        {
            try
            {
                _authCacheService.Remove(_userService.UserId);
                return new OperationResult(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                Console.WriteLine(e);
                return new OperationResult(false, e.Message);
            }
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
            // try to sign in with user credentials
            var user = await _userManager.FindByNameAsync(loginModel.Username);
            if (user == null)
            {
                return new OperationDataResult<GoogleAuthenticatorModel>(false,
                    _localizationService.GetString("UserNameOrPasswordIncorrect"));
            }

            var signInResult =
                await _signInManager.CheckPasswordSignInAsync(user, loginModel.Password, true);

            if (!signInResult.Succeeded)
            {
                if (signInResult.IsLockedOut)
                {
                    return new OperationDataResult<GoogleAuthenticatorModel>(false,
                        "Locked Out. Please, try again after 10 min");
                }

                // Credentials are invalid, or account doesn't exist
                return new OperationDataResult<GoogleAuthenticatorModel>(false,
                    _localizationService.GetString("UserNameOrPasswordIncorrect"));
            }

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
                PSK = Base32.ToBase32String(psk),
                BarcodeUrl = HttpUtility.UrlEncode(barcodeUrl)
            };
            // write PSK to the user entity
            user.GoogleAuthenticatorSecretKey = model.PSK;
            var updateResult = _userManager.UpdateAsync(user).Result;
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