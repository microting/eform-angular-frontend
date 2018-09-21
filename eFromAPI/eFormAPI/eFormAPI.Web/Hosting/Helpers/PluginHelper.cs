using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using McMaster.NETCore.Plugins;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microting.eFormApi.BasePn;

namespace eFormAPI.Web.old.state
{
    public static class PluginHelper
    {
        public static List<IEformPlugin> GetPlugins()
        {
            var loaders = new List<PluginLoader>();
            var plugins = new List<IEformPlugin>();
            // create plugin loaders
            var pluginsDir = Path.Combine(Directory.GetCurrentDirectory(), "Plugins");
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
                var pluginList = Directory.GetFiles(directory)
                    .Where(x => x.EndsWith("Pn.dll") && Path.GetFileName(x) != "eFormApi.BasePn.dll")
                    .ToList();

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
                        });
                    foreach (var type in loader.LoadDefaultAssembly()
                        .GetTypes()
                        .Where(t => typeof(IEformPlugin).IsAssignableFrom(t) && !t.IsAbstract))
                    {
                        Console.WriteLine("Found plugin " + type.Name);
                        var plugin = (IEformPlugin) Activator.CreateInstance(type);
                        plugins.Add(plugin);
                    }

                    //var loader = PluginLoader.CreateFromAssemblyFile(
                    //    plugin,
                    //    sharedTypes: new [] { typeof(IEformPlugin), typeof(IServiceCollection), typeof(ILogger) });
                    loaders.Add(loader);
                }
            }


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

