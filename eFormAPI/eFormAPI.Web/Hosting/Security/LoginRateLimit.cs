using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Hosting.Security;

/// <summary>Settings of <see cref="LoginRateLimit"/>, bound from the <c>LoginRateLimit</c> configuration section
/// (e.g. env <c>LoginRateLimit__FailedAttemptsPerMinute</c>, <c>LoginRateLimit__TrustedProxies__0</c>) and validated
/// at startup.</summary>
public class LoginRateLimitOptions
{
    public static string Section => "LoginRateLimit";

    /// <summary>Failed logins per client per one-minute window before further logins get 429.</summary>
    public int FailedAttemptsPerMinute { get; set; } = 10;

    /// <summary>CIDRs of the proxies whose X-Forwarded-For entries are believed. Null or empty →
    /// <see cref="DefaultTrustedProxies"/>.
    /// <para>The default trusts every private (RFC1918) address, which fits Kubernetes, where the ingress reaches the
    /// pod from the pod network. On a LAN or on-prem install, where clients themselves have private addresses, set
    /// <c>LoginRateLimit__TrustedProxies__0</c> (…<c>__1</c>, …) to the real reverse proxy addresses.</para></summary>
    public string[] TrustedProxies { get; set; }

    /// <summary>How many X-Forwarded-For entries, counted from the right, trusted proxies may vouch for (like
    /// <c>ForwardedHeadersOptions.ForwardLimit</c>). 1 = only the entry the proxy in front of the host wrote; raise it
    /// only for a chain of trusted proxies that each append (e.g. 2 for load balancer + ingress).</summary>
    public int ForwardLimit { get; set; } = 1;

    /// <summary>Exempt a loopback peer that sends no X-Forwarded-For (local test runs). Unset → true in Development,
    /// false elsewhere, where a reverse proxy on localhost that omits X-Forwarded-For would otherwise silently
    /// disable the brake.</summary>
    public bool? ExemptLoopback { get; set; }

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
/// this middleware records it after the endpoint has run. An endpoint that throws also counts (it may have checked
/// the password first). "Second factor required" after a correct password is not a failure.</para></summary>
public sealed class LoginRateLimit : IMiddleware
{
    public static int DefaultMaxTrackedClients => 50_000;

    private const string FailedItemKey = "eFormAPI.LoginRateLimit.Failed";
    private const string OriginalConnectionItemKey = "eFormAPI.LoginRateLimit.OriginalConnection";
    private static readonly TimeSpan Window = TimeSpan.FromMinutes(1);
    private static readonly TimeSpan MinSweepInterval = TimeSpan.FromSeconds(1);

    private readonly int _limit;
    private readonly int _forwardLimit;
    private readonly bool _exemptLoopback;
    private readonly int _maxTrackedClients;
    private readonly IReadOnlyList<IPNetwork> _trustedProxies;
    private readonly TimeProvider _time;
    private readonly ILogger _logger;
    private readonly ConcurrentDictionary<string, ClientWindow> _windows = new();
    private readonly object _admission = new();
    private long _lastSweepTicks;
    private int _warnedAboutLoopback;
    private long _lastTableFullWarningTicks = long.MinValue / 2;

    public LoginRateLimit(IOptions<LoginRateLimitOptions> options, TimeProvider time)
        : this(options, time, NullLogger<LoginRateLimit>.Instance)
    {
    }

    public LoginRateLimit(IOptions<LoginRateLimitOptions> options, TimeProvider time, ILogger<LoginRateLimit> logger)
        : this(options, time, logger, DefaultMaxTrackedClients)
    {
    }

