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
using NSubstitute;
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
        private ILogger<AdminService> _logger;
#pragma warning disable NUnit1032
        private UserManager<EformUser> _userManager;
#pragma warning restore NUnit1032
        private IDbOptions<ApplicationSettings> _appSettings;
        private IUserService _userService;
        private ILocalizationService _localizationService;
        private IEFormCoreService _coreHelper;
        private AdminService _adminService;

        public override void DoSetup()
        {
            _logger = Substitute.For<ILogger<AdminService>>();
            var store = Substitute.For<IUserStore<EformUser>>();
            _userManager = Substitute.For<UserManager<EformUser>>(store, null, null, null, null, null, null, null, null);
            _appSettings = Substitute.For<IDbOptions<ApplicationSettings>>();
            _userService = Substitute.For<IUserService>();
            _localizationService = Substitute.For<ILocalizationService>();
            _coreHelper = Substitute.For<IEFormCoreService>();

            _localizationService.GetString(Arg.Any<string>())
                .Returns(args => args.Arg<string>());

            _appSettings.Value.Returns(new ApplicationSettings());

            _adminService = new AdminService(
                _logger,
                _userManager,
                _appSettings,
                _userService,
                _localizationService,
                DbContext,
                _coreHelper);
        }

        [Test]
        public void AdminService_InitializesCorrectly()
        {
            // Assert
            Assert.That(_adminService, Is.Not.Null);
        }
    }
}
