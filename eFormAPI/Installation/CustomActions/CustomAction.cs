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
using System.Security.Principal;
using System.Management.Automation;
using System.Net.NetworkInformation;

namespace CustomActions
{
    public class CustomActions
    {
        public static Session Session;
        public static string FixACL = @"$out = icacls ""$dirrectory"" /verify /t /q;
                                    foreach($line in $out)
                                    {
                                        if ($line -match '(.:[^:]*): (.*)')
                                        {
                                            $path = $Matches[1];
                                            Set-Acl $path(Get-Acl $path);
                                        }
                                    }";


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
        public static ActionResult TryFindConfigs(Session session)
        {
            try
            {
                var installFolder = session["INSTALLFOLDER"];
                if (!Directory.Exists(installFolder))
                    return ActionResult.Success;

                var customerNumber = session["CUSTOMERNUMBER"];
                var domain = session["DOMAINNAME"];
                var appFolderName = $"{customerNumber}_{domain}";

                var configFolders = session["KEEPFOLDERS"].Split(',');
                var configFiles = session["KEEPFILES"].Split(','); 

                var dirs = Directory.GetDirectories(installFolder).Where(t => t.Contains(appFolderName));

                if (!dirs.Any())
                {
                    session["CONFIGURATIONEXISTS"] = null;
                    return ActionResult.Success;
                }

                var tmp = Path.Combine("c:\\", "MicrotingTemp");
                Directory.CreateDirectory(tmp);
                Directory.CreateDirectory(Path.Combine(tmp, "files"));
                Directory.CreateDirectory(Path.Combine(tmp, "dirs"));

                bool configsFound = false;
                foreach (var dir in dirs)
                {
                    var formatedFolders = configFolders.Select(t =>
                        t.Replace("eform-api\\", "")
                            .Replace("eform-client\\", "")).ToArray();
                    var formatedNames = configFiles.Select(t =>
                        t.Replace("eform-api\\", "")
                            .Replace("eform-client\\", "")).ToArray();

                    var configFoldersFound = SaveConfigFolders(formatedFolders, tmp, dir);
                    var configFilesFound = SaveConfigFiles(formatedNames, tmp, dir);

                    configsFound = configFoldersFound || configFilesFound || configsFound;
                }

                if (configsFound)
                {
                    session["CONFIGURATIONEXISTS"] = "1";
                    return ActionResult.Success;
                }

                session["CONFIGURATIONEXISTS"] = null;
                return ActionResult.Success;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message + " " + ex.StackTrace);
                return ActionResult.Failure;
            }
        }

        private static bool SaveConfigFiles(string[] configFiles, string tmp, string dir)
        {
            bool configsFound = false;
            foreach (var configFile in configFiles)
            {
                var configFileFullName = Path.Combine(dir, configFile);
                if (File.Exists(configFileFullName))
                {
                    configsFound = true;
                    var newDest = Path.Combine(tmp, "files", new FileInfo(configFileFullName).Name);
                    File.Copy(configFileFullName, newDest, true);
                }
            }

            return configsFound;
        }

        private static bool SaveConfigFolders(string[] configFolders, string tmp, string dir)
        {
            var configsFound = false;

            foreach (var configFolder in configFolders)
            {
                var configFolderFullName = Path.Combine(dir, configFolder);
                if (Directory.Exists(configFolderFullName))
                {
                    configsFound = true;
                    DirectoryCopy(configFolderFullName, Path.Combine(tmp, "dirs", new DirectoryInfo(configFolderFullName).Name));
                }
            }

            return configsFound;
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

                var configurationExists = session.CustomActionData["CONFIGURATIONEXISTS"] == "1";
                var useExistingConfiguration = session.CustomActionData["USEEXISTINGCONFIGURATION"] == "1";
                var installFolder = session.CustomActionData["INSTALLFOLDER"];
                var customerNumber = session.CustomActionData["CUSTOMERNUMBER"];
                var domain = session.CustomActionData["DOMAINNAME"];

                if (configurationExists && useExistingConfiguration)
                    HandlePreviousConfigs(session, installFolder);

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

                session.Log("Host WebAPI called");
                AddImageHandlers(webApiName);
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
                    var email = session.CustomActionData["EMAIL"];
                    RunProcess(Path.Combine(installFolder, "letsencrypt\\letsencrypt.exe"), $"--plugin iissite --siteid { siteId } --emailaddress { email } --accepttos --usedefaulttaskuser");
                }

