using System;
using System.Windows.Forms;
using Microsoft.Win32;
using Microsoft.Deployment.WindowsInstaller;
using System.IO;
using System.Diagnostics;
using System.Linq;
using Microsoft.Web.Administration;
using System.Collections.Generic;
using System.Management;
using System.Security.AccessControl;
using System.Threading;
using System.Threading.Tasks;

namespace CustomActions
{
    public class CustomActions
    {
        public static Session Session;

        [CustomAction]
        public static ActionResult GetAPIsListCA(Session session)
        {
            try
            {
                var ui = GetServiceList();
                if (string.IsNullOrEmpty(ui))
                {
                    session["NOUI"] = "1";
                    return ActionResult.Success;
                }

                var clearDefault = session.Database.OpenView("DELETE FROM ComboBox WHERE ComboBox.Property='DOMAINNAME'");
                clearDefault.Execute();

                var lView = session.Database.OpenView("SELECT * FROM ComboBox WHERE ComboBox.Property='DOMAINNAME'");
                lView.Execute();

                var list = ui.Split(',');
                int index = 1;
                foreach (var service in list)
                {
                    Record lRecord = session.Database.CreateRecord(4);
                    lRecord.SetString(1, "DOMAINNAME");
                    lRecord.SetInteger(2, index);
                    lRecord.SetString(3, service);
                    lRecord.SetString(4, service);
                    lView.Modify(ViewModifyMode.InsertTemporary, lRecord);

                    ++index;
                }

                lView.Close();

                session["DOMAINNAME"] = list.First();

                return ActionResult.Success;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message + " " + ex.StackTrace);
                return ActionResult.Failure;
            }
        }

