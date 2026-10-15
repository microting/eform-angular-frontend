using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Infrastructure.Models.Auth;
using eFormAPI.Web.Infrastructure.Models.ExternalLinks;
using eFormAPI.Web.Integration.Tests.Identity;
using eFormAPI.Web.Integration.Tests.Security;
using eFormAPI.Web.Services;
using eFormAPI.Web.Services.Accounts;
using eFormAPI.Web.Services.Mailing.EmailService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services;

/// <summary>
/// THE TARGET RULES EXIST IN TWO COPIES, AND THIS IS WHAT KEEPS THEM EQUAL.
///
/// Copy one is inline in AccountService.AdminChangePassword and is BYTE-FROZEN: it is
/// never refactored, extracted, re-indented or reworded, and two independent fences fail
/// on any change to it (check-login-path-fence.sh and FrozenGuardBlockTests). Copy two is
/// AccountService.EvaluateLinkedTargetGuards, written for the link-targeted path.
///
/// The duplication is a deliberate decision — the frozen block has survived several
/// security reviews in exactly its current form and reopening it for a refactor was
/// judged not worth the risk. The accepted cost is two copies of a security rule that
/// must stay in sync, and this suite is the whole mitigation: every case below runs BOTH
/// paths and asserts they reach the same decision with the same refusal key, AND that
/// the decision is the expected one, so the copies cannot be wrong together.
///
/// If one case fails: one copy was edited and the other was not. Do NOT relax the case.
/// Decide which copy is right. If the frozen one is wrong, that is a conversation to have
/// before touching it, not a refactor.
///
/// This suite CALLS the frozen path. It never modifies it.
/// </summary>
[TestFixture]
public class PasswordTargetGuardAgreementTests : DbTestFixture
{
    private const string OldPassword = "old-password";
    private const string NewPassword = "brand-new-password";

    private static readonly string UsersUpdate = AuthConsts.EformClaims.UserManagementClaims.Update;
    private static readonly string DeviceUsersUpdate = AuthConsts.EformClaims.DeviceUsersClaims.Update;

    /// <summary>A permit/refuse decision, reduced to the shape both paths can report.
    /// The frozen path answers with OperationResult, the link-targeted path with
    /// OperationDataResult&lt;SetLinkedPasswordResult&gt;; neither is comparable to the
    /// other, so each is projected onto this record and the records are compared.</summary>
    private sealed record Verdict(bool Permitted, string Reason)
    {
        public override string ToString() => Permitted ? "PERMITTED" : $"REFUSED({Reason})";
    }

    /// <summary>One row of the agreement table.</summary>
    public sealed record TargetCase(
        string Name,
        bool HasCallerPrincipal,
        bool CallerIsAdmin,
        string[] CallerClaims,
        bool CallerIsTheTarget,
        bool TargetIsPrimaryAdmin,
        bool TargetIsAdmin,
        bool TargetIsLiveWorker,
        string[] TargetClaims,
        bool ExpectedPermitted,
        string ExpectedReason)
    {
        public override string ToString() => Name;
    }

