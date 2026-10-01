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


namespace eFormAPI.Web.Hosting.Helpers;

using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Factories;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading;
using Amazon.S3;
using Amazon.S3.Model;
using Enums;
using eFormCore;
using McMaster.NETCore.Plugins;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Delegates;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Settings;
using Microting.eFormApi.BasePn.Services;
using Sentry;
using SentryIntegration;

public static class PluginHelper
{
    // Plugin metadata is immutable for the lifetime of the process — new plugin DLLs
    // only take effect after a restart. Memoizing avoids the AssemblyLoadContext +
    // Activator.CreateInstance cascade being triggered once per enabled plugin on every login.
    private static readonly Lazy<List<IEformPlugin>> _allPluginsCache =
        new(LoadAllPluginsFromDisk, LazyThreadSafetyMode.ExecutionAndPublication);

    // Sharing the host's Sentry assembly puts the plugins' static SentrySdk calls on the host hub,
    // where they get the request's trace, user and tags and are routed by SentryPluginRouter. A
    // plugin with a private copy has a separate SDK the host cannot see. With DISABLE_SENTRY the
    // private copies are kept, so that setting changes nothing for the plugins.
    private static Type[] SentrySharedTypes =>
        SentryHostSetup.IsDisabled() ? [] : [typeof(SentrySdk)];

    // The plugin loader silently falls back to the plugin's private Sentry copy when the plugin
    // references a newer Sentry than the host has; the plugin then bypasses the host hub.
    private static void WarnIfSentryIsNotShared(Assembly pluginAssembly)
    {
        var hostVersion = typeof(SentrySdk).Assembly.GetName().Version;
        var pluginVersion = pluginAssembly.GetReferencedAssemblies()
            .FirstOrDefault(x => x.Name == "Sentry")?.Version;
        if (!SentryHostSetup.IsDisabled() && pluginVersion > hostVersion)
        {
            Log.LogException($"Sentry: plugin {pluginAssembly.GetName().Name} references Sentry {pluginVersion}, " +
                             $"newer than the host's {hostVersion}; it uses a private copy, so its events " +
                             "carry no trace or user and are not routed by the host");
        }
    }

    public static List<IEformPlugin> GetPlugins(string connectionString)
    {
        Log.LogEvent("PluginHelper.GetPlugins");
        // Load info from database
        List<EformPlugin> eformPlugins = null;
        var plugins = new List<IEformPlugin>();
        var contextFactory = new BaseDbContextFactory();
        if (connectionString != "...")
        {
            using (var dbContext = contextFactory.CreateDbContext(new[] {connectionString}))
            {
                try
                {
                    eformPlugins = dbContext.EformPlugins
                        .AsNoTracking()
                        .ToList();
                }
                catch
                {
                    // ignored
                }
            }


            // create plugin loaders
            if (eformPlugins != null)
            {
                using (var dbContext = contextFactory.CreateDbContext(new[] {connectionString}))
                {
                    var dbNameSection = Regex.Match(connectionString, @"([D|d]atabase=\w*;)").Groups[0].Value;
                    var dbPrefix = Regex.Match(connectionString, @"[D|d]atabase=(\d*)_").Groups[1].Value;

                    foreach (var plugin in GetAllPlugins())
                    {
                        var eformPlugin = eformPlugins.FirstOrDefault(x => x.PluginId == plugin.PluginId);
                        if (eformPlugin != null)
                        {
                            if (!eformPlugin.ConnectionString.Contains("PersistSecurityInfo=true;"))
                            {
                                var aPlugin =
                                    dbContext.EformPlugins.SingleOrDefault(x => x.PluginId == plugin.PluginId);
                                if (aPlugin != null)
                                    aPlugin.ConnectionString += "PersistSecurityInfo=true;";
                                dbContext.SaveChanges();
                            }

                            if (eformPlugin.Status == (int) PluginStatus.Enabled && plugins.All(x => x.PluginId != plugin.PluginId))
                            {
                                plugins.Add(plugin);
                            }
                        }
                        else
                        {
                            var pluginDbName = $"Database={dbPrefix}_{plugin.PluginId};";
                            var pluginConnectionString =
                                connectionString.Replace(dbNameSection, pluginDbName) +
                                "PersistSecurityInfo=true;";
                            var newPlugin = new EformPlugin
                            {
                                PluginId = plugin.PluginId,
                                ConnectionString = pluginConnectionString,
                                Status = (int) PluginStatus.Disabled
                            };
                            dbContext.EformPlugins.Add(newPlugin);
                            dbContext.SaveChanges();
                        }
                    }
                }
            }
        }

        return plugins;
    }

