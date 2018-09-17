using System.Threading.Tasks;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models.Auth;

namespace eFormAPI.BasePn.Abstractions
{
    public interface IAuthService
    {
        Task<OperationDataResult<AuthorizeResult>> AuthenticateUser(LoginModel model);
        Task<OperationResult> DeleteGoogleAuthenticatorInfo();
        Task<OperationDataResult<GoogleAuthenticatorModel>> GetGoogleAuthenticator(LoginModel loginModel);
        Task<OperationDataResult<GoogleAuthInfoModel>> GetGoogleAuthenticatorInfo();
        Task<OperationResult> LogOut();
        OperationDataResult<bool> TwoFactorAuthForceInfo();
        Task<OperationResult> UpdateGoogleAuthenticatorInfo(GoogleAuthInfoModel requestModel);
    }
}