    /// <summary>
    /// Every branch of both copies, in the order the rules are evaluated. A rule that is
    /// not represented here can be edited in one copy without this suite noticing, so a
    /// new rule needs a new row.
    /// </summary>
    public static IEnumerable<TargetCase> Cases()
    {
        // Rule 1 — no caller principal, fails closed.
        yield return new TargetCase("no caller principal",
            HasCallerPrincipal: false, CallerIsAdmin: false, CallerClaims: [],
            CallerIsTheTarget: false, TargetIsPrimaryAdmin: false,
            TargetIsAdmin: false, TargetIsLiveWorker: true, TargetClaims: [],
            ExpectedPermitted: false, ExpectedReason: "YouMayOnlySetPasswordsForWorkers");

        // Rule 2 — the primary admin may only be targeted by itself.
        yield return new TargetCase("admin targets the primary admin",
            HasCallerPrincipal: true, CallerIsAdmin: true, CallerClaims: [],
            CallerIsTheTarget: false, TargetIsPrimaryAdmin: true,
            TargetIsAdmin: true, TargetIsLiveWorker: false, TargetClaims: [],
            ExpectedPermitted: false, ExpectedReason: "CantEditPrimaryAdminUser");

        yield return new TargetCase("the primary admin targets itself",
            HasCallerPrincipal: true, CallerIsAdmin: true, CallerClaims: [],
            CallerIsTheTarget: true, TargetIsPrimaryAdmin: true,
            TargetIsAdmin: true, TargetIsLiveWorker: false, TargetClaims: [],
            ExpectedPermitted: true, ExpectedReason: null);

        // Rule 3 — a non-admin may not target an admin; an admin may.
        yield return new TargetCase("admin targets a non-admin",
            HasCallerPrincipal: true, CallerIsAdmin: true, CallerClaims: [],
            CallerIsTheTarget: false, TargetIsPrimaryAdmin: false,
            TargetIsAdmin: false, TargetIsLiveWorker: false, TargetClaims: [],
            ExpectedPermitted: true, ExpectedReason: null);

        yield return new TargetCase("admin targets another admin",
            HasCallerPrincipal: true, CallerIsAdmin: true, CallerClaims: [],
            CallerIsTheTarget: false, TargetIsPrimaryAdmin: false,
            TargetIsAdmin: true, TargetIsLiveWorker: false, TargetClaims: [],
            ExpectedPermitted: true, ExpectedReason: null);

        yield return new TargetCase("user manager targets an admin",
            HasCallerPrincipal: true, CallerIsAdmin: false, CallerClaims: [UsersUpdate],
            CallerIsTheTarget: false, TargetIsPrimaryAdmin: false,
            TargetIsAdmin: true, TargetIsLiveWorker: false, TargetClaims: [],
            ExpectedPermitted: false, ExpectedReason: "YouCantViewChangeOrDeleteAdmin");

        // Rule 3 precedes rule 5: an admin target who is also a live worker is still
        // refused on rule 3, not narrowed by the worker rule.
        yield return new TargetCase("device-user manager targets an admin who is a live worker",
            HasCallerPrincipal: true, CallerIsAdmin: false, CallerClaims: [DeviceUsersUpdate],
            CallerIsTheTarget: false, TargetIsPrimaryAdmin: false,
            TargetIsAdmin: true, TargetIsLiveWorker: true, TargetClaims: [],
            ExpectedPermitted: false, ExpectedReason: "YouCantViewChangeOrDeleteAdmin");

        // Rule 4 — a non-admin may not reach their own account through this route.
        yield return new TargetCase("user manager targets itself",
            HasCallerPrincipal: true, CallerIsAdmin: false, CallerClaims: [UsersUpdate],
            CallerIsTheTarget: true, TargetIsPrimaryAdmin: false,
            TargetIsAdmin: false, TargetIsLiveWorker: false, TargetClaims: [],
            ExpectedPermitted: false, ExpectedReason: "UseChangePasswordForYourOwnAccount");

        // Rule 5 — a device-user manager reaches live workers only.
        yield return new TargetCase("device-user manager targets a live worker",
            HasCallerPrincipal: true, CallerIsAdmin: false, CallerClaims: [DeviceUsersUpdate],
            CallerIsTheTarget: false, TargetIsPrimaryAdmin: false,
            TargetIsAdmin: false, TargetIsLiveWorker: true, TargetClaims: [],
            ExpectedPermitted: true, ExpectedReason: null);

        yield return new TargetCase("device-user manager targets a non-worker",
            HasCallerPrincipal: true, CallerIsAdmin: false, CallerClaims: [DeviceUsersUpdate],
            CallerIsTheTarget: false, TargetIsPrimaryAdmin: false,
            TargetIsAdmin: false, TargetIsLiveWorker: false, TargetClaims: [],
            ExpectedPermitted: false, ExpectedReason: "YouMayOnlySetPasswordsForWorkers");

        // Rule 6 — and may not inherit rights by resetting a more privileged worker.
        yield return new TargetCase("device-user manager targets a worker holding more rights",
            HasCallerPrincipal: true, CallerIsAdmin: false, CallerClaims: [DeviceUsersUpdate],
            CallerIsTheTarget: false, TargetIsPrimaryAdmin: false,
            TargetIsAdmin: false, TargetIsLiveWorker: true, TargetClaims: [UsersUpdate],
            ExpectedPermitted: false, ExpectedReason: "YouCantSetPasswordForMorePrivilegedAccount");
    }

