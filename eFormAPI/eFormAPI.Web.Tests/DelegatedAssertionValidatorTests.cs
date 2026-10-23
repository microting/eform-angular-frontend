using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.DelegatedAccess;
using eFormAPI.Web.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Tests;

/// <summary>
/// The validator is the whole trust boundary for delegated sign-in, so these tests are
/// written from the attacker's side: each one is a forgery or a misuse that must be
/// refused, plus the handful of happy paths that must not be broken while refusing them.
///
/// Entirely in-process: an RSA key is generated per test, the JWKS is served by a stubbed
/// <see cref="HttpMessageHandler"/>, and tokens are minted with
/// <see cref="JwtSecurityTokenHandler"/>. Nothing touches the network or a database.
/// </summary>
[TestFixture]
public class DelegatedAssertionValidatorTests
{
    private const string Issuer = "https://my.microting.com";
    private const string JwksUri = "https://my.microting.com/.well-known/jwks.json";
    private const string Audience = "1043";

    private RSA _rsa;
    private string _kid;
    private RsaSecurityKey _signingKey;

    private StubJwksHandler _handler;
    private IHttpClientFactory _httpClientFactory;
    private MemoryCache _cache;
    private DelegatedAccessOptions _options;

    [SetUp]
    public void SetUp()
    {
        _rsa = RSA.Create(2048);
        _kid = "portal-key-" + Guid.NewGuid().ToString("N")[..8];
        _signingKey = new RsaSecurityKey(_rsa) { KeyId = _kid };

        _handler = new StubJwksHandler { Body = JwksFor(_rsa, _kid) };

        _httpClientFactory = Substitute.For<IHttpClientFactory>();
        _httpClientFactory.CreateClient(Arg.Any<string>())
            .Returns(_ => new HttpClient(_handler, disposeHandler: false));

        _cache = new MemoryCache(new MemoryCacheOptions());

        _options = new DelegatedAccessOptions
        {
            Enabled = true,
            Issuer = Issuer,
            JwksUri = JwksUri,
            Audience = Audience,
            ClockSkewSeconds = 60
        };
    }

    [TearDown]
    public void TearDown()
    {
        _cache.Dispose();
        _handler.Dispose();
        _rsa.Dispose();
    }

    private DelegatedAssertionValidator CreateValidator() => new(
        Options.Create(_options),
        _httpClientFactory,
        _cache,
        NullLogger<DelegatedAssertionValidator>.Instance);

    // ----------------------------------------------------------------- happy paths

    [Test]
    public async Task ValidateAsync_WellFormedAssertion_Succeeds()
    {
        var jti = Guid.NewGuid().ToString();
        var token = MintToken(jti: jti, subject: "advisor-77", displayName: "Rikke Advisor",
            roleTemplate: "partner-advisor");

        var result = await CreateValidator().ValidateAsync(token, CancellationToken.None);

        Assert.That(result.Success, Is.True);
        Assert.That(result.Model, Is.Not.Null);
        Assert.That(result.Model.Subject, Is.EqualTo("advisor-77"));
        Assert.That(result.Model.DisplayName, Is.EqualTo("Rikke Advisor"));
        Assert.That(result.Model.RoleTemplate, Is.EqualTo("partner-advisor"));
        Assert.That(result.Model.JwtId, Is.EqualTo(jti));
        Assert.That(result.Model.ExpiresAt, Is.GreaterThan(DateTimeOffset.UtcNow));
    }

    [Test]
    public async Task ValidateAsync_NotYetValid_WithinSkew_Succeeds()
    {
        // nbf 30s in the future, skew 60s: the portal's clock is simply a little ahead.
        var token = MintToken(
            notBefore: DateTime.UtcNow.AddSeconds(30),
            expires: DateTime.UtcNow.AddMinutes(5));

        var result = await CreateValidator().ValidateAsync(token, CancellationToken.None);

        Assert.That(result.Success, Is.True);
        Assert.That(result.Model, Is.Not.Null);
    }

