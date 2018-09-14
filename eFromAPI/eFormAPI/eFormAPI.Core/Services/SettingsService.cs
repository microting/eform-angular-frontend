using System;
using System.Configuration;
using System.Reflection;
using eFormAPI.Common.Infrastructure;
using eFormAPI.Common.Infrastructure.Helpers;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Settings.Admin;
using eFormAPI.Common.Models.Settings.Initial;
using eFormAPI.Core.Helpers;
using eFormAPI.Core.Helpers.WritableOptions;
using eFormAPI.Core.Services.Identity;
using eFormCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace eFormAPI.Core.Services
{
    public class SettingsService
    {
        private readonly ILogger<SettingsService> _logger;
        private readonly IWritableOptions<ConnectionStrings> _connectionStrings;
        private readonly IWritableOptions<ApplicationSettings> _applicationSettings;
        private readonly IWritableOptions<LoginPageSettings> _loginPageSettings;
        private readonly IWritableOptions<HeaderSettings> _headerSettings;
        private readonly IWritableOptions<EmailSettings> _emailSettings;

        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        public SettingsService(ILogger<SettingsService> logger,
            IWritableOptions<ConnectionStrings> connectionStrings,
            IWritableOptions<ApplicationSettings> applicationSettings,
            IWritableOptions<LoginPageSettings> loginPageSettings,
            IWritableOptions<HeaderSettings> headerSettings,
            IWritableOptions<EmailSettings> emailSettings)
        {
            _logger = logger;
            _connectionStrings = connectionStrings;
            _applicationSettings = applicationSettings;
            _loginPageSettings = loginPageSettings;
            _headerSettings = headerSettings;
            _emailSettings = emailSettings;
        }

        public OperationResult ConnectionStringExist()
        {
            var connectionString = _connectionStrings.Value.SdkConnection;
            if (!string.IsNullOrEmpty(connectionString))
            {
                return new OperationResult(true);
            }

            return new OperationResult(false, "Connection string does not exist");
        }

        public OperationDataResult<string> GetDefaultLocale()
        {
            try
            {
                var locale = _applicationSettings.Value.DefaultLocale;
                if (string.IsNullOrEmpty(locale))
                {
                    return new OperationDataResult<string>(true, "en-US");
                }

                return new OperationDataResult<string>(true, model: locale);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                // We do this if any of the above fail for some reason, then we set it to default en-US
                return new OperationDataResult<string>(true, "en-US");
            }
        }

        public OperationResult UpdateConnectionString(InitialSettingsModel initialSettingsModel)
        {
            var sdkConnectionString = initialSettingsModel.ConnectionStringSdk.Source + ";Initial Catalog="
                                                                                      + initialSettingsModel
                                                                                          .ConnectionStringSdk
                                                                                          .Catalogue + ";"
                                                                                      + initialSettingsModel
                                                                                          .ConnectionStringSdk.Auth;

            var mainConnectionString = initialSettingsModel.ConnectionStringMain.Source + ";Initial Catalog="
                                                                                        + initialSettingsModel
                                                                                            .ConnectionStringMain
                                                                                            .Catalogue + ";"
                                                                                        + initialSettingsModel
                                                                                            .ConnectionStringMain.Auth;

            AdminTools adminTools;
            try
            {
                if (!string.IsNullOrEmpty(_connectionStrings.Value.SdkConnection))
                {
                    return new OperationResult(false, LocaleHelper.GetString("ConnectionStringAlreadyExist"));
                }

                _connectionStrings.Update((options) =>
                {
                    options.SdkConnection = sdkConnectionString;
                    options.DefaultConnection = mainConnectionString;
                });
                _applicationSettings.Update((options) =>
                {
                    options.DefaultLocale = initialSettingsModel.GeneralAppSetupSettingsModel.DefaultLocale;
                });
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return new OperationResult(false, LocaleHelper.GetString("CouldNotWriteConnectionString"));
            }

            try
            {
                adminTools = new AdminTools(sdkConnectionString);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return new OperationResult(false, LocaleHelper.GetString("SDKConnectionStringIsInvalid"));
            }

            // Migrate DB
            try
            {
                var dd = new DbContextOptionsBuilder();
                dd.UseSqlServer(mainConnectionString);
                var ss = new DbContext(dd.Options);
                ss.Database.Migrate();

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
                _logger.LogError(exception.Message);
                return new OperationResult(false, LocaleHelper.GetString("MainConnectionStringIsInvalid"));
            }

            // Setup SDK DB
            adminTools.DbSetup(initialSettingsModel.ConnectionStringSdk.Token);
            return new OperationResult(true);
        }

        public OperationDataResult<LoginPageSettingsModel> GetLoginPageSettings()
        {
            try
            {
                var model = new LoginPageSettingsModel()
                {
                    ImageLink = _loginPageSettings.Value.ImageLink,
                    ImageLinkVisible = _loginPageSettings.Value.ImageLinkVisible,
                    MainText = _loginPageSettings.Value.MainText,
                    MainTextVisible = _loginPageSettings.Value.MainTextVisible,
                    SecondaryText = _loginPageSettings.Value.SecondaryText,
                    SecondaryTextVisible = _loginPageSettings.Value.SecondaryTextVisible,
                };
                return new OperationDataResult<LoginPageSettingsModel>(true, model);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<LoginPageSettingsModel>(false,
                    LocaleHelper.GetString("CantObtainSettingsFromWebConfig"));
            }
        }

        public OperationDataResult<HeaderSettingsModel> GetPageHeaderSettings()
        {
            try
            {
                var model = new HeaderSettingsModel()
                {
                    ImageLink = _headerSettings.Value.ImageLink,
                    ImageLinkVisible = _headerSettings.Value.ImageLinkVisible,
                    MainText = _headerSettings.Value.MainText,
                    MainTextVisible = _headerSettings.Value.MainTextVisible,
                    SecondaryText = _headerSettings.Value.SecondaryText,
                    SecondaryTextVisible = _headerSettings.Value.SecondaryTextVisible,
                };
                return new OperationDataResult<HeaderSettingsModel>(true, model);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<HeaderSettingsModel>(false, "Can't obtain settings from web.config");
            }
        }

        public OperationDataResult<AdminSettingsModel> GetAdminSettings()
        {
            try
            {
                var core = _coreHelper.GetCore();

                var model = new AdminSettingsModel()
                {
                    SMTPSettingsModel = new SMTPSettingsModel()
                    {
                        Host = _emailSettings.Value.SmtpHost,
                        Port = _emailSettings.Value.SmtpPort.ToString(),
                        Login = _emailSettings.Value.Login,
                        Password = _emailSettings.Value.Password,
                    },
                    HeaderSettingsModel = new HeaderSettingsModel()
                    {
                        ImageLink = _headerSettings.Value.ImageLink,
                        ImageLinkVisible = _headerSettings.Value.ImageLinkVisible,
                        MainText = _headerSettings.Value.MainText,
                        MainTextVisible = _headerSettings.Value.MainTextVisible,
                        SecondaryText = _headerSettings.Value.SecondaryText,
                        SecondaryTextVisible = _headerSettings.Value.SecondaryTextVisible,
                    },
                    LoginPageSettingsModel = new LoginPageSettingsModel()
                    {
                        ImageLink = _loginPageSettings.Value.ImageLink,
                        ImageLinkVisible = _loginPageSettings.Value.ImageLinkVisible,
                        MainText = _loginPageSettings.Value.MainText,
                        MainTextVisible = _loginPageSettings.Value.MainTextVisible,
                        SecondaryText = _loginPageSettings.Value.SecondaryText,
                        SecondaryTextVisible = _loginPageSettings.Value.SecondaryTextVisible,
                    },
                    SiteLink = core.GetHttpServerAddress(),
                    AssemblyVersion = Assembly.GetExecutingAssembly().GetName().Version.ToString()
                };
                return new OperationDataResult<AdminSettingsModel>(true, model);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<AdminSettingsModel>(false,
                    LocaleHelper.GetString("CantObtainSettingsFromWebConfig"));
            }
        }

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

}