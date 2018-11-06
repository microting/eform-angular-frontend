using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.Permissions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions.Security
{
    public interface IPermissionsService
    {
        Task<OperationDataResult<PermissionsModel>> GetGroupPermissions(int groupId);
        Task<OperationResult> UpdatePermissions(PermissionsUpdateModel requestModel);
    }
}