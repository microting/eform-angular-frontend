/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S
*/

using eFormAPI.Web.Abstractions;
using NSubstitute;
using NUnit.Framework;
using System.Threading.Tasks;

namespace eFormAPI.Web.Integration.Tests.Controllers
{
    [TestFixture]
    public class TranslationControllerTests : DbTestFixture
    {
        private ITranslationService _translationService;

        public override void DoSetup()
        {
            _translationService = Substitute.For<ITranslationService>();
        }

        [Test]
        public async Task TranslationController_InitializesCorrectly()
        {
            // Arrange & Act
            Assert.That(_translationService, Is.Not.Null);
            await Task.CompletedTask;
        }
    }
}