    [Test]
    public async Task ValidateAsync_TwoAssertions_FetchesTheJwksOnlyOnce()
    {
        var validator = CreateValidator();

        var first = await validator.ValidateAsync(MintToken(), CancellationToken.None);
        var second = await validator.ValidateAsync(MintToken(), CancellationToken.None);

        Assert.That(first.Success, Is.True);
        Assert.That(second.Success, Is.True);
        Assert.That(_handler.RequestCount, Is.EqualTo(1), "the key set must be cached, not refetched per sign-in");
    }

    [Test]
    public async Task ValidateAsync_RotatedSigningKey_RefetchesTheJwks_AndSucceeds()
    {
        var validator = CreateValidator();
        Assert.That((await validator.ValidateAsync(MintToken(), CancellationToken.None)).Success, Is.True);

        using var rotated = RSA.Create(2048);
        const string rotatedKid = "portal-key-rotated";
        _handler.Body = JwksFor(rotated, rotatedKid);

        var token = MintToken(credentials: new SigningCredentials(
            new RsaSecurityKey(rotated) { KeyId = rotatedKid }, SecurityAlgorithms.RsaSha256));

        var result = await validator.ValidateAsync(token, CancellationToken.None);

        Assert.That(result.Success, Is.True);
        Assert.That(_handler.RequestCount, Is.EqualTo(2));
    }

    // ----------------------------------------------------------------- claim checks

    [Test]
    public async Task ValidateAsync_WrongAudience_Fails()
    {
        // Signed by the real portal key, perfectly valid — but minted for customer 1054.
        var token = MintToken(audience: "1054");

        var result = await CreateValidator().ValidateAsync(token, CancellationToken.None);

        AssertRefused(result);
    }

    [Test]
    public async Task ValidateAsync_MultipleAudiences_Fails()
    {
        // Includes this tenant, so the library's any-match audience check would pass.
        // A delegated assertion is single-audience by design and must be refused.
        var token = MintToken(extraAudiences: ["1054"]);

        // Guard the guard: if minting ever stopped producing two audiences this test
        // would pass for the wrong reason and the real check would be untested.
        Assert.That(new JwtSecurityTokenHandler().ReadJwtToken(token).Audiences.ToList(),
            Is.EquivalentTo(new[] { Audience, "1054" }));

        var result = await CreateValidator().ValidateAsync(token, CancellationToken.None);

        AssertRefused(result);
    }

    [Test]
    public async Task ValidateAsync_WrongIssuer_Fails()
    {
        var token = MintToken(issuer: "https://evil.example.com");

        var result = await CreateValidator().ValidateAsync(token, CancellationToken.None);

        AssertRefused(result);
    }

    [Test]
    public async Task ValidateAsync_Expired_Fails()
    {
        var token = MintToken(
            notBefore: DateTime.UtcNow.AddMinutes(-10),
            expires: DateTime.UtcNow.AddMinutes(-5));

        var result = await CreateValidator().ValidateAsync(token, CancellationToken.None);

        AssertRefused(result);
    }

    [Test]
    public async Task ValidateAsync_MissingSubClaim_Fails()
    {
        var token = MintToken(subject: null);

        var result = await CreateValidator().ValidateAsync(token, CancellationToken.None);

        AssertRefused(result);
    }

    [Test]
    public async Task ValidateAsync_MissingJtiClaim_Fails()
    {
        // No jti means no replay key, so the assertion could be reused for ever.
        var token = MintToken(includeJti: false);

        var result = await CreateValidator().ValidateAsync(token, CancellationToken.None);

        AssertRefused(result);
    }

    [Test]
    public async Task ValidateAsync_LifetimeBeyondTheCap_Fails()
    {
        var token = MintToken(expires: DateTime.UtcNow.AddDays(30));

        var result = await CreateValidator().ValidateAsync(token, CancellationToken.None);

        AssertRefused(result);
    }

    // ----------------------------------------------------------------- signature forgeries

    [Test]
    public async Task ValidateAsync_SignedByUnknownKey_Fails()
    {
        using var attackerKey = RSA.Create(2048);
        var token = MintToken(credentials: new SigningCredentials(
            new RsaSecurityKey(attackerKey) { KeyId = "attacker-key" }, SecurityAlgorithms.RsaSha256));

        var result = await CreateValidator().ValidateAsync(token, CancellationToken.None);

        AssertRefused(result);
    }

