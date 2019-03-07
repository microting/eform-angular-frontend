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
    public class PluginsManagementService : IPluginsManagementService
    {
        private readonly BaseDbContext _dbContext;
        private readonly ILocalizationService _localizationService;
        private readonly ILogger<PluginsManagementService> _logger;

        public PluginsManagementService(BaseDbContext dbContext,
            ILocalizationService localizationService,
            ILogger<PluginsManagementService> logger)
        {
            _dbContext = dbContext;
            _localizationService = localizationService;
            _logger = logger;
        }

        public async Task<OperationDataResult<InstalledPluginsModel>> GetInstalledPlugins(
            InstalledPluginsRequestModel requestModel)
        {
            try
            {
                var result = new InstalledPluginsModel();
                var eformPlugins = await _dbContext.EformPlugins.ToListAsync();
                var loadedPlugins = PluginHelper.GetAllPlugins();

                foreach (var eformPlugin in eformPlugins)
                {
                    var loadedPlugin = loadedPlugins.FirstOrDefault(x => x.PluginId == eformPlugin.PluginId);
                    if (loadedPlugin != null)
                    {
                        var pluginSettingsModel = new InstalledPluginModel()
                        {
                            Id = eformPlugin.Id,
                            PluginId = eformPlugin.PluginId,
                            ConnectionString = eformPlugin.ConnectionString,
                            Status = (PluginStatus) eformPlugin.Status,
                            Name = loadedPlugin.Name,
                            Version = loadedPlugin.PluginAssembly().GetName().Version.ToString(),
                        };
                        result.PluginsList.Add(pluginSettingsModel);
                    }
                }

                result.Total = loadedPlugins.Count;
                return new OperationDataResult<InstalledPluginsModel>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<InstalledPluginsModel>(false, 
                    _localizationService.GetString("ErrorWhileObtainingPlugins"));
            }
        }

        public async Task<OperationResult> UpdateInstalledPlugins(InstalledPluginUpdateModel updateModel)
        {
            try
            {
                var eformPlugin = await _dbContext.EformPlugins
                    .FirstOrDefaultAsync(x => x.Id == updateModel.Id
                                         && x.PluginId == updateModel.PluginId);
                if (eformPlugin == null)
                {
                    return new OperationDataResult<InstalledPluginsModel>(false, 
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
                return new OperationDataResult<InstalledPluginsModel>(false, 
                    _localizationService.GetString("ErrorWhileUpdatingPluginSettings"));
            }
        }

        public Task<OperationDataResult<InstalledPluginsModel>> GetMarketplacePlugins(MarketplacePluginsRequestModel model)
        {
            throw new NotImplementedException();
        }

        public Task<OperationResult> InstallMarketplacePlugin(int pluginId)
        {
            throw new NotImplementedException();
        }
    }
}