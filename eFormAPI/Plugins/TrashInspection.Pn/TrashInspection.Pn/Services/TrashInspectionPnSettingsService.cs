/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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

using System;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Services
{
    public class TrashInspectionPnSettingsService : ITrashInspectionPnSettingsService
    {
        private readonly ILogger<TrashInspectionPnSettingsService> _logger;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly IPluginDbOptions<TrashInspectionBaseSettings> _options;
        private readonly IUserService _userService;


        public TrashInspectionPnSettingsService(
            ILogger<TrashInspectionPnSettingsService> logger,
            ITrashInspectionLocalizationService trashInspectionLocalizationService,
            TrashInspectionPnDbContext dbContext,
            IPluginDbOptions<TrashInspectionBaseSettings> options,
            IUserService userService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _options = options;
            _userService = userService;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }

        public async Task<OperationDataResult<TrashInspectionBaseSettings>> GetSettings()
        {
            try
            {
                var option = _options.Value;
                if (option.Token == "...")
                {
                    const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    var random = new Random();
                    var result = new string(chars.Select(c => chars[random.Next(chars.Length)]).Take(32).ToArray());
                    await _options.UpdateDb(settings => { settings.Token = result;}, _dbContext, _userService.UserId);
                }

                if (option.SdkConnectionString == "...")
                {
                    var connectionString = _dbContext.Database.GetDbConnection().ConnectionString;
                    var dbNameSection = Regex.Match(connectionString, @"(Database=(...)_eform-angular-\w*-plugin;)").Groups[0].Value;
                    var dbPrefix = Regex.Match(connectionString, @"Database=(\d*)_").Groups[1].Value;
                    var sdk = $"Database={dbPrefix}_SDK;";
                    connectionString = connectionString.Replace(dbNameSection, sdk);
                    await _options.UpdateDb(settings => { settings.SdkConnectionString = connectionString;}, _dbContext, _userService.UserId);

                }

                return new OperationDataResult<TrashInspectionBaseSettings>(true, option);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<TrashInspectionBaseSettings>(false,
                    _trashInspectionLocalizationService.GetString("ErrorWhileObtainingTrashInspectionSettings"));
            }
        }

        public async Task<OperationResult> UpdateSettings(TrashInspectionBaseSettings trashInspectionSettingsModel)
        {
            try
            {
                await _options.UpdateDb(settings =>
                {
                    settings.Token = trashInspectionSettingsModel.Token;
                    settings.LogLevel = trashInspectionSettingsModel.LogLevel;
                    settings.LogLimit = trashInspectionSettingsModel.LogLimit;
                    settings.MaxParallelism = trashInspectionSettingsModel.MaxParallelism;
                    settings.CallBackUrl = trashInspectionSettingsModel.CallBackUrl;
                    settings.NumberOfWorkers = trashInspectionSettingsModel.NumberOfWorkers;
                    settings.SdkConnectionString = trashInspectionSettingsModel.SdkConnectionString;
                    settings.CallbackCredentialPassword = trashInspectionSettingsModel.CallbackCredentialPassword;
                    settings.CallBackCredentialDomain = trashInspectionSettingsModel.CallBackCredentialDomain;
                    settings.ExtendedInspectioneFormId = trashInspectionSettingsModel.ExtendedInspectioneFormId;
                    settings.CallbackCredentialAuthType = trashInspectionSettingsModel.CallbackCredentialAuthType;
                    settings.CallbackCredentialUserName = trashInspectionSettingsModel.CallbackCredentialUserName;
                }, _dbContext, _userService.UserId);

                return new OperationResult(true,
                    _trashInspectionLocalizationService.GetString("SettingsHaveBeenUpdatedSuccessfully"));
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false, _trashInspectionLocalizationService.GetString("ErrorWhileUpdatingSettings"));
            }
        }

        public OperationDataResult<TrashInspectionBaseToken> GetToken()
        {
            try
            {
                TrashInspectionBaseToken trashInspectionBaseToken = new TrashInspectionBaseToken
                {
                    Token = _options.Value.Token
                };

                return new OperationDataResult<TrashInspectionBaseToken>(true, trashInspectionBaseToken);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<TrashInspectionBaseToken>(false,
                    _trashInspectionLocalizationService.GetString("ErrorWhileObtainingTrashInspectionToken"));
            }
        }
    }
}
