using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models.Plugins;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers;

[Authorize(Roles = EformRole.Admin)]
public class PluginsManagementController(IPluginsManagementService pluginsManagementService) : Controller
{
    [HttpGet]
    [Route("api/plugins-management/installed")]
    public async Task<OperationDataResult<InstalledPluginsModel>> GetInstalledPlugins(InstalledPluginsRequestModel model)
    {
        return await pluginsManagementService.GetInstalledPlugins(model);
    }

    [HttpPut]
    [Route("api/plugins-management/installed")]
    public async Task<OperationResult> UpdateInstalledPlugin([FromBody] InstalledPluginUpdateModel model)
    {
        return await pluginsManagementService.UpdateInstalledPlugins(model);
    }

    [HttpGet]
    [Route("api/plugins-management/marketplace")]
    public async Task<OperationDataResult<PluginsStoreModel>> GetMarketplacePlugins(MarketplacePluginsRequestModel model)
    {
        return await pluginsManagementService.GetMarketplacePlugins(model);
    }

    [HttpPut]
    [Route("api/plugins-management/marketplace")]
    public async Task<OperationResult> InstallMarketplacePlugin([FromBody]string pluginId)
    {
        return await pluginsManagementService.InstallMarketplacePlugin(pluginId);
    }
}