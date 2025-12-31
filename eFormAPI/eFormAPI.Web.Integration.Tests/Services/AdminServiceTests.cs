/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using NUnit.Framework;
using eFormAPI.Web.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Microting.eFormApi.BasePn.Abstractions;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microsoft.AspNetCore.Identity;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using eFormAPI.Web.Abstractions;

namespace eFormAPI.Web.Integration.Tests.Services
{
    [TestFixture]
    public class AdminServiceTests : DbTestFixture
    {
        private Mock<ILogger<AdminService>> _logger;
        private Mock<UserManager<EformUser>> _userManager;
        private Mock<IDbOptions<ApplicationSettings>> _appSettings;
        private Mock<IUserService> _userService;
        private Mock<ILocalizationService> _localizationService;
        private Mock<IEFormCoreService> _coreHelper;
        private AdminService _adminService;

        public override void DoSetup()
        {
            _logger = new Mock<ILogger<AdminService>>();
            var store = new Mock<IUserStore<EformUser>>();
            _userManager = new Mock<UserManager<EformUser>>(store.Object, null, null, null, null, null, null, null, null);
            _appSettings = new Mock<IDbOptions<ApplicationSettings>>();
            _userService = new Mock<IUserService>();
            _localizationService = new Mock<ILocalizationService>();
            _coreHelper = new Mock<IEFormCoreService>();

            _localizationService.Setup(x => x.GetString(It.IsAny<string>()))
                .Returns((string key) => key);

            _appSettings.Setup(x => x.Value).Returns(new ApplicationSettings());

            _adminService = new AdminService(
                _logger.Object,
                _userManager.Object,
                _appSettings.Object,
                _userService.Object,
                _localizationService.Object,
                DbContext,
                _coreHelper.Object);
        }

        [Test]
        public void AdminService_InitializesCorrectly()
        {
            // Assert
            Assert.That(_adminService, Is.Not.Null);
        }
    }
}
