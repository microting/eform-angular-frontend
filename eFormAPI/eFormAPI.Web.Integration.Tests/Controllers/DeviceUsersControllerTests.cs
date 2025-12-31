/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S
*/

using eFormAPI.Web.Abstractions.Advanced;
using NSubstitute;
using NUnit.Framework;
using System.Threading.Tasks;

namespace eFormAPI.Web.Integration.Tests.Controllers
{
    [TestFixture]
    public class DeviceUsersControllerTests : DbTestFixture
    {
        private IDeviceUsersService _deviceUsersService;

        public override void DoSetup()
        {
            _deviceUsersService = Substitute.For<IDeviceUsersService>();
        }

        [Test]
        public async Task DeviceUsersController_InitializesCorrectly()
        {
            // Arrange & Act
            Assert.That(_deviceUsersService, Is.Not.Null);
            await Task.CompletedTask;
        }
    }
}
