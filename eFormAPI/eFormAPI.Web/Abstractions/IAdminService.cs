using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.Users;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

namespace eFormAPI.Web.Abstractions
{
    public interface IAdminService
    {
        Task<OperationResult> CreateUser(UserRegisterModel userRegisterModel);
        Task<OperationResult> DeleteUser(int userId);
        OperationResult DisableTwoFactorAuthForce();
        OperationResult EnableTwoFactorAuthForce();
        OperationDataResult<UserInfoModelList> GetAllUsers(PaginationModel paginationModel);
        Task<OperationDataResult<UserRegisterModel>> GetUser(int userId);
        Task<OperationResult> UpdateUser(UserRegisterModel userRegisterModel);
    }
}