using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using eFormAPI.Web.Hosting.Enums;
using eFormAPI.Web.Hosting.Extensions;
using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Database.Factories;
using eFormCore;
using McMaster.NETCore.Plugins;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Services;

namespace eFormAPI.Web.Hosting.Helpers
{
    public static class PluginHelper
    {
        public static List<IEformPlugin> GetPlugins(IConfiguration configuration)
        {
            // Load info from database
            List<EformPlugin> eformPlugins = null;
            var newPlugins = new List<EformPlugin>();
            var contextFactory = new BaseDbContextFactory();
            using (var dbContext = contextFactory.CreateDbContext(new[] {configuration.MyConnectionString()}))
            {
                try
                {
                    eformPlugins = dbContext.EformPlugins
                        .AsNoTracking()
                        .ToList();
                }
                catch
                {
                }
            }

            var plugins = new List<IEformPlugin>();
            // create plugin loaders
            if (eformPlugins != null)
            {
                using (var dbContext = contextFactory.CreateDbContext(new[] {configuration.MyConnectionString()}))
                {
                    var connectionString = dbContext.Database.GetDbConnection().ConnectionString;

//                    var connectionStringMatch = Regex.Match(connectionString, @"(Database=\w*;)");//.Groups[1].Value;
//                    if (connectionStringMatch.Groups.Count != 3)
//                    {
//                        throw new Exception("Error while parsing connection-string database name");
//                    }

                    var dbNameSection = Regex.Match(connectionString, @"(Database=\w*;)").Groups[0].Value;
                    var dbPrefix = Regex.Match(connectionString, @"Database=(.*)_").Groups[1].Value;

                    foreach (var plugin in GetAllPlugins())
                    {
                        var eformPlugin = eformPlugins.FirstOrDefault(x => x.PluginId == plugin.PluginId);
                        if (eformPlugin != null)
                        {
                            if (eformPlugin.Status == (int) PluginStatus.Enabled)
                            {
                                plugins.Add(plugin);
                            }
                        }
                        else
                        {
                            var pluginDbName = $"Database={dbPrefix}_{plugin.PluginId};";
                            var pluginConnectionString = connectionString.Replace(dbNameSection, pluginDbName);
                            newPlugins.Add(new EformPlugin()
                            {
                                PluginId = plugin.PluginId,
                                ConnectionString = pluginConnectionString,
                                Status = (int) PluginStatus.Disabled
                            });
                        }
                    }

                    dbContext.EformPlugins.AddRange(newPlugins);
                    dbContext.SaveChanges();
                }
            }

            return plugins;
        }


        public static List<IEformPlugin> GetAllPlugins()
        {
            var plugins = new List<IEformPlugin>();
            // create plugin loaders
            Console.ForegroundColor = ConsoleColor.Green;
            var pluginsDir = Path.Combine(Directory.GetCurrentDirectory(), "Plugins");
            Console.WriteLine($"Trying to discover plugins in folder : {pluginsDir}");
            if (!Directory.Exists(pluginsDir))
            {
                try
                {
                    Directory.CreateDirectory(pluginsDir);
                }
                catch
                {
                    throw new Exception("Unable to create directory for plugins");
                }
            }

            //   var assemblies = new List<Assembly>();
            var directories = Directory.EnumerateDirectories(pluginsDir);
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("RUNNING IN DEBUG MODE!");
            foreach (var directory in directories)
            {
                List<string> pluginList;

//#if DEBUG
                pluginList = Directory.GetFiles(Path.Combine(directory, "netcoreapp2.2"))
                    .Where(x => x.EndsWith("Pn.dll") && Path.GetFileName(x) != "eFormApi.BasePn.dll")
                    .ToList();
//#else
//                pluginList = Directory.GetFiles(directory)
//                    .Where(x => x.EndsWith("Pn.dll") && Path.GetFileName(x) != "eFormApi.BasePn.dll")
//                    .ToList();
//
//#endif


                foreach (var pluginFile in pluginList)
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
                            typeof(EFormCoreService),
                            typeof(Core)
                        });
                    foreach (var type in loader.LoadDefaultAssembly()
                        .GetTypes()
                        .Where(t => typeof(IEformPlugin).IsAssignableFrom(t) && !t.IsAbstract))
                    {
                        Console.ForegroundColor = ConsoleColor.Green;
                        Console.WriteLine("Found plugin : " + type.Name);
                        var plugin = (IEformPlugin) Activator.CreateInstance(type);
                        plugins.Add(plugin);
                    }
                }
            }

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine($"{plugins.Count} plugins found");

            Console.ForegroundColor = ConsoleColor.Gray;
            return plugins;
        }
    }
}