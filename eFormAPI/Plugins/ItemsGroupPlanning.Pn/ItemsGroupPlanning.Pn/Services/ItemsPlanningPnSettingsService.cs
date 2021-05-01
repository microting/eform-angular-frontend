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

namespace ItemsGroupPlanning.Pn.Services
{
    using System;
    using System.Diagnostics;
    using System.Linq;
    using System.Security.Claims;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Models.Settings;
    using Microsoft.AspNetCore.Http;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Data;

    public class ItemsPlanningPnSettingsService : IItemsPlanningPnSettingsService
    {
        private readonly ILogger<ItemsPlanningPnSettingsService> _logger;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly ItemsGroupPlanningPnDbContext _dbContext;
        private readonly IPluginDbOptions<ItemsPlanningBaseSettings> _options;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public ItemsPlanningPnSettingsService(ILogger<ItemsPlanningPnSettingsService> logger,
            IItemsPlanningLocalizationService itemsPlanningLocalizationService,
            ItemsGroupPlanningPnDbContext dbContext,
            IPluginDbOptions<ItemsPlanningBaseSettings> options,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _dbContext = dbContext;
            _options = options;
            _httpContextAccessor = httpContextAccessor;
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
        }


        public async Task<OperationDataResult<ItemsPlanningBaseSettings>> GetSettings()
        {
            try
            {
                var option = _options.Value;
                if (option.Token == "...")
                {
                    const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    Random random = new Random();
                    string result = new string(chars.Select(c => chars[random.Next(chars.Length)]).Take(32).ToArray());
                    await _options.UpdateDb(settings => { settings.Token = result;}, _dbContext, UserId);
                }

                if (option.SdkConnectionString == "...")
                {
                    string connectionString = _dbContext.Database.GetDbConnection().ConnectionString;

                    string dbNameSection = Regex.Match(connectionString, @"(Database=(...)_eform-angular-\w*-plugin;)").Groups[0].Value;
                    string dbPrefix = Regex.Match(connectionString, @"Database=(\d*)_").Groups[1].Value;
                    string sdk = $"Database={dbPrefix}_SDK;";
                    connectionString = connectionString.Replace(dbNameSection, sdk);
                    await _options.UpdateDb(settings => { settings.SdkConnectionString = connectionString;}, _dbContext, UserId);

                }

                return new OperationDataResult<ItemsPlanningBaseSettings>(true, option);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<ItemsPlanningBaseSettings>(false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileObtainingItemsPlanningSettings"));
            }
        }

        public async Task<OperationResult> UpdateSettings(ItemsPlanningBaseSettings itemsPlanningBaseSettings)
        {
            try
            {
                await _options.UpdateDb(settings =>
                {
                    settings.LogLevel = itemsPlanningBaseSettings.LogLevel;
                    settings.LogLimit = itemsPlanningBaseSettings.LogLimit;
                    settings.MaxParallelism = itemsPlanningBaseSettings.MaxParallelism;
                    settings.NumberOfWorkers = itemsPlanningBaseSettings.NumberOfWorkers;
                    settings.SdkConnectionString = itemsPlanningBaseSettings.SdkConnectionString;
                    settings.SiteIds = itemsPlanningBaseSettings.SiteIds;
                }, _dbContext, UserId);
                
                return new OperationResult(true,
                    _itemsPlanningLocalizationService.GetString("SettingsHaveBeenUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileUpdatingSettings"));
            }
        }

        public async Task<OperationDataResult<ItemsPlanningBaseBaseToken>> GetToken()
        {
            try
            {
                ItemsPlanningBaseBaseToken itemsPlanningBaseBaseToken = new ItemsPlanningBaseBaseToken()
                {
                    Token =_options.Value.Token
                };

                return new OperationDataResult<ItemsPlanningBaseBaseToken>(true, itemsPlanningBaseBaseToken);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<ItemsPlanningBaseBaseToken>(false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileObtainingTrashInspectionToken"));
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