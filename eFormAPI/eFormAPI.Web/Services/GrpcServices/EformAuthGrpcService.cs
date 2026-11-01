using System;
using System.Threading;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Grpc;
using eFormAPI.Web.Hosting.Security;
using Grpc.Core;
using Microsoft.AspNetCore.Http;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;

namespace eFormAPI.Web.Services.GrpcServices;

public class EformAuthGrpcService : Grpc.EformAuthService.EformAuthServiceBase
{
    private readonly IAuthService _authService;
    private readonly LoginRateLimit _loginRateLimit;

    public EformAuthGrpcService(IAuthService authService, LoginRateLimit loginRateLimit)
    {
        _authService = authService;
        _loginRateLimit = loginRateLimit;
    }

    public override async Task<AuthenticateUserResponse> AuthenticateUser(
        AuthenticateUserRequest request, ServerCallContext context)
    {
        // Same brake as POST /api/auth/token, answered with a gRPC status instead of HTTP 429.
        var httpContext = HttpContextOf(context);
        var key = httpContext == null ? null : _loginRateLimit.ClientKey(httpContext);
        if (!_loginRateLimit.TryBegin(key, out var attempt, out var retryAfter))
        {
            var seconds = (int)Math.Ceiling(retryAfter.TotalSeconds);
            // retry-after (seconds) in the trailers, like the REST Retry-After header.
            throw new RpcException(
                new Status(StatusCode.ResourceExhausted, $"Too many failed logins; try again in {seconds} seconds"),
                new Metadata { { "retry-after", seconds.ToString() } });
        }

        var failed = true; // unless the call completes with a non-failure
        try
        {
            var response = await Authenticate(request, context.CancellationToken);
            // A returned failed result counts even if the client cancelled afterwards: the password was checked,
            // and not counting it would let a client buy unlimited password hashing by cancelling every call.
            failed = response.failed;
            return response.response;
        }
        finally
        {
            attempt.End(failed);
        }
    }

    private static HttpContext HttpContextOf(ServerCallContext context)
    {
        try
        {
            return context.GetHttpContext();
        }
        catch (InvalidOperationException)
        {
            return null; // not hosted by ASP.NET Core (unit tests): nothing to key on
        }
    }

    private async Task<(AuthenticateUserResponse response, bool failed)> Authenticate(AuthenticateUserRequest request,
        CancellationToken callCancelled)
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

            return (response, LoginRateLimit.CountsAsFailure(result, loginModel.Code));
        }
        catch (Exception ex)
        {
            // Counted: the service may have checked the password before it threw — unless the call was cancelled
            // and ended before any result existed (it went away; not a guess), as on the REST path.
            var cancelledBeforeAResult = ex is OperationCanceledException && callCancelled.IsCancellationRequested;
            return (new AuthenticateUserResponse
            {
                Success = false,
                Message = ex.Message
            }, !cancelledBeforeAResult);
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
