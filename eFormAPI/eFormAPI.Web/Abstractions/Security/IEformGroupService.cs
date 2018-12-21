using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.EformPermissions;
using eFormAPI.Web.Infrastructure.Models.Templates;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions.Security
{
    public interface IEformGroupService
    {
        Task<OperationResult> AddEformToGroup(EformBindGroupModel requestModel);

        Task<OperationDataResult<TemplateListModel>> GetAvailableEforms(TemplateRequestModel templateRequestModel,
            int groupId);

        Task<OperationDataResult<List<EformPermissionsSimpleModel>>> GetEformSimpleInfo();
        Task<OperationResult> UpdateGroupEformPermissions(EformPermissionsModel requestModel);
        Task<OperationDataResult<EformsPermissionsModel>> GetGroupEforms(int groupId);
        Task<OperationResult> DeleteEformFromGroup(int templateId, int groupId);
    }
}