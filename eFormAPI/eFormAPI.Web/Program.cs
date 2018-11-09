using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace eFormAPI.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            IWebHost host = BuildWebHost(args);
            host.Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            IConfigurationRoot defaultConfig = new ConfigurationBuilder()
                .AddCommandLine(args)
                .AddEnvironmentVariables(prefix: "ASPNETCORE_")
                .Build();
            int port = defaultConfig.GetValue("port", 5000);
            return WebHost.CreateDefaultBuilder(args)
                .UseUrls($"http://localhost:{port}")
                .ConfigureAppConfiguration((hostContext, config) =>
                {
                    // delete all default configuration providers
                    config.Sources.Clear();
                    config.SetBasePath(hostContext.HostingEnvironment.ContentRootPath);
                    config.AddJsonFile("appsettings.json",
                        optional: true,
                        reloadOnChange: true);
                    config.AddEnvironmentVariables();
                })
                .UseStartup<Startup>()
                .Build();
        }
    }
}