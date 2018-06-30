using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EformBase.Pn.Infrastructure.Data.Entities
{
    public class EformUser : IdentityUser<int, EformUserLogin, EformUserRole,
        EformUserClaim>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Locale { get; set; }

        public bool IsGoogleAuthenticatorEnabled { get; set; }
        public string GoogleAuthenticatorSecretKey { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(
            UserManager<EformUser, int> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in
            // CookieAuthenticationOptions.AuthenticationType 
            var userIdentity = await manager.CreateIdentityAsync(
                this, authenticationType);
            // Add custom user claims here 
            return userIdentity;
        }
    }
}