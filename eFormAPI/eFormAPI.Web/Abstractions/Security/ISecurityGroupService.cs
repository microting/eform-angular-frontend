using System.Threading.Tasks;
using eFormAPI.Web.Services.Security;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions.Security
{
    public interface ISecurityGroupService
    {
        Task<OperationResult> CreateSecurityGroup(SecurityGroupCreateModel requestModel);
        Task<OperationDataResult<SecurityGroupModel>> GetSecurityGroup(int id);
        Task<OperationDataResult<SecurityGroupsModel>> GetSecurityGroups(SecurityGroupRequestModel requestModel);
        Task<OperationResult> UpdateSecurityGroup(SecurityGroupUpdateModel requestModel);
        Task<OperationResult> DeleteSecurityGroup(int id);
    }
}