    [TestCaseSource(nameof(Cases))]
    public async Task BothPathsReachTheSameVerdict(TargetCase testCase)
    {
        await using var host = new IdentityTestHost(DbContext);
        await host.EnsureRoleAsync(EformRole.Admin);

        // Two separate targets, so running the frozen path first cannot contaminate what
        // the link-targeted path then sees. The primary-admin cases are the exception:
        // only one row can have Id 1, so both paths run against it — safe, because that
        // case either refuses (nothing moves) or permits twice (idempotent in effect).
        EformUser frozenPathTarget;
        EformUser linkedPathTarget;
        var seededPrimaryAdmin = false;
        string borrowedHash = null;
        string borrowedStamp = null;
        if (testCase.TargetIsPrimaryAdmin)
        {
            // Rule 2 is about the literal Id 1, so this is the one case that cannot use a
            // DB-assigned id. DbTestFixture.ClearDb() truncates a schema this project does
            // not connect to, so it silently no-ops and nothing else will tidy the row:
            // the fixture creates it only when absent and deletes what it created.
            (var primaryAdmin, seededPrimaryAdmin) = await EnsurePrimaryAdminAsync();
            if (!seededPrimaryAdmin)
            {
                // Somebody else's row. "The primary admin targets itself" is a PERMITTED
                // case, so it really does set this account's password; remember the old
                // credentials and put them back, rather than leaving a dev user logged
                // out of their own installation.
                borrowedHash = primaryAdmin.PasswordHash;
                borrowedStamp = primaryAdmin.SecurityStamp;
            }

            frozenPathTarget = primaryAdmin;
            linkedPathTarget = primaryAdmin;
        }
        else
        {
            frozenPathTarget = await host.CreateUserAsync(OldPassword);
            linkedPathTarget = await host.CreateUserAsync(OldPassword);
        }

        // Set only when THIS fixture granted admin to a primary-admin row it did not
        // create, so the grant can be taken back off somebody else's account.
        var grantedAdminToBorrowedRow = false;
        if (testCase.TargetIsAdmin)
        {
            foreach (var target in new[] { frozenPathTarget, linkedPathTarget }.Distinct())
            {
                if (!await host.UserManager.IsInRoleAsync(target, EformRole.Admin))
                {
                    await host.UserManager.AddToRoleAsync(target, EformRole.Admin);
                    grantedAdminToBorrowedRow |= testCase.TargetIsPrimaryAdmin && !seededPrimaryAdmin;
                }
            }
        }

        // Only the link-targeted path needs a link; the frozen path resolves by email.
        var providerKey = $"agree-{Guid.NewGuid():N}";
        await host.AddLinkAsync(linkedPathTarget.Id,
            ExternalLoginProviders.MyMicroting, providerKey);

        try
        {
            var frozenVerdict = await RunFrozenPath(host, testCase, frozenPathTarget);
            var linkedVerdict = await RunLinkedPath(host, testCase, linkedPathTarget, providerKey);

            // (1) The two copies agree with each other. This is the drift detector.
            Assert.That(linkedVerdict, Is.EqualTo(frozenVerdict),
                $"THE TWO COPIES OF THE TARGET RULES DISAGREE for '{testCase.Name}'.\n"
                + $"  AdminChangePassword (frozen copy): {frozenVerdict}\n"
                + $"  SetLinkedAccountPassword (copy two): {linkedVerdict}\n"
                + "One copy was edited and the other was not. Decide which is right; the "
                + "frozen copy may not be edited without reopening that decision.");

            // (2) And both agree with the expected verdict, so they cannot be wrong together.
            Assert.That(frozenVerdict,
                Is.EqualTo(new Verdict(testCase.ExpectedPermitted, testCase.ExpectedReason)),
                $"both copies agree, but on the wrong answer for '{testCase.Name}'");
        }
        finally
        {
            // Deleted through the CHANGE TRACKER, not ExecuteDelete: ExecuteDelete issues
            // the SQL without telling the tracker, so the link row would stay tracked as
            // Unchanged and IdentityTestHost.DisposeAsync's cascade would then try to
            // delete a row that is already gone — a DbUpdateConcurrencyException it
            // swallows, taking the whole user cleanup down with it and leaking every
            // target this suite created. DbTestFixture.ClearDb() truncates a schema this
            // project does not connect to, so nothing else would ever tidy them.
            var link = await DbContext.Set<IdentityUserLogin<int>>()
                .FirstOrDefaultAsync(x => x.LoginProvider == ExternalLoginProviders.MyMicroting
                                          && x.ProviderKey == providerKey);
            if (link != null)
            {
                DbContext.Set<IdentityUserLogin<int>>().Remove(link);
            }

            var primaryAdminRow = testCase.TargetIsPrimaryAdmin
                ? await DbContext.Users.FirstOrDefaultAsync(x => x.Id == 1)
                : null;
            if (seededPrimaryAdmin)
            {
                // Only ever the row this fixture inserted. UserRoles and UserLogins
                // cascade from Users, in the tracker as well as in the schema.
                if (primaryAdminRow != null)
                {
                    DbContext.Users.Remove(primaryAdminRow);
                }
            }
            else if (primaryAdminRow != null)
            {
                if (borrowedHash != null)
                {
                    primaryAdminRow.PasswordHash = borrowedHash;
                    primaryAdminRow.SecurityStamp = borrowedStamp;
                }

                if (grantedAdminToBorrowedRow)
                {
                    await host.UserManager.RemoveFromRoleAsync(primaryAdminRow, EformRole.Admin);
                }
            }

            await DbContext.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Runs AdminChangePassword — the FROZEN copy. Called, never modified.
    /// Its refusal message is the localization KEY, because the substituted
    /// ILocalizationService echoes whatever key it is handed.
    /// </summary>
    private async Task<Verdict> RunFrozenPath(
        IdentityTestHost host, TargetCase testCase, EformUser target)
    {
        var service = BuildService(host, testCase, target,
            configureUserService: userService =>
                userService.GetByUsernameAsync(target.Email).Returns(target));

        var result = await service.AdminChangePassword(new ChangePasswordAdminModel
        {
            Email = target.Email, NewPassword = NewPassword, ConfirmPassword = NewPassword
        });

        return new Verdict(result.Success, result.Success ? null : result.Message);
    }

    /// <summary>Runs SetLinkedAccountPassword — copy two.</summary>
    private async Task<Verdict> RunLinkedPath(
        IdentityTestHost host, TargetCase testCase, EformUser target, string providerKey)
    {
        var service = BuildService(host, testCase, target, configureUserService: null);

        var result = await service.SetLinkedAccountPassword(new SetLinkedAccountPasswordModel
        {
            LoginProvider = ExternalLoginProviders.MyMicroting,
            ProviderKey = providerKey,
            NewPassword = NewPassword
        });

        Assert.That(result.Success, Is.True,
            "a decided verdict is always Success = true; the caller reads Outcome");
        Assert.That(result.Model.Outcome, Is.Not.EqualTo(SetLinkedPasswordOutcome.NoLink),
            "the link was seeded, so NoLink would mean the fixture, not the rules, is wrong");
        Assert.That(result.Model.Outcome, Is.Not.EqualTo(SetLinkedPasswordOutcome.AmbiguousLink),
            "exactly one link was seeded, so AmbiguousLink would mean a leftover row");
        Assert.That(result.Model.Outcome, Is.Not.EqualTo(SetLinkedPasswordOutcome.PasswordRejected),
            "the password is valid under the production policy, so a rejection here would "
            + "mean the harness, not a target rule, refused");

        // RefusedPrimaryAdmin and RefusedByPolicy both carry the refusal key in Detail;
        // the key is what the frozen path can be compared on.
        var permitted = result.Model.Outcome == SetLinkedPasswordOutcome.Changed;
        return new Verdict(permitted, permitted ? null : result.Model.Detail);
    }

    /// <summary>
    /// One AccountService wired for this case, over the REAL UserManager so
    /// IsInRoleAsync consults real role membership rather than a stub.
    /// </summary>
    private AccountService BuildService(
        IdentityTestHost host, TargetCase testCase, EformUser target,
        Action<IUserService> configureUserService)
    {
        // A caller id that is not a real row unless the case says the caller IS the
        // target, so "targets itself" is the only way the self-rule can trip.
        var callerId = testCase.CallerIsTheTarget ? target.Id : 999_000;

        var userService = Substitute.For<IUserService>();
        userService.UserId.Returns(callerId);
        userService.IsAdmin().Returns(testCase.CallerIsAdmin);
        configureUserService?.Invoke(userService);

        var httpContextAccessor = Substitute.For<IHttpContextAccessor>();
        if (testCase.HasCallerPrincipal)
        {
            var claims = testCase.CallerClaims
                .Select(c => new Claim(c, AuthConsts.ClaimDefaultValue))
                .ToList();
            if (testCase.CallerIsAdmin)
            {
                claims.Add(new Claim(ClaimTypes.Role, EformRole.Admin));
            }

            claims.Add(new Claim(ClaimTypes.Email, $"caller-{callerId}@example.test"));
            httpContextAccessor.HttpContext.Returns(new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(claims, authenticationType: "test"))
            });
        }
        else
        {
            httpContextAccessor.HttpContext.Returns((HttpContext)null);
        }

        var localizationService = Substitute.For<ILocalizationService>();
        localizationService.GetString(Arg.Any<string>()).Returns(args => args.Arg<string>());

        var workerAccountLookup = Substitute.For<IWorkerAccountLookup>();
        workerAccountLookup.IsLiveWorkerAsync(target.Email).Returns(testCase.TargetIsLiveWorker);

        var claimsService = Substitute.For<IClaimsService>();
        // Explicit, not NSubstitute's auto-value: an unconfigured Returns<List<T>> comes
        // back null, not an empty instance, so leaving this out would NRE.
        claimsService.GetUserClaims(target.Id).Returns(testCase.TargetClaims
            .Select(c => new Claim(c, AuthConsts.ClaimDefaultValue))
            .ToList());

        return new AccountService(
            Substitute.For<IEFormCoreService>(),
            host.UserManager,
            userService,
            Substitute.For<IDbOptions<ApplicationSettings>>(),
            localizationService,
            host.DbContext,
            Substitute.For<IEmailService>(),
            httpContextAccessor,
            workerAccountLookup,
            claimsService,
            Substitute.For<ILogger<AccountService>>());
    }