    public static List<IEformPlugin> GetDisablePlugins(string connectionString)
    {
        // Load info from database
        List<EformPlugin> eformPlugins = null;
        var contextFactory = new BaseDbContextFactory();

        var plugins = new List<IEformPlugin>();
        if (connectionString != "...")
        {
            using var dbContext = contextFactory.CreateDbContext(new[] { connectionString });
            try
            {
                eformPlugins = dbContext.EformPlugins
                    .AsNoTracking()
                    .ToList();
            }
            catch
            {
                // ignored
            }

            // create plugin loaders
            if (eformPlugins != null)
            {
                var dbNameSection = Regex.Match(connectionString, @"(Database=\w*;)").Groups[0].Value;
                var dbPrefix = Regex.Match(connectionString, @"Database=(\d*)_").Groups[1].Value;

                foreach (var plugin in GetAllPlugins())
                {
                    var eformPlugin = eformPlugins.FirstOrDefault(x => x.PluginId == plugin.PluginId);
                    if (eformPlugin != null)
                    {
                        if (!eformPlugin.ConnectionString.Contains("PersistSecurityInfo=true;"))
                        {
                            var aPlugin =
                                dbContext.EformPlugins.SingleOrDefault(x => x.PluginId == plugin.PluginId);
                            if (aPlugin != null)
                                aPlugin.ConnectionString += "PersistSecurityInfo=true;";
                            dbContext.SaveChanges();
                        }

                        if (eformPlugin.Status == (int)PluginStatus.Disabled)
                        {
                            plugins.Add(plugin);
                        }
                    }
                    else
                    {
                        var pluginDbName = $"Database={dbPrefix}_{plugin.PluginId};";
                        var pluginConnectionString =
                            connectionString.Replace(dbNameSection, pluginDbName) +
                            "PersistSecurityInfo=true;";
                        var newPlugin = new EformPlugin
                        {
                            PluginId = plugin.PluginId,
                            ConnectionString = pluginConnectionString,
                            Status = (int)PluginStatus.Disabled
                        };
                        dbContext.EformPlugins.Add(newPlugin);
                        dbContext.SaveChanges();
                    }
                }
            }
        }
        return plugins;
    }

    public static string GetLatestRepositoryVersion(string githubUserName, string pluginName)
    {
        string latestVersion = "";
        // try
        // {
        //     var httpClient = new HttpClient
        //     {
        //         BaseAddress = new Uri($"https://api.github.com/repos/{githubUserName}/{pluginName}/tags")
        //     };
        //
        //     httpClient.DefaultRequestHeaders.Add("User-Agent", "ReleaseSearcher");
        //
        //     var request = new HttpRequestMessage
        //     {
        //         Method = HttpMethod.Get,
        //     };
        //
        //     using (var response = await httpClient.SendAsync(request))
        //     {
        //         response.EnsureSuccessStatusCode();
        //
        //         var responseString = await response.Content.ReadAsStringAsync();
        //         JToken responseObj = JRaw.Parse(responseString);
        //
        //         latestVersion = responseObj.First["name"].ToString();
        //
        //     }
        //
        //     latestVersion = latestVersion.Replace("v", "");
        //     if (latestVersion.Split(".").Count() == 2)
        //     {
        //         latestVersion += ".0";
        //     }
        //
        //     if (pluginName == "eform-angular-frontend")
        //     {
        //         latestVersion += ".0";
        //     }
        // }
        // catch (Exception ex)
        // {
        //     Console.ForegroundColor = ConsoleColor.Red;
        //     Console.WriteLine(
        //         $"[ERR] PluginHelper.GetLatestRepositoryVersion: Unable to get latest version for {pluginName} from github");
        //     Console.WriteLine($"[ERR] PluginHelper.GetLatestRepositoryVersion: Exception was {ex.Message}");
        //
        //     Console.ForegroundColor = ConsoleColor.Gray;
        // }

        return latestVersion;
    }


