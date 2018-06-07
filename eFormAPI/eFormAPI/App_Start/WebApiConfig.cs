using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Dispatcher;
using Autofac.Integration.WebApi;
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
            var path = System.Web.Hosting.HostingEnvironment.MapPath("~/plugins");
            try
            {
                Directory.CreateDirectory(path);                
            } catch
            {
                throw new Exception("Unable to create directory for plugins");
            }            
            
            if (path == null)
            {                
                throw new Exception("Plugin path not found");
            }
            var assemblies = new List<Assembly>(base.GetAssemblies());
            var directories = Directory.EnumerateDirectories(path);
            foreach (var directory in directories)
            {
                var pluginList = Directory.GetFiles(directory)
                    .Where(x => x.EndsWith("Pn.dll") && Path.GetFileName(x) != "EformBase.Pn.dll")
                    .ToList();

                foreach (var plugin in pluginList)
                {
                    assemblies.Add(Assembly.LoadFrom(Path.Combine(plugin)));
                }
            }
            return assemblies;
        }
    }
}