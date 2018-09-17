using System.Threading.Tasks;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models.Common;
using eFormAPI.BasePn.Models.User;

namespace eFormAPI.BasePn.Abstractions
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