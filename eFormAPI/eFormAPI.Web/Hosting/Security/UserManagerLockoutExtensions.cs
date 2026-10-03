using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
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
    /// </summary>
    public static async Task LiftLockoutAsync(this UserManager<EformUser> userManager, EformUser user)
    {
        if (user.LockoutEnd != null)
        {
            await userManager.SetLockoutEndDateAsync(user, null);
        }

        await userManager.ResetAccessFailedCountAsync(user);
    }

    /// <summary>
    /// Sets a new password without the current one — the admin paths — and lifts any
    /// lockout once the new password is in place.
    /// </summary>
    public static async Task<IdentityResult> ReplacePasswordAsync(this UserManager<EformUser> userManager,
        EformUser user, string newPassword)
    {
        await userManager.RemovePasswordAsync(user);
        var result = await userManager.AddPasswordAsync(user, newPassword);
        if (result.Succeeded)
        {
            await userManager.LiftLockoutAsync(user);
        }

        return result;
    }
}
