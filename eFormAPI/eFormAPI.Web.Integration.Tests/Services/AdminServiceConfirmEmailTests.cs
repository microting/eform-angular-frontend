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

using System;
using System.Threading.Tasks;
using NUnit.Framework;
using eFormAPI.Web.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Microting.eFormApi.BasePn.Abstractions;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microsoft.AspNetCore.Identity;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using eFormAPI.Web.Abstractions;

namespace eFormAPI.Web.Integration.Tests.Services
{
    /// <summary>
    /// Pure unit tests for AdminService.ConfirmEmail. These tests never touch the
    /// database, so they intentionally avoid <c>DbTestFixture</c> (which spins up
    /// Testcontainers MariaDB) and pass an in-memory <see cref="BaseDbContext"/>
    /// solely to satisfy the constructor.
    /// </summary>
    [TestFixture]
    public class AdminServiceConfirmEmailTests
    {
        private ILogger<AdminService> _logger;
#pragma warning disable NUnit1032
        private UserManager<EformUser> _userManager;
#pragma warning restore NUnit1032
        private IDbOptions<ApplicationSettings> _appSettings;
        private IUserService _userService;
        private ILocalizationService _localizationService;
        private IEFormCoreService _coreHelper;
        private BaseDbContext _dbContext;
        private AdminService _adminService;

        [SetUp]
        public void Setup()
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

            // AdminService requires a non-null BaseDbContext to construct, but
            // ConfirmEmail never queries it — a fresh InMemory context is enough.
            var options = new DbContextOptionsBuilder<BaseDbContext>()
                .UseInMemoryDatabase($"admin-service-confirm-email-{Guid.NewGuid()}")
                .Options;
            _dbContext = new BaseDbContext(options);

            _adminService = new AdminService(
                _logger,
                _userManager,
                _appSettings,
                _userService,
                _localizationService,
                _dbContext,
                _coreHelper);
        }

        [TearDown]
        public void TearDown()
        {
            _dbContext?.Dispose();
        }

        [Test]
        public async Task ConfirmEmailAsync_UnconfirmedUser_FlipsFlagAndReturnsSuccess()
        {
            // Arrange
            const int userId = 42;
            var user = new EformUser
            {
                Id = userId,
                Email = "unconfirmed@example.com",
                UserName = "unconfirmed@example.com",
                EmailConfirmed = false
            };

            _userManager.FindByIdAsync(userId.ToString()).Returns(user);
            _userManager.UpdateAsync(user).Returns(IdentityResult.Success);

            // Act
            var result = await _adminService.ConfirmEmail(userId);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.True, "Expected ConfirmEmail to succeed for an unconfirmed user");
            Assert.That(user.EmailConfirmed, Is.True, "Expected EmailConfirmed flag to be flipped to true");
            await _userManager.Received(1).UpdateAsync(user);
        }

        [Test]
        public async Task ConfirmEmailAsync_AlreadyConfirmedUser_ReturnsSuccessIdempotent()
        {
            // Arrange
            const int userId = 43;
            var user = new EformUser
            {
                Id = userId,
                Email = "already@example.com",
                UserName = "already@example.com",
                EmailConfirmed = true
            };

            _userManager.FindByIdAsync(userId.ToString()).Returns(user);

            // Act
            var result = await _adminService.ConfirmEmail(userId);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.True, "Expected ConfirmEmail to be idempotent when already confirmed");
            Assert.That(user.EmailConfirmed, Is.True);
            await _userManager.DidNotReceive().UpdateAsync(Arg.Any<EformUser>());
        }

        [Test]
        public async Task ConfirmEmailAsync_UnknownUserId_ReturnsFailure()
        {
            // Arrange
            const int userId = 9999;
            _userManager.FindByIdAsync(userId.ToString()).Returns((EformUser)null);

            // Act
            var result = await _adminService.ConfirmEmail(userId);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.False, "Expected ConfirmEmail to fail when user is not found");
            await _userManager.DidNotReceive().UpdateAsync(Arg.Any<EformUser>());
        }

        [Test]
        public async Task ConfirmEmailAsync_WhenUpdateAsyncFails_ReturnsFailure()
        {
            // Arrange
            const int userId = 44;
            var user = new EformUser
            {
                Id = userId,
                Email = "boom@example.com",
                UserName = "boom@example.com",
                EmailConfirmed = false
            };

            _userManager.FindByIdAsync(userId.ToString()).Returns(user);
            _userManager.UpdateAsync(user).Returns(
                IdentityResult.Failed(new IdentityError { Description = "boom" }));

            // Act
            var result = await _adminService.ConfirmEmail(userId);

            // Assert
            // AdminService joins IdentityError descriptions into the message —
            // it does not translate the failure through localizationService — so
            // the raw "boom" description is what surfaces to the caller.
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.False,
                "Expected ConfirmEmail to fail when UpdateAsync reports a failure");
            Assert.That(result.Message, Does.Contain("boom"),
                "Expected the failure message to include the IdentityError description");
            await _userManager.Received(1).UpdateAsync(user);
        }
    }
}
