using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
                } catch {}
            }
            var plugins = new List<IEformPlugin>();
            // create plugin loaders
            if (eformPlugins != null)
            {
                foreach (var plugin in GetAllPlugins())
                {
                    var eformPlugin = eformPlugins.FirstOrDefault(x => x.PluginId == plugin.PluginId);
                    if (eformPlugin != null)
                    {
                        if (eformPlugin.Status ==  (int) PluginStatus.Enabled)
                        {
                            plugins.Add(plugin);
                        }
                    }
                    else
                    {
                        newPlugins.Add(new EformPlugin()
                        {
                            PluginId = plugin.PluginId,
                            ConnectionString = "...",
                            Status = (int) PluginStatus.Disabled
                        });
                    }
                }
            }
            

            using (var dbContext = contextFactory.CreateDbContext(new[] {configuration.MyConnectionString()}))
            {
                dbContext.EformPlugins.AddRange(newPlugins);
                dbContext.SaveChanges();
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
            foreach (var directory in directories)
            {
                List<string> pluginList;

//#if DEBUG
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("RUNNING IN DEBUG MODE!");
                pluginList = Directory.GetFiles(Path.Combine(directory, "netcoreapp2.2"))
                    .Where(x => x.EndsWith("Pn.dll") && Path.GetFileName(x) != "eFormApi.BasePn.dll")
                    .ToList();
//#else
//                pluginList = Directory.GetFiles(directory)
//                    .Where(x => x.EndsWith("Pn.dll") && Path.GetFileName(x) != "eFormApi.BasePn.dll")
//                    .ToList();
//
//#endif

                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"{pluginList.Count} number of plugins found");

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
                        Console.WriteLine("Found plugin : " + type.Name);
                        var plugin = (IEformPlugin) Activator.CreateInstance(type);
                        plugins.Add(plugin);

                    }
                }
            }

            Console.ForegroundColor = ConsoleColor.Gray;
            return plugins;
        }
    }
}