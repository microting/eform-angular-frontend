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

namespace InsightDashboard.Pn.Services.Common.InsightDashboardPnSettingsService
{
    using System;
    using System.Diagnostics;
    using System.Security.Claims;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using InsightDashboardLocalizationService;
    using Microsoft.AspNetCore.Http;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.InsightDashboardBase.Infrastructure.Data;
    using Microting.InsightDashboardBase.Infrastructure.Models;

    public class InsightDashboardPnSettingsService : IInsightDashboardPnSettingsService
    {
        private readonly ILogger<InsightDashboardPnSettingsService> _logger;
        private readonly IInsightDashboardLocalizationService _localizationService;
        private readonly InsightDashboardPnDbContext _dbContext;
        private readonly IPluginDbOptions<InsightDashboardBaseSettings> _options;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public InsightDashboardPnSettingsService(ILogger<InsightDashboardPnSettingsService> logger,
            IInsightDashboardLocalizationService localizationService,
            InsightDashboardPnDbContext dbContext,
            IPluginDbOptions<InsightDashboardBaseSettings> options,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _dbContext = dbContext;
            _options = options;
            _httpContextAccessor = httpContextAccessor;
            _localizationService = localizationService;
        }

        public async Task<OperationDataResult<InsightDashboardBaseSettings>> GetSettings()
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

                return new OperationDataResult<InsightDashboardBaseSettings>(true, option);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<InsightDashboardBaseSettings>(false,
                    _localizationService.GetString("ErrorWhileObtainingDashboardSettings"));
            }
        }

        public async Task<OperationResult> UpdateSettings(InsightDashboardBaseSettings baseSettings)
        {
            try
            {
                await _options.UpdateDb(settings =>
                {
                    settings.SdkConnectionString = baseSettings.SdkConnectionString;
                }, _dbContext, UserId);

                return new OperationResult(true,
                    _localizationService.GetString("SettingsHaveBeenUpdatedSuccessfully"));
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false, _localizationService.GetString("ErrorWhileUpdatingSettings"));
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