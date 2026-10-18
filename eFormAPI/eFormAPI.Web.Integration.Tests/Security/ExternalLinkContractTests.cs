using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using eFormAPI.Web.Infrastructure.Models.ExternalLinks;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Security;

// The contract the plugin is written against. Each assertion here is a promise Parts 2
// and 3 rely on; changing one of them is a breaking change to a separate repo.
[TestFixture]
public class ExternalLinkContractTests
{
    // The plugin holds a byte-identical copy of this literal. Changing it orphans every
    // link row already written on every tenant.
    [Test]
    public void TheProviderConstantIsExactlyTheHostname()
        => Assert.That(ExternalLoginProviders.MyMicroting, Is.EqualTo("my.microting.com"));

    // A hostname cannot collide with an authentication SCHEME name, which is what a
    // future OAuth login on the same UserLogins table would use.
    [Test]
    public void TheProviderConstantCannotCollideWithAnAuthenticationScheme()
        => Assert.That(new[] { "Google", "Facebook", "OpenIdConnect", "Identity.Application" },
            Has.None.EqualTo(ExternalLoginProviders.MyMicroting));

    // The UserLogins primary key collates utf8mb4_uca1400_ai_ci, so case variants ARE the
    // same key. IsSupported must therefore accept them rather than reject a row the
    // database would happily match.
    [Test]
    public void IsSupported_IsCaseInsensitiveAndRejectsEverythingElse()
    {
        Assert.That(ExternalLoginProviders.IsSupported("my.microting.com"), Is.True);
        Assert.That(ExternalLoginProviders.IsSupported("My.Microting.Com"), Is.True);
        Assert.That(ExternalLoginProviders.IsSupported("Google"), Is.False);
        Assert.That(ExternalLoginProviders.IsSupported(""), Is.False);
        Assert.That(ExternalLoginProviders.IsSupported(null), Is.False);
    }

    // The plugin maps these six names onto its own TenantPasswordResult.Outcome. Adding,
    // renaming or reordering one needs a matching plugin change.
    [Test]
    public void TheOutcomeEnumHasExactlyTheSixSpecifiedMembers()
        => Assert.That(Enum.GetNames<SetLinkedPasswordOutcome>(), Is.EqualTo(new[]
        {
            "Changed", "NoLink", "AmbiguousLink",
            "RefusedPrimaryAdmin", "RefusedByPolicy", "PasswordRejected"
        }));

    // The endpoint must be incapable of naming a user. If an Email or a UserId property
    // ever appears on the request, the wrong-person failure becomes possible again.
    [Test]
    public void TheRequestModelCannotNameAUser()
    {
        var properties = typeof(SetLinkedAccountPasswordModel).GetProperties()
            .Select(p => p.Name).ToArray();

        Assert.That(properties,
            Is.EquivalentTo(new[] { "LoginProvider", "ProviderKey", "NewPassword" }));
        Assert.That(properties, Has.None.Contains("Email"));
        Assert.That(properties, Has.None.Contains("UserId"));
    }

    // The UserLogins.ProviderKey column is varchar(255) with the PAD SPACE,
    // accent-insensitive utf8mb4_uca1400_ai_ci collation, so "4821 " compares EQUAL to
    // "4821" in the database. That resolves to the RIGHT row today, because the key is a
    // decimal portal user id — but the correctness of the lookup must not rest on a
    // collation detail. These cases are refused at the model layer instead, before any
    // lookup happens.
    [TestCase("4821", true, TestName = "ProviderKeyValidation_PlainDecimalKeyIsAccepted")]
    [TestCase("1", true, TestName = "ProviderKeyValidation_SingleDigitIsAccepted")]
    [TestCase("4821 ", false, TestName = "ProviderKeyValidation_TrailingSpaceIsRefused")]
    [TestCase(" 4821", false, TestName = "ProviderKeyValidation_LeadingSpaceIsRefused")]
    [TestCase("48 21", false, TestName = "ProviderKeyValidation_InnerSpaceIsRefused")]
    [TestCase("ABC", false, TestName = "ProviderKeyValidation_LettersAreRefused")]
    [TestCase("48-21", false, TestName = "ProviderKeyValidation_PunctuationIsRefused")]
    [TestCase("", false, TestName = "ProviderKeyValidation_EmptyIsRefused")]
    [TestCase("   ", false, TestName = "ProviderKeyValidation_WhitespaceIsRefused")]
    [TestCase(null, false, TestName = "ProviderKeyValidation_NullIsRefused")]
    public void TheProviderKeyIsBoundedAndDecimalOnTheWritingModels(string providerKey, bool valid)
    {
        var setPassword = new SetLinkedAccountPasswordModel
        {
            LoginProvider = ExternalLoginProviders.MyMicroting,
            ProviderKey = providerKey,
            NewPassword = "correct-horse"
        };
        var create = new CreateExternalUserLinkModel
        {
            LoginProvider = ExternalLoginProviders.MyMicroting,
            ProviderKey = providerKey,
            TargetUserId = 7
        };

        Assert.That(IsValid(setPassword), Is.EqualTo(valid),
            $"SetLinkedAccountPasswordModel must {(valid ? "accept" : "refuse")} '{providerKey}'");
        Assert.That(IsValid(create), Is.EqualTo(valid),
            $"CreateExternalUserLinkModel must {(valid ? "accept" : "refuse")} '{providerKey}'");
    }

