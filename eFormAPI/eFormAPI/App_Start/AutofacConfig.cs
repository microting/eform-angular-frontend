using System.Reflection;
using System.Web.Http;
using Autofac;
using Autofac.Integration.WebApi;
using eFormAPI.Web.Infrastructure.Data;
using eFormAPI.Web.Infrastructure.Identity;

namespace eFormAPI.Web
{
    public static class AutofacConfig
    {
        public static IContainer Container { get; private set; }

        public static void ConfigureContainer()
        {
            var builder = new ContainerBuilder();
            // Get your HttpConfiguration.
            var config = GlobalConfiguration.Configuration;
            // Register your Web API controllers.
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            // OPTIONAL: Register the Autofac filter provider.
            builder.RegisterWebApiFilterProvider(config);
            // Set the dependency resolver to be Autofac.
            builder.RegisterType<BaseDbContext>().InstancePerRequest();
            Container = builder.Build();
        }
    }
}