using System;
using System.Configuration;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.IO;
using System.Reflection;
using System.Web.Configuration;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormAPI.Web.Infrastructure.Models.API;
using eFormAPI.Web.Infrastructure.Models.Settings.Admin;
using eFormAPI.Web.Infrastructure.Models.Settings.Initial;
using eFormAPI.Web.Migrations;
using eFormCore;
using EformBase.Pn.Consts;
using EformBase.Pn.Infrastructure;
using NLog;

namespace eFormAPI.Web.Controllers
{
    public class SettingsController : ApiController
    {
        private readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

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
        [HttpGet]
        [Route("api/settings/default-locale")]
        public OperationDataResult<string> GetDefaultLocale()
        {
            var configuration = WebConfigurationManager.OpenWebConfiguration("~");
            var section = (AppSettingsSection)configuration.GetSection("appSettings");
            var locale = section.Settings["general:defaultLocale"].Value;
            if (locale == null)
            {
                return new OperationDataResult<string>(true, "en-US");
            }
            return new OperationDataResult<string>(true, model: locale);
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("api/settings/connection-string")]
        public OperationResult UpdateConnectionString(InitialSettingsModel initialSettingsModel)
        {
            if (!ModelState.IsValid) return new OperationResult(false, LocaleHelper.GetString("RequestFieldsAreNotFilled"));
            var sdkConnectionString = "Data Source="
                                      + initialSettingsModel.ConnectionStringSdk.Source + ";Initial Catalog="
                                      + initialSettingsModel.ConnectionStringSdk.Catalogue + ";"
                                      + initialSettingsModel.ConnectionStringSdk.Auth;

            var mainConnectionString = "Data Source="
                                       + initialSettingsModel.ConnectionStringMain.Source + ";Initial Catalog="
                                       + initialSettingsModel.ConnectionStringMain.Catalogue + ";"
                                       + initialSettingsModel.ConnectionStringMain.Auth;
            // Save SDK connection string
            var inputPath = System.Web.Hosting.HostingEnvironment.MapPath("~/bin/Input.txt");
            if (inputPath == null)
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileCreatingFileForSDK"));
            }
            AdminTools adminTools;
            try
            {
                if (File.Exists(inputPath))
                {
                    return new OperationResult(false, LocaleHelper.GetString("ConnectionStringAlreadyExist"));
                }

                var fileStream = File.Create(inputPath);
                fileStream.Dispose();

                File.WriteAllText(inputPath, sdkConnectionString);
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message);
                return new OperationResult(false, LocaleHelper.GetString("CouldNotWriteConnectionString"));
            }
            try
            {
                adminTools = new AdminTools(sdkConnectionString);
            }
            catch (Exception exception)
            {
                Logger.Error(exception.Message);
                return new OperationResult(false, LocaleHelper.GetString("SDKConnectionStringIsInvalid"));
            }
            // Save Main connection string
            var configuration = WebConfigurationManager.OpenWebConfiguration("~");
            var connStringsSection = (ConnectionStringsSection) configuration.GetSection("connectionStrings");
            connStringsSection.ConnectionStrings["eFormMainConnection"].ConnectionString = mainConnectionString;
            // Save general app settings
            var section = (AppSettingsSection) configuration.GetSection("appSettings");
            section.Settings["general:defaultLocale"].Value =
                initialSettingsModel.GeneralAppSetupSettingsModel.DefaultLocale;
            // Save settings and migrate DB
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
                return new OperationResult(false, LocaleHelper.GetString("MainConnectionStringIsInvalid"));
            }
            // Setup SDK DB
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
                return new OperationDataResult<LoginPageSettingsModel>(false, LocaleHelper.GetString("CantObtainSettingsFromWebConfig"));
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
                var core = _coreHelper.GetCore();
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
                    SiteLink = core.GetHttpServerAddress(),
                    AssemblyVersion = Assembly.GetExecutingAssembly().GetName().Version.ToString()
                };
                return new OperationDataResult<AdminSettingsModel>(true, model);
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                return new OperationDataResult<AdminSettingsModel>(false, LocaleHelper.GetString("CantObtainSettingsFromWebConfig"));
            }
        }


        [Authorize(Roles = EformRoles.Admin)]
        [HttpPost]
        [Route("api/settings/admin")]
        public OperationResult UpdateAdminSettings(AdminSettingsModel adminSettingsModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var configuration = WebConfigurationManager.OpenWebConfiguration("~");
                var section = (AppSettingsSection) configuration.GetSection("appSettings");

                section.Settings["email:smtpHost"].Value = adminSettingsModel.SMTPSettingsModel.Host;
                section.Settings["email:smtpPort"].Value = adminSettingsModel.SMTPSettingsModel.Port;
                section.Settings["email:login"].Value = adminSettingsModel.SMTPSettingsModel.Login;
                section.Settings["email:password"].Value = adminSettingsModel.SMTPSettingsModel.Password;

                section.Settings["header:imageLink"].Value = adminSettingsModel.HeaderSettingsModel.ImageLink;
                section.Settings["header:imageLinkVisible"].Value =
                    adminSettingsModel.HeaderSettingsModel.ImageLinkVisible.ToString();
                section.Settings["header:mainText"].Value = adminSettingsModel.HeaderSettingsModel.MainText;
                section.Settings["header:mainTextVisible"].Value =
                    adminSettingsModel.HeaderSettingsModel.MainTextVisible.ToString();
                section.Settings["header:secondaryText"].Value = adminSettingsModel.HeaderSettingsModel.SecondaryText;
                section.Settings["header:secondaryTextVisible"].Value =
                    adminSettingsModel.HeaderSettingsModel.SecondaryTextVisible.ToString();

                section.Settings["loginPage:imageLink"].Value = adminSettingsModel.LoginPageSettingsModel.ImageLink;
                section.Settings["loginPage:imageLinkVisible"].Value =
                    adminSettingsModel.LoginPageSettingsModel.ImageLinkVisible.ToString();
                section.Settings["loginPage:mainText"].Value = adminSettingsModel.LoginPageSettingsModel.MainText;
                section.Settings["loginPage:mainTextVisible"].Value =
                    adminSettingsModel.LoginPageSettingsModel.MainTextVisible.ToString();
                section.Settings["loginPage:secondaryText"].Value =
                    adminSettingsModel.LoginPageSettingsModel.SecondaryText;
                section.Settings["loginPage:secondaryTextVisible"].Value = adminSettingsModel.LoginPageSettingsModel
                    .SecondaryTextVisible.ToString();


                configuration.Save();
                ConfigurationManager.RefreshSection("appSettings");

                core.SetHttpServerAddress(adminSettingsModel.SiteLink);
                return new OperationResult(true, LocaleHelper.GetString("SettingsUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Logger.Error(e.Message);
                return new OperationResult(false, LocaleHelper.GetString("CantUpdateSettingsInWebConfig"));
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
                var section = (AppSettingsSection)configuration.GetSection("appSettings");

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