using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using eFormAPI.Web.Abstractions;


namespace eFormAPI.Web.Controllers
{
    [Authorize(Roles = EformRole.Admin)]
    public class PluginsPermissionsController : Controller
    {
        private readonly IPluginPermissionsService _pluginPermissionsService;

        public PluginsPermissionsController(IPluginPermissionsService pluginPermissionsService)
        {
            _pluginPermissionsService = pluginPermissionsService;
        }

        [HttpGet("api/plugins-permissions/{id}")]
        public async Task<OperationDataResult<ICollection<PluginPermissionModel>>> GetPluginPermissions(int id)
        {
            return await _pluginPermissionsService.GetPluginPermissions(id);
        }

        [HttpGet("api/plugins-permissions/group-permissions/{id}")]
        public async Task<OperationDataResult<ICollection<PluginGroupPermissionsListModel>>> GetPluginGroupPermissions(int id)
        {
            return await _pluginPermissionsService.GetPluginGroupPermissions(id);
        }

        [HttpPut("api/plugins-permissions/group-permissions/{id}")]
        public async Task<OperationResult> SetPluginGroupPermissions(int id, [FromBody]ICollection<PluginGroupPermissionsListModel> permissions)
        {
            return await _pluginPermissionsService.SetPluginGroupPermissions(id, permissions);
        }
    }
}