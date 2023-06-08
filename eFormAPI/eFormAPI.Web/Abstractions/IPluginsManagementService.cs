using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.Plugins;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions;

public interface IPluginsManagementService
{
    Task<OperationDataResult<InstalledPluginsModel>> GetInstalledPlugins(InstalledPluginsRequestModel requestModel);
    Task<OperationResult> UpdateInstalledPlugins(InstalledPluginUpdateModel updateModel);
    Task<OperationDataResult<PluginsStoreModel>> GetMarketplacePlugins(MarketplacePluginsRequestModel model);
    Task<OperationResult> InstallMarketplacePlugin(string pluginId);
    Task<OperationResult> RemoveNavigationMenuOfPlugin(string pluginId);
    Task<OperationResult> LoadNavigationMenuOfPlugin(string pluginId);

    Task<OperationResult> LoadNavigationMenuDuringStartProgram(string pluginId);
}