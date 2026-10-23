using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Infrastructure.Models.DelegatedAccess;
using eFormAPI.Web.Infrastructure.Models.ExternalLinks;
using eFormAPI.Web.Integration.Tests.Identity;
using eFormAPI.Web.Services;
using eFormAPI.Web.Services.Cache.AuthCache;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services;

/// <summary>
/// The heart of delegated sign-in, over the REAL Identity store: a validated assertion
/// becomes a local principal that holds no credential, and a tenant session for it.
///
/// Substitutes could prove which UserManager method was called; none of them could prove
/// the stored hash is null, that the link row landed under the delegated provider and not
/// P1's, that a tenant-native account with the same address was left alone, or that two
/// concurrent first sign-ins produce one user row. Those are the actual claims, so this
/// uses IdentityTestHost's real UserManager.
///
/// DbTestFixture.ClearDb() truncates a schema this project does not use, so nothing is
/// cleaned up for us: every test uses a GUID-unique subject and hands every row it
/// creates to IdentityTestHost for deletion.
/// </summary>
[TestFixture]
public class DelegatedSignInServiceTests : DbTestFixture
{
    private const string TenantIssuer = "tenant-under-test";

    private static string Subject() => $"portal-sub-{Guid.NewGuid():N}";

    private static DelegatedAssertion Assertion(string subject)
        => Assertion(subject, "Jane Advisor");

    /// <param name="subject">The portal's identifier for the advisor.</param>
    /// <param name="displayName">The audit-only display name. Overloads rather than an
    /// optional parameter because SonarC# S2360 is on in CI.</param>
    private static DelegatedAssertion Assertion(string subject, string displayName)
        => new(subject, displayName, DelegatedSignInService.AdvisorRoleTemplate,
            $"jti-{Guid.NewGuid():N}", DateTimeOffset.UtcNow.AddMinutes(2));

    /// <summary>
    /// The service under test, wired to a REAL AuthService so the token it returns is the
    /// one a password login would get — same claims, same signing key, same issuer. Only
    /// the collaborators GenerateToken never reaches are substituted.
    /// </summary>
    private static DelegatedSignInService BuildService(IdentityTestHost host,
        CapturingLogger<DelegatedSignInService> logger)
    {
        var tokenOptions = Substitute.For<IOptions<EformTokenOptions>>();
        tokenOptions.Value.Returns(new EformTokenOptions
        {
            SigningKey = "delegated-sign-in-test-signing-key-long-enough-for-hmac-sha256",
            Issuer = TenantIssuer
        });

        var appSettings = Substitute.For<IDbOptions<ApplicationSettings>>();
        appSettings.Value.Returns(new ApplicationSettings());

        var claimsService = Substitute.For<IClaimsService>();
        claimsService.GetUserPermissions(Arg.Any<int>(), Arg.Any<bool>())
            .Returns(new List<System.Security.Claims.Claim>());

        var userService = Substitute.For<IUserService>();
        userService.GetFirstUserIdInDb().Returns(1);

        var authService = new AuthService(
            tokenOptions,
            Substitute.For<ILogger<AuthService>>(),
            appSettings,
            host.RoleManager,
            Substitute.For<SignInManager<EformUser>>(
                Substitute.For<UserManager<EformUser>>(
                    Substitute.For<IUserStore<EformUser>>(), null, null, null, null, null, null, null, null),
                Substitute.For<Microsoft.AspNetCore.Http.IHttpContextAccessor>(),
                Substitute.For<IUserClaimsPrincipalFactory<EformUser>>(),
                null, null, null, null),
            host.UserManager,
            userService,
            Substitute.For<ILocalizationService>(),
            claimsService,
            Substitute.For<IAuthCacheService>());

        return new DelegatedSignInService(
            host.UserManager, host.DbContext, authService, userService, logger);
    }

    private async Task<IdentityTestHost> NewHostAsync()
    {
        var host = new IdentityTestHost(DbContext);
        await host.EnsureRoleAsync(EformRole.User);
        await host.EnsureRoleAsync(EformRole.Admin);
        return host;
    }

