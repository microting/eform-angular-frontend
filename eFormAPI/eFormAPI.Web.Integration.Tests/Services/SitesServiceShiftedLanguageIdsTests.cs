using System.Threading.Tasks;
using eFormAPI.Web.Services;
using Microting.eForm.Infrastructure;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services;

/// <summary>
/// Issue #8141: on a Galera tenant Dansk has Languages.Id 3 and there is no row with id 1, so
/// "no language set, use Danish" must find Danish by LanguageCode, not by id 1.
/// </summary>
[TestFixture]
public class SitesServiceShiftedLanguageIdsTests
{
    private static readonly string ConnectionString =
        ShiftedLookupIdsSdkDatabase.ConnectionStringFor("eform-8141-sites-tests");

    private MicrotingDbContext _sdkDbContext;

    [OneTimeSetUp]
    public Task CreateShiftedSdkDatabase() => ShiftedLookupIdsSdkDatabase.CreateAsync(ConnectionString);

    [SetUp]
    public void Setup() => _sdkDbContext = ShiftedLookupIdsSdkDatabase.Open(ConnectionString);

    [TearDown]
    public async Task TearDown() => await _sdkDbContext.DisposeAsync();

    [Test]
    public async Task FindSiteLanguage_SiteWithoutLanguage_FallsBackToDanish()
    {
        var language = await SitesService.FindSiteLanguage(_sdkDbContext, 0);

        Assert.That(language.LanguageCode, Is.EqualTo("da"));
    }

    [Test]
    public async Task FindSiteLanguage_SiteWithLanguage_ReturnsThatLanguage()
    {
        var language = await SitesService.FindSiteLanguage(_sdkDbContext,
            ShiftedLookupIdsSdkDatabase.GermanLanguageId);

        Assert.That(language.LanguageCode, Is.EqualTo("de-DE"));
    }
}
