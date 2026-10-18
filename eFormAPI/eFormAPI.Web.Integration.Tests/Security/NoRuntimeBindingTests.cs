using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Infrastructure.Models.Auth;
using eFormAPI.Web.Infrastructure.Models.ExternalLinks;
using eFormAPI.Web.Integration.Tests.Identity;
using eFormAPI.Web.Services;
using eFormAPI.Web.Services.Cache.AuthCache;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Security;

/// <summary>
/// REQUIREMENT 1, asserted mechanically: no runtime binding.
///
/// Login stays email-or-username plus password, hashed and verified locally by this
/// installation's own Identity stack. The acceptance test is blunt: if my.microting.com
/// disappeared permanently, every login here must keep working, with the same passwords,
/// forever. The only capability the feature adds is that an authorised caller can SET a
/// password on an account identified by a link — never that a link is consulted to let
/// anyone in, and never that a missing link keeps anyone out.
///
/// This fixture asserts the stored-credential half of that, against the real Identity
/// store: an account with no link at all (the overwhelmingly common case — links are
/// rare), an account with a link, an account whose link was torn out, and a whole set of
/// accounts whose links were all torn out at once. Password verification is asserted at
/// UserManager.CheckPasswordAsync, which is the layer that actually verifies a password;
/// IdentityTestHost's container registers no HttpClient for any host, so there is no
/// network for a verification to reach even if someone added a call.
///
/// The other half — that the LOGIN PATH never reaches for a link even when one is sitting
/// there answering — is asserted behaviourally against the real AuthService in
/// <see cref="LoginPathNeverConsultsALinkTests"/> below, and textually over the source in
/// <see cref="NoRuntimeBindingSourceTests"/>.
///
/// Fixture hygiene: DbTestFixture.ClearDb() truncates a hardcoded "eformsdk-tests" schema
/// while this project connects to "angular-tests", so it silently no-ops and rows survive
/// the run. Hence GUID-unique emails, never a fixed Id, and IdentityTestHost deletes what
/// it created. Link rows are deleted through the CHANGE TRACKER, never with
/// ExecuteDeleteAsync: the tracker still holds the row AddLinkAsync added, so deleting it
/// out from under EF makes the cascading delete of the user in DisposeAsync report zero
/// affected rows, which surfaces as a DbUpdateConcurrencyException that teardown swallows
/// — and the user leaks. That trap cost Task 8 a leaked fixture; it is not repeated here.
/// </summary>
[TestFixture]
public class NoRuntimeBindingTests : DbTestFixture
{
    private const string Password = "correct-horse";

    private static Task<int> LinkCountAsync(IdentityTestHost host, int userId)
        => host.DbContext.Set<IdentityUserLogin<int>>().AsNoTracking()
            .CountAsync(x => x.UserId == userId);

    /// <summary>
    /// Deletes a user's link rows the way production would: through the change tracker, so
    /// EF and the database agree about what exists afterwards.
    /// </summary>
    private static async Task TearOutLinksAsync(IdentityTestHost host, params int[] userIds)
    {
        var rows = await host.DbContext.Set<IdentityUserLogin<int>>()
            .Where(x => userIds.Contains(x.UserId))
            .ToListAsync();
        host.DbContext.Set<IdentityUserLogin<int>>().RemoveRange(rows);
        await host.DbContext.SaveChangesAsync();
    }

    // The common case, and the one a runtime binding would break first: the overwhelming
    // majority of accounts on any tenant have no link at all, and they must be completely
    // untouched by the feature existing.
    [Test]
    public async Task AnAccountWithNoLinkAtAllVerifiesItsPasswordNormally()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync(Password);

        var reread = await host.UserManager.FindByIdAsync(user.Id.ToString());

