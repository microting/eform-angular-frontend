using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models.DelegatedAccess;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services;

/// <summary>
/// Validates a portal assertion against my.microting.com's published JWKS.
///
/// Written against a hostile caller who can read this file: the endpoint in front of it is
/// public and unauthenticated, so every branch below assumes the input was chosen by an
/// attacker. The order of the checks is deliberate and load-bearing:
///
/// <list type="number">
/// <item>Cheap, allocation-free refusals first (kill switch, misconfiguration, size).</item>
/// <item>The header algorithm is pinned BEFORE the token is otherwise looked at, so
/// <c>alg=none</c> and algorithm substitution die at the door.</item>
/// <item>Cryptographic validation, with keys supplied ONLY from the portal's JWKS.</item>
/// <item>Audience, issuer and claim shape re-asserted on the VALIDATED token.</item>
/// <item>Replay LAST. Burning a <c>jti</c> is a side effect, and side effects must not be
/// reachable by an unauthenticated caller: if the replay check ran first, anyone could
/// pre-burn a <c>jti</c> they guessed and lock a legitimate advisor out.</item>
/// </list>
///
/// Every refusal returns the SAME message. The endpoint is an unauthenticated oracle
/// otherwise — "expired" versus "wrong audience" versus "unknown key" tells an attacker
/// which part of a forgery to fix next. The specific reason is logged, never returned.
/// </summary>
public sealed class DelegatedAssertionValidator(
    IOptions<DelegatedAccessOptions> options,
    IHttpClientFactory httpClientFactory,
    IMemoryCache cache,
    ILogger<DelegatedAssertionValidator> logger) : IDelegatedAssertionValidator
{
    /// <summary>The single, uniform refusal. See the class remarks: no oracle.</summary>
    private const string RejectedMessage = "DelegatedAssertionRejected";

    private const string JwksCachePrefix = "DelegatedAccess:Jwks:";
    private const string JwksCooldownPrefix = "DelegatedAccess:JwksAttemptedAt:";
    private const string JtiCachePrefix = "DelegatedAccess:Jti:";

    /// <summary>Longest attacker-controlled value written to a log line.</summary>
    private const int MaxLoggedValueChars = 128;

    /// <summary>A sign-in assertion is a handful of small claims. Anything larger is not
    /// one, and refusing it early keeps a megabyte POST from reaching the JWT parser.</summary>
    private const int MaxTokenChars = 8 * 1024;

    /// <summary>A JWKS with a plausible number of keys is a few kilobytes. The bound stops
    /// a compromised or impersonated endpoint from streaming us out of memory.</summary>
    private const int MaxJwksBytes = 256 * 1024;

    private static readonly TimeSpan JwksCacheDuration = TimeSpan.FromMinutes(10);

    /// <summary>
    /// Minimum interval between OUTBOUND attempts to the JWKS endpoint. Set BEFORE each
    /// attempt and honoured whatever the attempt's outcome, so a portal that is down does
    /// not cost one outbound request — each holding <see cref="JwksFetchTimeout"/> — per
    /// inbound token. Without that, an unauthenticated caller drives the amplification
    /// simply by posting rubbish repeatedly.
    ///
    /// It is cleared again after a successful COLD-START fetch, and only then: those keys
    /// are now cached for <see cref="JwksCacheDuration"/>, so there is nothing left to
    /// rate-limit, and the one forced refetch that genuine key rotation needs must not be
    /// blocked by our own successful cold start.
    /// </summary>
    private static readonly TimeSpan JwksFetchCooldown = TimeSpan.FromSeconds(30);

    /// <summary>The JWKS fetch happens inside a sign-in request. HttpClient's default
    /// 100 seconds would hang the caller; fail closed quickly instead.</summary>
    private static readonly TimeSpan JwksFetchTimeout = TimeSpan.FromSeconds(10);

    /// <summary>How long a caller waits for someone else's in-flight fetch before giving
    /// up and failing closed. Longer than <see cref="JwksFetchTimeout"/> on purpose: a
    /// waiter that gave up sooner than the fetch it is waiting on would fail a sign-in
    /// that was about to have its keys.</summary>
    private static readonly TimeSpan JwksFetchGateWait = TimeSpan.FromSeconds(15);

    /// <summary>
    /// One fetch per JWKS endpoint in flight at a time, process-wide. Without this,
    /// N CONCURRENT tokens bearing unknown <c>kid</c>s each pass the cooldown check before
    /// any of them has set it, and all N reach the portal: the rate limit above only binds
    /// sequential callers. Waiters reuse whatever the winner put in the cache.
    ///
    /// Keyed by the configured JwksUri, which is configuration and not caller input, so
    /// the dictionary holds one entry per tenant and cannot be grown by an attacker.
    /// </summary>
    private static readonly ConcurrentDictionary<string, SemaphoreSlim> FetchGates = new();

    /// <summary>
    /// Upper bound on an assertion's REMAINING lifetime. The spec says minutes, not hours.
    /// This is not pedantry: the replay cache must retain a <c>jti</c> for as long as the
    /// token stays acceptable, so an absurdly long-lived assertion would otherwise pin
    /// memory, and capping the retention WITHOUT capping the lifetime would open a replay
    /// window after the entry expired. Capping both keeps the two in lockstep.
    /// </summary>
    private static readonly TimeSpan MaxAssertionLifetime = TimeSpan.FromHours(24);

    /// <summary>
    /// Serialises the replay check-and-reserve. <see cref="IMemoryCache"/> has no atomic
    /// add, so a bare TryGetValue-then-Set lets two concurrent requests carrying the SAME
    /// <c>jti</c> both observe "not seen" and both succeed — which is exactly the replay
    /// the cache exists to stop.
    ///
    /// Static because the validator is registered per request: an instance lock would
    /// guard nothing. Process-local, therefore: a multi-replica tenant can still admit one
    /// replay per replica. Closing that needs a shared store (the database or Redis) and
    /// is out of scope here; it is recorded as a known limitation.
    /// </summary>
    private static readonly object ReplayGate = new();

    public async Task<OperationDataResult<DelegatedAssertion>> ValidateAsync(string rawToken, CancellationToken ct)
    {
        // The outermost fail-closed net. Nothing below is allowed to surface an exception
        // to the endpoint: a 500 from a malformed token is both an oracle and a DoS.
        try
        {
            return await ValidateCoreAsync(rawToken, ct);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Delegated assertion refused: unexpected error during validation.");
            return Rejected();
        }
    }

    private async Task<OperationDataResult<DelegatedAssertion>> ValidateCoreAsync(string rawToken, CancellationToken ct)
    {
        var opts = options.Value;

        if (!opts.Enabled)
        {
            logger.LogDebug("Delegated assertion refused: delegated access is disabled on this tenant.");
            return Rejected();
        }

        if (string.IsNullOrWhiteSpace(opts.Issuer)
            || string.IsNullOrWhiteSpace(opts.JwksUri)
            || string.IsNullOrWhiteSpace(opts.Audience))
        {
            // Enabled but half-configured is the dangerous state: an empty ValidAudience
            // or ValidIssuer would otherwise be compared against and could be matched.
            logger.LogError("Delegated access is enabled but Issuer, JwksUri or Audience is not configured. Refusing every assertion.");
            return Rejected();
        }

        if (string.IsNullOrWhiteSpace(rawToken) || rawToken.Length > MaxTokenChars)
        {
            logger.LogDebug("Delegated assertion refused: missing or oversized token.");
            return Rejected();
        }

        var handler = new JwtSecurityTokenHandler
        {
            // Keep the wire claim names. Inbound mapping would rewrite "sub" to the long
            // WS-Federation URI and make the claim reads below quietly wrong.
            MapInboundClaims = false,
            MaximumTokenSizeInBytes = MaxTokenChars
        };

        if (!handler.CanReadToken(rawToken))
        {
            logger.LogDebug("Delegated assertion refused: not a readable JWS.");
            return Rejected();
        }

        JwtSecurityToken unverified;
        try
        {
            unverified = handler.ReadJwtToken(rawToken);
        }
        catch (Exception e)
        {
            logger.LogDebug(e, "Delegated assertion refused: unparseable token.");
            return Rejected();
        }

        // ALGORITHM PINNING, before anything else trusts a byte of this token.
        //
        // This single comparison is what defeats both classic JWT forgeries:
        //   * alg=none  — a token with no signature at all;
        //   * algorithm substitution — an HS256 token whose "shared secret" is the RSA
        //     PUBLIC key, which is published and therefore known to the attacker.
        // Ordinal, and against exactly one value. ValidAlgorithms below says the same
        // thing to the library, and the key set is filtered to asymmetric keys: three
        // independent barriers, because this is the one check that must never be missed.
        if (!string.Equals(unverified.Header.Alg, SecurityAlgorithms.RsaSha256, StringComparison.Ordinal))
        {
            logger.LogWarning("Delegated assertion refused: algorithm {Algorithm} is not permitted.", ForLog(unverified.Header.Alg));
            return Rejected();
        }

        var keys = await ResolveCandidateKeysAsync(opts, unverified.Header.Kid, ct);
        if (keys == null || keys.Count == 0)
        {
            return Rejected();
        }

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = opts.Issuer,
            ValidateAudience = true,
            ValidAudience = opts.Audience,
            ValidateLifetime = true,
            RequireExpirationTime = true,
            RequireSignedTokens = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.FromSeconds(Math.Max(0, opts.ClockSkewSeconds)),
            ValidAlgorithms = [SecurityAlgorithms.RsaSha256],
            // The ONLY source of keys is the portal's JWKS. No configured fallback key, no
            // "issuer signing key" from anywhere else, and emphatically not this tenant's
            // own symmetric EformTokenOptions:SigningKey.
            IssuerSigningKeyResolver = (_, _, _, _) => keys,
            TryAllIssuerSigningKeys = true
        };

        JwtSecurityToken jwt;
        try
        {
            handler.ValidateToken(rawToken, validationParameters, out var validated);
            jwt = validated as JwtSecurityToken;
        }
        catch (Exception e)
        {
            // Signature, issuer, audience, lifetime and algorithm failures all land here.
            logger.LogWarning("Delegated assertion refused: {Reason}", e.Message);
            return Rejected();
        }

        if (jwt == null)
        {
            logger.LogWarning("Delegated assertion refused: validated token was not a JWS.");
            return Rejected();
        }

        // Re-assert on the VALIDATED token rather than trusting the pre-parse above.
        if (!string.Equals(jwt.Header.Alg, SecurityAlgorithms.RsaSha256, StringComparison.Ordinal)
            || !string.Equals(jwt.Issuer, opts.Issuer, StringComparison.Ordinal))
        {
            logger.LogWarning("Delegated assertion refused: algorithm or issuer changed between parse and validation.");
            return Rejected();
        }

        // SINGLE audience, exactly. The library's audience check passes when ANY entry
        // matches, so a multi-audience assertion minted for {1043, 1054} would be accepted
        // at both — which is precisely the cross-tenant replay the design forbids.
        var audiences = jwt.Audiences?.ToList() ?? [];
        if (audiences.Count != 1 || !string.Equals(audiences[0], opts.Audience, StringComparison.Ordinal))
        {
            logger.LogWarning("Delegated assertion refused: audience is not exactly this tenant.");
            return Rejected();
        }

        var subject = jwt.Subject;
        if (string.IsNullOrWhiteSpace(subject))
        {
            logger.LogWarning("Delegated assertion refused: no sub claim.");
            return Rejected();
        }

        var jwtId = jwt.Id;
        if (string.IsNullOrWhiteSpace(jwtId))
        {
            // No jti means no replay defence, so an assertion without one is worthless to
            // us however well it is signed.
            logger.LogWarning("Delegated assertion refused: no jti claim.");
            return Rejected();
        }

        var roleTemplate = ClaimOrEmpty(jwt, DelegatedAssertionClaims.RoleTemplate);
        if (string.IsNullOrWhiteSpace(roleTemplate))
        {
            // REQUIRED, and loudly so. These claim names are this repository's own
            // invention and the portal that mints them lives elsewhere, so a mismatch
            // ("role", "roleTemplate", a typo) would otherwise degrade silently to "" —
            // and the sign-in service trusts this result completely, turning an empty
            // string into whatever its default permissions are, on a customer's tenant.
            // Failing here makes any mismatch show up at the first integration sign-in
            // instead of as a quiet over-grant in production.
            logger.LogWarning("Delegated assertion refused: no role_template claim.");
            return Rejected();
        }

        if (jwt.ValidTo == DateTime.MinValue)
        {
            logger.LogWarning("Delegated assertion refused: no exp claim.");
            return Rejected();
        }

        var expiresAt = new DateTimeOffset(DateTime.SpecifyKind(jwt.ValidTo, DateTimeKind.Utc));
        var skew = TimeSpan.FromSeconds(Math.Max(0, opts.ClockSkewSeconds));

        if (expiresAt - DateTimeOffset.UtcNow > MaxAssertionLifetime)
        {
            logger.LogWarning("Delegated assertion refused: lifetime exceeds {MaxHours}h.", MaxAssertionLifetime.TotalHours);
            return Rejected();
        }

        // REPLAY — last, and atomic. Retained until the assertion stops being acceptable,
        // which is exp PLUS the skew the lifetime check itself allows; retaining only to
        // exp would leave a skew-wide window in which a spent assertion works again.
        if (!TryConsumeJwtId(opts, jwtId, expiresAt + skew))
        {
            logger.LogWarning("Delegated assertion refused: jti {JwtId} has already been used.", ForLog(jwtId));
            return Rejected();
        }

        var assertion = new DelegatedAssertion(
            subject,
            ClaimOrEmpty(jwt, DelegatedAssertionClaims.DisplayName),
            roleTemplate,
            jwtId,
            expiresAt);

        logger.LogInformation(
            "Delegated assertion accepted for subject {Subject} (jti {JwtId}, expires {ExpiresAt:o}).",
            ForLog(subject), ForLog(jwtId), expiresAt);

        return new OperationDataResult<DelegatedAssertion>(true, assertion);
    }

    /// <summary>
    /// Reserves <paramref name="jwtId"/>, returning false if it was already spent.
    /// The check and the reservation happen under one lock, so two concurrent requests
    /// carrying the same assertion cannot both pass.
    /// </summary>
    private bool TryConsumeJwtId(DelegatedAccessOptions opts, string jwtId, DateTimeOffset retainUntil)
    {
        var key = $"{JtiCachePrefix}{opts.Issuer}|{opts.Audience}|{jwtId}";

        lock (ReplayGate)
        {
            if (cache.TryGetValue(key, out _))
            {
                return false;
            }

            cache.Set(key, true, new MemoryCacheEntryOptions { AbsoluteExpiration = retainUntil });
            return true;
        }
    }

    /// <summary>
    /// The portal's published keys that could have signed a token with this
    /// <paramref name="kid"/>, or null if no usable key could be obtained.
    ///
    /// At most ONE outbound request leaves this method, and every outbound request — the
    /// cold-start fetch and the unknown-<c>kid</c> refetch alike — goes through the same
    /// gate, which both coalesces concurrent callers and rate-limits sequential ones.
    /// </summary>
    private async Task<List<SecurityKey>> ResolveCandidateKeysAsync(DelegatedAccessOptions opts, string kid, CancellationToken ct)
    {
        var cached = GetCachedKeys(opts);
        if (cached != null)
        {
            var hit = SelectKeys(cached, kid);
            if (hit.Count > 0)
            {
                return hit;
            }
        }

        // Either nothing is cached, or what is cached does not know this kid. Both need
        // the portal, and both are reachable by an unauthenticated caller, so both go
        // through the gate.
        var fresh = await FetchThroughGateAsync(opts, cached, ct);
        if (fresh == null)
        {
            return null;
        }

        var candidates = SelectKeys(fresh, kid);
        if (candidates.Count == 0)
        {
            logger.LogWarning("Delegated assertion refused: no published key matches kid {Kid}.", ForLog(kid));
            return null;
        }

        return candidates;
    }

    /// <summary>
    /// Obtains a key set newer than <paramref name="staleSnapshot"/>, or null.
    ///
    /// Exactly one caller per JWKS endpoint may be inside the gate, so N concurrent
    /// validations produce ONE outbound request and the rest reuse its result. The
    /// cooldown is written before the attempt, so a failed, slow or rubbish answer costs
    /// the next caller its attempt just as a successful one would.
    /// </summary>
    private async Task<IList<SecurityKey>> FetchThroughGateAsync(
        DelegatedAccessOptions opts, IList<SecurityKey> staleSnapshot, CancellationToken ct)
    {
        var gate = FetchGates.GetOrAdd(opts.JwksUri, _ => new SemaphoreSlim(1, 1));
        var acquired = false;

        try
        {
            acquired = await gate.WaitAsync(JwksFetchGateWait, ct);
            if (!acquired)
            {
                logger.LogWarning("Delegated assertion refused: timed out waiting for the in-flight JWKS fetch.");
                return null;
            }

            // Whoever held the gate may have filled or refreshed the cache while we waited.
            // Anything that is not the snapshot we came in with is news, and asking the
            // portal again for what we have just been handed would be the amplification
            // this gate exists to prevent.
            var afterWait = GetCachedKeys(opts);
            if (afterWait != null && !ReferenceEquals(afterWait, staleSnapshot))
            {
                return afterWait;
            }

            var cooldownKey = JwksCooldownPrefix + opts.JwksUri;
            if (cache.TryGetValue(cooldownKey, out _))
            {
                logger.LogWarning("Delegated assertion refused: the JWKS endpoint was contacted moments ago.");
                return null;
            }

            cache.Set(cooldownKey, true,
                new MemoryCacheEntryOptions { AbsoluteExpirationRelativeToNow = JwksFetchCooldown });

            var keys = await FetchAndCacheKeysAsync(opts, ct);

            if (keys != null && staleSnapshot == null)
            {
                // A cold start that worked: the keys are now cached, so there is nothing
                // left to rate-limit here, and holding the cooldown would delay the one
                // refetch a genuine key rotation needs by up to JwksFetchCooldown.
                cache.Remove(cooldownKey);
            }

            return keys;
        }
        finally
        {
            if (acquired)
            {
                gate.Release();
            }
        }
    }

    /// <summary>The cached key set for this endpoint, or null if there is not a usable one.</summary>
    private IList<SecurityKey> GetCachedKeys(DelegatedAccessOptions opts)
        => cache.TryGetValue(JwksCachePrefix + opts.JwksUri, out IList<SecurityKey> keys) && keys is { Count: > 0 }
            ? keys
            : null;

    /// <summary>
    /// Fetches, parses and caches the key set, or returns null. A failure is deliberately
    /// NOT cached as a negative result — the cooldown already bounds the retry rate, and
    /// caching the failure as well would turn a one-second blip into a longer outage than
    /// it needs to be.
    /// </summary>
    private async Task<IList<SecurityKey>> FetchAndCacheKeysAsync(DelegatedAccessOptions opts, CancellationToken ct)
    {
        var json = await FetchJwksAsync(opts.JwksUri, ct);
        if (json == null)
        {
            // Unreachable, slow, too large or not 2xx. Fail the validation closed: there is
            // no fallback, and an unvalidated token is never accepted.
            return null;
        }

        IList<SecurityKey> keys;
        try
        {
            keys = new JsonWebKeySet(json).GetSigningKeys();
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Could not parse the JWKS served by {JwksUri}.", opts.JwksUri);
            return null;
        }

        if (keys == null || keys.Count == 0)
        {
            logger.LogWarning("The JWKS served by {JwksUri} contains no usable signing key.", opts.JwksUri);
            return null;
        }

        cache.Set(JwksCachePrefix + opts.JwksUri, keys,
            new MemoryCacheEntryOptions { AbsoluteExpirationRelativeToNow = JwksCacheDuration });

        return keys;
    }

    /// <summary>Fetches the JWKS document, or null on any failure. Never throws.</summary>
    private async Task<string> FetchJwksAsync(string jwksUri, CancellationToken ct)
    {
        if (!Uri.TryCreate(jwksUri, UriKind.Absolute, out var uri)
            || (uri.Scheme != Uri.UriSchemeHttps && !(uri.Scheme == Uri.UriSchemeHttp && uri.IsLoopback)))
        {
            // Plain HTTP to a remote host would let anyone on the path substitute the
            // signing keys, which defeats the entire validation. Loopback is allowed so a
            // developer can run a local portal.
            logger.LogError("DelegatedAccess:JwksUri must be an absolute https URI; got {JwksUri}.", jwksUri);
            return null;
        }

        try
        {
            using var timeout = CancellationTokenSource.CreateLinkedTokenSource(ct);
            timeout.CancelAfter(JwksFetchTimeout);

            var client = httpClientFactory.CreateClient();
            using var request = new HttpRequestMessage(HttpMethod.Get, uri);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, timeout.Token);
            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning("JWKS endpoint {JwksUri} answered {StatusCode}.", jwksUri, (int)response.StatusCode);
                return null;
            }

            if (response.Content.Headers.ContentLength > MaxJwksBytes)
            {
                logger.LogWarning("JWKS endpoint {JwksUri} declared {Length} bytes, over the limit.",
                    jwksUri, response.Content.Headers.ContentLength);
                return null;
            }

            await using var stream = await response.Content.ReadAsStreamAsync(timeout.Token);

            // Bounded read: a declared Content-Length is the server's claim, not a promise.
            var buffer = new byte[MaxJwksBytes + 1];
            var total = 0;
            int read;
            while (total < buffer.Length
                   && (read = await stream.ReadAsync(buffer.AsMemory(total, buffer.Length - total), timeout.Token)) > 0)
            {
                total += read;
            }

            if (total > MaxJwksBytes)
            {
                logger.LogWarning("JWKS endpoint {JwksUri} served more than {Limit} bytes.", jwksUri, MaxJwksBytes);
                return null;
            }

            return Encoding.UTF8.GetString(buffer, 0, total);
        }
        catch (Exception e)
        {
            logger.LogWarning(e, "Could not fetch the JWKS from {JwksUri}.", jwksUri);
            return null;
        }
    }

    /// <summary>
    /// The published keys that may be tried for this <paramref name="kid"/>.
    /// Symmetric entries are dropped: a JWKS that (by accident or by compromise) carried an
    /// "oct" key must never become a shared secret an HMAC token could be verified against.
    /// </summary>
    private static List<SecurityKey> SelectKeys(IList<SecurityKey> keys, string kid)
    {
        var asymmetric = keys.Where(IsAsymmetric).ToList();

        return string.IsNullOrEmpty(kid)
            ? asymmetric
            : asymmetric.Where(k => string.Equals(k.KeyId, kid, StringComparison.Ordinal)).ToList();
    }

    private static bool IsAsymmetric(SecurityKey key) => key switch
    {
        null => false,
        JsonWebKey jwk => jwk.Kty is JsonWebAlgorithmsKeyTypes.RSA or JsonWebAlgorithmsKeyTypes.EllipticCurve,
        AsymmetricSecurityKey => true,
        _ => false
    };

    /// <summary>
    /// A payload claim read by its WIRE name. <see cref="JwtSecurityToken.Claims"/> never
    /// applies inbound mapping, so "name" stays "name" here whatever the handler's
    /// mapping settings are.
    /// </summary>
    private static string ClaimOrEmpty(JwtSecurityToken jwt, string claimType)
        => jwt.Claims.FirstOrDefault(c => string.Equals(c.Type, claimType, StringComparison.Ordinal))?.Value ?? "";

    /// <summary>
    /// Renders an attacker-chosen value safe to put in a log line.
    ///
    /// <c>internal</c> rather than <c>private</c> so DelegatedSignInService logs the same
    /// <c>sub</c> and <c>jti</c> through the same sanitiser: a second copy would be a
    /// second thing to forget to fix. Assembly-internal, so it widens nothing outside
    /// eFormAPI.Web.
    ///
    /// A <c>jti</c>, <c>kid</c> or <c>alg</c> comes straight off the wire, and a newline in
    /// one of them forges a whole extra log entry in any line-oriented sink — which is how
    /// an audit trail stops being evidence. Control characters become U+FFFD and the value
    /// is truncated, so a megabyte claim cannot flood the log either.
    /// </summary>
    internal static string ForLog(string value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return "";
        }

        var truncated = value.Length > MaxLoggedValueChars
            ? value[..MaxLoggedValueChars] + "..."
            : value;

        var builder = new StringBuilder(truncated.Length);
        foreach (var c in truncated)
        {
            builder.Append(char.IsControl(c) ? '\uFFFD' : c);
        }

        return builder.ToString();
    }

    private static OperationDataResult<DelegatedAssertion> Rejected()
        => new(false, RejectedMessage);
}
