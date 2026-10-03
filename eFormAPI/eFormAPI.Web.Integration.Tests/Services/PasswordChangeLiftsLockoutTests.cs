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

using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Hosting.Security;
using eFormAPI.Web.Infrastructure.Models.Auth;
using eFormAPI.Web.Services;
using eFormAPI.Web.Services.Cache.AuthCache;
using eFormAPI.Web.Services.Mailing.EmailService;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;
using NSubstitute;
using NUnit.Framework;
using ResetPasswordModel = eFormAPI.Web.Infrastructure.Models.ResetPasswordModel;

namespace eFormAPI.Web.Integration.Tests.Services
{
    /// <summary>
    /// A password that was just set — by reset token, by the current password or by an
    /// administrator — must log in at once, even when the account was locked out by failed
    /// attempts. ASP.NET Identity leaves LockoutEnd and AccessFailedCount alone on a password
    /// change, and a lockout answers with the same message as a wrong password, so without
    /// this the user is told their brand-new password is wrong for the rest of the lockout.
    ///
    /// Runs on real Identity (EF store on the test database, the production lockout options
    /// from AddEFormAuth, the real SignInManager), because the defect lives in what Identity
    /// does and does not reset — a substituted UserManager would only echo the test's
    /// assumptions back.
    /// </summary>
    [TestFixture]
    public class PasswordChangeLiftsLockoutTests : DbTestFixture
    {
        private const string TokenIssuer = "tests";
        private const string TokenSigningKey = "test-signing-key-that-is-long-enough-for-hmac-sha256";

        private ServiceProvider _provider;
        private IServiceScope _scope;
#pragma warning disable NUnit1032
        private UserManager<EformUser> _userManager;
        private RoleManager<EformRole> _roleManager;
#pragma warning restore NUnit1032
        private IUserService _userService;
        private IHttpContextAccessor _httpContextAccessor;
        private AccountService _accountService;
        private AuthService _authService;
        private int _maxFailedAccessAttempts;

        public override void DoSetup()
        {
            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string>
                {
                    ["EformTokenOptions:Issuer"] = TokenIssuer,
                    ["EformTokenOptions:SigningKey"] = TokenSigningKey
                })
                .Build();

            // Same registrations, in the same order, as Startup.
            var services = new ServiceCollection();
            services.AddLogging();
            services.AddSingleton(DbContext);
            services.AddHttpContextAccessor();
            services.AddIdentity<EformUser, EformRole>()
                .AddEntityFrameworkStores<BaseDbContext>()
                .AddDefaultTokenProviders();
            services.AddEFormAuth(configuration, new List<PluginPermissionModel>());
            // Keys in memory only: the reset tokens must not leave key files on the runner.
            services.AddDataProtection().UseEphemeralDataProtectionProvider();
            _provider = services.BuildServiceProvider();
            _scope = _provider.CreateScope();

            _userManager = _scope.ServiceProvider.GetRequiredService<UserManager<EformUser>>();
            _roleManager = _scope.ServiceProvider.GetRequiredService<RoleManager<EformRole>>();
            _maxFailedAccessAttempts = _userManager.Options.Lockout.MaxFailedAccessAttempts;

            var localizationService = Substitute.For<ILocalizationService>();
            localizationService.GetString(Arg.Any<string>()).Returns(args => args.Arg<string>());
            var appSettings = Substitute.For<IDbOptions<ApplicationSettings>>();
            appSettings.Value.Returns(new ApplicationSettings());

            _userService = Substitute.For<IUserService>();
            _userService.GetByUsernameAsync(Arg.Any<string>())
                .Returns(args => _userManager.FindByEmailAsync(args.Arg<string>()));

            _httpContextAccessor = Substitute.For<IHttpContextAccessor>();
            _httpContextAccessor.HttpContext.Returns(new DefaultHttpContext());

            var claimsService = Substitute.For<IClaimsService>();
            claimsService.GetUserClaims(Arg.Any<int>()).Returns(new List<Claim>());
            claimsService.GetUserPermissions(Arg.Any<int>(), Arg.Any<bool>()).Returns(new List<Claim>());

            _accountService = new AccountService(
                Substitute.For<IEFormCoreService>(),
                _userManager,
                _userService,
                appSettings,
                localizationService,
                DbContext,
                Substitute.For<IEmailService>(),
                _httpContextAccessor,
                Substitute.For<IWorkerAccountLookup>(),
                claimsService,
                Substitute.For<ILogger<AccountService>>());

            _authService = new AuthService(
                Options.Create(new EformTokenOptions
                {
                    Issuer = TokenIssuer,
                    SigningKey = TokenSigningKey
                }),
                Substitute.For<ILogger<AuthService>>(),
                appSettings,
                _roleManager,
                _scope.ServiceProvider.GetRequiredService<SignInManager<EformUser>>(),
                _userManager,
                _userService,
                localizationService,
                claimsService,
                Substitute.For<IAuthCacheService>());
        }

        [TearDown]
        public async Task DisposeIdentity()
        {
            _scope?.Dispose();
            if (_provider != null)
            {
                await _provider.DisposeAsync();
            }
        }

        // Generated per call: a literal would read as a committed secret.
        private static string AnyPassword() => $"Aa1!{Guid.NewGuid():N}";