        Assert.That(await LinkCountAsync(host, user.Id), Is.Zero,
            "this account is deliberately unlinked — that is the case under test");
        Assert.That(await host.UserManager.GetLoginsAsync(reread), Is.Empty);
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, Password), Is.True,
            "an account with no link must log in exactly as it always did");
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, "wrong"), Is.False,
            "and a wrong password must still be refused");
    }

    // Check 2: a linked account logs in with no outbound HTTP available, and creating the
    // link did not touch the credential — linking is a pointer, not a password change.
    [Test]
    public async Task ALinkedAccountVerifiesItsPasswordWithNoNetwork()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync(Password);
        var hashBeforeLinking = await host.StoredHashAsync(user.Id);
        var stampBeforeLinking = await host.StoredSecurityStampAsync(user.Id);

        await host.AddLinkAsync(user.Id, ExternalLoginProviders.MyMicroting, "4821",
            "my.microting.com | portal@example.test | linked");

        var reread = await host.UserManager.FindByIdAsync(user.Id.ToString());

        Assert.That(await LinkCountAsync(host, user.Id), Is.EqualTo(1),
            "the link fixture must actually exist, or this test proves nothing");
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, Password), Is.True);
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, "wrong"), Is.False,
            "a link is not a credential: it must not make a wrong password work");
        Assert.That(await host.StoredHashAsync(user.Id), Is.EqualTo(hashBeforeLinking),
            "creating a link must not touch the password hash");
        Assert.That(await host.StoredSecurityStampAsync(user.Id), Is.EqualTo(stampBeforeLinking),
            "creating a link must not rotate the security stamp");
    }

    // Check 3: unlinking is NOT a lockout. Tearing the row out changes nothing.
    [Test]
    public async Task RemovingTheLinkLeavesThePasswordWorkingIdentically()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync(Password);
        await host.AddLinkAsync(user.Id, ExternalLoginProviders.MyMicroting, "4821");
        var hashBefore = await host.StoredHashAsync(user.Id);

        await TearOutLinksAsync(host, user.Id);

        var reread = await host.UserManager.FindByIdAsync(user.Id.ToString());
        Assert.That(await LinkCountAsync(host, user.Id), Is.Zero,
            "the link row must really be gone, or this test proves nothing");
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, Password), Is.True,
            "unlinking must never be a lockout");
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, "wrong"), Is.False,
            "and unlinking must not turn the account into a free-for-all either");
        Assert.That(await host.StoredHashAsync(user.Id), Is.EqualTo(hashBefore),
            "removing a link must not touch the password hash");
    }

    // The literal acceptance test: my.microting.com disappears permanently, every link row
    // it ever wrote is torn out, and every account on the tenant still logs in with the
    // same password — the linked ones and the never-linked one alike.
    [Test]
    public async Task EveryAccountStillLogsInAfterEveryLinkIsTornOut()
    {
        await using var host = new IdentityTestHost(DbContext);
        var linkedOne = await host.CreateUserAsync(Password);
        var linkedTwo = await host.CreateUserAsync("second-password");
        var neverLinked = await host.CreateUserAsync("third-password");

        await host.AddLinkAsync(linkedOne.Id, ExternalLoginProviders.MyMicroting, "4821");
        await host.AddLinkAsync(linkedTwo.Id, ExternalLoginProviders.MyMicroting, "4822");
        Assert.That(await LinkCountAsync(host, linkedOne.Id), Is.EqualTo(1));
        Assert.That(await LinkCountAsync(host, linkedTwo.Id), Is.EqualTo(1));

        var hashes = new Dictionary<int, string>
        {
            [linkedOne.Id] = await host.StoredHashAsync(linkedOne.Id),
            [linkedTwo.Id] = await host.StoredHashAsync(linkedTwo.Id),
            [neverLinked.Id] = await host.StoredHashAsync(neverLinked.Id)
        };

        await TearOutLinksAsync(host, linkedOne.Id, linkedTwo.Id, neverLinked.Id);

        foreach (var (user, password) in new[]
                 {
                     (linkedOne, Password), (linkedTwo, "second-password"),
                     (neverLinked, "third-password")
                 })
        {
            var reread = await host.UserManager.FindByIdAsync(user.Id.ToString());
            Assert.That(await LinkCountAsync(host, user.Id), Is.Zero);
            Assert.That(await host.UserManager.CheckPasswordAsync(reread, password), Is.True,
                $"user {user.Id} must still log in with the same password after the links are gone");
            Assert.That(await host.UserManager.CheckPasswordAsync(reread, "wrong"), Is.False,
                $"user {user.Id} must still refuse a wrong password after the links are gone");
            Assert.That(await host.StoredHashAsync(user.Id), Is.EqualTo(hashes[user.Id]),
                $"user {user.Id}'s stored hash must be byte-identical to before the links were torn out");
        }
    }

    // The production link write and the production link delete, end to end: the real
    // ExternalUserLinkService, against the real store. This is the path that actually runs
    // the day my.microting.com is decommissioned and an administrator unlinks the tenant's
    // accounts, so it is the one that must provably leave every credential alone.
    [Test]
    public async Task TheRealLinkCreateAndDeleteNeverTouchTheCredential()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync(Password);
        var hashBefore = await host.StoredHashAsync(user.Id);
        var stampBefore = await host.StoredSecurityStampAsync(user.Id);

        var localization = Substitute.For<ILocalizationService>();
        localization.GetString(Arg.Any<string>()).Returns(args => args.Arg<string>());
        var service = new ExternalUserLinkService(
            host.UserManager,
            host.DbContext,
            Substitute.For<IUserService>(),
            localization,
            Substitute.For<ILogger<ExternalUserLinkService>>());

        var created = await service.CreateLink(new CreateExternalUserLinkModel
        {
            LoginProvider = ExternalLoginProviders.MyMicroting,
            ProviderKey = "4821",
            ProviderDisplayName = "my.microting.com | portal@example.test",
            TargetUserId = user.Id
        });

        Assert.That(created.Success, Is.True, created.Message);
        Assert.That(await LinkCountAsync(host, user.Id), Is.EqualTo(1));
        Assert.That(await host.StoredHashAsync(user.Id), Is.EqualTo(hashBefore),
            "creating a link through the real service must not touch the password hash");
        Assert.That(await host.StoredSecurityStampAsync(user.Id), Is.EqualTo(stampBefore),
            "creating a link through the real service must not rotate the security stamp");

        var deleted = await service.DeleteLink(new DeleteExternalUserLinkModel
        {
            LoginProvider = ExternalLoginProviders.MyMicroting,
            ProviderKey = "4821"
        });

        Assert.That(deleted.Success, Is.True, deleted.Message);
        Assert.That(await LinkCountAsync(host, user.Id), Is.Zero,
            "the real delete must really remove the row, or this test proves nothing");
        Assert.That(await host.StoredHashAsync(user.Id), Is.EqualTo(hashBefore),
            "unlinking through the real service must not touch the password hash");

        // Identity DOES rotate the security stamp here: UserManager.RemoveLoginAsync calls
        // UpdateSecurityStampInternal, while AddLoginAsync does not — hence the asymmetry
        // between this assertion and the one above. Pinned rather than ignored so the
        // behaviour is on the record, and because it is harmless twice over: the stamp is
        // not the credential, and this host does not validate it yet (decision D-2). The
        // day it does, unlinking will end that account's open sessions and it will still
        // log in with the same password — which is the next assertion.
        Assert.That(await host.StoredSecurityStampAsync(user.Id), Is.Not.EqualTo(stampBefore),
            "Identity rotates the stamp on RemoveLoginAsync; if that changed, update the note above");

        var reread = await host.UserManager.FindByIdAsync(user.Id.ToString());
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, Password), Is.True,
            "the account must still log in with the same password after the real unlink");
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, "wrong"), Is.False);
    }

    // A link that does not resolve must not resolve to SOMEONE: a stale providerKey, or a
    // row for a provider this host does not accept, is simply not a credential for anyone.
    [Test]
    public async Task AStaleOrForeignLinkResolvesToNobody()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync(Password);
        await host.AddLinkAsync(user.Id, ExternalLoginProviders.MyMicroting, "4821");

        Assert.That(
            await host.UserManager.FindByLoginAsync(ExternalLoginProviders.MyMicroting, "4821"),
            Is.Not.Null, "the fixture link must resolve, or this test proves nothing");
        Assert.That(
            await host.UserManager.FindByLoginAsync(ExternalLoginProviders.MyMicroting, "9999"),
            Is.Null, "an unknown providerKey must resolve to nobody, not to a nearby account");
        Assert.That(
            await host.UserManager.FindByLoginAsync("Google", "4821"),
            Is.Null, "a providerKey must never be matched across providers");

        var reread = await host.UserManager.FindByIdAsync(user.Id.ToString());
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, "4821"), Is.False,
            "a providerKey is not a password");
    }
}

