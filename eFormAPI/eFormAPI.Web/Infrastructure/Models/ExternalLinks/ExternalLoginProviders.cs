using System;

namespace eFormAPI.Web.Infrastructure.Models.ExternalLinks;

/// <summary>
/// The external-login providers this installation accepts for account links.
/// There is exactly one, and there is deliberately no way to add another through the API.
/// </summary>
public static class ExternalLoginProviders
{
    /// <summary>
    /// The one provider this host accepts for my.microting.com account links.
    ///
    /// A hostname, deliberately: it cannot collide with an authentication SCHEME name
    /// ("Google", "Facebook", "OpenIdConnect"), which is what a future OAuth login would
    /// write to the same UserLogins table — the schema already carries GoogleId,
    /// FacebookId and PreferredLoginProvider from migration 20250904105541.
    ///
    /// The plugin holds a byte-identical copy of this literal (MyMicrotingLinkProvider.Name).
    /// Changing it orphans every link row already written on every tenant.
    /// </summary>
    public const string MyMicroting = "my.microting.com";

    /// <summary>
    /// Whether <paramref name="loginProvider"/> is the one supported provider.
    ///
    /// Case-insensitive, because the UserLogins primary key collates
    /// utf8mb4_uca1400_ai_ci: "my.microting.com" and "My.Microting.Com" are the SAME
    /// primary-key value, so rejecting a case variant here would refuse a row the
    /// database would happily match. Provider names must never be distinguished by case.
    /// Every WRITE still uses the constant itself, never the caller's spelling.
    /// </summary>
    public static bool IsSupported(string loginProvider)
        => !string.IsNullOrEmpty(loginProvider)
           && string.Equals(loginProvider, MyMicroting, StringComparison.OrdinalIgnoreCase);
}
