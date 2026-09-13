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
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using eFormAPI.Web.Services;
using eFormAPI.Web.Infrastructure.Models.Auth;
using eFormAPI.Web.Infrastructure.Models.Settings.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using NSubstitute;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Abstractions;
using eFormAPI.Web.Services.Mailing.EmailService;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using System.Collections.Generic;

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
        private IHttpContextAccessor _httpContextAccessor;
        private IWorkerAccountLookup _workerAccountLookup;
        private IClaimsService _claimsService;
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

            _httpContextAccessor = Substitute.For<IHttpContextAccessor>();
            _httpContextAccessor.HttpContext.Returns(new DefaultHttpContext());
            _workerAccountLookup = Substitute.For<IWorkerAccountLookup>();
            _claimsService = Substitute.For<IClaimsService>();
            _claimsService.GetUserClaims(Arg.Any<int>()).Returns(new List<Claim>());

            _accountService = new AccountService(
                _coreHelper,
                _userManager,
                _userService,
                _appSettings,
                _localizationService,
                DbContext,
                _emailService,
                _httpContextAccessor,
                _workerAccountLookup,
                _claimsService);
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

        // --- AdminChangePassword: who may be TARGETED. -------------------------
        // Who may CALL the endpoint is the policy's job (AccountPoliciesTests).
        // Every refusal asserts no password call was made: the point is that the
        // password did not move, not merely that an error came back.

        // Generated per test: a literal would read as a committed secret.
        private string _newPassword;

        private static readonly string UsersUpdate = AuthConsts.EformClaims.UserManagementClaims.Update;
        private static readonly string DeviceUsersUpdate = AuthConsts.EformClaims.DeviceUsersClaims.Update;

        private static List<Claim> AsClaims(IEnumerable<string> grantedClaims)
            => grantedClaims.Select(c => new Claim(c, AuthConsts.ClaimDefaultValue)).ToList();

        /// <summary>The calling user, as both IUserService and the HTTP principal see them.</summary>
        private void CallerIs(int id, bool isAdmin, params string[] grantedClaims)
        {
            _userService.UserId.Returns(id);
            _userService.IsAdmin().Returns(isAdmin);
            var claims = AsClaims(grantedClaims);
            if (isAdmin)
            {
                claims.Add(new Claim(ClaimTypes.Role, EformRole.Admin));
            }
            _httpContextAccessor.HttpContext.Returns(new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(claims, authenticationType: "test"))
            });
        }

        private EformUser ExistingTarget(int id, bool isAdmin, bool isLiveWorker = false,
            params string[] grantedClaims)
        {
            var email = $"target-{id}@example.com";
            var target = new EformUser { Id = id, Email = email, UserName = email };
            _userService.GetByUsernameAsync(email).Returns(target);
            _userManager.IsInRoleAsync(target, EformRole.Admin).Returns(isAdmin);
            _userManager.RemovePasswordAsync(target).Returns(IdentityResult.Success);
            _userManager.AddPasswordAsync(target, Arg.Any<string>()).Returns(IdentityResult.Success);
            _workerAccountLookup.IsLiveWorkerAsync(email).Returns(isLiveWorker);
            // Explicit, not NSubstitute's auto-value: an unconfigured Returns<List<T>> comes
            // back null, not a real empty instance, so leaving this out would NRE rather than
            // silently pass with no claims.
            _claimsService.GetUserClaims(id).Returns(AsClaims(grantedClaims));
            return target;
        }

        private ChangePasswordAdminModel ResetTo(string email)
        {
            _newPassword = $"Aa1!{Guid.NewGuid():N}";
            return new ChangePasswordAdminModel
                { Email = email, NewPassword = _newPassword, ConfirmPassword = _newPassword };
        }

        private static readonly string[] PasswordMutatingMethods =
        {
            nameof(UserManager<EformUser>.RemovePasswordAsync),
            nameof(UserManager<EformUser>.AddPasswordAsync),
            nameof(UserManager<EformUser>.ResetPasswordAsync),
            nameof(UserManager<EformUser>.ChangePasswordAsync),
            nameof(UserManager<EformUser>.UpdateAsync),
        };

        private void AssertRefused(OperationResult result, string expectedKey)
        {
            Assert.That(result.Success, Is.False);
            Assert.That(result.Message, Is.EqualTo(expectedKey));
            var calledMethods = _userManager.ReceivedCalls().Select(call => call.GetMethodInfo().Name).ToList();
            Assert.That(calledMethods, Has.None.AnyOf(PasswordMutatingMethods),
                "the password must not move on a refusal");
        }

        private async Task AssertReset(OperationResult result, EformUser target)
        {
            Assert.That(result.Success, Is.True, result.Message);
            await _userManager.Received(1).AddPasswordAsync(target, _newPassword);
        }

        [Test]
        public async Task AdminChangePassword_AdminResetsNonAdmin_Succeeds()
        {
            CallerIs(id: 5, isAdmin: true);
            var target = ExistingTarget(id: 9, isAdmin: false);
            await AssertReset(await _accountService.AdminChangePassword(ResetTo(target.Email)), target);
        }

        [Test]
        public async Task AdminChangePassword_AdminResetsAnotherAdmin_Succeeds()
        {
            CallerIs(id: 5, isAdmin: true);
            var target = ExistingTarget(id: 7, isAdmin: true);
            await AssertReset(await _accountService.AdminChangePassword(ResetTo(target.Email)), target);
        }

        // Mirrors AdminService.Update's primary-admin guard.
        [Test]
        public async Task AdminChangePassword_AdminResetsPrimaryAdmin_IsRefused()
        {
            CallerIs(id: 5, isAdmin: true);
            var target = ExistingTarget(id: 1, isAdmin: true);
            AssertRefused(await _accountService.AdminChangePassword(ResetTo(target.Email)),
                "CantEditPrimaryAdminUser");
        }

        [Test]
        public async Task AdminChangePassword_PrimaryAdminResetsThemselves_Succeeds()
        {
            CallerIs(id: 1, isAdmin: true);
            var target = ExistingTarget(id: 1, isAdmin: true);
            await AssertReset(await _accountService.AdminChangePassword(ResetTo(target.Email)), target);
        }

        [Test]
        public async Task AdminChangePassword_UserManagerResetsNonAdmin_Succeeds()
        {
            CallerIs(id: 5, isAdmin: false, UsersUpdate);
            var target = ExistingTarget(id: 9, isAdmin: false);
            await AssertReset(await _accountService.AdminChangePassword(ResetTo(target.Email)), target);
        }

        // A non-admin may not reset an administrator's password.
        [Test]
        public async Task AdminChangePassword_ManagerResetsAdmin_IsRefused()
        {
            CallerIs(id: 5, isAdmin: false, UsersUpdate, DeviceUsersUpdate);
            var target = ExistingTarget(id: 7, isAdmin: true);
            AssertRefused(await _accountService.AdminChangePassword(ResetTo(target.Email)),
                "YouCantViewChangeOrDeleteAdmin");
        }

        // Self-service must keep requiring the current password.
        [Test]
        public async Task AdminChangePassword_ManagerResetsThemselves_IsRefused()
        {
            CallerIs(id: 9, isAdmin: false, UsersUpdate);
            var target = ExistingTarget(id: 9, isAdmin: false);
            AssertRefused(await _accountService.AdminChangePassword(ResetTo(target.Email)),
                "UseChangePasswordForYourOwnAccount");
        }

        // The worker-only rule: a property-worker manager keeps the ability they need...
        [Test]
        public async Task AdminChangePassword_DeviceUserManagerResetsLiveWorker_Succeeds()
        {
            CallerIs(id: 5, isAdmin: false, DeviceUsersUpdate);
            var target = ExistingTarget(id: 9, isAdmin: false, isLiveWorker: true);
            await AssertReset(await _accountService.AdminChangePassword(ResetTo(target.Email)), target);
        }

        // ...but cannot reach a non-worker account, e.g. a user manager's, and inherit it.
        [Test]
        public async Task AdminChangePassword_DeviceUserManagerResetsNonWorker_IsRefused()
        {
            CallerIs(id: 5, isAdmin: false, DeviceUsersUpdate);
            var target = ExistingTarget(id: 9, isAdmin: false, isLiveWorker: false);
            AssertRefused(await _accountService.AdminChangePassword(ResetTo(target.Email)),
                "YouMayOnlySetPasswordsForWorkers");
        }

        // Being a worker is not the same as holding only a worker's rights: a live worker
        // who also holds users_update must not be reachable by a device-user-only manager.
        [Test]
        public async Task AdminChangePassword_DeviceUserManagerResetsWorkerWithMoreRights_IsRefused()
        {
            CallerIs(id: 5, isAdmin: false, DeviceUsersUpdate);
            var target = ExistingTarget(id: 9, isAdmin: false, isLiveWorker: true, UsersUpdate);
            AssertRefused(await _accountService.AdminChangePassword(ResetTo(target.Email)),
                "YouCantSetPasswordForMorePrivilegedAccount");
        }

        // ...but a live worker whose rights are entirely a subset of the caller's stays reachable.
        [Test]
        public async Task AdminChangePassword_DeviceUserManagerResetsWorkerWithSubsetRights_Succeeds()
        {
            CallerIs(id: 5, isAdmin: false, DeviceUsersUpdate);
            var target = ExistingTarget(id: 9, isAdmin: false, isLiveWorker: true, DeviceUsersUpdate);
            await AssertReset(await _accountService.AdminChangePassword(ResetTo(target.Email)), target);
        }

        // Direction matters: the caller may hold strictly more than the target, never the
        // reverse. Pins that directly, rather than only through the caller/target holding
        // the identical single claim above.
        [Test]
        public async Task AdminChangePassword_DeviceUserManagerResetsWorkerWithStrictlyFewerRights_Succeeds()
        {
            CallerIs(id: 5, isAdmin: false, DeviceUsersUpdate, AuthConsts.EformClaims.WorkersClaims.Read);
            var target = ExistingTarget(id: 9, isAdmin: false, isLiveWorker: true, DeviceUsersUpdate);
            await AssertReset(await _accountService.AdminChangePassword(ResetTo(target.Email)), target);
        }

        // The no-admin-target rule (no non-admin may target an admin) applies before the
        // worker-only rule is even reached, regardless of the target also being a live
        // worker — guards against a future early-allow refactor of the worker-only rule
        // slipping past the no-admin-target rule.
        [Test]
        public async Task AdminChangePassword_DeviceUserManagerResetsAdminWhoIsLiveWorker_IsRefused()
        {
            CallerIs(id: 5, isAdmin: false, DeviceUsersUpdate);
            var target = ExistingTarget(id: 7, isAdmin: true, isLiveWorker: true);
            AssertRefused(await _accountService.AdminChangePassword(ResetTo(target.Email)),
                "YouCantViewChangeOrDeleteAdmin");
        }

        // Fails closed: no HTTP principal at all must refuse, not throw or fall through. No
        // IUserService.IsAdmin() stub here — the guard must trip on the principal alone,
        // before anything downstream of it is even consulted.
        [Test]
        public async Task AdminChangePassword_NoHttpPrincipal_IsRefusedWithoutConsultingWorkerLookup()
        {
            _httpContextAccessor.HttpContext.Returns((HttpContext)null);
            var target = ExistingTarget(id: 9, isAdmin: false, isLiveWorker: true);
            AssertRefused(await _accountService.AdminChangePassword(ResetTo(target.Email)),
                "YouMayOnlySetPasswordsForWorkers");
            await _workerAccountLookup.DidNotReceive().IsLiveWorkerAsync(Arg.Any<string>());
        }

        // User managers are not narrowed, and the worker lookup is not even consulted for them.
        [Test]
        public async Task AdminChangePassword_UserManagerResetsNonWorker_SucceedsWithoutWorkerCheck()
        {
            CallerIs(id: 5, isAdmin: false, UsersUpdate);
            var target = ExistingTarget(id: 9, isAdmin: false, isLiveWorker: false);
            await AssertReset(await _accountService.AdminChangePassword(ResetTo(target.Email)), target);
            await _workerAccountLookup.DidNotReceive().IsLiveWorkerAsync(Arg.Any<string>());
        }

        // Previously a NullReferenceException (HTTP 500).
        [Test]
        public async Task AdminChangePassword_UnknownEmail_IsRefusedWithoutThrowing()
        {
            CallerIs(id: 5, isAdmin: true);
            _userService.GetByUsernameAsync(Arg.Any<string>()).Returns((EformUser)null);
            AssertRefused(await _accountService.AdminChangePassword(ResetTo("nobody@example.com")),
                "UserNotFound");
        }
    }
}
