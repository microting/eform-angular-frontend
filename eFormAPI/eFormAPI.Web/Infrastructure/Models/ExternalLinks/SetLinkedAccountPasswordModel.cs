using System.ComponentModel.DataAnnotations;

namespace eFormAPI.Web.Infrastructure.Models.ExternalLinks;

/// <summary>
/// The request for POST api/account/set-linked-account-password.
///
/// This model CANNOT NAME A USER, and that is its whole point: no email, no user id, no
/// username. The target is resolved only by UserManager.FindByLoginAsync(provider, key)
/// against a link a tenant admin created explicitly, which is what makes the
/// wrong-person failure structurally impossible at fan-out time. A property that could
/// name a user must never be added here.
/// </summary>
public class SetLinkedAccountPasswordModel
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

    // Mirrors ChangePasswordAdminModel's constraint, so the two routes refuse the same
    // passwords at the same layer.
    [Required]
    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
    [DataType(DataType.Password)]
    [Display(Name = "New password")]
    public string NewPassword { get; set; }
}
