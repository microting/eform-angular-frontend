using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Threading.RateLimiting;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace eFormAPI.Web.Hosting.Security;

/// <summary>Settings of <see cref="LoginRateLimit"/>, bound from the <c>LoginRateLimit</c> configuration section
/// (e.g. env <c>LoginRateLimit__FailedAttemptsPerMinute</c>, <c>LoginRateLimit__TrustedProxies__0</c>).</summary>
public class LoginRateLimitOptions
{
    public const string Section = "LoginRateLimit";

    /// <summary>Failed logins per client per one-minute window before further logins get 429.</summary>
    public int FailedAttemptsPerMinute { get; set; } = 10;

    /// <summary>CIDRs of the proxies whose X-Forwarded-For is believed. Null or empty → <see cref="DefaultTrustedProxies"/>.</summary>
    public string[] TrustedProxies { get; set; }

    /// <summary>Loopback plus RFC1918 (the cluster's pod and service ranges, so the ingress).</summary>
    public static readonly string[] DefaultTrustedProxies =
        ["127.0.0.0/8", "::1/128", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"];
}

/// <summary>Brute-force brake on <c>POST /api/auth/token</c>, per client (public signup makes the host reachable to anyone).
/// Only FAILED logins count: a client with <see cref="LoginRateLimitOptions.FailedAttemptsPerMinute"/> failures in the
/// current window gets 429 for every login until the window ends (also with the right password, since the check runs
/// before the password is known). Successful logins never use the quota, so offices and mobile fleets behind one NAT
/// that log in at shift start are not throttled. Identity's per-account lockout stays as it is.
/// <para>How a failure is known with the legacy <c>UseMvc</c> pipeline: the endpoint answers HTTP 200 with
/// <c>Success = false</c>, so <c>AuthController</c> calls <see cref="MarkFailed"/>, and this middleware records the
/// failure after the endpoint has run. A 2FA login whose first post has no code counts as one failure.</para></summary>
public sealed class LoginRateLimit : IMiddleware, IDisposable
{
    private const string FailedItemKey = "eFormAPI.LoginRateLimit.Failed";

    private readonly IReadOnlyList<IPNetwork> _trustedProxies;
    private readonly PartitionedRateLimiter<string> _failures;

    public LoginRateLimit(IOptions<LoginRateLimitOptions> options)
    {
        var o = options.Value;
        if (o.FailedAttemptsPerMinute < 1)
            throw new ArgumentOutOfRangeException(nameof(options), "LoginRateLimit:FailedAttemptsPerMinute must be at least 1");
        _trustedProxies = ParseNetworks(o.TrustedProxies is { Length: > 0 } ? o.TrustedProxies : LoginRateLimitOptions.DefaultTrustedProxies);
        _failures = PartitionedRateLimiter.Create<string, string>(key => RateLimitPartition.GetFixedWindowLimiter(key,
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = o.FailedAttemptsPerMinute, Window = TimeSpan.FromMinutes(1), QueueLimit = 0,
            }));
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var key = IsLogin(context.Request) ? ClientKey(context, _trustedProxies) : null;
        if (key == null)
        {
            await next(context);
            return;
        }

        if (_failures.GetStatistics(key)?.CurrentAvailablePermits <= 0)
        {
            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            context.Response.Headers.RetryAfter = "60";
            return;
        }

        await next(context);

        if (context.Items.ContainsKey(FailedItemKey))
        {
            using var _ = _failures.AttemptAcquire(key);
        }
    }

    /// <summary>Called by the login endpoint when the login did not succeed.</summary>
    public static void MarkFailed(HttpContext context) => context.Items[FailedItemKey] = true;

    public static bool IsLogin(HttpRequest request) =>
        HttpMethods.IsPost(request.Method)
        && string.Equals(request.Path.Value?.TrimEnd('/'), "/api/auth/token", StringComparison.OrdinalIgnoreCase);

    /// <summary>The rate-limit key of the client, or null when the request is not limited (no peer address, or a
    /// direct loopback call such as Playwright CI). X-Forwarded-For is believed only when the TCP peer is a trusted
    /// proxy; then its last entry (the one that proxy added) is the client. IPv6 clients are keyed on their /64.</summary>
    public static string ClientKey(HttpContext ctx, IReadOnlyList<IPNetwork> trustedProxies)
    {
        var peer = Normalise(ctx.Connection.RemoteIpAddress);
        if (peer == null)
            return null;

        var forwarded = ctx.Request.Headers["X-Forwarded-For"].ToString();
        if (string.IsNullOrWhiteSpace(forwarded))
            return IPAddress.IsLoopback(peer) ? null : Key(peer);

        if (trustedProxies.Any(n => n.Contains(peer)))
        {
            var client = Normalise(ParseAddress(forwarded.Split(',').Last()));
            if (client != null)
                return Key(client);
        }

        return Key(peer);
    }

    public static IReadOnlyList<IPNetwork> ParseNetworks(IEnumerable<string> cidrs) =>
        cidrs.Select(c => IPNetwork.TryParse(c.Trim(), out var n)
                ? n
                : throw new FormatException($"LoginRateLimit:TrustedProxies has an invalid CIDR: '{c}'"))
            .ToList();

    /// <summary>Accepts "1.2.3.4", "1.2.3.4:5678", "::1" and "[::1]:80".</summary>
    private static IPAddress ParseAddress(string value) =>
        IPEndPoint.TryParse(value.Trim(), out var endPoint) ? endPoint.Address : null;

    private static IPAddress Normalise(IPAddress ip) => ip is { IsIPv4MappedToIPv6: true } ? ip.MapToIPv4() : ip;

    private static string Key(IPAddress ip)
    {
        if (ip.AddressFamily != AddressFamily.InterNetworkV6)
            return ip.ToString();
        var bytes = ip.GetAddressBytes();
        Array.Clear(bytes, 8, 8);
        return $"{new IPAddress(bytes)}/64";
    }

    public void Dispose() => _failures.Dispose();
}