        /// <summary>
        /// A fresh account (DbTestFixture does not empty the user tables between tests, so the
        /// address is unique per test), locked out through the real login path.
        /// </summary>
        private async Task<EformUser> LockedOutUser(string password)
        {
            if (!await _roleManager.RoleExistsAsync(EformRole.User))
            {
                await _roleManager.CreateAsync(new EformRole { Name = EformRole.User });
            }

            var email = $"jane.doe-{Guid.NewGuid():N}@example.com";
            var user = new EformUser
            {
                Email = email,
                UserName = email,
                FirstName = "Jane",
                LastName = "Doe",
                EmailConfirmed = true,
                IsActive = true,
                TimeZone = "Europe/Copenhagen",
                Formats = "de-DE"
            };
            Assert.That((await _userManager.CreateAsync(user, password)).Succeeded, Is.True);
            Assert.That((await _userManager.AddToRoleAsync(user, EformRole.User)).Succeeded, Is.True);

            var wrongPassword = AnyPassword();
            for (var attempt = 0; attempt < _maxFailedAccessAttempts; attempt++)
            {
                await _authService.AuthenticateUser(new LoginModel { Username = email, Password = wrongPassword });
            }

            Assert.That(await _userManager.IsLockedOutAsync(user), Is.True,
                "precondition: the failed logins must have locked the account");
            return user;
        }

        /// <summary>
        /// Call right after the password was set. The stored lockout state is checked before
        /// logging in, because a successful sign-in resets the failed-attempt count itself.
        /// </summary>
        private async Task AssertLockoutLiftedAndCanLogIn(EformUser user, string newPassword)
        {
            // Read past the change tracker: the shared DbContext already tracks this user, so
            // a tracked lookup would return the in-memory entity, not what was saved.
            var stored = await DbContext.Users.AsNoTracking().SingleAsync(x => x.Id == user.Id);
            Assert.That(stored.LockoutEnd, Is.Null, "the password change must end the lockout");
            Assert.That(stored.AccessFailedCount, Is.Zero, "the password change must zero the failed attempts");

            var login = await _authService.AuthenticateUser(
                new LoginModel { Username = user.Email, Password = newPassword });

            Assert.That(login.Success, Is.True, $"the new password must log in at once: {login.Message}");
        }

        [Test]
        public async Task ResetPassword_WithAValidToken_LiftsTheLockout()
        {
            var user = await LockedOutUser(AnyPassword());
            var newPassword = AnyPassword();

            var result = await _accountService.ResetPassword(new ResetPasswordModel
            {
                UserId = user.Id,
                Code = await _userManager.GeneratePasswordResetTokenAsync(user),
                NewPassword = newPassword,
                NewConfirmPassword = newPassword
            });

            Assert.That(result.Success, Is.True, result.Message);
            await AssertLockoutLiftedAndCanLogIn(user, newPassword);
        }

        // The lockout is lifted only because the reset proved the right to set the password.
        // A reset that fails proves nothing and must leave it in place.
        [Test]
        public async Task ResetPassword_WithAnInvalidToken_KeepsTheLockout()
        {
            var user = await LockedOutUser(AnyPassword());
            var newPassword = AnyPassword();

            var result = await _accountService.ResetPassword(new ResetPasswordModel
            {
                UserId = user.Id,
                Code = "not-a-valid-token",
                NewPassword = newPassword,
                NewConfirmPassword = newPassword
            });

            Assert.That(result.Success, Is.False);
            Assert.That(await _userManager.IsLockedOutAsync(user), Is.True);
        }

        [Test]
        public async Task ChangePassword_WithTheCurrentPassword_LiftsTheLockout()
        {
            var currentPassword = AnyPassword();
            var user = await LockedOutUser(currentPassword);
            _userService.GetCurrentUserAsync().Returns(user);
            var newPassword = AnyPassword();

            var result = await _accountService.ChangePassword(new ChangePasswordModel
            {
                OldPassword = currentPassword,
                NewPassword = newPassword,
                ConfirmPassword = newPassword
            });

            Assert.That(result.Success, Is.True, result.Message);
            await AssertLockoutLiftedAndCanLogIn(user, newPassword);
        }

        // Covers AdminService.Update's password field too: both admin paths set the password
        // through UserManagerLockoutExtensions.ReplacePasswordAsync.
        [Test]
        public async Task AdminChangePassword_ByAnAdmin_LiftsTheLockout()
        {
            var user = await LockedOutUser(AnyPassword());
            // The caller is the primary admin, so the primary-admin guard passes whichever id
            // the database gave the target.
            _userService.UserId.Returns(1);
            _httpContextAccessor.HttpContext.Returns(new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(
                    new[] { new Claim(ClaimTypes.Role, EformRole.Admin) }, authenticationType: "test"))
            });
            var newPassword = AnyPassword();

            var result = await _accountService.AdminChangePassword(new ChangePasswordAdminModel
            {
                Email = user.Email,
                NewPassword = newPassword,
                ConfirmPassword = newPassword
            });

            Assert.That(result.Success, Is.True, result.Message);
            await AssertLockoutLiftedAndCanLogIn(user, newPassword);
        }
    }
}
