/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S
*/

using System.Reflection;
using eFormAPI.Web.Controllers;
using Microsoft.AspNetCore.Authorization;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Controllers
{
    [TestFixture]
    public class TranslationControllerTests
    {
        // Both endpoints call Google Translate with the host's API key, so only
        // signed-in users may reach them. There is no global fallback policy:
        // the class-level attribute is the only thing enforcing it.
        [Test]
        public void TranslationController_RequiresAuthentication()
        {
            var controller = typeof(TranslationController);

            Assert.That(controller.GetCustomAttribute<AuthorizeAttribute>(), Is.Not.Null);
            Assert.That(controller.GetCustomAttribute<AllowAnonymousAttribute>(), Is.Null);
            foreach (var action in controller.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly))
            {
                Assert.That(action.GetCustomAttribute<AllowAnonymousAttribute>(), Is.Null,
                    $"{action.Name} must not be reachable without authentication");
            }
        }

        [TestCase("/api-key=x", "/api-key=***")]
        [TestCase("--private_key=x", "--private_key=***")]
        [TestCase("/ConnectionString=host=db;port=3306;", "/ConnectionString=***")]
        [TestCase("/Token=x", "/Token=***")]
        [TestCase("/Password=x", "/Password=***")]
        [TestCase("--client_secret=x", "--client_secret=***")]
        [TestCase("--port=5000", "--port=5000")]
        [TestCase("no-separator", "no-separator")]
        public void RedactSecretArgs_HidesSecretValues(string arg, string expected)
        {
            Assert.That(Program.RedactSecretArgs([arg]), Is.EqualTo(new[] { expected }));
        }

        [Test]
        public void RedactSecretArgs_HidesValuePassedAsSeparateToken()
        {
            string[] args = ["--api-key", "x", "--ConnectionString", "host=db;port=3306;", "--port", "5000"];

            Assert.That(Program.RedactSecretArgs(args),
                Is.EqualTo(new[] { "--api-key", "***", "--ConnectionString", "***", "--port", "5000" }));
        }
    }
}
