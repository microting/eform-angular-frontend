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


//using System;
//using System.Configuration;
//using System.Linq;
//using System.Net.Http.Formatting;
//using System.Net.Http.Headers;
//using System.Web.Http;
//using System.Web.Mvc;
//using Autofac.Integration.WebApi;
//using eFormAPI.Web.Infrastructure.Data;
//using eFormAPI.Web.Infrastructure.Data.Entities;
//using eFormAPI.Web.Infrastructure.Identity;
//using Microsoft.AspNet.Identity;
//using Microsoft.AspNet.Identity.Owin;
//using Microsoft.Owin;
//using Microsoft.Owin.Security.Cookies;
//using Microsoft.Owin.Security.DataHandler.Encoder;
//using Microsoft.Owin.Security.OAuth;
//using Newtonsoft.Json;
//using Newtonsoft.Json.Serialization;
//using Owin;

//namespace eFormAPI.Web
//{
//    public class Startup
//    {
//        public void Configuration(IAppBuilder app)
//        {
//            HttpConfiguration httpConfig = new HttpConfiguration();

//            ConfigureOAuthTokenGeneration(app);

//            ConfigureOAuthTokenConsumption(app);

//            // Web api
//            ConfigureWebApi(httpConfig);
//            // Cors
//            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);

//            app.UseWebApi(httpConfig);

//            AreaRegistration.RegisterAllAreas();
//            AutofacConfig.ConfigureContainer();
//            GlobalConfiguration.Configure(WebApiConfig.Register);
//            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
//        }

//        private void ConfigureOAuthTokenGeneration(IAppBuilder app)
//        {
//            // Configure the db context and user manager to use a single instance per request
//            app.CreatePerOwinContext(BaseDbContext.Create);
//            app.CreatePerOwinContext<EformUserManager>(EformUserManager.Create);

//            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
//            {
//                //For Dev enviroment only (on production should be AllowInsecureHttp = false)
//                AllowInsecureHttp = true,
//                TokenEndpointPath = new PathString("/oauth/token"),
//                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
//                Provider = new CustomOAuthProvider(),
//                AccessTokenFormat = new CustomJwtFormat("http://localhost:59822")
//            };

//            // OAuth 2.0 Bearer Access Token Generation
//            app.UseOAuthAuthorizationServer(OAuthServerOptions);
//        }

//        private void ConfigureOAuthTokenConsumption(IAppBuilder app)
//        {
//            var issuer = "http://localhost:5000";
//            string audienceId = ConfigurationManager.AppSettings["as:AudienceId"];
//            byte[] audienceSecret =
//                TextEncodings.Base64Url.Decode(ConfigurationManager.AppSettings["as:AudienceSecret"]);

//            // Api controllers with an [Authorize] attribute will be validated with JWT
//            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions()
//            {
//            });


//            app.UseCookieAuthentication(new CookieAuthenticationOptions
//            {
//                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
//                LoginPath = new PathString("/Account/Login"),
//                Provider = new CookieAuthenticationProvider
//                {
//                    OnValidateIdentity = SecurityStampValidator
//                        .OnValidateIdentity<EformUserManager, EformUser, int>(
//                            validateInterval: TimeSpan.FromMinutes(30),
//                            regenerateIdentityCallback: (manager, user) =>
//                                user.GenerateUserIdentityAsync(manager, DefaultAuthenticationTypes.ApplicationCookie),
//                            getUserIdCallback: (id) => (id.GetUserId<int>()))
//                }
//            });
//        }

//        private void ConfigureWebApi(HttpConfiguration config)
//        {
//            config.MapHttpAttributeRoutes();
//            var container = AutofacConfig.Container;
//            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);

//            // Web API configuration and services
//            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
//            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
//            jsonFormatter.SerializerSettings.Formatting = Formatting.Indented;

//            config.Formatters.JsonFormatter.SupportedMediaTypes
//                .Add(new MediaTypeHeaderValue("text/html"));

//            config.Routes.MapHttpRoute(
//                name: "DefaultApi",
//                routeTemplate: "api/{controller}/{action}/{id}",
//                defaults: new { id = RouteParameter.Optional }
//            );
//        }
//    }
//}