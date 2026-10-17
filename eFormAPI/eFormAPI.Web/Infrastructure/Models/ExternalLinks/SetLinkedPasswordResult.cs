namespace eFormAPI.Web.Infrastructure.Models.ExternalLinks;

/// <summary>
/// What the link-targeted set-password endpoint did. The plugin maps these onto its own
/// per-tenant outcome vocabulary, so the two enums cannot be confused for one enum:
/// Changed→Changed, NoLink→NoLink, AmbiguousLink→AmbiguousLink,
/// PasswordRejected→PasswordRejected, and both refusals→RefusedByTenant with the Detail
/// preserving which one it was. Adding, renaming or reordering a member is a breaking
/// change to a separate repository.
///
/// THE MEMBER ORDER IS A WIRE CONTRACT. No JsonStringEnumConverter is registered on this
/// host, so System.Text.Json serializes this enum as its INTEGER ordinal and the plugin
/// deserializes it by that ordinal: Changed=0, NoLink=1, AmbiguousLink=2,
/// RefusedPrimaryAdmin=3, RefusedByPolicy=4, PasswordRejected=5. Reordering the members —
/// or inserting one anywhere but at the end — silently remaps every outcome a deployed
/// plugin reads, turning a refusal into a success with no error anywhere. Append only,
/// and never renumber.
/// </summary>
public enum SetLinkedPasswordOutcome
{
    /// <summary>The linked account's password is now the one that was supplied.</summary>
    Changed,

    /// <summary>No account on this installation holds that (provider, key). Nothing was changed.</summary>
    NoLink,

    /// <summary>
    /// The resolved account carries more than one link for this provider, so which portal
    /// person it belongs to is undecidable. Nothing was changed, deliberately: the only
    /// possible residual inconsistency fails closed.
    /// </summary>
    AmbiguousLink,

    /// <summary>
    /// The target is user Id 1, which may only be targeted by itself. Defence in depth —
    /// link creation already refuses Id 1, so this should be unreachable through our own
    /// paths and exists to keep the endpoint safe against a link created out-of-band.
    /// </summary>
    RefusedPrimaryAdmin,

    /// <summary>A target guard other than the primary-admin one refused. Nothing was changed.</summary>
    RefusedByPolicy,

    /// <summary>
    /// The new password failed IdentityOptions.Password validation. The row is untouched —
    /// the old password still works.
    /// </summary>
    PasswordRejected
}

/// <summary>
/// The per-call result. TargetUserId is the RESOLVED tenant-side Users.Id, which is the
/// only thing that makes a my.microting.com-initiated change auditable from this
/// installation's own side.
///
/// The property set is a WIRE CONTRACT: exactly Outcome, TargetUserId, TargetEmail,
/// TargetIsActive and Detail. System.Text.Json silently DROPS a member the receiving type
/// does not declare, so a member removed or renamed here does not fail anywhere — the
/// plugin simply stops seeing it. ExternalLinkContractTests pins the set, and the plugin
/// has a mirrored test.
/// </summary>
public class SetLinkedPasswordResult
{
    public SetLinkedPasswordOutcome Outcome { get; set; }

    /// <summary>Null only when no account was resolved at all (NoLink).</summary>
    public int? TargetUserId { get; set; }

    public string TargetEmail { get; set; }

    /// <summary>
    /// Whether the resolved account's login is enabled (EformUser.IsActive), or null when
    /// no account was resolved.
    ///
    /// THREE-STATE, and the nullability carries meaning: true the login is fine, false the
    /// account cannot log in, null no account was resolved so we do not know. A consumer
    /// must therefore test <c>TargetIsActive == false</c> to warn — never
    /// <c>!= true</c>, which would also fire on the unknown case.
    ///
    /// INFORMATIONAL ONLY — never used for a decision here. Upstream added IsActive as a
    /// LOGIN gate for resigned accounts, and no password path consults it: neither
    /// AdminChangePassword nor ReplacePasswordAsync, so the two target-rule copies stay in
    /// agreement (see the plan's deviation D-F). Setting the password of a disabled account
    /// is harmless — it still cannot log in — but reporting a bare Changed for it would
    /// mislead the operator, so the flag is carried and the caller can say "password set,
    /// but this account's login is disabled".
    /// </summary>
    public bool? TargetIsActive { get; set; }

    /// <summary>Human-readable. Never a secret, never any part of the password.</summary>
    public string Detail { get; set; }
}
