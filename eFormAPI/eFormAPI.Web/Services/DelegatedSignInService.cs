using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models.DelegatedAccess;
using eFormAPI.Web.Infrastructure.Models.ExternalLinks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Permissions;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services;

using Infrastructure.Models.Auth;

/// <summary>
/// Resolve-or-provision the credential-less advisor principal, then mint this tenant's
/// own session for it.
///
/// Every guarantee this feature rests on is enforced here:
///
/// <list type="bullet">
/// <item><b>No credential, ever.</b> The principal is created with Identity's
/// no-password overload, so <c>PasswordHash</c> is null, and it carries a
/// <see cref="ExternalLoginProviders.MyMicrotingDelegated"/> login row, which every
/// password-setting path refuses (<c>UserManagerLockoutExtensions.IsDelegatedPrincipalAsync</c>).
/// P3's password fan-out resolves its targets under the P1 constant and therefore cannot
/// see this row at all.</item>
/// <item><b>No tenant-native account is ever adopted or modified.</b> The ONLY resolution
/// key is (delegated provider, <c>sub</c>). Email is never a key: the same address is
/// different people in different organisations. A synthetic address that collides with a
/// real account is disambiguated, never reused.</item>
/// <item><b>The advisor's real email never enters the customer's database.</b> The row
/// carries a generated identifier derived from <c>sub</c> plus a non-deliverable address
/// (Business Central's precedent, spec §8.4). The display name is stored for audit
/// attribution only and is never an identifier.</item>
/// <item><b>The role is chosen server-side.</b> Nothing in the assertion names a role;
/// the asserted template is looked up in <see cref="RolesByTemplate"/>, which contains no
/// administrative entry and is additionally guarded against one. User Id 1 is never a
/// target.</item>
/// </list>
///
/// This service VALIDATES NOTHING about the assertion. Holding a
/// <see cref="DelegatedAssertion"/> is proof the checks passed
/// (<see cref="IDelegatedAssertionValidator"/>), and the validator CONSUMES the
/// <c>jti</c> before constructing one — so any failure below costs the advisor a fresh
/// assertion from the portal. That is deliberate and is not worked around: a replay
/// window that opens whenever provisioning fails would be a worse bargain than a retry.
///
/// This file is the fourth entry on
/// <c>NoRuntimeBindingSourceTests.TheExternalLoginApiIsCalledOnlyFromTheFourAllowlistedFiles</c>'s
/// allowlist. It is the delegated SIGN-IN path: it creates and reads links, and can never
/// set a credential. The rule that allowlist protects — that the PASSWORD login path
/// (<c>AuthService</c>, <c>UserService</c>, <c>ClaimsTransformer</c>) never consults a
/// link — is untouched and is independently pinned byte-for-byte by the CI fence.
/// </summary>
public sealed class DelegatedSignInService(
    UserManager<EformUser> userManager,
    BaseDbContext dbContext,
    IAuthService authService,
    IUserService userService,
    IOptionsMonitor<DelegatedAccessOptions> options,
    ILogger<DelegatedSignInService> logger)
    : IDelegatedSignInService
{
    /// <summary>
    /// The one uniform refusal. Which check refused is in the log, never in the response:
    /// the endpoint is anonymous, so a caller must not be able to tell "that advisor's
    /// local account is disabled" from "that template is unknown".
    /// </summary>
    private const string RefusedMessage = "DelegatedSignInRefused";

    /// <summary>
    /// The role template the portal asserts for an advisor. A wire contract with another
    /// repository, exactly like the claim names in <see cref="DelegatedAssertionClaims"/>:
    /// a template this tenant does not know is REFUSED rather than defaulted, so a
    /// mismatch fails loudly at the first integration sign-in instead of silently handing
    /// somebody the default permission set on a customer's tenant.
    ///
    /// static readonly rather than const, for SonarC# S2339. It is declared above
    /// <see cref="RolesByTemplate"/> on purpose: static field initialisers run in textual
    /// order, so the dictionary below sees the value, not null.
    /// </summary>
    public static readonly string AdvisorRoleTemplate = "advisor";

    /// <summary>Domain for the synthetic address. <c>.invalid</c> is reserved by RFC 2606
    /// and resolves nowhere, so the row can never be mailed, and a human reading the user
    /// list can see at a glance that the address is not a real one.</summary>
    public static readonly string SyntheticAddressDomain = "delegated.invalid";

    private const string SyntheticAddressPrefix = "delegated-";

    /// <summary>Hex characters of the subject digest kept in the synthetic address. 32 of
    /// SHA-256's 64 is 128 bits: far past any birthday-collision concern across every
    /// advisor of every partner, while keeping the address readable.</summary>
    private const int SubjectDigestChars = 32;

    /// <summary>Characters of the digest used in the audit display name.</summary>
    private const int ShortDigestChars = 8;

    /// <summary>Longest display name stored on the row. Audit attribution, not a
    /// document; a megabyte <c>name</c> claim must not become a megabyte column.</summary>
    private const int MaxDisplayNameChars = 128;

    /// <summary>
    /// How many addresses to try before giving up. Attempt 1 is the deterministic address;
    /// the rest carry random disambiguators, so the only way to exhaust this is a database
    /// that refuses every insert for a reason that is not a duplicate at all.
    /// </summary>
    private const int MaxCreateAttempts = 4;

    /// <summary>
    /// Template → tenant role, resolved SERVER-SIDE. The caller cannot request a role; it
    /// can only name a template, and an unknown one is refused.
    ///
    /// <see cref="EformRole.Admin"/> is deliberately absent and may never be added: the
    /// spec makes it unreachable by this path unconditionally (§8.5), and
    /// <see cref="TryResolveRole"/> refuses it a second time in case someone adds it here
    /// anyway.
    /// </summary>
    private static readonly Dictionary<string, string> RolesByTemplate =
        new(StringComparer.OrdinalIgnoreCase)
        {
            [AdvisorRoleTemplate] = EformRole.User
        };

    /// <summary>
    /// The address this tenant derives for <paramref name="subject"/>: deterministic, so
    /// one advisor gets one row, and one-way, so the customer's database never learns the
    /// portal's identifier for them.
    ///
    /// Public so the tests can assert the real collision case — a tenant-native account
    /// that already holds this exact address — rather than a case they invented.
    /// </summary>
    public static string SyntheticAddressFor(string subject)
        => $"{SyntheticAddressPrefix}{SubjectDigest(subject, SubjectDigestChars)}@{SyntheticAddressDomain}";

    public async Task<OperationDataResult<EformAuthorizeResult>> SignInAsync(
        DelegatedAssertion assertion, CancellationToken ct)
    {
        if (assertion == null)
        {
            // Unreachable through the endpoint: the controller only ever passes a
            // validated result. Refuse rather than throw, so a future caller's mistake is
            // a failed sign-in and not a 500 on an anonymous route.
            logger.LogError("Delegated sign-in called with no assertion.");
            return Refused();
        }

        // The only cancellation check. Identity's UserManager exposes no cancellable
        // overloads, and abandoning the work between the user row and its login row would
        // leave a principal nothing can ever resolve — so once provisioning starts it
        // finishes.
        ct.ThrowIfCancellationRequested();

        if (!TryResolveRole(assertion.RoleTemplate, out var roleName))
        {
            logger.LogWarning(
                "Delegated sign-in refused: unknown role template {RoleTemplate} (jti {JwtId}).",
                DelegatedAssertionValidator.ForLog(assertion.RoleTemplate),
                DelegatedAssertionValidator.ForLog(assertion.JwtId));
            return Refused();
        }

        // (provider, sub) is the whole resolution rule. OIDC Core: iss + sub is the only
        // guaranteed-unique identifier for an end user. The issuer half is fixed by the
        // validator's configured issuer, so the provider constant stands for it here.
        var user = await userManager.FindByLoginAsync(
            ExternalLoginProviders.MyMicrotingDelegated, assertion.Subject);

        var created = false;
        if (user == null)
        {
            var provisioned = await ProvisionAsync(assertion, roleName);
            if (provisioned.User == null)
            {
                return Refused();
            }

            user = provisioned.User;
            created = provisioned.Created;
        }

        var gate = await CheckSignInGateAsync(user, assertion);
        if (gate != null)
        {
            return gate;
        }

        var roles = await userManager.GetRolesAsync(user);

        // Mirrors AuthenticateUser: a user with no role gets no token. For a delegated
        // principal this is also the revocation lever — the customer strips the template
        // role from the advisor's row and the next sign-in has nothing to issue.
        if (roles.Count == 0)
        {
            logger.LogWarning(
                "Delegated sign-in refused: local user {UserId} holds no role (jti {JwtId}).",
                user.Id, DelegatedAssertionValidator.ForLog(assertion.JwtId));
            return Refused();
        }

        // ORDERING INVARIANT, and the whole point of this call site. GenerateToken reads
        // SecurityGroupUsers -> GroupPermissions -> Permission.ClaimName through
        // ClaimsService and freezes the result into the session's auth cache entry. A
        // membership written AFTER this line would leave the first delegated session with
        // an empty claim set -- an empty left menu and "No records found" -- and only the
        // NEXT sign-in would work. So the row is committed first, unconditionally, and
        // the token is minted from a database that already has it.
        //
        // It runs on every sign-in, not only at creation, for two reasons: principals
        // provisioned before this existed hold no membership and must heal on their next
        // visit, and a membership a human removed by hand is not the revocation lever --
        // the ROLE is (spec 8.7), and an advisor whose role was stripped was already
        // refused a dozen lines above.
        await EnsureSecurityGroupMembershipAsync(user, assertion);

        var token = await authService.GenerateToken(user);
        var firstUserIdInDb = await userService.GetFirstUserIdInDb();

        // Spec §8.6. The tenant-side record that makes an advisor's actions attributable,
        // and the input the deferred portal audit log will consume. The resolved LOCAL id
        // is what ties it to everything else the advisor touches. Never the assertion
        // itself, and every value that came off the wire goes through ForLog.
        logger.LogInformation(
            "Delegated sign-in: localUserId={UserId}, subject={Subject}, jti={JwtId}, "
            + "roleTemplate={RoleTemplate}, principal={Principal}.",
            user.Id,
            DelegatedAssertionValidator.ForLog(assertion.Subject),
            DelegatedAssertionValidator.ForLog(assertion.JwtId),
            DelegatedAssertionValidator.ForLog(assertion.RoleTemplate),
            created ? "created" : "reused");

        return new OperationDataResult<EformAuthorizeResult>(true, new EformAuthorizeResult
        {
            Id = user.Id,
            AccessToken = token.token,
            UserName = user.UserName,
            Role = roles.FirstOrDefault(),
            ExpiresIn = token.expireIn,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsFirstUser = user.Id == firstUserIdInDb,
            AvatarUrl = user.ProfilePictureSnapshot != null
                ? $"api/images/login-page-images?fileName={user.ProfilePictureSnapshot}"
                : $"https://www.gravatar.com/avatar/{user.EmailSha256}?s=32&d=identicon"
        });
    }

    /// <summary>
    /// Puts the principal in the tenant's advisor security group, which is where its
    /// permissions -- and therefore its menu and its data -- come from. Idempotent: it is
    /// called on every sign-in and writes at most one row per (group, user) ever.
    ///
    /// A MISSING GROUP IS A WARNING, NEVER A REFUSAL. Both halves of that matter:
    /// <list type="bullet">
    /// <item>Loud, because the failure this fixes -- a signed-in advisor staring at an
    /// empty menu with not one line in the log to say why -- cost a day to diagnose. The
    /// line names the group it looked for and the customer number, so the next person
    /// reads the fix straight off it.</item>
    /// <item>Not fatal, because the two outcomes are not symmetric. Signing in with no
    /// permissions is recoverable in a minute by an administrator who creates or renames
    /// the group; throwing here is a 500 in the middle of a redirect the advisor cannot
    /// retry their way out of, on a path that has already validated a legitimate
    /// assertion.</item>
    /// </list>
    /// </summary>
    private async Task EnsureSecurityGroupMembershipAsync(
        EformUser user, DelegatedAssertion assertion)
    {
        var opts = options.CurrentValue;

        // An unset or blank key is the normal case and means the default. Trimmed because
        // a trailing space in a configuration value must not cost an advisor their menu.
        var groupName = string.IsNullOrWhiteSpace(opts?.SecurityGroup)
            ? DelegatedAccessOptions.DefaultSecurityGroup
            : opts.SecurityGroup.Trim();

        // Matched on the name as configured. The comparison is sent to the database, so it
        // is the tenant's own collation that decides, which on MariaDB is case-insensitive
        // -- deliberately not fought: "eForm Users" typed by an administrator is the group
        // they meant. OrderBy(Id) keeps the choice deterministic if a case-insensitive
        // collation makes two rows match.
        var groupId = await dbContext.SecurityGroups
            .Where(x => x.Name == groupName)
            .OrderBy(x => x.Id)
            .Select(x => (int?)x.Id)
            .FirstOrDefaultAsync();

        if (groupId == null)
        {
            logger.LogWarning(
                "Delegated sign-in: local user {UserId} was signed in with NO permissions: "
                + "this tenant has no security group named '{SecurityGroup}' "
                + "(customerNo {CustomerNo}, jti {JwtId}). The advisor will see an empty "
                + "menu until that group exists, or until DelegatedAccess:SecurityGroup "
                + "names one that does.",
                user.Id,
                DelegatedAssertionValidator.ForLog(groupName),
                DelegatedAssertionValidator.ForLog(opts?.Audience),
                DelegatedAssertionValidator.ForLog(assertion.JwtId));
            return;
        }

        // The idempotence check, and it covers a membership a HUMAN added just as well as
        // one an earlier sign-in added: this path owns no row, it only ensures one exists.
        var alreadyMember = await dbContext.SecurityGroupUsers
            .AnyAsync(x => x.SecurityGroupId == groupId.Value && x.EformUserId == user.Id);
        if (alreadyMember)
        {
            return;
        }

        var membership = dbContext.SecurityGroupUsers.Add(new SecurityGroupUser
        {
            SecurityGroupId = groupId.Value,
            EformUserId = user.Id
        });

        try
        {
            await dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            // Two concurrent first sign-ins can both pass the check above, and whatever
            // the database then says, the answer is the same: detach the pending insert so
            // the next save on this scoped context does not retry it, and carry on. A
            // duplicate membership is harmless -- the claim query is Distinct -- and a
            // genuine write failure is still not worth a 500 mid-redirect: it costs the
            // advisor their menu, which is exactly what the warning above describes.
            membership.State = EntityState.Detached;
            logger.LogWarning(ex,
                "Delegated sign-in: could not add local user {UserId} to security group "
                + "{SecurityGroupId} (jti {JwtId}).",
                user.Id, groupId.Value,
                DelegatedAssertionValidator.ForLog(assertion.JwtId));
        }
    }

    /// <summary>
    /// The checks a resolved principal must pass before a token is minted for it, whether
    /// it was just created or has existed for a year. Returns null when it passes.
    /// </summary>
    private async Task<OperationDataResult<EformAuthorizeResult>> CheckSignInGateAsync(
        EformUser user, DelegatedAssertion assertion)
    {
        // Defence in depth, not an expected branch: nothing here can create a link on
        // user Id 1, but a hand-written row could, and the primary admin is never a
        // delegated target (spec §8.5, matching P1's guard).
        if (user.Id == 1)
        {
            logger.LogError(
                "Delegated sign-in refused: a delegated link resolves to the primary admin "
                + "(jti {JwtId}). That link should not exist.",
                DelegatedAssertionValidator.ForLog(assertion.JwtId));
            return Refused();
        }

        // The same two levers that disable a password login disable this one. Without the
        // EmailConfirmed check the host's login gate (AuthService.cs:100) would apply to
        // every tenant user EXCEPT the federated ones, which is the wrong way round.
        if (!user.IsActive || !user.EmailConfirmed)
        {
            logger.LogWarning(
                "Delegated sign-in refused: local user {UserId} is disabled "
                + "(isActive={IsActive}, emailConfirmed={EmailConfirmed}, jti {JwtId}).",
                user.Id, user.IsActive, user.EmailConfirmed,
                DelegatedAssertionValidator.ForLog(assertion.JwtId));
            return Refused();
        }

        // Unconditional, and checked on the RESOLVED user rather than only at creation: if
        // an administrator ever links an admin account under the delegated provider, this
        // path still refuses to be the way in.
        if (await userManager.IsInRoleAsync(user, EformRole.Admin))
        {
            logger.LogError(
                "Delegated sign-in refused: local user {UserId} holds the admin role "
                + "(jti {JwtId}). Delegated access can never be administrative.",
                user.Id, DelegatedAssertionValidator.ForLog(assertion.JwtId));
            return Refused();
        }

        return null;
    }

    /// <summary>
    /// Creates the credential-less principal, its delegated link and its role.
    ///
    /// Three outcomes, and the middle one is the whole reason this is not four lines:
    /// created; already created by a CONCURRENT first sign-in, in which case that one is
    /// adopted and ours is rolled back; or failed, in which case nothing is left behind.
    /// </summary>
    private async Task<(EformUser User, bool Created)> ProvisionAsync(
        DelegatedAssertion assertion, string roleName)
    {
        var baseAddress = SyntheticAddressFor(assertion.Subject);
        var (firstName, lastName) = AuditName(assertion);

        for (var attempt = 0; attempt < MaxCreateAttempts; attempt++)
        {
            // Attempt 0 is the deterministic address. A later attempt only happens when
            // the address is already taken by an account this path must NOT adopt — a
            // tenant-native user, or an orphaned delegated row whose link has gone.
            var address = attempt == 0 ? baseAddress : Disambiguate(baseAddress);

            var user = new EformUser
            {
                UserName = address,
                Email = address,
                FirstName = firstName,
                LastName = lastName,
                Locale = "da",
                TimeZone = "Europe/Copenhagen",
                Formats = "de-DE",
                // Without this the host's login gate (AuthService.cs:100) would refuse
                // the principal, and there is no address to confirm: the row's address is
                // synthetic and unroutable by construction.
                EmailConfirmed = true,
                IsActive = true,
                TwoFactorEnabled = false,
                IsGoogleAuthenticatorEnabled = false
            };

            // The NO-PASSWORD overload. PasswordHash stays null, and it must: this is the
            // single line that makes the advisor's principal credential-less. Never add a
            // password argument here, not even a random one.
            IdentityResult createResult;
            try
            {
                createResult = await userManager.CreateAsync(user);
            }
            catch (DbUpdateException ex) when (IsIntegrityConstraintViolation(ex))
            {
                // Identity's validator checks uniqueness before the insert, so a failure
                // HERE means another writer inserted the same normalised user name between
                // that check and ours. Treat it exactly like the validator's duplicate.
                DiscardPendingInserts();
                createResult = null;
            }

            if (createResult is { Succeeded: false } && !IsDuplicate(createResult))
            {
                logger.LogError(
                    "Delegated sign-in: could not create the local principal (jti {JwtId}): {Errors}",
                    DelegatedAssertionValidator.ForLog(assertion.JwtId),
                    string.Join(" ", createResult.Errors.Select(e => e.Description)));
                return (null, false);
            }

            if (createResult is not { Succeeded: true })
            {
                // The address is taken. By whom decides what happens next: a concurrent
                // first sign-in for this same sub has produced the principal we were about
                // to create, and we adopt it; anything else is a tenant-native account
                // that must not be touched, so we take a different address.
                var concurrent = await userManager.FindByLoginAsync(
                    ExternalLoginProviders.MyMicrotingDelegated, assertion.Subject);
                if (concurrent != null)
                {
                    return (concurrent, false);
                }

                continue;
            }

            // ORDERING INVARIANT, and the reason this is not the obvious order: the link
            // is the DISCOVERY key, so it is written LAST. A concurrent request can only
            // adopt a principal it can find, and it can only find one that already has
            // its role — otherwise the adopter reads an empty role list and refuses a
            // sign-in that is merely a few milliseconds early. Writing the role first
            // costs nothing and closes that window by construction rather than by
            // retrying. (The role row commits before the link row, so any reader that
            // sees the link sees the role: a snapshot new enough to include the later
            // write includes the earlier one.)
            //
            // The role is added ONCE, at creation, and never re-asserted on a later
            // sign-in: re-adding it would quietly undo a customer who stripped it, which
            // is the revocation lever the spec gives them (§8.7).
            if (!await AddRoleAsync(user, roleName, assertion))
            {
                // No link has been written, so nothing can ever resolve this row. Leaving
                // it would also park the deterministic address on an unusable account and
                // push every later attempt onto a disambiguated one.
                await DeleteOrphanAsync(user, assertion);
                return (null, false);
            }

            var linked = await LinkAsync(user, assertion);
            if (linked.Winner != null)
            {
                return (linked.Winner, false);
            }

            if (!linked.Succeeded)
            {
                // Winner is null here, because a named winner returned above: the key was
                // refused and yet a re-read named no holder, so the row that held it was
                // rolled back in the gap between the two reads. Retry rather than refuse
                // an advisor over a collision that no longer exists — our own row is
                // already deleted and the loop is bounded.
                continue;
            }

            return (user, true);
        }

        logger.LogError(
            "Delegated sign-in: could not provision a local principal after {Attempts} "
            + "attempts (jti {JwtId}).",
            MaxCreateAttempts, DelegatedAssertionValidator.ForLog(assertion.JwtId));
        return (null, false);
    }

    /// <summary>
    /// Writes the (delegated provider, <c>sub</c>) row, the only thing that makes the new
    /// user findable. A non-null <c>Winner</c> means a concurrent sign-in got there first:
    /// our own row has been deleted and the caller must use the winner.
    /// </summary>
    private async Task<(bool Succeeded, EformUser Winner)> LinkAsync(
        EformUser user, DelegatedAssertion assertion)
    {
        try
        {
            var result = await userManager.AddLoginAsync(user, new UserLoginInfo(
                ExternalLoginProviders.MyMicrotingDelegated,
                assertion.Subject,
                ExternalLoginProviders.MyMicrotingDelegated));
            if (result.Succeeded)
            {
                return (true, null);
            }

            if (IsLoginAlreadyAssociated(result))
            {
                // The USUAL shape of a lost race, and the reason this branch exists at
                // all: UserManager.AddLoginAsync re-reads the key with FindByLoginAsync
                // before it writes, so when the other request got there first this comes
                // back as an IdentityResult and the database is never asked. It is a
                // benign, expected outcome — two tabs, or two advisors arriving together
                // — so it is logged at information level beside the violation path below.
                // Logging it as an error would page somebody for a working sign-in.
                LogLostRace(assertion);
            }
            else
            {
                logger.LogError(
                    "Delegated sign-in: could not link local user {UserId} (jti {JwtId}): {Errors}",
                    user.Id, DelegatedAssertionValidator.ForLog(assertion.JwtId),
                    string.Join(" ", result.Errors.Select(e => e.Description)));
            }
        }
        catch (DbUpdateException ex) when (IsIntegrityConstraintViolation(ex))
        {
            // UserLogins is keyed on (LoginProvider, ProviderKey), so the database itself
            // serialises two concurrent first sign-ins for one sub. Re-resolve rather than
            // lock: a lock would have to span the whole provisioning sequence, on an
            // anonymous endpoint, to prevent something the primary key already prevents.
            //
            // The failed insert is still pending on the context; it must be discarded
            // before the rollback below, or the rollback's save would retry it and throw
            // the same violation again.
            DiscardPendingInserts();
            LogLostRace(assertion);
        }

        var winner = await userManager.FindByLoginAsync(
            ExternalLoginProviders.MyMicrotingDelegated, assertion.Subject);

        // Our own row is unreachable now — nothing can ever resolve a principal with no
        // link — so it is deleted rather than left as a permanent orphan in the customer's
        // user list. It has no password and nothing has ever used it, so there is nothing
        // to lose with it; its role row goes with it by cascade.
        await DeleteOrphanAsync(user, assertion);

        return (false, winner);
    }

    private async Task<bool> AddRoleAsync(EformUser user, string roleName, DelegatedAssertion assertion)
    {
        try
        {
            var result = await userManager.AddToRoleAsync(user, roleName);
            if (result.Succeeded)
            {
                return true;
            }

            logger.LogError(
                "Delegated sign-in: could not put local user {UserId} in role {Role} "
                + "(jti {JwtId}): {Errors}",
                user.Id, roleName, DelegatedAssertionValidator.ForLog(assertion.JwtId),
                string.Join(" ", result.Errors.Select(e => e.Description)));
        }
        catch (InvalidOperationException ex)
        {
            // AddToRoleAsync throws when the role row does not exist. Every tenant is
            // seeded with it (SeedAdminHelper), so this is a broken installation rather
            // than a user error. The caller then deletes the half-built row: it has no
            // link, so no later sign-in could ever find it.
            logger.LogError(ex,
                "Delegated sign-in: role {Role} does not exist on this tenant.", roleName);
        }

        return false;
    }

    private async Task DeleteOrphanAsync(EformUser user, DelegatedAssertion assertion)
    {
        try
        {
            await userManager.DeleteAsync(user);
        }
        catch (DbUpdateException ex)
        {
            // Nothing references the row, so this should not happen; if it does, the
            // sign-in still has a correct answer and the leftover is a cosmetic entry in
            // the user list, not a way in — it has no password and no link.
            logger.LogWarning(ex,
                "Delegated sign-in: could not roll back local user {UserId} after losing the "
                + "first-sign-in race (jti {JwtId}).",
                user.Id, DelegatedAssertionValidator.ForLog(assertion.JwtId));
        }
    }

    /// <summary>
    /// Detaches rows a failed <c>SaveChanges</c> left pending. EF keeps them in the Added
    /// state, so the next save on this scoped context would reissue the very insert that
    /// just violated a constraint. Scoped to the two entity types this service writes, so
    /// it cannot discard somebody else's pending work.
    /// </summary>
    private void DiscardPendingInserts()
    {
        var pending = dbContext.ChangeTracker.Entries()
            .Where(entry => entry.State == EntityState.Added
                            && entry.Entity is IdentityUserLogin<int> or EformUser)
            .ToList();

        foreach (var entry in pending)
        {
            entry.State = EntityState.Detached;
        }
    }

    /// <summary>
    /// Whether the template names a role this tenant grants. False refuses the sign-in.
    /// </summary>
    private static bool TryResolveRole(string roleTemplate, out string roleName)
    {
        roleName = null;
        if (string.IsNullOrWhiteSpace(roleTemplate)
            || !RolesByTemplate.TryGetValue(roleTemplate.Trim(), out var resolved))
        {
            return false;
        }

        // The map cannot contain it today; this is what keeps that true tomorrow. An
        // administrative template is not a configuration mistake to tolerate, it is the
        // one outcome this whole path exists to make impossible.
        if (string.Equals(resolved, EformRole.Admin, StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        roleName = resolved;
        return true;
    }

    /// <summary>
    /// The name stored on the row, for audit attribution only. Never an identifier, and
    /// never trusted: it is an attacker-chosen string until the portal is trustworthy, so
    /// control characters go and the length is bounded. The "(delegated …)" suffix makes
    /// the row recognisable in the customer's own user list, and carries the short digest
    /// so two advisors without a <c>name</c> claim are still distinguishable.
    /// </summary>
    private static (string FirstName, string LastName) AuditName(DelegatedAssertion assertion)
    {
        var shortId = SubjectDigest(assertion.Subject, ShortDigestChars);
        var cleaned = Sanitise(assertion.DisplayName);

        return (cleaned.Length == 0 ? "Delegated advisor" : cleaned, $"(delegated {shortId})");
    }

    private static string Sanitise(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return "";
        }

        var trimmed = value.Trim();
        if (trimmed.Length > MaxDisplayNameChars)
        {
            trimmed = trimmed[..MaxDisplayNameChars];
        }

        var builder = new StringBuilder(trimmed.Length);
        foreach (var c in trimmed)
        {
            builder.Append(char.IsControl(c) ? ' ' : c);
        }

        return builder.ToString().Trim();
    }

    /// <summary>Lower-case hex prefix of SHA-256(provider | subject). The provider is
    /// mixed in so the same portal identifier never produces the same local address under
    /// two different namespaces.</summary>
    private static string SubjectDigest(string subject, int chars)
    {
        var digest = SHA256.HashData(Encoding.UTF8.GetBytes(
            $"{ExternalLoginProviders.MyMicrotingDelegated}|{subject}"));
        return Convert.ToHexStringLower(digest)[..chars];
    }

    /// <summary>A fresh address for the collision case. Random rather than a counter: a
    /// counter would collide again with whatever took the previous one.</summary>
    private static string Disambiguate(string baseAddress)
    {
        var at = baseAddress.IndexOf('@', StringComparison.Ordinal);
        var suffix = Guid.NewGuid().ToString("N")[..8];
        return $"{baseAddress[..at]}-{suffix}@{baseAddress[(at + 1)..]}";
    }

    /// <summary>
    /// The one log line for a lost first-sign-in race, whichever shape it arrived in.
    /// Information, not error: the advisor is about to be signed in on the principal the
    /// other request created, which is the designed outcome and not an incident.
    /// </summary>
    private void LogLostRace(DelegatedAssertion assertion)
        => logger.LogInformation(
            "Delegated sign-in: lost the first-sign-in race for jti {JwtId}; "
            + "adopting the principal the other request created.",
            DelegatedAssertionValidator.ForLog(assertion.JwtId));

    /// <summary>Whether Identity refused the link because the key is already held — the
    /// non-throwing half of the lost race. The code comes from the configured describer
    /// rather than a literal, so a renamed error cannot silently stop matching.</summary>
    private bool IsLoginAlreadyAssociated(IdentityResult result)
        => result.Errors.Any(e =>
            e.Code == userManager.ErrorDescriber.LoginAlreadyAssociated().Code);

    /// <summary>Whether Identity refused the insert because the name or address is
    /// taken — the only failure this path retries with a different address.</summary>
    private static bool IsDuplicate(IdentityResult result)
        => result.Errors.Any(e =>
            e.Code == "DuplicateUserName" || e.Code == "DuplicateEmail");

    /// <summary>
    /// SQLSTATE class 23: an integrity-constraint violation, which a duplicate primary key
    /// raises on any provider. Mirrors <c>ExternalUserLinkService</c>'s check — anything
    /// else (a value too long for its column, say) is a genuine failure and rethrows.
    /// </summary>
    private static bool IsIntegrityConstraintViolation(Exception ex)
    {
        for (var inner = ex.InnerException; inner != null; inner = inner.InnerException)
        {
            if (inner is DbException { SqlState: { } sqlState }
                && sqlState.StartsWith("23", StringComparison.Ordinal))
            {
                return true;
            }
        }

        return false;
    }

    private static OperationDataResult<EformAuthorizeResult> Refused()
        => new(false, RefusedMessage);
}
