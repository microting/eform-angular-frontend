using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Controllers
{
    using Infrastructure.Models.Transporters;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    public class TransporterController : Controller
    {

        private readonly ITransporterService _transporterService;

        public TransporterController(ITransporterService transporterService)
        {
            _transporterService = transporterService;
        }
        [HttpGet]
        [Route("api/trash-inspection-pn/transporters")]
        public async Task<OperationDataResult<TransportersModel>> Index(TransporterRequestModel requestModel)
        {
            return await _transporterService.Index(requestModel);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/transporters")]
        public async Task<OperationResult> Create([FromBody] TransporterModel createModel)
        {
            return await _transporterService.Create(createModel);
        }
        
        [HttpGet]
        [Route("api/trash-inspection-pn/transporters/{id}")]
        public async Task<OperationDataResult<TransporterModel>> Read(int id)
        {
            return await _transporterService.Read(id);
        }
        
        [HttpPut]
        [Route("api/trash-inspection-pn/transporters")]
        public async Task<OperationResult> Update([FromBody] TransporterModel updateModel)
        {
            return await _transporterService.Update(updateModel);
        }

        [HttpDelete]
        [Route("api/trash-inspection-pn/transporters/{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _transporterService.Delete(id);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/transporters/import")]
        public async Task<OperationResult> ImportTransporter([FromBody] TransporterImportModel transporterImportModel)
        {
            return await _transporterService.ImportTransporter(transporterImportModel);
        }

        [HttpGet]
        [Route("api/trash-inspection-pn/transporters/{id}/{year}")]
        public async Task<OperationDataResult<StatByMonth>> GetSingleTransporterByMonth(int id, int year)
        {
            return await _transporterService.GetSingleTransporterByMonth(id, year);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/transporters/stats-by-year")]
        public async Task<OperationDataResult<Paged<StatByYearModel>>> GetTransportersStatsByYear([FromBody] TransportersYearRequestModel requestModel)
        {
            return await _transporterService.GetTransportersStatsByYear(requestModel);
        }
    }
}