        [CustomAction]
        public static ActionResult InstallCA(Session session)
        {
            Session = session;
            try
            {
                if (session.CustomActionData["INSTMODE"] != "Install")
                    return ActionResult.Success;

                ResetProgressBar(session, 10);

                var installFolder = session.CustomActionData["INSTALLFOLDER"];
                var customerNumber = session.CustomActionData["CUSTOMERNUMBER"];
                var domain = session.CustomActionData["DOMAINNAME"];

                session.Log("Get web api port");
                var webApiPort = GetWebApiPort();
                var webApiName = $"{customerNumber}_{domain}_{webApiPort}";
                IncrementProgressBar(session);

                session.Log("Get ui port");
                var uiPort = webApiPort-2000;
                var uiName = $"{customerNumber}_{domain}_client_{uiPort}";
                IncrementProgressBar(session);

                var clientLocation = Path.Combine(installFolder, uiName);
                var webApiLocation = Path.Combine(installFolder, webApiName);

                session.Log("Set proper names to folders");
                RenameFolders(installFolder, webApiLocation, clientLocation);
                IncrementProgressBar(session);

                session.Log("Build Angullar app task started");
                BuildAngularApp(clientLocation);
                IncrementProgressBar(session);

                session.Log("Host WebAPI called");
                HostWebApi(webApiName, webApiPort, webApiLocation);
                IncrementProgressBar(session);

                session.Log("RunAngularAsWinService called");
                RunAngularAsWinService(webApiPort, uiPort, clientLocation, uiName);
                IncrementProgressBar(session);

                session.Log("HostAngularApp called");
                HostAngularApp(clientLocation, domain, uiName);
                IncrementProgressBar(session);

                session.Log("AddRedirectionRules called");
                AddRedirectionRules(uiName, $"http://localhost:{uiPort}");
                IncrementProgressBar(session);

                session.Log("SaveInstances called");
                SaveInstances(webApiName);
                IncrementProgressBar(session);

                if (session.CustomActionData["GENERATESSL"] == "1")
                {
                    var siteId = GetSiteId(uiName);
                    RunProcess(Path.Combine(installFolder, "letsencrypt\\letsencrypt.exe"), $"--plugin iissite --siteid { siteId } --accepttos --usedefaulttaskuser");
                }

                CongigureSecurity(clientLocation);
                CongigureSecurity(webApiLocation);

                DeleteDirectory(Path.Combine(installFolder, "letsencrypt"));
                IncrementProgressBar(session);

                return ActionResult.Success;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message + " " + ex.StackTrace);
                return ActionResult.Failure;
            }
        }

        private static long GetSiteId(string uiName)
        {
            using (var serverManager = new ServerManager())
            {
                return serverManager.Sites[uiName].Id;
            }
        }

        public static MessageResult ResetProgressBar(Session session, int totalStatements)
        {
            var record = new Record(3);
            record[1] = 0; // "Reset" message 
            record[2] = totalStatements;  // total ticks 
            record[3] = 0; // forward motion 
            return session.Message(InstallMessage.Progress, record);
        }

        public static MessageResult IncrementProgressBar(Session session)
        {
            var record = new Record(3);
            record[1] = 2; // "ProgressReport" message 
            record[2] = 1; // ticks to increment 
            record[3] = 0; // ignore 
            return session.Message(InstallMessage.Progress, record);
        }

        [CustomAction]
        public static ActionResult UpdateCA(Session session)
        {
            Session = session;

            try
            {
                if (session.CustomActionData["INSTMODE"] != "Update")
                    return ActionResult.Success;

                ResetProgressBar(session, 8);

                var domainName = session.CustomActionData["DOMAINNAME"];
                var api =  domainName.Split('_');
                var domain = api[1];
                var customerNumber = api.First();
                var apiPort = int.Parse(api.Last());
                var uiPort = apiPort - 2000;

                var siteDir = GetInstallDirrectory(domainName);

                // stop sites
                ControlSites(customerNumber, domain, apiPort, uiPort, false);
                IncrementProgressBar(session);

                // client update
                var uiName = $"{customerNumber}_{domain}_client_{uiPort}";
                var uiIisDir = Path.Combine(siteDir + uiName);
                var webApiLocation = Path.Combine(siteDir, domainName);

                RunProcess(@"sc", $"stop eformangular{uiName.Replace(".", "")}.exe");
                Thread.Sleep(1000);
                RunProcess(@"C:\Program Files\nodejs\node.exe", "svc.js uninstall", uiIisDir);
                IncrementProgressBar(session);

                session.Log("Set proper names to folders");

                DirectoryCopy(Path.Combine(session.CustomActionData["INSTALLFOLDER"], "eform-api"), webApiLocation);
                DirectoryCopy(Path.Combine(session.CustomActionData["INSTALLFOLDER"], "eform-client"), uiIisDir);

                IncrementProgressBar(session);

                session.Log("Build Angullar app task started");
                BuildAngularApp(uiIisDir);
                IncrementProgressBar(session);

                session.Log("RunAngularAsWinService called");
                RunAngularAsWinService(apiPort, uiPort, uiIisDir, uiName);
                IncrementProgressBar(session);

                ControlSites(customerNumber, domain, apiPort, uiPort, true);
                IncrementProgressBar(session);

                CongigureSecurity(uiIisDir);
                CongigureSecurity(webApiLocation);

                DeleteDirectory(session.CustomActionData["INSTALLFOLDER"]);
                return ActionResult.Success;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message + " " + ex.StackTrace);
                return ActionResult.Failure;
            }
            
        }

        [CustomAction]
        public static ActionResult RemoveCA(Session session)
        {
            Session = session;
            try
            {
                if (session.CustomActionData["INSTMODE"] != "Remove")
                    return ActionResult.Success;

                ResetProgressBar(session, 6);

                var domainName = session.CustomActionData["DOMAINNAME"];
                var api = domainName.Split('_');
                var domain = api[1];
                var customerNumber = api.First();
                var apiPort = int.Parse(api.Last());
                var uiPort = apiPort - 2000;

                var installDir = GetInstallDirrectory(domainName);          

                var uiName = $"{customerNumber}_{domain}_client_{uiPort}";
                var uiIisDir = Path.Combine(installDir + uiName);
                var webApiName = $"{customerNumber}_{domain}_{apiPort}";
                var webApiIisDir = Path.Combine(installDir + webApiName);

                // stop sites
                ControlSites(customerNumber, domain, apiPort, uiPort, false);
                IncrementProgressBar(session);
                RemoveSites(customerNumber, domain, apiPort, uiPort);
                IncrementProgressBar(session);

                RunProcess(@"sc", $"stop eformangular{uiName.Replace(".", "")}.exe");
                Thread.Sleep(1000);
                RunProcess(@"C:\Program Files\nodejs\node.exe", "svc.js uninstall", uiIisDir);
                RunProcess(@"sc", $"delete eformangular{uiName.Replace(".", "")}.exe");
                IncrementProgressBar(session);

                DeleteDirectory(uiIisDir);
                IncrementProgressBar(session);
                DeleteDirectory(webApiIisDir);
                IncrementProgressBar(session);

                var vendorName = "Microting";
                var soft = Registry.Users.OpenSubKey(".default\\SOFTWARE", true);
                var vendor = soft.OpenSubKey(vendorName, true);

                var ui = vendor?.GetValue("UI")?.ToString().Split(',');

                vendor.SetValue("UI", string.Join(",", ui.Where(t => t != session.CustomActionData["DOMAINNAME"]).ToArray()));
                IncrementProgressBar(session);
                return ActionResult.Success;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message + " " + ex.StackTrace);
                return ActionResult.Failure;
            }
           
        }

        public static void DeleteDirectory(string target_dir)
        {
            string[] files = Directory.GetFiles(target_dir);
            string[] dirs = Directory.GetDirectories(target_dir);

            foreach (string file in files)
            {
                File.SetAttributes(file, System.IO.FileAttributes.Normal);
                File.Delete(file);
            }

            foreach (string dir in dirs)
            {
                DeleteDirectory(dir);
            }

            Directory.Delete(target_dir, false);
        }

        private static string GetServiceList()
        {

            var vendorName = "Microting";
            var soft = Registry.Users.OpenSubKey(".default\\SOFTWARE");
            var vendor = soft.OpenSubKey(vendorName);
            var ui = vendor?.GetValue("UI")?.ToString();
            if (string.IsNullOrEmpty(ui))
                return null;

            return ui;
        }

        private static void RenameFolders(string location, string apiName, string uiName)
        {
            Directory.Move(Path.Combine(location, "eform-api"), apiName);
            Directory.Move(Path.Combine(location, "eform-client"), uiName);
        }

        public static void CongigureSecurity(string folder)
        {
            var dInfo = new DirectoryInfo(folder);

            var dSecurity = dInfo.GetAccessControl();

            dSecurity.AddAccessRule(new FileSystemAccessRule("IUSR", FileSystemRights.FullControl, AccessControlType.Allow));
            dSecurity.AddAccessRule(new FileSystemAccessRule("IIS_IUSRS", FileSystemRights.FullControl, AccessControlType.Allow));

            dInfo.SetAccessControl(dSecurity);
        }

        private static void BuildAngularApp(string appLocation)
        {
            Session.Log("BuildAngularApp -> npm install");
            RunProcess(@"C:\Program Files\nodejs\npm.cmd", "install", appLocation);

            Session.Log("BuildAngularApp -> npm run build");
            RunProcess(@"C:\Program Files\nodejs\npm.cmd", "run build", appLocation);
        }

        private static void HostWebApi(string webApiName, int port, string iisDir)
        {
            using (var serverManager = new ServerManager())
            {
                CreateAppPool(serverManager, webApiName);

                serverManager.Sites.Add(webApiName, iisDir, port);
                foreach (var item in serverManager.Sites[webApiName].Applications)
                    item.ApplicationPoolName = webApiName;

                serverManager.CommitChanges();
            }
        }

        private static string GetInstallDirrectory(string siteName)
        {
            using (var serverManager = new ServerManager())
            {
                var sitePath = serverManager.Sites[siteName].Applications["/"].VirtualDirectories["/"].PhysicalPath;
                 return new DirectoryInfo(sitePath).Parent.FullName + "\\";
            }
        }

        private static void RunAngularAsWinService(int webApiPort, int uiWinServicePort, string iisDir, string uiName)
        {
            var serverJs = File.ReadAllText(iisDir + @"\server.js");
            var svcJs = File.ReadAllText(iisDir + @"\svc.js");

            File.WriteAllText(iisDir + @"\server.js", serverJs.Replace("$$port$$", uiWinServicePort.ToString()).Replace("$$apiport$$", webApiPort.ToString()));
            File.WriteAllText(iisDir + @"\svc.js", svcJs.Replace("$$serviceName$$", uiName));

            RunProcess(@"C:\Program Files\nodejs\npm.cmd", "install -g node-windows", iisDir);
            RunProcess(@"C:\Program Files\nodejs\npm.cmd", "link node-windows", iisDir);
            RunProcess(@"C:\Program Files\nodejs\node.exe", "svc.js install", iisDir);
        }

        private static void HostAngularApp(string folder, string domain, string siteName)
        {
            using (ServerManager serverManager = new ServerManager())
            {
                CreateAppPool(serverManager, siteName);

                serverManager.Sites.Add(siteName, "http", $"*:80:{domain}", folder);

                foreach (var item in serverManager.Sites[siteName].Applications)
                    item.ApplicationPoolName = siteName;
                serverManager.CommitChanges();
            }
        }

        private static void AddRedirectionRules(string siteName, string uiServiceLink)
        {
            using (ServerManager serverManager = new ServerManager())
            {
                var config = serverManager.GetWebConfiguration(siteName);
                var rulesSection = config.GetSection("system.webServer/rewrite/rules");
                var rulesCollection = rulesSection.GetCollection();

                ConfigurationElement welknownrule = rulesCollection.CreateElement("rule");
                welknownrule["name"] = @".well-known";
                welknownrule["stopProcessing"] = true;

                ConfigurationElement matchElement1 = welknownrule.GetChildElement("match");
                matchElement1["url"] = @".well-known";

                rulesCollection.Add(welknownrule);

                ConfigurationElement httpsRedirectRule = rulesCollection.CreateElement("rule");
                httpsRedirectRule["name"] = "https_upgrade";
                httpsRedirectRule["patternSyntax"] = "Wildcard";
                httpsRedirectRule["stopProcessing"] = true;

                ConfigurationElement matchElement2 = httpsRedirectRule.GetChildElement("match");
                matchElement2["url"] = "*";
                matchElement2["negate"] = "false";

                ConfigurationElement redirectAction = httpsRedirectRule.GetChildElement("action");
                redirectAction["type"] = "Redirect";
                redirectAction["url"] = "https://{HTTP_HOST}{REQUEST_URI}";
                redirectAction["redirectType"] = "Found";

                ConfigurationElement conditions = httpsRedirectRule.GetChildElement("conditions");
                conditions["logicalGrouping"] = "MatchAny";

                ConfigurationElementCollection conditionsCollection = conditions.GetCollection();

                ConfigurationElement add = conditionsCollection.CreateElement("add");
                add["input"] = "{HTTPS}";
                add["pattern"] = "off";
                conditionsCollection.Add(add);

                rulesCollection.Add(httpsRedirectRule);


                ConfigurationElement rewriteRule = rulesCollection.CreateElement("rule");
                rewriteRule["name"] = @"ReverseProxyInboundRule";
                rewriteRule["stopProcessing"] = true;


                ConfigurationElement matchElement = rewriteRule.GetChildElement("match");
                matchElement["url"] = @"(.*)";

                ConfigurationElement actionElement1 = rewriteRule.GetChildElement("action");
                actionElement1["type"] = @"Rewrite";
                actionElement1["url"] = uiServiceLink + "{R:1}";

                rulesCollection.Add(rewriteRule);

                serverManager.CommitChanges();
            }
        }

        private static void SaveInstances(string webApiName)
        {
            var vendorName = "Microting";
            var soft = Registry.CurrentUser.OpenSubKey("SOFTWARE", true);
            if (!soft.GetSubKeyNames().Contains(vendorName))
                soft.CreateSubKey(vendorName);

            var vendor = soft.OpenSubKey(vendorName, true);
            var ui = vendor?.GetValue("UI")?.ToString();
            var list = new List<string> { webApiName };
            if (!string.IsNullOrEmpty(ui))
                list.Add(ui);
            if (ui != null && !ui.Contains(webApiName))
                vendor.SetValue("UI", string.Join(",", list.ToArray()));
            else
                vendor.SetValue("UI", webApiName);
        }

        private static int GetWebApiPort()
        {
            using (var serverManager = new ServerManager())
            {
                var usedPorts = serverManager.Sites.Where(t => t.Bindings.First().EndPoint.Port >= 5000).Select(t => t.Bindings.First().EndPoint.Port);
                return usedPorts.Any() ? usedPorts.Max() + 1 : 5000;
            }
        }

        private static void CreateAppPool(ServerManager serverManager, string name)
        {
            ApplicationPool newPool = serverManager.ApplicationPools.Add(name);
            newPool.ManagedRuntimeVersion = "v4.0";
            newPool.ManagedPipelineMode = ManagedPipelineMode.Integrated;

            serverManager.CommitChanges();
        }

        private static void DirectoryCopy(string sourceDirName, string destDirName)
        {
            // Get the subdirectories for the specified directory.
            DirectoryInfo dir = new DirectoryInfo(sourceDirName);

            if (!dir.Exists)
            {
                throw new DirectoryNotFoundException(
                    "Source directory does not exist or could not be found: "
                    + sourceDirName);
            }

            DirectoryInfo[] dirs = dir.GetDirectories();
            // If the destination directory doesn't exist, create it.
            if (!Directory.Exists(destDirName))
            {
                Directory.CreateDirectory(destDirName);
            }

            // Get the files in the directory and copy them to the new location.
            FileInfo[] files = dir.GetFiles();
            foreach (FileInfo file in files)
            {
                string temppath = Path.Combine(destDirName, file.Name);
                if (file.Name.Equals("Web.config", StringComparison.InvariantCultureIgnoreCase) && File.Exists(temppath))
                    continue;

                file.CopyTo(temppath, true);
            }

            //copying subdirectories, copy them and their contents to new location.
            foreach (DirectoryInfo subdir in dirs)
            {
                string temppath = Path.Combine(destDirName, subdir.Name);
                DirectoryCopy(subdir.FullName, temppath);
            }

        }

        static void RunProcess(string fileName, string arguments, string workingDirrectory = null)
        {
            using (var process = Process.Start(new ProcessStartInfo
            {
                FileName = fileName,
                Arguments = arguments,
                WindowStyle = ProcessWindowStyle.Hidden,
                UseShellExecute = false,
                WorkingDirectory = workingDirrectory
            }))
            {
                process.WaitForExit();
            }
        }

        private static void ControlSites(string customerNumber, string domain, int apiPort, int uiPort, bool shouldSiteBeStarted)
        {
            using (var serverManager = new ServerManager())
            {
                var sites = serverManager.Sites.Where(t => t.Name.Equals($"{customerNumber}_{domain}_{apiPort}") || t.Name.Equals($"{customerNumber}_{domain}_client_{uiPort}"));
                foreach (var site in sites)
                    if (shouldSiteBeStarted)
                        site.Start();
                    else
                        site.Stop();

                serverManager.CommitChanges();
            }
        }

        private static void RemoveSites(string customerNumber, string domain, int apiPort, int uiPort)
        {
            using (var serverManager = new ServerManager())
            {
                var names = serverManager.Sites
                    .Where(t => t.Name.Equals($"{customerNumber}_{domain}_{apiPort}") || t.Name.Equals($"{customerNumber}_{domain}_client_{uiPort}"))
                    .Select(t => t.Name)
                    .ToList();

                names.ForEach(s => serverManager.Sites.Remove(serverManager.Sites.First(t => t.Name == s)));
                names.ForEach(p => serverManager.ApplicationPools.Remove(serverManager.ApplicationPools.First(t => t.Name == p)));

                serverManager.CommitChanges();
            }
        }
    }
}
