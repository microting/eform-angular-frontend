using System;
using System.Threading.Tasks;
using eFormAPI.Web.Hosting.SentryIntegration;
using NUnit.Framework;
using Sentry;

namespace eFormAPI.Web.Tests.SentryIntegration;

[TestFixture]
public class SentryPluginRouterTests
{
    private const string HostDsn = RecordingSentryTransport.HostDsn;
    private const string PluginDsn = RecordingSentryTransport.PluginDsn;
    private static readonly TimeSpan FlushTimeout = TimeSpan.FromSeconds(5);

    private RecordingSentryTransport _hostTransport;
    private RecordingSentryTransport _pluginTransport;
    private SentryClient _hostClient;
    private SentryOptions _hostOptions;

    [SetUp]
    public void SetUp()
    {
        _hostTransport = new RecordingSentryTransport();
        _pluginTransport = new RecordingSentryTransport();
        _hostOptions = new SentryOptions
        {
            Dsn = HostDsn,
            Release = "eFormAPI.Web@9.9.9",
            AutoSessionTracking = false,
            Transport = _hostTransport
        };
        _hostOptions.SetBeforeSend(SentryPluginRouter.BeforeSend);
        _hostClient = new SentryClient(_hostOptions);
    }

    [TearDown]
    public void TearDown() => _hostClient.Dispose();

    private FakePluginAssembly RegisteredPlugin()
    {
        var plugin = new FakePluginAssembly(PluginDsn);
        Assert.That(SentryPluginRouter.Register(plugin.Assembly, o => o.Transport = _pluginTransport), Is.True);
        return plugin;
    }

    private async Task Flush()
    {
        await _hostClient.FlushAsync(FlushTimeout);
        await SentryPluginRouter.FlushAsync(FlushTimeout);
    }

    [Test]
    public async Task PluginException_IsSentThroughThePluginClient_WithTheSameIdTraceUserAndTags()
    {
        var plugin = RegisteredPlugin();
        var traceId = SentryId.Create();
        var sentryEvent = new SentryEvent(plugin.CatchFailure());
        sentryEvent.Contexts.Trace.TraceId = traceId;
        var scope = new Scope(_hostOptions)
        {
            User = new SentryUser { Id = "42", Email = "jane.doe@example.org" }
        };
        scope.SetTag("customerNo", "420");

        _hostClient.CaptureEvent(sentryEvent, scope);
        await Flush();

        Assert.That(_hostTransport.Events, Is.Empty, "the event must not also be stored in the host project");
        Assert.That(_pluginTransport.Events, Has.Count.EqualTo(1));
        var body = _pluginTransport.Events[0].Body;
        Assert.Multiple(() =>
        {
            Assert.That(body.Get("event_id"), Is.EqualTo(sentryEvent.EventId.ToString()));
            Assert.That(body.Get("contexts", "trace", "trace_id"),
                Is.EqualTo(traceId.ToString()));
            Assert.That(body.Get("user", "id"), Is.EqualTo("42"));
            Assert.That(body.Get("user", "email"), Is.EqualTo("jane.doe@example.org"));
            Assert.That(body.Get("tags", "customerNo"), Is.EqualTo("420"));
            Assert.That(body.Get("tags", "plugin"), Is.EqualTo(plugin.Name));
            Assert.That(body.Get("tags", "host.release"), Is.EqualTo("eFormAPI.Web@9.9.9"));
            Assert.That(body.Get("release"), Is.EqualTo(plugin.Name + "@1.2.3.0"));
            Assert.That(body.GetProperty("exception").GetProperty("values")[0].GetProperty("value").GetString(),
                Is.EqualTo(FakePluginAssembly.ExceptionMessage));
        });
    }

    [Test]
    public void BeforeSend_ReturnsNull_ForAPluginException()
    {
        var plugin = RegisteredPlugin();

        var result = SentryPluginRouter.BeforeSend(new SentryEvent(plugin.CatchFailure()), new SentryHint());

        Assert.That(result, Is.Null);
    }

