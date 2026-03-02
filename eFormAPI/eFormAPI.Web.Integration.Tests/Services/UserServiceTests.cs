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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using NSubstitute;
using Microting.eFormApi.BasePn.Abstractions;

namespace eFormAPI.Web.Integration.Tests.Services
{
    [TestFixture]
    public class UserServiceTests : DbTestFixture
    {
#pragma warning disable NUnit1032
        private UserManager<EformUser> _userManager;
#pragma warning restore NUnit1032
        private IHttpContextAccessor _httpAccessor;
        private IEFormCoreService _coreHelper;
        private UserService _userService;

        public override void DoSetup()
        {
            var store = Substitute.For<IUserStore<EformUser>>();
            _userManager = Substitute.For<UserManager<EformUser>>(store, null, null, null, null, null, null, null, null);
            _httpAccessor = Substitute.For<IHttpContextAccessor>();
            _coreHelper = Substitute.For<IEFormCoreService>();

            _userService = new UserService(
                DbContext,
                _userManager,
                _httpAccessor,
                _coreHelper);
        }

        [Test]
        public async Task GetByIdAsync_WithValidId_ShouldReturnUser()
        {
            // Arrange
            var user = new EformUser
            {
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User",
                UserName = "testuser"
            };
            DbContext.Users.Add(user);
            await DbContext.SaveChangesAsync();

            // Act
            var result = await _userService.GetByIdAsync(user.Id);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(user.Id));
            Assert.That(result.Email, Is.EqualTo(user.Email));
        }

        [Test]
        public async Task GetByIdAsync_WithInvalidId_ShouldReturnNull()
        {
            // Act
            var result = await _userService.GetByIdAsync(999);

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task GetByUsernameAsync_WithValidUsername_ShouldReturnUser()
        {
            // Arrange
            var user = new EformUser
            {
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User",
                UserName = "testuser"
            };
            DbContext.Users.Add(user);
            await DbContext.SaveChangesAsync();

            // Act
            var result = await _userService.GetByUsernameAsync("testuser");

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.UserName, Is.EqualTo(user.UserName));
        }

        [Test]
        public async Task GetByUsernameAsync_WithEmail_ShouldReturnUser()
        {
            // Arrange
            var user = new EformUser
            {
                Email = "test@example.com",
                FirstName = "Test",
                LastName = "User",
                UserName = "differentusername"
            };
            DbContext.Users.Add(user);
            await DbContext.SaveChangesAsync();

            // Mock is needed because GetByUsernameAsync calls UpdateAsync when finding user by email
            _userManager.UpdateAsync(Arg.Any<EformUser>())
                .Returns(IdentityResult.Success);

            // Act
            var result = await _userService.GetByUsernameAsync("test@example.com");

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Email, Is.EqualTo(user.Email));
        }

        [Test]
        public async Task GetByUsernameAsync_WithInvalidUsername_ShouldReturnNull()
        {
            // Act
            var result = await _userService.GetByUsernameAsync("nonexistentuser");

            // Assert
            Assert.That(result, Is.Null);
        }
    }
}
