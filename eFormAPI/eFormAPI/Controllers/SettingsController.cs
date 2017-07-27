using System;
using System.Configuration;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.IO;
using System.Linq;
using System.Web.Configuration;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Data;
using eFormAPI.Web.Migrations;
using eFormCore;
using eFromAPI.Common.API;
using eFromAPI.Common.Models.Settings;
using NLog;

namespace eFormAPI.Web.Controllers
{
    [AllowAnonymous]
    public class SettingsController : ApiController
    {
        private readonly Logger Logger = LogManager.GetCurrentClassLogger();

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
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message);
                return new OperationResult(false, "SDK connection string is invalid");
            }

            var configuration = WebConfigurationManager.OpenWebConfiguration("~");
            var section = (ConnectionStringsSection) configuration.GetSection("connectionStrings");
            section.ConnectionStrings["eFormMainConnection"].ConnectionString = mainConnectionString;
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
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message);
                return new OperationResult(false, "Main connection string is invalid");
            }

            adminTools.DbSetup(settingsModel.ConnectionStringSdk.Token);
            return new OperationResult(true);
        }
    }
}