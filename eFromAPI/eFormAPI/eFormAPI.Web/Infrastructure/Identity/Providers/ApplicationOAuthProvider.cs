
//using System;
//using System.Collections.Generic;
//using System.Security.Claims;
//using System.Threading.Tasks;
//using eFormAPI.Web.Infrastructure.Helpers;

//namespace eFormAPI.Web.Infrastructure.Identity.Providers
//{
//    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
//    {
//        private readonly string _publicClientId;

//        public ApplicationOAuthProvider(string publicClientId)
//        {
//            _publicClientId = publicClientId ?? throw new ArgumentNullException(nameof(publicClientId));
//        }

//        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
//        {
//            var userManager = context.OwinContext.GetUserManager<EformUserManager>();
//            var user = await userManager.FindAsync(context.UserName, context.Password);
//            if (user == null)
//            {
//                context.SetError("The user name or password is incorrect.", "The user name or password is incorrect.");
//                return;
//            }
//            // get role
//            var role = userManager.GetRolesAsync(user.Id).Result?.FirstOrDefault();
//            // TwoFactor check
//            var requestData = await context.Request.ReadFormAsync();
//            var psk = user.GoogleAuthenticatorSecretKey;
//            var code = requestData.Get("code");
//            var isTwoFactorAuthForced = SettingsHelper.GetTwoFactorAuthForceInfo();
//            if (user.TwoFactorEnabled || isTwoFactorAuthForced)
//            {
//                // check input params
//                if (string.IsNullOrEmpty(psk) || string.IsNullOrEmpty(code))
//                {
//                    context.SetError("PSK or code is empty", "PSK or code is empty");
//                    return;
//                }
//                if (psk != user.GoogleAuthenticatorSecretKey)
//                {
//                    context.SetError("PSK is invalid", "PSK is invalid");
//                    return;
//                }
//                // check code
//                var otp = new Totp(Base32Encoder.Decode(user.GoogleAuthenticatorSecretKey));
//                var isCodeValid = otp.VerifyTotp(code,  out long timeStepMatched, new VerificationWindow(5, 5));
//                if (!isCodeValid)
//                {
//                    context.SetError("Invalid code", "Invalid code");
//                    return;
//                }
//                // update user entity
//                if (!user.IsGoogleAuthenticatorEnabled)
//                {
//                    user.IsGoogleAuthenticatorEnabled = true;
//                    var updateResult = userManager.UpdateAsync(user).Result;
//                    if (!updateResult.Succeeded)
//                    {
//                        context.SetError("PSK or code is empty", "PSK or code is empty");
//                        return;
//                    }
//                }
//            }
//            var oAuthIdentity = await user.GenerateUserIdentityAsync(userManager,
//                OAuthDefaults.AuthenticationType);

//            // Add custom claims
//            if (!user.Locale.IsNullOrEmpty())
//            {
//                oAuthIdentity.AddClaim(new Claim("locale", user.Locale));
//            }
            

//            var cookiesIdentity = await user.GenerateUserIdentityAsync(userManager,
//                CookieAuthenticationDefaults.AuthenticationType);

//            var properties = CreateProperties(user, role);
//            var ticket = new AuthenticationTicket(oAuthIdentity, properties);
//            context.Validated(ticket);
//            context.Request.Context.Authentication.SignIn(cookiesIdentity);
//        }

//        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
//        {
//            foreach (var property in context.Properties.Dictionary)
//            {
//                context.AdditionalResponseParameters.Add(property.Key, property.Value);
//            }

//            return Task.FromResult<object>(null);
//        }

//        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
//        {
//            // Resource owner password credentials does not provide a client ID.
//            if (context.ClientId == null)
//            {
//                context.Validated();
//            }

//            return Task.FromResult<object>(null);
//        }

//        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
//        {
//            if (context.ClientId == _publicClientId)
//            {
//                var expectedRootUri = new Uri(context.Request.Uri, "/");

//                if (expectedRootUri.AbsoluteUri == context.RedirectUri)
//                {
//                    context.Validated();
//                }
//            }

//            return Task.FromResult<object>(null);
//        }

//        public static AuthenticationProperties CreateProperties(EformUser user, string role)
//        {
//            IDictionary<string, string> data = new Dictionary<string, string>
//            {
//                {"userId", user.Id.ToString()},
//                {"userName", user.UserName},
//                {"role", role},
                
//            };
//            if (!user.Locale.IsNullOrEmpty())
//            {
//                data.Add("locale", user.Locale);
//            }
//            return new AuthenticationProperties(data);
//        }
//    }
//}