/// <summary>
/// The login path itself, exercised end to end: AuthService.AuthenticateUser with a link
/// sitting right there, answering.
///
/// The source fences below forbid the login path from MENTIONING a link. These tests
/// forbid it from USING one, which is the property the fences are a proxy for. The
/// UserManager is a substitute, so every external-login API on it is observable: a login
/// that reached for a link would either be caught by DidNotReceive, or — in
/// <see cref="LoginSucceedsWhenEveryLinkLookupThrows"/>, which simulates my.microting.com
/// having disappeared — fail outright.
///
/// Pure unit tests over the real AuthService; the wiring mirrors
/// Services/AuthServiceDisabledAccountTests, which established this fixture shape
/// upstream. Nothing touches the database, so this fixture deliberately does not inherit
/// DbTestFixture.
/// </summary>
[TestFixture]
public class LoginPathNeverConsultsALinkTests
{
    private const string Username = "someone@example.test";
    private const string Password = "correct-horse-battery-staple";
    private const string GenericMessageKey = "UserNameOrPasswordIncorrect";
    private const int UserId = 42;

    private IUserService _userService;
    private SignInManager<EformUser> _signInManager;
#pragma warning disable NUnit1032
    private UserManager<EformUser> _userManager;
#pragma warning restore NUnit1032
    private AuthService _authService;
    private EformUser _user;