    /// <summary>
    /// The one fixture that needs a fixed Id, because rule 2 is about the literal Id 1.
    /// Returns the row and whether THIS fixture created it. A row that was already there
    /// is never deleted, and the caller puts its password hash and security stamp back,
    /// because it may be somebody's seed data. Written through raw SQL because EF will
    /// not insert an explicit value into an auto-increment key.
    /// </summary>
    private async Task<(EformUser User, bool Created)> EnsurePrimaryAdminAsync()
    {
        var existing = await DbContext.Users.FirstOrDefaultAsync(x => x.Id == 1);
        if (existing != null)
        {
            return (existing, false);
        }

        var email = $"primary-{Guid.NewGuid():N}@example.test";
        var normalized = email.ToUpperInvariant();
        var hash = new PasswordHasher<EformUser>().HashPassword(new EformUser(), OldPassword);
        await DbContext.Database.ExecuteSqlInterpolatedAsync($"""
            INSERT INTO Users
                (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
                 PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumberConfirmed,
                 TwoFactorEnabled, LockoutEnabled, AccessFailedCount,
                 IsGoogleAuthenticatorEnabled, FirstName, LastName, Locale, TimeZone, Formats)
            VALUES
                (1, {email}, {normalized}, {email}, {normalized}, 1,
                 {hash}, {Guid.NewGuid().ToString()}, {Guid.NewGuid().ToString()}, 0,
                 0, 1, 0,
                 0, 'Primary', 'Admin', 'en', 'Europe/Copenhagen', 'de-DE')
            """);

        var seeded = await DbContext.Users.FirstOrDefaultAsync(x => x.Id == 1);
        Assert.That(seeded, Is.Not.Null, "could not seed the primary-admin row");
        return (seeded!, true);
    }

