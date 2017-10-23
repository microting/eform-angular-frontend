using System;
using System.Configuration;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.IO;
using System.Web.Configuration;
using System.Web.Http;
using eFormAPI.Common.API;
using eFormAPI.Common.Models.Settings.Admin;
using eFormAPI.Common.Models.Settings.Initial;
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
        public OperationResult UpdateConnectionString(InitialSettingsModel initialSettingsModel)
        {
            if (!ModelState.IsValid) return new OperationResult(false, "Required fields are not filled");

            var inputPath = System.Web.Hosting.HostingEnvironment.MapPath("~/bin/Input.txt");
            AdminTools adminTools;
            var sdkConnectionString = "Data Source="
                                      + initialSettingsModel.ConnectionStringSdk.Source + ";Initial Catalog="
                                      + initialSettingsModel.ConnectionStringSdk.Catalogue + ";"
                                      + initialSettingsModel.ConnectionStringSdk.Auth;

            var mainConnectionString = "Data Source="
                                       + initialSettingsModel.ConnectionStringMain.Source + ";Initial Catalog="
                                       + initialSettingsModel.ConnectionStringMain.Catalogue + ";"
                                       + initialSettingsModel.ConnectionStringMain.Auth;

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
                string error = adminTools.DbSetup(initialSettingsModel.ConnectionStringSdk.Token);
            }
            catch (Exception exception)
            {
                try
                {
                    new AdminTools(sdkConnectionString).DbSetup(initialSettingsModel.ConnectionStringSdk.Token);
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
                settingsHelper.CreateAdminUser(initialSettingsModel.AdminSetupModel);
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message);
                return new OperationResult(false, "Main connection string is invalid");
            }

            adminTools.DbSetup(initialSettingsModel.ConnectionStringSdk.Token);
            return new OperationResult(true);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/settings/login-page")]
        public OperationDataResult<LoginPageSettingsModel> GetLoginPageSettings()
        {
            try
            {
                var configuration = WebConfigurationManager.OpenWebConfiguration("~");
                var section = (AppSettingsSection) configuration.GetSection("appSettings");
                var model = new LoginPageSettingsModel()
                {
                    ImageLink = section.Settings["loginPage:imageLink"]?.Value,
                    ImageLinkVisible = section.Settings["loginPage:imageLinkVisible"].Value.Equals("True"),
                    MainText = section.Settings["loginPage:mainText"]?.Value,
                    MainTextVisible = section.Settings["loginPage:mainTextVisible"].Value.Equals("True"),
                    SecondaryText = section.Settings["loginPage:secondaryText"]?.Value,
                    SecondaryTextVisible = section.Settings["loginPage:secondaryTextVisible"].Value.Equals("True")
                };
                return new OperationDataResult<LoginPageSettingsModel>(true, model);
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                return new OperationDataResult<LoginPageSettingsModel>(false, "Can't obtain settings from web.config");
            }
        }


        [HttpGet]
        [Authorize]
        [Route("api/settings/page-header")]
        public OperationDataResult<HeaderSettingsModel> GetPageHeaderSettings()
        {
            try
            {
                var configuration = WebConfigurationManager.OpenWebConfiguration("~");
                var section = (AppSettingsSection) configuration.GetSection("appSettings");
                var model = new HeaderSettingsModel()
                {
                    ImageLink = section.Settings["header:imageLink"]?.Value,
                    ImageLinkVisible = section.Settings["header:imageLinkVisible"].Value.Equals("True"),
                    MainText = section.Settings["header:mainText"]?.Value,
                    MainTextVisible = section.Settings["header:mainTextVisible"].Value.Equals("True"),
                    SecondaryText = section.Settings["header:secondaryText"]?.Value,
                    SecondaryTextVisible = section.Settings["header:secondaryTextVisible"].Value.Equals("True")
                };
                return new OperationDataResult<HeaderSettingsModel>(true, model);
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                return new OperationDataResult<HeaderSettingsModel>(false, "Can't obtain settings from web.config");
            }
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
                    SMTPSettingsModel = new SMTPSettingsModel()
                    {
                        Host = section.Settings["email:smtpHost"]?.Value,
                        Port = section.Settings["email:smtpPort"].Value,
                        Login = section.Settings["email:login"].Value,
                        Password = section.Settings["email:password"].Value,
                    },
                    HeaderSettingsModel = new HeaderSettingsModel()
                    {
                        ImageLink = section.Settings["header:imageLink"]?.Value,
                        ImageLinkVisible = section.Settings["header:imageLinkVisible"].Value.Equals("True"),
                        MainText = section.Settings["header:mainText"]?.Value,
                        MainTextVisible = section.Settings["header:mainTextVisible"].Value.Equals("True"),
                        SecondaryText = section.Settings["header:secondaryText"]?.Value,
                        SecondaryTextVisible = section.Settings["header:secondaryTextVisible"].Value.Equals("True")
                    },
                    LoginPageSettingsModel = new LoginPageSettingsModel()
                    {
                        ImageLink = section.Settings["loginPage:imageLink"]?.Value,
                        ImageLinkVisible = section.Settings["loginPage:imageLinkVisible"].Value.Equals("True"),
                        MainText = section.Settings["loginPage:mainText"]?.Value,
                        MainTextVisible = section.Settings["loginPage:mainTextVisible"].Value.Equals("True"),
                        SecondaryText = section.Settings["loginPage:secondaryText"]?.Value,
                        SecondaryTextVisible = section.Settings["loginPage:secondaryTextVisible"].Value.Equals("True")
                    },
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
                section.Settings["email:smtpHost"].Value = adminSettingsModel.SMTPSettingsModel.Host;
                section.Settings["email:smtpPort"].Value = adminSettingsModel.SMTPSettingsModel.Port;
                section.Settings["email:login"].Value = adminSettingsModel.SMTPSettingsModel.Login;
                section.Settings["email:password"].Value = adminSettingsModel.SMTPSettingsModel.Password;
                section.Settings["app:siteLink"].Value = adminSettingsModel.SiteLink;
                

                section.Settings["header:imageLink"].Value = adminSettingsModel.HeaderSettingsModel.ImageLink;
                section.Settings["header:imageLinkVisible"].Value = adminSettingsModel.HeaderSettingsModel.ImageLinkVisible.ToString();
                section.Settings["header:mainText"].Value = adminSettingsModel.HeaderSettingsModel.MainText;
                section.Settings["header:mainTextVisible"].Value =
                    adminSettingsModel.HeaderSettingsModel.MainTextVisible.ToString();
                section.Settings["header:secondaryText"].Value = adminSettingsModel.HeaderSettingsModel.SecondaryText;
                section.Settings["header:secondaryTextVisible"].Value =
                    adminSettingsModel.HeaderSettingsModel.SecondaryTextVisible.ToString();

                section.Settings["loginPage:imageLink"].Value = adminSettingsModel.LoginPageSettingsModel.ImageLink;
                section.Settings["loginPage:imageLinkVisible"].Value = adminSettingsModel.LoginPageSettingsModel.ImageLinkVisible.ToString();
                section.Settings["loginPage:mainText"].Value = adminSettingsModel.LoginPageSettingsModel.MainText;
                section.Settings["loginPage:mainTextVisible"].Value =
                    adminSettingsModel.LoginPageSettingsModel.MainTextVisible.ToString();
                section.Settings["loginPage:secondaryText"].Value =
                    adminSettingsModel.LoginPageSettingsModel.SecondaryText;
                section.Settings["loginPage:secondaryTextVisible"].Value = adminSettingsModel.LoginPageSettingsModel.SecondaryTextVisible.ToString();


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

        #region ResetSettingsSection

        [HttpGet]
        [Authorize(Roles = EformRoles.Admin)]
        [Route("api/settings/reset-login-page")]
        public OperationResult ResetLoginPageSettings()
        {
            try
            {
                var configuration = WebConfigurationManager.OpenWebConfiguration("~");
                var section = (AppSettingsSection) configuration.GetSection("appSettings");
                
                section.Settings["loginPage:imageLink"].Value = "";
                section.Settings["loginPage:imageLinkVisible"].Value = "True";
                section.Settings["loginPage:mainText"].Value = "Microting eForm";
                section.Settings["loginPage:mainTextVisible"].Value = "True";
                section.Settings["loginPage:secondaryText"].Value = "No more paper-forms and back-office data entry";
                section.Settings["loginPage:secondaryTextVisible"].Value = "True";
                
                configuration.Save();
                ConfigurationManager.RefreshSection("appSettings");
                return new OperationResult(true, "Login page settings have been reseted successfully");
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                return new OperationResult(false, "Can't update settings in web.config");
            }
        }

        [HttpGet]
        [Authorize(Roles = EformRoles.Admin)]
        [Route("api/settings/reset-page-header")]
        public OperationResult ResetPageHeaderSettings()
        {
            try
            {
                var configuration = WebConfigurationManager.OpenWebConfiguration("~");
                var section = (AppSettingsSection) configuration.GetSection("appSettings");
                
                section.Settings["header:imageLink"].Value = "";
                section.Settings["header:imageLinkVisible"].Value = "True";
                section.Settings["header:mainText"].Value = "Microting eForm";
                section.Settings["header:mainTextVisible"].Value = "True";
                section.Settings["header:secondaryText"].Value = "No more paper-forms and back-office data entry";
                section.Settings["header:secondaryTextVisible"].Value = "True";
                
                configuration.Save();
                ConfigurationManager.RefreshSection("appSettings");
                return new OperationResult(true, "Header settings have been reseted successfully");
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                return new OperationResult(false, "Can't update settings in web.config");
            }
        }

        #endregion
    }
}