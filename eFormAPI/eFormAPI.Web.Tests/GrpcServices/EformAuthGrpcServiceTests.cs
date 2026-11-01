using System;
using System.Net;
using System.Threading.Tasks;
using eFormAPI.Web.Hosting.Security;
using Grpc.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Grpc;
using eFormAPI.Web.Infrastructure.Models.Auth;
using eFormAPI.Web.Services.GrpcServices;
using eFormAPI.Web.Tests.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Tests.GrpcServices;

[TestFixture]
public class EformAuthGrpcServiceTests
{
    private IAuthService _authService;
    private EformAuthGrpcService _grpcService;
    private LoginRateLimit _loginRateLimit;

    [SetUp]
    public void SetUp()
    {
        _authService = Substitute.For<IAuthService>();
        _loginRateLimit = new LoginRateLimit(
            Options.Create(new LoginRateLimitOptions { FailedAttemptsPerMinute = 3 }), TimeProvider.System);
        _grpcService = new EformAuthGrpcService(_authService, _loginRateLimit);
    }

    [Test]
    public async Task AuthenticateUser_Success_ReturnsTokenAndUser()
    {
        _authService.AuthenticateUser(Arg.Any<LoginModel>())
            .Returns(new OperationDataResult<EformAuthorizeResult>(
                true, "OK", new EformAuthorizeResult
                {
                    AccessToken = "jwt-token-abc",
                    FirstName = "John",
                    LastName = "Doe"
                }));

        var request = new AuthenticateUserRequest
        {
            Username = "user@test.com",
            Password = "password123"
        };

        var response = await _grpcService.AuthenticateUser(
            request, TestServerCallContextFactory.Create());

        Assert.That(response.Success, Is.True);
        Assert.That(response.Model, Is.Not.Null);
        Assert.That(response.Model.AccessToken, Is.EqualTo("jwt-token-abc"));
        Assert.That(response.Model.FirstName, Is.EqualTo("John"));
        Assert.That(response.Model.LastName, Is.EqualTo("Doe"));

        await _authService.Received(1).AuthenticateUser(
            Arg.Is<LoginModel>(m => m.Username == "user@test.com" && m.Password == "password123"));
    }

    [Test]
    public async Task AuthenticateUser_Failure_ReturnsError()
    {
        _authService.AuthenticateUser(Arg.Any<LoginModel>())
            .Returns(new OperationDataResult<EformAuthorizeResult>(
                false, "Invalid credentials"));

        var request = new AuthenticateUserRequest
        {
            Username = "user@test.com",
            Password = "wrong"
        };

        var response = await _grpcService.AuthenticateUser(
            request, TestServerCallContextFactory.Create());

        Assert.That(response.Success, Is.False);
        Assert.That(response.Message, Is.EqualTo("Invalid credentials"));
        Assert.That(response.Model, Is.Null);
    }

    [Test]
    public async Task RefreshToken_Success_ReturnsNewToken()
    {
        _authService.RefreshToken()
            .Returns(new OperationDataResult<EformAuthorizeResult>(
                true, "OK", new EformAuthorizeResult
                {
                    AccessToken = "refreshed-token-xyz",
                    FirstName = "Jane",
                    LastName = "Smith"
                }));

        var response = await _grpcService.RefreshToken(
            new RefreshTokenRequest(), TestServerCallContextFactory.Create());

        Assert.That(response.Success, Is.True);
        Assert.That(response.Model, Is.Not.Null);
        Assert.That(response.Model.AccessToken, Is.EqualTo("refreshed-token-xyz"));
        Assert.That(response.Model.FirstName, Is.EqualTo("Jane"));
        Assert.That(response.Model.LastName, Is.EqualTo("Smith"));
    }

    [Test]
    public async Task RefreshToken_Failure_ReturnsError()
    {
        _authService.RefreshToken()
            .Returns(new OperationDataResult<EformAuthorizeResult>(
                false, "Token expired"));

        var response = await _grpcService.RefreshToken(
            new RefreshTokenRequest(), TestServerCallContextFactory.Create());

        Assert.That(response.Success, Is.False);
        Assert.That(response.Message, Is.EqualTo("Token expired"));
        Assert.That(response.Model, Is.Null);
    }

    private static ServerCallContext CallFrom(string ip)
    {
        var context = TestServerCallContextFactory.Create();
        var http = new DefaultHttpContext();
        http.Connection.RemoteIpAddress = IPAddress.Parse(ip);
        context.UserState["__HttpContext"] = http; // where Grpc.AspNetCore exposes the HttpContext
        return context;
    }

    private static AuthenticateUserRequest Login() => new() { Username = "someone@example.com", Password = "x" };

    [Test]
    public async Task AuthenticateUser_FailedLogins_AreBraked_WithResourceExhausted()
    {
        _authService.AuthenticateUser(Arg.Any<LoginModel>())
            .Returns(new OperationDataResult<EformAuthorizeResult>(false, "Invalid credentials"));

        for (var i = 0; i < 3; i++)
            Assert.That((await _grpcService.AuthenticateUser(Login(), CallFrom("203.0.113.5"))).Success, Is.False);

        var ex = await Assert.ThrowsAsync<RpcException>(() => _grpcService.AuthenticateUser(Login(), CallFrom("203.0.113.5")));
        Assert.That(ex!.StatusCode, Is.EqualTo(StatusCode.ResourceExhausted));
        await _authService.Received(3).AuthenticateUser(Arg.Any<LoginModel>());

        // Another client is not affected.
        Assert.That((await _grpcService.AuthenticateUser(Login(), CallFrom("203.0.113.6"))).Message,
            Is.EqualTo("Invalid credentials"));
    }

    [Test]
    public async Task AuthenticateUser_SuccessesAndSecondFactorRequired_AreNotCounted()
    {
        _authService.AuthenticateUser(Arg.Any<LoginModel>())
            .Returns(new OperationDataResult<EformAuthorizeResult>(true, "OK", new EformAuthorizeResult()));
        for (var i = 0; i < 10; i++)
            Assert.That((await _grpcService.AuthenticateUser(Login(), CallFrom("203.0.113.5"))).Success, Is.True);

        _authService.AuthenticateUser(Arg.Any<LoginModel>()).Returns(new SecondFactorRequiredResult("PSK or code is empty"));
        for (var i = 0; i < 10; i++)
            Assert.That((await _grpcService.AuthenticateUser(Login(), CallFrom("203.0.113.5"))).Success, Is.False);
    }

    [Test]
    public async Task AuthenticateUser_ExceptionInTheService_IsNotCounted_AndReleasesTheSlot()
    {
        _authService.AuthenticateUser(Arg.Any<LoginModel>()).Returns<OperationDataResult<EformAuthorizeResult>>(
            _ => throw new InvalidOperationException("db down"));
        for (var i = 0; i < 10; i++)
            Assert.That((await _grpcService.AuthenticateUser(Login(), CallFrom("203.0.113.5"))).Message, Is.EqualTo("db down"));
    }
}
