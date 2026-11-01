using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Hosting.Security;

/// <summary>Settings of <see cref="LoginRateLimit"/>, bound from the <c>LoginRateLimit</c> configuration section
/// (e.g. env <c>LoginRateLimit__FailedAttemptsPerMinute</c>, <c>LoginRateLimit__TrustedProxies__0</c>) and validated
/// at startup.</summary>
public class LoginRateLimitOptions
{
    public const string Section = "LoginRateLimit";

    /// <summary>Failed logins per client per one-minute window before further logins get 429.</summary>
    public int FailedAttemptsPerMinute { get; set; } = 10;

    /// <summary>CIDRs of the proxies whose X-Forwarded-For entries are believed. Null or empty →
    /// <see cref="DefaultTrustedProxies"/>.
    /// <para>The default trusts every private (RFC1918) address, which fits Kubernetes, where the ingress reaches the
    /// pod from the pod network. On a LAN or on-prem install, where clients themselves have private addresses, set
    /// <c>LoginRateLimit__TrustedProxies__0</c> (…<c>__1</c>, …) to the real reverse proxy addresses; otherwise a
    /// client on the LAN can choose its own key with a forged X-Forwarded-For.</para></summary>
    public string[] TrustedProxies { get; set; }

    /// <summary>Loopback plus RFC1918 (the cluster's pod and service ranges, so the ingress).</summary>
    public static readonly string[] DefaultTrustedProxies =
        ["127.0.0.0/8", "::1/128", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"];

    public IReadOnlyList<string> EffectiveTrustedProxies =>
        TrustedProxies is { Length: > 0 } ? TrustedProxies : DefaultTrustedProxies;
}

/// <summary>Brute-force brake on the anonymous endpoints that check a password: <c>POST /api/auth/token</c>,
/// <c>POST /api/auth/google-auth-key</c> (this middleware) and the gRPC <c>EformAuthService/AuthenticateUser</c>
/// (which calls <see cref="TryBegin"/> itself, so it can answer <c>ResourceExhausted</c>).
/// <para>Only FAILED logins count, per client and one-minute window. A client is rejected when its failures plus
/// its logins still running reach the limit, so parallel requests cannot overshoot it; once over the limit every
/// login is rejected until the window ends, also with the right password (the check runs before the password is
/// known). Successful logins only hold a slot while they run, so offices and mobile fleets behind one NAT that log
/// in at shift start are not throttled. Identity's per-account lockout stays as it is.</para>
/// <para>How a failure is known with the legacy <c>UseMvc</c> pipeline: the endpoints answer HTTP 200 with
/// <c>Success = false</c>, so the controller calls <see cref="MarkFailed"/> when <see cref="CountsAsFailure"/>, and
/// this middleware records it after the endpoint has run. "Second factor required" after a correct password is not
/// a failure.</para></summary>
public sealed class LoginRateLimit : IMiddleware
{
    private const string FailedItemKey = "eFormAPI.LoginRateLimit.Failed";
    private const int SweepAboveEntries = 10_000;
    private static readonly TimeSpan Window = TimeSpan.FromMinutes(1);

    private readonly int _limit;
    private readonly IReadOnlyList<IPNetwork> _trustedProxies;
    private readonly TimeProvider _time;
    private readonly ConcurrentDictionary<string, ClientWindow> _windows = new();
    private long _lastSweepTicks;

    public LoginRateLimit(IOptions<LoginRateLimitOptions> options, TimeProvider time)
    {
        var o = options.Value;
        _limit = o.FailedAttemptsPerMinute;
        _trustedProxies = ParseNetworks(o.EffectiveTrustedProxies);
        _time = time;
        _lastSweepTicks = time.GetUtcNow().UtcTicks;
    }

    /// <summary>Binds and validates the options at startup (a bad value stops the host instead of failing every
    /// request) and registers the brake.</summary>
    public static void Register(IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<LoginRateLimitOptions>()
            .Bind(configuration.GetSection(LoginRateLimitOptions.Section))
            .Validate(o => o.FailedAttemptsPerMinute >= 1, "LoginRateLimit:FailedAttemptsPerMinute must be at least 1")
            .Validate(o => o.EffectiveTrustedProxies.All(c => c != null && IPNetwork.TryParse(c.Trim(), out _)),
                "LoginRateLimit:TrustedProxies must be CIDRs such as 10.0.0.0/8")
            .ValidateOnStart();
        services.AddSingleton(sp => new LoginRateLimit(
            sp.GetRequiredService<IOptions<LoginRateLimitOptions>>(), TimeProvider.System));
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var key = IsLogin(context.Request) ? ClientKey(context) : null;
        if (!TryBegin(key, out var attempt, out var retryAfter))
        {
            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            context.Response.Headers.RetryAfter = ((int)Math.Ceiling(retryAfter.TotalSeconds)).ToString();
            return;
        }

        var failed = false;
        try
        {
            await next(context);
            failed = context.Items.ContainsKey(FailedItemKey);
        }
        finally
        {
            attempt.End(failed);
        }
    }

