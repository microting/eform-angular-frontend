using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using System.Threading.Tasks;
using WorkOrders.Pn.Abstractions;
using WorkOrders.Pn.Infrastructure.Models;

namespace WorkOrders.Pn.Controllers
{
    [Authorize]
    [Route("api/workorders-pn")]
    public class WorkOrdersController : Controller
    {
        private readonly IWorkOrdersService _workOrdersService;

        public WorkOrdersController(IWorkOrdersService workOrdersService)
        {
            _workOrdersService = workOrdersService;
        }

        [HttpPost]
        public async Task<OperationDataResult<WorkOrdersModel>> GetWorkOrders([FromBody]WorkOrdersRequestModel requestModel)
        {
            return await _workOrdersService.GetWorkOrdersAsync(requestModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _workOrdersService.Delete(id);
        }
    }
}
