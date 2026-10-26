using System.Threading;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.DelegatedAccess;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions;

using Infrastructure.Models.Auth;

/// <summary>
/// Turns a FULLY validated portal assertion into a local tenant session.
///
/// The contract has two halves, and both are load-bearing:
///
/// <list type="bullet">
/// <item>The caller has already proved the assertion (signature, issuer, audience,
/// lifetime, algorithm, replay — see <see cref="IDelegatedAssertionValidator"/>). This
/// service performs NO validation of its own and must never be handed a raw token.</item>
/// <item>The principal it resolves or provisions NEVER holds a credential. It is created
/// with Identity's no-password overload, so <c>PasswordHash</c> is null, and every
/// password-setting path refuses it because it carries a
/// <see cref="Infrastructure.Models.ExternalLinks.ExternalLoginProviders.MyMicrotingDelegated"/>
/// login row. Tenant-native accounts are never adopted, never modified and never
/// reachable from here.</item>
/// </list>
///
/// The result is the same <see cref="EformAuthorizeResult"/> shape
/// <c>api/auth/token</c> produces, minted by the tenant's own
/// <see cref="IAuthService.GenerateToken"/>, so the client stores it identically and the
/// portal's signature buys exactly one thing: the right to be issued THIS tenant's token.
/// </summary>
public interface IDelegatedSignInService
{
    /// <param name="assertion">A validated assertion. Holding one is proof the checks
    /// passed; nothing here re-checks it.</param>
    /// <param name="ct">Cancellation for the request. Identity's store API exposes no
    /// cancellable overloads, so this is observed at the entry boundary only — never
    /// between the user row and its login row, where abandoning the work would leave a
    /// principal with no link.</param>
    Task<OperationDataResult<EformAuthorizeResult>> SignInAsync(DelegatedAssertion assertion,
        CancellationToken ct);
}
