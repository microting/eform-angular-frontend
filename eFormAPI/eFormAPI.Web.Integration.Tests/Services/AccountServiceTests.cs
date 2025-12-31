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
using System;
using System.Threading.Tasks;
using eFormAPI.Web.Services;
using eFormAPI.Web.Infrastructure.Models.Settings.User;
using Microsoft.AspNetCore.Identity;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Moq;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Abstractions;
using eFormAPI.Web.Services.Mailing.EmailService;
using eFormAPI.Web.Abstractions;

namespace eFormAPI.Web.Integration.Tests.Services
{
    [TestFixture]
    public class AccountServiceTests : DbTestFixture
    {
        private Mock<IEFormCoreService> _coreHelper;
        private Mock<UserManager<EformUser>> _userManager;
        private Mock<IUserService> _userService;
        private Mock<IDbOptions<ApplicationSettings>> _appSettings;
        private Mock<ILocalizationService> _localizationService;
        private Mock<IEmailService> _emailService;
        private AccountService _accountService;

        public override void DoSetup()
        {
            var store = new Mock<IUserStore<EformUser>>();
            _userManager = new Mock<UserManager<EformUser>>(store.Object, null, null, null, null, null, null, null, null);
            _coreHelper = new Mock<IEFormCoreService>();
            _userService = new Mock<IUserService>();
            _appSettings = new Mock<IDbOptions<ApplicationSettings>>();
            _localizationService = new Mock<ILocalizationService>();
            _emailService = new Mock<IEmailService>();

            _localizationService.Setup(x => x.GetString(It.IsAny<string>()))
                .Returns((string key) => key);
            
            _accountService = new AccountService(
                _coreHelper.Object,
                _userManager.Object,
                _userService.Object,
                _appSettings.Object,
                _localizationService.Object,
                DbContext,
                _emailService.Object);
        }

        [Test]
        public void AllTimeZones_ShouldReturnListOfTimeZones()
        {
            // Act
            var result = _accountService.AllTimeZones();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.True);
            Assert.That(result.Model, Is.Not.Null);
            Assert.That(result.Model.TimeZoneModels, Is.Not.Null);
            Assert.That(result.Model.TimeZoneModels.Count, Is.GreaterThan(0));
        }

        [Test]
        public async Task GetUserInfo_WithNoUser_ShouldReturnNull()
        {
            // Arrange
            _userService.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync((EformUser)null);

            // Act
            var result = await _accountService.GetUserInfo();

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task UpdateUserSettings_WithValidUser_ShouldSucceed()
        {
            // Arrange
            var user = new EformUser
            {
                Id = 1,
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User"
            };

            var settings = new UserSettingsModel
            {
                Locale = "en",
                TimeZone = "UTC",
                Formats = "en-US",
                DarkTheme = false
            };

            _userService.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(user);
            
            _userManager.Setup(x => x.UpdateAsync(It.IsAny<EformUser>()))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _accountService.UpdateUserSettings(settings);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.True);
        }

        [Test]
        public async Task GetUserSettings_WithNoUser_ShouldReturnError()
        {
            // Arrange
            _userService.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync((EformUser)null);

            // Act
            var result = await _accountService.GetUserSettings();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.False);
        }

        [Test]
        public async Task ProfilePictureDelete_WithValidUser_ShouldSucceed()
        {
            // Arrange
            var user = new EformUser
            {
                Id = 1,
                Email = "test@example.com",
                ProfilePicture = "picture.jpg",
                ProfilePictureSnapshot = "picture_thumb.jpg"
            };

            _userService.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync(user);
            
            _userManager.Setup(x => x.UpdateAsync(It.IsAny<EformUser>()))
                .ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _accountService.ProfilePictureDelete();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.True);
            Assert.That(user.ProfilePicture, Is.Null);
            Assert.That(user.ProfilePictureSnapshot, Is.Null);
        }
    }
}