    [Test]
    public async Task ValidateAsync_SignedByUnknownKey_RefetchesTheJwksAtMostOnce()
    {
        var validator = CreateValidator();
        Assert.That((await validator.ValidateAsync(MintToken(), CancellationToken.None)).Success, Is.True);

        using var attackerKey = RSA.Create(2048);
        for (var i = 0; i < 5; i++)
        {
            var token = MintToken(credentials: new SigningCredentials(
                new RsaSecurityKey(attackerKey) { KeyId = "attacker-key-" + i }, SecurityAlgorithms.RsaSha256));

            AssertRefused(await validator.ValidateAsync(token, CancellationToken.None));
        }

        // One priming fetch plus ONE forced refetch. The cooldown stops a flood of unknown
        // kids from turning this tenant into an amplifier against the portal.
        Assert.That(_handler.RequestCount, Is.EqualTo(2));
    }

    [Test]
    public async Task ValidateAsync_UnsignedOrAlgNone_Fails()
    {
        var payload = JsonSerializer.Serialize(new Dictionary<string, object>
        {
            ["iss"] = Issuer,
            ["aud"] = Audience,
            ["sub"] = "advisor-77",
            ["jti"] = Guid.NewGuid().ToString(),
            ["name"] = "Rikke Advisor",
            ["role_template"] = "partner-advisor",
            ["nbf"] = EpochSeconds(DateTime.UtcNow.AddMinutes(-1)),
            ["exp"] = EpochSeconds(DateTime.UtcNow.AddMinutes(5))
        });

        var unsigned =
            Base64UrlEncoder.Encode("{\"alg\":\"none\",\"typ\":\"JWT\",\"kid\":\"" + _kid + "\"}")
            + "." + Base64UrlEncoder.Encode(payload) + ".";

        var result = await CreateValidator().ValidateAsync(unsigned, CancellationToken.None);

        AssertRefused(result);
        Assert.That(_handler.RequestCount, Is.Zero, "an alg=none token must die before the JWKS is even fetched");
    }

    [Test]
    public async Task ValidateAsync_HmacSignedWithThePortalPublicKeyAsSecret_Fails()
    {
        // Algorithm substitution: the RSA public key is published, so an attacker can use
        // it as an HMAC secret. Accepting HS256 here would let anyone mint assertions.
        var publicKey = _rsa.ExportSubjectPublicKeyInfo();
        var token = MintToken(credentials: new SigningCredentials(
            new SymmetricSecurityKey(publicKey) { KeyId = _kid }, SecurityAlgorithms.HmacSha256));

        var result = await CreateValidator().ValidateAsync(token, CancellationToken.None);

        AssertRefused(result);
    }

    [Test]
    public async Task ValidateAsync_TamperedPayload_Fails()
    {
        var parts = MintToken(subject: "advisor-77").Split('.');
        var payload = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(
            Encoding.UTF8.GetString(Base64UrlEncoder.DecodeBytes(parts[1])));
        payload["sub"] = JsonSerializer.SerializeToElement("advisor-escalated");

        var tampered = parts[0]
            + "." + Base64UrlEncoder.Encode(JsonSerializer.Serialize(payload))
            + "." + parts[2];

        var result = await CreateValidator().ValidateAsync(tampered, CancellationToken.None);

        AssertRefused(result);
    }

    [TestCase("")]
    [TestCase("   ")]
    [TestCase("not-a-token")]
    [TestCase("a.b.c")]
    public async Task ValidateAsync_MalformedToken_Fails(string raw)
    {
        var result = await CreateValidator().ValidateAsync(raw, CancellationToken.None);

        AssertRefused(result);
    }

    [Test]
    public async Task ValidateAsync_NullToken_Fails()
    {
        var result = await CreateValidator().ValidateAsync(null, CancellationToken.None);

        AssertRefused(result);
    }

    // ----------------------------------------------------------------- replay

