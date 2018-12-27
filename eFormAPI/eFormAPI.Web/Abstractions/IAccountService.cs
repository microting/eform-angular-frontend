using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.Settings.User;
using eFormAPI.Web.Infrastructure.Models.Users;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;

namespace eFormAPI.Web.Abstractions
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