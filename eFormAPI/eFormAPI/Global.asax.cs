using System.Diagnostics;
using System.Web.Http;
using System.Web.Mvc;

namespace eFormAPI.Web
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            AutofacConfig.ConfigureContainer();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);

            // Enable swagger
            if (Debugger.IsAttached)
            {
                SwaggerConfig.Register(GlobalConfiguration.Configuration);
            }
        }
    }
}