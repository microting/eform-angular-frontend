using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Controllers;
using eFormAPI.Web.Infrastructure.Models.ExternalLinks;
using eFormAPI.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Security;

/// <summary>
/// Who may reach the link endpoints, and — just as load-bearing — that they are reachable
/// at all in the way the capability probe depends on.
///
/// The probe: UseAngularMiddleware rewrites ANY extension-less 404 into 200 text/html
/// (Hosting/Extensions/ApplicationBuilderExtensions.cs, registered last in Startup.cs,
/// with wwwroot populated by the Dockerfile), so on a deployed tenant "this route does not
/// exist" reads as 404 OR 200-with-HTML. An existing-but-unauthorised route answers 401 or
/// 403, and an authorised one answers 200 application/json - and the middleware touches
/// none of those, because it only ever rewrites a 404.
///
/// That distinction is what Plan 3's version gate reads, on every tenant. It breaks the
/// moment an action becomes anonymous, hidden, routed somewhere other than
/// api/external-user-links, or changes its return type to something that can render a
/// view - hence the assertions below.
/// </summary>
[TestFixture]
public class ExternalUserLinksAuthorizationTests
{
    private static MethodInfo Action(string name)
        => typeof(ExternalUserLinksController).GetMethod(name)
           ?? throw new AssertionException($"ExternalUserLinksController.{name} is missing");

    // Admin-only DELIBERATELY, not SetOtherUsersPassword: creating a link grants a
    // STANDING cross-installation capability over that account, which is a bigger
    // decision than one password reset and should require the top role. The GET is
    // admin-only too, because the list is a map of which accounts a third party can reach.
    [Test]
    public void TheWholeControllerIsAdminOnly()
    {
        var authorize = typeof(ExternalUserLinksController)
            .GetCustomAttributes<AuthorizeAttribute>().ToList();

        Assert.That(authorize.Select(a => a.Roles), Does.Contain(EformRole.Admin));
        Assert.That(typeof(ExternalUserLinksController).GetCustomAttribute<AllowAnonymousAttribute>(),
            Is.Null, "an [AllowAnonymous] on the class would bypass the role on every action");
    }

    [TestCase("GetLinks")]
    [TestCase("GetLinkByKey")]
    [TestCase("CreateLink")]
    [TestCase("DeleteLink")]
    public void NoActionIsAnonymousOrHidden(string actionName)
    {
        var action = Action(actionName);

        Assert.That(action.GetCustomAttribute<AllowAnonymousAttribute>(), Is.Null,
            "an anonymous action would both bypass the role and answer the probe wrongly");
        var apiExplorer = action.GetCustomAttribute<ApiExplorerSettingsAttribute>();
        Assert.That(apiExplorer?.IgnoreApi, Is.Not.True);
    }

    // And the same, one level up: [ApiExplorerSettings(IgnoreApi = true)] on the CLASS
    // hides every action at once, which the per-action check above would not see.
    [Test]
    public void TheControllerItselfIsNotHiddenFromTheApiExplorer()
    {
        var apiExplorer = typeof(ExternalUserLinksController)
            .GetCustomAttribute<ApiExplorerSettingsAttribute>();

        Assert.That(apiExplorer?.IgnoreApi, Is.Not.True);
    }

    // The exact routes the plugin is coded against, and the exact route the probe hits.
    [Test]
    public void TheRoutesAreExactlyTheOnesTheProbeAndThePluginUse()
    {
        Assert.That(typeof(ExternalUserLinksController)
            .GetCustomAttribute<RouteAttribute>()!.Template,
            Is.EqualTo("api/external-user-links"));

        Assert.That(Action("GetLinks").GetCustomAttribute<HttpGetAttribute>()!.Template,
            Is.Null.Or.Empty, "GET api/external-user-links is the probe target");
        Assert.That(Action("GetLinkByKey").GetCustomAttribute<HttpGetAttribute>()!.Template,
            Is.EqualTo("by-key"));
        Assert.That(Action("CreateLink").GetCustomAttribute<HttpPostAttribute>()!.Template,
            Is.Null.Or.Empty);
        Assert.That(Action("DeleteLink").GetCustomAttribute<HttpDeleteAttribute>()!.Template,
            Is.Null.Or.Empty);
    }

