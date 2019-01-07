using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.Plugins;
using eFormAPI.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers
{
    [Authorize(Roles = EformRole.Admin)]
    public class PluginsController : Controller
    {
        private readonly IPluginsSettingsService _pluginsSettingsService;

        public PluginsController(IPluginsSettingsService pluginsSettingsService)
        {
            _pluginsSettingsService = pluginsSettingsService;
        }

        [HttpGet]
        [Route("api/plugins/settings")]
        public async Task<OperationDataResult<PluginsSettingsModel>> GetCurrentUserMenu(PluginsSettingsRequestModel model)
        {
            return await _pluginsSettingsService.GetPlugins(model);
        }

        [HttpPut]
        [Route("api/plugins/settings")]
        public async Task<OperationResult> GetCurrentUserMenu([FromBody] PluginsSettingsUpdateModel model)
        {
            return await _pluginsSettingsService.UpdatePluginSettings(model);
        }
    }
}