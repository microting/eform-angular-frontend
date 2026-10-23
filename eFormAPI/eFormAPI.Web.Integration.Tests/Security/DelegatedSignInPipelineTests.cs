using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Controllers;
using eFormAPI.Web.Infrastructure.Models.DelegatedAccess;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using NSubstitute;
using NUnit.Framework;
using System.Text.Encodings.Web;

namespace eFormAPI.Web.Integration.Tests.Security;

/// <summary>
/// The delegated sign-in route through the real MVC pipeline (legacy routing, as Startup
/// sets EnableEndpointRouting=false) with a deny-by-default authentication scheme, so
/// [Authorize]/[AllowAnonymous], verb routing and JSON binding are exercised for real.
/// The validator and sign-in service are substitutes; everything else is the actual stack.
/// </summary>
[TestFixture]
public class DelegatedSignInPipelineTests
{
    private IHost _host;
    private HttpClient _client;
    private IDelegatedAssertionValidator _validator;

    [SetUp]
    public async Task SetUp()
    {
        _validator = Substitute.For<IDelegatedAssertionValidator>();
        _validator.ValidateAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(new OperationDataResult<DelegatedAssertion>(false, "DelegatedAssertionRejected"));

        _host = await new HostBuilder()
            .ConfigureWebHost(web => web
                .UseTestServer()
                .ConfigureServices(services =>
                {
                    services.AddLogging();
                    services.AddAuthentication("Deny").AddScheme<AuthenticationSchemeOptions, DenyHandler>("Deny", _ => { });
                    services.AddAuthorization();
                    services.AddMvc(o => o.EnableEndpointRouting = false)
                        .AddApplicationPart(typeof(DelegatedSignInController).Assembly)
                        .AddControllersAsServices();
                    services.AddSingleton<IOptionsMonitor<DelegatedAccessOptions>>(
                        new TestMonitor(new DelegatedAccessOptions { Enabled = true }));
                    services.AddSingleton(_validator);
                    services.AddSingleton(Substitute.For<IDelegatedSignInService>());
                })
                .Configure(app =>
                {
                    app.UseAuthentication();
                    app.UseMvc();
                }))
            .StartAsync();
        _client = _host.GetTestClient();
    }

    [TearDown]
    public async Task TearDown()
    {
        _client.Dispose();
        await _host.StopAsync();
        _host.Dispose();
    }

    [Test]
    public async Task Post_AnonymousJunkAssertion_Returns401WithTheUniformMessage()
    {
        var response = await _client.PostAsync("api/auth/delegated",
            new StringContent("{\"assertion\":\"junk\"}", Encoding.UTF8, "application/json"));
        var body = await response.Content.ReadAsStringAsync();

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.Unauthorized));
        Assert.That(body, Does.Contain("DelegatedSignInRefused"));
        await _validator.Received(1).ValidateAsync("junk", Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task Get_WithAssertionInQueryString_IsNotRoutedAndNeverValidates()
    {
        var response = await _client.GetAsync("api/auth/delegated?assertion=junk");

        // Legacy (non-endpoint) routing reports a verb mismatch as 404, endpoint routing as 405.
        Assert.That(response.StatusCode, Is.AnyOf(HttpStatusCode.MethodNotAllowed, HttpStatusCode.NotFound));
        await _validator.DidNotReceiveWithAnyArgs().ValidateAsync(default, default);
    }

    private sealed class TestMonitor(DelegatedAccessOptions value) : IOptionsMonitor<DelegatedAccessOptions>
    {
        public DelegatedAccessOptions CurrentValue => value;
        public DelegatedAccessOptions Get(string name) => value;
        public System.IDisposable OnChange(System.Action<DelegatedAccessOptions, string> listener) => null;
    }

    private sealed class DenyHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> o, ILoggerFactory l, UrlEncoder e)
        : AuthenticationHandler<AuthenticationSchemeOptions>(o, l, e)
    {
        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
            => Task.FromResult(AuthenticateResult.NoResult());
    }
}
