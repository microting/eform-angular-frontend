using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security;
using Microsoft.Win32;
using System.Reflection;
using System.Threading;
using Microsoft.Web.Administration;

namespace AlowMultipleVersionsBundle
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                string path = Path.Combine(Path.GetTempPath(), "Eform Angular Frontend.exe");
                if (IsFileLocked(path))
                    // wait for previous installer finish
                    Thread.Sleep(2000);

                var unistall =
                    Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall",
                        true);

                var products = unistall.GetSubKeyNames().Where(t =>
                    unistall.OpenSubKey(t).GetValue("BundleProviderKey")?.ToString() ==
                    "6EEA199E-0A6C-416A-8969-A48ACB0B1130");
                if (products != null)
                    foreach (var product in products)
                        unistall.OpenSubKey(product, true).SetValue("Installed", 0);

                SetupIIS();

                try
				{
					File.WriteAllBytes(path, Resources.Eform_Angular_Frontend);
				}
                catch(Exception)
				{
					
				}
                
                var drive = DriveInfo.GetDrives().First(t => t.DriveType == DriveType.Fixed).Name;
                var tmpDir = Path.Combine(drive, "tmp");
                if (Directory.Exists(tmpDir))
                    Directory.Delete(tmpDir, true);

                var dirInfo = Directory.CreateDirectory(tmpDir);
                dirInfo.Attributes = FileAttributes.Directory | FileAttributes.Hidden;
                File.WriteAllText(dirInfo.FullName + "\\config.txt", Assembly.GetExecutingAssembly().Location);

                Process.Start(path);
            }
            catch (SecurityException e)
            {
                Console.WriteLine("Please run installer package as administrator");
            }

        }

        static bool IsFileLocked(string path)
        {
            FileStream stream = null;

            try
            {
                stream = File.Open(path, FileMode.Open, FileAccess.Read, FileShare.None);
            }
            catch (IOException)
            {
                return true;
            }
            finally
            {
                if (stream != null)
                    stream.Close();
            }
            return false;
        }

        static void SetupIIS()
        {
            var featureNames = new[]
            {
                "IIS-ApplicationDevelopment",
                "IIS-CommonHttpFeatures",
                "IIS-DefaultDocument",
                "IIS-ISAPIExtensions",
                "IIS-ISAPIFilter",
                "IIS-ManagementConsole",
                "IIS-NetFxExtensibility",
                "IIS-RequestFiltering",
                "IIS-Security",
                "IIS-StaticContent",
                "IIS-WebServer",
                "IIS-WebServerRole",
            };
            bool is64bit = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PROCESSOR_ARCHITEW6432"));
            var dism = is64bit ? @"C:\WINDOWS\SYSNATIVE\DISM.EXE" : "dism";

            RunProcess(
                dism,
                $"/NoRestart /Online /Enable-Feature {string.Join(" ", featureNames.Select(name => $"/FeatureName:{name}"))}");

            // enable proxy
            using (ServerManager serverManager = new ServerManager())
            {
                Configuration config = serverManager.GetApplicationHostConfiguration();
                ConfigurationSection proxySection = config.GetSection("system.webServer/proxy");
                proxySection["enabled"] = true;

                serverManager.CommitChanges();
            }
        }

        static void RunProcess(string fileName, string arguments)
        {
            using (var process = Process.Start(new ProcessStartInfo
            {
                FileName = fileName,
                Arguments = arguments,
                UseShellExecute = false
            }))
            {
                process.WaitForExit();
            }
        }
    }
}
