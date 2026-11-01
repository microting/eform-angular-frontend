using System;
using System.Linq;
using System.Net;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;

namespace eFormAPI.Web.Hosting.Security;

/// <summary>Brute-force brake on the login endpoint, per client (public signup makes the host reachable to anyone).
/// Identity's per-account lockout stays as it is. Loopback clients are exempt: host and plugin Playwright CI log in
/// from 127.0.0.1 many times a minute, and loopback is not reachable from outside the pod.</summary>
public static class LoginRateLimit
{
    public const int PermitsPerMinute = 10;

    public static void Configure(RateLimiterOptions options)
    {
        options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
        options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(ctx =>
        {
            if (!IsLogin(ctx.Request))
            {
                return RateLimitPartition.GetNoLimiter("not-login");
            }

            var client = ClientKey(ctx);
            return IsLoopback(client)
                ? RateLimitPartition.GetNoLimiter("loopback")
                : RateLimitPartition.GetFixedWindowLimiter(client, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = PermitsPerMinute, Window = TimeSpan.FromMinutes(1), QueueLimit = 0,
                });
        });
    }

    public static bool IsLogin(HttpRequest request) =>
        HttpMethods.IsPost(request.Method) && request.Path.Equals("/api/auth/token", StringComparison.OrdinalIgnoreCase);

    /// <summary>The ingress appends the real client as the last X-Forwarded-For entry; earlier entries are client-supplied.</summary>
    public static string ClientKey(HttpContext ctx)
    {
        var forwarded = ctx.Request.Headers["X-Forwarded-For"].ToString();
        if (!string.IsNullOrWhiteSpace(forwarded))
            return forwarded.Split(',').Last().Trim();
        return ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    private static bool IsLoopback(string client) =>
        IPAddress.TryParse(client, out var ip)
        && IPAddress.IsLoopback(ip.IsIPv4MappedToIPv6 ? ip.MapToIPv4() : ip);
}
