using System;
using System.Configuration;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.Data.SqlClient;
using System.IO;
using System.Web.Configuration;
using System.Web.Http;
using eFormAPI.Web.Migrations;
using eFormCore;
using eFromAPI.Common.API;
using eFromAPI.Common.Models.Settings;
using Configuration = eFormAPI.Web.Migrations.Configuration;

namespace eFormAPI.Web.Controllers
{
    [AllowAnonymous]
    public class SettingsController : ApiController
    {
        [HttpPost]
        public OperationResult ConnectionString(SettingsModel settingsModel)
        {
            
            if (!ModelState.IsValid) return new OperationResult(false, "Required fields are not filled");
            
            string inputPath = System.Web.Hosting.HostingEnvironment.MapPath("~/bin/Input.txt");
            AdminTools adminTools;
            string sdkConnectionString = "Data Source="
                            + settingsModel.ConnectionStringSdk.Source + ";Initial Catalog="
                            + settingsModel.ConnectionStringSdk.Catalogue + ";"
                            + settingsModel.ConnectionStringSdk.Auth;

            string mainConnectionString = "Data Source="
                            + settingsModel.ConnectionStringMain.Source + ";Initial Catalog="
                            + settingsModel.ConnectionStringMain.Catalogue + ";"
                            + settingsModel.ConnectionStringMain.Auth;

            try
            {
                if (!File.Exists(inputPath))
                    File.Create(inputPath);

                using (StreamWriter newTask = new StreamWriter(inputPath, false))
                {
                    newTask.WriteLine(sdkConnectionString);
                }          
            }
            catch (Exception)
            {
                return new OperationResult(false, "Could not write connection string in /bin/Input.txt");
            }


            try
            {
                adminTools = new AdminTools(sdkConnectionString);
            }
            catch
            {
                return new OperationResult(false, "SDK connection string is invalid");
            }

            var configuration = WebConfigurationManager.OpenWebConfiguration("~");
            var section = (ConnectionStringsSection)configuration.GetSection("connectionStrings");
            section.ConnectionStrings["eFormMainConnection"].ConnectionString = mainConnectionString;

            try
            {
                configuration.Save();

                var configure = new Configuration() {TargetDatabase = new DbConnectionInfo("eFormMainConnection")
                };
                
                var migrator = new DbMigrator(configure);
                migrator.Update();
            }
            catch(Exception e)
            {
                return new OperationResult(false, "Main connection string is invalid");
            }

            

            adminTools.DbSetup(settingsModel.ConnectionStringSdk.Token);

            return new OperationResult(true);
        }
    }
}