    // The column is varchar(255), and a longer value is not a conflict, a miss or a
    // refusal — under STRICT_TRANS_TABLES it is MariaDB error 1406 at insert time. Refuse
    // it at the model layer so the write is never attempted.
    [Test]
    public void AProviderKeyLongerThanTheColumnIsRefusedOnEveryModel()
    {
        var tooLong = new string('9', 256);
        var atTheLimit = new string('9', 255);

        Assert.That(IsValid(new SetLinkedAccountPasswordModel
        {
            LoginProvider = ExternalLoginProviders.MyMicroting,
            ProviderKey = tooLong,
            NewPassword = "correct-horse"
        }), Is.False);
        Assert.That(IsValid(new CreateExternalUserLinkModel
        {
            LoginProvider = ExternalLoginProviders.MyMicroting,
            ProviderKey = tooLong,
            TargetUserId = 7
        }), Is.False);
        Assert.That(IsValid(new DeleteExternalUserLinkModel
        {
            LoginProvider = ExternalLoginProviders.MyMicroting,
            ProviderKey = tooLong
        }), Is.False);

        Assert.That(IsValid(new DeleteExternalUserLinkModel
        {
            LoginProvider = ExternalLoginProviders.MyMicroting,
            ProviderKey = atTheLimit
        }), Is.True, "255 characters is the column width, not one over it");
    }

    // Delete is bounded but deliberately NOT shaped: a row written out of band, or before
    // the decimal rule existed, must still be removable. Unlinking is the operation that
    // may never require anyone's cooperation, so it may not be the one validation blocks.
    [Test]
    public void DeleteAcceptsANonDecimalKeySoAStrayRowCanAlwaysBeDetached()
        => Assert.That(IsValid(new DeleteExternalUserLinkModel
        {
            LoginProvider = ExternalLoginProviders.MyMicroting,
            ProviderKey = "legacy-key-ABC"
        }), Is.True);

    private static bool IsValid(object model)
        => Validator.TryValidateObject(
            model, new ValidationContext(model), new List<ValidationResult>(),
            validateAllProperties: true);

    [Test]
    public void TheResultModelCarriesTheResolvedTarget()
    {
        var properties = typeof(SetLinkedPasswordResult).GetProperties()
            .Select(p => p.Name).ToArray();

        Assert.That(properties, Is.EquivalentTo(new[]
            { "Outcome", "TargetUserId", "TargetEmail", "TargetIsActive", "Detail" }));
    }

    // Deviation D-F: EformUser.IsActive is a LOGIN gate added upstream, and no password
    // path consults it. TargetIsActive is reported so a caller can say "password set, but
    // this account's login is disabled" instead of a flat success - it is informational
    // and must stay nullable, because NoLink resolves no account at all.
    [Test]
    public void TargetIsActiveIsNullableAndInformationalOnly()
    {
        var property = typeof(SetLinkedPasswordResult).GetProperty("TargetIsActive")!;

        Assert.That(property.PropertyType, Is.EqualTo(typeof(bool?)),
            "null when no account was resolved");
    }

    [Test]
    public void TheLinkRowCarriesEverythingTheLinkDialogShows()
    {
        var properties = typeof(ExternalUserLinkRow).GetProperties()
            .Select(p => p.Name).ToArray();

        Assert.That(properties, Is.EquivalentTo(new[]
        {
            "LoginProvider", "ProviderKey", "ProviderDisplayName",
            "UserId", "UserName", "Email", "FullName", "Role", "IsPrimaryAdmin"
        }));
    }

    // Enums cross this wire as INTEGERS: no JsonStringEnumConverter is registered on the
    // host, so the plugin deserializes the ordinal, not the name. The name test above
    // pins the ORDER; this one pins the NUMBERS the plugin actually reads, so an inserted
    // member cannot renumber a refusal into a success without turning this red.
    [Test]
    public void TheOutcomeOrdinalsAreTheWireContract()
    {
        Assert.That((int)SetLinkedPasswordOutcome.Changed, Is.EqualTo(0));
        Assert.That((int)SetLinkedPasswordOutcome.NoLink, Is.EqualTo(1));
        Assert.That((int)SetLinkedPasswordOutcome.AmbiguousLink, Is.EqualTo(2));
        Assert.That((int)SetLinkedPasswordOutcome.RefusedPrimaryAdmin, Is.EqualTo(3));
        Assert.That((int)SetLinkedPasswordOutcome.RefusedByPolicy, Is.EqualTo(4));
        Assert.That((int)SetLinkedPasswordOutcome.PasswordRejected, Is.EqualTo(5));
    }

    // Every refusal this feature can render. Only 2 of the 25 SharedResource files carry
    // the password-guard keys - the other 23 locales fall back to the key name - so these
    // two are the whole localization contract, and a key missing from either one surfaces
    // to an operator as a raw identifier instead of a sentence.
    [TestCase("SharedResource.resx")]
    [TestCase("SharedResource.da.resx")]
    public void EveryExternalLinkKeyIsPresentInTheResourceFile(string fileName)
    {
        var resx = File.ReadAllText(Path.Combine(
            FrozenGuardBlockTests.RepoRoot(), "eFormAPI", "eFormAPI.Web", "Resources", fileName));

        string[] keys =
        {
            "UnsupportedExternalLoginProvider", "ExternalLinkProviderKeyRequired",
            "PrimaryAdminCannotBeLinked", "ExternalLinkKeyAlreadyUsed",
            "ExternalLinkUserAlreadyLinked", "ExternalLinkCreated", "ExternalLinkRemoved",
            "ExternalLinkNotFound", "NoLinkedAccountForProviderKey", "AmbiguousExternalLink"
        };

        foreach (var key in keys)
        {
            Assert.That(resx, Does.Contain($"<data name=\"{key}\" xml:space=\"preserve\">"),
                $"{fileName} is missing the {key} string");
        }
    }
}
