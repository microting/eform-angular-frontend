using System.Net;
using eFormAPI.Web.Hosting.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using NUnit.Framework;

namespace eFormAPI.Web.Tests;

[TestFixture]
public class LoginRateLimitTests
{
    private static DefaultHttpContext Request(string method, string path, string forwardedFor = null, string ip = "10.0.0.1")
    {
        var ctx = new DefaultHttpContext();
        ctx.Request.Method = method;
        ctx.Request.Path = path;
        ctx.Connection.RemoteIpAddress = IPAddress.Parse(ip);
        if (forwardedFor != null) ctx.Request.Headers["X-Forwarded-For"] = forwardedFor;
        return ctx;
    }

    [Test]
    public void ClientKey_IsTheLastForwardedHop_ElseTheRemoteIp()
    {
        Assert.That(LoginRateLimit.ClientKey(Request("POST", "/api/auth/token", "1.1.1.1, 2.2.2.2")), Is.EqualTo("2.2.2.2"));
        Assert.That(LoginRateLimit.ClientKey(Request("POST", "/api/auth/token")), Is.EqualTo("10.0.0.1"));
    }

    [Test]
    public void EleventhLoginInAMinute_IsRejected_OtherRequestsAreNot()
    {
        var options = new RateLimiterOptions();
        LoginRateLimit.Configure(options);
        for (var i = 0; i < LoginRateLimit.PermitsPerMinute; i++)
            Assert.That(options.GlobalLimiter!.AttemptAcquire(Request("POST", "/api/auth/token")).IsAcquired, Is.True);
        Assert.That(options.GlobalLimiter!.AttemptAcquire(Request("POST", "/api/auth/token")).IsAcquired, Is.False);
        Assert.That(options.GlobalLimiter!.AttemptAcquire(Request("POST", "/api/auth/token", ip: "10.0.0.2")).IsAcquired, Is.True);
        Assert.That(options.GlobalLimiter!.AttemptAcquire(Request("GET", "/api/templates/index")).IsAcquired, Is.True);
    }

    [TestCase("127.0.0.1", null)]
    [TestCase("::1", null)]
    [TestCase("10.0.0.9", "127.0.0.1")]
    [TestCase("10.0.0.9", "::ffff:127.0.0.1")]
    public void LoopbackClients_AreNotLimited(string ip, string forwardedFor)
    {
        // Host and plugin Playwright CI log in from loopback many times a minute.
        var options = new RateLimiterOptions();
        LoginRateLimit.Configure(options);
        for (var i = 0; i < LoginRateLimit.PermitsPerMinute * 3; i++)
            Assert.That(options.GlobalLimiter!.AttemptAcquire(Request("POST", "/api/auth/token", forwardedFor, ip)).IsAcquired, Is.True);
    }

    [Test]
    public void ForgedLoopbackInAnEarlierForwardedEntry_IsStillLimited()
    {
        var options = new RateLimiterOptions();
        LoginRateLimit.Configure(options);
        for (var i = 0; i < LoginRateLimit.PermitsPerMinute; i++)
            options.GlobalLimiter!.AttemptAcquire(Request("POST", "/api/auth/token", "127.0.0.1, 3.3.3.3"));
        Assert.That(options.GlobalLimiter!.AttemptAcquire(Request("POST", "/api/auth/token", "127.0.0.1, 3.3.3.3")).IsAcquired, Is.False);
    }
}
