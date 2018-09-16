using System.Threading.Tasks;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Auth;

namespace eFormAPI.Core.Abstractions
{
    public interface IAuthService
    {
        Task<OperationResult> DeleteGoogleAuthenticatorInfo();
        Task<OperationDataResult<GoogleAuthenticatorModel>> GetGoogleAuthenticator(LoginModel loginModel);
        Task<OperationDataResult<GoogleAuthInfoModel>> GetGoogleAuthenticatorInfo();
        Task<OperationResult> LogOut();
        OperationDataResult<bool> TwoFactorAuthForceInfo();
        Task<OperationResult> UpdateGoogleAuthenticatorInfo(GoogleAuthInfoModel requestModel);
    }
}