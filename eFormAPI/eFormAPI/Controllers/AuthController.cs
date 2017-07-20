using System.Net.Http;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Identity;
using eFromAPI.Common.API;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    [RoutePrefix("api/auth")]
    public class AuthController : ApiController
    {
        private EformUserManager _userManager;

        public AuthController()
        {
        }

        public AuthController(EformUserManager userManager,
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }
        private IAuthenticationManager Authentication => Request.GetOwinContext().Authentication;

        public EformUserManager UserManager
        {
            get => _userManager ?? Request.GetOwinContext().GetUserManager<EformUserManager>();
            private set => _userManager = value;
        }

        // POST api/Account/Logout
        [Route("logout")]
        public OperationResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return new OperationResult(true);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }
    }
}