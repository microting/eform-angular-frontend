using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using eFormAPI.Web.Integration.Tests.Security;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services
{
    /// <summary>
    /// Wire-contract guard for api/external-user-links and api/admin/get-users.
    ///
    /// The my-microting plugin (angular-my-microting-plugin, Plan 2) deserializes these
    /// payloads over HTTPS from a *different deployment* of this application. A property
    /// rename here is therefore not a compile error anywhere — it is a silent runtime
    /// failure on a customer's tenant. These assertions are the only thing standing
    /// between a harmless-looking rename and that failure.
    ///
    /// Distinct from ExternalLinkContractTests, which pins the C# property NAMES. This
    /// fixture pins the JSON NAMES actually on the wire, so a [JsonPropertyName] attribute
    /// — which leaves every assertion in that fixture green — cannot quietly rename a
    /// field the plugin binds to.
    ///
    /// Reflection rather than direct type references on purpose: the plugin never
    /// references this assembly's namespaces, and neither should this guard. The contract
    /// is the JSON, not the C# namespace.
    ///
    /// Startup.cs calls services.AddMvc(...) with no AddJsonOptions, so output uses the
    /// System.Text.Json web defaults (camelCase). JsonSerializerDefaults.Web below
    /// reproduces exactly that.
    /// </summary>
    [TestFixture]
    public class ExternalUserLinkWireContractTests
    {
        private static readonly Assembly WebAssembly = typeof(Startup).Assembly;

        private static Type FindType(string simpleName)
        {
            var matches = WebAssembly.GetTypes().Where(t => t.Name == simpleName).ToList();
            Assert.That(matches, Has.Count.EqualTo(1),
                $"expected exactly one type named {simpleName} in eFormAPI.Web, found {matches.Count}. "
                + "Plan 1 (§3.3) defines it; if it is missing, Plan 1 has not been merged.");
            return matches[0];
        }

        private static IEnumerable<string> WireNamesOf(Type type)
        {
            var instance = Activator.CreateInstance(type);
            var json = JsonSerializer.Serialize(
                instance, type, new JsonSerializerOptions(JsonSerializerDefaults.Web));
            using var doc = JsonDocument.Parse(json);
            return doc.RootElement.EnumerateObject().Select(p => p.Name)
                .OrderBy(n => n, StringComparer.Ordinal).ToList();
        }

        [Test]
        public void ProviderConstant_IsExactlyTheHostnameLiteral()
        {
            var field = FindType("ExternalLoginProviders")
                .GetField("MyMicroting", BindingFlags.Public | BindingFlags.Static);

            Assert.That(field, Is.Not.Null, "ExternalLoginProviders.MyMicroting must be a public static field");

            // GetValue rather than GetRawConstantValue: the field is `static readonly`, not
            // `const` (SonarC# S2339 — a public const bakes into every referencing assembly),
            // and GetRawConstantValue throws on a non-literal field. GetValue reads both.
            Assert.That(field!.GetValue(null), Is.EqualTo("my.microting.com"),
                "spec §4.1: the plugin's MyMicrotingLinkProvider.Name is the byte-identical literal");
        }

        [Test]
        public void ExternalUserLinkRow_WireNamesAreFrozen()
        {
            Assert.That(WireNamesOf(FindType("ExternalUserLinkRow")), Is.EquivalentTo(new[]
            {
                "email", "fullName", "isPrimaryAdmin", "loginProvider",
                "providerDisplayName", "providerKey", "role", "userId", "userName"
            }));
        }

        [Test]
        public void CreateRequest_AcceptsTheFrozenWireNames()
        {
            // The create model is bound FROM this JSON, so the assertion is that binding
            // succeeds and every value lands — not just that the names serialize back.
            var createType = WebAssembly.GetTypes().Single(t =>
                t.Namespace != null
                && t.Name.Contains("ExternalUserLink")
                && t.GetProperty("TargetUserId") != null);

            const string body = """
                {"loginProvider":"my.microting.com","providerKey":"4821",
                 "providerDisplayName":"my.microting.com | a@b.dk | linked 2026-10-15T00:00:00Z by c@d.dk",
                 "targetUserId":14}
                """;

            var bound = JsonSerializer.Deserialize(
                body, createType, new JsonSerializerOptions(JsonSerializerDefaults.Web));

            Assert.That(bound, Is.Not.Null);
            Assert.That(createType.GetProperty("LoginProvider")!.GetValue(bound), Is.EqualTo("my.microting.com"));
            Assert.That(createType.GetProperty("ProviderKey")!.GetValue(bound), Is.EqualTo("4821"));
            Assert.That(createType.GetProperty("TargetUserId")!.GetValue(bound), Is.EqualTo(14));
        }

        [Test]
        public void UserInfoViewModel_CarriesIsActive_BecauseItGatesLogin()
        {
            // EformUser.IsActive gates login in AuthService's authenticate path, so a false
            // value means the account exists and is administrable but cannot sign in. The
            // my-microting link dialog reads this payload to warn about exactly that;
            // without the property it links deactivated accounts silently.
            //
            // The property is non-nullable here because the entity always has a value,
            // and on the wire it serializes as isActive.
            // The plugin reads it as bool? because an older tenant omits the property
            // entirely, and absent must mean unknown, never deactivated.
            var property = FindType("UserInfoViewModel").GetProperty("IsActive");

            Assert.That(property, Is.Not.Null,
                "UserInfoViewModel.IsActive is required by the my-microting link dialog");
            Assert.That(property!.PropertyType, Is.EqualTo(typeof(bool)));

            Assert.That(WireNamesOf(FindType("UserInfoViewModel")), Contains.Item("isActive"));
        }

        [Test]
        public void AdminServiceIndex_ProjectsIsActiveInBothStages()
        {
            // The property existing on the DTO is not enough. AdminService.Index projects
            // twice — an anonymous type out of the SecurityGroupUsers SelectMany, then a
            // UserInfoViewModel out of that — and a flag added to only ONE stage ships as
            // `false` for every user on the roster: a grid where everybody looks
            // deactivated, with nothing failing anywhere. Omitting the anonymous stage is
            // at least a compile error; omitting the UserInfoViewModel assignment is
            // silent, which is why this guard reads the source of both.
            //
            // Anchored on content, never on line numbers.
            var source = File.ReadAllText(Path.Combine(
                    FrozenGuardBlockTests.RepoRoot(), "eFormAPI", "eFormAPI.Web", "Services", "AdminService.cs"))
                .Replace("\r\n", "\n");

            var indexAt = source.IndexOf(
                "public async Task<OperationDataResult<Paged<UserInfoViewModel>>> Index(",
                StringComparison.Ordinal);
            Assert.That(indexAt, Is.GreaterThanOrEqualTo(0), "AdminService.Index could not be located");

            var selectAt = source.IndexOf("new UserInfoViewModel", indexAt, StringComparison.Ordinal);
            Assert.That(selectAt, Is.GreaterThan(indexAt),
                "AdminService.Index no longer projects into a UserInfoViewModel");

            var anonymousStage = source[indexAt..selectAt];
            var viewModelStage = source[selectAt..];

            Assert.That(anonymousStage, Does.Contain("x.user.IsActive"),
                "AdminService.Index's anonymous SelectMany projection must carry IsActive forward");
            Assert.That(viewModelStage, Does.Contain("IsActive = x.IsActive"),
                "AdminService.Index's UserInfoViewModel select must assign IsActive — without it "
                + "every row reports false and the whole roster reads as deactivated");
        }
    }
}
