using System;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Controllers;
using eFormAPI.Web.Infrastructure.Models.Auth;
using eFormAPI.Web.Infrastructure.Models.DelegatedAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Tests;

[TestFixture]
public class DelegatedSignInControllerTests
{
    private IDelegatedAssertionValidator _validator;
    private IDelegatedSignInService _signIn;
    private DelegatedAccessOptions _options;
    private DelegatedSignInController _controller;

    private static readonly DelegatedAssertion Assertion =
        new("advisor-1", "Advisor", "advisor", "jti-1", DateTimeOffset.UtcNow.AddMinutes(1));

    [SetUp]
    public void SetUp()
    {
        _validator = Substitute.For<IDelegatedAssertionValidator>();
        _signIn = Substitute.For<IDelegatedSignInService>();
        _options = new DelegatedAccessOptions { Enabled = true };
        _controller = new DelegatedSignInController(Options.Create(_options), _validator, _signIn);
    }

    [TearDown]
    public void TearDown() => _controller.Dispose();

    private static int? Status(IActionResult r) => (r as ObjectResult)?.StatusCode;

    private static string Message(IActionResult r) => ((OperationResult)((ObjectResult)r).Value!).Message;

    [Test]
    public async Task Post_DelegatedAccessDisabled_Returns401_AndDoesNotTouchTheUserStore()
    {
        _options.Enabled = false;

        var result = await _controller.SignInDelegated(new DelegatedSignInModel { Assertion = "x" }, CancellationToken.None);

        Assert.That(Status(result), Is.EqualTo(401));
        await _validator.DidNotReceiveWithAnyArgs().ValidateAsync(default!, default);
        await _signIn.DidNotReceiveWithAnyArgs().SignInAsync(default!, default);
    }

    [Test]
    public async Task Post_InvalidAssertion_Returns401()
    {
        _validator.ValidateAsync("bad", Arg.Any<CancellationToken>())
            .Returns(new OperationDataResult<DelegatedAssertion>(false, "DelegatedAssertionRejected"));

        var result = await _controller.SignInDelegated(new DelegatedSignInModel { Assertion = "bad" }, CancellationToken.None);

        Assert.That(Status(result), Is.EqualTo(401));
        Assert.That(Message(result), Is.EqualTo(DelegatedSignInController.RefusedMessage));
        await _signIn.DidNotReceiveWithAnyArgs().SignInAsync(default!, default);
    }

    [Test]
    public async Task Post_MissingBody_Returns401WithoutValidating()
    {
        var result = await _controller.SignInDelegated(null!, CancellationToken.None);

        Assert.That(Status(result), Is.EqualTo(401));
        await _validator.DidNotReceiveWithAnyArgs().ValidateAsync(default!, default);
    }

    [Test]
    public async Task Post_ValidAssertion_ReturnsATokenForTheTenant()
    {
        var payload = new EformAuthorizeResult { FirstName = "A" };
        _validator.ValidateAsync("good", Arg.Any<CancellationToken>())
            .Returns(new OperationDataResult<DelegatedAssertion>(true, "ok", Assertion));
        _signIn.SignInAsync(Assertion, Arg.Any<CancellationToken>())
            .Returns(new OperationDataResult<EformAuthorizeResult>(true, "ok", payload));

        var result = await _controller.SignInDelegated(new DelegatedSignInModel { Assertion = "good" }, CancellationToken.None);

        Assert.That(result, Is.TypeOf<OkObjectResult>());
        var body = (OperationDataResult<EformAuthorizeResult>)((OkObjectResult)result).Value!;
        Assert.That(body.Model, Is.SameAs(payload));
    }

    [Test]
    public async Task Post_AssertionForAnotherTenant_Returns401()
    {
        // The audience check lives in the validator; its refusal must surface as the uniform 401.
        _validator.ValidateAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(new OperationDataResult<DelegatedAssertion>(false, "DelegatedAssertionRejected"));

        var result = await _controller.SignInDelegated(new DelegatedSignInModel { Assertion = "other" }, CancellationToken.None);

        Assert.That(Status(result), Is.EqualTo(401));
        await _signIn.DidNotReceiveWithAnyArgs().SignInAsync(default!, default);
    }

    [Test]
    public async Task Post_SameAssertionTwice_SecondReturns401()
    {
        _validator.ValidateAsync("once", Arg.Any<CancellationToken>())
            .Returns(
                new OperationDataResult<DelegatedAssertion>(true, "ok", Assertion),
                new OperationDataResult<DelegatedAssertion>(false, "DelegatedAssertionRejected"));
        _signIn.SignInAsync(Assertion, Arg.Any<CancellationToken>())
            .Returns(new OperationDataResult<EformAuthorizeResult>(true, "ok", new EformAuthorizeResult()));
        var model = new DelegatedSignInModel { Assertion = "once" };

        var first = await _controller.SignInDelegated(model, CancellationToken.None);
        var second = await _controller.SignInDelegated(model, CancellationToken.None);

        Assert.That(first, Is.TypeOf<OkObjectResult>());
        Assert.That(Status(second), Is.EqualTo(401));
    }

    [Test]
    public async Task Post_EveryRefusal_IsExternallyIndistinguishable()
    {
        _validator.ValidateAsync("a", Arg.Any<CancellationToken>())
            .Returns(new OperationDataResult<DelegatedAssertion>(false, "DelegatedAssertionRejected"));
        _validator.ValidateAsync("b", Arg.Any<CancellationToken>())
            .Returns(new OperationDataResult<DelegatedAssertion>(true, "ok", Assertion));
        _signIn.SignInAsync(Assertion, Arg.Any<CancellationToken>())
            .Returns(new OperationDataResult<EformAuthorizeResult>(false, "something else"));

        var badSignature = await _controller.SignInDelegated(new DelegatedSignInModel { Assertion = "a" }, CancellationToken.None);
        var unknownSubject = await _controller.SignInDelegated(new DelegatedSignInModel { Assertion = "b" }, CancellationToken.None);
        _options.Enabled = false;
        var disabled = await _controller.SignInDelegated(new DelegatedSignInModel { Assertion = "a" }, CancellationToken.None);

        Assert.That(new[] { badSignature, unknownSubject, disabled }.Select(Status), Is.All.EqualTo(401));
        Assert.That(new[] { badSignature, unknownSubject, disabled }.Select(Message),
            Is.All.EqualTo(DelegatedSignInController.RefusedMessage));
    }

    [Test]
    public void Post_NeverAcceptsAssertionInQueryString()
    {
        var method = typeof(DelegatedSignInController).GetMethod(nameof(DelegatedSignInController.SignInDelegated))!;

        var verbs = method.GetCustomAttributes<Microsoft.AspNetCore.Mvc.Routing.HttpMethodAttribute>(true).SelectMany(a => a.HttpMethods).ToList();
        var modelParam = method.GetParameters().First(p => p.ParameterType == typeof(DelegatedSignInModel));

        Assert.That(verbs, Is.EqualTo(new[] { "POST" }));
        Assert.That(modelParam.GetCustomAttribute<FromBodyAttribute>(), Is.Not.Null);
        Assert.That(modelParam.GetCustomAttributes().OfType<IBindingSourceMetadata>()
            .Select(a => a.BindingSource), Is.EqualTo(new[] { BindingSource.Body }));
        Assert.That(method.GetCustomAttribute<AllowAnonymousAttribute>(), Is.Not.Null);
        Assert.That(method.GetCustomAttribute<RouteAttribute>()!.Template, Is.EqualTo("api/auth/delegated"));
    }
}
