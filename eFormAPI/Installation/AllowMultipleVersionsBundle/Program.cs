using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security;
using Microsoft.Win32;
using System.Reflection;
using System.Threading;
using Microsoft.Web.Administration;
using System.Collections.Generic;
using System.Windows.Forms;

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

                Process.Start(path, $"-l \"{ Path.Combine(Environment.CurrentDirectory, "logs.log" )}\"");
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
                "DefaultDocument",
                "DirectoryBrowse",
                "HttpErrors",
                "StaticContent",
                "HttpRedirect",
                "HttpLogging",
                "HttpCompressionStatic",
                "RequestFiltering",
                "ISAPIFilter",
                "ISAPIExtensions",
                "NetFxExtensibility",
                "ManagementConsole",
                "NetFxExtensibility45",
                "WindowsAuthentication",
                "ASPNET45",
                "ApplicationInit"
            };


            bool is64bit = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PROCESSOR_ARCHITEW6432"));
            var dism = is64bit ? @"C:\WINDOWS\SYSNATIVE\DISM.EXE" : "dism";

            // Removing Installed features from array
            featureNames = FiaturesNotExist(featureNames);

            if (featureNames.Length > 0)
            {
                for (int index = 0; index < featureNames.Length; index++)
                {
                    Console.WriteLine(string.Format("Trying to enable {0} feature", featureNames[index]));
                    RunProcess(
                    dism,
                    $"/NoRestart /Online /Enable-Feature /FeatureName:IIS-{ featureNames[index]} /all");
                }

                // Restart when enabling was complited
                Restart();
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

        static string[] FiaturesNotExist(string[] features)
        {
            var newFeatureList = new List<string>();
            for (var index = 0; index < features.Length; index++)
            {
                if (Registry.GetValue(@"HKEY_LOCAL_MACHINE\Software\Microsoft\InetStp\Components", features[index], null) == null)
                {
                    if (features[index] == "DirectoryBrowse")
                        newFeatureList.Add("DirectoryBrowsing");
                    else if (features[index] == "ApplicationInit")
                        continue;
                    else
                        newFeatureList.Add(features[index]);
                }
            }

            var value = Registry.GetValue(@"HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\ServerManager\ServicingStorage\ServerComponentCache\Web-AppInit", "InstallState", null);
            if (value?.ToString() != 1.ToString())
                newFeatureList.Add("ApplicationInit");

            return newFeatureList.ToArray();
        }

        static void Restart()
        {
            var result = MessageBox.Show("To continue with installation process restart required", "Restart required", MessageBoxButtons.YesNo);
            if (result == DialogResult.Yes || result == DialogResult.OK)
                Process.Start("shutdown", "/r /t 0");
        }
    }
}