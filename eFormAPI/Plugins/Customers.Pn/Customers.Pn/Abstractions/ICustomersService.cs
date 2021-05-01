using System.Threading.Tasks;
using Customers.Pn.Infrastructure.Models.Customer;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace Customers.Pn.Abstractions
{
    public interface ICustomersService
    {
        Task<OperationDataResult<CustomersModel>> Index(CustomersRequestModel pnRequestModel);
        Task<OperationResult> Create(CustomerFullModel customerPnCreateModel);
        Task<OperationDataResult<CustomerFullModel>> Read(int id);
        Task<OperationResult> Update(CustomerFullModel customerUpdateModel);
        Task<OperationResult> Delete(int id);
        Task<OperationResult> ImportCustomers(CustomerImportModel customerImportModel);
    }
}