    public LoginRateLimit(IOptions<LoginRateLimitOptions> options, TimeProvider time, ILogger<LoginRateLimit> logger,
        int maxTrackedClients)
    {
        var o = options.Value;
        _limit = o.FailedAttemptsPerMinute;
        _forwardLimit = o.ForwardLimit;
        _exemptLoopback = o.ExemptLoopback ?? false;
        _maxTrackedClients = maxTrackedClients;
        _trustedProxies = ParseNetworks(o.EffectiveTrustedProxies);
        _time = time;
        _logger = logger ?? NullLogger<LoginRateLimit>.Instance;
        _lastSweepTicks = time.GetUtcNow().UtcTicks;
    }

    /// <summary>Binds and validates the options at startup (a bad value stops the host instead of failing every
    /// request) and registers the brake.</summary>
    public static void Register(IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<LoginRateLimitOptions>()
            .Bind(configuration.GetSection(LoginRateLimitOptions.Section))
            .PostConfigure<IHostEnvironment>((o, env) => o.ExemptLoopback ??= env.IsDevelopment())
            .Validate(o => o.FailedAttemptsPerMinute >= 1, "LoginRateLimit:FailedAttemptsPerMinute must be at least 1")
            .Validate(o => o.ForwardLimit >= 1, "LoginRateLimit:ForwardLimit must be at least 1")
            .Validate(o => o.EffectiveTrustedProxies.All(c => c != null && IPNetwork.TryParse(c.Trim(), out _)),
                "LoginRateLimit:TrustedProxies must be CIDRs such as 10.0.0.0/8")
            .ValidateOnStart();
        services.AddSingleton(sp =>
        {
            var options = sp.GetRequiredService<IOptions<LoginRateLimitOptions>>();
            var logger = sp.GetRequiredService<ILogger<LoginRateLimit>>();
            WarnIfLoopbackExemptOutsideDevelopment(options.Value, sp.GetService<IHostEnvironment>(), logger);
            return new LoginRateLimit(options, TimeProvider.System, logger);
        });
    }

    /// <summary>An explicit <c>ExemptLoopback = true</c> outside Development switches the brake off for every login
    /// that reaches the host from localhost without X-Forwarded-For (e.g. a local reverse proxy). Logged once, when
    /// the singleton is created at startup, so the misconfiguration is visible. Returns whether it warned.</summary>
    public static bool WarnIfLoopbackExemptOutsideDevelopment(LoginRateLimitOptions options, IHostEnvironment env,
        ILogger logger)
    {
        if (options.ExemptLoopback != true || env?.IsDevelopment() == true)
        {
            return false;
        }
        logger.LogWarning(
            "SECURITY: LoginRateLimit:ExemptLoopback is true outside Development. Logins from loopback without " +
            "X-Forwarded-For are NOT rate limited; unset it unless this host only serves local test runs");
        return true;
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

        var threw = true; // an endpoint that throws may have checked the password first
        try
        {
            await next(context);
            threw = false;
        }
        finally
        {
            // A client that went away never sees the answer, so it is not a guess — even if the endpoint
            // already marked the login failed (the same rule as the gRPC login).
            attempt.End(!context.RequestAborted.IsCancellationRequested
                         && (threw || context.Items.ContainsKey(FailedItemKey)));
        }
    }

