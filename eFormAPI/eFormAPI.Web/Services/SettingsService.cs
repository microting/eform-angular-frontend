﻿/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using eFormAPI.Web.Infrastructure.Models;
using Microting.eForm.Infrastructure;
using Sentry;

namespace eFormAPI.Web.Services;

using Microting.EformAngularFrontendBase.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Abstractions;
using Hosting.Helpers.DbOptions;
using eFormCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Enums;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.WritableOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Hosting.Helpers;
using Infrastructure.Models.Settings.Admin;
using Infrastructure.Models.Settings.Initial;
using Microting.eForm.Dto;
using Microting.eForm.Infrastructure.Data.Entities;

public class SettingsService(
    ILogger<SettingsService> logger,
    IWritableOptions<ConnectionStrings> connectionStrings,
    IDbOptions<ApplicationSettings> applicationSettings,
    IDbOptions<LoginPageSettings> loginPageSettings,
    IDbOptions<HeaderSettings> headerSettings,
    IDbOptions<EmailSettings> emailSettings,
    IEFormCoreService coreHelper,
    ILocalizationService localizationService,
    IDbOptions<ConnectionStringsSdk> connectionStringsSdk,
    BaseDbContext dbContext,
    IDbOptions<EformTokenOptions> tokenOptions)
    : ISettingsService
{
    public OperationResult ConnectionStringExist()
    {
        Log.LogEvent("SettingsService.ConnectionStringExist: called");
        var connectionString = connectionStringsSdk.Value.SdkConnection;
        if (!string.IsNullOrEmpty(connectionString))
        {
            Log.LogEvent("SettingsService.ConnectionStringExist: we have the file");
            return new OperationResult(true);
        }

        Log.LogEvent("SettingsService.ConnectionStringExist: we don't have the file");
        return new OperationResult(false,
            localizationService.GetString("ConnectionStringDoesNotExist"));
    }

    public OperationDataResult<string> GetDefaultLocale()
    {
        try
        {
            var locale = applicationSettings.Value.DefaultLocale;
            if (string.IsNullOrEmpty(locale))
            {
                return new OperationDataResult<string>(true, "en-US");
            }

            return new OperationDataResult<string>(true, model: locale);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            // We do this if any of the above fail for some reason, then we set it to default en-US
            return new OperationDataResult<string>(true, "en-US");
        }
    }

    public async Task<OperationResult> UpdateConnectionString(InitialSettingsModel initialSettingsModel)
    {
        var customerNo = initialSettingsModel.GeneralAppSetupSettingsModel.CustomerNo.ToString();
        var dbNamePrefix = "";

        if (initialSettingsModel.ConnectionStringSdk.PrefixAllDatabases)
        {
            dbNamePrefix = "Microting_";
        }

        var sdkDbName = $"{dbNamePrefix}{customerNo}_SDK";
        var angularDbName = $"{dbNamePrefix}{customerNo}_Angular";

        var sdkConnectionString =
            $"host= {initialSettingsModel.ConnectionStringSdk.Host};" +
            $"Database={sdkDbName};{initialSettingsModel.ConnectionStringSdk.Auth}" +
            $"port={initialSettingsModel.ConnectionStringSdk.Port};" +
            "Convert Zero Datetime = true;SslMode=none;";

        var angularConnectionString =
            $"host= {initialSettingsModel.ConnectionStringSdk.Host};" +
            $"Database={angularDbName};{initialSettingsModel.ConnectionStringSdk.Auth}" +
            $"port={initialSettingsModel.ConnectionStringSdk.Port};" +
            "Convert Zero Datetime = true;SslMode=none;";


        if (!string.IsNullOrEmpty(connectionStringsSdk.Value.SdkConnection))
        {
            return new OperationResult(false,
                localizationService.GetString("ConnectionStringAlreadyExist"));
        }

        try
        {
            Log.LogEvent($"SettingsService.ConnectionStringExist: connection string is {sdkConnectionString}");
            var adminTools = new AdminTools(sdkConnectionString);
            //                 Setup SDK DB
            await adminTools.DbSetup(initialSettingsModel.ConnectionStringSdk.Token);
            //                var core = await _coreHelper.GetCore();
            Core core = new Core();
            await core.StartSqlOnly(sdkConnectionString);
            await core.SetSdkSetting(Settings.customerNo, customerNo);
        }
        catch (Exception exception)
        {
            SentrySdk.CaptureException(exception);
            logger.LogError(exception.Message);
            logger.LogTrace(exception.StackTrace);
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
            dbContextOptionsBuilder.UseMySql(angularConnectionString,
                new MariaDbServerVersion(ServerVersion.AutoDetect(angularConnectionString)),
                b =>
                    b.EnableRetryOnFailure()
                        .TranslateParameterizedCollectionsToConstants());


            await using var dbContext = new BaseDbContext(dbContextOptionsBuilder.Options);
            await dbContext.Database.MigrateAsync();

            if (initialSettingsModel.AdminSetupModel != null)
            {
                // Seed admin and demo users
                await SeedAdminHelper.SeedAdmin(initialSettingsModel.AdminSetupModel,
                    initialSettingsModel.GeneralAppSetupSettingsModel.DefaultLocale, dbContext);
            }

        }
        catch (Exception exception)
        {
            SentrySdk.CaptureException(exception);
            logger.LogError(exception.Message);
            logger.LogError(exception.StackTrace);
            //return new OperationResult(false,
            //    _localizationService.GetString("MainConnectionStringIsInvalid"));
            if (exception.Message == "Could not create the user")
            {
                return new OperationResult(false,
                    localizationService.GetString(exception.Message));
            }

            if (exception.InnerException != null)
            {
                return new OperationResult(false, exception.Message + " - " + exception.InnerException.Message);
            }

            return new OperationResult(false, exception.Message);
        }

        try
        {
            // Generate SigningKey
            var key = new byte[32];
            RandomNumberGenerator.Create().GetBytes(key);
            var signingKey = Convert.ToBase64String(key);

            // Update Database settings
            await using var dbContext = new BaseDbContext(dbContextOptionsBuilder.Options);
            await tokenOptions.UpdateDb((options) => { options.SigningKey = signingKey; }, dbContext);

            await applicationSettings.UpdateDb(
                options => { options.DefaultLocale = initialSettingsModel.GeneralAppSetupSettingsModel.DefaultLocale; },
                dbContext);

            await connectionStringsSdk.UpdateDb((options) => { options.SdkConnection = sdkConnectionString; },
                dbContext);
            // Update connection string
            connectionStrings.UpdateFile((options) => { options.DefaultConnection = angularConnectionString; });
        }

        catch (Exception exception)
        {
            SentrySdk.CaptureException(exception);
            logger.LogError(exception.Message);
            logger.LogError(exception.StackTrace);
            return exception.InnerException != null
                ? new OperationResult(false, exception.Message + " - " + exception.InnerException.Message)
                : new OperationResult(false, exception.Message);
        }

        Program.Restart();
        return new OperationResult(true);
    }

    public async Task<OperationResult> IntegrityCheck()
    {
        Core core = await coreHelper.GetCore();
        MicrotingDbContext dbContext = core.DbContextHelper.GetDbContext();

        logger.LogInformation("Checking uploaded data");
        var uploadedDatas =
            await dbContext.UploadedDatas.Where(x => x.FileLocation.Contains("https://")).ToListAsync();

        logger.LogInformation($"Found {uploadedDatas.Count} uploaded data items, which needs download");
        foreach (UploadedData uploadedData in uploadedDatas)
        {
            logger.LogInformation($"Trying to download from {uploadedData.FileLocation}");
            await core.DownloadUploadedData(uploadedData.Id);
        }

        return new OperationResult(true);
    }

    public async Task<OperationDataResult<LanguagesModel>> GetLanguages()
    {
        var core = await coreHelper.GetCore();
        var sdkDbContext = core.DbContextHelper.GetDbContext();
        var languages = await sdkDbContext.Languages
            .AsNoTracking()
            .Select(x => new LanguageModel
            {
                Id = x.Id,
                Name = x.Name,
                LanguageCode = x.LanguageCode,
                IsActive = x.IsActive
            })
            //.OrderBy(x => x.LanguageCode) // TODO, make tests handle the correctly sorted list
            .ToListAsync();

        LanguagesModel languagesModel = new LanguagesModel
        {
            Languages = new List<LanguageModel>()
        };
        languagesModel.Languages.AddRange(languages);

        return new OperationDataResult<LanguagesModel>(true, languagesModel);
    }

    public async Task<OperationResult> UpdateLanguages(LanguagesModel languages)
    {
        var core = await coreHelper.GetCore();
        var sdkDbContext = core.DbContextHelper.GetDbContext();
        // loop through all languages and update them accordingly
        foreach (var language in languages.Languages)
        {
            logger.LogInformation($"Updating language {language.Name} with id {language.Id}");
            var dbLanguage = await sdkDbContext.Languages
                .FirstAsync(x => x.Id == language.Id);
            dbLanguage.IsActive = language.IsActive;
            await dbLanguage.Update(sdkDbContext);
        }

        return new OperationResult(true);
    }

    public OperationDataResult<LoginPageSettingsModel> GetLoginPageSettings()
    {
        try
        {
            var model = new LoginPageSettingsModel
            {
                ImageLink = loginPageSettings.Value.ImageLink,
                ImageLinkVisible = loginPageSettings.Value.ImageLinkVisible,
                MainText = loginPageSettings.Value.MainText,
                MainTextVisible = loginPageSettings.Value.MainTextVisible,
                SecondaryText = loginPageSettings.Value.SecondaryText,
                SecondaryTextVisible = loginPageSettings.Value.SecondaryTextVisible,
                IsSMTPExists = string.IsNullOrEmpty(emailSettings.Value.SmtpHost) &&
                               string.IsNullOrEmpty(emailSettings.Value.SmtpPort.ToString()),
                IsSendGridExists = !string.IsNullOrEmpty(emailSettings.Value.SendGridKey)
            };
            return new OperationDataResult<LoginPageSettingsModel>(true, model);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<LoginPageSettingsModel>(false,
                localizationService.GetString("CantObtainSettingsFromWebConfig"));
        }
    }

    public OperationDataResult<HeaderSettingsModel> GetPageHeaderSettings()
    {
        try
        {
            var model = new HeaderSettingsModel
            {
                ImageLink = headerSettings.Value.ImageLink,
                ImageLinkVisible = headerSettings.Value.ImageLinkVisible,
                MainText = headerSettings.Value.MainText,
                MainTextVisible = headerSettings.Value.MainTextVisible,
                SecondaryText = headerSettings.Value.SecondaryText,
                SecondaryTextVisible = headerSettings.Value.SecondaryTextVisible
            };

            return new OperationDataResult<HeaderSettingsModel>(true, model);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
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

    public OperationDataResult<string> GetLatestVersion()
    {
        return new OperationDataResult<string>(true,
            PluginHelper.GetLatestRepositoryVersion("microting", "eform-angular-frontend"));
    }

    public async Task<OperationDataResult<AdminSettingsModel>> GetAdminSettings()
    {
        try
        {
            var core = await coreHelper.GetCore();

            var model = new AdminSettingsModel
            {
                SMTPSettingsModel = new SMTPSettingsModel
                {
                    Host = emailSettings.Value.SmtpHost,
                    Port = emailSettings.Value.SmtpPort.ToString(),
                    Login = emailSettings.Value.Login,
                    Password = emailSettings.Value.Password
                },
                SendGridSettingsModel = new SendGridSettingsModel
                {
                    ApiKey = emailSettings.Value.SendGridKey
                },
                HeaderSettingsModel = new HeaderSettingsModel
                {
                    ImageLink = headerSettings.Value.ImageLink,
                    ImageLinkVisible = headerSettings.Value.ImageLinkVisible,
                    MainText = headerSettings.Value.MainText,
                    MainTextVisible = headerSettings.Value.MainTextVisible,
                    SecondaryText = headerSettings.Value.SecondaryText,
                    SecondaryTextVisible = headerSettings.Value.SecondaryTextVisible
                },
                LoginPageSettingsModel = new LoginPageSettingsModel
                {
                    ImageLink = loginPageSettings.Value.ImageLink,
                    ImageLinkVisible = loginPageSettings.Value.ImageLinkVisible,
                    MainText = loginPageSettings.Value.MainText,
                    MainTextVisible = loginPageSettings.Value.MainTextVisible,
                    SecondaryText = loginPageSettings.Value.SecondaryText,
                    SecondaryTextVisible = loginPageSettings.Value.SecondaryTextVisible,
                    IsSendGridExists = !string.IsNullOrEmpty(emailSettings.Value.SendGridKey)
                },
                SdkSettingsModel = new SDKSettingsModel
                {
                    CustomerNo = await core.GetSdkSetting(Settings.customerNo),
                    LogLevel = await core.GetSdkSetting(Settings.logLevel),
                    LogLimit = await core.GetSdkSetting(Settings.logLimit),
                    HttpServerAddress = await core.GetSdkSetting(Settings.httpServerAddress)
                },
                SiteLink = await core.GetSdkSetting(Settings.httpServerAddress),
                AssemblyVersion = Assembly.GetExecutingAssembly().GetName().Version.ToString()
            };
            return new OperationDataResult<AdminSettingsModel>(true, model);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<AdminSettingsModel>(false,
                localizationService.GetString("CantObtainSettingsFromWebConfig"));
        }
    }

    public async Task<OperationResult> UpdateAdminSettings(AdminSettingsModel adminSettingsModel)
    {
        try
        {
            var core = await coreHelper.GetCore();
            if (adminSettingsModel.SendGridSettingsModel.ApiKey != null)
            {
                await emailSettings.UpdateDb(option =>
                {
                    // option.SmtpHost = adminSettingsModel.SMTPSettingsModel.Host;
                    // option.SmtpPort = int.Parse(adminSettingsModel.SMTPSettingsModel.Port);
                    // option.Login = adminSettingsModel.SMTPSettingsModel.Login;
                    // option.Password = adminSettingsModel.SMTPSettingsModel.Password;
                    option.SendGridKey = adminSettingsModel.SendGridSettingsModel.ApiKey;
                }, dbContext);
            }

            if (adminSettingsModel.HeaderSettingsModel != null)
            {
                await headerSettings.UpdateDb(option =>
                {
                    option.ImageLink = adminSettingsModel.HeaderSettingsModel.ImageLink;
                    option.ImageLinkVisible = adminSettingsModel.HeaderSettingsModel.ImageLinkVisible;
                    option.MainText = adminSettingsModel.HeaderSettingsModel.MainText;
                    option.MainTextVisible = adminSettingsModel.HeaderSettingsModel.MainTextVisible;
                    option.SecondaryText = adminSettingsModel.HeaderSettingsModel.SecondaryText;
                    option.SecondaryTextVisible = adminSettingsModel.HeaderSettingsModel.SecondaryTextVisible;
                }, dbContext);
            }

            if (adminSettingsModel.LoginPageSettingsModel != null)
            {
                await loginPageSettings.UpdateDb(option =>
                {
                    option.ImageLink = adminSettingsModel.LoginPageSettingsModel.ImageLink;
                    option.ImageLinkVisible = adminSettingsModel.LoginPageSettingsModel.ImageLinkVisible;
                    option.MainText = adminSettingsModel.LoginPageSettingsModel.MainText;
                    option.MainTextVisible = adminSettingsModel.LoginPageSettingsModel.MainTextVisible;
                    option.SecondaryText = adminSettingsModel.LoginPageSettingsModel.SecondaryText;
                    option.SecondaryTextVisible = adminSettingsModel.LoginPageSettingsModel.SecondaryTextVisible;
                }, dbContext);
            }

            if (!string.IsNullOrEmpty(adminSettingsModel.SiteLink))
            {
                await core.SetSdkSetting(Settings.httpServerAddress, adminSettingsModel.SiteLink);
            }

            // if (adminSettingsModel.SwiftSettingsModel != null)
            // {
            //     await core.SetSdkSetting(
            //         Settings.swiftEnabled,
            //         adminSettingsModel.SwiftSettingsModel.SwiftEnabled.ToString());
            //
            //     await core.SetSdkSetting(
            //         Settings.swiftUserName,
            //         adminSettingsModel.SwiftSettingsModel.SwiftUserName);
            //
            //     if (adminSettingsModel.SwiftSettingsModel.SwiftPassword != "SOMESECRETPASSWORD")
            //     {
            //         await core.SetSdkSetting(Settings.swiftPassword,
            //             adminSettingsModel.SwiftSettingsModel.SwiftPassword);
            //     }
            //
            //     await core.SetSdkSetting(Settings.swiftEndPoint,
            //         adminSettingsModel.SwiftSettingsModel.SwiftEndpoint);
            //     await core.SetSdkSetting(Settings.keystoneEndPoint,
            //         adminSettingsModel.SwiftSettingsModel.KeystoneEndpoint);
            // }

            // if (adminSettingsModel.SdkSettingsModel != null)
            // {
            //     await core.SetSdkSetting(Settings.customerNo, adminSettingsModel.SdkSettingsModel.CustomerNo);
            //     await core.SetSdkSetting(Settings.logLevel, adminSettingsModel.SdkSettingsModel.LogLevel);
            //     await core.SetSdkSetting(Settings.logLimit, adminSettingsModel.SdkSettingsModel.LogLimit);
            //     await core.SetSdkSetting(Settings.fileLocationPicture, adminSettingsModel.SdkSettingsModel.FileLocationPicture);
            //     await core.SetSdkSetting(Settings.fileLocationPdf, adminSettingsModel.SdkSettingsModel.FileLocationPdf);
            //     await core.SetSdkSetting(Settings.fileLocationJasper, adminSettingsModel.SdkSettingsModel.FileLocationReports);
            //     await core.SetSdkSetting(Settings.httpServerAddress, adminSettingsModel.SdkSettingsModel.HttpServerAddress);
            // }
            //
            // if (adminSettingsModel.S3SettingsModel != null)
            // {
            //     await core.SetSdkSetting(Settings.s3Enabled, adminSettingsModel.S3SettingsModel.S3Enabled.ToString());
            //     await core.SetSdkSetting(Settings.s3AccessKeyId, adminSettingsModel.S3SettingsModel.S3AccessKeyId);
            //     await core.SetSdkSetting(Settings.s3BucketName, adminSettingsModel.S3SettingsModel.S3BucketName);
            //
            //     if (adminSettingsModel.S3SettingsModel.S3SecrectAccessKey != "SOMESECRETPASSWORD")
            //     {
            //         await core.SetSdkSetting(Settings.s3SecrectAccessKey, adminSettingsModel.S3SettingsModel.S3SecrectAccessKey);
            //     }
            //
            //     await core.SetSdkSetting(Settings.s3Endpoint, adminSettingsModel.S3SettingsModel.S3Endpoint);
            // }

            return new OperationResult(true, localizationService.GetString("SettingsUpdatedSuccessfully"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false, localizationService.GetString("CantUpdateSettingsInWebConfig"));
        }
    }

    #region ResetSettingsSection

    public async Task<OperationResult> ResetLoginPageSettings()
    {
        try
        {
            await loginPageSettings.UpdateDb((option) =>
            {
                option.ImageLink = "";
                option.ImageLinkVisible = true;
                option.MainText = "eForm Backend";
                option.MainTextVisible = true;
                option.SecondaryText = "No more paper-forms and back-office data entry";
                option.SecondaryTextVisible = true;
            }, dbContext);
            return new OperationResult(true, "Login page settings have been reset successfully");
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false, "Can't update settings in web.config");
        }
    }

    public async Task<OperationResult> ResetPageHeaderSettings()
    {
        try
        {
            await headerSettings.UpdateDb((option) =>
            {
                option.ImageLink = "";
                option.ImageLinkVisible = true;
                option.MainText = "eForm Backend";
                option.MainTextVisible = true;
                option.SecondaryText = "No more paper-forms and back-office data entry";
                option.SecondaryTextVisible = true;
            }, dbContext);
            return new OperationResult(true, "Header settings have been reset successfully");
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false, "Can't update settings in web.config");
        }
    }

    #endregion
}