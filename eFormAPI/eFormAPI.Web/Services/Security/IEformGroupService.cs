using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Templates;

namespace eFormAPI.Web.Services.Security
{
    public interface IEformGroupService
    {
        Task<OperationResult> AddEformToGroup(EformBindGroupModel requestModel);
        Task<OperationDataResult<EformsPermissionsModel>> GetAvailableEforms(TemplateRequestModel templateRequestModel,
            int groupId);
    }
}