    /// <summary>A second context on the same database, so the concurrency test runs two
    /// genuinely independent units of work. One DbContext cannot serve two overlapping
    /// operations, so sharing the fixture's would test the harness, not the race.</summary>
    private BaseDbContext NewContext()
    {
        var builder = new DbContextOptionsBuilder<BaseDbContext>();
        builder.UseMySql(ConnectionString,
            new MariaDbServerVersion(ServerVersion.AutoDetect(ConnectionString)));
        return new BaseDbContext(builder.Options);
    }

    private Task<List<IdentityUserLogin<int>>> LinksForAsync(string providerKey)
        => DbContext.Set<IdentityUserLogin<int>>().AsNoTracking()
            .Where(x => x.ProviderKey == providerKey)
            .ToListAsync();

    private Task<EformUser> StoredUserAsync(int userId)
        => DbContext.Users.AsNoTracking().SingleAsync(x => x.Id == userId);

    [Test]
    public async Task SignInAsync_FirstTime_CreatesPrincipalWithNullPasswordHash()
    {
        await using var host = await NewHostAsync();
        var service = BuildService(host, new CapturingLogger<DelegatedSignInService>());

        var result = await service.SignInAsync(Assertion(Subject()), CancellationToken.None);

        Assert.That(result.Success, Is.True, result.Message);
        host.TrackForCleanup(result.Model.Id);
        Assert.That(await host.StoredHashAsync(result.Model.Id), Is.Null,
            "an advisor's local principal must never hold a credential");
    }

    [Test]
    public async Task SignInAsync_FirstTime_LinksOnTheDelegatedProvider()
    {
        await using var host = await NewHostAsync();
        var service = BuildService(host, new CapturingLogger<DelegatedSignInService>());
        var subject = Subject();

        var result = await service.SignInAsync(Assertion(subject), CancellationToken.None);

        Assert.That(result.Success, Is.True, result.Message);
        host.TrackForCleanup(result.Model.Id);

        var links = await LinksForAsync(subject);
        Assert.That(links, Has.Count.EqualTo(1));
        Assert.That(links[0].LoginProvider,
            Is.EqualTo(ExternalLoginProviders.MyMicrotingDelegated));
        Assert.That(links[0].UserId, Is.EqualTo(result.Model.Id));
        // Never P1's namespace: a row there would be a valid target for the password
        // fan-out, which is exactly what the separate provider prevents.
        Assert.That(links[0].LoginProvider, Is.Not.EqualTo(ExternalLoginProviders.MyMicroting));
    }

    [Test]
    public async Task SignInAsync_FirstTime_PutsThePrincipalInTheEformUsersGroup()
    {
        await using var host = await NewHostAsync();
        var service = BuildService(host, new CapturingLogger<DelegatedSignInService>());

        var result = await service.SignInAsync(Assertion(Subject()), CancellationToken.None);

        Assert.That(result.Success, Is.True, result.Message);
        host.TrackForCleanup(result.Model.Id);

        var user = await host.UserManager.FindByIdAsync(result.Model.Id.ToString());
        Assert.That(await host.UserManager.IsInRoleAsync(user, EformRole.User), Is.True);
        Assert.That(result.Model.Role, Is.EqualTo(EformRole.User));
    }

    [Test]
    public async Task SignInAsync_FirstTime_NeverGrantsAdmin()
    {
        await using var host = await NewHostAsync();
        var service = BuildService(host, new CapturingLogger<DelegatedSignInService>());

        var result = await service.SignInAsync(Assertion(Subject()), CancellationToken.None);

        Assert.That(result.Success, Is.True, result.Message);
        host.TrackForCleanup(result.Model.Id);

        var user = await host.UserManager.FindByIdAsync(result.Model.Id.ToString());
        Assert.That(await host.UserManager.IsInRoleAsync(user, EformRole.Admin), Is.False);
        Assert.That(result.Model.Role, Is.Not.EqualTo(EformRole.Admin));
        Assert.That(result.Model.Id, Is.Not.EqualTo(1), "user Id 1 is never a delegated target");
        Assert.That(result.Model.IsFirstUser, Is.False);
    }

