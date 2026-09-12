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
using Microsoft.Extensions.Logging;
using NSubstitute;
using Microting.eFormApi.BasePn.Abstractions;
using eFormAPI.Web.Abstractions;

namespace eFormAPI.Web.Integration.Tests.Services
{
    /// <summary>
    /// Only the first user (lowest AspNetUsers Id) may delete a site (a device user) from
    /// Advanced &gt; Sites; everyone else, admins included, is refused before the SDK is
    /// touched. These tests never touch the database, so they avoid <c>DbTestFixture</c>.
    /// </summary>
    [TestFixture]
    public class SitesServiceDeleteTests
    {
        private const int FirstUserId = 1;
        private const int OtherUserId = 2;
        private const int SiteId = 42;

        private ILocalizationService _localizationService;
        private IEFormCoreService _coreHelper;
        private IUserService _userService;
        private SitesService _sitesService;

        [SetUp]
        public void Setup()
        {
            _localizationService = Substitute.For<ILocalizationService>();
            _coreHelper = Substitute.For<IEFormCoreService>();
            _userService = Substitute.For<IUserService>();

            _localizationService.GetString(Arg.Any<string>())
                .Returns(args => args.Arg<string>());
            _localizationService.GetStringWithFormat(Arg.Any<string>(), Arg.Any<object[]>())
                .Returns(args => args.ArgAt<string>(0));

            _userService.GetFirstUserIdInDb().Returns(FirstUserId);

            // Every SDK call in Delete goes through the core instance, so a GetCore that
            // throws marks the point where the SDK path is entered.
            _coreHelper.GetCore()
                .Returns<eFormCore.Core>(_ => throw new InvalidOperationException("SDK reached"));

            _sitesService = new SitesService(
                _coreHelper,
                _localizationService,
                _userService,
                Substitute.For<ILogger<SitesService>>());
        }

        [Test]
        public async Task Delete_ByAdminWhoIsNotTheFirstUser_IsRefusedWithoutReachingTheSdk()
        {
            // Arrange
            _userService.UserId.Returns(OtherUserId);
            // Admin status is deliberately irrelevant: an admin who is not the first user is refused.
            _userService.IsAdmin().Returns(true);

            // Act
            var result = await _sitesService.Delete(SiteId);

            // Assert
            Assert.That(result.Success, Is.False);
            Assert.That(result.Message, Is.EqualTo("OnlyTheFirstUserCanDeleteWorkers"));
            // Advanced_SiteItemDelete is only reachable through GetCore.
            await _coreHelper.DidNotReceive().GetCore();
        }

        [Test]
        public async Task Delete_WithoutAUserIdAgainstAnEmptyUsersTable_IsRefusedWithoutReachingTheSdk()
        {
            // Arrange: no signed-in user (UserId 0) and no users, so GetFirstUserIdInDb is 0 too.
            _userService.UserId.Returns(0);
            _userService.GetFirstUserIdInDb().Returns(0);

            // Act
            var result = await _sitesService.Delete(SiteId);

            // Assert
            Assert.That(result.Success, Is.False);
            Assert.That(result.Message, Is.EqualTo("OnlyTheFirstUserCanDeleteWorkers"));
            await _coreHelper.DidNotReceive().GetCore();
        }

        [Test]
        public async Task Delete_ByTheFirstUser_PassesTheCheckAndReachesTheSdk()
        {
            // Arrange
            _userService.UserId.Returns(FirstUserId);

            // Act
            var result = await _sitesService.Delete(SiteId);

            // Assert
            await _userService.Received(1).GetFirstUserIdInDb();
            await _coreHelper.Received(1).GetCore();
            // The faked SDK fails, so the result is the SDK-failure message, not the refusal.
            Assert.That(result.Success, Is.False);
            Assert.That(result.Message, Is.EqualTo("SiteParamCouldNotBeDeleted"));
        }
    }
}
