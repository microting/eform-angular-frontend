using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Controllers
{
    using Infrastructure.Models.Producers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    public class ProducerController : Controller
    {

        private readonly IProducerService _producerService;

        public ProducerController(IProducerService producerService)
        {
            _producerService = producerService;
        }
        
        [HttpGet]
        [Route("api/trash-inspection-pn/producers")]
        public async Task<OperationDataResult<ProducersModel>> Index(ProducerRequestModel requestModel)
        {
            return await _producerService.Index(requestModel);
        }
        
        [HttpPost]
        [Route("api/trash-inspection-pn/producers")]
        public async Task<OperationResult> Create([FromBody] ProducerModel createModel)
        {
            return await _producerService.Create(createModel);
        }

        [HttpGet]
        [Route("api/trash-inspection-pn/producers/{id}")]
        public async Task<OperationDataResult<ProducerModel>> Read(int id)
        {
            return await _producerService.Read(id);
        }
        
        [HttpPut]
        [Route("api/trash-inspection-pn/producers")]
        public async Task<OperationResult> Update([FromBody] ProducerModel updateModel)
        {
            return await _producerService.Update(updateModel);
        }

        [HttpDelete]
        [Route("api/trash-inspection-pn/producers/{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _producerService.Delete(id);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/producers/import")]
        public async Task<OperationResult> ImportProducer([FromBody] ProducerImportModel producerImportModel)
        {
            return await _producerService.ImportProducer(producerImportModel);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/producers/stats-by-year")]
        public async Task<OperationDataResult<Paged<StatByYearModel>>> GetProducersStatsByYear([FromBody] ProducersYearRequestModel requestModel)
        {
            return await _producerService.GetProducersStatsByYear(requestModel);
        }
        
        [HttpGet]
        [Route("api/trash-inspection-pn/producers/{id}/{year}")]
        public async Task<OperationDataResult<StatByMonth>> GetSingleProducerByMonth(int id, int year)
        {
            return await _producerService.GetSingleProducerByMonth(id, year);
        }

    }
}