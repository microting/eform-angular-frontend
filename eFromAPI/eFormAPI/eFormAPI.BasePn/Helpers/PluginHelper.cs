//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Linq;
//using System.Reflection;

//namespace eFormAPI.Web.Infrastructure.Helpers
//{
//    public static class PluginHelper
//    {
//        public static List<Assembly> GetPluginAssemblies()
//        {
//            var path = System.Web.Hosting.HostingEnvironment.MapPath("~/Plugins");
//            if (path == null)
//            {
//                throw new Exception("Plugin path not found");
//            }

//            if (!Directory.Exists(path))
//            {
//                try
//                {
//                    Directory.CreateDirectory(path);
//                }
//                catch
//                {
//                    throw new Exception("Unable to create directory for plugins");
//                }
//            }
//            var assemblies = new List<Assembly>();
//            var directories = Directory.EnumerateDirectories(path);
//            foreach (var directory in directories)
//            {
//                var pluginList = Directory.GetFiles(directory)
//                    .Where(x => x.EndsWith("Pn.dll") && Path.GetFileName(x) != "EformBase.Pn.dll")
//                    .ToList();

//                foreach (var plugin in pluginList)
//                {
//                    assemblies.Add(Assembly.LoadFrom(Path.Combine(plugin)));
//                }
//            }
//            return assemblies;
//        }
//    }
//}

