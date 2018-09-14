using System.Threading.Tasks;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Common;
using eFormAPI.Common.Models.User;

namespace eFormAPI.Core.Abstractions
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