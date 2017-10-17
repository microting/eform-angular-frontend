using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security;
using Microsoft.Win32;

namespace AlowMultipleVersionsBundle
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                var unistall =
                    Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall",
                        true);

                var product = unistall.GetSubKeyNames().FirstOrDefault(t =>
                    unistall.OpenSubKey(t).GetValue("BundleProviderKey")?.ToString() ==
                    "6EEA199E-0A6C-416A-8969-A48ACB0B1130");
                if (product != null)
                    unistall.OpenSubKey(product, true).SetValue("Installed", 0);

                SetupIIS();

                string path = Path.Combine(Path.GetTempPath(), "Eform Angular Frontend.exe");
                File.WriteAllBytes(path, Resources.Eform_Angular_Frontend);
                Process.Start(path);
            }
            catch (SecurityException e)
            {
                Console.WriteLine("Please run installer package as administrator");
            }

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
