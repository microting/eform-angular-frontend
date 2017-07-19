using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace eFormAPI.Web.Infrastructure.Data.Entities
{
    public class EformUser : IdentityUser<int, EformUserLogin, EformUserRole,
        EformUserClaim>
    {
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