using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using eFormAPI.Web.Hosting.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using NUnit.Framework;

namespace eFormAPI.Web.Tests;

[TestFixture]
public class LoginRateLimitTests
{
    private const int Limit = 10;
    private const string Ingress = "10.42.0.7"; // a pod-network peer: trusted by default
    private static readonly IReadOnlyList<System.Net.IPNetwork> DefaultTrusted =
        LoginRateLimit.ParseNetworks(LoginRateLimitOptions.DefaultTrustedProxies);

    private sealed class ManualTime : TimeProvider
    {
        public DateTimeOffset Now = new(2026, 11, 1, 12, 0, 0, TimeSpan.Zero);
        public override DateTimeOffset GetUtcNow() => Now;
    }

    private ManualTime _time;
    private LoginRateLimit _limit;

    [SetUp]
    public void SetUp()
    {
        _time = new ManualTime();
        _limit = New(new LoginRateLimitOptions { FailedAttemptsPerMinute = Limit });
    }

    private LoginRateLimit New(LoginRateLimitOptions options) => new(Options.Create(options), _time);

    private static DefaultHttpContext Request(string ip = "203.0.113.5", string forwardedFor = null,
        string method = "POST", string path = "/api/auth/token")
    {
        var ctx = new DefaultHttpContext();
        ctx.Request.Method = method;
        ctx.Request.Path = path;
        ctx.Connection.RemoteIpAddress = ip == null ? null : IPAddress.Parse(ip);
        if (forwardedFor != null)
        {
            ctx.Request.Headers["X-Forwarded-For"] = forwardedFor;
        }
        return ctx;
    }

    /// <summary>Runs a request through the middleware; the endpoint fails or succeeds the login (optionally waiting
    /// on <paramref name="gate"/>). Returns the status code.</summary>
    private static async Task<int> Send(LoginRateLimit limit, DefaultHttpContext ctx, bool loginFails, Task gate = null)
    {
        var endpointRan = false;
        await limit.InvokeAsync(ctx, async c =>
        {
            endpointRan = true;
            if (gate != null)
            {
                await gate;
            }
            if (loginFails)
            {
                LoginRateLimit.MarkFailed(c);
            }
        });
        Assert.That(endpointRan, Is.EqualTo(ctx.Response.StatusCode != 429));
        return ctx.Response.StatusCode;
    }

    private Task<int> Send(DefaultHttpContext ctx, bool loginFails) => Send(_limit, ctx, loginFails);

    private async Task Fail(int times, string ip = "203.0.113.5", string forwardedFor = null)
    {
        for (var i = 0; i < times; i++)
        {
            Assert.That(await Send(Request(ip, forwardedFor), loginFails: true), Is.EqualTo(200));
        }
    }

    // ---- counting -------------------------------------------------------------------------------------------

