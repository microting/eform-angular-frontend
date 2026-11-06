using eFormAPI.Web.Infrastructure.Models.DelegatedAccess;
using NUnit.Framework;

namespace eFormAPI.Web.Tests;

[TestFixture]
public class DelegatedProfileTests
{
    [TestCase("light", "light")]
    [TestCase("dark", "dark")]
    [TestCase("DARK", "dark")]
    [TestCase("system", "")]
    [TestCase("true", "")]
    [TestCase("", "")]
    [TestCase(null, "")]
    public void NormaliseTheme_AcceptsOnlyLightAndDark(string raw, string expected)
        => Assert.That(DelegatedProfile.NormaliseTheme(raw), Is.EqualTo(expected));

    [TestCase("da", "da")]
    [TestCase("en-US", "en-US")]
    [TestCase("de-DE", "de-DE")]
    [TestCase("uk-UA", "uk-UA")]
    [TestCase("xx-XX", "xx-XX")] // well-formed: passed through, the UI falls back
    [TestCase("da; DROP TABLE", "")]
    [TestCase("../../etc/passwd", "")]
    [TestCase("Danish", "")] // the menu-translation domain, not a language id
    [TestCase("DA", "")] // language subtag is case-sensitive
    [TestCase("Da", "")]
    [TestCase("da\n", "")] // $ would accept a trailing newline
    [TestCase("da ", "")]
    [TestCase("", "")]
    [TestCase(null, "")]
    public void NormaliseLocale_AcceptsOnlyWellFormedLanguageIds(string raw, string expected)
        => Assert.That(DelegatedProfile.NormaliseLocale(raw), Is.EqualTo(expected));

    [TestCase("Europe/Copenhagen", "Europe/Copenhagen")]
    [TestCase("Not/AZone", "")]
    [TestCase("", "")]
    [TestCase(null, "")]
    public void NormaliseTimeZone_AcceptsOnlyAResolvableZone(string raw, string expected)
        => Assert.That(DelegatedProfile.NormaliseTimeZone(raw), Is.EqualTo(expected));

    [TestCase("da", "da")]
    [TestCase("de-DE", "de-DE")]
    [TestCase("en-GB", "en-GB")]
    [TestCase("en-US", "en-US")]
    [TestCase("uk-UA", "de-DE")] // a language the Formats list does not offer
    [TestCase("", "de-DE")]
    public void FormatsForLocale_FallsBackToTheHostsDefault(string locale, string expected)
        => Assert.That(DelegatedProfile.FormatsForLocale(locale), Is.EqualTo(expected));

    [Test]
    public void Clean_TrimsCapsAndStripsControlCharacters()
    {
        Assert.Multiple(() =>
        {
            Assert.That(DelegatedProfile.Clean("  Sara Vest  ", 128), Is.EqualTo("Sara Vest"));
            Assert.That(DelegatedProfile.Clean(new string('A', 200), 128), Has.Length.EqualTo(128));
            Assert.That(DelegatedProfile.Clean("Go\u0007Gris", 128), Does.Not.Contain('\u0007'));
            Assert.That(DelegatedProfile.Clean(null, 128), Is.EqualTo(""));
        });
    }
}
