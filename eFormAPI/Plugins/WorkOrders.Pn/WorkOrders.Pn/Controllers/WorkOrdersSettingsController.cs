using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using System.Threading.Tasks;
using WorkOrders.Pn.Abstractions;
using WorkOrders.Pn.Infrastructure.Models.Settings;

namespace WorkOrders.Pn.Controllers
{
    [Authorize]
    public class WorkOrdersSettingsController : Controller
    {
        private readonly IWorkOrdersSettingsService _workOrdersSettingsService;

        public WorkOrdersSettingsController(IWorkOrdersSettingsService workOrdersSettingsService)
        {
            _workOrdersSettingsService = workOrdersSettingsService;
        }

        [HttpGet("api/workorders-pn/settings")]
        public async Task<OperationDataResult<WorkOrdersSettingsModel>> GetAllSettings()
        {
            return await _workOrdersSettingsService.GetAllSettingsAsync();
        }

        [HttpPost("api/workorders-pn/settings/sites")]
        public async Task<OperationResult> PostSiteToSettings([FromBody]int siteId)
        {
            return await _workOrdersSettingsService.AddSiteToSettingsAsync(siteId);
        }

        [HttpPost("api/workorders-pn/settings/folder")]
        public async Task<OperationResult> UpdateFolder([FromBody] int folderId)
        {
            return await _workOrdersSettingsService.UpdateFolder(folderId);
        }

        [HttpPost("api/workorders-pn/settings/tasksfolder")]
        public async Task<OperationResult> UpdateTaskFolder([FromBody] int folderId)
        {
            return await _workOrdersSettingsService.UpdateTaskFolder(folderId);
        }

        [HttpDelete("api/workorders-pn/settings/sites/{siteId}")]
        public async Task<OperationResult> DeleteSiteFromSettingsAsync(int siteId)
        {
            return await _workOrdersSettingsService.RemoveSiteFromSettingsAsync(siteId);
        }
    }
}
