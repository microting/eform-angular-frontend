using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models.ExternalLinks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers;

/// <summary>
/// External account links: which local accounts are linked to a my.microting.com user.
///
/// A separate controller rather than an addition to AccountController, because this is
/// user administration, not account self-service — and AccountController is already long.
///
/// [Authorize(Roles = EformRole.Admin)] deliberately, not the SetOtherUsersPassword
/// policy: creating a link grants a STANDING cross-installation capability over that
/// account, a bigger decision than one password reset, so it should require this
/// installation's top role. The GET is admin-only too, because the list is a map of which
/// accounts a third party can reach.
///
/// These routes are also the CAPABILITY PROBE for the whole feature, and that is a
/// cross-repository contract: my.microting.com decides whether a tenant has this release
/// by calling GET api/external-user-links and reading the response SHAPE —
/// 404 or 2xx-with-HTML means "no such route, tenant not upgraded"; 2xx JSON, 401 or 403
/// means "upgraded".
///
/// UseAngularMiddleware (Hosting/Extensions/ApplicationBuilderExtensions.cs, registered
/// LAST in Startup.cs) rewrites ANY extension-less 404 into 200 text/html from
/// wwwroot/index.html, which the Dockerfile populates — and it has NO /api exclusion. So a
/// route that does NOT exist answers 404 or 200-text/html, while these routes answer
/// 200 application/json when authorised and 401/403 when not. Three independent reasons
/// these can never answer HTML, each sufficient:
///   1. the middleware only ever rewrites a 404, and an existing MVC action never
///      produces one — unauthenticated is 401 (the cookie scheme's OnRedirectToLogin),
///      authenticated-but-not-admin is 403 (OnRedirectToAccessDenied);
///   2. every action returns an OperationResult-shaped POCO, which the JSON formatter
///      serialises — there is no code path here that can produce a ViewResult;
///   3. loginProvider stays in the QUERY STRING, so Path.HasExtension — which reads only
///      the path — cannot see "my.microting.com" and cannot be influenced by it.
///
/// DO NOT change the route template, the [Authorize] attribute or the return type of any
/// action here, and never add [AllowAnonymous] or [ApiExplorerSettings(IgnoreApi = true)].
/// Doing so breaks the version gate on EVERY tenant at once, silently: the probe would
/// read "upgraded" or "not upgraded" wrongly and either refuse working tenants or proceed
/// against ones that cannot honour a link. Keep loginProvider in the QUERY STRING too —
/// moving it into the route template would make ".com" read as a file extension and change
/// what an un-upgraded tenant returns. Any change here needs a matching plugin change.
/// ExternalUserLinksAuthorizationTests pins all of it.
/// </summary>
[Authorize(Roles = EformRole.Admin)]
[Route("api/external-user-links")]
public class ExternalUserLinksController(IExternalUserLinkService externalUserLinkService) : Controller
{
    // GET api/external-user-links?loginProvider=my.microting.com
    // The capability probe's target. loginProvider is [FromQuery] on purpose — see above.
    [HttpGet]
    public Task<OperationDataResult<List<ExternalUserLinkRow>>> GetLinks([FromQuery] string loginProvider)
    {
        return externalUserLinkService.GetLinks(loginProvider);
    }

    // GET api/external-user-links/by-key?loginProvider=…&providerKey=…
    [HttpGet("by-key")]
    public Task<OperationDataResult<ExternalUserLinkRow>> GetLinkByKey(
        [FromQuery] string loginProvider, [FromQuery] string providerKey)
    {
        return externalUserLinkService.GetLinkByKey(loginProvider, providerKey);
    }

    // POST api/external-user-links
    [HttpPost]
    public async Task<OperationResult> CreateLink([FromBody] CreateExternalUserLinkModel model)
    {
        if (!ModelState.IsValid)
        {
            return new OperationResult(false, ModelStateErrors());
        }

        return await externalUserLinkService.CreateLink(model);
    }

    // DELETE api/external-user-links
    [HttpDelete]
    public async Task<OperationResult> DeleteLink([FromBody] DeleteExternalUserLinkModel model)
    {
        if (!ModelState.IsValid)
        {
            return new OperationResult(false, ModelStateErrors());
        }

        return await externalUserLinkService.DeleteLink(model);
    }

    private string ModelStateErrors()
        => string.Join(" ", ModelState.Values
            .SelectMany(v => v.Errors)
            .Select(x => x.ErrorMessage));
}
