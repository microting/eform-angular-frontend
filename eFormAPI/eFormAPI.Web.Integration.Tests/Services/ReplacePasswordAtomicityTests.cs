using System.Threading.Tasks;
using eFormAPI.Web.Hosting.Security;
using eFormAPI.Web.Integration.Tests.Identity;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services;

/// <summary>
/// UserManagerLockoutExtensions.ReplacePasswordAsync against a REAL UserManager.
///
/// THE BUG: RemovePasswordAsync then AddPasswordAsync is two SaveChanges with no
/// transaction. A new password that fails the 6-character minimum fails on the SECOND
/// call, after the first already cleared the hash — leaving the account with NO password
/// at all, while the caller merely reports an error. Fanning that across N tenants
/// multiplies the exposure by N.
///
/// Tested here rather than through a route, because this is the single shared home of the
/// password write: AccountService.AdminChangePassword (api/account/change-password-admin)
/// and AdminService.Update (user management) both go through it, so fixing it here fixes
/// both.
///
/// Every assertion is on the STORED row, not on the return value: a method that reports a
/// refusal while having already blanked the hash would pass a return-value assertion and
/// be exactly the bug.
/// </summary>
[TestFixture]
public class ReplacePasswordAtomicityTests : DbTestFixture
{
    private const string OldPassword = "old-password";

    // THE REGRESSION TEST FOR THE BUG. Must fail against RemovePasswordAsync +
    // AddPasswordAsync: the short password is refused on the second call, but the first
    // already cleared the hash, so the old password no longer authenticates either.
    [Test]
    public async Task TooShortPassword_IsRefusedAndTheOldPasswordStillWorks()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync(OldPassword);
        var hashBefore = await host.StoredHashAsync(user.Id);

        var result = await host.UserManager.ReplacePasswordAsync(user, "short", host.Logger);

        Assert.That(result.Succeeded, Is.False, "a 5-character password must be refused");
        Assert.That(await host.StoredHashAsync(user.Id), Is.EqualTo(hashBefore),
            "a refused password must leave the stored hash byte-identical");
        var reread = await host.UserManager.FindByIdAsync(user.Id.ToString());
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, OldPassword), Is.True,
            "the account must not be left with no password at all");
    }

    [Test]
    public async Task ValidPassword_RetiresTheOldOneAndAcceptsTheNew()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync(OldPassword);

        var result = await host.UserManager.ReplacePasswordAsync(
            user, "brand-new-password", host.Logger);

        Assert.That(result.Succeeded, Is.True,
            string.Join(" ", System.Linq.Enumerable.Select(result.Errors, e => e.Description)));
        var reread = await host.UserManager.FindByIdAsync(user.Id.ToString());
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, "brand-new-password"), Is.True);
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, OldPassword), Is.False);
    }

    // Decision D-2: nothing validates the stamp today, but rotating it means the data is
    // already correct the day the host starts checking it. Free forward compatibility.
    [Test]
    public async Task ValidPassword_RotatesTheSecurityStamp()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync(OldPassword);
        var stampBefore = await host.StoredSecurityStampAsync(user.Id);

        Assert.That((await host.UserManager.ReplacePasswordAsync(
            user, "brand-new-password", host.Logger)).Succeeded, Is.True);

        Assert.That(await host.StoredSecurityStampAsync(user.Id), Is.Not.EqualTo(stampBefore));
    }

    // Idempotent in EFFECT ("the password is now X"), not in representation: a new salt
    // each time, and the stamp rotates. Exactly what a fan-out retry needs.
    [Test]
    public async Task SameNewPasswordTwice_SucceedsBothTimes()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync(OldPassword);

        Assert.That((await host.UserManager.ReplacePasswordAsync(
            user, "same-password", host.Logger)).Succeeded, Is.True);
        var hashAfterFirst = await host.StoredHashAsync(user.Id);

        Assert.That((await host.UserManager.ReplacePasswordAsync(
            user, "same-password", host.Logger)).Succeeded, Is.True);

        Assert.That(await host.StoredHashAsync(user.Id), Is.Not.EqualTo(hashAfterFirst),
            "a fresh salt each time, so idempotent in effect but not in representation");
        var reread = await host.UserManager.FindByIdAsync(user.Id.ToString());
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, "same-password"), Is.True);
    }

    // Upstream PR #8098's behaviour, which this fix must preserve: a lockout answers with
    // the same message as a wrong password, so a user whose password was just set would
    // otherwise be refused with the NEW one for the rest of the lockout.
    [Test]
    public async Task ValidPassword_StillLiftsTheLockout()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync(OldPassword);
        await host.LockOutAsync(user.Id);

        Assert.That((await host.UserManager.ReplacePasswordAsync(
            user, "brand-new-password", host.Logger)).Succeeded, Is.True);

        var stored = await host.StoredLockoutAsync(user.Id);
        Assert.That(stored.LockoutEnd, Is.Null, "the lockout must be lifted");
        Assert.That(stored.AccessFailedCount, Is.Zero, "the failed-attempt count must be reset");
        var reread = await host.UserManager.FindByIdAsync(user.Id.ToString());
        Assert.That(await host.UserManager.IsLockedOutAsync(reread), Is.False);
    }

    // A refused password must not lift the lockout either: nothing happened, so nothing
    // about the account's state should change.
    [Test]
    public async Task TooShortPassword_LeavesTheLockoutInPlace()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync(OldPassword);
        await host.LockOutAsync(user.Id);

        Assert.That((await host.UserManager.ReplacePasswordAsync(
            user, "short", host.Logger)).Succeeded, Is.False);

        var stored = await host.StoredLockoutAsync(user.Id);
        Assert.That(stored.LockoutEnd, Is.Not.Null);
        Assert.That(stored.AccessFailedCount, Is.EqualTo(10));
    }

    // Deviation D-A: UserManager.GetSecurityStampAsync THROWS on a null stamp, and the
    // reset-token provider reads it. RemovePasswordAsync/AddPasswordAsync only ever SET
    // the stamp, so they coped. Rows written straight through BaseDbContext have a null
    // stamp (AdminServiceRoleGuardTests creates exactly those), so the fix must backfill.
    [Test]
    public async Task RowWithNullSecurityStamp_SucceedsWithoutThrowing()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserWithNullSecurityStampAsync(OldPassword);

        var result = await host.UserManager.ReplacePasswordAsync(
            user, "brand-new-password", host.Logger);

        Assert.That(result.Succeeded, Is.True,
            string.Join(" ", System.Linq.Enumerable.Select(result.Errors, e => e.Description)));
        Assert.That(await host.StoredSecurityStampAsync(user.Id), Is.Not.Null.And.Not.Empty);
        var reread = await host.UserManager.FindByIdAsync(user.Id.ToString());
        Assert.That(await host.UserManager.CheckPasswordAsync(reread, "brand-new-password"), Is.True);
    }
}
