using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using eFormCore;
using McMaster.NETCore.Plugins;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Services;

namespace eFormAPI.Web.Hosting.Helpers
{
    public static class PluginHelper
    {
        public static List<IEformPlugin> GetPlugins()
        {
            List<PluginLoader> loaders = new List<PluginLoader>();
            List<IEformPlugin> plugins = new List<IEformPlugin>();
            // create plugin loaders
            Console.ForegroundColor = ConsoleColor.Green;
            string pluginsDir = Path.Combine(Directory.GetCurrentDirectory(), "Plugins");
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
            IEnumerable<string> directories = Directory.EnumerateDirectories(pluginsDir);

            foreach (string directory in directories)
            {
                List<string> pluginList = Directory.GetFiles(Path.Combine(directory, "netcoreapp2.1"))
                    .Where(x => x.EndsWith("Pn.dll") && Path.GetFileName(x) != "eFormApi.BasePn.dll")
                    .ToList();

                Console.WriteLine($"{pluginList.Count} number of plugins found");

                foreach (string pluginFile in pluginList)
                {
                    PluginLoader loader = PluginLoader.CreateFromAssemblyFile(pluginFile,
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
                    foreach (Type type in loader.LoadDefaultAssembly()
                        .GetTypes()
                        .Where(t => typeof(IEformPlugin).IsAssignableFrom(t) && !t.IsAbstract))
                    {
                        Console.WriteLine("Found plugin : " + type.Name);
                        IEformPlugin plugin = (IEformPlugin) Activator.CreateInstance(type);
                        plugins.Add(plugin);
                    }

                    //var loader = PluginLoader.CreateFromAssemblyFile(
                    //    plugin,
                    //    sharedTypes: new [] { typeof(IEformPlugin), typeof(IServiceCollection), typeof(ILogger) });
                    loaders.Add(loader);
                }
            }
            Console.ForegroundColor = ConsoleColor.Gray;


            //// Create an instance of plugin types
            //foreach (var loader in loaders)
            //{
            //    foreach (var pluginType in loader
            //        .LoadDefaultAssembly()
            //        .GetTypes()
            //        .Where(t => typeof(IEformPlugin).IsAssignableFrom(t) && !t.IsAbstract))
            //    {
            //        // This assumes the implementation of IPlugin has a parameterless constructor
            //        IEformPlugin plugin = (IEformPlugin)Activator.CreateInstance(pluginType);

            //        Console.WriteLine($"Created plugin instance '{plugin.GetName()}'.");
            //    }
            //}
            return plugins;
        }
    }
}