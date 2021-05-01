namespace ItemsGroupPlanning.Pn.Controllers
{
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Models.Settings;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public class ItemsPlanningSettingsController : Controller
    {
        private readonly IItemsPlanningPnSettingsService _itemsPlanningPnSettingsService;

        public ItemsPlanningSettingsController(IItemsPlanningPnSettingsService itemsPlanningPnSettingsService)
        {
            _itemsPlanningPnSettingsService = itemsPlanningPnSettingsService;
        }

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/items-group-planning-pn/settings")]
        public async Task<OperationDataResult<ItemsPlanningBaseSettings>> GetSettings()
        {
            return await _itemsPlanningPnSettingsService.GetSettings();
        }
        
        [HttpPost]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/items-group-planning-pn/settings")]
        public async Task<OperationResult> UpdateSettings([FromBody] ItemsPlanningBaseSettings itemsPlanningBaseSettings)
        {
            return await _itemsPlanningPnSettingsService.UpdateSettings(itemsPlanningBaseSettings);
        }

    }
}