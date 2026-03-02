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
using NSubstitute;
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
        private IEFormCoreService _coreHelper;
#pragma warning disable NUnit1032
        private UserManager<EformUser> _userManager;
#pragma warning restore NUnit1032
        private IUserService _userService;
        private IDbOptions<ApplicationSettings> _appSettings;
        private ILocalizationService _localizationService;
        private IEmailService _emailService;
        private AccountService _accountService;

        public override void DoSetup()
        {
            var store = Substitute.For<IUserStore<EformUser>>();
            _userManager = Substitute.For<UserManager<EformUser>>(store, null, null, null, null, null, null, null, null);
            _coreHelper = Substitute.For<IEFormCoreService>();
            _userService = Substitute.For<IUserService>();
            _appSettings = Substitute.For<IDbOptions<ApplicationSettings>>();
            _localizationService = Substitute.For<ILocalizationService>();
            _emailService = Substitute.For<IEmailService>();

            _localizationService.GetString(Arg.Any<string>())
                .Returns(args => args.Arg<string>());
            
            _accountService = new AccountService(
                _coreHelper,
                _userManager,
                _userService,
                _appSettings,
                _localizationService,
                DbContext,
                _emailService);
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
            _userService.GetCurrentUserAsync()
                .Returns((EformUser)null);

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

            _userService.GetCurrentUserAsync()
                .Returns(user);
            
            _userManager.UpdateAsync(Arg.Any<EformUser>())
                .Returns(IdentityResult.Success);

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
            _userService.GetCurrentUserAsync()
                .Returns((EformUser)null);

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

            _userService.GetCurrentUserAsync()
                .Returns(user);
            
            _userManager.UpdateAsync(Arg.Any<EformUser>())
                .Returns(IdentityResult.Success);

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