    [Test]
    public async Task ValidateAsync_SameJtiTwice_SecondFails()
    {
        var validator = CreateValidator();
        var token = MintToken();

        var first = await validator.ValidateAsync(token, CancellationToken.None);
        var second = await validator.ValidateAsync(token, CancellationToken.None);

        Assert.That(first.Success, Is.True);
        AssertRefused(second);
    }

    [Test]
    public async Task ValidateAsync_SameJtiOnADifferentToken_SecondFails()
    {
        var validator = CreateValidator();
        var jti = Guid.NewGuid().ToString();

        var first = await validator.ValidateAsync(MintToken(jti: jti), CancellationToken.None);
        var second = await validator.ValidateAsync(MintToken(jti: jti, subject: "advisor-other"), CancellationToken.None);

        Assert.That(first.Success, Is.True);
        AssertRefused(second);
    }

    [Test]
    public async Task ValidateAsync_SameJtiConcurrently_OnlyOneSucceeds()
    {
        var validator = CreateValidator();
        var token = MintToken();

        // Prime the JWKS cache so the race is purely over the jti reservation.
        var warmUp = await validator.ValidateAsync(MintToken(), CancellationToken.None);
        Assert.That(warmUp.Success, Is.True);

        var attempts = Enumerable.Range(0, 16)
            .Select(_ => Task.Run(() => validator.ValidateAsync(token, CancellationToken.None)))
            .ToArray();

        var results = await Task.WhenAll(attempts);

        Assert.That(results.Count(r => r.Success), Is.EqualTo(1),
            "a jti must be consumable exactly once, even under concurrency");
    }

    [Test]
    public async Task ValidateAsync_RejectedAssertion_DoesNotConsumeItsJti()
    {
        // A refusal must not burn the jti: otherwise anyone could pre-send a guessed or
        // sniffed assertion to a tenant it was not minted for and lock the advisor out.
        var jti = Guid.NewGuid().ToString();
        var validator = CreateValidator();

        AssertRefused(await validator.ValidateAsync(MintToken(jti: jti, audience: "1054"), CancellationToken.None));

        var result = await validator.ValidateAsync(MintToken(jti: jti), CancellationToken.None);

        Assert.That(result.Success, Is.True);
    }

    // ----------------------------------------------------------------- JWKS failures

    [Test]
    public async Task ValidateAsync_JwksUnreachable_FailsClosedWithoutThrowing()
    {
        _handler.Thrower = () => throw new HttpRequestException("the portal is down");

        var result = await CreateValidator().ValidateAsync(MintToken(), CancellationToken.None);

        AssertRefused(result);
    }

    [Test]
    public async Task ValidateAsync_JwksReturnsServerError_FailsClosed()
    {
        _handler.StatusCode = HttpStatusCode.InternalServerError;
        _handler.Body = "nope";

        var result = await CreateValidator().ValidateAsync(MintToken(), CancellationToken.None);

        AssertRefused(result);
    }

    [Test]
    public async Task ValidateAsync_JwksIsGarbage_FailsClosed()
    {
        _handler.Body = "<html>not a key set</html>";

        var result = await CreateValidator().ValidateAsync(MintToken(), CancellationToken.None);

        AssertRefused(result);
    }

    [Test]
    public async Task ValidateAsync_JwksIsEmptyKeySet_FailsClosed()
    {
        _handler.Body = "{\"keys\":[]}";

        var result = await CreateValidator().ValidateAsync(MintToken(), CancellationToken.None);

        AssertRefused(result);
    }

    [Test]
    public async Task ValidateAsync_JwksFailureIsNotCached_SoARecoveredPortalWorks()
    {
        var validator = CreateValidator();
        _handler.Thrower = () => throw new HttpRequestException("the portal is down");

        AssertRefused(await validator.ValidateAsync(MintToken(), CancellationToken.None));

        _handler.Thrower = null;
        var result = await validator.ValidateAsync(MintToken(), CancellationToken.None);

        Assert.That(result.Success, Is.True);
    }

    // ----------------------------------------------------------------- configuration gates

