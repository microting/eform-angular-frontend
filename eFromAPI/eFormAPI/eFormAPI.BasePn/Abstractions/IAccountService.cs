using System.Threading.Tasks;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models.Auth;
using eFormAPI.BasePn.Models.Settings.User;
using eFormAPI.BasePn.Models.User;

namespace eFormAPI.BasePn.Abstractions
{
    public interface IAccountService
    {
        Task<OperationResult> ChangePassword(ChangePasswordModel model);
        Task<OperationResult> ForgotPassword(ForgotPasswordModel model);
        Task<UserInfoViewModel> GetUserInfo();
        Task<OperationDataResult<UserSettingsModel>> GetUserSettings();
        Task<OperationResult> ResetAdminPassword(string code);
        Task<OperationResult> ResetPassword(ResetPasswordModel model);
        Task<OperationResult> UpdateUserSettings(UserSettingsModel model);
    }
}