    [SetUp]
    public void Setup()
    {
        var tokenOptions = Substitute.For<IOptions<EformTokenOptions>>();
        var appSettings = Substitute.For<IDbOptions<ApplicationSettings>>();
        var localizationService = Substitute.For<ILocalizationService>();

        _userService = Substitute.For<IUserService>();
        _signInManager = Substitute.For<SignInManager<EformUser>>(
            Substitute.For<UserManager<EformUser>>(
                Substitute.For<IUserStore<EformUser>>(), null, null, null, null, null, null, null, null),
            Substitute.For<Microsoft.AspNetCore.Http.IHttpContextAccessor>(),
            Substitute.For<IUserClaimsPrincipalFactory<EformUser>>(),
            null, null, null, null);
        _userManager = Substitute.For<UserManager<EformUser>>(
            Substitute.For<IUserStore<EformUser>>(), null, null, null, null, null, null, null, null);

        localizationService.GetString(Arg.Any<string>()).Returns(args => args.Arg<string>());
        tokenOptions.Value.Returns(new EformTokenOptions
        {
            SigningKey = "test-signing-key-that-is-long-enough-for-hmac-sha256",
            Issuer = "tests"
        });
        appSettings.Value.Returns(new ApplicationSettings());

        _authService = new AuthService(
            tokenOptions,
            Substitute.For<ILogger<AuthService>>(),
            appSettings,
            Substitute.For<RoleManager<EformRole>>(
                Substitute.For<IRoleStore<EformRole>>(), null, null, null, null),
            _signInManager,
            _userManager,
            _userService,
            localizationService,
            Substitute.For<IClaimsService>(),
            Substitute.For<IAuthCacheService>());

        _user = new EformUser
        {
            Id = UserId,
            UserName = Username,
            Email = Username,
            FirstName = "Tenant",
            LastName = "User",
            EmailConfirmed = true,
            IsActive = true
        };

        _userService.GetByUsernameAsync(Arg.Any<string>()).Returns(_user);
        _userService.GetFirstUserIdInDb().Returns(1);
        _userManager.GetRolesAsync(_user).Returns(new List<string> { "admin" });
        _signInManager
            .CheckPasswordSignInAsync(Arg.Any<EformUser>(), Arg.Any<string>(), Arg.Any<bool>())
            .Returns(SignInResult.Success);
    }

    private static LoginModel Login(string password = Password) => new()
    {
        Username = Username,
        Password = password
    };

    /// <summary>The account HAS a link, and every link API answers correctly. Nothing in
    /// the login path may ask.</summary>
    private void GivenALinkThatAnswers()
    {
        _userManager.FindByLoginAsync(ExternalLoginProviders.MyMicroting, "4821").Returns(_user);
        _userManager.GetLoginsAsync(_user).Returns(new List<UserLoginInfo>
        {
            new(ExternalLoginProviders.MyMicroting, "4821", "my.microting.com")
        });
    }

