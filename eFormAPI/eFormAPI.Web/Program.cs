/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

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

namespace eFormAPI.Web
{
    using Services.PluginsManagement.MenuItemsLoader;
    using Microting.eFormApi.BasePn;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text.RegularExpressions;
    using System.Threading;
    using System.Threading.Tasks;
    using Abstractions;
    using eFormCore;
    using Hosting.Enums;
    using Hosting.Helpers;
    using Hosting.Helpers.DbOptions;
    using Hosting.Settings;
    using Microsoft.AspNetCore;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
    using Infrastructure.Models;
    using Infrastructure.Models.Settings.Admin;
    using Infrastructure.Models.Settings.Initial;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Dto;
    using Newtonsoft.Json;
    using Microting.EformAngularFrontendBase.Infrastructure.Data;
    using Microting.EformAngularFrontendBase.Infrastructure.Data.Factories;

    public class Program
    {
        private static CancellationTokenSource _cancelTokenSource = new CancellationTokenSource();
        private static bool _shouldBeRestarted;
        public static List<IEformPlugin> EnabledPlugins = new List<IEformPlugin>();
        public static List<IEformPlugin> DisabledPlugins = new List<IEformPlugin>();
        private static string _defaultConnectionString;

        public static void Main(string[] args)
        {
            var host = BuildWebHost(args);
            InitializeSettings(host, args).Wait();

            if (_shouldBeRestarted)
            {
                host = BuildWebHost(args);
                _shouldBeRestarted = false;
                _cancelTokenSource = new CancellationTokenSource();
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
            Log.LogEvent("Call restart WebBuild");
            _shouldBeRestarted = true;
            _cancelTokenSource.Cancel();
        }

        // ReSharper disable once UnusedMember.Global
        public static void Stop()
        {
            Log.LogEvent("Call stop WebBuild");
            _shouldBeRestarted = false;
            _cancelTokenSource.Cancel();
        }

        // public static ReloadDbConfiguration ReloadDbConfigurationDelegate { get; set; }

        public static async void LoadNavigationMenuEnabledPlugins(IWebHost webHost)
        {
            using var scope = webHost.Services.GetService<IServiceScopeFactory>().CreateScope();
            BaseDbContext dbContext = null;
            try
            {
                dbContext = scope.ServiceProvider.GetRequiredService<BaseDbContext>();
            }
            catch
            {
                // ignored
            }

            if (dbContext != null)
            {
                //await using (dbContext = scope.ServiceProvider.GetRequiredService<BaseDbContext>())
                //{
                try
                {
                    foreach (var enablePlugin in EnabledPlugins)
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
                //}
            }
        }

        public static void MigrateDb(IWebHost webHost)
        {
            using var scope = webHost.Services.GetService<IServiceScopeFactory>().CreateScope();
            BaseDbContext dbContext = null;
            try
            {
                dbContext = scope.ServiceProvider.GetRequiredService<BaseDbContext>();
            }
            catch
            {
                // ignored
            }

            if (dbContext != null)
            {
                using var service = dbContext = scope.ServiceProvider.GetRequiredService<BaseDbContext>();
                try
                {
                    var connectionStrings =
                        scope.ServiceProvider.GetRequiredService<IOptions<ConnectionStrings>>();
                    if (connectionStrings.Value.DefaultConnection != "..." && dbContext.Database.GetPendingMigrations().Any())
                    {
                        Log.LogEvent("Migrating Angular DB");
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

        private static async Task InitializeSettings(IWebHost webHost, string[] args)
        {
            using var scope = webHost.Services.GetService<IServiceScopeFactory>().CreateScope();
            var settingsService = scope.ServiceProvider.GetRequiredService<ISettingsService>();
            var existsResult = settingsService.ConnectionStringExist();
            if(!existsResult.Success)// do need to initialize database
            {
                // Find file
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "init.json");
                if (File.Exists(filePath))
                {
                    Log.LogEvent($"Try initialize from {filePath}");
                    // Get content
                    var startupContent = await File.ReadAllTextAsync(filePath);
                    var startup = JsonConvert.DeserializeObject<StartupInitializeModel>(startupContent);
                    // Apply settings
                    var updateConnectionResult =
                        await settingsService.UpdateConnectionString(startup.InitialSettings);
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

                    var updateAdminSettingsResult =
                        await settingsService.UpdateAdminSettings(adminSettingsUpdateModel);
                    if (!updateAdminSettingsResult.Success)
                    {
                        throw new Exception("Init error: " + updateAdminSettingsResult.Message);
                    }

                    EnabledPlugins = PluginHelper.GetPlugins(_defaultConnectionString);
                    DisabledPlugins = PluginHelper.GetDisablePlugins(_defaultConnectionString);

                    // Enable plugins
                    foreach (var pluginId in startup.PluginsList)
                    {
                        var pluginObject = DisabledPlugins.FirstOrDefault(x => x.PluginId == pluginId);
                        if (pluginObject != null)
                        {
                            var contextFactory = new BaseDbContextFactory();
                            await using var dbContext =
                                contextFactory.CreateDbContext(new[] { _defaultConnectionString });
                            var eformPlugin = await dbContext.EformPlugins
                                .Where(x => x.Status == (int)PluginStatus.Disabled)
                                .FirstOrDefaultAsync(x => x.PluginId == pluginObject.PluginId);

                            if (eformPlugin != null)
                            {
                                eformPlugin.Status = (int)PluginStatus.Enabled;
                                dbContext.EformPlugins.Update(eformPlugin);
                                await dbContext.SaveChangesAsync();

                                var pluginMenu = pluginObject.GetNavigationMenu(scope.ServiceProvider);

                                // Load to database all navigation menu from plugin by id
                                var pluginMenuItemsLoader = new PluginMenuItemsLoader(dbContext, pluginId);

                                pluginMenuItemsLoader.Load(pluginMenu);
                            }
                        }
                    }
                    // not need because settingsService.UpdateAdminSettings call restart
                    // Restart(); // restart IF some plugins has been enabled
                }
                else if (args.Any())
                {
                    Log.LogEvent("Try initialize from args");
                    var defaultConfig = new ConfigurationBuilder()
                        .AddCommandLine(args)
                        .AddEnvironmentVariables(prefix: "ASPNETCORE_")
                        .Build();
                    var firstName = defaultConfig.GetValue("FirstName", "");
                    var lastName = defaultConfig.GetValue("LastName", "");
                    var email = defaultConfig.GetValue("Email", "");
                    var password = defaultConfig.GetValue("Password", "");
                    var token = defaultConfig.GetValue("Token", "");


                    if (!string.IsNullOrEmpty(token) && !string.IsNullOrEmpty(firstName) &&
                        !string.IsNullOrEmpty(lastName) && !string.IsNullOrEmpty(email) &&
                        !string.IsNullOrEmpty(password))
                    {
                        var sdkConnectionString = _defaultConnectionString.Replace("_Angular", "_SDK");
                        // get customer number

                        const RegexOptions options = RegexOptions.Multiline | RegexOptions.CultureInvariant;
                        const string pattern = @"[D|d]atabase=(\D*)(\d*)_Angular";
                        if (int.TryParse(Regex.Match(_defaultConnectionString, pattern, options).Groups[^1].Value,
                            out var customerNumber))
                        {
                            var adminTools = new AdminTools(sdkConnectionString);
                            // Setup SDK DB
                            await adminTools.DbSetup(token);
                            var core = new Core();
                            await core.StartSqlOnly(sdkConnectionString);
                            await core.SetSdkSetting(Settings.customerNo, customerNumber.ToString());

                            // setup admin
                            var adminSetupModel = new AdminSetupModel()
                            {
                                DarkTheme = false,
                                FirstName = firstName,
                                LastName = lastName,
                                Email = email,
                                Password = password,
                            };

                            var contextFactory = new BaseDbContextFactory();
                            await using var dbContext =
                                contextFactory.CreateDbContext(new[] {_defaultConnectionString});
                            var connectionStringsSdk =
                                scope.ServiceProvider.GetRequiredService<IDbOptions<ConnectionStringsSdk>>();
                            await connectionStringsSdk.UpdateDb(
                                options => { options.SdkConnection = sdkConnectionString; }, dbContext);

                            await SeedAdminHelper.SeedAdmin(adminSetupModel,
                                "", dbContext);
                            Restart();
                        }
                    }
                }
            }
        }

        private static IWebHost BuildWebHost(string[] args)
        {
            var defaultConfig = new ConfigurationBuilder()
                .AddCommandLine(args)
                .AddEnvironmentVariables(prefix: "ASPNETCORE_")
                .Build();

            var port = defaultConfig.GetValue("port", 5000);
            var connectionString = defaultConfig.GetValue("ConnectionString", "");
            return WebHost.CreateDefaultBuilder(args)
                .ConfigureKestrel(serverOptions =>
                {
                    serverOptions.Limits.MaxRequestBodySize = 100 * 1024 * 1024;// 100Mb
                })
                .UseUrls($"http://0.0.0.0:{port}")
                .UseIISIntegration()
                .ConfigureAppConfiguration((hostContext, config) =>
                {
                    Log.LogEvent("Delete all default configuration providers");
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

                    config.AddJsonFile("connection.json", optional: true, reloadOnChange: true);
                    var mainSettings = ConnectionStringManager.Read(filePath);
                    _defaultConnectionString = mainSettings?.ConnectionStrings?.DefaultConnection;
                    config.AddEfConfiguration(_defaultConnectionString);
                    EnabledPlugins = PluginHelper.GetPlugins(_defaultConnectionString);
                    DisabledPlugins = PluginHelper.GetDisablePlugins(_defaultConnectionString);

                    var contextFactory = new BaseDbContextFactory();
                    if (_defaultConnectionString != "...")
                    {
                        using (var dbContext = contextFactory.CreateDbContext(new[] {_defaultConnectionString}))
                        {
                            foreach (var plugin in EnabledPlugins)
                            {
                                var pluginEntity = dbContext.EformPlugins
                                    .FirstOrDefault(x => x.PluginId == plugin.PluginId);

                                if (pluginEntity != null && !string.IsNullOrEmpty(pluginEntity.ConnectionString))
                                {
                                    plugin.AddPluginConfig(config, pluginEntity.ConnectionString);
                                }
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
