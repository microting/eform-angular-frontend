using System;
using System.Configuration;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.IO;
using System.Web.Configuration;
using System.Web.Http;
using eFormAPI.Common.API;
using eFormAPI.Common.Models.Settings;
using eFormAPI.Web.Infrastructure.Consts;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormAPI.Web.Migrations;
using eFormCore;
using NLog;

namespace eFormAPI.Web.Controllers
{
    public class SettingsController : ApiController
    {
        private readonly Logger Logger = LogManager.GetCurrentClassLogger();

        [AllowAnonymous]
        [HttpGet]
        [Route("api/settings/connection-string-exist")]
        public OperationResult ConnectionStringExist()
        {
            var inputPath = System.Web.Hosting.HostingEnvironment.MapPath("~/bin/Input.txt");
            if (File.Exists(inputPath))
            {
                return new OperationResult(true);
            }
            return new OperationResult(false);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("api/settings/connection-string")]
        public OperationResult ConnectionString(SettingsModel settingsModel)
        {
            if (!ModelState.IsValid) return new OperationResult(false, "Required fields are not filled");

            var inputPath = System.Web.Hosting.HostingEnvironment.MapPath("~/bin/Input.txt");
            AdminTools adminTools;
            var sdkConnectionString = "Data Source="
                                         + settingsModel.ConnectionStringSdk.Source + ";Initial Catalog="
                                         + settingsModel.ConnectionStringSdk.Catalogue + ";"
                                         + settingsModel.ConnectionStringSdk.Auth;

            var mainConnectionString = "Data Source="
                                          + settingsModel.ConnectionStringMain.Source + ";Initial Catalog="
                                          + settingsModel.ConnectionStringMain.Catalogue + ";"
                                          + settingsModel.ConnectionStringMain.Auth;

            try
            {
                if (File.Exists(inputPath))
                {
                    //File.Delete(inputPath);
                    //var fileStream = File.Create(inputPath);
                    //fileStream.Dispose();
                    return new OperationResult(false, "Connection string already exist");
                }

                var fileStream = File.Create(inputPath);
                fileStream.Dispose();

                File.WriteAllText(inputPath, sdkConnectionString);
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message);
                return new OperationResult(false, "Could not write connection string in /bin/Input.txt");
            }
            try
            {
                adminTools = new AdminTools(sdkConnectionString);
                string error = adminTools.DbSetup(settingsModel.ConnectionStringSdk.Token);
            }
            catch (Exception exception)
            {
                try
                {
                    new AdminTools(sdkConnectionString).DbSetup(settingsModel.ConnectionStringSdk.Token);
                }
                catch (Exception exa)
                {

                }
                Logger.Error(exception.Message);
                return new OperationResult(false, "SDK connection string is invalid");
            }

            var configuration = WebConfigurationManager.OpenWebConfiguration("~");
            var section = (ConnectionStringsSection) configuration.GetSection("connectionStrings");
            try
            {
                section.ConnectionStrings["eFormMainConnection"].ConnectionString = mainConnectionString;
            } catch
            {
                section.ConnectionStrings.Add(new ConnectionStringSettings("eFormMainConnection", mainConnectionString, "System.Data.SqlClient"));
            }                  
            try
            {
                configuration.Save();
                ConfigurationManager.RefreshSection("connectionStrings");
                var migrationConfiguration = new EformMigrationsConfiguration(mainConnectionString)
                {
                    TargetDatabase = new DbConnectionInfo(mainConnectionString, "System.Data.SqlClient")
                };
                var migrator = new DbMigrator(migrationConfiguration);
                migrator.Update();
                var settingsHelper = new SettingsHelper(mainConnectionString);
                settingsHelper.CreateAdminUser(settingsModel.AdminSetupModel);
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message);
                return new OperationResult(false, "Main connection string is invalid");
            }

            adminTools.DbSetup(settingsModel.ConnectionStringSdk.Token);
            return new OperationResult(true);
        }
        
        [Authorize(Roles = EformRoles.Admin)]
        [HttpGet]
        [Route("api/settings/admin")]
        public OperationDataResult<AdminSettingsModel> GetAdminSettings()
        {
            try
            {
                var configuration = WebConfigurationManager.OpenWebConfiguration("~");
                var section = (AppSettingsSection) configuration.GetSection("appSettings");
                var model = new AdminSettingsModel()
                {
                    Host = section.Settings["email:smtpHost"].Value,
                    Port = section.Settings["email:smtpPort"].Value,
                    Login = section.Settings["email:login"].Value,
                    Password = section.Settings["email:password"].Value,
                    SiteLink = section.Settings["app:siteLink"].Value
                };
                return new OperationDataResult<AdminSettingsModel>(true, model);
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                return new OperationDataResult<AdminSettingsModel>(false, "Can't obtain settings from web.config");
            }
        }

        [Authorize(Roles = EformRoles.Admin)]
        [HttpPost]
        [Route("api/settings/admin")]
        public OperationResult UpdateAdminSettings(AdminSettingsModel adminSettingsModel)
        {
            try
            {
                var configuration = WebConfigurationManager.OpenWebConfiguration("~");
                var section = (AppSettingsSection) configuration.GetSection("appSettings");
                section.Settings["email:smtpHost"].Value = adminSettingsModel.Host;
                section.Settings["email:smtpPort"].Value = adminSettingsModel.Port;
                section.Settings["email:login"].Value = adminSettingsModel.Login;
                section.Settings["email:password"].Value = adminSettingsModel.Password;
                section.Settings["app:siteLink"].Value = adminSettingsModel.SiteLink;
                configuration.Save();
                ConfigurationManager.RefreshSection("appSettings");
                return new OperationResult(true, "Settings have been updated successfully");
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                return new OperationResult(false, "Can't update settings in web.config");
            }
        }
    }
}