    [Test]
    public async Task ValidateAsync_DelegatedAccessDisabled_FailsWithoutFetchingTheJwks()
    {
        _options.Enabled = false;

        var result = await CreateValidator().ValidateAsync(MintToken(), CancellationToken.None);

        AssertRefused(result);
        Assert.That(_handler.RequestCount, Is.Zero);
    }

    [TestCase("", JwksUri, Audience)]
    [TestCase(Issuer, "", Audience)]
    [TestCase(Issuer, JwksUri, "")]
    public async Task ValidateAsync_HalfConfigured_Fails(string issuer, string jwksUri, string audience)
    {
        _options.Issuer = issuer;
        _options.JwksUri = jwksUri;
        _options.Audience = audience;

        var result = await CreateValidator().ValidateAsync(MintToken(), CancellationToken.None);

        AssertRefused(result);
        Assert.That(_handler.RequestCount, Is.Zero);
    }

    [Test]
    public async Task ValidateAsync_JwksUriIsPlainHttpOnARemoteHost_FailsWithoutFetching()
    {
        // A MITM on a plaintext JWKS fetch can substitute the signing keys outright.
        _options.JwksUri = "http://my.microting.com/.well-known/jwks.json";

        var result = await CreateValidator().ValidateAsync(MintToken(), CancellationToken.None);

        AssertRefused(result);
        Assert.That(_handler.RequestCount, Is.Zero);
    }

    // ----------------------------------------------------------------- helpers

    private static void AssertRefused(OperationDataResult<DelegatedAssertion> result)
    {
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Success, Is.False);
        Assert.That(result.Model, Is.Null, "a refusal must never hand back a partially validated assertion");
    }

    private string MintToken(
        string issuer = Issuer,
        string audience = Audience,
        string subject = "advisor-77",
        string jti = null,
        string displayName = "Rikke Advisor",
        string roleTemplate = "partner-advisor",
        DateTime? notBefore = null,
        DateTime? expires = null,
        SigningCredentials credentials = null,
        IEnumerable<string> extraAudiences = null,
        bool includeJti = true)
    {
        var claims = new List<Claim>();
        if (subject != null)
        {
            claims.Add(new Claim("sub", subject));
        }

        if (includeJti)
        {
            claims.Add(new Claim("jti", jti ?? Guid.NewGuid().ToString()));
        }
        claims.Add(new Claim("name", displayName));
        claims.Add(new Claim("role_template", roleTemplate));

        foreach (var extra in extraAudiences ?? [])
        {
            claims.Add(new Claim("aud", extra));
        }

        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            notBefore ?? DateTime.UtcNow.AddMinutes(-1),
            expires ?? DateTime.UtcNow.AddMinutes(5),
            credentials ?? new SigningCredentials(_signingKey, SecurityAlgorithms.RsaSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static long EpochSeconds(DateTime utc) => new DateTimeOffset(utc, TimeSpan.Zero).ToUnixTimeSeconds();

    private static string JwksFor(RSA rsa, string kid)
    {
        var parameters = rsa.ExportParameters(false);

        return JsonSerializer.Serialize(new
        {
            keys = new[]
            {
                new
                {
                    kty = "RSA",
                    use = "sig",
                    alg = "RS256",
                    kid,
                    n = Base64UrlEncoder.Encode(parameters.Modulus),
                    e = Base64UrlEncoder.Encode(parameters.Exponent)
                }
            }
        });
    }

    /// <summary>Serves the JWKS in-process and counts how often it was asked.</summary>
    private sealed class StubJwksHandler : HttpMessageHandler
    {
        private int _requestCount;

        public string Body { get; set; } = "{\"keys\":[]}";
        public HttpStatusCode StatusCode { get; set; } = HttpStatusCode.OK;
        public Action Thrower { get; set; }

        public int RequestCount => Volatile.Read(ref _requestCount);

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Interlocked.Increment(ref _requestCount);
            Thrower?.Invoke();

            return Task.FromResult(new HttpResponseMessage(StatusCode)
            {
                Content = new StringContent(Body, Encoding.UTF8, "application/json")
            });
        }
    }
}
