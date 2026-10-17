namespace eFormAPI.Web.Infrastructure.Models.ExternalLinks;

/// <summary>
/// One UserLogins row for our provider, joined to the account it points at. This is the
/// read the fan-out's confirmation step and the plugin's reconciliation both use, and the
/// row the link dialog renders — so it carries the tenant user id, which is the thing
/// actually written, and the IsPrimaryAdmin flag the dialog needs to disable a row.
/// </summary>
public class ExternalUserLinkRow
{
    public string LoginProvider { get; set; }

    /// <summary>The my.microting.com host Identity user id, decimal, no padding.</summary>
    public string ProviderKey { get; set; }

    /// <summary>
    /// Informational only. NEVER parsed, never used for any decision — it exists because
    /// a local admin looking at this row deserves to know what it is and where it came
    /// from, and because there is no audit log anywhere else on this side.
    /// </summary>
    public string ProviderDisplayName { get; set; }

    public int UserId { get; set; }

    public string UserName { get; set; }

    public string Email { get; set; }

    public string FullName { get; set; }

    public string Role { get; set; }

    /// <summary>
    /// True when UserId == 1. Such an account may only be targeted by itself, so a link to
    /// it can never be honoured — which is why link creation refuses it outright. The flag
    /// is reported so the link dialog can render the row visibly disabled with its reason
    /// rather than filtering it out, because an admin who cannot find the person they came
    /// to link needs to be told why.
    /// </summary>
    public bool IsPrimaryAdmin { get; set; }
}
