using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;

namespace eFormAPI.Web.Abstractions
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