    public static List<IEformPlugin> GetAllPlugins() => _allPluginsCache.Value;

    private static List<IEformPlugin> LoadAllPluginsFromDisk()
    {
        var plugins = new List<IEformPlugin>();
        // create plugin loaders
        Console.ForegroundColor = ConsoleColor.Green;
        var pluginsDir = Path.Combine(Directory.GetCurrentDirectory(), "Plugins");
        Console.WriteLine($@"info: Trying to discover plugins in folder : {pluginsDir}");
        if (!Directory.Exists(pluginsDir))
        {
            try
            {
                Directory.CreateDirectory(pluginsDir);
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"fail: {ex.Message}");
                Console.WriteLine($"      {ex.StackTrace}");
                throw new Exception("Unable to create directory for plugins");
            }
        }

        //var directories = Directory.EnumerateDirectories(pluginsDir);
        //foreach (var directory in directories)
        //{
        var pluginList = Directory.GetFiles(pluginsDir, "*.Pn.dll", SearchOption.AllDirectories);


        foreach (var pluginFile in pluginList)
        {
            if (!pluginFile.Contains("ref"))
            {
                var loader = PluginLoader.CreateFromAssemblyFile(pluginFile,
                    // this ensures that the plugin resolves to the same version of DependencyInjection
                    // and ASP.NET Core that the current app uses
                    new[]
                    {
                        typeof(IApplicationBuilder),
                        typeof(IEformPlugin),
                        typeof(IServiceCollection),
                        typeof(IEFormCoreService),
                        typeof(IPluginConfigurationSeedData),
                        typeof(IPluginDbContext),
                        typeof(IConfigurationBuilder),
                        typeof(ReloadDbConfiguration),
                        typeof(DbSet<PluginConfigurationValueVersion>),
                        typeof(DbSet<PluginConfigurationValue>),
                        typeof(ReloadDbConfiguration),
                        typeof(EFormCoreService),

                        typeof(ModelBuilder),
                        typeof(PluginConfigurationValue),
                        typeof(PluginConfigurationValueVersion),
                        typeof(BaseEntity),
                        typeof(PluginConfigurationProvider<>),
                        typeof(ConfigurationProvider),
                        typeof(DbContext),
                        // Share Microting.EformAngularFrontendBase so the plugin's BaseDbContext
                        // is the same Type object the host registers in DI. Without this, each
                        // plugin loads its own copy of BaseDbContext in a separate ALC, and
                        // plugin services cannot resolve the host's BaseDbContext registration.
                        typeof(BaseDbContext),
                        typeof(WarningsConfiguration),
                        typeof(WarningBehavior),
                        typeof(DbContextOptionsBuilder),
                        typeof(DbContextOptions),
                        typeof(InMemoryEventId),
                        typeof(LoggerCategory<>),
                        typeof(DbLoggerCategory),
                        typeof(WarningsConfigurationBuilder),
                        //typeof(MySqlDbContextOptionsExtensions),
                        typeof(CoreOptionsExtension),
                        typeof(RelationalEventId),
                        typeof(IDbContextOptionsBuilderInfrastructure),
                        typeof(ModelSnapshot),
                        typeof(ILazyLoader),

                        typeof(IPluginDbOptions<>),
                        typeof(IOptionsSnapshot<>),
                        typeof(PluginDbOptions<>),
                        typeof(IDesignTimeDbContextFactory<>),
                        typeof(Core),
                        typeof(GetObjectResponse),
                        typeof(AmazonS3Client)
                    }.Concat(SentrySharedTypes).ToArray());

                var pluginAssembly = loader.LoadDefaultAssembly();
                WarnIfSentryIsNotShared(pluginAssembly);
                var types = pluginAssembly.GetTypes();

                foreach (var type in types
                             .Where(t => typeof(IEformPlugin).IsAssignableFrom(t) && !t.IsAbstract))
                {
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine($@"info: Found plugin : {type.Name}");
                    var plugin = (IEformPlugin) Activator.CreateInstance(type);
                    plugins.Add(plugin);
                }
            }
        }

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($@"info: {plugins.Count} plugins found");

        Console.ForegroundColor = ConsoleColor.Gray;
        return plugins;
    }
}