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
using NSubstitute;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using eFormAPI.Web.Abstractions;

namespace eFormAPI.Web.Integration.Tests.Services
{
    /// <summary>
    /// Only the first user (lowest AspNetUsers Id) may delete a device user, on every path
    /// that removes its Site row; everyone else, admins included, is refused before the SDK
    /// is touched. Each subclass points <see cref="DeleteAsync"/> at one delete path and
    /// inherits these tests. They never touch the database, so they avoid <c>DbTestFixture</c>.
    /// </summary>
    public abstract class FirstUserOnlyDeleteTestsBase
    {
        private const int FirstUserId = 1;
        private const int OtherUserId = 2;
        private const int SiteId = 42;

        protected ILocalizationService LocalizationService;
        protected IEFormCoreService CoreHelper;
        protected IUserService UserService;

        /// <summary>Calls the delete path under test with fresh service wiring.</summary>
        protected abstract Task<OperationResult> DeleteAsync(int id);

        /// <summary>The key the service reports when the (faked) SDK delete fails.</summary>
        protected abstract string SdkFailureMessageKey { get; }

        [SetUp]
        public void SetUpSubstitutes()
        {
            LocalizationService = Substitute.For<ILocalizationService>();
            CoreHelper = Substitute.For<IEFormCoreService>();
            UserService = Substitute.For<IUserService>();

            LocalizationService.GetString(Arg.Any<string>())
                .Returns(args => args.Arg<string>());
            LocalizationService.GetStringWithFormat(Arg.Any<string>(), Arg.Any<object[]>())
                .Returns(args => args.ArgAt<string>(0));

            UserService.GetFirstUserIdInDb().Returns(FirstUserId);

            // Every SDK call in Delete goes through the core instance, so a GetCore that
            // throws marks the point where the SDK path is entered.
            CoreHelper.GetCore()
                .Returns<eFormCore.Core>(_ => throw new InvalidOperationException("SDK reached"));
        }

        [Test]
        public async Task Delete_ByAdminWhoIsNotTheFirstUser_IsRefusedWithoutReachingTheSdk()
        {
            // Arrange
            UserService.UserId.Returns(OtherUserId);
            // Admin status is deliberately irrelevant: an admin who is not the first user is refused.
            UserService.IsAdmin().Returns(true);

            // Act
            var result = await DeleteAsync(SiteId);

            // Assert
            Assert.That(result.Success, Is.False);
            Assert.That(result.Message, Is.EqualTo("OnlyTheFirstUserCanDeleteWorkers"));
            // The SDK delete is only reachable through GetCore.
            await CoreHelper.DidNotReceive().GetCore();
        }

        [Test]
        public async Task Delete_WithoutAUserIdAgainstAnEmptyUsersTable_IsRefusedWithoutReachingTheSdk()
        {
            // Arrange: no signed-in user (UserId 0) and no users, so GetFirstUserIdInDb is 0 too.
            UserService.UserId.Returns(0);
            UserService.GetFirstUserIdInDb().Returns(0);

            // Act
            var result = await DeleteAsync(SiteId);

            // Assert
            Assert.That(result.Success, Is.False);
            Assert.That(result.Message, Is.EqualTo("OnlyTheFirstUserCanDeleteWorkers"));
            await CoreHelper.DidNotReceive().GetCore();
        }

        [Test]
        public async Task Delete_ByTheFirstUser_PassesTheCheckAndReachesTheSdk()
        {
            // Arrange
            UserService.UserId.Returns(FirstUserId);

            // Act
            var result = await DeleteAsync(SiteId);

            // Assert
            await UserService.Received(1).GetFirstUserIdInDb();
            await CoreHelper.Received(1).GetCore();
            // The faked SDK fails, so the result is the SDK-failure message, not the refusal.
            Assert.That(result.Success, Is.False);
            Assert.That(result.Message, Is.EqualTo(SdkFailureMessageKey));
        }
    }
}
