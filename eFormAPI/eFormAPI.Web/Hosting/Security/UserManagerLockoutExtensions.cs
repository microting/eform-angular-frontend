using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.ExternalLinks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace eFormAPI.Web.Hosting.Security;

public static class UserManagerLockoutExtensions
{
    /// <summary>
    /// Ends an active lockout and zeroes the failed-attempt count. Call it after a password
    /// was successfully set: ASP.NET Identity does not do this itself, and since a lockout
    /// answers with the same message as a wrong password, a user who just reset their
    /// password would otherwise be refused with the new one for the rest of the lockout.
    ///
    /// Every caller has already proved the right to set the password (reset token, current
    /// password or admin rights), so this does not weaken the brute-force protection.
    ///
    /// A failure is logged and returned but must not fail the request: the password has
    /// already changed, and the lockout still expires on its own.
    /// </summary>
    public static async Task<IdentityResult> LiftLockoutAsync(this UserManager<EformUser> userManager,
        EformUser user, ILogger logger)
    {
        var result = IdentityResult.Success;
        if (user.LockoutEnd != null)
        {
            result = await userManager.SetLockoutEndDateAsync(user, null);
        }

        if (result.Succeeded)
        {
            result = await userManager.ResetAccessFailedCountAsync(user);
        }

        if (!result.Succeeded)
        {
            logger.LogWarning(
                "The password of user {UserId} was set, but its lockout could not be lifted: {Errors}",
                user.Id, string.Join(" ", result.Errors.Select(x => x.Description)));
        }

        return result;
    }

    /// <summary>
    /// Sets a new password without the current one — the admin paths — and lifts any
    /// lockout once the new password is in place. Returns the result of setting the
    /// password; a lockout that could not be lifted is only logged.
    ///
    /// Uses Identity's own atomic reset. It previously did RemovePasswordAsync then
    /// AddPasswordAsync: two SaveChanges calls with no transaction, so a failure between
    /// them — a dropped connection, a pod eviction, or a new password that fails the
    /// 6-character minimum on the second call — left the account with NO password at all,
    /// while the caller merely reported an error.
    ///
    /// ResetPasswordAsync validates the new password against IdentityOptions.Password
    /// FIRST, then updates the hash and rotates the security stamp, then performs ONE
    /// UserManager.UpdateAsync — a single SaveChanges, a single row update. There is no
    /// window in which the row has no password, and on validation failure it returns
    /// IdentityResult.Failed with the row untouched.
    ///
    /// Every caller of this method gets that: api/account/change-password-admin through
    /// AccountService.AdminChangePassword, and user management through AdminService.Update.
    ///
    /// Rotating the stamp is not a session revocation — nothing in this application
    /// validates the security stamp today, so an issued token keeps working for up to 24
    /// hours. It means the stored data is already correct the day the host starts
    /// checking it.
    /// </summary>
    public static async Task<IdentityResult> ReplacePasswordAsync(this UserManager<EformUser> userManager,
        EformUser user, string newPassword, ILogger logger)
    {
        // A delegated (portal-federated) principal is credential-less on purpose. The API
        // must never be the way it acquires a password.
        if (await userManager.IsDelegatedPrincipalAsync(user))
        {
            logger.LogWarning(
                "Refused to set a password on user {UserId}: it is a delegated principal",
                user.Id);
            return CredentialLessAccountResult();
        }

        // UserManager.GetSecurityStampAsync THROWS InvalidOperationException when the
        // stored stamp is null, and the reset-token provider reads it — so a row written
        // straight through BaseDbContext (never through UserManager.CreateAsync) would
        // throw here, where RemovePasswordAsync/AddPasswordAsync silently coped because
        // they SET the stamp rather than reading it. Backfill it first: that write only
        // ever sets a stamp, never clears a password, so the no-password-window property
        // still holds.
        if (string.IsNullOrEmpty(user.SecurityStamp))
        {
            var stampResult = await userManager.UpdateSecurityStampAsync(user);
            if (!stampResult.Succeeded)
            {
                return stampResult;
            }
        }

        // Generated and consumed in-process, microseconds apart; it never leaves this
        // method, so its 1-day default lifespan is irrelevant. AddDefaultTokenProviders()
        // is already registered in Startup, so no new configuration is needed.
        var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        var result = await userManager.ResetPasswordAsync(user, resetToken, newPassword);
        if (result.Succeeded)
        {
            await userManager.LiftLockoutAsync(user, logger);
        }

        return result;
    }

    /// <summary>True when the user holds a UserLogins row for the delegated provider. A
    /// null login list (a substituted UserManager) counts as no logins.
    ///
    /// This is a deliberate, allowlisted use of the link API (see
    /// NoRuntimeBindingSourceTests.TheExternalLoginApiIsCalledFromExactlyTwoFiles). It is on
    /// the password-WRITE path, not the login path: a link is consulted only to REFUSE a
    /// write, so it can never grant authentication to anyone.</summary>
    public static async Task<bool> IsDelegatedPrincipalAsync(this UserManager<EformUser> userManager,
        EformUser user)
    {
        var logins = await userManager.GetLoginsAsync(user);
        return logins != null && logins.Any(l =>
            l.LoginProvider == ExternalLoginProviders.MyMicrotingDelegated);
    }

    /// <summary>The Identity error code returned when a password is refused on a
    /// delegated principal.</summary>
    public const string CredentialLessAccountCode = "CredentialLessAccount";

    /// <summary>The failed result for a refused password set on a delegated principal.</summary>
    public static IdentityResult CredentialLessAccountResult() => IdentityResult.Failed(new IdentityError
    {
        Code = CredentialLessAccountCode,
        Description = "An account with no password cannot be given one through the API."
    });
}
