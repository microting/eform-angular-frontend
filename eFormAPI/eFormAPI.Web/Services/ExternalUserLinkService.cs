using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models.ExternalLinks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services;

/// <summary>
/// Link CRUD over Identity's UserLogins table. Writes and single-row reads go through
/// UserManager (AddLoginAsync, RemoveLoginAsync, GetLoginsAsync, FindByLoginAsync), so
/// the table keeps its EF-managed shape and we inherit Identity's own duplicate handling.
///
/// The whole-installation list is the one exception, and not by preference: UserManager
/// exposes no API for "every login for a provider across all users", so GetLinks uses an
/// EF-managed LINQ projection over IdentityUserLogin&lt;int&gt;. That is not raw SQL — no
/// ExecuteSqlRaw anywhere in this file — and it is still provider-filtered server-side.
/// </summary>
public class ExternalUserLinkService(
    UserManager<EformUser> userManager,
    BaseDbContext context,
    IUserService userService,
    ILocalizationService localizationService,
    ILogger<ExternalUserLinkService> logger)
    : IExternalUserLinkService
{
    private const int DisplayNameMaxLength = 512;

    /// <summary>
    /// The whole-installation link read, as a composable IQueryable so the generated SQL
    /// can be asserted on. The provider filter sits INSIDE the query on purpose: an
    /// in-memory filter after the fact would return the same rows today while dragging
    /// every future Google row across the wire, and
    /// ExternalUserLinkServiceTests.GetLinks_FiltersByProviderInTheDatabase pins that by
    /// inspecting ToQueryString().
    ///
    /// FullName is left as the raw concatenation here and trimmed by the caller: the
    /// trim is a presentation detail and not worth a server-side TRIM.
    ///
    /// Pass <paramref name="providerKey"/> to read ONE row: it is the other half of the
    /// (LoginProvider, ProviderKey) primary key, and it is applied in SQL for the same
    /// reason the provider filter is. GetLinkByKey is on the hot path — every
    /// link-targeted password change resolves its row through it — so filtering after the
    /// fact would load every link on the tenant to return one.
    /// ExternalUserLinkServiceTests.GetLinkByKey_FiltersByTheKeyInTheDatabase pins it.
    ///
    /// Public rather than private only so the test assembly can read its SQL; the project
    /// has no InternalsVisibleTo. It takes its context as a parameter so it stays a pure
    /// query description with no instance state.
    /// </summary>
    public static IQueryable<ExternalUserLinkRow> LinkRowQuery(BaseDbContext context)
        => LinkRowQuery(context, providerKey: null);

    /// <inheritdoc cref="LinkRowQuery(BaseDbContext)"/>
    /// <param name="context">The context the query is described against.</param>
    /// <param name="providerKey">
    /// The other half of the (LoginProvider, ProviderKey) primary key, applied in SQL;
    /// null reads the whole installation. Two overloads rather than one optional
    /// parameter because SonarC# S2360 is on in CI.
    /// </param>
    public static IQueryable<ExternalUserLinkRow> LinkRowQuery(
        BaseDbContext context, string providerKey)
    {
        var logins = context.Set<IdentityUserLogin<int>>()
            // Compared against the CONSTANT, never the caller's spelling.
            .Where(login => login.LoginProvider == ExternalLoginProviders.MyMicroting);

        // Half of the composite primary key, applied in SQL when the caller wants one
        // row. Composed BEFORE the join and the projection so it lands in the same WHERE
        // clause as the provider filter rather than wrapping the whole query in a
        // subquery, and so the keyed read is an index seek on the primary key instead of
        // a whole-tenant scan.
        if (providerKey != null)
        {
            logins = logins.Where(login => login.ProviderKey == providerKey);
        }

        return logins
            .Join(context.Users,
                login => login.UserId,
                user => user.Id,
                (login, user) => new { login, user })
            .OrderBy(x => x.user.Id)
            .Select(x => new ExternalUserLinkRow
            {
                LoginProvider = x.login.LoginProvider,
                ProviderKey = x.login.ProviderKey,
                ProviderDisplayName = x.login.ProviderDisplayName,
                UserId = x.user.Id,
                UserName = x.user.UserName,
                Email = x.user.Email,
                FullName = x.user.FirstName + " " + x.user.LastName,
                Role = x.user.UserRoles.Select(y => y.Role.Name).FirstOrDefault(),
                IsPrimaryAdmin = x.user.Id == 1
            })
            .AsNoTracking();
    }

    public async Task<OperationDataResult<List<ExternalUserLinkRow>>> GetLinks(string loginProvider)
    {
        if (!ExternalLoginProviders.IsSupported(loginProvider))
        {
            return new OperationDataResult<List<ExternalUserLinkRow>>(false,
                localizationService.GetString("UnsupportedExternalLoginProvider"));
        }

        var rows = await LinkRowQuery(context).ToListAsync();
        foreach (var row in rows)
        {
            row.FullName = row.FullName?.Trim();
        }

        return new OperationDataResult<List<ExternalUserLinkRow>>(true, rows);
    }

    public async Task<OperationDataResult<ExternalUserLinkRow>> GetLinkByKey(
        string loginProvider, string providerKey)
    {
        if (!ExternalLoginProviders.IsSupported(loginProvider))
        {
            return new OperationDataResult<ExternalUserLinkRow>(false,
                localizationService.GetString("UnsupportedExternalLoginProvider"));
        }

        if (string.IsNullOrWhiteSpace(providerKey))
        {
            return new OperationDataResult<ExternalUserLinkRow>(false,
                localizationService.GetString("ExternalLinkProviderKeyRequired"));
        }

        // Keyed in SQL, not filtered out of the whole-tenant list. The comparison is
        // therefore the COLUMN's collation (utf8mb4_uca1400_ai_ci, case- and
        // accent-insensitive) rather than an ordinal one — which is the right semantics
        // here and not merely a tolerable side effect: UserManager.FindByLoginAsync, the
        // only way the set-password path ever resolves a target, reads the same column
        // through the same collation. A case variant that the password path WOULD resolve
        // must not read as "no such link" here, or the two would disagree about which
        // account a key names. Keys are decimal ids in practice, so no live row is
        // affected either way.
        var row = await LinkRowQuery(context, providerKey).FirstOrDefaultAsync();
        if (row == null)
        {
            return new OperationDataResult<ExternalUserLinkRow>(false,
                localizationService.GetString("ExternalLinkNotFound"));
        }

        row.FullName = row.FullName?.Trim();

        return new OperationDataResult<ExternalUserLinkRow>(true, row);
    }

    public async Task<OperationResult> CreateLink(CreateExternalUserLinkModel model)
    {
        if (!ExternalLoginProviders.IsSupported(model.LoginProvider))
        {
            return new OperationResult(false,
                localizationService.GetString("UnsupportedExternalLoginProvider"));
        }

        if (string.IsNullOrWhiteSpace(model.ProviderKey))
        {
            return new OperationResult(false,
                localizationService.GetString("ExternalLinkProviderKeyRequired"));
        }

        // Decision D-1: user Id 1 is NEVER linked. The set-password path can never reach
        // it — that account may only be targeted by itself — so a link to it would be a
        // lie, and would report RefusedPrimaryAdmin forever. Refuse here instead, with a
        // dedicated reason rather than a generic rejection, so an API caller that bypassed
        // the dialog is told exactly why.
        //
        // This is this path's OWN copy of the rule. Its twin is the byte-frozen
        // target-guard block in AccountService.AdminChangePassword, which is never edited
        // (decision D-D); PasswordTargetGuardAgreementTests keeps the two in agreement.
        if (model.TargetUserId == 1)
        {
            return new OperationResult(false,
                localizationService.GetString("PrimaryAdminCannotBeLinked"));
        }

        var user = await userManager.FindByIdAsync(model.TargetUserId.ToString());
        if (user == null)
        {
            return new OperationResult(false, localizationService.GetString("UserNotFound"));
        }

        // Conflict (a). The primary key is (LoginProvider, ProviderKey), so this key may
        // already be held — by this user or another. Name the holder; the UI offers an
        // explicit remove-then-relink, never an implicit overwrite.
        var keyHolder = await userManager.FindByLoginAsync(
            ExternalLoginProviders.MyMicroting, model.ProviderKey);
        if (keyHolder != null)
        {
            return new OperationResult(false, localizationService.GetStringWithFormat(
                "ExternalLinkKeyAlreadyUsed", model.ProviderKey, keyHolder.Id, keyHolder.Email));
        }

        // Conflict (b). The schema permits one user holding two different provider keys,
        // and we cannot add a unique index on (LoginProvider, UserId) without a migration
        // in every installation's schema. So refuse it here, and let the set-password
        // path's AmbiguousLink refusal catch the residual race — failing closed at the
        // cost of a manual relink, never failing open and setting someone's password.
        // Provider-filtered: a Google row on this user is not ours.
        var existing = (await userManager.GetLoginsAsync(user))
            .Where(x => x.LoginProvider == ExternalLoginProviders.MyMicroting)
            .ToList();
        if (existing.Count > 0)
        {
            return new OperationResult(false, localizationService.GetStringWithFormat(
                "ExternalLinkUserAlreadyLinked", user.Id, existing[0].ProviderKey));
        }

        var displayName = model.ProviderDisplayName;
        if (displayName != null && displayName.Length > DisplayNameMaxLength)
        {
            // The column is longtext, but a bounded value keeps the row sane. Purely
            // informational: nothing ever parses this back.
            displayName = displayName.Substring(0, DisplayNameMaxLength);
        }

        try
        {
            var result = await userManager.AddLoginAsync(user, new UserLoginInfo(
                ExternalLoginProviders.MyMicroting, model.ProviderKey, displayName));
            if (!result.Succeeded)
            {
                return new OperationResult(false,
                    string.Join(" ", result.Errors.Select(x => x.Description)));
            }
        }
        catch (DbUpdateException ex)
        {
            // Two concurrent creates for the same key: the primary key refuses the
            // second. Re-read to name who won, rather than reporting a database error.
            //
            // Narrowed to that case on purpose. Unconditionally, this catch reported
            // EVERY write failure as "that key is already used" with a null holder id and
            // a null holder email, sending an operator to look for a holder that does not
            // exist. A ProviderKey longer than the varchar(255) column is the concrete
            // case: MariaDB raises 1406 / SQLSTATE 22001 under STRICT_TRANS_TABLES, and
            // that is a genuine failure, not a conflict.
            //
            // Two conditions, both required, so the conflict message is only ever
            // produced when it is true:
            //   1. the failure is an integrity-constraint violation at all — SQLSTATE
            //      class 23. Anything else (22001 above included) rethrows without so
            //      much as a second query; and
            //   2. a re-read names an actual holder. SQLSTATE 23000 is ALSO what a
            //      foreign-key violation raises, so the class alone cannot tell a
            //      duplicate key from a vanished target user; a named holder can, on any
            //      provider and without a vendor error number. No holder, no claim that
            //      the key is held.
            if (!IsIntegrityConstraintViolation(ex))
            {
                throw;
            }

            var winner = await userManager.FindByLoginAsync(
                ExternalLoginProviders.MyMicroting, model.ProviderKey);
            if (winner == null)
            {
                throw;
            }

            return new OperationResult(false, localizationService.GetStringWithFormat(
                "ExternalLinkKeyAlreadyUsed", model.ProviderKey, winner.Id, winner.Email));
        }

        // The only record a local admin has that a link now exists, so it names the
        // resolved target. Never any part of a password — this endpoint never sees one.
        logger.LogInformation(
            "external-user-link created: callerUserId={CallerUserId}, loginProvider={LoginProvider}, " +
            "providerKey={ProviderKey}, targetUserId={TargetUserId}",
            userService.UserId, ExternalLoginProviders.MyMicroting, model.ProviderKey, user.Id);

        return new OperationResult(true, localizationService.GetString("ExternalLinkCreated"));
    }

    public async Task<OperationResult> DeleteLink(DeleteExternalUserLinkModel model)
    {
        if (!ExternalLoginProviders.IsSupported(model.LoginProvider))
        {
            return new OperationResult(false,
                localizationService.GetString("UnsupportedExternalLoginProvider"));
        }

        if (string.IsNullOrWhiteSpace(model.ProviderKey))
        {
            return new OperationResult(false,
                localizationService.GetString("ExternalLinkProviderKeyRequired"));
        }

        var user = await userManager.FindByLoginAsync(
            ExternalLoginProviders.MyMicroting, model.ProviderKey);
        if (user == null)
        {
            // Idempotent on purpose. Unlinking must never require my.microting.com's
            // cooperation, and a second delete is not an error.
            return new OperationResult(true, localizationService.GetString("ExternalLinkRemoved"));
        }

        var result = await userManager.RemoveLoginAsync(
            user, ExternalLoginProviders.MyMicroting, model.ProviderKey);
        if (!result.Succeeded)
        {
            return new OperationResult(false,
                string.Join(" ", result.Errors.Select(x => x.Description)));
        }

        logger.LogInformation(
            "external-user-link removed: callerUserId={CallerUserId}, loginProvider={LoginProvider}, " +
            "providerKey={ProviderKey}, targetUserId={TargetUserId}",
            userService.UserId, ExternalLoginProviders.MyMicroting, model.ProviderKey, user.Id);

        return new OperationResult(true, localizationService.GetString("ExternalLinkRemoved"));
    }

    /// <summary>
    /// Whether a failed write was an integrity-constraint violation rather than some
    /// other write failure. SQLSTATE class 23 is "integrity constraint violation" in the
    /// SQL standard, read off the ADO-level <see cref="DbException"/> base class, so this
    /// needs no direct dependency on the MySQL provider package and no hardcoded vendor
    /// error number. It is a necessary but NOT a sufficient test for a duplicate key —
    /// 23000 also covers a foreign-key violation — which is why the caller additionally
    /// requires a named holder. The inner chain is walked because a provider is free to
    /// wrap its own exception.
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
}
