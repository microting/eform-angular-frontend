using System.Linq;
using System.Threading.Tasks;
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
    /// </summary>
    public static async Task<IdentityResult> ReplacePasswordAsync(this UserManager<EformUser> userManager,
        EformUser user, string newPassword, ILogger logger)
    {
        await userManager.RemovePasswordAsync(user);
        var result = await userManager.AddPasswordAsync(user, newPassword);
        if (result.Succeeded)
        {
            await userManager.LiftLockoutAsync(user, logger);
        }

        return result;
    }
}