    /// <summary>my.microting.com has disappeared permanently: any attempt to read a link
    /// blows up. A login that still succeeds is a login that never asked.</summary>
    private void GivenEveryLinkLookupThrows()
    {
        var gone = new InvalidOperationException(
            "the login path consulted an external account link — that is requirement 1");

        _userManager.When(x => x.FindByLoginAsync(Arg.Any<string>(), Arg.Any<string>()))
            .Do(_ => throw gone);
        _userManager.When(x => x.GetLoginsAsync(Arg.Any<EformUser>())).Do(_ => throw gone);
        _userManager.When(x => x.AddLoginAsync(Arg.Any<EformUser>(), Arg.Any<UserLoginInfo>()))
            .Do(_ => throw gone);
        _userManager
            .When(x => x.RemoveLoginAsync(Arg.Any<EformUser>(), Arg.Any<string>(), Arg.Any<string>()))
            .Do(_ => throw gone);
    }

    private static void AssertLoggedIn(OperationDataResult<EformAuthorizeResult> result)
    {
        Assert.That(result.Success, Is.True, result.Message);
        Assert.That(result.Model, Is.Not.Null);
        Assert.That(result.Model.Id, Is.EqualTo(UserId));
        Assert.That(result.Model.UserName, Is.EqualTo(Username));
        Assert.That(result.Model.AccessToken, Is.Not.Null.And.Not.Empty,
            "a successful login mints a token from this installation's own signing key");
        Assert.That(result.Model.Role, Is.EqualTo("admin"));
    }

    private async Task AssertNoLinkApiWasTouched()
    {
        await _userManager.DidNotReceive().FindByLoginAsync(Arg.Any<string>(), Arg.Any<string>());
        await _userManager.DidNotReceive().GetLoginsAsync(Arg.Any<EformUser>());
        await _userManager.DidNotReceive().AddLoginAsync(Arg.Any<EformUser>(), Arg.Any<UserLoginInfo>());
        await _userManager.DidNotReceive()
            .RemoveLoginAsync(Arg.Any<EformUser>(), Arg.Any<string>(), Arg.Any<string>());
    }

    // The common case: no link anywhere, logs in normally.
    [Test]
    public async Task AnAccountWithNoLinkLogsInNormally()
    {
        _userManager.FindByLoginAsync(Arg.Any<string>(), Arg.Any<string>()).Returns((EformUser)null);
        _userManager.GetLoginsAsync(Arg.Any<EformUser>()).Returns(new List<UserLoginInfo>());

        var result = await _authService.AuthenticateUser(Login());

        AssertLoggedIn(result);
        await AssertNoLinkApiWasTouched();
    }

    // The same account WITH a link logs in exactly the same way, and the link that is
    // sitting there answering is never asked.
    [Test]
    public async Task AnAccountWithALinkLogsInIdenticallyAndTheLinkIsNeverConsulted()
    {
        GivenALinkThatAnswers();

        var result = await _authService.AuthenticateUser(Login());

        AssertLoggedIn(result);
        await AssertNoLinkApiWasTouched();
        await _userService.Received(1).GetByUsernameAsync(Username);
    }

    // my.microting.com is gone. Login must not notice.
    [Test]
    public async Task LoginSucceedsWhenEveryLinkLookupThrows()
    {
        GivenEveryLinkLookupThrows();

        var result = await _authService.AuthenticateUser(Login());

        AssertLoggedIn(result);
    }

    // And the refusal path is unchanged too: a wrong password is refused for the generic
    // reason, not for a link-shaped one, whether a link exists or not.
    [Test]
    public async Task AWrongPasswordIsRefusedTheSameWayWhetherOrNotALinkExists()
    {
        _signInManager
            .CheckPasswordSignInAsync(Arg.Any<EformUser>(), Arg.Any<string>(), Arg.Any<bool>())
            .Returns(SignInResult.Failed);
        GivenALinkThatAnswers();

        var withALink = await _authService.AuthenticateUser(Login("wrong"));

        Assert.That(withALink.Success, Is.False);
        Assert.That(withALink.Message, Is.EqualTo(GenericMessageKey),
            "a link must not change WHY a login is refused — same key as an unknown account");
        Assert.That(withALink.Model, Is.Null);
        await AssertNoLinkApiWasTouched();
    }

    // A link is not a credential: the providerKey must not work as a password.
    [Test]
    public async Task AProviderKeyIsNotAPassword()
    {
        GivenALinkThatAnswers();
        _signInManager
            .CheckPasswordSignInAsync(Arg.Any<EformUser>(), "4821", Arg.Any<bool>())
            .Returns(SignInResult.Failed);

        var result = await _authService.AuthenticateUser(Login("4821"));

        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo(GenericMessageKey));
        await AssertNoLinkApiWasTouched();
    }
}

