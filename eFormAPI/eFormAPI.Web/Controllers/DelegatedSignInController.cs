using System.Threading;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models.DelegatedAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers;

/// <summary>
/// Public endpoint that turns a signed assertion from the portal into a tenant session.
/// All logic lives in the validator and the sign-in service; this layer only gates on the
/// tenant opt-in and keeps every refusal externally identical (no oracle).
/// </summary>
[Authorize]
[Route("api/auth/delegated")]
public class DelegatedSignInController(
    IOptionsMonitor<DelegatedAccessOptions> options,
    IDelegatedAssertionValidator validator,
    IDelegatedSignInService signInService)
    : Controller
{
    /// <summary>
    /// The one message returned for every refusal, whatever the cause.
    ///
    /// static readonly rather than const, for SonarC# S2339: a public const is baked into
    /// every referencing assembly at compile time.
    /// </summary>
    public static readonly string RefusedMessage = "DelegatedSignInRefused";

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> SignInDelegated([FromBody] DelegatedSignInModel model, CancellationToken ct)
    {
        // The opt-out gate runs before anything else: no validation, no user lookup.
        if (!options.CurrentValue.Enabled)
        {
            return Refused();
        }

        // Binding failures are refused with the same uniform 401 as everything else, so
        // this adds no oracle: the body-level checks below already turned an unbindable
        // or empty body into the very same refusal.
        if (!ModelState.IsValid)
        {
            return Refused();
        }

        if (string.IsNullOrWhiteSpace(model?.Assertion))
        {
            return Refused();
        }

        var validated = await validator.ValidateAsync(model.Assertion, ct);
        if (!validated.Success || validated.Model == null)
        {
            return Refused();
        }

        var result = await signInService.SignInAsync(validated.Model, ct);
        if (!result.Success || result.Model == null)
        {
            return Refused();
        }

        return Ok(result);
    }

    private IActionResult Refused() => Unauthorized(new OperationResult(false, RefusedMessage));
}
