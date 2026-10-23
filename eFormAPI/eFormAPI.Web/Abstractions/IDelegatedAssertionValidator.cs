using System.Threading;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.DelegatedAccess;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions;

/// <summary>
/// Decides whether to believe an assertion presented by an anonymous caller.
///
/// This is the security core of delegated sign-in: everything downstream trusts the
/// result completely and performs no checks of its own. The caller is hostile by
/// assumption — the endpoint is public, unauthenticated, and the attacker can read this
/// source — so the contract is deliberately narrow:
///
/// <list type="bullet">
/// <item>A successful result means signature, algorithm, issuer, audience, lifetime and
/// replay have ALL passed, and the <c>jti</c> has already been consumed.</item>
/// <item>Every other outcome is an unsuccessful result. The method never throws, never
/// hangs, and never returns a partially validated assertion.</item>
/// </list>
/// </summary>
public interface IDelegatedAssertionValidator
{
    /// <param name="rawToken">The compact JWS exactly as the caller posted it.</param>
    /// <param name="ct">Cancellation for the outbound JWKS fetch.</param>
    Task<OperationDataResult<DelegatedAssertion>> ValidateAsync(string rawToken, CancellationToken ct);
}
