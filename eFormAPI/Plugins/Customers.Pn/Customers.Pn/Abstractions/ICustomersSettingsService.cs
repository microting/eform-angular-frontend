using System.Threading.Tasks;
using Customers.Pn.Infrastructure.Models.Customer;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace Customers.Pn.Abstractions
{
    public interface ICustomersSettingsService
    {
        Task<OperationDataResult<CustomerSettingsModel>> GetSettings();
        Task<OperationResult> UpdateSettings(CustomerSettingsModel customerUpdateModel);
    }
}
