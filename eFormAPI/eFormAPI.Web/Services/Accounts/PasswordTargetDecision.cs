namespace eFormAPI.Web.Services.Accounts;

/// <summary>
/// Why an administrative password set may not touch a target account.
///
/// Used ONLY by the link-targeted path (AccountService.EvaluateLinkedTargetGuards).
/// AdminChangePassword's own copy of these rules is byte-frozen and returns
/// OperationResult inline; it is deliberately NOT refactored to use this type.
/// </summary>
public enum PasswordTargetRefusal
{
    /// <summary>The target is reachable.</summary>
    None = 0,

    /// <summary>No caller principal at all. Fails closed.</summary>
    NoCallerPrincipal,

    /// <summary>
    /// The target is user Id 1 and the caller is not. The primary admin can only be
    /// targeted by itself. PINNED by design decision D-1: never relaxed, parameterised
    /// or exempted — not for a linked account, not for an admin caller.
    /// </summary>
    PrimaryAdmin,

    /// <summary>A non-admin caller may not target a user holding the admin role.</summary>
    TargetIsAdmin,

    /// <summary>A non-admin may not change their own password through this route.</summary>
    OwnAccount,

    /// <summary>A device-user manager may target only a live worker.</summary>
    NotALiveWorker,

    /// <summary>
    /// A device-user manager may not target an account holding a claim the caller lacks,
    /// or resetting its password would hand the caller rights it does not have.
    /// </summary>
    MorePrivilegedAccount
}

/// <summary>
/// The verdict of the link-targeted path's target guards: the machine-readable reason,
/// plus the localization key whose string AdminChangePassword returns for the same
/// reason. Both halves travel together so the two copies of the rules cannot drift in
/// their wording either — PasswordTargetGuardAgreementTests asserts the keys match.
/// </summary>
public sealed record PasswordTargetDecision(PasswordTargetRefusal Refusal, string MessageKey)
{
    public bool Allowed => Refusal == PasswordTargetRefusal.None;

    public static PasswordTargetDecision Allow { get; } =
        new(PasswordTargetRefusal.None, null);

    public static PasswordTargetDecision Refuse(PasswordTargetRefusal refusal, string messageKey)
        => new(refusal, messageKey);
}