    /// <summary>
    /// The table must cover every refusal copy two can produce. A new refusal key or a new
    /// PasswordTargetRefusal member with no row in Cases() would be a rule this suite
    /// cannot see drift in, so it fails here instead of passing quietly.
    /// </summary>
    [Test]
    public void TheTableCoversEveryRefusalReasonCopyTwoCanProduce()
    {
        var reasonsInTable = Cases()
            .Where(c => !c.ExpectedPermitted)
            .Select(c => c.ExpectedReason)
            .Distinct()
            .ToList();

        Assert.That(reasonsInTable, Is.EquivalentTo(new[]
        {
            "YouMayOnlySetPasswordsForWorkers",
            "CantEditPrimaryAdminUser",
            "YouCantViewChangeOrDeleteAdmin",
            "UseChangePasswordForYourOwnAccount",
            "YouCantSetPasswordForMorePrivilegedAccount"
        }), "a new rule or a new refusal key needs a new row in Cases()");

        // Read out of copy two's SOURCE, so a refusal added there with no row above fails
        // here rather than going unexercised. Reads the file; never modifies it.
        var refusalsInCopyTwo = RefusalsDeclaredByCopyTwo();

        Assert.That(refusalsInCopyTwo.Select(x => x.MessageKey).Distinct(),
            Is.EquivalentTo(reasonsInTable),
            "EvaluateLinkedTargetGuards can produce a refusal key that no row in Cases() "
            + "exercises (or Cases() names one it cannot produce). Add or remove a row — "
            + "an unexercised rule is a rule this suite cannot see drift in.");

        // Six enum members minus None; NoCallerPrincipal and NotALiveWorker share a key,
        // which is why five keys cover six reasons.
        Assert.That(refusalsInCopyTwo.Select(x => x.Refusal).Distinct().Count(), Is.EqualTo(6),
            "copy two gained or lost a refusal reason; add or remove a row in Cases()");
        Assert.That(
            Enum.GetValues<PasswordTargetRefusal>().Length - 1,
            Is.EqualTo(6),
            "copy two gained or lost a refusal reason; add or remove a row in Cases()");
    }

