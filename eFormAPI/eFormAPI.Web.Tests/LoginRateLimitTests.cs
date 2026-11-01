using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using eFormAPI.Web.Hosting.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using NUnit.Framework;

namespace eFormAPI.Web.Tests;

[TestFixture]
public class LoginRateLimitTests
{
    private const int Limit = 10;
    private const string Ingress = "10.42.0.7"; // a pod-network peer: trusted by default
    private static readonly IReadOnlyList<System.Net.IPNetwork> DefaultTrusted =
        LoginRateLimit.ParseNetworks(LoginRateLimitOptions.DefaultTrustedProxies);

    private LoginRateLimit _limit;

    [SetUp]
    public void SetUp() =>
        _limit = new LoginRateLimit(Options.Create(new LoginRateLimitOptions { FailedAttemptsPerMinute = Limit }));

    [TearDown]
    public void TearDown() => _limit.Dispose();

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

    /// <summary>Runs a request through the middleware; the endpoint fails or succeeds the login. Returns the status code.</summary>
    private static async Task<int> Send(LoginRateLimit limit, DefaultHttpContext ctx, bool loginFails)
    {
        var endpointRan = false;
        await limit.InvokeAsync(ctx, c =>
        {
            endpointRan = true;
            if (loginFails) LoginRateLimit.MarkFailed(c);
            return Task.CompletedTask;
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

        Assert.That(await Send(Request(), loginFails: true), Is.EqualTo(429));
        // Rejected before the password is checked, so a correct login is rejected too until the window ends.
        Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(429));
        Assert.That(await Send(Request("203.0.113.6"), loginFails: true), Is.EqualTo(200));
        Assert.That(await Send(Request(method: "GET", path: "/api/templates/index"), loginFails: false), Is.EqualTo(200));
    }

    [Test]
    public async Task SuccessesBetweenFailures_DoNotResetOrAddToTheCount()
    {
        await Fail(Limit - 1);
        Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(200));
        Assert.That(await Send(Request(), loginFails: true), Is.EqualTo(200));
        Assert.That(await Send(Request(), loginFails: false), Is.EqualTo(429));
    }

    [TestCase("/api/auth/token/")]
    [TestCase("/API/Auth/Token")]
    [TestCase("/API/Auth/Token/")]
    public async Task PathVariants_AreTheLoginEndpoint(string path)
    {
        Assert.That(LoginRateLimit.IsLogin(Request(path: path).Request), Is.True);
        await Fail(Limit);
        Assert.That(await Send(Request(path: path), loginFails: true), Is.EqualTo(429));
    }

    [Test]
    public void OtherAuthRequests_AreNotTheLoginEndpoint()
    {
        Assert.That(LoginRateLimit.IsLogin(Request(path: "/api/auth/token/refresh").Request), Is.False);
        Assert.That(LoginRateLimit.IsLogin(Request(method: "GET").Request), Is.False);
    }

    [Test]
    public void TrustedPeer_TheLastForwardedEntryIsTheClient()
    {
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "1.1.1.1, 2.2.2.2"), DefaultTrusted), Is.EqualTo("2.2.2.2"));
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "2.2.2.2:4711"), DefaultTrusted), Is.EqualTo("2.2.2.2"));
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "not-an-ip"), DefaultTrusted), Is.EqualTo(Ingress));
    }

    [Test]
    public async Task UntrustedPeer_ForwardedForIsIgnored_EvenWhenRotated()
    {
        Assert.That(LoginRateLimit.ClientKey(Request("203.0.113.5", "2.2.2.2"), DefaultTrusted), Is.EqualTo("203.0.113.5"));

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

    [Test]
    public async Task LimitAndTrustedProxies_AreConfigurable()
    {
        using var limit = new LoginRateLimit(Options.Create(new LoginRateLimitOptions
        {
            FailedAttemptsPerMinute = 2, TrustedProxies = ["203.0.113.0/24"],
        }));
        Assert.That(await Send(limit, Request("203.0.113.5", "2.2.2.2"), loginFails: true), Is.EqualTo(200));
        Assert.That(await Send(limit, Request("203.0.113.5", "2.2.2.2"), loginFails: true), Is.EqualTo(200));
        Assert.That(await Send(limit, Request("203.0.113.5", "2.2.2.2"), loginFails: true), Is.EqualTo(429));
        // The configured proxy's forwarded client is the key; the default pod range is no longer trusted.
        Assert.That(await Send(limit, Request("203.0.113.5", "2.2.2.3"), loginFails: true), Is.EqualTo(200));
        var trusted = LoginRateLimit.ParseNetworks(["203.0.113.0/24"]);
        Assert.That(LoginRateLimit.ClientKey(Request(Ingress, "2.2.2.2"), trusted), Is.EqualTo(Ingress));
    }

    [Test]
    public void InvalidSettings_FailAtStartup()
    {
        Assert.Throws<FormatException>(() => LoginRateLimit.ParseNetworks(["not-a-cidr"]));
        Assert.Throws<ArgumentOutOfRangeException>(() =>
            new LoginRateLimit(Options.Create(new LoginRateLimitOptions { FailedAttemptsPerMinute = 0 })));
    }
}
