namespace eFormAPI.Web.Infrastructure.Models.DelegatedAccess;

/// <summary>
/// Per-tenant configuration for partner-federated ("delegated") sign-in.
///
/// Bound from the "DelegatedAccess" configuration section. Every field is tenant-local:
/// nothing here is a secret, and nothing here is shared with another tenant. The portal
/// signs assertions with a PRIVATE key the tenant never sees; the tenant only ever reads
/// the matching public key from <see cref="JwksUri"/>. That asymmetry is the whole point
/// and is deliberately unlike the host's own tokens, which are symmetric HS256 with a
/// per-tenant <c>EformTokenOptions:SigningKey</c>. The two mechanisms must never be mixed.
/// </summary>
public sealed class DelegatedAccessOptions
{
    /// <summary>
    /// Per-tenant kill switch. Default FALSE, so a tenant that has not been configured
    /// has no federated path at all: an un-upgraded or opted-out tenant refuses every
    /// assertion before it looks at one. Rolling this out is an explicit act per tenant.
    /// </summary>
    public bool Enabled { get; set; }

    /// <summary>The portal's issuer, e.g. "https://my.microting.com". Compared exactly.</summary>
    public string Issuer { get; set; } = "";

    /// <summary>Where the portal publishes its public signing keys (JWKS).</summary>
    public string JwksUri { get; set; } = "";

    /// <summary>
    /// THIS tenant's customerNo, as a string. An assertion minted for another tenant
    /// carries another customerNo in <c>aud</c> and must be refused here even though its
    /// signature is perfectly valid — that is the audience-confusion defence, and it is
    /// the only thing standing between "an advisor may sign in to customer 1043" and
    /// "an advisor may sign in to every customer in the fleet".
    /// </summary>
    public string Audience { get; set; } = "";

    /// <summary>
    /// Tolerance for clock drift between the portal and this tenant, in seconds.
    /// Applied to both <c>nbf</c> and <c>exp</c>. Negative values are treated as zero.
    /// </summary>
    public int ClockSkewSeconds { get; set; } = 60;

    /// <summary>
    /// The group every tenant already has, seeded by the base package's
    /// AddDefaultSecurityGroups migration. Declared ABOVE the property it defaults, so
    /// the value is plainly the one the property gets, and <c>static readonly</c> rather
    /// than <c>const</c> for SonarC# S2339 — the same choice the sign-in service makes.
    /// </summary>
    public static readonly string DefaultSecurityGroup = "eForm users";

    /// <summary>
    /// The tenant security group a delegated advisor is placed in, by NAME.
    ///
    /// Deliberately optional, with a working default: every tenant is seeded with
    /// <see cref="DefaultSecurityGroup"/> (the base package's AddDefaultSecurityGroups
    /// migration), the four live tenants are already configured, and none of them should
    /// have to be touched again to get a working menu. A tenant that wants its advisors
    /// somewhere else sets this key; everybody else sets nothing.
    ///
    /// The group grants the PERMISSIONS half of access. The role grants the other half
    /// and remains the revocation lever (spec §8.7): this never grants a role, and an
    /// advisor whose role is stripped is refused before this is reached.
    /// </summary>
    public string SecurityGroup { get; set; } = DefaultSecurityGroup;
}
