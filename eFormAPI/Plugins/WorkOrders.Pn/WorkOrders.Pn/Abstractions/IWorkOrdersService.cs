using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using System.Threading.Tasks;
using WorkOrders.Pn.Infrastructure.Models;

namespace WorkOrders.Pn.Abstractions
{
    public interface IWorkOrdersService
    {
        Task<OperationDataResult<WorkOrdersModel>> GetWorkOrdersAsync(WorkOrdersRequestModel model);
        Task<OperationResult> Delete(int id);
    }
}
