using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Hosting.Security;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Identity;

/// <summary>
/// A REAL <see cref="UserManager{EformUser}"/> over the test database.
///
/// The substitute-based AccountService tests can prove WHICH UserManager method was
/// called; none of them can prove the stored hash moved, that the old password stopped
/// working, that SecurityStamp rotated, or that the lockout was lifted. Those are the
/// actual claims of the atomicity fix, so they need the real hasher and the real store.
///
/// The wiring mirrors
/// eFormAPI.Web.Integration.Tests/Services/PasswordChangeLiftsLockoutTests.DoSetup,
/// which established this pattern upstream. Three details are load-bearing and are the
/// reason this is not hand-rolled:
///   - services.AddSingleton(dbContext) reuses DbTestFixture's context, so the harness
///     and the test observe one unit of work rather than two.
///   - services.AddEFormAuth(...) brings the PRODUCTION IdentityOptions (6-character
///     minimum, no Require* flags, 10 attempts / 10 minutes). Hand-copying them is how a
///     test ends up asserting a policy the application does not have.
///   - UseEphemeralDataProtectionProvider keeps the reset-token keys in memory, so a test
///     run leaves no key files on the runner.
///
/// DbTestFixture.ClearDb() truncates a hardcoded "eformsdk-tests" schema while this
/// project connects to "angular-tests", so the truncate silently no-ops and rows survive
/// between runs — upstream works around the same thing with a unique address per test.
/// Hence: GUID-unique emails, never a fixed Id, and DisposeAsync deletes what this host
/// created.
/// </summary>
public sealed class IdentityTestHost : IAsyncDisposable
{
    private readonly ServiceProvider _provider;
    private readonly IServiceScope _scope;
    private readonly List<int> _createdUserIds = new();

    public UserManager<EformUser> UserManager { get; }
    public RoleManager<EformRole> RoleManager { get; }
    public BaseDbContext DbContext { get; }
    public ILogger Logger { get; }

    public IdentityTestHost(BaseDbContext dbContext)
    {
        DbContext = dbContext;

        // AddEFormAuth reads these; the values are irrelevant here because nothing in this
        // harness issues or validates a token, but a null signing key would throw.
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string>
            {
                ["EformTokenOptions:Issuer"] = "identity-test-host",
                ["EformTokenOptions:SigningKey"] = "identity-test-host-signing-key-long-enough-for-hmac-sha256"
            })
            .Build();

        // Same registrations, in the same order, as Startup.
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddSingleton(dbContext);
        services.AddHttpContextAccessor();
        services.AddIdentity<EformUser, EformRole>()
            .AddEntityFrameworkStores<BaseDbContext>()
            .AddDefaultTokenProviders();
        services.AddEFormAuth(configuration, new List<PluginPermissionModel>());
        // Keys in memory only: the reset tokens must not leave key files on the runner.
        services.AddDataProtection().UseEphemeralDataProtectionProvider();

