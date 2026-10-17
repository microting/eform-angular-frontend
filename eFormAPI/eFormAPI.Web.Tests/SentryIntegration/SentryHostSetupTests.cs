using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using eFormAPI.Web.Hosting.SentryIntegration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NUnit.Framework;
using Sentry;

namespace eFormAPI.Web.Tests.SentryIntegration;

/// <summary>
/// Runs the host's Sentry setup in a real Kestrel pipeline (no database) and records what would be
/// sent. Like Startup, the pipeline has no UseRouting in front of the handlers (for the endpoints behind
/// UseRouting see <see cref="SentryEndpointRoutingTests"/>).
/// </summary>
[TestFixture]
public class SentryHostSetupTests
{
    private const string TraceId = "771a43a4192642f0b136d5159a501700";
    private const string ConnectionString = "Server=db.example.com;Database=420_Angular;User Id=example;";
    private const string UserId = "42";
    private const string UserEmail = "jane.doe@example.org";
    private const string Secret = "not-a-real-secret";

    private string _disableSentry;
    private RecordingSentryTransport _hostTransport;
    private RecordingSentryTransport _pluginTransport;
    private RecordingSentryTransport _strayTransport;
    private FakePluginAssembly _plugin;
    private WebApplication _app;
    private HttpClient _http;

    [OneTimeSetUp]
    public async Task StartHost()
    {
        _disableSentry = Environment.GetEnvironmentVariable("DISABLE_SENTRY");
        Environment.SetEnvironmentVariable("DISABLE_SENTRY", null);

        _hostTransport = new RecordingSentryTransport();
        _pluginTransport = new RecordingSentryTransport();
        _plugin = new FakePluginAssembly(RecordingSentryTransport.PluginDsn);
        SentryPluginRouter.Register(_plugin.Assembly, o => o.Transport = _pluginTransport);

        var builder = WebApplication.CreateBuilder();
        builder.WebHost.UseUrls("http://127.0.0.1:0");
        builder.WebHost.UseSentry(options =>
        {
            SentryHostSetup.Configure(options, ConnectionString);
            options.Dsn = RecordingSentryTransport.HostDsn;
            options.Transport = _hostTransport;
            options.AutoSessionTracking = false;
        });

        // What plugins still do while Startup.ConfigureServices runs: a static Init with their own DSN
        // in global mode. The hub UseSentry creates when the host is built must replace it.
        _strayTransport = new RecordingSentryTransport();
        SentrySdk.Init(options =>
        {
            options.Dsn = "https://straykey@o1.ingest.example.com/999";
            options.IsGlobalModeEnabled = true;
            options.AutoSessionTracking = false;
            options.Transport = _strayTransport;
        });

        _app = builder.Build();

        // Stands in for UseAuthentication: an anonymous request unless the test asks for a user.
        _app.Use(async (context, next) =>
        {
            if (context.Request.Path != "/api/anonymous/unhandled")
            {
                context.User = new ClaimsPrincipal(new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.NameIdentifier, UserId),
                    new Claim(ClaimTypes.Email, UserEmail)
                ], "Test"));
            }

