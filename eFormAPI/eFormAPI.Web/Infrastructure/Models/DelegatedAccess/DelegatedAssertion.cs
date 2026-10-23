using System;

namespace eFormAPI.Web.Infrastructure.Models.DelegatedAccess;

/// <summary>
/// A portal assertion that has been FULLY validated: signature, issuer, audience,
/// lifetime, algorithm and replay. It is only ever constructed on the success path, so
/// holding one of these is proof the checks passed — a caller is entitled to trust every
/// field without re-checking anything, and no partially validated instance is ever
/// returned.
/// </summary>
/// <param name="Subject">The portal's stable, never-reassigned identifier for the advisor
/// (<c>sub</c>). The ONLY safe key for the local principal: never key on email.</param>
/// <param name="DisplayName">The advisor's display name (<c>name</c>), for audit
/// attribution only. May be empty; it is never an identifier.</param>
/// <param name="RoleTemplate">The role template the portal asserts (<c>role_template</c>).
/// Never empty: an assertion that omits it is refused rather than defaulted, because the
/// caller trusts this result completely and an empty template would silently become
/// somebody's default permission set on a customer's tenant.</param>
/// <param name="JwtId">The assertion's unique id (<c>jti</c>), already consumed by the
/// replay cache at the moment this record was produced.</param>
/// <param name="ExpiresAt">The assertion's own expiry (<c>exp</c>).</param>
public sealed record DelegatedAssertion(
    string Subject, string DisplayName, string RoleTemplate, string JwtId, DateTimeOffset ExpiresAt);

/// <summary>
/// The claim names the portal mints and this tenant reads. The portal lives in another
/// repository, so these names are a wire contract: changing one here without changing it
/// there breaks every delegated sign-in in the fleet.
/// </summary>
public static class DelegatedAssertionClaims
{
    /// <summary>Stable advisor identifier. Required.</summary>
    public const string Subject = "sub";

    /// <summary>Unique assertion id, the replay key. Required — without it there is no
    /// replay defence at all, so an assertion that omits it is refused.</summary>
    public const string JwtId = "jti";

    /// <summary>Advisor display name, for audit attribution. Optional, and deliberately
    /// so: it is never an identifier and never drives a permission, so a missing one is a
    /// poorer audit line rather than a security decision made on a guess.</summary>
    public const string DisplayName = "name";

    /// <summary>
    /// The asserted role template. REQUIRED. These names are this repository's unilateral
    /// invention and the portal that mints them lives in another repository, so a mismatch
    /// — <c>role</c>, <c>roleTemplate</c>, a typo — must fail loudly at the first
    /// integration sign-in rather than degrade to "" and be read as a default.
    /// </summary>
    public const string RoleTemplate = "role_template";
}