    [Test]
    public async Task SignInAsync_FirstTime_StoresNoAdvisorEmailAddress()
    {
        await using var host = await NewHostAsync();
        var service = BuildService(host, new CapturingLogger<DelegatedSignInService>());

        // The worst case for this rule: a portal whose `sub` IS the advisor's address.
        // Even then the customer's database must not end up holding it.
        var address = $"jane.advisor+{Guid.NewGuid():N}@partner.example";

        var result = await service.SignInAsync(
            Assertion(address, "Jane Advisor"), CancellationToken.None);

        Assert.That(result.Success, Is.True, result.Message);
        host.TrackForCleanup(result.Model.Id);

        var stored = await StoredUserAsync(result.Model.Id);
        Assert.That(stored.Email, Is.EqualTo(DelegatedSignInService.SyntheticAddressFor(address)));
        Assert.That(stored.UserName, Is.EqualTo(stored.Email));
        Assert.That(stored.Email, Does.EndWith("@" + DelegatedSignInService.SyntheticAddressDomain));
        Assert.That(stored.Email, Does.Not.Contain("jane.advisor"));
        Assert.That(stored.Email, Does.Not.Contain("partner.example"));
        Assert.That(stored.UserName, Does.Not.Contain(address));
        // The display name is kept — it is the audit attribution — and is never an identifier.
        Assert.That(stored.FirstName, Is.EqualTo("Jane Advisor"));
        Assert.That(stored.LastName, Does.StartWith("(delegated "));
        Assert.That(stored.EmailConfirmed, Is.True, "the host's login gate rejects an unconfirmed row");
    }

    [Test]
    public async Task SignInAsync_SecondTime_ReusesTheSamePrincipal()
    {
        await using var host = await NewHostAsync();
        var service = BuildService(host, new CapturingLogger<DelegatedSignInService>());
        var subject = Subject();

        var first = await service.SignInAsync(Assertion(subject), CancellationToken.None);
        Assert.That(first.Success, Is.True, first.Message);
        host.TrackForCleanup(first.Model.Id);

        // A second, DIFFERENT assertion for the same advisor — a fresh jti, as the portal
        // would mint for a second visit.
        var second = await service.SignInAsync(Assertion(subject), CancellationToken.None);

        Assert.That(second.Success, Is.True, second.Message);
        Assert.That(second.Model.Id, Is.EqualTo(first.Model.Id));
        Assert.That(await LinksForAsync(subject), Has.Count.EqualTo(1));

        var localPart = LocalPartOf(DelegatedSignInService.SyntheticAddressFor(subject));
        Assert.That(await CountUsersStartingWithAsync(localPart), Is.EqualTo(1),
            "a second sign-in must create no second user row");
    }

    [Test]
    public async Task SignInAsync_EmailMatchesTenantNativeUser_DoesNotAdoptIt()
    {
        await using var host = await NewHostAsync();
        var service = BuildService(host, new CapturingLogger<DelegatedSignInService>());
        var subject = Subject();

        // A real account, with a real owner and a real password, that happens to sit on
        // the exact address this tenant would derive for the advisor.
        var address = DelegatedSignInService.SyntheticAddressFor(subject);
        var native = new EformUser
        {
            UserName = address,
            Email = address,
            FirstName = "Tenant",
            LastName = "Native",
            Locale = "en",
            TimeZone = "Europe/Copenhagen",
            Formats = "de-DE",
            EmailConfirmed = true
        };
        var createdNative = await host.UserManager.CreateAsync(native, "native-password");
        Assert.That(createdNative.Succeeded, Is.True,
            string.Join(" ", createdNative.Errors.Select(e => e.Description)));
        host.TrackForCleanup(native.Id);
        var nativeHash = await host.StoredHashAsync(native.Id);

        var result = await service.SignInAsync(Assertion(subject), CancellationToken.None);

        Assert.That(result.Success, Is.True, result.Message);
        host.TrackForCleanup(result.Model.Id);

        Assert.That(result.Model.Id, Is.Not.EqualTo(native.Id),
            "an account with a password and an owner is never adopted");
        Assert.That(await host.StoredHashAsync(native.Id), Is.EqualTo(nativeHash),
            "the tenant-native account must be left exactly as it was");
        Assert.That(await host.StoredHashAsync(result.Model.Id), Is.Null);

        var links = await LinksForAsync(subject);
        Assert.That(links, Has.Count.EqualTo(1));
        Assert.That(links[0].UserId, Is.EqualTo(result.Model.Id));

        var delegatedRow = await StoredUserAsync(result.Model.Id);
        Assert.That(delegatedRow.Email, Is.Not.EqualTo(address));
        Assert.That(delegatedRow.Email,
            Does.EndWith("@" + DelegatedSignInService.SyntheticAddressDomain));
    }