            await next();
        });
        _app.UseSentryHost();
        _app.Run(context =>
        {
            var loggers = context.RequestServices.GetRequiredService<ILoggerFactory>();
            switch (context.Request.Path.Value)
            {
                case "/api/scope/tag":
                    SentrySdk.ConfigureScope(scope => scope.SetTag("leak", "from another request"));
                    break;
                case "/api/host/unhandled":
                case "/api/anonymous/unhandled":
                case "/api/files/report.png&token=" + Secret:
                    throw new InvalidOperationException("boom in host");
                case "/api/plugin/unhandled":
                    _plugin.Fail();
                    break;
                case "/api/log":
                    loggers.CreateLogger("eFormAPI.Web.Services.SitesService").LogInformation("host information");
                    loggers.CreateLogger("eFormAPI.Web.Services.SitesService").LogError("host error");
                    loggers.CreateLogger("Microsoft.EntityFrameworkCore.Database.Command")
                        .LogInformation("framework information");
                    loggers.CreateLogger("Microsoft.EntityFrameworkCore.Database.Command")
                        .LogWarning("framework warning");
                    break;
            }

            return Task.CompletedTask;
        });
        await _app.StartAsync();
        _http = new HttpClient { BaseAddress = new Uri(_app.Urls.First()) };
    }

    [OneTimeTearDown]
    public async Task StopHost()
    {
        _http?.Dispose();
        if (_app != null)
        {
            await _app.StopAsync();
            await _app.DisposeAsync();
        }

        SentrySdk.Close();
        Environment.SetEnvironmentVariable("DISABLE_SENTRY", _disableSentry);
    }

    /// <summary>
    /// Sends a request the way the Angular frontend does: with its trace headers, which mark the trace
    /// as sampled (the worst case - a frontend that still records spans).
    /// </summary>
    private async Task Get(string path, bool withTraceHeaders = true)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, path);
        request.Headers.Add("Authorization", "Bearer " + Secret);
        request.Headers.Add("Cookie", "session=" + Secret);
        if (withTraceHeaders)
        {
            request.Headers.Add("sentry-trace", TraceId + "-b72fa28504b07285-1");
            request.Headers.Add("baggage",
                $"sentry-trace_id={TraceId},sentry-public_key=frontendkey,sentry-sample_rate=1,sentry-sampled=true");
        }

        using var response = await _http.SendAsync(request);
        await SentrySdk.FlushAsync(TimeSpan.FromSeconds(5));
        await SentryPluginRouter.FlushAsync(TimeSpan.FromSeconds(5));
    }

    private static IEnumerable<T> ForPath<T>(IEnumerable<T> items, Func<T, string> url, string path) =>
        items.Where(x => url(x)?.Contains(path) == true);

    private static string EventUrl(RecordingSentryTransport.Item item) =>
        item.Body.Get("request", "url");

    private static void AssertTraceUserAndHostTags(RecordingSentryTransport.Item item)
    {
        Assert.Multiple(() =>
        {
            Assert.That(item.Body.Get("contexts", "trace", "trace_id"),
                Is.EqualTo(TraceId), "frontend trace id");
            Assert.That(item.Body.Get("user", "id"), Is.EqualTo(UserId));
            Assert.That(item.Body.Get("user", "email"), Is.EqualTo(UserEmail));
            Assert.That(item.Body.Get("tags", "customerNo"), Is.EqualTo("420"));
            Assert.That(item.Body.Get("tags", "osVersion"), Is.Not.Empty);
            Assert.That(item.Body.Get("tags", "osArchitecture"), Is.Not.Empty);
            Assert.That(item.Body.Get("tags", "osName"), Is.Not.Empty);
        });
    }

    [Test]
    public async Task HostError_GoesToTheHostProject_WithFrontendTraceUserAndHostTags()
    {
        await Get("/api/host/unhandled");

        var events = ForPath(_hostTransport.Events, EventUrl, "/api/host/unhandled").ToList();
        Assert.That(events, Is.Not.Empty);
        AssertTraceUserAndHostTags(events[0]);
        Assert.That(ForPath(_pluginTransport.Events, EventUrl, "/api/host/unhandled"), Is.Empty);
    }

    [Test]
    public async Task PluginError_GoesToThePluginProjectOnly_WithFrontendTraceUserAndHostTags()
    {
        await Get("/api/plugin/unhandled");

        var events = ForPath(_pluginTransport.Events, EventUrl, "/api/plugin/unhandled").ToList();
        Assert.That(events, Is.Not.Empty);
        AssertTraceUserAndHostTags(events[0]);
        Assert.That(events[0].Body.Get("tags", "plugin"), Is.EqualTo(_plugin.Name));
        Assert.That(ForPath(_hostTransport.Events, EventUrl, "/api/plugin/unhandled"), Is.Empty);
    }

    [TestCase("/api/sites/index")]
    [TestCase("/healtz")]
    [TestCase("/some/spa/route")]
    public async Task Request_RecordsNoTransaction_EvenWhenTheFrontendSampledTheTrace(string path)
    {
        await Get(path);

        // Not filtered by path: no test of this fixture may produce a transaction.
        Assert.That(_hostTransport.Transactions, Is.Empty);
    }

    [Test]
    public async Task RequestWithoutTraceHeaders_RecordsNoTransaction_AndItsErrorGetsATraceOfItsOwn()
    {
        await Get("/api/host/unhandled?without-trace-headers=1", withTraceHeaders: false);

        var hostEvent = _hostTransport.Events
            .Single(x => x.Body.Get("request", "query_string")?.Contains("without-trace-headers") == true);
        Assert.That(hostEvent.Body.Get("contexts", "trace", "trace_id"), Is.Not.Empty.And.Not.EqualTo(TraceId));
        Assert.That(_hostTransport.Transactions, Is.Empty);
    }

    [Test]
    public async Task SampledFrontendTrace_IsContinuedOnErrorsAndLogs_WithoutATransaction()
    {
        await Get("/api/host/unhandled?continued=1");
        await Get("/api/log?continued=1");

        var hostEvent = _hostTransport.Events
            .Single(x => x.Body.Get("request", "query_string")?.Contains("continued") == true);
        Assert.Multiple(() =>
        {
            Assert.That(hostEvent.Body.Get("contexts", "trace", "trace_id"), Is.EqualTo(TraceId));
            Assert.That(_hostTransport.Logs.Where(x => x.Get("body") == "host error").Select(x => x.Get("trace_id")),
                Has.Some.EqualTo(TraceId));
            Assert.That(_hostTransport.Transactions, Is.Empty);
        });
    }

    [Test]
    public async Task StaticInitBeforeTheHostWasBuilt_DoesNotSurvive_TheHostHubServesRequests()
    {
        await Get("/api/scope/tag");
        await Get("/api/host/unhandled?after-scope-tag=1");

        Assert.That(_strayTransport.Events.Concat(_strayTransport.Transactions), Is.Empty,
            "nothing may reach the DSN of the earlier static Init");
        var hostEvent = _hostTransport.Events
            .Single(x => x.Body.Get("request", "query_string")?.Contains("after-scope-tag") == true);
        Assert.That(hostEvent.Body.Get("tags", "leak"), Is.Null,
            "scopes must be per request - the earlier Init's global mode must be gone");
        Assert.That(hostEvent.Body.Get("tags", "customerNo"), Is.EqualTo("420"));
    }

    [Test]
    public async Task Logs_CarryFrontendTraceUserAndCustomerNo_AndFrameworkNoiseIsDropped()
    {
        await Get("/api/log");

        string Attribute(JsonElement log, string name) =>
            log.Get("attributes", name, "value");

        var logs = _hostTransport.Logs;
        var bodies = logs.Select(x => x.Get("body")).ToList();
        Assert.That(bodies, Does.Contain("host information"));
        Assert.That(bodies, Does.Contain("host error"));
        Assert.That(bodies, Does.Contain("framework warning"));
        Assert.That(bodies, Does.Not.Contain("framework information"));
        Assert.That(logs.Where(x => Attribute(x, "category.name")?.StartsWith("Microsoft.AspNetCore") == true &&
                                    x.Get("level") == "info"), Is.Empty,
            "the framework's own per-request logs");

        // First, not Single: another test requests /api/log as well.
        var log = logs.First(x => x.Get("body") == "host information");
        Assert.Multiple(() =>
        {
            Assert.That(log.Get("trace_id"), Is.EqualTo(TraceId));
            Assert.That(Attribute(log, "user.id"), Is.EqualTo(UserId));
            Assert.That(Attribute(log, "customerNo"), Is.EqualTo("420"));
        });
    }

    [Test]
    public async Task LogError_IsNotTurnedIntoAnEvent()
    {
        await Get("/api/log");

        Assert.That(ForPath(_hostTransport.Events, EventUrl, "/api/log"), Is.Empty);
    }

    [Test]
    public async Task OutsideAnyHttpRequest_EventIsDelivered_ButAnExplicitlySampledTransactionIsNot()
    {
        // Background work: no HTTP request, so the request data is empty. A plugin starting a
        // transaction itself, even one marked as sampled, must not send it.
        SentrySdk.CaptureMessage("captured outside a request");
        var transaction = SentrySdk.StartTransaction(
            new TransactionContext("background work outside a request", "task", isSampled: true));
        transaction.StartChild("db.query").Finish();
        transaction.Finish();
        await SentrySdk.FlushAsync(TimeSpan.FromSeconds(5));

        var events = _hostTransport.Events
            .Where(x => x.Body.Get("logentry", "message") == "captured outside a request").ToList();
        Assert.That(events, Has.Count.EqualTo(1));
        // A throwing BeforeSend does not drop the item: the SDK sends it unredacted with a breadcrumb.
        Assert.That(events[0].Body.GetRawText(), Does.Not.Contain("callback failed"));
        Assert.That(transaction.IsSampled, Is.False);
        Assert.That(_hostTransport.Transactions, Is.Empty);
    }

    [Test]
    public async Task Credentials_AreRedactedFromEverythingThatIsSent()
    {
        await Get("/api/host/unhandled?token=" + Secret + "&page=1");
        await Get("/api/plugin/unhandled?token=" + Secret);
        // Some file routes carry the token inside the path.
        await Get("/api/files/report.png&token=" + Secret);
        await Get("/api/log?token=" + Secret);

        var sent = _hostTransport.Events.Concat(_pluginTransport.Events)
            .Select(x => x.Body.GetRawText())
            .Concat(_hostTransport.Logs.Select(x => x.GetRawText()))
            .ToList();
        Assert.That(sent, Has.Count.GreaterThanOrEqualTo(6));
        Assert.That(sent, Has.None.Contains(Secret));
        Assert.That(_hostTransport.Events.Select(x => x.Body.Get("request", "query_string")),
            Has.Some.EqualTo("?token=***&page=1"), "only the token value is removed");
        Assert.That(_hostTransport.Events.Select(EventUrl), Has.Some.EndsWith("/api/files/report.png&token=***"));
    }

    [Test]
    public async Task AnonymousRequest_DoesNotGetAnAuthenticatedUser()
    {
        await Get("/api/anonymous/unhandled");

        var events = ForPath(_hostTransport.Events, EventUrl, "/api/anonymous/unhandled").ToList();
        Assert.That(events, Has.Count.EqualTo(1));
        // The SDK falls back to its installation id, so the id is not empty - but it is not a user's.
        Assert.That(events[0].Body.Get("user", "id"), Is.Not.EqualTo(UserId));
        Assert.That(events[0].Body.Get("user", "email"), Is.Null);
    }

    [TestCase("Server=db.example.com;Database=420_Angular;", "420")]
    [TestCase("...", null)]
    [TestCase(null, null)]
    public void GetHostTags_ReadsTheCustomerNoFromTheConnectionString(string connectionString, string expected)
    {
        SentryHostSetup.GetHostTags(connectionString).TryGetValue("customerNo", out var customerNo);

        Assert.That(customerNo, Is.EqualTo(expected));
    }

    [TestCase("true", true)]
    [TestCase("TRUE", true)]
    [TestCase("1", true)]
    [TestCase("false", false)]
    [TestCase("", false)]
    public void IsDisabled_FollowsTheDisableSentryEnvironmentVariable(string value, bool expected)
    {
        Environment.SetEnvironmentVariable("DISABLE_SENTRY", value);
        try
        {
            Assert.That(SentryHostSetup.IsDisabled(), Is.EqualTo(expected));
        }
        finally
        {
            Environment.SetEnvironmentVariable("DISABLE_SENTRY", null);
        }
    }

    [Test]
    public async Task DisableSentry_MakesTheHostIntegrationInert()
    {
        Environment.SetEnvironmentVariable("DISABLE_SENTRY", "true");
        try
        {
            var plugin = new FakePluginAssembly(RecordingSentryTransport.PluginDsn);
            SentryHostSetup.RegisterPlugins([plugin.Assembly]);
            var sentryEvent = new SentryEvent(plugin.CatchFailure());
            Assert.That(SentryPluginRouter.BeforeSend(sentryEvent, new SentryHint()), Is.SameAs(sentryEvent),
                "the plugin must not have been registered");

            var transport = new RecordingSentryTransport();
            SentryHostSetup.ReportStartupCrash(new InvalidOperationException("boom"), ConnectionString,
                o => o.Transport = transport);
            Assert.That(transport.Events, Is.Empty);

            // No UseSentry, so none of the Sentry services exist: UseSentryHost must not need them.
            var builder = WebApplication.CreateBuilder();
            builder.WebHost.UseUrls("http://127.0.0.1:0");
            await using var app = builder.Build();
            app.UseSentryHost();
            app.Run(context => context.Response.WriteAsync("ok"));
            await app.StartAsync();
            using var http = new HttpClient { BaseAddress = new Uri(app.Urls.First()) };
            Assert.That(await http.GetStringAsync("/api/anything"), Is.EqualTo("ok"));
            await app.StopAsync();
        }
        finally
        {
            Environment.SetEnvironmentVariable("DISABLE_SENTRY", null);
        }
    }

    [Test]
    public void RegisterPlugins_RegistersEveryAssemblyWithTheRouter()
    {
        var plugin = new FakePluginAssembly(RecordingSentryTransport.PluginDsn);

        SentryHostSetup.RegisterPlugins([plugin.Assembly], o => o.Transport = _pluginTransport);

        Assert.That(SentryPluginRouter.BeforeSend(new SentryEvent(plugin.CatchFailure()), new SentryHint()), Is.Null);
    }

    [Test]
    public void ReportStartupCrash_SendsTheExceptionWithTheHostTags()
    {
        var transport = new RecordingSentryTransport();

        SentryHostSetup.ReportStartupCrash(new InvalidOperationException("boom at startup"), ConnectionString,
            o => o.Transport = transport);

        Assert.That(transport.Events, Has.Count.EqualTo(1));
        var body = transport.Events[0].Body;
        Assert.That(body.GetProperty("exception").GetProperty("values")[0].GetProperty("value").GetString(),
            Is.EqualTo("boom at startup"));
        Assert.That(body.Get("tags", "osName"), Is.Not.Empty);
        Assert.That(body.Get("tags", "customerNo"), Is.EqualTo("420"));
    }
}
