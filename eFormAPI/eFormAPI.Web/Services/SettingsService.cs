using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Hosting.Settings;
using eFormAPI.Web.Infrastructure.Database;
using eFormCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Enums;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.WritableOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Models.Settings.Admin;
using Microting.eFormApi.BasePn.Infrastructure.Models.Settings.Initial;

namespace eFormAPI.Web.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly ILogger<SettingsService> _logger;
        private readonly ILocalizationService _localizationService;
        private readonly IWritableOptions<ConnectionStrings> _connectionStrings;
        private readonly IWritableOptions<ApplicationSettings> _applicationSettings;
        private readonly IWritableOptions<LoginPageSettings> _loginPageSettings;
        private readonly IWritableOptions<HeaderSettings> _headerSettings;
        private readonly IWritableOptions<EmailSettings> _emailSettings;
        private readonly IOptions<ConnectionStringsSdk> _connectionStringsSdk;
        private readonly IEFormCoreService _coreHelper;
        private readonly IOptionsMonitor<ApplicationSettings> _optionsAccessor;

        public SettingsService(ILogger<SettingsService> logger,
            IWritableOptions<ConnectionStrings> connectionStrings,
            IWritableOptions<ApplicationSettings> applicationSettings,
            IWritableOptions<LoginPageSettings> loginPageSettings,
            IWritableOptions<HeaderSettings> headerSettings,
            IWritableOptions<EmailSettings> emailSettings,
            IEFormCoreService coreHelper,
            ILocalizationService localizationService,
            IOptionsMonitor<ApplicationSettings> optionsAccessor,
            IOptions<ConnectionStringsSdk> connectionStringsSdk)
        {
            _logger = logger;
            _connectionStrings = connectionStrings;
            _applicationSettings = applicationSettings;
            _loginPageSettings = loginPageSettings;
            _headerSettings = headerSettings;
            _emailSettings = emailSettings;
            _coreHelper = coreHelper;
            _localizationService = localizationService;
            _optionsAccessor = optionsAccessor;
            _connectionStringsSdk = connectionStringsSdk;
        }

        public OperationResult ConnectionStringExist()
        {
            Program.ReloadDbConfigurationDelegate.Invoke();


            var connectionString = _connectionStringsSdk.Value.SdkConnection;
            if (!string.IsNullOrEmpty(connectionString))
            {
                return new OperationResult(true);
            }

            return new OperationResult(false,
                _localizationService.GetString("ConnectionStringDoesNotExist"));
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

        public async Task<OperationResult> UpdateConnectionString(InitialSettingsModel initialSettingsModel)
        {
            string sdkConnectionString, mainConnectionString;
            var customerNo = initialSettingsModel.GeneralAppSetupSettingsModel.CustomerNo.ToString();
            var dbNamePrefix = "";

            if (initialSettingsModel.ConnectionStringSdk.PrefixAllDatabases)
            {
                dbNamePrefix = "Microting_";
            }

            var sdkDbName = dbNamePrefix + customerNo + "_SDK";
            var angularDbName = dbNamePrefix + customerNo + "_Angular";

            if (initialSettingsModel.ConnectionStringSdk.SqlServerType == "mssql")
            {
                sdkConnectionString = initialSettingsModel.ConnectionStringSdk.Host +
                                      ";Database=" +
                                      sdkDbName + ";" +
                                      initialSettingsModel
                                          .ConnectionStringSdk.Auth;

                mainConnectionString = initialSettingsModel.ConnectionStringSdk.Host +
                                       ";Database=" +
                                       angularDbName + ";" +
                                       initialSettingsModel
                                           .ConnectionStringSdk.Auth;
            }
            else
            {
                sdkConnectionString = "host= " +
                                      initialSettingsModel.ConnectionStringSdk.Host +
                                      ";Database=" +
                                      sdkDbName + ";" +
                                      initialSettingsModel
                                          .ConnectionStringSdk.Auth +
                                      "port=" + initialSettingsModel.ConnectionStringSdk.Port +
                                      ";Convert Zero Datetime = true;SslMode=none;";

                mainConnectionString = "host= " +
                                       initialSettingsModel.ConnectionStringSdk.Host +
                                       ";Database=" +
                                       angularDbName + ";" +
                                       initialSettingsModel
                                           .ConnectionStringSdk.Auth +
                                       "port=" + initialSettingsModel.ConnectionStringSdk.Port +
                                       ";Convert Zero Datetime = true;SslMode=none;";
            }


            if (!string.IsNullOrEmpty(_connectionStringsSdk.Value.SdkConnection))
            {
                return new OperationResult(false,
                    _localizationService.GetString("ConnectionStringAlreadyExist"));
            }

            try
            {
                var adminTools = new AdminTools(sdkConnectionString);
                // Setup SDK DB
                adminTools.DbSetup(initialSettingsModel.ConnectionStringSdk.Token);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                if (exception.InnerException != null)
                {
                    return new OperationResult(false, exception.Message + " - " + exception.InnerException.Message);
                }

                return new OperationResult(false, exception.Message);

                //return new OperationResult(false, 
                //    _localizationService.GetString("SDKConnectionStringIsInvalid"));
            }

            // Migrate DB
            var dbContextOptionsBuilder = new DbContextOptionsBuilder<BaseDbContext>();
            try
            {
                
                if (mainConnectionString.ToLower().Contains("convert zero datetime"))
                {
                    dbContextOptionsBuilder.UseMySql(mainConnectionString, b =>
                        b.MigrationsAssembly("eFormAPI.Web"));
                }
                else
                {
                    dbContextOptionsBuilder.UseSqlServer(mainConnectionString, b =>
                        b.MigrationsAssembly("eFormAPI.Web"));
                }

                using (var dbContext = new BaseDbContext(dbContextOptionsBuilder.Options))
                {
                    dbContext.Database.Migrate();
                    var userStore = new UserStore<EformUser,
                        EformRole,
                        BaseDbContext,
                        int,
                        IdentityUserClaim<int>,
                        EformUserRole,
                        IdentityUserLogin<int>,
                        IdentityUserToken<int>,
                        IdentityRoleClaim<int>>(dbContext);


                    IPasswordHasher<EformUser> hasher = new PasswordHasher<EformUser>();
                    var validator = new UserValidator<EformUser>();
                    var validators = new List<UserValidator<EformUser>> {validator};
                    var userManager = new UserManager<EformUser>(userStore, null, hasher, validators, null, null, null,
                        null, null);

                    // Set-up token providers.
                    IUserTwoFactorTokenProvider<EformUser> tokenProvider = new EmailTokenProvider<EformUser>();
                    userManager.RegisterTokenProvider("Default", tokenProvider);
                    IUserTwoFactorTokenProvider<EformUser> phoneTokenProvider =
                        new PhoneNumberTokenProvider<EformUser>();
                    userManager.RegisterTokenProvider("PhoneTokenProvider", phoneTokenProvider);
                    // Roles
                    var roleStore = new RoleStore<EformRole, BaseDbContext, int>(dbContext);
                    var roleManager = new RoleManager<EformRole>(roleStore, null, null, null, null);
                    if (!await roleManager.RoleExistsAsync(EformRole.Admin))
                    {
                        await roleManager.CreateAsync(new EformRole() {Name = EformRole.Admin});
                    }

                    if (!await roleManager.RoleExistsAsync(EformRole.User))
                    {
                        await roleManager.CreateAsync(new EformRole() {Name = EformRole.User});
                    }

                    // Seed admin and demo users
                    var adminUser = new EformUser()
                    {
                        UserName = initialSettingsModel.AdminSetupModel.Email,
                        Email = initialSettingsModel.AdminSetupModel.Email,
                        FirstName = initialSettingsModel.AdminSetupModel.FirstName,
                        LastName = initialSettingsModel.AdminSetupModel.LastName,
                        EmailConfirmed = true,
                        TwoFactorEnabled = false,
                        IsGoogleAuthenticatorEnabled = false
                    };
                    if (!userManager.Users.Any(x => x.Email.Equals(adminUser.Email)))
                    {
                        var createResult = await userManager.CreateAsync(adminUser,
                            initialSettingsModel.AdminSetupModel.Password);
                        if (!createResult.Succeeded)
                        {
                            return new OperationResult(false,
                                _localizationService.GetString("Could not create the user"));
                        }
                    }

                    var user = userManager.Users.FirstOrDefault(x => x.Email.Equals(adminUser.Email));
                    if (!await userManager.IsInRoleAsync(user, EformRole.Admin))
                    {
                        await userManager.AddToRoleAsync(user, EformRole.Admin);
                    }
                }
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                //return new OperationResult(false, 
                //    _localizationService.GetString("MainConnectionStringIsInvalid"));

                if (exception.InnerException != null)
                {
                    return new OperationResult(false, exception.Message + " - " + exception.InnerException.Message);
                }
                else
                {
                    return new OperationResult(false, exception.Message);
                }
            }

            try
            {
                // Generate SigningKey
                var key = new byte[32];
                RandomNumberGenerator.Create().GetBytes(key);
                var signingKey = Convert.ToBase64String(key);




                using (var dbContext = new BaseDbContext(dbContextOptionsBuilder.Options))
                {
                    var signingKeyValue = dbContext.ConfigurationValues
                        .FirstOrDefault(x => x.Id == "EformTokenOptions:SigningKey");
                    var sdkConnection = dbContext.ConfigurationValues
                        .FirstOrDefault(x => x.Id == "ConnectionStringsSdk:SdkConnection");
                    var defaultLocale = dbContext.ConfigurationValues
                        .FirstOrDefault(x => x.Id == "ApplicationSettings:DefaultLocale");

                    if (signingKeyValue != null)
                    {
                        signingKeyValue.Value = signingKey;
                    }
                    if (sdkConnection != null)
                    {
                        sdkConnection.Value = sdkConnectionString;
                    }
                    if (defaultLocale != null)
                    {
                        defaultLocale.Value = initialSettingsModel.GeneralAppSetupSettingsModel.DefaultLocale;
                    }

                    dbContext.SaveChanges();

                }
                _connectionStrings.Update((options) =>
                {
                    options.DefaultConnection = mainConnectionString;
                });

                //_tokenOptions.Update((options) => { options.SigningKey = signingKey; });
                //_connectionStrings.Update((options) =>
                //{
                //    options.SdkConnection = sdkConnectionString;
                //    options.DefaultConnection = mainConnectionString;
                //});
                //_applicationSettings.Update((options) =>
                //{
                //    options.DefaultLocale = initialSettingsModel.GeneralAppSetupSettingsModel.DefaultLocale;
                //});
            }

            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                if (exception.InnerException != null)
                {
                    return new OperationResult(false, exception.Message + " - " + exception.InnerException.Message);
                }

                return new OperationResult(false, exception.Message);

                //return new OperationResult(false, 
                //    _localizationService.GetString("CouldNotWriteConnectionString"));
            }

            Program.Restart();
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
                    //IsSMTPExists = !_emailSettings.Value.SmtpHost.IsNullOrEmpty() && 
                    //               !_emailSettings.Value.SmtpPort.ToString().IsNullOrEmpty()
                };
                return new OperationDataResult<LoginPageSettingsModel>(true, model);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<LoginPageSettingsModel>(false,
                    _localizationService.GetString("CantObtainSettingsFromWebConfig"));
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

        public OperationDataResult<string> GetAssemblyVersion()
        {
            return new OperationDataResult<string>(true, null,
                Assembly.GetExecutingAssembly().GetName().Version.ToString());
        }

        public OperationDataResult<string> GetApplicationHostOs()
        {
            if (PathHelper.GetOsVersion() == OSPlatforms.Windows)
            {
                return new OperationDataResult<string>(true, "Windows");
            }

            return new OperationDataResult<string>(true, PathHelper.GetOsVersion().ToString());
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
                    _localizationService.GetString("CantObtainSettingsFromWebConfig"));
            }
        }

        public OperationResult UpdateAdminSettings(AdminSettingsModel adminSettingsModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                _emailSettings.Update((option) =>
                {
                    option.SmtpHost = adminSettingsModel.SMTPSettingsModel.Host;
                    option.SmtpPort = int.Parse(adminSettingsModel.SMTPSettingsModel.Port);
                    option.Login = adminSettingsModel.SMTPSettingsModel.Login;
                    option.Password = adminSettingsModel.SMTPSettingsModel.Password;
                });
                _headerSettings.Update((option) =>
                {
                    option.ImageLink = adminSettingsModel.HeaderSettingsModel.ImageLink;
                    option.ImageLinkVisible = adminSettingsModel.HeaderSettingsModel.ImageLinkVisible;
                    option.MainText = adminSettingsModel.HeaderSettingsModel.MainText;
                    option.MainTextVisible = adminSettingsModel.HeaderSettingsModel.MainTextVisible;
                    option.SecondaryText = adminSettingsModel.HeaderSettingsModel.SecondaryText;
                    option.SecondaryTextVisible = adminSettingsModel.HeaderSettingsModel.SecondaryTextVisible;
                });
                _loginPageSettings.Update((option) =>
                {
                    option.ImageLink = adminSettingsModel.LoginPageSettingsModel.ImageLink;
                    option.ImageLinkVisible = adminSettingsModel.LoginPageSettingsModel.ImageLinkVisible;
                    option.MainText = adminSettingsModel.LoginPageSettingsModel.MainText;
                    option.MainTextVisible = adminSettingsModel.LoginPageSettingsModel.MainTextVisible;
                    option.SecondaryText = adminSettingsModel.LoginPageSettingsModel.SecondaryText;
                    option.SecondaryTextVisible = adminSettingsModel.LoginPageSettingsModel.SecondaryTextVisible;
                });
                core.SetHttpServerAddress(adminSettingsModel.SiteLink);
                return new OperationResult(true, _localizationService.GetString("SettingsUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationResult(false, _localizationService.GetString("CantUpdateSettingsInWebConfig"));
            }
        }

        #region ResetSettingsSection

        public OperationResult ResetLoginPageSettings()
        {
            try
            {
                _loginPageSettings.Update((option) =>
                {
                    option.ImageLink = "";
                    option.ImageLinkVisible = true;
                    option.MainText = "Microting eForm";
                    option.MainTextVisible = true;
                    option.SecondaryText = "No more paper-forms and back-office data entry";
                    option.SecondaryTextVisible = true;
                });
                return new OperationResult(true, "Login page settings have been reseted successfully");
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationResult(false, "Can't update settings in web.config");
            }
        }

        public OperationResult ResetPageHeaderSettings()
        {
            try
            {
                _headerSettings.Update((option) =>
                {
                    option.ImageLink = "";
                    option.ImageLinkVisible = true;
                    option.MainText = "Microting eForm";
                    option.MainTextVisible = true;
                    option.SecondaryText = "No more paper-forms and back-office data entry";
                    option.SecondaryTextVisible = true;
                });
                return new OperationResult(true, "Header settings have been reseted successfully");
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationResult(false, "Can't update settings in web.config");
            }
        }

        #endregion
    }
}