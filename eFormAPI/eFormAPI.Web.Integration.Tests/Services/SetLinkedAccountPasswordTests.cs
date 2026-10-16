using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Infrastructure.Models.ExternalLinks;
using eFormAPI.Web.Integration.Tests.Identity;
using eFormAPI.Web.Services;
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
/// The link-targeted set-password endpoint, against a REAL UserManager and a real
/// UserLogins table.
///
/// Every "changes nothing" claim here is asserted on the STORED HASH, not on the return
/// value: a method that returns NoLink while having already moved the hash would pass a
/// return-value assertion and be exactly the bug this endpoint exists to prevent.
///
/// Refusals are asserted on their SPECIFIC outcome and message key, never on a bare
/// "not a success": a test that cannot tell one refusal reason from another cannot tell
/// a correct guard from a guard that fires for the wrong reason.
/// </summary>
[TestFixture]
public class SetLinkedAccountPasswordTests : DbTestFixture
{
    private const string Provider = "my.microting.com";
    private const string OldPassword = "old-password";

    private IWorkerAccountLookup _workerAccountLookup;
    private IClaimsService _claimsService;

    /// <summary>The caller, as both IUserService and the HTTP principal see them.</summary>
    private AccountService BuildService(IdentityTestHost host, int callerId, bool callerIsAdmin,
        params string[] grantedClaims)
    {
        // A local, not a field: no test reads the caller substitute back, so a field
        // would only be a longer-lived copy of it (SonarC# S1450).
        var userService = Substitute.For<IUserService>();
        userService.UserId.Returns(callerId);
        userService.IsAdmin().Returns(callerIsAdmin);

        var claims = new List<Claim>();
        foreach (var granted in grantedClaims)
        {
            claims.Add(new Claim(granted, AuthConsts.ClaimDefaultValue));
        }

        if (callerIsAdmin)
        {
            claims.Add(new Claim(ClaimTypes.Role, EformRole.Admin));
        }

        claims.Add(new Claim(ClaimTypes.Email, $"caller-{callerId}@example.test"));

        var httpContextAccessor = Substitute.For<IHttpContextAccessor>();
        httpContextAccessor.HttpContext.Returns(new DefaultHttpContext
        {
            User = new ClaimsPrincipal(new ClaimsIdentity(claims, authenticationType: "test"))
        });

        var localizationService = Substitute.For<ILocalizationService>();
        localizationService.GetString(Arg.Any<string>()).Returns(args => args.Arg<string>());

        _workerAccountLookup = Substitute.For<IWorkerAccountLookup>();
        _claimsService = Substitute.For<IClaimsService>();
        _claimsService.GetUserClaims(Arg.Any<int>()).Returns(new List<Claim>());

        return new AccountService(
            Substitute.For<IEFormCoreService>(),
            host.UserManager,
            userService,
            Substitute.For<IDbOptions<ApplicationSettings>>(),
            localizationService,
            host.DbContext,
            Substitute.For<IEmailService>(),
            httpContextAccessor,
            _workerAccountLookup,
            _claimsService,
            Substitute.For<ILogger<AccountService>>());
    }

    private static SetLinkedAccountPasswordModel Request(string providerKey, string newPassword)
        => new() { LoginProvider = Provider, ProviderKey = providerKey, NewPassword = newPassword };