    [Test]
    public async Task SuccessfulLogins_NeverUseTheQuota()
    {
        for (var i = 0; i < Limit * 5; i++)
        {
            Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(200));
        }
    }

    [Test]
    public async Task AfterTheLimitOfFailures_EveryLoginIsRejected_OtherClientsAreNot()
    {
        await Fail(Limit);

        var rejected = Request();
        Assert.That(await Send(rejected, loginFails: true), Is.EqualTo(429));
        Assert.That(rejected.Response.Headers.RetryAfter.ToString(), Is.EqualTo("60"));
        // Rejected before the password is checked, so a correct login is rejected too until the window ends.
        Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(429));
        Assert.That(await Send(Request("203.0.113.6"), loginFails: true), Is.EqualTo(200));
        Assert.That(await Send(Request(method: "GET", path: "/api/templates/index"), loginFails: false), Is.EqualTo(200));
    }

    [Test]
    public async Task TheWindowEnds_AfterAMinute()
    {
        await Fail(Limit);
        _time.Now += TimeSpan.FromSeconds(45);
        var rejected = Request();
        Assert.That(await Send(rejected, loginFails: true), Is.EqualTo(429));
        Assert.That(rejected.Response.Headers.RetryAfter.ToString(), Is.EqualTo("15"));

        _time.Now += TimeSpan.FromSeconds(15);
        await Fail(Limit);
        Assert.That(await Send(Request(), loginFails: true), Is.EqualTo(429));
    }

    [Test]
    public async Task SuccessesBetweenFailures_DoNotResetOrAddToTheCount()
    {
        await Fail(Limit - 1);
        Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(200));
        Assert.That(await Send(Request(), loginFails: true), Is.EqualTo(200));
        Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(429));
    }

    [Test]
    public async Task ConcurrentFailingLogins_NeverExceedTheLimit()
    {
        var gate = new TaskCompletionSource();
        var requests = Enumerable.Range(0, Limit * 3).Select(_ => Request()).ToList();
        var sends = requests.Select(r => Task.Run(() => Send(_limit, r, loginFails: true, gate.Task))).ToList();

        // Every request has either been rejected or is waiting inside the endpoint before the gate opens.
        await WaitUntil(() => requests.Count(r => r.Response.StatusCode == 429) == Limit * 2);
        gate.SetResult();
        var codes = await Task.WhenAll(sends);

        Assert.That(codes.Count(c => c == 200), Is.EqualTo(Limit), "password checks that ran");
        Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(429));
    }

    [Test]
    public async Task SuccessfulLogins_HoldASlotOnlyWhileTheyRun()
    {
        var gate = new TaskCompletionSource();
        var running = Enumerable.Range(0, Limit).Select(_ => Send(_limit, Request(), loginFails: false, gate.Task)).ToList();

        Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(429), "all slots are held");
        gate.SetResult();
        Assert.That(await Task.WhenAll(running), Is.All.EqualTo(200));

        for (var i = 0; i < Limit * 2; i++)
        {
            Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(200));
        }
    }

    [Test]
    public async Task AnEndpointThatThrows_ReleasesItsSlot_AndCountsAsAFailure()
    {
        // It may have checked the password before throwing.
        for (var i = 0; i < Limit; i++)
        {
            var ctx = Request();
            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                _limit.InvokeAsync(ctx, _ => throw new InvalidOperationException()));
        }
        Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(429));
        Assert.That(await Send(Request("203.0.113.6"), loginFails: false), Is.EqualTo(200), "the slots were released");
    }

    [Test]
    public async Task TheFailureFlagIsRead_AfterTheEndpointFinished()
    {
        // The endpoint marks the failure after an await (as MVC does); the flag must still be seen.
        for (var i = 0; i < Limit; i++)
        {
            var ctx = Request();
            await _limit.InvokeAsync(ctx, async c =>
            {
                await Task.Yield();
                LoginRateLimit.MarkFailed(c);
            });
        }
        Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(429));
    }

    [Test]
    public async Task AtTheKeyCap_NewClientsFailOpen_KnownClientsKeepTheirLimits()
    {
        var logger = new ListLogger();
        var limit = new LoginRateLimit(Options.Create(new LoginRateLimitOptions { FailedAttemptsPerMinute = 2 }),
            _time, logger, maxTrackedClients: 5);
        for (var i = 1; i <= 5; i++)
        {
            Assert.That(await Send(limit, Request($"203.0.113.{i}"), loginFails: true), Is.EqualTo(200));
        }
        Assert.That(await Send(limit, Request("203.0.113.1"), loginFails: true), Is.EqualTo(200));

        // A flood of distinct keys must not lock new clients out: a new key is let through, untracked and unlimited.
        for (var i = 0; i < 5; i++)
        {
            Assert.That(await Send(limit, Request("203.0.113.99"), loginFails: true), Is.EqualTo(200));
        }
        Assert.That(limit.TrackedClients, Is.EqualTo(5), "the table does not grow");
        Assert.That(await Send(limit, Request("203.0.113.1"), loginFails: false), Is.EqualTo(429), "known client still limited");
        Assert.That(await Send(limit, Request("203.0.113.2"), loginFails: true), Is.EqualTo(200));
        Assert.That(await Send(limit, Request("203.0.113.2"), loginFails: false), Is.EqualTo(429));

        // Warned at most once a minute, without addresses.
        Assert.That(logger.Warnings, Is.EqualTo(new[] { "Login rate-limit table full; new clients are not limited" }));
        _time.Now += TimeSpan.FromSeconds(30);
        await Send(limit, Request("203.0.113.98"), loginFails: false);
        Assert.That(logger.Warnings, Has.Count.EqualTo(1));

        // Once the windows expire they are evicted and new clients are tracked again.
        _time.Now += TimeSpan.FromSeconds(31);
        Assert.That(await Send(limit, Request("203.0.113.99"), loginFails: true), Is.EqualTo(200));
        Assert.That(limit.TrackedClients, Is.EqualTo(1));
    }

    [Test]
    public async Task AtTheKeyCap_LiveWindowsAreNotEvicted()
    {
        var limit = new LoginRateLimit(Options.Create(new LoginRateLimitOptions { FailedAttemptsPerMinute = 2 }),
            _time, Microsoft.Extensions.Logging.Abstractions.NullLogger<LoginRateLimit>.Instance, 2);
        await Send(limit, Request("203.0.113.1"), loginFails: true);
        await Send(limit, Request("203.0.113.1"), loginFails: true);
        await Send(limit, Request("203.0.113.2"), loginFails: true);

        _time.Now += TimeSpan.FromSeconds(30);
        Assert.That(await Send(limit, Request("203.0.113.3"), loginFails: false), Is.EqualTo(200), "fails open");
        Assert.That(limit.TrackedClients, Is.EqualTo(2));
        // The throttled client keeps its count instead of being evicted to make room.
        Assert.That(await Send(limit, Request("203.0.113.1"), loginFails: false), Is.EqualTo(429));
    }

    [Test]
    public async Task AClientThatAborts_IsNotCountedAsAFailure()
    {
        for (var i = 0; i < Limit * 2; i++)
        {
            var ctx = Request();
            using var aborted = new CancellationTokenSource();
            ctx.RequestAborted = aborted.Token;
            await Assert.ThrowsAsync<OperationCanceledException>(() => _limit.InvokeAsync(ctx, _ =>
            {
                aborted.Cancel();
                throw new OperationCanceledException(aborted.Token);
            }));
        }
        Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(200));
    }

    [Test]
    public async Task ExpiredWindows_AreSwept()
    {
        await Fail(1, "203.0.113.1");
        await Fail(1, "203.0.113.2");
        Assert.That(_limit.TrackedClients, Is.EqualTo(2));

        _time.Now += TimeSpan.FromMinutes(1);
        await Fail(1, "203.0.113.3");
        Assert.That(_limit.TrackedClients, Is.EqualTo(1));
    }

    [Test]
    public void CountsAsFailure_ExceptSecondFactorRequiredWithoutACode()
    {
        Assert.That(LoginRateLimit.CountsAsFailure(new OperationResult(false, "UserNameOrPasswordIncorrect"), null), Is.True);
        Assert.That(LoginRateLimit.CountsAsFailure(new OperationResult(true), null), Is.False);
        var codeRequired = new OperationResult(false, LoginRateLimit.SecondFactorRequiredMessage);
        Assert.That(LoginRateLimit.CountsAsFailure(codeRequired, null), Is.False);
        Assert.That(LoginRateLimit.CountsAsFailure(codeRequired, ""), Is.False);
        Assert.That(LoginRateLimit.CountsAsFailure(codeRequired, "123456"), Is.True, "a code was sent");
    }

    // ---- which requests ---------------------------------------------------------------------------------------

    [TestCase("/api/auth/token/")]
    [TestCase("/API/Auth/Token")]
    [TestCase("/API/Auth/Token/")]
    [TestCase("/api/auth/google-auth-key")]
    [TestCase("/API/auth/Google-Auth-Key/")]
    public async Task BrakedPaths(string path)
    {
        Assert.That(LoginRateLimit.IsLogin(Request(path: path).Request), Is.True);
        await Fail(Limit);
        Assert.That(await Send(Request(path: path), loginFails: true), Is.EqualTo(429));
    }

    [Test]
    public async Task GoogleAuthKeyAndTokenFailures_ShareTheClientsQuota()
    {
        for (var i = 0; i < Limit / 2; i++)
        {
            Assert.That(await Send(Request(path: "/api/auth/google-auth-key"), loginFails: true), Is.EqualTo(200));
            Assert.That(await Send(Request(), loginFails: true), Is.EqualTo(200));
        }
        Assert.That(await Send(Request(path: "/api/auth/google-auth-key"), loginFails: true), Is.EqualTo(429));
    }

    [Test]
    public void OtherAuthRequests_AreNotBraked()
    {
        Assert.That(LoginRateLimit.IsLogin(Request(path: "/api/auth/token/refresh").Request), Is.False);
        Assert.That(LoginRateLimit.IsLogin(Request(method: "GET").Request), Is.False);
        Assert.That(LoginRateLimit.IsLogin(Request(path: "/eform.EformAuthService/AuthenticateUser").Request), Is.False,
            "gRPC brakes itself, to answer ResourceExhausted");
    }

    // ---- client key -------------------------------------------------------------------------------------------

    [Test]
    public void TrustedPeer_TheFirstUntrustedForwardedEntryFromTheRightIsTheClient()
    {
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "1.1.1.1, 2.2.2.2"), DefaultTrusted), Is.EqualTo("2.2.2.2"));
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "2.2.2.2:4711"), DefaultTrusted), Is.EqualTo("2.2.2.2"));
    }

    [Test]
    public async Task ForgedLeftmostEntriesBehindOneTrustedProxy_AreIgnored()
    {
        // The client sends its own X-Forwarded-For; the ingress appends the real address. Only that entry counts,
        // even when the forged entries are private (trusted-looking) addresses.
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "6.6.6.6, 2.2.2.2"), DefaultTrusted), Is.EqualTo("2.2.2.2"));
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "192.168.1.20, 10.0.0.5"), DefaultTrusted),
            Is.EqualTo("10.0.0.5"), "never the leftmost");

        for (var i = 0; i < Limit; i++)
        {
            Assert.That(await Send(Request(Ingress, $"10.9.9.{i}, 198.51.100.7"), loginFails: true), Is.EqualTo(200));
        }
        Assert.That(await Send(Request(Ingress, "10.9.9.200, 198.51.100.7"), loginFails: true), Is.EqualTo(429));
    }

    [Test]
    public void ForwardLimit2_TwoTrustedHops()
    {
        // Load balancer (10.0.0.5) + ingress (peer): the load balancer's entry is the client.
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "6.6.6.6, 2.2.2.2, 10.0.0.5"), DefaultTrusted, forwardLimit: 2),
            Is.EqualTo("2.2.2.2"));
        // The walk stops at the limit and keys on the last hop examined, never further left.
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "6.6.6.6, 192.168.1.9, 10.0.0.5"), DefaultTrusted, forwardLimit: 2),
            Is.EqualTo("192.168.1.9"));
        // A hop that is not a trusted proxy ends the walk early.
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "6.6.6.6, 2.2.2.2"), DefaultTrusted, forwardLimit: 2),
            Is.EqualTo("2.2.2.2"));
        // Configured on the instance.
        var limit = New(new LoginRateLimitOptions { ForwardLimit = 2 });
        Assert.That(limit.ClientKey(Request(Ingress, "6.6.6.6, 2.2.2.2, 10.0.0.5")), Is.EqualTo("2.2.2.2"));
        Assert.That(_limit.ClientKey(Request(Ingress, "6.6.6.6, 2.2.2.2, 10.0.0.5")), Is.EqualTo("10.0.0.5"), "default 1");
    }

    [Test]
    public async Task KeysOnTheConnectionAsItArrived_NotAsUseForwardedHeadersRewroteIt()
    {
        // Development runs UseForwardedHeaders (ForwardLimit 2) before the brake. Behind a loopback proxy it moves
        // 10.0.0.5 into RemoteIpAddress and leaves only the client-forged "6.6.6.6" in the header, which would then
        // pick the bucket. The capture middleware runs first, so the brake still sees peer 127.0.0.1 + the full header.
        string key = null;
        var forwardedHeaders = new Microsoft.AspNetCore.HttpOverrides.ForwardedHeadersMiddleware(
            c =>
            {
                key = _limit.ClientKey(c);
                return Task.CompletedTask;
            },
            Microsoft.Extensions.Logging.Abstractions.NullLoggerFactory.Instance,
            Options.Create(new Microsoft.AspNetCore.Builder.ForwardedHeadersOptions
            {
                ForwardedHeaders = Microsoft.AspNetCore.HttpOverrides.ForwardedHeaders.XForwardedFor,
                ForwardLimit = 2,
            }));

        var ctx = Request("127.0.0.1", "6.6.6.6, 10.0.0.5");
        await LoginRateLimit.CaptureOriginalConnection(ctx, forwardedHeaders.Invoke);

        Assert.That(ctx.Connection.RemoteIpAddress.ToString(), Is.EqualTo("10.0.0.5"), "UseForwardedHeaders did rewrite it");
        Assert.That(key, Is.EqualTo("10.0.0.5"), "the entry the loopback proxy wrote, not the forged one");

        // Without the capture the forged entry would be the key.
        var uncaptured = Request("10.0.0.5", "6.6.6.6");
        Assert.That(_limit.ClientKey(uncaptured), Is.EqualTo("6.6.6.6"));
    }

    [Test]
    public void UnparsableEntry_StopsAtTheNearestKnownHop()
    {
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "not-an-ip"), DefaultTrusted), Is.EqualTo(Ingress));
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "2.2.2.2, garbage, 10.0.0.5"), DefaultTrusted, forwardLimit: 3),
            Is.EqualTo("10.0.0.5"));
    }

    [Test]
    public async Task UntrustedPeer_ForwardedForIsIgnored_EvenWhenRotated()
    {
        Assert.That(LoginRateLimit.ClientKey(Request("203.0.113.5", "2.2.2.2"), DefaultTrusted), Is.EqualTo("203.0.113.5"));
        Assert.That(LoginRateLimit.ClientKey(Request("203.0.113.5", "2.2.2.2, 10.0.0.5"), DefaultTrusted),
            Is.EqualTo("203.0.113.5"));

        for (var i = 0; i < Limit; i++)
        {
            Assert.That(await Send(Request("203.0.113.5", $"198.51.100.{i}"), loginFails: true), Is.EqualTo(200));
        }
        Assert.That(await Send(Request("203.0.113.5", "198.51.100.200"), loginFails: true), Is.EqualTo(429));
    }

    [Test]
    public async Task UntrustedPeer_SpoofedLoopbackForwardedFor_IsNotExempt()
    {
        await Fail(Limit, "203.0.113.5", "127.0.0.1");
        Assert.That(await Send(Request("203.0.113.5", "127.0.0.1"), loginFails: true), Is.EqualTo(429));
    }

    [Test]
    public async Task TrustedPeer_ForwardedLoopbackClient_IsNotExempt()
    {
        // Only a direct loopback peer without X-Forwarded-For is exempt; a forwarded "127.0.0.1" is just a key.
        await Fail(Limit, Ingress, "127.0.0.1");
        Assert.That(await Send(Request(Ingress, "127.0.0.1"), loginFails: true), Is.EqualTo(429));
    }

    [TestCase("127.0.0.1")]
    [TestCase("::1")]
    [TestCase("::ffff:127.0.0.1")]
    public async Task DirectLoopbackPeerWithoutForwardedFor_IsNotLimited_WhenExempt(string ip)
    {
        // Development (local test runs) exempts loopback by default.
        var limit = New(new LoginRateLimitOptions { ExemptLoopback = true });
        Assert.That(LoginRateLimit.ClientKey(Request(ip), DefaultTrusted, 1, true), Is.Null);
        for (var i = 0; i < Limit * 3; i++)
        {
            Assert.That(await Send(limit, Request(ip), loginFails: true), Is.EqualTo(200));
        }
    }

    [TestCase("127.0.0.1", "127.0.0.1")]
    [TestCase("::1", "::1")]
    [TestCase("::ffff:127.0.0.1", "127.0.0.1")]
    public async Task DirectLoopbackPeerWithoutForwardedFor_IsLimited_ByDefault_AndWarnsOnce(string ip, string key)
    {
        var logger = new ListLogger();
        var limit = new LoginRateLimit(Options.Create(new LoginRateLimitOptions { FailedAttemptsPerMinute = Limit }),
            _time, logger);
        Assert.That(limit.ClientKey(Request(ip)), Is.EqualTo(key));

        for (var i = 0; i < Limit; i++)
        {
            Assert.That(await Send(limit, Request(ip), loginFails: true), Is.EqualTo(200));
        }
        Assert.That(await Send(limit, Request(ip), loginFails: true), Is.EqualTo(429));

        Assert.That(logger.Warnings, Has.Count.EqualTo(1), "one warning per process");
        Assert.That(logger.Warnings[0], Does.Contain("loopback").And.Not.Contain("127.0.0.1"), "no addresses in the log");
    }

    [Test]
    public void LoopbackPeerWithForwardedFor_DoesNotWarn()
    {
        var logger = new ListLogger();
        var limit = new LoginRateLimit(Options.Create(new LoginRateLimitOptions()), _time, logger);
        limit.ClientKey(Request("127.0.0.1", "198.51.100.9"));
        Assert.That(logger.Warnings, Is.Empty);
    }

    private sealed class ListLogger : Microsoft.Extensions.Logging.ILogger<LoginRateLimit>
    {
        public readonly List<string> Warnings = [];
        public IDisposable BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(Microsoft.Extensions.Logging.LogLevel logLevel) => true;
        public void Log<TState>(Microsoft.Extensions.Logging.LogLevel logLevel, Microsoft.Extensions.Logging.EventId eventId,
            TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
            if (logLevel == Microsoft.Extensions.Logging.LogLevel.Warning)
            {
                Warnings.Add(formatter(state, exception));
            }
        }
    }

    [Test]
    public void LoopbackPeerWithForwardedFor_IsKeyedOnTheForwardedClient()
    {
        Assert.That(LoginRateLimit.ClientKey(Request("127.0.0.1", "198.51.100.9"), DefaultTrusted), Is.EqualTo("198.51.100.9"));
    }

    [Test]
    public void Keys_AreNormalised()
    {
        Assert.That(LoginRateLimit.ClientKey(Request("::ffff:203.0.113.5"), DefaultTrusted), Is.EqualTo("203.0.113.5"));
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "::ffff:198.51.100.9"), DefaultTrusted), Is.EqualTo("198.51.100.9"));
        Assert.That(LoginRateLimit.ClientKey(Request("2001:db8:1:2:aaaa::1"), DefaultTrusted), Is.EqualTo("2001:db8:1:2::/64"));
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "[2001:db8:1:2:bbbb::9]:443"), DefaultTrusted),
            Is.EqualTo("2001:db8:1:2::/64"));
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "2001:db8:1:2:cccc::9"), DefaultTrusted),
            Is.EqualTo("2001:db8:1:2::/64"));
    }

    [Test]
    public async Task IPv6ClientsInOneSlash64_ShareABucket()
    {
        for (var i = 1; i <= Limit; i++)
        {
            Assert.That(await Send(Request($"2001:db8:1:2::{i:x}"), loginFails: true), Is.EqualTo(200));
        }
        Assert.That(await Send(Request("2001:db8:1:2:ffff::1"), loginFails: true), Is.EqualTo(429));
        Assert.That(await Send(Request("2001:db8:1:3::1"), loginFails: true), Is.EqualTo(200));
    }

    [Test]
    public async Task NoPeerAddress_IsNotLimited_InsteadOfOneSharedBucket()
    {
        Assert.That(LoginRateLimit.ClientKey(Request(ip: null), DefaultTrusted), Is.Null);
        for (var i = 0; i < Limit * 2; i++)
        {
            Assert.That(await Send(Request(ip: null), loginFails: true), Is.EqualTo(200));
        }
    }

    // ---- configuration ----------------------------------------------------------------------------------------

    [Test]
    public async Task LimitAndTrustedProxies_AreConfigurable()
    {
        var limit = New(new LoginRateLimitOptions { FailedAttemptsPerMinute = 2, TrustedProxies = ["203.0.113.0/24"] });
        Assert.That(await Send(limit, Request("203.0.113.5", "2.2.2.2"), loginFails: true), Is.EqualTo(200));
        Assert.That(await Send(limit, Request("203.0.113.5", "2.2.2.2"), loginFails: true), Is.EqualTo(200));
        Assert.That(await Send(limit, Request("203.0.113.5", "2.2.2.2"), loginFails: true), Is.EqualTo(429));
        Assert.That(await Send(limit, Request("203.0.113.5", "2.2.2.3"), loginFails: true), Is.EqualTo(200));
        // The default pod range is no longer trusted.
        Assert.That(limit.ClientKey(Request(Ingress, "2.2.2.2")), Is.EqualTo(Ingress));
    }

    private sealed class Env(string name) : Microsoft.Extensions.Hosting.IHostEnvironment
    {
        public string EnvironmentName { get; set; } = name;
        public string ApplicationName { get; set; } = "eFormAPI.Web";
        public string ContentRootPath { get; set; } = "/";
        public Microsoft.Extensions.FileProviders.IFileProvider ContentRootFileProvider { get; set; }
    }

    private static IServiceProvider Services(Dictionary<string, string> settings, string environment = "Production")
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddSingleton<Microsoft.Extensions.Hosting.IHostEnvironment>(new Env(environment));
        LoginRateLimit.Register(services, new ConfigurationBuilder().AddInMemoryCollection(settings).Build());
        return services.BuildServiceProvider();
    }

    [TestCase("Production", null, false)]
    [TestCase("Development", null, true)]
    [TestCase("Development", "false", false)]
    [TestCase("Production", "true", true)]
    public void ExemptLoopback_DefaultsToDevelopmentOnly(string environment, string configured, bool expected)
    {
        var settings = new Dictionary<string, string>();
        if (configured != null)
        {
            settings["LoginRateLimit:ExemptLoopback"] = configured;
        }
        var sp = Services(settings, environment);
        Assert.That(sp.GetRequiredService<IOptions<LoginRateLimitOptions>>().Value.ExemptLoopback, Is.EqualTo(expected));
        Assert.That(sp.GetRequiredService<LoginRateLimit>().ClientKey(Request("127.0.0.1")),
            expected ? Is.Null : Is.EqualTo("127.0.0.1"));
    }

    [Test]
    public void Settings_AreBound()
    {
        var sp = Services(new()
        {
            ["LoginRateLimit:FailedAttemptsPerMinute"] = "3",
            ["LoginRateLimit:TrustedProxies:0"] = "203.0.113.0/24",
        });
        sp.GetRequiredService<IStartupValidator>().Validate();
        var options = sp.GetRequiredService<IOptions<LoginRateLimitOptions>>().Value;
        Assert.That(options.FailedAttemptsPerMinute, Is.EqualTo(3));
        Assert.That(options.ForwardLimit, Is.EqualTo(1), "default");
        Assert.That(options.EffectiveTrustedProxies, Is.EqualTo(new[] { "203.0.113.0/24" }));
        Assert.That(sp.GetRequiredService<LoginRateLimit>(), Is.Not.Null);
    }

    [Test]
    public void Defaults_PassStartupValidation()
    {
        var sp = Services(new());
        Assert.DoesNotThrow(() => sp.GetRequiredService<IStartupValidator>().Validate());
        Assert.That(sp.GetRequiredService<IOptions<LoginRateLimitOptions>>().Value.EffectiveTrustedProxies,
            Is.EqualTo(LoginRateLimitOptions.DefaultTrustedProxies));
    }

    [TestCase("LoginRateLimit:FailedAttemptsPerMinute", "0")]
    [TestCase("LoginRateLimit:ForwardLimit", "0")]
    [TestCase("LoginRateLimit:TrustedProxies:0", "not-a-cidr")]
    public void InvalidSettings_FailStartupValidation(string key, string value)
    {
        var sp = Services(new() { [key] = value });
        Assert.Throws<OptionsValidationException>(() => sp.GetRequiredService<IStartupValidator>().Validate());
    }

    private static async Task WaitUntil(Func<bool> condition)
    {
        using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(10));
        while (!condition())
        {
            await Task.Delay(5, timeout.Token);
        }
    }
}
