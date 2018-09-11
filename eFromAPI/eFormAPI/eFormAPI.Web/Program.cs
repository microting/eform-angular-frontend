using System;
using System.IO;
using eFormAPI.Common.Infrastructure.Data;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace eFormAPI.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = BuildWebHost(args);
            // Database Seed
            using (var scope = host.Services.GetService<IServiceScopeFactory>().CreateScope())
            using (var dbContext = scope.ServiceProvider.GetRequiredService<BaseDbContext>())
            {
                try
                {
                    //    dbContext.Database.Migrate();
                    //    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
                    //    DbInitializer.Initialize(dbContext,
                    //        scope.ServiceProvider.GetRequiredService<UserManager<PbUser>>(), config.MyConnectionString());
                }
                catch (Exception ex)
                {
                    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred seeding the DB.");
                }
            }

            host.Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            var defaultConfig = new ConfigurationBuilder()
                .AddCommandLine(args)
                .AddEnvironmentVariables(prefix: "ASPNETCORE_")
                .Build();
            var port = defaultConfig.GetValue("port", 5000);
            return WebHost.CreateDefaultBuilder(args)
                .UseKestrel(options => { options.Limits.MaxRequestBodySize = null; })
                .UseUrls($"http://localhost:{port}")
                .UseContentRoot(Directory.GetCurrentDirectory())
                .ConfigureAppConfiguration((hostContext, config) =>
                {
                    // delete all default configuration providers
                    config.Sources.Clear();
                    config.SetBasePath(hostContext.HostingEnvironment.ContentRootPath);
                    //config.AddJsonFile(
                    //    Path.Combine("Settings",
                    //        $"appsettings.{hostContext.HostingEnvironment.EnvironmentName.ToLower()}.json"),
                    //    optional: true, reloadOnChange: true);
                    config.AddJsonFile(
                        Path.Combine("Settings", "appsettings.json"),
                        optional: true, 
                        reloadOnChange: true);
                    config.AddEnvironmentVariables();
                })
                .UseStartup<Startup>()
                .Build();
        }
    }
}