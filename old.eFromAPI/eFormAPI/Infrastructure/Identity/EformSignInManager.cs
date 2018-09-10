using eFormApi.BasePn.Infrastructure.Data.Entities;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;

namespace eFormAPI.Web.Infrastructure.Identity
{
    public class EformSignInManager : SignInManager<EformUser, int>
    {
        public EformSignInManager(UserManager<EformUser, int> userManager,
            IAuthenticationManager authenticationManager) : base(userManager, authenticationManager)
        {
        }
    }
}