using System;
using System.IO;
using System.Threading;
using eFormAPI.Web.Hosting.Settings;
using eFormAPI.Web.Infrastructure.Database;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;

namespace eFormAPI.Web
{
    public class Program
    {
        private static CancellationTokenSource _cancelTokenSource = new CancellationTokenSource();
        private static bool _shouldBeRestarted;

        public static void Main(string[] args)
        {
            var host = BuildWebHost(args);
            MigrateDb(host);
            host.RunAsync(_cancelTokenSource.Token)
                .Wait();

            while (_shouldBeRestarted)
            {
                if (_shouldBeRestarted)
                {
                    _shouldBeRestarted = false;
                    _cancelTokenSource = new CancellationTokenSource();
                    host = BuildWebHost(args);
                    host.RunAsync(_cancelTokenSource.Token)
                        .Wait();
                }
            }
        }

        public static void Restart()
        {
            _shouldBeRestarted = true;
            _cancelTokenSource.Cancel();
        }

        public static void Stop()
        {
            _shouldBeRestarted = false;
            _cancelTokenSource.Cancel();
        }

        public delegate void ReloadDbConfiguration();

        public static ReloadDbConfiguration ReloadDbConfigurationDelegate { get; set; }

        public static void MigrateDb(IWebHost webHost)
        {
            using (var scope = webHost.Services.GetService<IServiceScopeFactory>().CreateScope())
            {
                BaseDbContext dbContext = null;
                try
                {
                    dbContext = scope.ServiceProvider.GetRequiredService<BaseDbContext>();
                }
                catch
                {
                }

                if (dbContext != null)
                {
                    using (dbContext = scope.ServiceProvider.GetRequiredService<BaseDbContext>())
                    {
                        try
                        {
                            var connectionStrings =
                                scope.ServiceProvider.GetRequiredService<IOptions<ConnectionStrings>>();
                            if (connectionStrings.Value.DefaultConnection != "...")
                            {
                                dbContext.Database.Migrate();
                            }
                        }
                        catch (Exception e)
                        {
                            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                            logger.LogError(e, "Error while migrating db");
                        }
                    }
                }
            }
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            var defaultConfig = new ConfigurationBuilder()
                .AddCommandLine(args)
                .AddEnvironmentVariables(prefix: "ASPNETCORE_")
                .Build();
            var port = defaultConfig.GetValue("port", 5000);
            return WebHost.CreateDefaultBuilder(args)
                .UseUrls($"http://localhost:{port}")
                .UseIISIntegration()
                .ConfigureAppConfiguration((hostContext, config) =>
                {
                    // delete all default configuration providers
                    config.Sources.Clear();
                    config.SetBasePath(hostContext.HostingEnvironment.ContentRootPath);

                    var filePath = Path.Combine(hostContext.HostingEnvironment.ContentRootPath,
                        "connection.json");
                    if (!File.Exists(filePath))
                    {
                        ConnectionStringManager.CreateDefalt(filePath);
                    }

                    config.AddJsonFile("connection.json",
                        optional: true,
                        reloadOnChange: true);
                    var mainSettings = ConnectionStringManager.Read(filePath);
                    config.AddEfConfiguration(mainSettings?.ConnectionStrings?.DefaultConnection);
                    config.AddEnvironmentVariables();
                })
                .UseStartup<Startup>()
                .Build();
        }
    }
}