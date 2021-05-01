using System.Threading.Tasks;
using Customers.Pn.Infrastructure.Models.Fields;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormBaseCustomerBase.Infrastructure.Models.Fields;

namespace Customers.Pn.Abstractions
{
    public interface IFieldsService
    {
        Task<OperationDataResult<FieldsUpdateModel>> GetFields();
        Task<OperationResult> UpdateFields(FieldsUpdateModel fieldsModel);
    }
}