using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Const;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Controllers
{
    public class TrashInspectionSettingsController : Controller
    {
        private readonly ITrashInspectionPnSettingsService _trashInspectionPnSettingsService;

        public TrashInspectionSettingsController(ITrashInspectionPnSettingsService trashInspectionPnSettingsService)
        {
            _trashInspectionPnSettingsService = trashInspectionPnSettingsService;
        }

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/trash-inspection-pn/settings")]
        public async Task<OperationDataResult<TrashInspectionBaseSettings>> GetSettings()
        {
            return await _trashInspectionPnSettingsService.GetSettings();
        }

        [HttpPost]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/trash-inspection-pn/settings")]
        public async Task<OperationResult> UpdateSettings([FromBody] TrashInspectionBaseSettings trashInspectionSettingsModel)
        {
            return await _trashInspectionPnSettingsService.UpdateSettings(trashInspectionSettingsModel);
        }

        [HttpGet]
        [Authorize(Policy = TrashInspectionClaims.AccessTrashInspectionPlugin)]
        [Route("api/trash-inspection-pn/token")]
        public OperationDataResult<TrashInspectionBaseToken> GetToken()
        {
            return  _trashInspectionPnSettingsService.GetToken();
        }
    }
}
