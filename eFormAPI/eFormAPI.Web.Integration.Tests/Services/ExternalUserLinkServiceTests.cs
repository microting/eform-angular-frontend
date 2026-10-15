using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models.ExternalLinks;
using eFormAPI.Web.Integration.Tests.Identity;
using eFormAPI.Web.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services;

/// <summary>
/// Link CRUD against a REAL UserManager and a real UserLogins table, because the two
/// conflicts that matter are enforced by the schema: the primary key is
/// (LoginProvider, ProviderKey), and UserId cascades from Users.
/// </summary>
[TestFixture]
public class ExternalUserLinkServiceTests : DbTestFixture
{
    private const string Provider = "my.microting.com";

    private static ExternalUserLinkService BuildService(IdentityTestHost host)
    {
        var userService = Substitute.For<IUserService>();
        userService.UserId.Returns(5);

        var localizationService = Substitute.For<ILocalizationService>();
        localizationService.GetString(Arg.Any<string>()).Returns(args => args.Arg<string>());
        // GetStringWithFormat is used for the two conflict messages; echo the key so the
        // assertions below can name the rule rather than its wording.
        localizationService.GetStringWithFormat(Arg.Any<string>(), Arg.Any<object[]>())
            .Returns(args => args.Arg<string>());

        return new ExternalUserLinkService(
            host.UserManager,
            host.DbContext,
            userService,
            localizationService,
            Substitute.For<ILogger<ExternalUserLinkService>>());
    }

    private static CreateExternalUserLinkModel Create(int targetUserId, string providerKey)
        => new()
        {
            LoginProvider = Provider,
            ProviderKey = providerKey,
            ProviderDisplayName = "my.microting.com | portal@example.test | linked by rm@microting.dk",
            TargetUserId = targetUserId
        };

    [Test]
    public async Task CreateLink_ThenReadByKey_RoundTripsTheRow()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync("correct-horse");
        var service = BuildService(host);

        var created = await service.CreateLink(Create(user.Id, "4821"));
        Assert.That(created.Success, Is.True, created.Message);

