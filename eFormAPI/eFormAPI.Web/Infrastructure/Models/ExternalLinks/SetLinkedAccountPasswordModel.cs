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

    /// <summary>The my.microting.com host Identity user id, decimal, no padding.</summary>
    [Required]
    public string ProviderKey { get; set; }

    // Mirrors ChangePasswordAdminModel's constraint, so the two routes refuse the same
    // passwords at the same layer.
    [Required]
    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
    [DataType(DataType.Password)]
    [Display(Name = "New password")]
    public string NewPassword { get; set; }
}