    /// <summary>
    /// The (PasswordTargetRefusal, localization key) pairs that
    /// AccountService.EvaluateLinkedTargetGuards can return, read from the source so the
    /// coverage check cannot be satisfied by the test's own expectations alone.
    /// </summary>
    private static List<(string Refusal, string MessageKey)> RefusalsDeclaredByCopyTwo()
    {
        var source = System.IO.File.ReadAllText(System.IO.Path.Combine(
                FrozenGuardBlockTests.RepoRoot(),
                "eFormAPI", "eFormAPI.Web", "Services", "AccountService.cs"))
            .Replace("\r\n", "\n");

        const string signature =
            "private async Task<PasswordTargetDecision> EvaluateLinkedTargetGuards(";
        var start = source.IndexOf(signature, StringComparison.Ordinal);
        Assert.That(start, Is.GreaterThanOrEqualTo(0),
            "could not find EvaluateLinkedTargetGuards in AccountService.cs — copy two was "
            + "renamed or removed, and this suite cannot check what it cannot find");

        const string nextMember = "public async Task<OperationDataResult<SetLinkedPasswordResult>>";
        var end = source.IndexOf(nextMember, start, StringComparison.Ordinal);
        Assert.That(end, Is.GreaterThan(start),
            "could not find the end of EvaluateLinkedTargetGuards in AccountService.cs");

        var body = source[start..end];

        // Matches both the one-line and the wrapped Refuse(...) forms.
        var matches = Regex.Matches(body,
            """PasswordTargetRefusal\.(\w+),\s*"(\w+)"\s*\)""",
            RegexOptions.Singleline);
        Assert.That(matches, Is.Not.Empty,
            "no PasswordTargetDecision.Refuse(...) call found in copy two; if its shape "
            + "changed, update this reader — do not delete the check");

        return matches
            .Select(m => (Refusal: m.Groups[1].Value, MessageKey: m.Groups[2].Value))
            .ToList();
    }
}
