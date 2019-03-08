/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 microting

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
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Hosting.Enums;
using eFormAPI.Web.Hosting.Helpers;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Models.Plugins;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
    public class PluginsSettingsService : IPluginsSettingsService
    {
        private readonly BaseDbContext _dbContext;
        private readonly ILocalizationService _localizationService;
        private readonly ILogger<PluginsSettingsService> _logger;

        public PluginsSettingsService(BaseDbContext dbContext,
            ILocalizationService localizationService,
            ILogger<PluginsSettingsService> logger)
        {
            _dbContext = dbContext;
            _localizationService = localizationService;
            _logger = logger;
        }

        public async Task<OperationDataResult<PluginsSettingsModel>> GetPlugins(
            PluginsSettingsRequestModel requestModel)
        {
            try
            {
                var result = new PluginsSettingsModel();
                var eformPlugins = await _dbContext.EformPlugins.ToListAsync();
                var loadedPlugins = PluginHelper.GetAllPlugins();

                foreach (var eformPlugin in eformPlugins)
                {
                    var loadedPlugin = loadedPlugins.FirstOrDefault(x => x.PluginId == eformPlugin.PluginId);
                    if (loadedPlugin != null)
                    {
                        var pluginSettingsModel = new PluginSettingsModel()
                        {
                            Id = eformPlugin.Id,
                            PluginId = eformPlugin.PluginId,
                            ConnectionString = eformPlugin.ConnectionString,
                            Status = (PluginStatus) eformPlugin.Status,
                            Name = loadedPlugin.Name,
                            Version = loadedPlugin.PluginAssembly().GetName().Version.ToString(),
                        };
                        result.SettingsList.Add(pluginSettingsModel);
                    }
                }

                result.Total = loadedPlugins.Count;
                return new OperationDataResult<PluginsSettingsModel>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<PluginsSettingsModel>(false, 
                    _localizationService.GetString("ErrorWhileObtainingPlugins"));
            }
        }

        public async Task<OperationResult> UpdatePluginSettings(PluginsSettingsUpdateModel updateModel)
        {
            try
            {
                var eformPlugin = await _dbContext.EformPlugins
                    .FirstOrDefaultAsync(x => x.Id == updateModel.Id
                                         && x.PluginId == updateModel.PluginId);
                if (eformPlugin == null)
                {
                    return new OperationDataResult<PluginsSettingsModel>(false, 
                        _localizationService.GetString("PluginNotFound"));
                }

                eformPlugin.ConnectionString = updateModel.ConnectionString;
                eformPlugin.Status = (int) updateModel.Status;
                _dbContext.EformPlugins.Update(eformPlugin);
                await _dbContext.SaveChangesAsync();
                Program.Restart();
                return new OperationResult(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<PluginsSettingsModel>(false, 
                    _localizationService.GetString("ErrorWhileUpdatingPluginSettings"));
            }
        }
    }
}