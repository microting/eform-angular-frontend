using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using eFormAPI.Web.Hosting.Security;
using eFormAPI.Web.Infrastructure.Models.Auth;
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
        if (forwardedFor != null) ctx.Request.Headers["X-Forwarded-For"] = forwardedFor;
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
            if (gate != null) await gate;
            if (loginFails) LoginRateLimit.MarkFailed(c);
        });
        Assert.That(endpointRan, Is.EqualTo(ctx.Response.StatusCode != 429));
        return ctx.Response.StatusCode;
    }

    private Task<int> Send(DefaultHttpContext ctx, bool loginFails) => Send(_limit, ctx, loginFails);

    private async Task Fail(int times, string ip = "203.0.113.5", string forwardedFor = null)
    {
        for (var i = 0; i < times; i++)
            Assert.That(await Send(Request(ip, forwardedFor), loginFails: true), Is.EqualTo(200));
    }

    // ---- counting -------------------------------------------------------------------------------------------

    [Test]
    public async Task SuccessfulLogins_NeverUseTheQuota()
    {
        for (var i = 0; i < Limit * 5; i++)
            Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(200));
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
            Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(200));
    }

    [Test]
    public async Task AnEndpointThatThrows_ReleasesItsSlot_AndIsNotAFailure()
    {
        for (var i = 0; i < Limit * 2; i++)
        {
            var ctx = Request();
            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                _limit.InvokeAsync(ctx, _ => throw new InvalidOperationException()));
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
    public void CountsAsFailure_ExceptSecondFactorRequired()
    {
        Assert.That(LoginRateLimit.CountsAsFailure(new OperationResult(false, "UserNameOrPasswordIncorrect")), Is.True);
        Assert.That(LoginRateLimit.CountsAsFailure(new OperationResult(true)), Is.False);
        Assert.That(LoginRateLimit.CountsAsFailure(new SecondFactorRequiredResult("PSK or code is empty")), Is.False);
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
        // Two trusted hops (e.g. load balancer + ingress) in front of the client.
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "6.6.6.6, 2.2.2.2, 10.0.0.5, 192.168.1.9"), DefaultTrusted),
            Is.EqualTo("2.2.2.2"));
    }

    [Test]
    public void AllTrustedChain_TheLeftmostIsTheClient()
    {
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "192.168.1.20, 10.0.0.5"), DefaultTrusted),
            Is.EqualTo("192.168.1.20"));
    }

    [Test]
    public void UnparsableEntry_StopsAtTheNearestKnownHop()
    {
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "not-an-ip"), DefaultTrusted), Is.EqualTo(Ingress));
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "2.2.2.2, garbage, 10.0.0.5"), DefaultTrusted),
            Is.EqualTo("10.0.0.5"));
    }

    [Test]
    public async Task UntrustedPeer_ForwardedForIsIgnored_EvenWhenRotated()
    {
        Assert.That(LoginRateLimit.ClientKey(Request("203.0.113.5", "2.2.2.2"), DefaultTrusted), Is.EqualTo("203.0.113.5"));
        Assert.That(LoginRateLimit.ClientKey(Request("203.0.113.5", "2.2.2.2, 10.0.0.5"), DefaultTrusted),
            Is.EqualTo("203.0.113.5"));

        for (var i = 0; i < Limit; i++)
            Assert.That(await Send(Request("203.0.113.5", $"198.51.100.{i}"), loginFails: true), Is.EqualTo(200));
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
    public async Task DirectLoopbackPeerWithoutForwardedFor_IsNotLimited(string ip)
    {
        // Host and plugin Playwright CI log in from loopback many times a minute.
        Assert.That(LoginRateLimit.ClientKey(Request(ip), DefaultTrusted), Is.Null);
        for (var i = 0; i < Limit * 3; i++)
            Assert.That(await Send(Request(ip), loginFails: true), Is.EqualTo(200));
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
            Assert.That(await Send(Request($"2001:db8:1:2::{i:x}"), loginFails: true), Is.EqualTo(200));
        Assert.That(await Send(Request("2001:db8:1:2:ffff::1"), loginFails: true), Is.EqualTo(429));
        Assert.That(await Send(Request("2001:db8:1:3::1"), loginFails: true), Is.EqualTo(200));
    }

    [Test]
    public async Task NoPeerAddress_IsNotLimited_InsteadOfOneSharedBucket()
    {
        Assert.That(LoginRateLimit.ClientKey(Request(ip: null), DefaultTrusted), Is.Null);
        for (var i = 0; i < Limit * 2; i++)
            Assert.That(await Send(Request(ip: null), loginFails: true), Is.EqualTo(200));
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

    private static IServiceProvider Services(Dictionary<string, string> settings)
    {
        var services = new ServiceCollection();
        LoginRateLimit.Register(services, new ConfigurationBuilder().AddInMemoryCollection(settings).Build());
        return services.BuildServiceProvider();
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
            await Task.Delay(5, timeout.Token);
    }
}
