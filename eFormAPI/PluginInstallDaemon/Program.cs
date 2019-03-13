using System;
using System.IO;

namespace PluginInstallDaemon
{
    class Program
    {
        static void Main(string[] args)
        {
            LogEvent("Starting up");

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
                LogException(uex.Message);
            }
            
        }

        private static void OnChanged(object source, FileSystemEventArgs e)
        {            
            LogEvent("New file found");
        }
        
        private static void LogEvent(string appendText)
        {
            try
            {                
                var oldColor = Console.ForegroundColor;
                Console.ForegroundColor = ConsoleColor.Gray;
                Console.WriteLine("[DBG] " + appendText);
                Console.ForegroundColor = oldColor;
            }
            catch
            {
            }
        }

        private static void LogException(string appendText)
        {
            try
            {
                var oldColor = Console.ForegroundColor;
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("[ERR] " + appendText);
                Console.ForegroundColor = oldColor;
            }
            catch
            {

            }
        }
    }
}