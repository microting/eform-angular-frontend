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
    public class PluginsManagementControllerTests : DbTestFixture
    {
        private IPluginsManagementService _pluginsManagementService;

        public override void DoSetup()
        {
            _pluginsManagementService = Substitute.For<IPluginsManagementService>();
        }

        [Test]
        public async Task PluginsManagementController_InitializesCorrectly()
        {
            // Arrange & Act
            Assert.That(_pluginsManagementService, Is.Not.Null);
            await Task.CompletedTask;
        }
    }
}
