using System.Threading.Tasks;
using Base32;
using eFormAPI.Web.Infrastructure.Data.Entities;
using Microsoft.AspNet.Identity;
using OtpSharp;

namespace eFormAPI.Web.Infrastructure.Identity.Providers
{
    public class GoogleAuthenticatorTokenProvider : IUserTokenProvider<EformUser, int>
    {
        public Task<string> GenerateAsync(string purpose, UserManager<EformUser, int> manager, EformUser user)
        {
            return Task.FromResult((string) null);
        }

        public Task<bool> ValidateAsync(string purpose, string token, UserManager<EformUser, int> manager,
            EformUser user)
        {
            long timeStepMatched = 0;

            var otp = new Totp(Base32Encoder.Decode(user.GoogleAuthenticatorSecretKey));
            var valid = otp.VerifyTotp(token, out timeStepMatched, new VerificationWindow(2, 2));

            return Task.FromResult(valid);
        }

        public Task NotifyAsync(string token, UserManager<EformUser, int> manager, EformUser user)
        {
            return Task.FromResult(true);
        }

        public Task<bool> IsValidProviderForUserAsync(UserManager<EformUser, int> manager, EformUser user)
        {
            return Task.FromResult(user.IsGoogleAuthenticatorEnabled);
        }
    }
}