using System;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace eFormAPI.Web.Infrastructure.Models.DelegatedAccess;

/// <summary>
/// Pure normalisers for the advisor-profile claims the portal sends. Every method returns
/// "" for anything it does not recognise: a profile claim is a nicety, never a reason to
/// refuse a sign-in.
///
/// Public rather than internal only so the test assembly can reach it; the project has no
/// InternalsVisibleTo.
/// </summary>
public static class DelegatedProfile
{
    private const string DefaultFormats = "de-DE";

    // Case-sensitive on the language subtag on purpose: it is what makes "Danish", "DA" and
    // "Da" fail while "da" and "en-US" pass. Anchored with \z, not $, because $ also
    // matches before a trailing newline. The pattern itself bounds the length (max 7).
    private static readonly Regex LocalePattern = new(
        @"^[a-z]{2}(-[A-Za-z]{2,4})?\z", RegexOptions.CultureInvariant, TimeSpan.FromMilliseconds(100));

    private static readonly string[] FormatLocales = ["da", "de-DE", "en-GB", "en-US"];

    /// <summary>Trim, cap at <paramref name="maxChars"/>, replace control characters with
    /// a space, trim again.</summary>
    public static string Clean(string value, int maxChars)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return "";
        }

        var trimmed = value.Trim();
        if (trimmed.Length > maxChars)
        {
            trimmed = trimmed[..maxChars];
        }

        var builder = new StringBuilder(trimmed.Length);
        foreach (var c in trimmed)
        {
            builder.Append(char.IsControl(c) ? ' ' : c);
        }

        return builder.ToString().Trim();
    }

    /// <summary>
    /// Shape validation of an ngx-translate language id, not an allowlist: the claim only
    /// originates from the portal's own EformUser.Locale, and a C# allowlist would need a
    /// cross-language sync test that rots. A well-formed id with no translations yields an
    /// English-ish UI, not a broken session.
    /// </summary>
    public static string NormaliseLocale(string raw)
    {
        if (string.IsNullOrEmpty(raw))
        {
            return "";
        }

        return LocalePattern.IsMatch(raw) ? raw : "";
    }

    public static string NormaliseTheme(string raw)
    {
        var lowered = (raw ?? "").Trim().ToLowerInvariant();

        return lowered is "light" or "dark" ? lowered : "";
    }

    public static string NormaliseTimeZone(string raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            return "";
        }

        try
        {
            TimeZoneInfo.FindSystemTimeZoneById(raw);

            return raw;
        }
        catch (Exception)
        {
            return "";
        }
    }

    /// <summary>The Formats-list id for a locale, falling back to the host's default.</summary>
    public static string FormatsForLocale(string locale)
        => FormatLocales.Contains(locale) ? locale : DefaultFormats;
}