    /// <summary>Reserves a slot for one login of <paramref name="key"/>; the caller must call
    /// <see cref="Attempt.End"/> exactly once, in a finally. A null key (not limited) always succeeds. When
    /// <see cref="DefaultMaxTrackedClients"/> clients are tracked and none can be evicted, a NEW client fails open
    /// (let through, not tracked, not limited) rather than growing the table or locking every new client out —
    /// a flood of distinct keys must not deny service to everyone; known clients keep their limits. A warning is
    /// logged at most once a minute while this happens.</summary>
    public bool TryBegin(string key, out Attempt attempt, out TimeSpan retryAfter)
    {
        attempt = Attempt.Unlimited;
        retryAfter = TimeSpan.Zero;
        if (key == null)
        {
            return true;
        }

        var now = _time.GetUtcNow();
        SweepIfDue(now);
        while (true)
        {
            if (!_windows.TryGetValue(key, out var window))
            {
                // New keys are admitted one at a time, so concurrent new clients cannot overshoot the cap.
                lock (_admission)
                {
                    if (!_windows.TryGetValue(key, out window))
                    {
                        if (_windows.Count >= _maxTrackedClients)
                        {
                            WarnTableFull(now);
                            return true; // fail open: Attempt.Unlimited, not tracked
                        }
                        window = new ClientWindow { Start = now };
                        _windows[key] = window;
                    }
                }
            }

            lock (window)
            {
                if (window.Removed)
                {
                    continue; // swept between lookup and lock: take the fresh entry
                }

                if (now - window.Start >= Window)
                {
                    window.Start = now;
                    window.Failures = 0;
                }

                if (window.Failures + window.InFlight >= _limit)
                {
                    retryAfter = window.Start + Window - now;
                    if (retryAfter < MinSweepInterval)
                    {
                        retryAfter = MinSweepInterval;
                    }
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

    /// <summary>AuthService's answer when the password was right but the second factor is still missing
    /// (AuthService.cs:114, "PSK or code is empty"). AuthService.cs is byte-frozen by the login-path fence, so the
    /// step is recognised here by its text; AuthServiceDisabledAccountTests pins this value to AuthService's real
    /// answer, so a wording change there fails CI.</summary>
    public static string SecondFactorRequiredMessage => "PSK or code is empty";

    /// <summary>A failed login that is a guess: anything not successful, except the "second factor required" step
    /// of a request that carried no code (a correct password; non-web clients first post without a code).</summary>
    public static bool CountsAsFailure(OperationResult result, string requestCode) =>
        !result.Success
        && !(string.IsNullOrEmpty(requestCode) && result.Message == SecondFactorRequiredMessage);

    public static bool IsLogin(HttpRequest request)
    {
        if (!HttpMethods.IsPost(request.Method))
        {
            return false;
        }
        var path = request.Path.Value?.TrimEnd('/');
        return string.Equals(path, "/api/auth/token", StringComparison.OrdinalIgnoreCase)
               || string.Equals(path, "/api/auth/google-auth-key", StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>The client key with this instance's settings; warns once per process when a loopback peer without
    /// X-Forwarded-For is limited (a local reverse proxy that omits the header puts every client in one bucket).</summary>
    public string ClientKey(HttpContext ctx)
    {
        var key = ClientKey(ctx, _trustedProxies, _forwardLimit, _exemptLoopback);
        if (!_exemptLoopback && IsDirectLoopback(ctx) && Interlocked.Exchange(ref _warnedAboutLoopback, 1) == 0)
        {
            _logger.LogWarning(
                "Login rate limit: a login came from a loopback peer without X-Forwarded-For. If a reverse proxy on " +
                "this machine forwards logins, make it send X-Forwarded-For, or all its clients share one limit");
        }
        return key;
    }

    /// <summary>The rate-limit key of the client, or null when the request is not limited (no peer address, or a
    /// loopback peer without X-Forwarded-For when <paramref name="exemptLoopback"/>). X-Forwarded-For is walked from
    /// the right while the current hop is a trusted proxy, at most <paramref name="forwardLimit"/> entries; the last
    /// hop examined is the client, so a trusted proxy vouches only for the entry it wrote and entries a client put
    /// in front are never used. An unparsable entry stops the walk at the nearest hop known so far. IPv6 clients are
    /// keyed on their /64.</summary>
    public static string ClientKey(HttpContext ctx, IReadOnlyList<IPNetwork> trustedProxies) =>
        ClientKey(ctx, trustedProxies, 1, false);

    public static string ClientKey(HttpContext ctx, IReadOnlyList<IPNetwork> trustedProxies, int forwardLimit) =>
        ClientKey(ctx, trustedProxies, forwardLimit, false);

    public static string ClientKey(HttpContext ctx, IReadOnlyList<IPNetwork> trustedProxies, int forwardLimit,
        bool exemptLoopback)
    {
        var (rawPeer, forwarded) = OriginalConnection(ctx);
        var peer = Normalise(rawPeer);
        if (peer == null)
        {
            return null;
        }

        if (string.IsNullOrWhiteSpace(forwarded))
        {
            return exemptLoopback && IPAddress.IsLoopback(peer) ? null : Key(peer);
        }

        var client = peer;
        var entries = forwarded.Split(',');
        for (int i = entries.Length - 1, hops = 0;
             i >= 0 && hops < forwardLimit && IsTrusted(client, trustedProxies);
             i--, hops++)
        {
            var hop = Normalise(ParseAddress(entries[i]));
            if (hop == null)
            {
                break;
            }
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

    private void WarnTableFull(DateTimeOffset now)
    {
        var last = Interlocked.Read(ref _lastTableFullWarningTicks);
        if (now.UtcTicks - last < Window.Ticks
            || Interlocked.CompareExchange(ref _lastTableFullWarningTicks, now.UtcTicks, last) != last)
        {
            return;
        }
        _logger.LogWarning("Login rate-limit table full; new clients are not limited");
    }

    private static bool IsDirectLoopback(HttpContext ctx)
    {
        var (peer, forwarded) = OriginalConnection(ctx);
        return Normalise(peer) is { } p && IPAddress.IsLoopback(p) && string.IsNullOrWhiteSpace(forwarded);
    }

    /// <summary>Stores the TCP peer and the X-Forwarded-For header as they arrived. Must run before anything that
    /// rewrites them (UseForwardedHeaders in Development replaces RemoteIpAddress and consumes header entries),
    /// so the brake keys on what the connection really carried. Registered as the first middleware.</summary>
    public static Task CaptureOriginalConnection(HttpContext context, RequestDelegate next)
    {
        context.Items[OriginalConnectionItemKey] = new CapturedConnection(
            context.Connection.RemoteIpAddress, context.Request.Headers["X-Forwarded-For"].ToString());
        return next(context);
    }

    /// <summary>The captured TCP peer and X-Forwarded-For, or the current ones when nothing was captured.</summary>
    private static (IPAddress Peer, string ForwardedFor) OriginalConnection(HttpContext ctx) =>
        ctx.Items.TryGetValue(OriginalConnectionItemKey, out var value) && value is CapturedConnection original
            ? (original.Peer, original.ForwardedFor)
            : (ctx.Connection.RemoteIpAddress, ctx.Request.Headers["X-Forwarded-For"].ToString());

    private sealed record CapturedConnection(IPAddress Peer, string ForwardedFor);

    private static bool IsTrusted(IPAddress ip, IReadOnlyList<IPNetwork> trustedProxies) =>
        trustedProxies.Any(n => n.Contains(ip));

    /// <summary>Drops windows that have expired and have no login running: once per window length, or sooner when
    /// the table is full — but never more than once per second.</summary>
    private void SweepIfDue(DateTimeOffset now)
    {
        var last = Interlocked.Read(ref _lastSweepTicks);
        var since = now.UtcTicks - last;
        if (since < MinSweepInterval.Ticks || (since < Window.Ticks && _windows.Count < _maxTrackedClients))
        {
            return;
        }
        if (Interlocked.CompareExchange(ref _lastSweepTicks, now.UtcTicks, last) != last)
        {
            return; // another thread sweeps
        }

        foreach (var (key, window) in _windows)
        {
            lock (window)
            {
                if (window.InFlight > 0 || now - window.Start < Window)
                {
                    continue;
                }
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
        if (ip.AddressFamily != AddressFamily.InterNetworkV6 || IPAddress.IsLoopback(ip))
        {
            return ip.ToString();
        }
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
            {
                return;
            }
            lock (_window)
            {
                _window.InFlight--;
                if (failed)
                {
                    _window.Failures++;
                }
            }
        }
    }
}
