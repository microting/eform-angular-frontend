using System.Threading.Tasks;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Auth;
using eFormAPI.Common.Models.Settings.User;
using eFormAPI.Common.Models.User;

namespace eFormAPI.Core.Abstractions
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