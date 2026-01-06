/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S
*/

using eFormAPI.Web.Abstractions.Advanced;
using NSubstitute;
using NUnit.Framework;
using System.Threading.Tasks;

namespace eFormAPI.Web.Integration.Tests.Controllers.Advanced
{
    [TestFixture]
    public class SitesControllerTests : DbTestFixture
    {
        private ISitesService _sitesService;

        public override void DoSetup()
        {
            _sitesService = Substitute.For<ISitesService>();
        }

        [Test]
        public async Task SitesController_InitializesCorrectly()
        {
            // Arrange & Act
            Assert.That(_sitesService, Is.Not.Null);
            await Task.CompletedTask;
        }
    }
}