    [Test]
    public void BeforeSend_ReturnsNull_WhenAHostExceptionWrapsAPluginException()
    {
        var plugin = RegisteredPlugin();
        var wrapped = new AggregateException(new Exception("host wrapper", plugin.CatchFailure()));

        var result = SentryPluginRouter.BeforeSend(new SentryEvent(wrapped), new SentryHint());

        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task BeforeSend_RoutesAMessageCapturedInsideAPlugin()
    {
        var plugin = RegisteredPlugin();
        var sentryEvent = new SentryEvent { Message = "captured without an exception" };
        SentryEvent result = sentryEvent;

        plugin.Run(() => result = SentryPluginRouter.BeforeSend(sentryEvent, new SentryHint()));
        await Flush();

        Assert.That(result, Is.Null);
        Assert.That(_pluginTransport.Events, Has.Count.EqualTo(1));
    }

    [Test]
    public void HostException_CapturedWhileAPluginFrameIsOnTheStack_StaysInTheHostProject()
    {
        var plugin = RegisteredPlugin();
        var sentryEvent = new SentryEvent(new InvalidOperationException("boom in host"));
        SentryEvent result = null;

        plugin.Run(() => result = SentryPluginRouter.BeforeSend(sentryEvent, new SentryHint()));

        Assert.That(result, Is.SameAs(sentryEvent));
        Assert.That(sentryEvent.Tags, Does.Not.ContainKey("plugin"));
    }

    [TestCase("not-a-dsn")]
    [TestCase("https://o1.ingest.example.com/111", Description = "no key")]
    [TestCase("https://pluginkey@o1.ingest.example.com/", Description = "no project")]
    [TestCase("/relative/111")]
    public void AssemblyWithAMalformedDsn_IsNotRegistered_AndItsEventsAreReturnedUnchanged(string dsn)
    {
        RegisteredPlugin();
        var plugin = new FakePluginAssembly(dsn);

        Assert.That(SentryPluginRouter.Register(plugin.Assembly, o => o.Transport = _pluginTransport), Is.False);

        var sentryEvent = new SentryEvent(plugin.CatchFailure());
        Assert.That(SentryPluginRouter.BeforeSend(sentryEvent, new SentryHint()), Is.SameAs(sentryEvent));
    }

    [Test]
    public void BeforeSend_ReturnsTheUnmodifiedEvent_WhenThePluginClientCannotBeCreated()
    {
        var plugin = new FakePluginAssembly(PluginDsn);
        SentryPluginRouter.Register(plugin.Assembly, _ => throw new InvalidOperationException("no client"));
        var sentryEvent = new SentryEvent(plugin.CatchFailure()) { Release = "eFormAPI.Web@9.9.9" };

        var result = SentryPluginRouter.BeforeSend(sentryEvent, new SentryHint());

        Assert.That(result, Is.SameAs(sentryEvent), "the event must stay in the host project rather than be lost");
        Assert.That(sentryEvent.Release, Is.EqualTo("eFormAPI.Web@9.9.9"));
        Assert.That(sentryEvent.Tags, Does.Not.ContainKey("plugin"));
    }

    [Test]
    public void BeforeSend_ReturnsTheRestoredEvent_WhenThePluginClientDropsIt()
    {
        var plugin = new FakePluginAssembly(PluginDsn);
        SentryPluginRouter.Register(plugin.Assembly, o =>
        {
            o.Transport = _pluginTransport;
            o.SetBeforeSend(_ => null); // makes the plugin client return SentryId.Empty
        });
        var sentryEvent = new SentryEvent(plugin.CatchFailure()) { Release = "eFormAPI.Web@9.9.9" };

        var result = SentryPluginRouter.BeforeSend(sentryEvent, new SentryHint());

        Assert.That(result, Is.SameAs(sentryEvent), "the event must stay in the host project rather than be lost");
        Assert.That(sentryEvent.Release, Is.EqualTo("eFormAPI.Web@9.9.9"));
        Assert.That(sentryEvent.Tags, Does.Not.ContainKey("plugin"));
        Assert.That(sentryEvent.Tags, Does.Not.ContainKey("host.release"));
    }

    [Test]
    public async Task HostException_IsReturnedUnchanged_AndStaysInTheHostProject()
    {
        RegisteredPlugin();
        Exception hostException;
        try
        {
            throw new InvalidOperationException("boom in host");
        }
        catch (InvalidOperationException e)
        {
            hostException = e;
        }

        var sentryEvent = new SentryEvent(hostException);
        Assert.That(SentryPluginRouter.BeforeSend(sentryEvent, new SentryHint()), Is.SameAs(sentryEvent));

        _hostClient.CaptureEvent(new SentryEvent(hostException));
        await Flush();

        Assert.That(_hostTransport.Events, Has.Count.EqualTo(1));
        Assert.That(_hostTransport.Events[0].Body.Get("release"),
            Is.EqualTo("eFormAPI.Web@9.9.9"));
        Assert.That(_pluginTransport.Events, Is.Empty);
    }

    [Test]
    public void AssemblyWithoutDsnMetadata_IsNotRegistered_AndItsEventsAreReturnedUnchanged()
    {
        RegisteredPlugin();
        var unregistered = new FakePluginAssembly(dsn: null);

        Assert.That(SentryPluginRouter.Register(unregistered.Assembly, o => o.Transport = _pluginTransport),
            Is.False);

        var sentryEvent = new SentryEvent(unregistered.CatchFailure());
        Assert.That(SentryPluginRouter.BeforeSend(sentryEvent, new SentryHint()), Is.SameAs(sentryEvent));
        Assert.That(sentryEvent.Tags, Does.Not.ContainKey("plugin"));
    }

    [Test]
    public async Task Register_IsIdempotent_TheFirstRegistrationWins()
    {
        var plugin = RegisteredPlugin();
        var secondTransport = new RecordingSentryTransport();

        Assert.That(SentryPluginRouter.Register(plugin.Assembly, o => o.Transport = secondTransport), Is.True);
        _hostClient.CaptureEvent(new SentryEvent(plugin.CatchFailure()));
        await Flush();

        Assert.That(_pluginTransport.Events, Has.Count.EqualTo(1));
        Assert.That(secondTransport.Events, Is.Empty);
    }
}
