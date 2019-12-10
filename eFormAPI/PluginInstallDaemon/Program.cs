using System;
using System.IO;
using eFormAPI.Web.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;

namespace PluginInstallDaemon
{
    class Program
    {
        static void Main(string[] args)
        {
            Log.LogEvent("Starting up");

            try
            {
                Directory.CreateDirectory(
                    "/var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/PluginInstallDaemonQueue");
            
            
                using (FileSystemWatcher watcher = new FileSystemWatcher())
                {
                    watcher.Path =
                        "/var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/PluginInstallDaemonQueue";

                    watcher.NotifyFilter = NotifyFilters.LastWrite;
                    watcher.Filter = "*.sh";
                    watcher.Changed += new FileSystemEventHandler(OnChanged);
                    watcher.EnableRaisingEvents = true;
                }
            }
            catch (UnauthorizedAccessException uex)
            {
                Log.LogException(uex.Message);
            }
            
        }

        private static void OnChanged(object source, FileSystemEventArgs e)
        {            
            Log.LogEvent("New file found");
        }
    }
}