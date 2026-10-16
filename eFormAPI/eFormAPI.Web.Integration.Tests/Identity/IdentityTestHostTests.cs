using System;
using System.Threading.Tasks;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Identity;

// The harness is load-bearing for every claim Phase A makes, so it gets its own
// self-test: a real hasher that verifies the password it just stored, real production
// Identity options, and a real store that hands back a non-null SecurityStamp.
[TestFixture]
public class IdentityTestHostTests : DbTestFixture
{
    [Test]
    public async Task CreateUserAsync_StoresAVerifiableIdentityV3Hash()
    {
        await using var host = new IdentityTestHost(DbContext);

        var user = await host.CreateUserAsync("correct-horse");

        Assert.That(await host.UserManager.CheckPasswordAsync(user, "correct-horse"), Is.True);
        Assert.That(await host.UserManager.CheckPasswordAsync(user, "wrong-horse"), Is.False);
        // Format marker byte 0 == 0x01 is Identity V3 (PBKDF2-HMAC-SHA256, 100k iterations).
        var hash = await host.StoredHashAsync(user.Id);
        Assert.That(Convert.FromBase64String(hash)[0], Is.EqualTo(0x01));
        Assert.That(await host.StoredSecurityStampAsync(user.Id), Is.Not.Null.And.Not.Empty);
    }

    // The harness must carry the PRODUCTION password policy, not a hand-copied one, or
    // the 6-character refusal under test is not the refusal users hit.
    [Test]
    public async Task TheHostUsesTheProductionIdentityOptions()
    {
        await using var host = new IdentityTestHost(DbContext);

        var options = host.UserManager.Options;

        Assert.That(options.Password.RequiredLength, Is.EqualTo(6));
        Assert.That(options.Password.RequireDigit, Is.False);
        Assert.That(options.Password.RequireNonAlphanumeric, Is.False);
        Assert.That(options.Password.RequireUppercase, Is.False);
        Assert.That(options.Password.RequireLowercase, Is.False);
        Assert.That(options.User.RequireUniqueEmail, Is.True);
        Assert.That(options.Lockout.MaxFailedAccessAttempts, Is.EqualTo(10));
        Assert.That(options.Lockout.DefaultLockoutTimeSpan, Is.EqualTo(TimeSpan.FromMinutes(10)));
    }

    [Test]
    public async Task CreateUserWithNullSecurityStampAsync_LeavesTheStampNull()
    {
        await using var host = new IdentityTestHost(DbContext);

        var user = await host.CreateUserWithNullSecurityStampAsync("correct-horse");

        Assert.That(await host.StoredSecurityStampAsync(user.Id), Is.Null.Or.Empty);
    }

    [Test]
    public async Task LockOutAsync_IsVisibleToTheStoreAndToUserManager()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync("correct-horse");

        await host.LockOutAsync(user.Id);

        var stored = await host.StoredLockoutAsync(user.Id);
        Assert.That(stored.LockoutEnd, Is.Not.Null);
        Assert.That(stored.AccessFailedCount, Is.EqualTo(10));
        var reread = await host.UserManager.FindByIdAsync(user.Id.ToString());
        Assert.That(await host.UserManager.IsLockedOutAsync(reread), Is.True);
    }

    [Test]
    public async Task AddLinkAsync_IsFoundByFindByLoginAsync()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync("correct-horse");

        await host.AddLinkAsync(user.Id, "my.microting.com", "4821");

        var found = await host.UserManager.FindByLoginAsync("my.microting.com", "4821");
        Assert.That(found, Is.Not.Null);
        Assert.That(found!.Id, Is.EqualTo(user.Id));
    }
}
