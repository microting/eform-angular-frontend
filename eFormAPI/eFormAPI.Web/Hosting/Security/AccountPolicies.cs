using System.Security.Claims;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace eFormAPI.Web.Hosting.Security;

/// <summary>
/// Authorization for setting ANOTHER account's password
/// (<c>api/account/change-password-admin</c>).
///
/// This decides who may CALL the endpoint. Who may be TARGETED is decided in
/// <c>AccountService.AdminChangePassword</c>, which stops a non-admin resetting an
/// admin or their own account through it. Both layers are needed: the policy alone
/// would let a manager reset an admin.
///
/// One either-of policy, because several <c>[Authorize(Policy = …)]</c> attributes
/// combine with AND. The name lives here rather than in
/// <c>eform-angular-frontend-base</c>'s <c>AuthConsts</c> so it ships without a base-package
/// release.
/// </summary>
public static class AccountPolicies
{
    public const string SetOtherUsersPassword = "account_set_other_users_password";

    public static bool MaySetOtherUsersPassword(ClaimsPrincipal user)
        => MayResetAnyNonAdmin(user)
           || user.HasClaim(AuthConsts.EformClaims.DeviceUsersClaims.Update, AuthConsts.ClaimDefaultValue);

    /// <summary>
    /// May reset ANY non-admin account: an admin, or a user manager. Everyone else who
    /// passed the policy is narrowed in <c>AccountService.AdminChangePassword</c>.
    /// </summary>
    public static bool MayResetAnyNonAdmin(ClaimsPrincipal user)
        => user.IsInRole(EformRole.Admin)
           || user.HasClaim(AuthConsts.EformClaims.UserManagementClaims.Update, AuthConsts.ClaimDefaultValue);
}