    /// <summary>Reserves a slot for one login of <paramref name="key"/>; the caller must call
    /// <see cref="Attempt.End"/> exactly once, in a finally. A null key (not limited) always succeeds.</summary>
    public bool TryBegin(string key, out Attempt attempt, out TimeSpan retryAfter)
    {
        attempt = Attempt.Unlimited;
        retryAfter = TimeSpan.Zero;
        if (key == null)
            return true;

        var now = _time.GetUtcNow();
        SweepIfDue(now);
        while (true)
        {
            var window = _windows.GetOrAdd(key, _ => new ClientWindow { Start = now });
            lock (window)
            {
                if (window.Removed)
                    continue; // swept between GetOrAdd and lock: take the fresh entry

                if (now - window.Start >= Window)
                {
                    window.Start = now;
                    window.Failures = 0;
                }

                if (window.Failures + window.InFlight >= _limit)
                {
                    retryAfter = window.Start + Window - now;
                    if (retryAfter < TimeSpan.FromSeconds(1)) retryAfter = TimeSpan.FromSeconds(1);
                    return false;
                }

                window.InFlight++;
                attempt = new Attempt(window);
                return true;
            }
        }
    }

    /// <summary>Called by a braked endpoint when the login failed; see <see cref="CountsAsFailure"/>.</summary>
    public static void MarkFailed(HttpContext context) => context.Items[FailedItemKey] = true;

    /// <summary>A failed login that is a guess: anything not successful, except "second factor required".</summary>
    public static bool CountsAsFailure(OperationResult result) => !result.Success && result is not SecondFactorRequiredResult;

    public static bool IsLogin(HttpRequest request)
    {
        if (!HttpMethods.IsPost(request.Method))
            return false;
        var path = request.Path.Value?.TrimEnd('/');
        return string.Equals(path, "/api/auth/token", StringComparison.OrdinalIgnoreCase)
               || string.Equals(path, "/api/auth/google-auth-key", StringComparison.OrdinalIgnoreCase);
    }

    public string ClientKey(HttpContext ctx) => ClientKey(ctx, _trustedProxies);

    /// <summary>The rate-limit key of the client, or null when the request is not limited (no peer address, or a
    /// direct loopback call such as Playwright CI). X-Forwarded-For is walked right to left only while each hop is a
    /// trusted proxy: the first untrusted address is the client; if every entry is trusted, the leftmost is. An
    /// unparsable entry stops the walk at the nearest hop known so far. IPv6 clients are keyed on their /64.</summary>
    public static string ClientKey(HttpContext ctx, IReadOnlyList<IPNetwork> trustedProxies)
    {
        var peer = Normalise(ctx.Connection.RemoteIpAddress);
        if (peer == null)
            return null;

        var forwarded = ctx.Request.Headers["X-Forwarded-For"].ToString();
        if (string.IsNullOrWhiteSpace(forwarded))
            return IPAddress.IsLoopback(peer) ? null : Key(peer);

        var client = peer;
        var entries = forwarded.Split(',');
        for (var i = entries.Length - 1; i >= 0 && IsTrusted(client, trustedProxies); i--)
        {
            var hop = Normalise(ParseAddress(entries[i]));
            if (hop == null)
                break;
            client = hop;
        }

        return Key(client);
    }

    public static IReadOnlyList<IPNetwork> ParseNetworks(IEnumerable<string> cidrs) =>
        cidrs.Select(c => IPNetwork.TryParse(c.Trim(), out var n)
                ? n
                : throw new FormatException($"LoginRateLimit:TrustedProxies has an invalid CIDR: '{c}'"))
            .ToList();

    /// <summary>Number of tracked client windows (for tests).</summary>
    public int TrackedClients => _windows.Count;

    private static bool IsTrusted(IPAddress ip, IReadOnlyList<IPNetwork> trustedProxies) =>
        trustedProxies.Any(n => n.Contains(ip));

    /// <summary>Drops windows that have expired and have no login running: once per window length, or at once
    /// when many clients are tracked.</summary>
    private void SweepIfDue(DateTimeOffset now)
    {
        var last = Interlocked.Read(ref _lastSweepTicks);
        if (_windows.Count <= SweepAboveEntries && now.UtcTicks - last < Window.Ticks)
            return;
        if (Interlocked.CompareExchange(ref _lastSweepTicks, now.UtcTicks, last) != last)
            return; // another thread sweeps

        foreach (var (key, window) in _windows)
        {
            lock (window)
            {
                if (window.InFlight > 0 || now - window.Start < Window)
                    continue;
                window.Removed = true;
                _windows.TryRemove(new KeyValuePair<string, ClientWindow>(key, window));
            }
        }
    }

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

    internal sealed class ClientWindow
    {
        public DateTimeOffset Start;
        public int Failures;
        public int InFlight;
        public bool Removed;
    }

    /// <summary>One reserved login slot.</summary>
    public sealed class Attempt
    {
        internal static readonly Attempt Unlimited = new(null);
        private readonly ClientWindow _window;
        private int _ended;

        internal Attempt(ClientWindow window) => _window = window;

        /// <summary>Releases the slot and records a failure when <paramref name="failed"/>. Idempotent.</summary>
        public void End(bool failed)
        {
            if (_window == null || Interlocked.Exchange(ref _ended, 1) == 1)
                return;
            lock (_window)
            {
                _window.InFlight--;
                if (failed) _window.Failures++;
            }
        }
    }
}