        _provider = services.BuildServiceProvider();
        _scope = _provider.CreateScope();
        UserManager = _scope.ServiceProvider.GetRequiredService<UserManager<EformUser>>();
        RoleManager = _scope.ServiceProvider.GetRequiredService<RoleManager<EformRole>>();
        Logger = _scope.ServiceProvider
            .GetRequiredService<ILoggerFactory>()
            .CreateLogger<IdentityTestHost>();
    }

    /// <summary>A user created the production way: through UserManager, so Identity sets
    /// the hash and the security stamp itself. The Id is DB-assigned.</summary>
    public async Task<EformUser> CreateUserAsync(string password)
    {
        var email = $"host-{Guid.NewGuid():N}@example.test";
        var user = new EformUser
        {
            UserName = email,
            Email = email,
            FirstName = "Atomicity",
            LastName = "Target",
            Locale = "en",
            TimeZone = "Europe/Copenhagen",
            Formats = "de-DE",
            EmailConfirmed = true
        };

        var created = await UserManager.CreateAsync(user, password);
        Assert.That(created.Succeeded, Is.True,
            string.Join(" ", created.Errors.Select(e => e.Description)));
        _createdUserIds.Add(user.Id);
        return user;
    }

    /// <summary>A user written straight through BaseDbContext, so SecurityStamp stays
    /// null — the shape that makes GeneratePasswordResetTokenAsync throw (deviation D-A).
    /// The hash is produced by the same PasswordHasher the app uses.</summary>
    public async Task<EformUser> CreateUserWithNullSecurityStampAsync(string password)
    {
        var email = $"host-{Guid.NewGuid():N}@example.test";
        var user = new EformUser
        {
            UserName = email,
            NormalizedUserName = email.ToUpperInvariant(),
            Email = email,
            NormalizedEmail = email.ToUpperInvariant(),
            FirstName = "Legacy",
            LastName = "Target",
            Locale = "en",
            TimeZone = "Europe/Copenhagen",
            Formats = "de-DE",
            EmailConfirmed = true,
            SecurityStamp = null
        };
        user.PasswordHash = new PasswordHasher<EformUser>().HashPassword(user, password);

        DbContext.Users.Add(user);
        await DbContext.SaveChangesAsync();
        _createdUserIds.Add(user.Id);
        return user;
    }

    public Task<string> StoredHashAsync(int userId)
        => DbContext.Users.AsNoTracking().Where(u => u.Id == userId)
            .Select(u => u.PasswordHash).SingleAsync();

    public Task<string> StoredSecurityStampAsync(int userId)
        => DbContext.Users.AsNoTracking().Where(u => u.Id == userId)
            .Select(u => u.SecurityStamp).SingleAsync();

    public async Task<(DateTimeOffset? LockoutEnd, int AccessFailedCount)> StoredLockoutAsync(int userId)
    {
        var row = await DbContext.Users.AsNoTracking().Where(u => u.Id == userId)
            .Select(u => new { u.LockoutEnd, u.AccessFailedCount }).SingleAsync();
        return (row.LockoutEnd, row.AccessFailedCount);
    }

    /// <summary>
    /// Locks the account out by writing the state directly. Upstream's
    /// PasswordChangeLiftsLockoutTests drives the real login path to get here, which is
    /// right for a test ABOUT lockout; these tests only need an account that IS locked
    /// out, so they set it and skip ten failed logins.
    /// </summary>
    public async Task LockOutAsync(int userId, int accessFailedCount = 10)
    {
        var user = await DbContext.Users.FirstAsync(u => u.Id == userId);
        user.LockoutEnd = DateTimeOffset.UtcNow.AddMinutes(10);
        user.AccessFailedCount = accessFailedCount;
        await DbContext.SaveChangesAsync();
    }

    /// <summary>Creates the role if the Roles table has not got it. UserStore's
    /// IsInRoleAsync returns false for a missing role, but AddToRoleAsync throws.</summary>
    public async Task EnsureRoleAsync(string roleName)
    {
        if (!await RoleManager.RoleExistsAsync(roleName))
        {
            await RoleManager.CreateAsync(new EformRole { Name = roleName });
        }
    }

    /// <summary>Writes one UserLogins row. Used to build the link fixtures; the production
    /// write goes through UserManager.AddLoginAsync.</summary>
    public async Task AddLinkAsync(int userId, string loginProvider, string providerKey,
        string providerDisplayName = null)
    {
        DbContext.Set<IdentityUserLogin<int>>().Add(new IdentityUserLogin<int>
        {
            LoginProvider = loginProvider,
            ProviderKey = providerKey,
            ProviderDisplayName = providerDisplayName,
            UserId = userId
        });
        await DbContext.SaveChangesAsync();
    }

    public async ValueTask DisposeAsync()
    {
        foreach (var userId in _createdUserIds)
        {
            // UserLogins has ON DELETE CASCADE from Users, so deleting the user takes its
            // links with it — but EF needs the principal loaded to issue the delete, and
            // a tracked instance may be stale, so re-read.
            var user = await DbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user != null)
            {
                DbContext.Users.Remove(user);
            }
        }

        try
        {
            await DbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // A test that already removed its own user must not fail teardown.
        }

        _scope.Dispose();
        await _provider.DisposeAsync();
    }
}
