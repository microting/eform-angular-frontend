using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using eFormAPI.Web.Services;


namespace eFormAPI.Web.Controllers
{
    using System.Collections.Generic;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Application;

    [Authorize(Roles = EformRole.Admin)]
    public class PluginsPermissionsController : Controller
    {
        private readonly IPluginPermissionsService _pluginPermissionsService;

        public PluginsPermissionsController(IPluginPermissionsService pluginPermissionsService)
        {
            _pluginPermissionsService = pluginPermissionsService;
        }

        [HttpGet("api/plugins-permissions/{id}")]
        public async Task<OperationDataResult<ICollection<PluginPermissionModel>>> GetInstalledPlugins(int id)
        {
            return await _pluginPermissionsService.GetPluginPermissions(id);
        }

        [HttpGet("api/plugins-permissions/{id}/group-permissions")]
        public async Task<OperationDataResult<ICollection<PluginGroupPermissionModel>>> GetMarketplacePlugins(int id)
        {
            return await _pluginPermissionsService.GetPluginGroupPermissions(id);
        }

        [HttpPut("api/plugins-permissions/{id}/group-permissions")]
        public async Task<OperationResult> SetPluginGroupPermissions(int id, [FromBody]ICollection<PluginGroupPermissionModel> permissions)
        {
            return await _pluginPermissionsService.SetPluginGroupPermissions(id, permissions);
        }
    }
}