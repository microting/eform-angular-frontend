/*
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

using System;
using System.Diagnostics;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Monitoring.Pn.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.EformMonitoringBase.Infrastructure.Data;
using Microting.EformMonitoringBase.Infrastructure.Models.Settings;

namespace Monitoring.Pn.Services
{
    public class MonitoringPnSettingsService :IMonitoringPnSettingsService
    {
        private readonly ILogger<MonitoringPnSettingsService> _logger;
        private readonly IMonitoringLocalizationService _monitoringLocalizationService;
        private readonly EformMonitoringPnDbContext _dbContext;
        private readonly IPluginDbOptions<MonitoringBaseSettings> _options;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MonitoringPnSettingsService(ILogger<MonitoringPnSettingsService> logger,
            IMonitoringLocalizationService monitoringLocalizationService,
            EformMonitoringPnDbContext dbContext,
            IPluginDbOptions<MonitoringBaseSettings> options,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _dbContext = dbContext;
            _options = options;
            _httpContextAccessor = httpContextAccessor;
            _monitoringLocalizationService = monitoringLocalizationService;
        }

        public async Task<OperationDataResult<MonitoringBaseSettings>> GetSettings()
        {
            try
            {
                var option = _options.Value;

                if (option?.SdkConnectionString == "...")
                {
                    var connectionString = _dbContext.Database.GetDbConnection().ConnectionString;

                    var dbNameSection = Regex.Match(connectionString, @"(Database=(...)_eform-angular-\w*-plugin;)").Groups[0].Value;
                    var dbPrefix = Regex.Match(connectionString, @"Database=(\d*)_").Groups[1].Value;
                    var sdk = $"Database={dbPrefix}_SDK;";
                    connectionString = connectionString.Replace(dbNameSection, sdk);
                    await _options.UpdateDb(settings => { settings.SdkConnectionString = connectionString;}, _dbContext, UserId);
                }

                return new OperationDataResult<MonitoringBaseSettings>(true, option);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<MonitoringBaseSettings>(false,
                    _monitoringLocalizationService.GetString("ErrorWhileObtainingMonitoringSettings"));
            }
        }

        public async Task<OperationResult> UpdateSettings(MonitoringBaseSettings monitoringBaseSettings)
        {
            try
            {
                await _options.UpdateDb(settings =>
                {
                    settings.LogLevel = monitoringBaseSettings.LogLevel;
                    settings.LogLimit = monitoringBaseSettings.LogLimit;
                    settings.SdkConnectionString = monitoringBaseSettings.SdkConnectionString;
                    settings.SendGridApiKey = monitoringBaseSettings.SendGridApiKey;
                    settings.FromEmailAddress = monitoringBaseSettings.FromEmailAddress;
                    settings.FromEmailName = monitoringBaseSettings.FromEmailName;
                }, _dbContext, UserId);

                return new OperationResult(true,
                    _monitoringLocalizationService.GetString("SettingsHaveBeenUpdatedSuccessfully"));
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false, _monitoringLocalizationService.GetString("ErrorWhileUpdatingSettings"));
            }
        }

        public int UserId
        {
            get
            {
                var value = _httpContextAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return value == null ? 0 : int.Parse(value);
            }
        }
    }
}