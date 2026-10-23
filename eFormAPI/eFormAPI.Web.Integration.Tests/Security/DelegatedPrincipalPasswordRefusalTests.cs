using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Hosting.Security;
using eFormAPI.Web.Infrastructure.Models.ExternalLinks;
using eFormAPI.Web.Integration.Tests.Identity;
using eFormAPI.Web.Services;
using eFormAPI.Web.Services.Mailing.EmailService;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Security;

/// <summary>
/// A delegated principal (a UserLogins row for the delegated provider) is credential-less
/// on purpose; no password route may give it one. A password-less user WITHOUT that row is
/// ordinary (AdminService sets the initial password that way) and must still receive one. Every refusal is asserted on the STORED hash.
/// </summary>
[TestFixture]
public class DelegatedPrincipalPasswordRefusalTests : DbTestFixture
{
    private static async Task<EformUser> CreateNullHashUserAsync(IdentityTestHost host, bool delegated)
    {
        var email = $"nullhash-{Guid.NewGuid():N}@example.test";
        var user = new EformUser
        {
            UserName = email,
            Email = email,
            FirstName = "Credential",
            LastName = "Less",
            Locale = "en",
            TimeZone = "Europe/Copenhagen",
            Formats = "de-DE",
            EmailConfirmed = true
        };
        var created = await host.UserManager.CreateAsync(user);
        Assert.That(created.Succeeded, Is.True, string.Join(" ", created.Errors.Select(e => e.Description)));
        host.TrackForCleanup(user.Id);
        Assert.That(user.PasswordHash, Is.Null);
        if (delegated)
        {
            await host.AddLinkAsync(user.Id, ExternalLoginProviders.MyMicrotingDelegated, Guid.NewGuid().ToString("N"));
        }

        return user;
    }

    private static AccountService BuildService(IdentityTestHost host, EformUser currentUser)
    {
        var userService = Substitute.For<IUserService>();
        userService.GetCurrentUserAsync().Returns(currentUser);
        userService.UserId.Returns(currentUser.Id);

        var localizationService = Substitute.For<ILocalizationService>();
        localizationService.GetString(Arg.Any<string>()).Returns(args => args.Arg<string>());

        return new AccountService(
            Substitute.For<IEFormCoreService>(),
            host.UserManager,
            userService,
            Substitute.For<IDbOptions<ApplicationSettings>>(),
            localizationService,
            host.DbContext,
            Substitute.For<IEmailService>(),
            Substitute.For<IHttpContextAccessor>(),
            Substitute.For<IWorkerAccountLookup>(),
            Substitute.For<IClaimsService>(),
            Substitute.For<ILogger<AccountService>>());
    }

    private static async Task<string> StoredHashAsync(IdentityTestHost host, int userId)
        => await host.DbContext.Users.AsNoTracking().Where(u => u.Id == userId)
            .Select(u => u.PasswordHash).SingleAsync();

    [Test]
    public async Task ReplacePasswordAsync_DelegatedUser_Refuses()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await CreateNullHashUserAsync(host, delegated: true);

        var result = await host.UserManager.ReplacePasswordAsync(user, "Secret123!", host.Logger);

        Assert.That(result.Succeeded, Is.False);
        Assert.That(result.Errors.Any(e => e.Code == "CredentialLessAccount"), Is.True);
        Assert.That(await StoredHashAsync(host, user.Id), Is.Null);
    }

    [Test]
    public async Task ReplacePasswordAsync_PasswordlessNonDelegatedUser_StillGetsInitialPassword()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await CreateNullHashUserAsync(host, delegated: false);

        var result = await host.UserManager.ReplacePasswordAsync(user, "Secret123!", host.Logger);

        Assert.That(result.Succeeded, Is.True, string.Join(" ", result.Errors.Select(e => e.Description)));
        Assert.That(await StoredHashAsync(host, user.Id), Is.Not.Null);
    }

    [Test]
    public async Task ReplacePasswordAsync_NormalUser_StillSucceeds()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await host.CreateUserAsync("old-password");
        await host.LockOutAsync(user.Id);
        var oldHash = await host.StoredHashAsync(user.Id);
        user = await host.UserManager.FindByIdAsync(user.Id.ToString());

        var result = await host.UserManager.ReplacePasswordAsync(user, "Secret123!", host.Logger);

        Assert.That(result.Succeeded, Is.True);
        Assert.That(await host.StoredHashAsync(user.Id), Is.Not.EqualTo(oldHash));
        var (lockoutEnd, failed) = await host.StoredLockoutAsync(user.Id);
        Assert.That(lockoutEnd, Is.Null);
        Assert.That(failed, Is.Zero);
    }

    [Test]
    public async Task ResetPassword_DelegatedUser_Refuses()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await CreateNullHashUserAsync(host, delegated: true);
        var token = await host.UserManager.GeneratePasswordResetTokenAsync(user);
        var service = BuildService(host, user);

        var result = await service.ResetPassword(new eFormAPI.Web.Infrastructure.Models.ResetPasswordModel
        {
            UserId = user.Id,
            Code = token,
            NewPassword = "Secret123!"
        });

        Assert.That(result.Success, Is.False);
        Assert.That(await StoredHashAsync(host, user.Id), Is.Null);
    }

    [Test]
    public async Task ChangePassword_DelegatedUser_Refuses()
    {
        await using var host = new IdentityTestHost(DbContext);
        var user = await CreateNullHashUserAsync(host, delegated: true);
        var service = BuildService(host, user);

        var result = await service.ChangePassword(new ChangePasswordModel
        {
            OldPassword = "anything",
            NewPassword = "Secret123!"
        });

        Assert.That(result.Success, Is.False);
        Assert.That(await StoredHashAsync(host, user.Id), Is.Null);
    }
}
