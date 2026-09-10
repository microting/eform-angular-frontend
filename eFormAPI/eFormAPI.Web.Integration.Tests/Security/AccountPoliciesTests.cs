using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using eFormAPI.Web.Controllers;
using eFormAPI.Web.Hosting.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Security;

// Who may set ANOTHER account's password: an administrator, or a holder of
// users_update or device_users_update. Any other authenticated account is refused.
[TestFixture]
public class AccountPoliciesTests
{
    private static ClaimsPrincipal Principal(params Claim[] claims)
        => new(new ClaimsIdentity(claims, authenticationType: "test"));

    private static Claim Granted(string claim) => new(claim, AuthConsts.ClaimDefaultValue);

    [Test]
    public void Admin_MaySetOtherUsersPassword()
        => Assert.That(AccountPolicies.MaySetOtherUsersPassword(
            Principal(new Claim(ClaimTypes.Role, EformRole.Admin))), Is.True);

    [Test]
    public void UserManager_MaySetOtherUsersPassword()
        => Assert.That(AccountPolicies.MaySetOtherUsersPassword(
            Principal(Granted(AuthConsts.EformClaims.UserManagementClaims.Update))), Is.True);

    [Test]
    public void DeviceUserManager_MaySetOtherUsersPassword()
        => Assert.That(AccountPolicies.MaySetOtherUsersPassword(
            Principal(Granted(AuthConsts.EformClaims.DeviceUsersClaims.Update))), Is.True);

    // A plain authenticated user with the user role holds none of the three rights.
    [Test]
    public void PlainUser_MayNotSetOtherUsersPassword()
        => Assert.That(AccountPolicies.MaySetOtherUsersPassword(
            Principal(new Claim(ClaimTypes.Role, EformRole.User))), Is.False);

    // Read rights are not write rights.
    [Test]
    public void ReadOnlyUserManager_MayNotSetOtherUsersPassword()
        => Assert.That(AccountPolicies.MaySetOtherUsersPassword(
            Principal(Granted(AuthConsts.EformClaims.UserManagementClaims.Read),
                Granted(AuthConsts.EformClaims.DeviceUsersClaims.Read))), Is.False);

    // A claim present with any value other than "True" grants nothing.
    [Test]
    public void ClaimWithoutTheGrantedValue_MayNotSetOtherUsersPassword()
        => Assert.That(AccountPolicies.MaySetOtherUsersPassword(
            Principal(new Claim(AuthConsts.EformClaims.UserManagementClaims.Update, "False"))), Is.False);

    // The attribute is what makes the rule apply to the endpoint at all.
    [Test]
    public void ChangePasswordAdmin_RequiresTheSetOtherUsersPasswordPolicy()
    {
        var action = typeof(AccountController).GetMethod(nameof(AccountController.ChangePasswordAdmin))!;

        Assert.That(action.GetCustomAttributes<AuthorizeAttribute>().Select(a => a.Policy),
            Does.Contain(AccountPolicies.SetOtherUsersPassword));
        Assert.That(action.GetCustomAttribute<AllowAnonymousAttribute>(), Is.Null,
            "an [AllowAnonymous] here would silently bypass the policy");
        Assert.That(typeof(AccountController).GetCustomAttribute<AllowAnonymousAttribute>(), Is.Null,
            "an [AllowAnonymous] on the controller class would bypass the policy on every action");
    }

    // Registration is what makes the name resolve at runtime: a policy name that
    // is never registered throws instead of authorising. Evaluate it end to end.
    [Test]
    public async Task ThePolicyIsRegisteredAndEvaluatesTheRule()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["EformTokenOptions:Issuer"] = "account-policies-test",
                // Random per run: a literal signing key would read as a committed secret.
                ["EformTokenOptions:SigningKey"] = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)),
            })
            .Build();
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddEFormAuth(configuration, new List<PluginPermissionModel>());
        await using var provider = services.BuildServiceProvider();
        var authorization = provider.GetRequiredService<IAuthorizationService>();

        var manager = Principal(Granted(AuthConsts.EformClaims.DeviceUsersClaims.Update));
        var worker = Principal(new Claim(ClaimTypes.Role, EformRole.User));

        Assert.That((await authorization.AuthorizeAsync(manager, AccountPolicies.SetOtherUsersPassword)).Succeeded,
            Is.True);
        Assert.That((await authorization.AuthorizeAsync(worker, AccountPolicies.SetOtherUsersPassword)).Succeeded,
            Is.False);
    }

    // "May reset any non-admin" — the line the worker-only rule draws inside the policy's population.
    [Test]
    public void MayResetAnyNonAdmin_AdminAndUserManagerOnly()
    {
        Assert.That(AccountPolicies.MayResetAnyNonAdmin(Principal(new Claim(ClaimTypes.Role, EformRole.Admin))), Is.True);
        Assert.That(AccountPolicies.MayResetAnyNonAdmin(Principal(Granted(AuthConsts.EformClaims.UserManagementClaims.Update))), Is.True);
        Assert.That(AccountPolicies.MayResetAnyNonAdmin(Principal(Granted(AuthConsts.EformClaims.DeviceUsersClaims.Update))), Is.False,
            "a device-user manager passes the policy but may reset only workers");
        Assert.That(AccountPolicies.MayResetAnyNonAdmin(Principal(new Claim(ClaimTypes.Role, EformRole.User))), Is.False);
    }

    // The anonymous reset let anyone reset the primary admin to a default password
    // with a publicly seeded code. It must not merely be disabled; it must be gone.
    [Test]
    public void ResetAdminPassword_NoLongerExists()
    {
        Assert.That(typeof(AccountController).GetMethod("ResetAdminPassword"), Is.Null);
        Assert.That(typeof(eFormAPI.Web.Abstractions.IAccountService).GetMethod("ResetAdminPassword"), Is.Null);

        var routes = typeof(AccountController).GetMethods()
            .SelectMany(m => m.GetCustomAttributes<Microsoft.AspNetCore.Mvc.RouteAttribute>())
            .Select(r => r.Template);
        Assert.That(routes, Has.None.Contains("reset-admin-password"));
    }
}
