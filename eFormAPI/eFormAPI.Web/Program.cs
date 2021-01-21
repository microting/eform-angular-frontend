/*
The MIT License (MIT)

Copyright (c) 2007 - 2020 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using Castle.Core.Internal;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Hosting.Helpers;
using eFormAPI.Web.Hosting.Settings;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Database.Factories;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;

namespace eFormAPI.Web
{
    using Infrastructure.Models;
    using Infrastructure.Models.Settings.Admin;
    using Newtonsoft.Json;
    using Services;

    public class Program
    {
        private static CancellationTokenSource _cancelTokenSource = new CancellationTokenSource();
        private static bool _shouldBeRestarted;
        public static List<IEformPlugin> EnabledPlugins = new List<IEformPlugin>();
        public static List<IEformPlugin> DisabledPlugins = new List<IEformPlugin>();

        public static void Main(string[] args)
        {
            var host = BuildWebHost(args);
            InitializeSettings(host);

            if (_shouldBeRestarted)
            {
                host = BuildWebHost(args);
                _shouldBeRestarted = false;
            }

            MigrateDb(host);
            LoadNavigationMenuEnabledPlugins(host);
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

        // public static ReloadDbConfiguration ReloadDbConfigurationDelegate { get; set; }

        public static async void LoadNavigationMenuEnabledPlugins(IWebHost webHost)
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
                            foreach(var enablePlugin in Program.EnabledPlugins)
                            {
                                var pluginManagementService = scope.ServiceProvider.GetRequiredService<IPluginsManagementService>();

                                await pluginManagementService.LoadNavigationMenuDuringStartProgram(enablePlugin.PluginId);
                            }
                        }
                        catch (Exception e)
                        {
                            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                            logger.LogError(e, "Error while loading navigation menu from enabled plugins");
                        }
                    }
                }
            }
        }

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
                    using var service = dbContext = scope.ServiceProvider.GetRequiredService<BaseDbContext>();
                    try
                    {
                        var connectionStrings =
                            scope.ServiceProvider.GetRequiredService<IOptions<ConnectionStrings>>();
                        if (connectionStrings.Value.DefaultConnection != "...")
                        {
                            if (dbContext.Database.GetPendingMigrations().Any())
                            {
                                Log.LogEvent("Migrating Angular DB");
                                dbContext.Database.Migrate();
                            }
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

        public static async void InitializeSettings(IWebHost webHost)
        {
            // Find file
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "init.json");
            if (File.Exists(filePath))
            {
                // Get content
                var startupContent = File.ReadAllText(filePath);
                var startup = JsonConvert.DeserializeObject<StartupInitializeModel>(startupContent);
                // Apply settings
                using var scope = webHost.Services.GetService<IServiceScopeFactory>().CreateScope();
                var settingsService = scope.ServiceProvider.GetRequiredService<SettingsService>();
                var existsResult = settingsService.ConnectionStringExist();
                if (!existsResult.Success)
                {
                    var updateConnectionResult = await settingsService.UpdateConnectionString(startup.InitialSettings);
                    if (!updateConnectionResult.Success)
                    {
                        throw new Exception("Init error: " + updateConnectionResult.Message);
                    }

                    var adminSettingsUpdateModel = new AdminSettingsModel
                    {
                        S3SettingsModel = startup.S3SettingsModel,
                        SMTPSettingsModel = startup.SMTPSettingsModel,
                        SdkSettingsModel = startup.SdkSettingsModel,
                        SendGridSettingsModel = startup.SendGridSettingsModel,
                        SwiftSettingsModel = startup.SwiftSettingsModel,
                    };

                    var updateAdminSettingsResult = await settingsService.UpdateAdminSettings(adminSettingsUpdateModel);
                    if (!updateAdminSettingsResult.Success)
                    {
                        throw new Exception("Init error: " + updateAdminSettingsResult.Message);
                    }

                    // Enable plugins
                    foreach (var pluginId in startup.PluginsList)
                    {
                        var disabledPlugin = DisabledPlugins.FirstOrDefault(x => x.PluginId == pluginId);

                        if (disabledPlugin != null)
                        {
                            // TODO enable plugin
                        }

                        // Program.Restart(); // restart IF some plugins has been enabled
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
            var connectionString = defaultConfig.GetValue("connectionstring", "");
            return WebHost.CreateDefaultBuilder(args)
                .UseUrls($"http://0.0.0.0:{port}")
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
                        ConnectionStringManager.CreateDefault(filePath);
                    }

                    if (!string.IsNullOrEmpty(connectionString))
                    {
                        ConnectionStringManager.CreateWithConnectionString(filePath, connectionString);
                    }

                    config.AddJsonFile("connection.json",
                        optional: true,
                        reloadOnChange: true);
                    var mainSettings = ConnectionStringManager.Read(filePath);
                    var defaultConnectionString = mainSettings?.ConnectionStrings?.DefaultConnection;
                    config.AddEfConfiguration(defaultConnectionString);

                    EnabledPlugins = PluginHelper.GetPlugins(defaultConnectionString);
                    DisabledPlugins = PluginHelper.GetDisablePlugins(defaultConnectionString);
                    var contextFactory = new BaseDbContextFactory();
                    using (var dbContext = contextFactory.CreateDbContext(new[] {defaultConnectionString}))
                    {
                        foreach (var plugin in EnabledPlugins)
                        {
                            var pluginEntity = dbContext.EformPlugins
                                .FirstOrDefault(x => x.PluginId == plugin.PluginId);

                            if (pluginEntity != null && !pluginEntity.ConnectionString.IsNullOrEmpty())
                            {
                                plugin.AddPluginConfig(config, pluginEntity.ConnectionString);
                            }
                        }
                    }

                    config.AddEnvironmentVariables();
                })
                .UseStartup<Startup>()
                .Build();
        }
    }
}