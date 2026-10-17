using System;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Grpc;
using Grpc.Core;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;

namespace eFormAPI.Web.Services.GrpcServices;

public class EformAuthGrpcService : Grpc.EformAuthService.EformAuthServiceBase
{
    private readonly IAuthService _authService;

    public EformAuthGrpcService(IAuthService authService)
    {
        _authService = authService;
    }

    public override async Task<AuthenticateUserResponse> AuthenticateUser(
        AuthenticateUserRequest request, ServerCallContext context)
    {
        try
        {
            var loginModel = new LoginModel
            {
                Username = request.Username,
                Password = request.Password
            };

            var result = await _authService.AuthenticateUser(loginModel);

            var response = new AuthenticateUserResponse
            {
                Success = result.Success,
                Message = result.Message ?? ""
            };

            if (result.Success && result.Model != null)
            {
                response.Model = new AuthUserModel
                {
                    AccessToken = result.Model.AccessToken ?? "",
                    FirstName = result.Model.FirstName ?? "",
                    LastName = result.Model.LastName ?? ""
                };
            }

            return response;
        }
        catch (Exception ex)
        {
            return new AuthenticateUserResponse
            {
                Success = false,
                Message = ex.Message
            };
        }
    }

    public override async Task<RefreshTokenResponse> RefreshToken(
        RefreshTokenRequest request, ServerCallContext context)
    {
        try
        {
            var result = await _authService.RefreshToken();

            var response = new RefreshTokenResponse
            {
                Success = result.Success,
                Message = result.Message ?? ""
            };

            if (result.Success && result.Model != null)
            {
                response.Model = new AuthUserModel
                {
                    AccessToken = result.Model.AccessToken ?? "",
                    FirstName = result.Model.FirstName ?? "",
                    LastName = result.Model.LastName ?? ""
                };
            }

            return response;
        }
        catch (Exception ex)
        {
            return new RefreshTokenResponse
            {
                Success = false,
                Message = ex.Message
            };
        }
    }
}