        var read = await service.GetLinkByKey(Provider, "4821");
        Assert.That(read.Success, Is.True, read.Message);
        Assert.That(read.Model.UserId, Is.EqualTo(user.Id));
        Assert.That(read.Model.ProviderKey, Is.EqualTo("4821"));
        Assert.That(read.Model.LoginProvider, Is.EqualTo(Provider));
        Assert.That(read.Model.Email, Is.EqualTo(user.Email));
        Assert.That(read.Model.IsPrimaryAdmin, Is.False);
    }

    [Test]
    public async Task GetLinks_ReturnsOurProviderOnly()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync("correct-horse");
        var service = BuildService(host);
        Assert.That((await service.CreateLink(Create(user.Id, "4821"))).Success, Is.True);
        // The §2.2 correction: the schema already carries OAuth support, so a Google
        // login would write to this very table. It must not appear in our list.
        await host.AddLinkAsync(user.Id, "Google", "google-subject-123");

        var links = await service.GetLinks(Provider);

        Assert.That(links.Success, Is.True, links.Message);
        var mine = links.Model.Where(x => x.UserId == user.Id).ToList();
        Assert.That(mine.Count, Is.EqualTo(1));
        Assert.That(mine[0].ProviderKey, Is.EqualTo("4821"));
        Assert.That(links.Model.Select(x => x.LoginProvider).Distinct(), Is.EqualTo(new[] { Provider }));
    }

    /// <summary>
    /// The provider filter must run in the DATABASE, not after the rows land. An
    /// in-memory Where over an unfiltered read would satisfy GetLinks_ReturnsOurProviderOnly
    /// above while still dragging every tenant's Google rows across the wire, so this
    /// asserts the translated SQL itself.
    /// </summary>
    [Test]
    public void GetLinks_FiltersByProviderInTheDatabase()
    {
        var sql = ExternalUserLinkService.LinkRowQuery(DbContext).ToQueryString();

        Assert.That(sql, Does.Contain("WHERE"));
        Assert.That(sql, Does.Contain(Provider),
            "the provider constant must appear in the generated SQL's WHERE clause");
        Assert.That(sql, Does.Not.Contain("Google"));
    }

    /// <summary>
    /// And the KEYED read must be keyed in the database too. GetLinkByKey is on the hot
    /// path — every link-targeted password change resolves its row through it — so an
    /// in-memory FirstOrDefault over the whole-tenant list would pass
    /// CreateLink_ThenReadByKey_RoundTripsTheRow above while loading every link on the
    /// installation to return one row. The key is half the composite primary key, so in
    /// SQL it is an index seek.
    /// </summary>
    [Test]
    public void GetLinkByKey_FiltersByTheKeyInTheDatabase()
    {
        var sql = ExternalUserLinkService.LinkRowQuery(DbContext, "4821").ToQueryString();

        Assert.That(sql, Does.Contain("ProviderKey"),
            "the key must appear in the generated SQL, not be applied after the rows land");
        Assert.That(sql, Does.Contain("4821"));
        // And the provider filter is still there: a keyed read that dropped it could
        // return a Google row that happened to share the key.
        Assert.That(sql, Does.Contain(Provider));

        // The unkeyed overload must NOT carry the key filter, or GetLinks would silently
        // return one row.
        Assert.That(ExternalUserLinkService.LinkRowQuery(DbContext).ToQueryString(),
            Does.Not.Contain("4821"));
    }

    /// <summary>
    /// The collation consequence of keying in SQL, asserted rather than assumed: the
    /// UserLogins primary key collates utf8mb4_uca1400_ai_ci, so a case variant of a key
    /// is the SAME key. That has to agree with UserManager.FindByLoginAsync, which is the
    /// only way the set-password path ever resolves a target — if one of the two found a
    /// row the other did not, they would disagree about which account a key names.
    /// </summary>
    [Test]
    public async Task GetLinkByKey_AgreesWithFindByLoginAsyncOnACaseVariantOfTheKey()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync("correct-horse");
        var service = BuildService(host);
        Assert.That((await service.CreateLink(Create(user.Id, "KEY-4821"))).Success, Is.True);

        var resolvedByIdentity = await host.UserManager.FindByLoginAsync(Provider, "key-4821");
        var read = await service.GetLinkByKey(Provider, "key-4821");

        Assert.That(resolvedByIdentity?.Id, Is.EqualTo(user.Id),
            "precondition: the column's collation makes a case variant the same key");
        Assert.That(read.Success, Is.True, read.Message);
        Assert.That(read.Model.UserId, Is.EqualTo(resolvedByIdentity!.Id));
    }

    // Decision D-1: the set-password path can never reach user Id 1, so a link to it
    // would be a lie. Refuse at creation rather than create a link that reports
    // RefusedPrimaryAdmin forever.
    [Test]
    public async Task CreateLink_TargetingUserIdOne_IsRefusedWithTheDedicatedReason()
    {
        await using var host = new IdentityTestHost(DbContext);
        var service = BuildService(host);

        var result = await service.CreateLink(Create(targetUserId: 1, providerKey: "4821"));

        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("PrimaryAdminCannotBeLinked"));
        Assert.That(await host.UserManager.FindByLoginAsync(Provider, "4821"), Is.Null,
            "no row may be written for a refused link");
    }

    // Conflict (a): the primary key is (LoginProvider, ProviderKey), so one portal user
    // can be linked at most once here. Name who holds it; never overwrite implicitly.
    [Test]
    public async Task CreateLink_WithAProviderKeyAlreadyHeld_IsRefusedAndLeavesTheFirstLinkIntact()
    {
        await using var host = new IdentityTestHost(DbContext);
        var first = await host.CreateUserAsync("correct-horse");
        var second = await host.CreateUserAsync("correct-horse");
        var service = BuildService(host);
        Assert.That((await service.CreateLink(Create(first.Id, "4821"))).Success, Is.True);

        var result = await service.CreateLink(Create(second.Id, "4821"));

        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("ExternalLinkKeyAlreadyUsed"));
        var holder = await host.UserManager.FindByLoginAsync(Provider, "4821");
        Assert.That(holder!.Id, Is.EqualTo(first.Id), "the first link must be unchanged");
    }

    // Conflict (b): the schema permits one user holding two different portal keys. The
    // pre-insert read refuses it, so the downstream AmbiguousLink refusal stays a
    // last-resort safety net rather than the normal path.
    [Test]
    public async Task CreateLink_AgainstAUserThatIsAlreadyLinked_IsRefused()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync("correct-horse");
        var service = BuildService(host);
        Assert.That((await service.CreateLink(Create(user.Id, "4821"))).Success, Is.True);

        var result = await service.CreateLink(Create(user.Id, "9999"));

        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("ExternalLinkUserAlreadyLinked"));
        Assert.That(await host.UserManager.FindByLoginAsync(Provider, "9999"), Is.Null);
    }

    // A Google row on the same user is not ours, so it must not block our link.
    [Test]
    public async Task CreateLink_AgainstAUserWithOnlyAForeignProviderLink_Succeeds()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync("correct-horse");
        await host.AddLinkAsync(user.Id, "Google", "google-subject-123");
        var service = BuildService(host);

        var result = await service.CreateLink(Create(user.Id, "4821"));

        Assert.That(result.Success, Is.True, result.Message);
    }

    [Test]
    public async Task DeleteLink_RemovesTheRowAndIsIdempotent()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync("correct-horse");
        var service = BuildService(host);
        Assert.That((await service.CreateLink(Create(user.Id, "4821"))).Success, Is.True);
        var delete = new DeleteExternalUserLinkModel { LoginProvider = Provider, ProviderKey = "4821" };

        Assert.That((await service.DeleteLink(delete)).Success, Is.True);
        Assert.That(await host.UserManager.FindByLoginAsync(Provider, "4821"), Is.Null);

        // A local admin must never need my.microting.com's cooperation to detach, so a
        // second delete is a success, not an error.
        Assert.That((await service.DeleteLink(delete)).Success, Is.True);
    }

    [Test]
    public async Task GetLinkByKey_WithNoSuchLink_FailsWithoutThrowing()
    {
        await using var host = new IdentityTestHost(DbContext);
        var service = BuildService(host);

        var result = await service.GetLinkByKey(Provider, "no-such-key");

        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("ExternalLinkNotFound"));
    }

    [Test]
    public async Task EveryOperation_RefusesAnUnsupportedProvider()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync("correct-horse");
        var service = BuildService(host);

        // The REASON is asserted, not just the refusal: GetLinkByKey would otherwise
        // refuse a Google key anyway, by failing to find it among our rows, and a test
        // that accepted that would let the provider guard be deleted unnoticed.
        const string Unsupported = "UnsupportedExternalLoginProvider";

        var links = await service.GetLinks("Google");
        Assert.That(links.Success, Is.False);
        Assert.That(links.Message, Is.EqualTo(Unsupported));

        var byKey = await service.GetLinkByKey("Google", "x");
        Assert.That(byKey.Success, Is.False);
        Assert.That(byKey.Message, Is.EqualTo(Unsupported));

        var created = await service.CreateLink(new CreateExternalUserLinkModel
        {
            LoginProvider = "Google", ProviderKey = "x", TargetUserId = user.Id
        });
        Assert.That(created.Success, Is.False);
        Assert.That(created.Message, Is.EqualTo(Unsupported));

        var deleted = await service.DeleteLink(new DeleteExternalUserLinkModel
        {
            LoginProvider = "Google", ProviderKey = "x"
        });
        Assert.That(deleted.Success, Is.False);
        Assert.That(deleted.Message, Is.EqualTo(Unsupported));

        // And nothing was written under our provider by the refused create.
        Assert.That(await host.UserManager.FindByLoginAsync(Provider, "x"), Is.Null);
    }

    [Test]
    public async Task CreateLink_TruncatesTheDisplayNameTo512Characters()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync("correct-horse");
        var service = BuildService(host);
        var model = Create(user.Id, "4821");
        model.ProviderDisplayName = new string('x', 900);

        Assert.That((await service.CreateLink(model)).Success, Is.True);

        var read = await service.GetLinkByKey(Provider, "4821");
        Assert.That(read.Model.ProviderDisplayName.Length, Is.EqualTo(512));
    }

    [Test]
    public async Task CreateLink_WithAnUnknownTargetUser_IsRefused()
    {
        await using var host = new IdentityTestHost(DbContext);
        var service = BuildService(host);

        var result = await service.CreateLink(Create(targetUserId: 2147483000, providerKey: "4821"));

        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("UserNotFound"));
    }

    [Test]
    public async Task CreateLink_WithABlankProviderKey_IsRefused()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync("correct-horse");
        var service = BuildService(host);

        var result = await service.CreateLink(Create(user.Id, "   "));

        Assert.That(result.Success, Is.False);
        Assert.That(result.Message, Is.EqualTo("ExternalLinkProviderKeyRequired"));
    }
}
