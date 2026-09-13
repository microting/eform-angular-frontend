using System;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Infrastructure.Models.Users;
using eFormAPI.Web.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Permissions;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services;

// Only an admin may create or promote an admin, and a non-admin may not set their own
// password or change their own security group through user admin. Without these guards a
// users_update holder could make themselves admin in two requests.
[TestFixture]
public class AdminServiceRoleGuardTests : DbTestFixture
{
#pragma warning disable NUnit1032
    private UserManager<EformUser> _userManager;
#pragma warning restore NUnit1032
    private IUserService _userService;
    private IEFormCoreService _coreHelper;
    private AdminService _adminService;

    public override void DoSetup()
    {
        var store = Substitute.For<IUserStore<EformUser>>();
        _userManager = Substitute.For<UserManager<EformUser>>(store, null, null, null, null, null, null, null, null);
        _userService = Substitute.For<IUserService>();
        _coreHelper = Substitute.For<IEFormCoreService>();
        var localizationService = Substitute.For<ILocalizationService>();
        localizationService.GetString(Arg.Any<string>()).Returns(args => args.Arg<string>());

        _adminService = new AdminService(
            Substitute.For<ILogger<AdminService>>(),
            _userManager,
            Substitute.For<IDbOptions<ApplicationSettings>>(),
            _userService,
            localizationService,
            DbContext,
            _coreHelper);
    }

    private void CallerIs(int id, bool isAdmin)
    {
        _userService.UserId.Returns(id);
        _userService.IsAdmin().Returns(isAdmin);
        _userService.Role.Returns(isAdmin ? EformRole.Admin : EformRole.User);
    }

    private async Task<int> SeedGroupAsync()
    {
        var group = new SecurityGroup { Name = $"group-{Guid.NewGuid():N}" };
        DbContext.SecurityGroups.Add(group);
        await DbContext.SaveChangesAsync();
        return group.Id;
    }

    // SecurityGroupUsers.EformUserId carries an FK to AspNetUsers, so a membership row for a
    // user id with no row there is rejected — seed a minimal one first.
    //
    // DbTestFixture.ClearDb() truncates a hardcoded "eformsdk-tests" schema, but this fixture
    // actually connects to "angular-tests" (see its ConnectionString), so the truncate silently
    // no-ops and rows from earlier tests in this class are never removed. Replace any existing
    // membership for the user instead of accumulating rows across runs, so this test's
    // assertions depend only on what it itself seeded.
    private async Task PutInGroupAsync(int userId, int groupId)
    {
        if (!await DbContext.Users.AnyAsync(x => x.Id == userId))
        {
            DbContext.Users.Add(new EformUser
            {
                Id = userId,
                Email = $"user-{userId}@example.com",
                UserName = $"user-{userId}@example.com",
            });
            await DbContext.SaveChangesAsync();
        }

        var existing = await DbContext.SecurityGroupUsers.Where(x => x.EformUserId == userId).ToListAsync();
        if (existing.Count > 0)
        {
            DbContext.SecurityGroupUsers.RemoveRange(existing);
            await DbContext.SaveChangesAsync();
        }

        DbContext.SecurityGroupUsers.Add(new SecurityGroupUser { EformUserId = userId, SecurityGroupId = groupId });
        await DbContext.SaveChangesAsync();
    }

    private static UserRegisterModel User(int id, string role, int? groupId, string password = null)
        => new()
        {
            Id = id,
            FirstName = "First",
            LastName = "Last",
            Email = $"user-{id}@example.com",
            UserName = $"user-{id}@example.com",
            Role = role,
            GroupId = groupId,
            Password = password,
        };

    // Generated per call: a literal would read as a committed secret.
    private static string AnyPassword() => $"Aa1!{Guid.NewGuid():N}";

    private async Task AssertRefusedBeforeAnyWork(OperationResult result, string expectedKey)
    {
        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo(expectedKey));
        await _coreHelper.DidNotReceive().GetCore();
        var identityWrites = new[]
        {
            nameof(UserManager<EformUser>.CreateAsync), nameof(UserManager<EformUser>.UpdateAsync),
            nameof(UserManager<EformUser>.AddToRoleAsync), nameof(UserManager<EformUser>.RemoveFromRoleAsync),
            nameof(UserManager<EformUser>.RemovePasswordAsync), nameof(UserManager<EformUser>.AddPasswordAsync),
        };
        Assert.That(_userManager.ReceivedCalls().Select(c => c.GetMethodInfo().Name),
            Has.None.AnyOf(identityWrites));
    }

    private async Task AssertPassedTheGuard() => await _coreHelper.Received(1).GetCore();

    [Test]
    public async Task Create_NonAdminCreatesAdmin_IsRefused()
    {
        CallerIs(id: 5, isAdmin: false);
        await AssertRefusedBeforeAnyWork(
            await _adminService.Create(User(0, EformRole.Admin, groupId: null, AnyPassword())),
            "OnlyAdminsCanAssignTheAdminRole");
    }

    [Test]
    public async Task Create_AdminCreatesAdmin_PassesTheGuard()
    {
        CallerIs(id: 5, isAdmin: true);
        await _adminService.Create(User(0, EformRole.Admin, groupId: null, AnyPassword()));
        await AssertPassedTheGuard();
    }

    [Test]
    public async Task Update_NonAdminPromotesAnotherUser_IsRefused()
    {
        CallerIs(id: 5, isAdmin: false);
        await AssertRefusedBeforeAnyWork(
            await _adminService.Update(User(9, EformRole.Admin, groupId: null)),
            "OnlyAdminsCanAssignTheAdminRole");
    }

    // A non-admin may not promote their own account to administrator.
    [Test]
    public async Task Update_NonAdminPromotesThemselves_IsRefused()
    {
        CallerIs(id: 5, isAdmin: false);
        await AssertRefusedBeforeAnyWork(
            await _adminService.Update(User(5, EformRole.Admin, groupId: null)),
            "OnlyAdminsCanAssignTheAdminRole");
    }

    [Test]
    public async Task Update_NonAdminSetsOwnPassword_IsRefused()
    {
        CallerIs(id: 5, isAdmin: false);
        var group = await SeedGroupAsync();
        await PutInGroupAsync(5, group);
        await AssertRefusedBeforeAnyWork(
            await _adminService.Update(User(5, EformRole.User, group, AnyPassword())),
            "YouCantChangeYourOwnPasswordOrGroupHere");
    }

    [Test]
    public async Task Update_NonAdminChangesOwnGroup_IsRefused()
    {
        CallerIs(id: 5, isAdmin: false);
        var current = await SeedGroupAsync();
        var other = await SeedGroupAsync();
        await PutInGroupAsync(5, current);
        await AssertRefusedBeforeAnyWork(
            await _adminService.Update(User(5, EformRole.User, other)),
            "YouCantChangeYourOwnPasswordOrGroupHere");
    }

    // Profile edits of one's own account still go through the guard.
    [Test]
    public async Task Update_NonAdminEditsOwnNameOnly_PassesTheGuard()
    {
        CallerIs(id: 5, isAdmin: false);
        var group = await SeedGroupAsync();
        await PutInGroupAsync(5, group);
        await _adminService.Update(User(5, EformRole.User, group));
        await AssertPassedTheGuard();
    }

    [Test]
    public async Task Update_AdminPromotesAUser_PassesTheGuard()
    {
        CallerIs(id: 5, isAdmin: true);
        await _adminService.Update(User(9, EformRole.Admin, groupId: null));
        await AssertPassedTheGuard();
    }
}