    [Test]
    public async Task SignInAsync_PersonHasAP1Link_CreatesASeparateDelegatedPrincipal()
    {
        await using var host = await NewHostAsync();
        var service = BuildService(host, new CapturingLogger<DelegatedSignInService>());
        var subject = Subject();

        // The same person, already linked on this tenant under P1's namespace — a real
        // account with a password, kept in sync by the password fan-out.
        var p1User = await host.CreateUserAsync("p1-password");
        await host.AddLinkAsync(p1User.Id, ExternalLoginProviders.MyMicroting, subject);
        var p1Hash = await host.StoredHashAsync(p1User.Id);

        var result = await service.SignInAsync(Assertion(subject), CancellationToken.None);

        Assert.That(result.Success, Is.True, result.Message);
        host.TrackForCleanup(result.Model.Id);

        Assert.That(result.Model.Id, Is.Not.EqualTo(p1User.Id),
            "the P1 account has a password; delegated access must not borrow it");
        Assert.That(await host.StoredHashAsync(p1User.Id), Is.EqualTo(p1Hash));
        Assert.That(await host.StoredHashAsync(result.Model.Id), Is.Null);

        // Both namespaces hold the same provider key, for two different local rows. That
        // coexistence is the whole point of the separate provider constant.
        var links = await LinksForAsync(subject);
        Assert.That(links, Has.Count.EqualTo(2));
        Assert.That(links.Single(x => x.LoginProvider == ExternalLoginProviders.MyMicroting).UserId,
            Is.EqualTo(p1User.Id));
        Assert.That(
            links.Single(x => x.LoginProvider == ExternalLoginProviders.MyMicrotingDelegated).UserId,
            Is.EqualTo(result.Model.Id));
    }

    [Test]
    public async Task SignInAsync_TwoConcurrentFirstSignIns_CreateExactlyOnePrincipal()
    {
        await using var host = await NewHostAsync();
        await using var otherContext = NewContext();
        await using var otherHost = new IdentityTestHost(otherContext);

        var subject = Subject();
        var first = BuildService(host, new CapturingLogger<DelegatedSignInService>());
        var second = BuildService(otherHost, new CapturingLogger<DelegatedSignInService>());

        var results = await Task.WhenAll(
            first.SignInAsync(Assertion(subject), CancellationToken.None),
            second.SignInAsync(Assertion(subject), CancellationToken.None));

        // Registered BEFORE the first assert, and by address rather than by result: this
        // test is the one that can leave a second row behind, ClearDb() truncates a schema
        // this project does not use, and a failing assert must not leak a row into a
        // database every later run shares.
        var localPart = LocalPartOf(DelegatedSignInService.SyntheticAddressFor(subject));
        foreach (var id in await IdsOfUsersStartingWithAsync(localPart))
        {
            host.TrackForCleanup(id);
        }

        Assert.That(results[0].Success, Is.True, results[0].Message);
        Assert.That(results[1].Success, Is.True, results[1].Message);

        Assert.That(results[1].Model.Id, Is.EqualTo(results[0].Model.Id),
            "both requests must land on the same local principal");

        var links = await LinksForAsync(subject);
        Assert.That(links, Has.Count.EqualTo(1));

        // The loser's user row must not survive as an orphan either: nothing could ever
        // resolve it, and it would sit in the customer's user list forever.
        Assert.That(await CountUsersStartingWithAsync(localPart), Is.EqualTo(1));
    }

    [Test]
    public async Task SignInAsync_ReturnsATokenWithTheTenantsOwnIssuer()
    {
        await using var host = await NewHostAsync();
        var service = BuildService(host, new CapturingLogger<DelegatedSignInService>());

        var result = await service.SignInAsync(Assertion(Subject()), CancellationToken.None);

        Assert.That(result.Success, Is.True, result.Message);
        host.TrackForCleanup(result.Model.Id);

        var token = new JwtSecurityTokenHandler().ReadJwtToken(result.Model.AccessToken);
        Assert.That(token.Issuer, Is.EqualTo(TenantIssuer),
            "the portal's signature buys a token from THIS tenant, never the portal's own");
        Assert.That(token.Audiences, Does.Contain(TenantIssuer));
        Assert.That(token.Claims.Single(c => c.Type == JwtRegisteredClaimNames.Sub).Value,
            Is.EqualTo(result.Model.Id.ToString()),
            "the token names the LOCAL user id, never the portal's subject");
        Assert.That(token.Claims.Any(c => c.Value == EformRole.User), Is.True);
        Assert.That(token.Claims.Any(c => c.Value == EformRole.Admin), Is.False);
        Assert.That(result.Model.ExpiresIn, Is.GreaterThan(DateTime.Now));
    }