/// <summary>
/// The source-level half of requirement 1: the external-login API is confined to the two
/// services that own it, the login path does not mention it at all, and the CI fence that
/// says so is still wired into the pull-request workflow.
///
/// Textual, deliberately. The behavioural tests above prove the system does not consult a
/// link today; these prove a future contributor cannot quietly add a convenient lookup to
/// the login path without turning something red, including in the files the behavioural
/// tests substitute away.
///
/// No database, so this fixture does not inherit DbTestFixture.
/// </summary>
[TestFixture]
public class NoRuntimeBindingSourceTests
{
    private static readonly string[] LinkApis =
        { "FindByLoginAsync", "GetLoginsAsync", "AddLoginAsync", "RemoveLoginAsync" };

    // Check 4: the external-login API is CALLED from exactly two places. Any later change
    // to the login path to "look up the link" is a violation by construction.
    [Test]
    public void TheExternalLoginApiIsCalledFromExactlyTwoFiles()
    {
        string[] allowed =
        {
            Path.Combine("Services", "AccountService.cs"),
            Path.Combine("Services", "ExternalUserLinkService.cs")
        };

        var callers = new List<string>();
        foreach (var file in WebSources())
        {
            // Comments are stripped first: both allowed files, and AccountController, name
            // these APIs in prose precisely to explain how the target is resolved, and
            // documenting the rule must not read as breaking it. Code is what binds.
            var code = WithoutComments(File.ReadAllText(file));
            if (LinkApis.Any(api => code.Contains(api, StringComparison.Ordinal)))
            {
                callers.Add(file);
            }
        }

        var offenders = callers
            .Where(file => !allowed.Any(a => file.EndsWith(a, StringComparison.Ordinal)))
            .ToList();

        Assert.That(offenders, Is.Empty,
            "the link API belongs to the external-link service and the link-targeted "
            + "set-password service, and nowhere else");

        // Both directions: a check that can only ever report "no offenders" would also pass
        // if the feature were renamed out from under it.
        foreach (var expected in allowed)
        {
            Assert.That(callers.Any(f => f.EndsWith(expected, StringComparison.Ordinal)), Is.True,
                $"{expected} is expected to call the link API; if it no longer does, this "
                + "check has stopped measuring anything");
        }
    }

    // The login path specifically: not AuthService, not UserService, not ClaimsTransformer.
    // Raw text here, not stripped code — this mirrors the CI fence's grep exactly, and the
    // login path has no business naming a link even in a comment.
    [TestCase("Services/AuthService.cs")]
    [TestCase("Services/UserService.cs")]
    [TestCase("Hosting/Security/ClaimsTransformer.cs")]
    [TestCase("Hosting/Security/AuthServiceCollectionExtensions.cs")]
    public void TheLoginPathNeverMentionsTheLink(string relativePath)
    {
        var text = ReadLoginPathFile(relativePath);

        foreach (var forbidden in new[]
                 {
                     "FindByLoginAsync", "GetLoginsAsync", "AddLoginAsync", "RemoveLoginAsync",
                     "UserLoginInfo", "IdentityUserLogin", "UserLogins",
                     "ExternalLoginProviders", "ExternalUserLink", "SetLinkedAccountPassword"
                 })
        {
            Assert.That(text, Does.Not.Contain(forbidden),
                $"{relativePath} must never consult a link — that is requirement 1");
        }
    }

    // The promise in its own words: "no binding to my.microting.com". The login path may
    // not name the host, may not know the provider constant, and may not hold the means to
    // call anything at all — an HttpClient in a login path is the exact shape the
    // requirement forbids, whoever it would be pointed at.
    [TestCase("Services/AuthService.cs")]
    [TestCase("Services/UserService.cs")]
    [TestCase("Hosting/Security/ClaimsTransformer.cs")]
    [TestCase("Hosting/Security/AuthServiceCollectionExtensions.cs")]
    public void TheLoginPathNeverNamesMyMicrotingAndCannotCallOut(string relativePath)
    {
        var text = ReadLoginPathFile(relativePath);

        foreach (var forbidden in new[]
                 {
                     "my.microting.com", "MyMicroting",
                     "HttpClient", "IHttpClientFactory", "HttpRequestMessage", "WebRequest"
                 })
        {
            Assert.That(text, Does.Not.Contain(forbidden),
                $"{relativePath} must neither name my.microting.com nor be able to call out "
                + "— tenant login is self-contained, which is requirement 1");
        }
    }

