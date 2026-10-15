using System.ComponentModel.DataAnnotations;

namespace eFormAPI.Web.Infrastructure.Models.ExternalLinks;

/// <summary>Creates one link. Admin-only: a link grants a STANDING cross-installation
/// capability over that account, which is a bigger decision than one password reset.</summary>
public class CreateExternalUserLinkModel
{
    [Required]
    public string LoginProvider { get; set; }

    /// <summary>The my.microting.com host Identity user id, decimal, no padding.</summary>
    [Required]
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

    [Required]
    public string ProviderKey { get; set; }
}