    [Test]
    public async Task ValidLink_ChangesThePasswordAndNamesTheResolvedTarget()
    {
        await using var host = new IdentityTestHost(DbContext);
        var target = await host.CreateUserAsync(OldPassword);
        await host.AddLinkAsync(target.Id, Provider, "4821");
        var service = BuildService(host, callerId: 5, callerIsAdmin: true);

        var result = await service.SetLinkedAccountPassword(Request("4821", "brand-new-password"));

        Assert.That(result.Success, Is.True, result.Message);
        Assert.That(result.Model.Outcome, Is.EqualTo(SetLinkedPasswordOutcome.Changed));
        Assert.That(result.Model.TargetUserId, Is.EqualTo(target.Id));
        Assert.That(result.Model.TargetEmail, Is.EqualTo(target.Email));
        // Deviation D-F: a live account reports true, so Plan 3 can tell it apart from a
        // Changed on an account that cannot log in.
        Assert.That(result.Model.TargetIsActive, Is.True);

        var reread = await host.UserManager.FindByIdAsync(target.Id.ToString());
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, "brand-new-password"), Is.True);
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, OldPassword), Is.False);
    }

    // Deviation D-F, the whole reason TargetIsActive exists: a disabled account's password
    // IS set (no password path consults IsActive, so the two rule copies stay in
    // agreement), but the result must not read as a bare green Changed — the operator has
    // to be able to say "password set, but this account's login is disabled".
    [Test]
    public async Task ADisabledTarget_IsStillChangedButReportsTargetIsActiveFalse()
    {
        await using var host = new IdentityTestHost(DbContext);
        var target = await host.CreateUserAsync(OldPassword);
        await host.AddLinkAsync(target.Id, Provider, "4821");
        var row = await host.DbContext.Users.FirstAsync(u => u.Id == target.Id);
        row.IsActive = false;
        await host.DbContext.SaveChangesAsync();
        var service = BuildService(host, callerId: 5, callerIsAdmin: true);

        var result = await service.SetLinkedAccountPassword(Request("4821", "brand-new-password"));

        Assert.That(result.Model.Outcome, Is.EqualTo(SetLinkedPasswordOutcome.Changed),
            "IsActive is a LOGIN gate, not a password gate — adding a guard here would "
            + "make PasswordTargetGuardAgreementTests fail by construction");
        Assert.That(result.Model.TargetIsActive, Is.False,
            "false, not null: an account was resolved and its login is disabled");

        var reread = await host.UserManager.FindByIdAsync(target.Id.ToString());
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, "brand-new-password"), Is.True);
    }

    // The core safety property: an unknown key changes NOTHING, asserted on the hash.
    [Test]
    public async Task NoLink_ChangesNothing()
    {
        await using var host = new IdentityTestHost(DbContext);
        var bystander = await host.CreateUserAsync(OldPassword);
        var service = BuildService(host, callerId: 5, callerIsAdmin: true);
        var hashBefore = await host.StoredHashAsync(bystander.Id);

        var result = await service.SetLinkedAccountPassword(Request("no-such-key", "brand-new-password"));

        Assert.That(result.Success, Is.True, "a decided verdict is a success; the caller reads Outcome");
        Assert.That(result.Model.Outcome, Is.EqualTo(SetLinkedPasswordOutcome.NoLink));
        Assert.That(result.Model.TargetUserId, Is.Null);
        Assert.That(result.Model.TargetEmail, Is.Null);
        // The third state: no account was resolved, so IsActive is UNKNOWN. A consumer
        // must test == false to warn, never != true, or it would warn on this case too.
        Assert.That(result.Model.TargetIsActive, Is.Null);
        Assert.That(result.Model.Detail, Is.EqualTo("NoLinkedAccountForProviderKey"));
        Assert.That(await host.StoredHashAsync(bystander.Id), Is.EqualTo(hashBefore));
    }

    // Decision D-1, defence in depth: link creation already refuses Id 1, so this branch
    // should be unreachable through our own paths. It exists to keep the endpoint safe
    // against a link created out-of-band or straight in the database.
    [Test]
    public async Task TargetIsPrimaryAdminAndCallerIsNot_IsRefusedAndChangesNothing()
    {
        await using var host = new IdentityTestHost(DbContext);
        // A provider key of its own: this fixture's user Id 1 is not owned by the harness,
        // so its link cannot be cleaned up by the cascade and must not collide with the
        // "4821" every other test here uses.
        var providerKey = $"primary-{Guid.NewGuid():N}";
        var seededPrimaryAdmin = await EnsurePrimaryAdminAsync(host);
        try
        {
            await host.AddLinkAsync(1, Provider, providerKey);
            var service = BuildService(host, callerId: 5, callerIsAdmin: true);
            var hashBefore = await host.StoredHashAsync(1);

            var result = await service.SetLinkedAccountPassword(Request(providerKey, "brand-new-password"));

            Assert.That(result.Model.Outcome, Is.EqualTo(SetLinkedPasswordOutcome.RefusedPrimaryAdmin),
                "RefusedPrimaryAdmin, not the generic RefusedByPolicy: the plugin's "
                + "outcome table distinguishes them");
            Assert.That(result.Model.Detail, Is.EqualTo("CantEditPrimaryAdminUser"),
                "the same message AdminChangePassword returns — from this path's OWN copy of "
                + "the rule; PasswordTargetGuardAgreementTests is what keeps the copies equal");
            Assert.That(result.Model.TargetUserId, Is.EqualTo(1));
            Assert.That(await host.StoredHashAsync(1), Is.EqualTo(hashBefore));
        }
        finally
        {
            await host.DbContext.Set<IdentityUserLogin<int>>()
                .Where(x => x.LoginProvider == Provider && x.ProviderKey == providerKey)
                .ExecuteDeleteAsync();
            if (seededPrimaryAdmin)
            {
                await host.DbContext.Users.Where(u => u.Id == 1).ExecuteDeleteAsync();
            }
        }
    }

    /// <summary>
    /// Makes sure a user with Id 1 exists and reports whether THIS test created it, so the
    /// teardown removes only its own row.
    ///
    /// angular-tests has no Id 1 on a clean checkout and DbTestFixture.ClearDb() silently
    /// no-ops, so a test that merely asserted "seed one first" would pass on a developer's
    /// machine and fail in CI. Raw SQL with an explicit Id because the column is
    /// AUTO_INCREMENT: UserManager cannot be asked for a particular Id.
    /// </summary>
    private static async Task<bool> EnsurePrimaryAdminAsync(IdentityTestHost host)
    {
        if (await host.DbContext.Users.AsNoTracking().AnyAsync(u => u.Id == 1))
        {
            return false;
        }

        var email = $"primary-{Guid.NewGuid():N}@example.test";
        var hash = new PasswordHasher<EformUser>().HashPassword(
            new EformUser { Email = email, UserName = email }, OldPassword);

        await host.DbContext.Database.ExecuteSqlRawAsync(
            "INSERT INTO Users (Id, UserName, NormalizedUserName, Email, NormalizedEmail, "
            + "FirstName, LastName, Locale, TimeZone, Formats, EmailConfirmed, "
            + "PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount, "
            + "IsGoogleAuthenticatorEnabled, SecurityStamp, PasswordHash) "
            + "VALUES (1, {0}, {1}, {0}, {1}, 'Primary', 'Admin', 'en', "
            + "'Europe/Copenhagen', 'de-DE', 1, 0, 0, 1, 0, 0, UUID(), {2})",
            email, email.ToUpperInvariant(), hash);

        return true;
    }

    // Two of our links on one account: undecidable, so nothing happens. Fails closed.
    [Test]
    public async Task TwoLinksForOurProviderOnOneAccount_IsAmbiguousAndChangesNothing()
    {
        await using var host = new IdentityTestHost(DbContext);
        var target = await host.CreateUserAsync(OldPassword);
        await host.AddLinkAsync(target.Id, Provider, "4821");
        await host.AddLinkAsync(target.Id, Provider, "9999");
        var service = BuildService(host, callerId: 5, callerIsAdmin: true);
        var hashBefore = await host.StoredHashAsync(target.Id);

        var result = await service.SetLinkedAccountPassword(Request("4821", "brand-new-password"));

        Assert.That(result.Model.Outcome, Is.EqualTo(SetLinkedPasswordOutcome.AmbiguousLink));
        Assert.That(result.Model.TargetUserId, Is.EqualTo(target.Id));
        Assert.That(result.Model.Detail, Is.EqualTo("AmbiguousExternalLink"));
        Assert.That(await host.StoredHashAsync(target.Id), Is.EqualTo(hashBefore));
    }

    // The §2.2 correction, tested: a Google row on the same account is not ours, so it
    // must not make us report AmbiguousLink.
    [Test]
    public async Task AForeignProviderLinkOnTheSameAccount_DoesNotMakeUsReportAmbiguous()
    {
        await using var host = new IdentityTestHost(DbContext);
        var target = await host.CreateUserAsync(OldPassword);
        await host.AddLinkAsync(target.Id, Provider, "4821");
        await host.AddLinkAsync(target.Id, "Google", "google-subject-123");
        var service = BuildService(host, callerId: 5, callerIsAdmin: true);

        var result = await service.SetLinkedAccountPassword(Request("4821", "brand-new-password"));

        Assert.That(result.Model.Outcome, Is.EqualTo(SetLinkedPasswordOutcome.Changed));
    }

    [Test]
    public async Task NonAdminCallerTargetingAnAdmin_IsRefusedByPolicyAndChangesNothing()
    {
        await using var host = new IdentityTestHost(DbContext);
        var target = await host.CreateUserAsync(OldPassword);
        await host.AddLinkAsync(target.Id, Provider, "4821");
        // Put the target in the admin role for real, so the guard's IsInRoleAsync sees it.
        await host.EnsureRoleAsync(EformRole.Admin);
        await host.UserManager.AddToRoleAsync(target, EformRole.Admin);
        var service = BuildService(host, callerId: 5, callerIsAdmin: false,
            AuthConsts.EformClaims.UserManagementClaims.Update);
        var hashBefore = await host.StoredHashAsync(target.Id);

        var result = await service.SetLinkedAccountPassword(Request("4821", "brand-new-password"));

        Assert.That(result.Model.Outcome, Is.EqualTo(SetLinkedPasswordOutcome.RefusedByPolicy));
        Assert.That(result.Model.Detail, Is.EqualTo("YouCantViewChangeOrDeleteAdmin"),
            "the admin-target rule, not some other refusal that also returns RefusedByPolicy");
        Assert.That(await host.StoredHashAsync(target.Id), Is.EqualTo(hashBefore));
    }

    // Rule 4: a non-admin's own account goes through change-password, which demands the
    // current password. Its own message, so it cannot be confused with rule 3 or rule 5.
    [Test]
    public async Task NonAdminCallerTargetingItself_IsRefusedAndChangesNothing()
    {
        await using var host = new IdentityTestHost(DbContext);
        var target = await host.CreateUserAsync(OldPassword);
        await host.AddLinkAsync(target.Id, Provider, "4821");
        var service = BuildService(host, callerId: target.Id, callerIsAdmin: false,
            AuthConsts.EformClaims.UserManagementClaims.Update);
        var hashBefore = await host.StoredHashAsync(target.Id);

        var result = await service.SetLinkedAccountPassword(Request("4821", "brand-new-password"));

        Assert.That(result.Model.Outcome, Is.EqualTo(SetLinkedPasswordOutcome.RefusedByPolicy));
        Assert.That(result.Model.Detail, Is.EqualTo("UseChangePasswordForYourOwnAccount"));
        Assert.That(await host.StoredHashAsync(target.Id), Is.EqualTo(hashBefore));
    }

    // A device-user manager may reach only a live worker, exactly as on the old route.
    [Test]
    public async Task DeviceUserManagerTargetingANonWorker_IsRefusedAndChangesNothing()
    {
        await using var host = new IdentityTestHost(DbContext);
        var target = await host.CreateUserAsync(OldPassword);
        await host.AddLinkAsync(target.Id, Provider, "4821");
        var service = BuildService(host, callerId: 5, callerIsAdmin: false,
            AuthConsts.EformClaims.DeviceUsersClaims.Update);
        _workerAccountLookup.IsLiveWorkerAsync(target.Email).Returns(false);
        var hashBefore = await host.StoredHashAsync(target.Id);

        var result = await service.SetLinkedAccountPassword(Request("4821", "brand-new-password"));

        Assert.That(result.Model.Outcome, Is.EqualTo(SetLinkedPasswordOutcome.RefusedByPolicy));
        Assert.That(result.Model.Detail, Is.EqualTo("YouMayOnlySetPasswordsForWorkers"));
        Assert.That(await host.StoredHashAsync(target.Id), Is.EqualTo(hashBefore));
    }

    // Rule 6: being a live worker is not the same as holding only a worker's rights. A
    // device-user manager must not reset an account that holds a claim it lacks, or the
    // reset would hand it rights it does not have.
    [Test]
    public async Task DeviceUserManagerTargetingAMorePrivilegedWorker_IsRefusedAndChangesNothing()
    {
        await using var host = new IdentityTestHost(DbContext);
        var target = await host.CreateUserAsync(OldPassword);
        await host.AddLinkAsync(target.Id, Provider, "4821");
        var service = BuildService(host, callerId: 5, callerIsAdmin: false,
            AuthConsts.EformClaims.DeviceUsersClaims.Update);
        _workerAccountLookup.IsLiveWorkerAsync(target.Email).Returns(true);
        _claimsService.GetUserClaims(target.Id).Returns(new List<Claim>
        {
            new(AuthConsts.EformClaims.UserManagementClaims.Update, AuthConsts.ClaimDefaultValue)
        });
        var hashBefore = await host.StoredHashAsync(target.Id);

        var result = await service.SetLinkedAccountPassword(Request("4821", "brand-new-password"));

        Assert.That(result.Model.Outcome, Is.EqualTo(SetLinkedPasswordOutcome.RefusedByPolicy));
        Assert.That(result.Model.Detail,
            Is.EqualTo("YouCantSetPasswordForMorePrivilegedAccount"),
            "rule 6's own key — not rule 5's YouMayOnlySetPasswordsForWorkers, which the "
            + "same branch also returns");
        Assert.That(await host.StoredHashAsync(target.Id), Is.EqualTo(hashBefore));
    }

    // The same device-user manager reaching a worker that holds nothing extra: permitted.
    // Without this, the two rules above would also pass a guard that refused everyone.
    [Test]
    public async Task DeviceUserManagerTargetingAPlainLiveWorker_IsPermitted()
    {
        await using var host = new IdentityTestHost(DbContext);
        var target = await host.CreateUserAsync(OldPassword);
        await host.AddLinkAsync(target.Id, Provider, "4821");
        var service = BuildService(host, callerId: 5, callerIsAdmin: false,
            AuthConsts.EformClaims.DeviceUsersClaims.Update);
        _workerAccountLookup.IsLiveWorkerAsync(target.Email).Returns(true);

        var result = await service.SetLinkedAccountPassword(Request("4821", "brand-new-password"));

        Assert.That(result.Model.Outcome, Is.EqualTo(SetLinkedPasswordOutcome.Changed));
    }

    [Test]
    public async Task ATooShortPassword_IsRejectedAndTheOldPasswordStillWorks()
    {
        await using var host = new IdentityTestHost(DbContext);
        var target = await host.CreateUserAsync(OldPassword);
        await host.AddLinkAsync(target.Id, Provider, "4821");
        var service = BuildService(host, callerId: 5, callerIsAdmin: true);
        var hashBefore = await host.StoredHashAsync(target.Id);

        var result = await service.SetLinkedAccountPassword(Request("4821", "short"));

        Assert.That(result.Model.Outcome, Is.EqualTo(SetLinkedPasswordOutcome.PasswordRejected));
        Assert.That(result.Model.Detail, Is.Not.Null.And.Not.Empty);
        Assert.That(await host.StoredHashAsync(target.Id), Is.EqualTo(hashBefore));
        var reread = await host.UserManager.FindByIdAsync(target.Id.ToString());
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, OldPassword), Is.True);
    }

    // Not a generic external-login tool. A malformed request is the one case where
    // Success is false rather than carrying an Outcome.
    [Test]
    public async Task AnUnsupportedProvider_IsRefusedWithoutAnOutcome()
    {
        await using var host = new IdentityTestHost(DbContext);
        var service = BuildService(host, callerId: 5, callerIsAdmin: true);

        var result = await service.SetLinkedAccountPassword(new SetLinkedAccountPasswordModel
        {
            LoginProvider = "Google", ProviderKey = "google-subject-123", NewPassword = "brand-new-password"
        });

        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("UnsupportedExternalLoginProvider"));
        Assert.That(result.Model, Is.Null, "a malformed request carries no verdict");
    }

    [Test]
    public async Task ABlankProviderKey_IsRefusedWithoutAnOutcome()
    {
        await using var host = new IdentityTestHost(DbContext);
        var service = BuildService(host, callerId: 5, callerIsAdmin: true);

        var result = await service.SetLinkedAccountPassword(Request("   ", "brand-new-password"));

        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("ExternalLinkProviderKeyRequired"));
    }

    // Fails closed: no HTTP principal must refuse, not throw and not fall through.
    [Test]
    public async Task NoCallerPrincipal_IsRefusedAndChangesNothing()
    {
        await using var host = new IdentityTestHost(DbContext);
        var target = await host.CreateUserAsync(OldPassword);
        await host.AddLinkAsync(target.Id, Provider, "4821");
        var serviceWithNoPrincipal = BuildServiceWithoutPrincipal(host);
        var hashBefore = await host.StoredHashAsync(target.Id);

        var result = await serviceWithNoPrincipal.SetLinkedAccountPassword(
            Request("4821", "brand-new-password"));

        Assert.That(result.Model.Outcome, Is.EqualTo(SetLinkedPasswordOutcome.RefusedByPolicy));
        Assert.That(result.Model.Detail, Is.EqualTo("YouMayOnlySetPasswordsForWorkers"));
        Assert.That(await host.StoredHashAsync(target.Id), Is.EqualTo(hashBefore));
    }

    private static AccountService BuildServiceWithoutPrincipal(IdentityTestHost host)
    {
        var userService = Substitute.For<IUserService>();
        userService.UserId.Returns(5);
        var localizationService = Substitute.For<ILocalizationService>();
        localizationService.GetString(Arg.Any<string>()).Returns(args => args.Arg<string>());
        var httpContextAccessor = Substitute.For<IHttpContextAccessor>();
        httpContextAccessor.HttpContext.Returns((HttpContext)null);
        var claimsService = Substitute.For<IClaimsService>();
        claimsService.GetUserClaims(Arg.Any<int>()).Returns(new List<Claim>());

        return new AccountService(
            Substitute.For<IEFormCoreService>(),
            host.UserManager,
            userService,
            Substitute.For<IDbOptions<ApplicationSettings>>(),
            localizationService,
            host.DbContext,
            Substitute.For<IEmailService>(),
            httpContextAccessor,
            Substitute.For<IWorkerAccountLookup>(),
            claimsService,
            Substitute.For<ILogger<AccountService>>());
    }
}
