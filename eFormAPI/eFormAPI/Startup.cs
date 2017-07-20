using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(eFormAPI.Web.Startup))]

namespace eFormAPI.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}