    [Test]
    public async Task SignInAsync_LogsTheSignIn_WithUserIdAndJti_ButNeverTheAssertion()
    {
        await using var host = await NewHostAsync();
        var logger = new CapturingLogger<DelegatedSignInService>();
        var service = BuildService(host, logger);

        // A subject carrying a newline: an attacker-controlled value that would forge a
        // second log entry in any line-oriented sink if it reached the log unsanitised.
        var subject = $"portal-sub-{Guid.NewGuid():N}\nforged entry";
        var assertion = Assertion(subject, "Jane Advisor");

        var result = await service.SignInAsync(assertion, CancellationToken.None);

        Assert.That(result.Success, Is.True, result.Message);
        host.TrackForCleanup(result.Model.Id);

        var entry = logger.Entries.Single(x =>
            x.Level == LogLevel.Information
            && x.Message.StartsWith("Delegated sign-in: localUserId="));

        Assert.That(entry.Message, Does.Contain($"localUserId={result.Model.Id}"));
        Assert.That(entry.Message, Does.Contain(assertion.JwtId));
        Assert.That(entry.Message, Does.Contain("principal=created"));
        Assert.That(entry.Message, Does.Not.Contain("\n"),
            "attacker-controlled values go through ForLog before they reach a log line");
        Assert.That(entry.Message, Does.Not.Contain("DelegatedAssertion"),
            "the assertion object itself is never logged");

        var second = await service.SignInAsync(Assertion(subject), CancellationToken.None);
        Assert.That(second.Success, Is.True, second.Message);
        Assert.That(logger.Entries.Any(x => x.Message.Contains("principal=reused")), Is.True);
    }

    [Test]
    public async Task SignInAsync_UnknownRoleTemplate_RefusesAndCreatesNothing()
    {
        await using var host = await NewHostAsync();
        var service = BuildService(host, new CapturingLogger<DelegatedSignInService>());
        var subject = Subject();

        var result = await service.SignInAsync(
            new DelegatedAssertion(subject, "Jane Advisor", "administrator",
                $"jti-{Guid.NewGuid():N}", DateTimeOffset.UtcNow.AddMinutes(2)),
            CancellationToken.None);

        Assert.That(result.Success, Is.False,
            "the role comes from a template this tenant knows, never from the assertion");
        Assert.That(await LinksForAsync(subject), Is.Empty);

        var localPart = LocalPartOf(DelegatedSignInService.SyntheticAddressFor(subject));
        Assert.That(await CountUsersStartingWithAsync(localPart), Is.Zero);
    }

    private static string LocalPartOf(string address)
        => address[..address.IndexOf('@', StringComparison.Ordinal)];

    private Task<int> CountUsersStartingWithAsync(string emailPrefix)
        => DbContext.Users.AsNoTracking().CountAsync(x => x.Email.StartsWith(emailPrefix));

    private Task<List<int>> IdsOfUsersStartingWithAsync(string emailPrefix)
        => DbContext.Users.AsNoTracking()
            .Where(x => x.Email.StartsWith(emailPrefix))
            .Select(x => x.Id)
            .ToListAsync();

    /// <summary>
    /// Records what was logged. ILogger's extension methods format through the interface,
    /// so this sees exactly the line a real sink would — which is the only way to assert
    /// that a newline in an attacker's `sub` never reaches it.
    /// </summary>
    private sealed class CapturingLogger<T> : ILogger<T>
    {
        public List<(LogLevel Level, string Message)> Entries { get; } = new();

        public IDisposable BeginScope<TState>(TState state) where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state,
            Exception exception, Func<TState, Exception, string> formatter)
            => Entries.Add((logLevel, formatter(state, exception)));
    }
}