                ConfigureSecurity(clientLocation);
                ConfigureSecurity(webApiLocation);
                //DeleteDirectory(Path.Combine(installFolder, "letsencrypt"));
                IncrementProgressBar(session);

                return ActionResult.Success;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message + " " + ex.StackTrace);
                return ActionResult.Failure;
            }
        }

        private static void HandlePreviousConfigs(Session session, string installFolder)
        {
            var keepFiles = session.CustomActionData["KEEPFILES"].Split(',');
            var keepFolders = session.CustomActionData["KEEPFOLDERS"].Split(',');
            var tmpConfigs = Path.Combine("c:\\", "MicrotingTemp");

            foreach (var keepFolder in keepFolders)
            {
                var path = Path.Combine(tmpConfigs, "dirs",
                    keepFolder.Replace("eform-api\\", "").Replace("eform-client\\", ""));
                if (Directory.Exists(path))
                    DirectoryCopy(path, Path.Combine(installFolder, keepFolder));
            }


            foreach (var keepFile in keepFiles)
            {
                var path = Path.Combine(tmpConfigs, "files",
                    keepFile.Replace("eform-api\\", "").Replace("eform-client\\", ""));
                if (File.Exists(path))
                    File.Copy(path, Path.Combine(installFolder, keepFile), true);
            }

            DeleteDirectory(tmpConfigs);
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

                var instDir = session.CustomActionData["INSTALLFOLDER"];
                var apiTemp = Path.Combine(instDir, "eform-api");
                var clientTemp = Path.Combine(instDir, "eform-client");

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

                try
                {
                    DeleteDirectory(Path.Combine(uiIisDir, "node_modules"));
                } catch { }
                try
                {
                    DeleteDirectory(Path.Combine(uiIisDir, "dist"));
                } catch { }
                try
                {
                    DeleteDirectory(Path.Combine(uiIisDir, "src"));
                } catch { }

                session.Log("Set proper names to folders");

                DirectoryCopy(apiTemp, webApiLocation);
                DirectoryCopy(clientTemp, uiIisDir);

                IncrementProgressBar(session);

                session.Log("Build Angullar app task started");
                BuildAngularApp(uiIisDir);
                IncrementProgressBar(session);

                session.Log("AddImageHandlers called");
                AddImageHandlers(uiName);
                IncrementProgressBar(session);
                

                session.Log("RunAngularAsWinService called");
                RunAngularAsWinService(apiPort, uiPort, uiIisDir, uiName);
                IncrementProgressBar(session);

                ControlSites(customerNumber, domain, apiPort, uiPort, true);
                IncrementProgressBar(session);

                ConfigureSecurity(uiIisDir);
                ConfigureSecurity(webApiLocation);

                DeleteDirectory(apiTemp);
                DeleteDirectory(clientTemp);
                DeleteDirectory(Path.Combine(instDir, "letsencrypt"));

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

                var keepSettings = session.CustomActionData["KEEPSETTINGS"] == "1";
                var keepFolders = keepSettings
                    ? session.CustomActionData["KEEPFOLDERS"].Split(',').Select(t =>
                        t.Replace("eform-api\\", "")
                            .Replace("eform-client\\", "")).ToArray()
                    : new string[0];
                var keepFiles = keepSettings
                    ? session.CustomActionData["KEEPFILES"].Split(',').Select(t =>
                        t.Replace("eform-api\\", "")
                            .Replace("eform-client\\", "")).ToArray()
                    : new string[0];

                DeleteDirectory(uiIisDir, keepFolders, keepFiles, uiIisDir);
                IncrementProgressBar(session);
                DeleteDirectory(webApiIisDir, keepFolders, keepFiles, webApiIisDir);
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

        [CustomAction]
        public static ActionResult RestartInstallerCA(Session session)
        {
            try
            {
                var drive = DriveInfo.GetDrives().First(t => t.DriveType == DriveType.Fixed).Name;
                var tmpDir = Path.Combine(drive, "tmp", "config.txt");

                var location = File.ReadAllText(tmpDir);
                Process.Start(location);

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

        public static void DeleteDirectory(string targetDir) => 
            DeleteDirectory(targetDir, new string[0], new string[0], targetDir);

        public static void DeleteDirectory(string targetDir, string[] keepFolders, string[] keepFiles, string initialDir)
        {
            var keepFoldersModified = keepFolders.Select(t => Path.Combine(initialDir, t)).ToArray();
            var keepFilesModified = keepFiles.Select(t => Path.Combine(initialDir, t)).ToArray();

            var files = Directory.GetFiles(targetDir).Except(keepFilesModified);
            var dirs = Directory.GetDirectories(targetDir).Except(keepFoldersModified);

            foreach (string file in files)
            {
                File.SetAttributes(file, System.IO.FileAttributes.Normal);
                File.Delete(file);
            }

            foreach (string dir in dirs)
                DeleteDirectory(dir, keepFolders, keepFiles, initialDir);

            if (Directory.GetFiles(targetDir).Any() || Directory.GetDirectories(targetDir).Any())
                return;

            Directory.Delete(targetDir, false);
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
            DirectoryCopy(Path.Combine(location, "eform-api"), apiName, false);
            DirectoryCopy(Path.Combine(location, "eform-client"), uiName, false);
            DeleteDirectory(Path.Combine(location, "eform-api"));
            DeleteDirectory(Path.Combine(location, "eform-client"));
        }

        public static void ConfigureSecurity(string folder)
        {
            using (var powershell = PowerShell.Create())
            {
                powershell.AddScript(FixACL.Replace("$dirrectory", folder));
                powershell.Invoke();

                var dInfo = new DirectoryInfo(folder);

                var dSecurity = dInfo.GetAccessControl();

                dSecurity.AddAccessRule(new FileSystemAccessRule("IUSR", FileSystemRights.FullControl, InheritanceFlags.ContainerInherit | InheritanceFlags.ObjectInherit, PropagationFlags.None, AccessControlType.Allow));
                powershell.AddScript(FixACL.Replace("$dirrectory", folder));
                powershell.Invoke();

                dSecurity.AddAccessRule(new FileSystemAccessRule("IIS_IUSRS", FileSystemRights.FullControl, InheritanceFlags.ContainerInherit | InheritanceFlags.ObjectInherit, PropagationFlags.None, AccessControlType.Allow));
                powershell.AddScript(FixACL.Replace("$dirrectory", folder));
                powershell.Invoke();

                dInfo.SetAccessControl(dSecurity);

                ReplaceAllDescendantPermissionsFromObject(dInfo, dSecurity);
            }
        }

        private static void ReplaceAllDescendantPermissionsFromObject(DirectoryInfo dInfo, DirectorySecurity dSecurity)
        {
            dInfo.SetAccessControl(dSecurity);

            foreach (FileInfo fi in dInfo.GetFiles())
            {
                var ac = fi.GetAccessControl();

                ac.SetAccessRuleProtection(false, false);

                fi.SetAccessControl(ac);
            }

            dInfo.GetDirectories().ToList().ForEach(d => ReplaceAllDescendantPermissionsFromObject(d, dSecurity));
        }

        private static void BuildAngularApp(string appLocation)
        {
            Session.Log("BuildAngularApp -> npm install");
            RunProcess(@"C:\Program Files\nodejs\npm.cmd", "install", appLocation);

            Session.Log("BuildAngularApp -> npm run build");
            RunProcess(@"C:\Program Files\nodejs\npm.cmd", "run build", appLocation);
        }

        private static void HostWebApi(string siteName, int port, string iisDir)
        {
            using (var serverManager = new ServerManager())
            {
                CreateAppPool(serverManager, siteName);

                serverManager.Sites.Add(siteName, iisDir, port);
                foreach (var item in serverManager.Sites[siteName].Applications)
                    item.ApplicationPoolName = siteName;

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

            RunProcess(@"sc", $"start eformangular{uiName.Replace(".", "")}.exe");
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

        private static void AddImageHandlers(string siteName)
        {

            using (ServerManager serverManager = new ServerManager())
            {
                MessageBox.Show("AddImageHandlers called");
                var config = serverManager.GetWebConfiguration(siteName);
                var handlersSection = config.GetSection("system.webServer/handlers");
                var handlersCollection = handlersSection.GetCollection();
                bool pngHandlerMissing = true;
                bool jpgHandlerMissing = true;
                bool jpegHandlerMissing = true;

                foreach (ConfigurationElement ce in handlersCollection)
                {
                    if (ce.GetAttributeValue("name").ToString() == "get-image-png")
                    {
                        MessageBox.Show("pngHandlerMissing");
                        pngHandlerMissing = false;
                    }
                    if (ce.GetAttributeValue("name").ToString() == "get-image-jpg")
                    {
                        MessageBox.Show("jpgHandlerMissing");
                        jpgHandlerMissing = false;
                    }
                    if (ce.GetAttributeValue("name").ToString() == "get-image-jpeg")
                    {
                        MessageBox.Show("jpegHandlerMissing");
                        jpegHandlerMissing = false;
                    }
                }

                if (pngHandlerMissing)
                {
                    try
                    {
                        ConfigurationElement configurationElementpng = handlersCollection.CreateElement("add");
                        MessageBox.Show("pngHandlerMissing 1");
                        configurationElementpng["name"] = "get-image-png";
                        MessageBox.Show("pngHandlerMissing 2");
                        configurationElementpng["path"] = @"*.png";
                        MessageBox.Show("pngHandlerMissing 3");
                        configurationElementpng["verb"] = "GET";
                        MessageBox.Show("pngHandlerMissing 4");
                        configurationElementpng["type"] = @"System.Web.Handlers.TransferRequestHandler";
                        MessageBox.Show("pngHandlerMissing 5");
                        configurationElementpng["preCondition"] = "integratedMode,runtimeVersionv4.0";
                        MessageBox.Show("pngHandlerMissing 6");
                        configurationElementpng["responseBufferLimit"] = 0;
                        MessageBox.Show("pngHandlerMissing 7");

                        handlersCollection.Add(configurationElementpng);
                    } catch (Exception ex)
                    {
                        MessageBox.Show("pngHandlerMissing ex is : " + ex.Message + "stacktrace : " + ex.StackTrace);
                    }
                    
                }
                if (jpgHandlerMissing)
                {
                    try
                    {
                        ConfigurationElement configurationElementjpg = handlersCollection.CreateElement("add");
                        configurationElementjpg["name"] = "get-image-jpg";
                        configurationElementjpg["path"] = @"*.jpg";
                        configurationElementjpg["verb"] = "GET";
                        configurationElementjpg["type"] = @"System.Web.Handlers.TransferRequestHandler";
                        configurationElementjpg["preCondition"] = "integratedMode,runtimeVersionv4.0";
                        configurationElementjpg["responseBufferLimit"] = 0;

                        handlersCollection.Add(configurationElementjpg);
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("jpgHandlerMissing ex is : " + ex.Message + "stacktrace : " + ex.StackTrace);
                    }
                }

                if (jpegHandlerMissing)
                {
                    try
                    {
                        ConfigurationElement configurationElementjpeg = handlersCollection.CreateElement("add");
                        configurationElementjpeg["name"] = "get-image-jpeg";
                        configurationElementjpeg["path"] = @"*.jpeg";
                        configurationElementjpeg["verb"] = "GET";
                        configurationElementjpeg["type"] = @"System.Web.Handlers.TransferRequestHandler";
                        configurationElementjpeg["preCondition"] = "integratedMode,runtimeVersionv4.0";
                        configurationElementjpeg["responseBufferLimit"] = 0;

                        handlersCollection.Add(configurationElementjpeg);
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("jpegHandlerMissing ex is : " + ex.Message + "stacktrace : " + ex.StackTrace);
                    }
                }            
                
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
                actionElement1["url"] = uiServiceLink + "/{R:1}";

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
                var port =  usedPorts.Any() ? usedPorts.Max() + 1 : 5000;

                while (!IsPortAvailable(port))
                    port += 1;

                return port;
            }
        }

        private static bool IsPortAvailable(int port)
        {
            bool isAvailable = true;

            IPGlobalProperties ipGlobalProperties = IPGlobalProperties.GetIPGlobalProperties();
            var ports = new List<int>(ipGlobalProperties.GetActiveTcpConnections().Select(t => t.LocalEndPoint.Port));
            ports.AddRange(ipGlobalProperties.GetActiveTcpListeners().Select(t => t.Port));
            foreach (var usedPort in ports)
            {
                if (usedPort == port || usedPort == port - 2000)
                {
                    isAvailable = false;
                    break;
                }
            }

            return isAvailable;
        }

        private static void CreateAppPool(ServerManager serverManager, string name)
        {
            ApplicationPool newPool = serverManager.ApplicationPools.Add(name);
            newPool.ManagedRuntimeVersion = "v4.0";
            newPool.ManagedPipelineMode = ManagedPipelineMode.Integrated;

            serverManager.CommitChanges();
        }

        private static void DirectoryCopy(string sourceDirName, string destDirName, bool overrideFile = true)
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

                if (File.Exists(temppath) && !overrideFile)
                    continue;

                file.CopyTo(temppath, overrideFile);
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
