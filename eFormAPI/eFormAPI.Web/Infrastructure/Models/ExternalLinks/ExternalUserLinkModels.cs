using System.ComponentModel.DataAnnotations;

namespace eFormAPI.Web.Infrastructure.Models.ExternalLinks;

/// <summary>Creates one link. Admin-only: a link grants a STANDING cross-installation
/// capability over that account, which is a bigger decision than one password reset.</summary>
public class CreateExternalUserLinkModel
{
    [Required]
    public string LoginProvider { get; set; }

    /// <summary>
    /// The my.microting.com host Identity user id, decimal, no padding.
    ///
    /// Bounded and shaped at the model layer, not left to the lookup. The column is
    /// varchar(255) with the utf8mb4_uca1400_ai_ci collation, which is PAD SPACE and
    /// accent-insensitive: "4821 " compares EQUAL to "4821", and "ABC" equal to "abc".
    /// Today that resolves to the correct row, because the key is a decimal id and the
    /// only variant that collides is trailing whitespace on the same number — but
    /// relying on the collation to land on the right account is the wrong place to be
    /// relying on anything. Reject the input instead: exactly the digits, nothing else,
    /// and never longer than the column.
    /// </summary>
    [Required]
    [StringLength(255, MinimumLength = 1)]
    [RegularExpression("^[0-9]+$", ErrorMessage = "The ProviderKey must be decimal digits only, with no padding.")]
    public string ProviderKey { get; set; }

    /// <summary>
    /// Informational crumb for a local admin reading the row. Truncated to 512 characters
    /// before it is written. Never parsed back.
    /// </summary>
    public string ProviderDisplayName { get; set; }

    /// <summary>The local Users.Id to attach the link to. 1 is refused (decision D-1).</summary>
    [Required]
    public int TargetUserId { get; set; }
}

/// <summary>Removes one link. Idempotent: removing an absent link succeeds, because a
/// local admin must never need my.microting.com's cooperation to detach.</summary>
public class DeleteExternalUserLinkModel
{
    [Required]
    public string LoginProvider { get; set; }

    /// <summary>
    /// Bounded to the column width like the other two models, but deliberately NOT
    /// shaped: detaching must never be the operation an admin cannot perform. A row
    /// written before this validation existed, or written out of band, still has to be
    /// removable, and refusing the delete would be the one failure mode this endpoint's
    /// idempotence exists to rule out. Nothing is created here, so a malformed key can
    /// only ever match nothing.
    /// </summary>
    [Required]
    [StringLength(255, MinimumLength = 1)]
    public string ProviderKey { get; set; }
}
