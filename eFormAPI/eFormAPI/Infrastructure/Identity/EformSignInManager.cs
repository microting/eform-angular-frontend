using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microting.eFormApi.BasePn.Infrastructure.Data.Entities;

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