    // Belt and braces for the CI fence: if the script is deleted, this fails too.
    [Test]
    public void TheLoginPathFenceScriptIsPresentAndWiredIntoCi()
    {
        var root = ExternalUserLinksAuthorizationTests.RepoRoot();
        var script = Path.Combine(root, ".github", "scripts", "check-login-path-fence.sh");
        var workflow = Path.Combine(root, ".github", "workflows", "dotnet-core-pr.yml");

        Assert.That(File.Exists(script), Is.True, "the login-path fence script is missing");
        Assert.That(File.ReadAllText(workflow), Does.Contain("check-login-path-fence.sh"),
            "the fence must run on every pull request, not just locally");
    }

    private static string ReadLoginPathFile(string relativePath)
    {
        var file = Path.Combine(WebRoot(), relativePath.Replace('/', Path.DirectorySeparatorChar));
        Assert.That(File.Exists(file), Is.True, $"{relativePath} is missing from the tree");
        return File.ReadAllText(file);
    }

    private static string WebRoot()
        => Path.Combine(ExternalUserLinksAuthorizationTests.RepoRoot(), "eFormAPI", "eFormAPI.Web");

    private static IEnumerable<string> WebSources()
        => Directory.EnumerateFiles(WebRoot(), "*.cs", SearchOption.AllDirectories)
            .Where(f => !f.Contains($"{Path.DirectorySeparatorChar}obj{Path.DirectorySeparatorChar}")
                        && !f.Contains($"{Path.DirectorySeparatorChar}bin{Path.DirectorySeparatorChar}"));

    /// <summary>
    /// Removes // and /* */ comments, leaving everything else — including every string
    /// literal — byte-for-byte. String literals are tracked rather than removed for two
    /// reasons, and both are about never producing a FALSE NEGATIVE: a "//" inside a string
    /// (an https:// URL, say) must not truncate the real code that follows it on that line,
    /// and a call inside an interpolation hole must stay visible. A file using raw string
    /// literals ("""…""") is not scanned at all but returned verbatim, because this
    /// tracker does not model them — erring toward reporting too much, never too little.
    /// </summary>
    internal static string WithoutComments(string source)
    {
        if (source.Contains("\"\"\"", StringComparison.Ordinal))
        {
            return source;
        }

        var sb = new StringBuilder(source.Length);
        var i = 0;
        while (i < source.Length)
        {
            var c = source[i];

            if (c == '/' && i + 1 < source.Length && source[i + 1] == '/')
            {
                while (i < source.Length && source[i] != '\n')
                {
                    i++;
                }

                continue;
            }

            if (c == '/' && i + 1 < source.Length && source[i + 1] == '*')
            {
                i += 2;
                while (i + 1 < source.Length && !(source[i] == '*' && source[i + 1] == '/'))
                {
                    i++;
                }

                i = Math.Min(i + 2, source.Length);
                continue;
            }

            // Verbatim string: no backslash escapes, "" is one quote, newlines allowed.
            if (c == '@' && i + 1 < source.Length && source[i + 1] == '"')
            {
                sb.Append(source[i++]);
                sb.Append(source[i++]);
                while (i < source.Length)
                {
                    if (source[i] == '"')
                    {
                        if (i + 1 < source.Length && source[i + 1] == '"')
                        {
                            sb.Append(source[i++]);
                            sb.Append(source[i++]);
                            continue;
                        }

                        sb.Append(source[i++]);
                        break;
                    }

                    sb.Append(source[i++]);
                }

                continue;
            }

            // Regular string or char literal.
            if (c == '"' || c == '\'')
            {
                var quote = c;
                sb.Append(source[i++]);
                while (i < source.Length)
                {
                    if (source[i] == '\\' && i + 1 < source.Length)
                    {
                        sb.Append(source[i++]);
                        sb.Append(source[i++]);
                        continue;
                    }

                    if (source[i] == quote)
                    {
                        sb.Append(source[i++]);
                        break;
                    }

                    if (source[i] == '\n')
                    {
                        // Unterminated: stop treating this as a literal rather than
                        // swallowing the rest of the file.
                        break;
                    }

                    sb.Append(source[i++]);
                }

                continue;
            }

            sb.Append(source[i++]);
        }

        return sb.ToString();
    }
}