    /// <summary>
    /// loginProvider MUST stay in the query string, never in the route template.
    /// UseAngularMiddleware's rewrite decision is Path.HasExtension(request.Path) and the
    /// provider value is "my.microting.com", so a template of
    /// api/external-user-links/{loginProvider} would make ".com" read as a file extension
    /// and change what an UN-upgraded tenant answers from 200 text/html to a bare 404.
    /// Both verdicts still mean "not upgraded" today, but it silently changes the evidence
    /// Plan 3 reads, so pin it: no action here may carry a route parameter at all.
    /// </summary>
    [TestCase("GetLinks")]
    [TestCase("GetLinkByKey")]
    [TestCase("CreateLink")]
    [TestCase("DeleteLink")]
    public void NoRouteTemplateCarriesAParameter(string actionName)
    {
        var templates = Action(actionName).GetCustomAttributes<RouteAttribute>()
            .Select(x => x.Template)
            .Concat(Action(actionName).GetCustomAttributes<HttpMethodAttribute>()
                .Select(x => x.Template))
            .Where(x => !string.IsNullOrEmpty(x));

        foreach (var template in templates)
        {
            Assert.That(template, Does.Not.Contain("{"),
                $"{actionName}: a route parameter would put a value such as "
                + "\"my.microting.com\" in the PATH, which changes Path.HasExtension and "
                + "therefore the un-upgraded tenant's response the probe reads");
        }
    }

    /// <summary>
    /// The third independent reason the probe can never read HTML from these routes: every
    /// action returns an OperationResult-shaped POCO, which the JSON formatter serialises.
    /// An action returning IActionResult/ActionResult could return a ViewResult - 200
    /// text/html - which the gate would read as "tenant not upgraded" on every tenant at
    /// once, with nothing failing anywhere.
    /// </summary>
    [Test]
    public void EveryActionReturnsAJsonSerialisedResultRatherThanAnIActionResult()
    {
        Assert.That(Action("GetLinks").ReturnType,
            Is.EqualTo(typeof(Task<OperationDataResult<List<ExternalUserLinkRow>>>)));
        Assert.That(Action("GetLinkByKey").ReturnType,
            Is.EqualTo(typeof(Task<OperationDataResult<ExternalUserLinkRow>>)));
        Assert.That(Action("CreateLink").ReturnType, Is.EqualTo(typeof(Task<OperationResult>)));
        Assert.That(Action("DeleteLink").ReturnType, Is.EqualTo(typeof(Task<OperationResult>)));
    }

    // A route that exists but whose service cannot be resolved answers 500, not 401, and
    // the probe would read that as "deployed" while every real call failed.
    [Test]
    public void TheLinkServiceIsRegisteredForTheController()
    {
        var services = new ServiceCollection();
        services.AddScoped<IExternalUserLinkService, ExternalUserLinkService>();

        var descriptor = services.Single(x => x.ServiceType == typeof(IExternalUserLinkService));
        Assert.That(descriptor.ImplementationType, Is.EqualTo(typeof(ExternalUserLinkService)));
        Assert.That(descriptor.Lifetime, Is.EqualTo(ServiceLifetime.Scoped),
            "scoped, like IAccountService — it holds a DbContext and a UserManager");
    }

    // Reads the real Startup.cs, because the test above only proves the registration is
    // POSSIBLE. This proves it actually happened.
    //
    // The exact text matters twice over: it is also the ONE line the login-path fence
    // excuses in Startup.cs (.github/scripts/check-login-path-fence.sh, ALLOWED_LINE),
    // anchored through end-of-line. Reformatting it turns CI red.
    [Test]
    public void StartupRegistersTheLinkService()
    {
        var startup = System.IO.File.ReadAllText(
            System.IO.Path.Combine(RepoRoot(), "eFormAPI", "eFormAPI.Web", "Startup.cs"));

        Assert.That(startup,
            Does.Contain("services.AddScoped<IExternalUserLinkService, ExternalUserLinkService>();"));
    }

    internal static string RepoRoot()
    {
        var dir = new System.IO.DirectoryInfo(TestContext.CurrentContext.TestDirectory);
        while (dir != null && !System.IO.Directory.Exists(
                   System.IO.Path.Combine(dir.FullName, "eFormAPI", "eFormAPI.Web")))
        {
            dir = dir.Parent;
        }

        Assert.That(dir, Is.Not.Null, "could not locate the repository root from the test directory");
        return dir!.FullName;
    }
}
