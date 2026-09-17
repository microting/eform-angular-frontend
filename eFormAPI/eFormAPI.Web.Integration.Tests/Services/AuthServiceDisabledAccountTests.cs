/*
The MIT License (MIT)

Copyright (c) 2007 - 2026 Microting A/S

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

using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Services;
using eFormAPI.Web.Services.Cache.AuthCache;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services
{
    /// <summary>
    /// A disabled account (EformUser.IsActive == false) must be refused, and must answer
    /// with the same message as an account that does not exist — otherwise the login box
    /// tells any visitor which emails have accounts. That sameness is the requirement, so
    /// it is asserted by comparing the responses to each other rather than by checking each
    /// message in isolation.
    ///
    /// Pure unit tests: every collaborator is a substitute and nothing touches the
    /// database, so this fixture deliberately does not inherit DbTestFixture.
    /// </summary>
    [TestFixture]
    public class AuthServiceDisabledAccountTests
    {
        private const string Password = "correct-horse-battery-staple";
        private const string GenericMessageKey = "UserNameOrPasswordIncorrect";

        private IUserService _userService;
        private SignInManager<EformUser> _signInManager;
#pragma warning disable NUnit1032
        private UserManager<EformUser> _userManager;
#pragma warning restore NUnit1032
        private AuthService _authService;

        [SetUp]
        public void Setup()
        {
            var tokenOptions = Substitute.For<IOptions<EformTokenOptions>>();
            var appSettings = Substitute.For<IDbOptions<ApplicationSettings>>();
            var localizationService = Substitute.For<ILocalizationService>();

            _userService = Substitute.For<IUserService>();
            _signInManager = Substitute.For<SignInManager<EformUser>>(
                Substitute.For<UserManager<EformUser>>(
                    Substitute.For<IUserStore<EformUser>>(), null, null, null, null, null, null, null, null),
                Substitute.For<Microsoft.AspNetCore.Http.IHttpContextAccessor>(),
                Substitute.For<IUserClaimsPrincipalFactory<EformUser>>(),
                null, null, null, null);
            _userManager = Substitute.For<UserManager<EformUser>>(
                Substitute.For<IUserStore<EformUser>>(), null, null, null, null, null, null, null, null);

            // The substitute echoes the key back, so an assertion naming the key proves the
            // localised resource is used rather than a hard-coded literal.
            localizationService.GetString(Arg.Any<string>()).Returns(args => args.Arg<string>());
            // A signing key so the "not refused" test can get as far as minting a token;
            // the value is irrelevant, only that token generation does not throw.
            tokenOptions.Value.Returns(new EformTokenOptions
            {
                SigningKey = "test-signing-key-that-is-long-enough-for-hmac-sha256",
                Issuer = "tests"
            });
            appSettings.Value.Returns(new ApplicationSettings());

            _authService = new AuthService(
                tokenOptions,
                Substitute.For<ILogger<AuthService>>(),
                appSettings,
                Substitute.For<RoleManager<EformRole>>(
                    Substitute.For<IRoleStore<EformRole>>(), null, null, null, null),
                _signInManager,
                _userManager,
                _userService,
                localizationService,
                Substitute.For<IClaimsService>(),
                Substitute.For<IAuthCacheService>());
        }

        private static EformUser User(bool isActive) => new()
        {
            Id = 42,
            UserName = "someone@example.com",
            Email = "someone@example.com",
            EmailConfirmed = true,
            IsActive = isActive
        };

        private static LoginModel Login() => new()
        {
            Username = "someone@example.com",
            Password = Password
        };

        private void GivenUser(EformUser user) =>
            _userService.GetByUsernameAsync(Arg.Any<string>()).Returns(user);

        private void GivenSignInResult(SignInResult result) =>
            _signInManager.CheckPasswordSignInAsync(Arg.Any<EformUser>(), Arg.Any<string>(), Arg.Any<bool>())
                .Returns(result);

        [Test]
        public async Task AuthenticateUser_DisabledAccount_IsRefused()
        {
            GivenUser(User(isActive: false));
            GivenSignInResult(SignInResult.Success);

            var result = await _authService.AuthenticateUser(Login());

            Assert.That(result.Success, Is.False, "a disabled account must not be able to log in");
            Assert.That(result.Message, Is.EqualTo(GenericMessageKey));
        }

        [Test]
        public async Task AuthenticateUser_DisabledAccount_IsIndistinguishableFromAnUnknownOne()
        {
            GivenUser(User(isActive: false));
            GivenSignInResult(SignInResult.Success);
            var disabled = await _authService.AuthenticateUser(Login());

            GivenUser(null);
            var unknown = await _authService.AuthenticateUser(Login());

            Assert.That(disabled.Success, Is.EqualTo(unknown.Success));
            Assert.That(disabled.Message, Is.EqualTo(unknown.Message),
                "a disabled account must not be distinguishable from one that does not exist");
        }

        [Test]
        public async Task AuthenticateUser_WrongPassword_GivesTheSameAnswerAsAnUnknownAccount()
        {
            GivenUser(User(isActive: true));
            GivenSignInResult(SignInResult.Failed);
            var wrongPassword = await _authService.AuthenticateUser(Login());

            GivenUser(null);
            var unknown = await _authService.AuthenticateUser(Login());

            Assert.That(wrongPassword.Message, Is.EqualTo(unknown.Message),
                "the login box must not reveal which usernames exist");
            Assert.That(wrongPassword.Message, Is.EqualTo(GenericMessageKey));
        }

        [Test]
        public async Task AuthenticateUser_UnknownAccount_DoesNotEchoTheSubmittedUsername()
        {
            GivenUser(null);

            var result = await _authService.AuthenticateUser(Login());

            Assert.That(result.Message, Does.Not.Contain("someone@example.com"),
                "the response must not repeat what was typed into the login box");
        }

        [Test]
        public async Task AuthenticateUser_LockedOut_GivesTheSameAnswerAsAnUnknownAccount()
        {
            GivenUser(User(isActive: true));
            GivenSignInResult(SignInResult.LockedOut);
            var lockedOut = await _authService.AuthenticateUser(Login());

            GivenUser(null);
            var unknown = await _authService.AuthenticateUser(Login());

            // Only an existing, active account can reach lockout, so a distinct message
            // here would tell an anonymous caller that an address has a live account.
            Assert.That(lockedOut.Message, Is.EqualTo(unknown.Message),
                "a locked-out account must not be distinguishable from one that does not exist");
            Assert.That(lockedOut.Message, Is.EqualTo(GenericMessageKey));
        }

        [Test]
        public async Task AuthenticateUser_ActiveAccountWithTheRightPassword_Succeeds()
        {
            var user = User(isActive: true);
            GivenUser(user);
            GivenSignInResult(SignInResult.Success);
            _userManager.GetRolesAsync(user).Returns(new List<string> { "admin" });
            _userService.GetFirstUserIdInDb().Returns(user.Id);

            var result = await _authService.AuthenticateUser(Login());

            Assert.That(result.Success, Is.True,
                "an active account with the right password must still be able to log in");
        }

        [Test]
        public async Task AuthenticateUser_DisabledAccount_StillVerifiesThePasswordFirst()
        {
            GivenUser(User(isActive: false));
            GivenSignInResult(SignInResult.Success);

            await _authService.AuthenticateUser(Login());

            // Refusing before the hash would answer faster than a wrong password does,
            // which is a timing oracle, and would also exempt disabled accounts from
            // lockout counting.
            await _signInManager.Received().CheckPasswordSignInAsync(
                Arg.Any<EformUser>(), Arg.Any<string>(), Arg.Any<bool>());
        }

        [Test]
        public async Task GetGoogleAuthenticator_DisabledAccount_IsRefused()
        {
            _userManager.FindByNameAsync(Arg.Any<string>()).Returns(User(isActive: false));

            var result = await _authService.GetGoogleAuthenticator(Login());

            Assert.That(result.Success, Is.False,
                "the anonymous 2FA-key endpoint confirms a credential, so it must refuse too");
            Assert.That(result.Message, Is.EqualTo(GenericMessageKey));
        }

        [Test]
        public async Task RefreshToken_DisabledAccount_IsRefused()
        {
            _userService.UserId.Returns(42);
            _userService.GetByIdAsync(Arg.Any<int>()).Returns(User(isActive: false));

            var result = await _authService.RefreshToken();

            Assert.That(result.Success, Is.False,
                "a disabled account must not be able to roll its session forward");
            Assert.That(result.Message, Is.EqualTo(GenericMessageKey));
        }
    }
}
