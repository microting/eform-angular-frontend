using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Dispatcher;
using Autofac.Integration.WebApi;
using eFormAPI.Web.Infrastructure.Helpers;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace eFormAPI.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            var corsAttr = new EnableCorsAttribute("*", "content-type", "GET");
            config.EnableCors(corsAttr);
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            config.Filters.Add(new HostAuthenticationFilter(CookieAuthenticationDefaults.AuthenticationType));

            config.MapHttpAttributeRoutes();
            var container = AutofacConfig.Container;
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);

            // Web API configuration and services
            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            jsonFormatter.SerializerSettings.Formatting = Formatting.Indented;

            config.Formatters.JsonFormatter.SupportedMediaTypes
                .Add(new MediaTypeHeaderValue("text/html"));

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new {id = RouteParameter.Optional}
            );

            // plugin loader for web api
            config.Services.Replace(typeof(IAssembliesResolver), new EformAssembliesResolver());
        }
    }

    public class EformAssembliesResolver : DefaultAssembliesResolver
    {
        public override ICollection<Assembly> GetAssemblies()
        {
            var assemblies = new List<Assembly>(base.GetAssemblies());
            // Load Plugins
            var pluginsAssemblies = PluginHelper.GetPluginAssemblies();
            assemblies.AddRange(pluginsAssemblies);
            return assemblies;
        }
    }
}