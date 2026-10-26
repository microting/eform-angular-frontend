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
    ///
    /// static readonly rather than const, for SonarC# S2339: a public const is baked into
    /// every referencing assembly at compile time. EF Core still folds a static readonly
    /// into the generated SQL as a literal rather than a parameter, so
    /// ExternalUserLinkServiceTests.GetLinks_FiltersByProviderInTheDatabase keeps
    /// asserting the value in the WHERE clause itself.
    /// </summary>
    public static readonly string MyMicroting = "my.microting.com";

    /// <summary>
    /// The provider for partner-federated (delegated) sign-in. Deliberately distinct from
    /// <see cref="MyMicroting"/>: P3's password fan-out resolves its target by
    /// (MyMicroting, providerKey), so a delegated row under the same provider would be a
    /// valid fan-out target and would be given a password. Keeping it separate means the
    /// fan-out can never reach a credential-less advisor principal.
    ///
    /// IsSupported deliberately does NOT accept this value, so the existing link API can
    /// never write a delegated row.
    ///
    /// static readonly for the same SonarC# S2339 reason as <see cref="MyMicroting"/>.
    /// </summary>
    public static readonly string MyMicrotingDelegated = "my.microting.com/delegated";

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
