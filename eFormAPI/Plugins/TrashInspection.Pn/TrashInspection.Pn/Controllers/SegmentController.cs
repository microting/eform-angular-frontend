using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Controllers
{
    public class SegmentController: Controller
    {
        
        private readonly ISegmentService _segmentService;

        public SegmentController(ISegmentService segmentService)
        {
            _segmentService = segmentService;
        }
        
        [HttpGet]
        [Route("api/trash-inspection-pn/segments")]
        public async Task<OperationDataResult<SegmentsModel>> Index(SegmentRequestModel requestModel)
        {
            return await _segmentService.Index(requestModel);
        }
        
        [HttpPost]
        [Route("api/trash-inspection-pn/segments")]
        public async Task<OperationResult> Create([FromBody] SegmentModel createModel)
        {
            return await _segmentService.Create(createModel);
        }

        [HttpGet]
        [Route("api/trash-inspection-pn/segments/{id}")]
        public async Task<OperationDataResult<SegmentModel>> Read(int id)
        {
            return await _segmentService.Read(id);
        }
        
        [HttpPut]
        [Route("api/trash-inspection-pn/segments")]
        public async Task<OperationResult> Update([FromBody] SegmentModel updateModel)
        {
            return await _segmentService.Update(updateModel);
        }

        [HttpDelete]
        [Route("api/trash-inspection-pn/segments/{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _segmentService.Delete(id);
        }
    }
}