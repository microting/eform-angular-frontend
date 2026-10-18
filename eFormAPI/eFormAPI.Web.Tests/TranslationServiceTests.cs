using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using eFormAPI.Web.Infrastructure.Models;
using NUnit.Framework;
using eFormAPI.Web.Services;

namespace eFormAPI.Web.Tests;

[TestFixture]
public class TranslationServiceTests
{
    [Test]
    public void BuildTranslateRequest_NormalisesLocaleToIso_AndEncodesText()
    {
        var (url, form) = TranslationService.BuildTranslateRequest("Tank 4", "da", "de-DE", "realkey");

        // Google Translate v2 rejects locale codes — must be bare ISO.
        Assert.That(form["target"], Is.EqualTo("de"), "de-DE must normalise to de");
        Assert.That(form["source"], Is.EqualTo("da"));
        Assert.That(form["q"], Is.EqualTo("Tank 4"));
        Assert.That(url, Does.Contain("key=realkey"));

        // FormUrlEncodedContent URL-encodes the body — a space becomes '+'.
        var encoded = new FormUrlEncodedContent(form).ReadAsStringAsync().Result;
        Assert.That(encoded, Does.Contain("q=Tank+4"));
        Assert.That(encoded, Does.Contain("target=de"));
    }

    [TestCase(null)]
    [TestCase("")]
    public async Task TranslateText_WithoutApiKey_IsNotConfigured_AndFailsWithoutCallingGoogle(string apiKey)
    {
        var service = new TranslationService(Options.Create(new GoogleTranslateOptions { ApiKey = apiKey }));

        Assert.That(service.IsConfigured, Is.False);
        var result = await service.TranslateText("Tank 4", "da", "en-US");
        Assert.That(result.Success, Is.False);
    }

    [Test]
    public void IsConfigured_WithApiKey_IsTrue()
    {
        var service = new TranslationService(Options.Create(new GoogleTranslateOptions { ApiKey = "realkey" }));

        Assert.That(service.IsConfigured, Is.True);
    }
}
