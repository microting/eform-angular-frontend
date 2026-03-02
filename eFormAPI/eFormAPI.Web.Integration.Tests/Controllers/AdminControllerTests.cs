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
    public class AdminControllerTests : DbTestFixture
    {
        private IAdminService _adminService;

        public override void DoSetup()
        {
            _adminService = Substitute.For<IAdminService>();
        }

        [Test]
        public async Task AdminController_InitializesCorrectly()
        {
            // Arrange & Act
            Assert.That(_adminService, Is.Not.Null);
            await Task.CompletedTask;
        }
    }
}
