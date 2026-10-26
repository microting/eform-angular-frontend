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


using System.Globalization;
using System.IO;
using System.Web;
using eFormAPI.Web.Infrastructure.Models.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;

namespace eFormAPI.Web.Services;

using Microsoft.EntityFrameworkCore;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Abstractions;
using Abstractions.Security;
using Accounts;
using Hosting.Helpers.DbOptions;
using Hosting.Security;
using Infrastructure.Models.ExternalLinks;
using Infrastructure.Models.Settings;
using Infrastructure.Models.Settings.User;
using Infrastructure.Models.Users;
using Mailing.EmailService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microting.eForm.Dto;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Auth;

public class AccountService(
    IEFormCoreService coreHelper,
    UserManager<EformUser> userManager,
    IUserService userService,
    IDbOptions<ApplicationSettings> appSettings,
    ILocalizationService localizationService,
    BaseDbContext context,
    IEmailService emailService,
    IHttpContextAccessor httpContextAccessor,
    IWorkerAccountLookup workerAccountLookup,
    IClaimsService claimsService,
    ILogger<AccountService> logger)
    : IAccountService
{
    public async Task<UserInfoViewModel> GetUserInfo()
    {
        var user = await userService.GetCurrentUserAsync();
        if (user == null)
        {
            return null;
        }

        var roles = await userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault();
        return new UserInfoViewModel
        {
            Email = user.Email,
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = role,
            ProfilePicture = user.ProfilePicture,
            ProfilePictureSnapshot = user.ProfilePictureSnapshot,
            EmailSha256 = user.EmailSha256
        };
    }

    public async Task<OperationDataResult<UserSettingsModel>> GetUserSettings()
    {
        var user = await userService.GetCurrentUserAsync();
        if (user == null)
        {
            return new OperationDataResult<UserSettingsModel>(false, localizationService.GetString("UserNotFound"));
        }

        var timeZone = string.IsNullOrEmpty(user.TimeZone) ? "Europe/Copenhagen" : user.TimeZone;
        var formats = string.IsNullOrEmpty(user.Formats) ? "de-DE" : user.Formats;
        var darkTheme = user.DarkTheme;
        var themeVariant = string.IsNullOrEmpty(user.ThemeVariant) ? "eform" : user.ThemeVariant;
        var locale = string.IsNullOrEmpty(user.Locale) ? "da" : user.Locale;
        var core = await coreHelper.GetCore();
        var dbContextHelper = core.DbContextHelper;
        var dbContext = dbContextHelper.GetDbContext();
        var languageId = await dbContext.Languages
            .Where(x => x.LanguageCode == locale)
            .Select(x => x.Id)
            .FirstOrDefaultAsync();

        var securityGroupRedirectLink = await context.SecurityGroupUsers
            .Where(x => x.EformUserId == user.Id)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => x.SecurityGroup.RedirectLink)
            .FirstOrDefaultAsync();

        return new OperationDataResult<UserSettingsModel>(true, new UserSettingsModel()
        {
            Locale = locale,
            LanguageId = languageId,
            DarkTheme = darkTheme,
            ThemeVariant = themeVariant,
            Formats = formats,
            TimeZone = timeZone,
            LoginRedirectUrl = securityGroupRedirectLink,
            ProfilePicture = user.ProfilePicture,
            ProfilePictureSnapshot = user.ProfilePictureSnapshot,
            EmailSha256 = user.EmailSha256
        });
    }

    public OperationDataResult<TimeZonesModel> AllTimeZones()
    {
        TimeZonesModel timeZones = new TimeZonesModel();
        timeZones.TimeZoneModels = new List<TimeZoneModel>();
        foreach (TimeZoneInfo timeZoneInfo in TimeZoneInfo.GetSystemTimeZones().OrderBy(x => x.Id))
        {
            TimeZoneModel timeZoneModel = new TimeZoneModel()
            {
                Id = timeZoneInfo.Id,
                Name = timeZoneInfo.Id
            };
            timeZones.TimeZoneModels.Add(timeZoneModel);
        }
        return new OperationDataResult<TimeZonesModel>(true, timeZones);
    }

    public async Task<OperationResult> UpdateUserSettings(UserSettingsModel model)
    {
        var user = await userService.GetCurrentUserAsync();
        if (user == null)
        {
            return new OperationResult(false, localizationService.GetString("UserNotFound"));
        }

        user.Locale = model.Locale;
        user.TimeZone = model.TimeZone;
        user.Formats = model.Formats;
        user.DarkTheme = model.DarkTheme;
        if (!string.IsNullOrEmpty(model.ThemeVariant))
        {
            user.ThemeVariant = model.ThemeVariant;
        }
        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            return new OperationResult(false,
                $"Error while updating user settings: {string.Join(", ", updateResult.Errors.Select(x => x.Description).ToArray())}");
        }

        return new OperationResult(true);
    }

    public async Task<OperationResult> ChangePassword(ChangePasswordModel model)
    {
        var user = await userService.GetCurrentUserAsync();

        if (await userManager.IsDelegatedPrincipalAsync(user))
        {
            logger.LogWarning("Refused to change the password of user {UserId}: the account is a delegated principal",
                user.Id);
            return new OperationResult(false, UserManagerLockoutExtensions.CredentialLessAccountResult()
                .Errors.First().Description);
        }

        var result = await userManager.ChangePasswordAsync(
            user,
            model.OldPassword,
            model.NewPassword);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(x => x.Description).ToArray();
            return new OperationResult(false, string.Join(" ", errors));
        }

        await userManager.LiftLockoutAsync(user, logger);
        return new OperationResult(true, localizationService.GetString("PasswordSuccessfullyUpdated"));
    }

    /// <summary>
    /// Sets another account's password, the target named by email.
    ///
    /// ███ THIS METHOD HOLDS THE FIRST OF TWO COPIES OF THE TARGET RULES. ███
    ///
    /// The second copy is <see cref="EvaluateLinkedTargetGuards"/> further down this file,
    /// used by <see cref="SetLinkedAccountPassword"/>. The copy BELOW — from
    /// "if (user.Id == 1 &amp;&amp; userService.UserId != 1)" through the end of the
    /// MayResetAnyNonAdmin block — is BYTE-FROZEN: never refactored, extracted,
    /// re-indented or reworded. Two independent fences fail on any change to it
    /// (.github/scripts/check-login-path-fence.sh and
    /// eFormAPI.Web.Integration.Tests/Security/FrozenGuardBlockTests.cs).
    ///
    /// The duplication is a deliberate decision, not an oversight, recorded as deviation
    /// D-D in the implementation plan. Do NOT "fix" it by extracting a shared helper.
    ///
    /// ███ IF YOU NEED A RULE CHANGED, CHANGE NEITHER COPY — CHANGE THE PLAN. ███
    ///
    /// The two copies are kept in agreement by
    /// eFormAPI.Web.Integration.Tests/Services/PasswordTargetGuardAgreementTests.cs, which
    /// runs BOTH paths through one table of target cases and fails if their verdicts or
    /// their refusal keys ever differ. A one-sided edit turns that suite red.
    /// </summary>
    public async Task<OperationResult> AdminChangePassword(ChangePasswordAdminModel model)
    {
        var user = await userService.GetByUsernameAsync(model.Email);
        if (user == null)
        {
            return new OperationResult(false, localizationService.GetString("UserNotFound"));
        }

        // Every rule below needs the caller's principal; read it once and fail closed
        // immediately when there isn't one, rather than letting a later rule dereference
        // a missing HttpContext.
        var caller = httpContextAccessor.HttpContext?.User;
        if (caller == null)
        {
            return new OperationResult(false, localizationService.GetString("YouMayOnlySetPasswordsForWorkers"));
        }

        // Who may be TARGETED. Who may CALL is the SetOtherUsersPassword policy on the
        // action. The primary-admin guard and the no-admin-target rule mirror
        // AdminService.Update, so editing a user and resetting their password follow
        // one rule.
        if (user.Id == 1 && userService.UserId != 1)
        {
            return new OperationResult(false, localizationService.GetString("CantEditPrimaryAdminUser"));
        }

        var callerIsAdmin = caller.IsInRole(EformRole.Admin);
        if (!callerIsAdmin && await userManager.IsInRoleAsync(user, EformRole.Admin))
        {
            return new OperationResult(false, localizationService.GetString("YouCantViewChangeOrDeleteAdmin"));
        }

        // A non-admin changes their own password through change-password, which requires
        // the current one; this route would skip that check.
        if (!callerIsAdmin && user.Id == userService.UserId)
        {
            return new OperationResult(false, localizationService.GetString("UseChangePasswordForYourOwnAccount"));
        }

        // A caller who reached this route on device_users_update alone manages property
        // workers, so they may reset only a live worker's account. Being a worker is not
        // the same as holding only a worker's rights — a user manager who also logs time
        // is a live worker — so the target must also hold no permission the caller itself
        // lacks, or resetting their password would hand the caller rights it does not have.
        if (!AccountPolicies.MayResetAnyNonAdmin(caller))
        {
            if (!await workerAccountLookup.IsLiveWorkerAsync(user.Email))
            {
                return new OperationResult(false, localizationService.GetString("YouMayOnlySetPasswordsForWorkers"));
            }

            var targetClaims = await claimsService.GetUserClaims(user.Id);
            if (targetClaims.Any(claim => !caller.HasClaim(claim.Type, AuthConsts.ClaimDefaultValue)))
            {
                return new OperationResult(false,
                    localizationService.GetString("YouCantSetPasswordForMorePrivilegedAccount"));
            }
        }

        var result = await userManager.ReplacePasswordAsync(user, model.NewPassword, logger);
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(x => x.Description).ToArray();
            return new OperationResult(false, string.Join(" ", errors));
        }

        return new OperationResult(true, localizationService.GetString("PasswordSuccessfullyUpdated"));
    }

    /// <summary>
    /// Who may be TARGETED by the link-targeted password set.
    ///
    /// ███ THIS IS THE SECOND OF TWO COPIES OF THESE RULES. ███
    ///
    /// The first copy is inline in <see cref="AdminChangePassword"/> above, and it is
    /// BYTE-FROZEN: it is never refactored, extracted, re-indented or reworded, and two
    /// independent fences fail on any change to it
    /// (.github/scripts/check-login-path-fence.sh and
    /// eFormAPI.Web.Integration.Tests/Security/FrozenGuardBlockTests.cs).
    ///
    /// The duplication is a deliberate decision, not an oversight: the frozen block has
    /// survived several security reviews in exactly its current form, and reopening it
    /// for a refactor was judged not worth the risk. Do NOT "fix" this by extracting a
    /// shared helper — that decision was made explicitly and is recorded in the
    /// implementation plan as deviation D-D.
    ///
    /// ███ IF YOU EDIT A RULE HERE, EDIT NOTHING THERE — EDIT THE PLAN. ███
    ///
    /// The two copies are kept in agreement by
    /// eFormAPI.Web.Integration.Tests/Services/PasswordTargetGuardAgreementTests.cs,
    /// which runs BOTH paths through one table of target cases and fails if their
    /// verdicts or their refusal keys ever differ. A one-sided edit turns that suite red.
    ///
    /// Rule by rule, mirroring the frozen copy in the same order with the same keys:
    ///   1. no caller principal                      → YouMayOnlySetPasswordsForWorkers
    ///   2. target is Id 1 and caller is not          → CantEditPrimaryAdminUser
    ///   3. non-admin caller, target holds admin      → YouCantViewChangeOrDeleteAdmin
    ///   4. non-admin caller targeting itself         → UseChangePasswordForYourOwnAccount
    ///   5. device-user-manager, target not a live worker
    ///                                                → YouMayOnlySetPasswordsForWorkers
    ///   6. device-user-manager, target holds a claim the caller lacks
    ///                                                → YouCantSetPasswordForMorePrivilegedAccount
    ///
    /// Deliberately NOT a rule here: EformUser.IsActive. Upstream added it as a LOGIN
    /// gate, and no password path consults it — adding one here only would make the
    /// agreement test fail by construction (deviation D-F). The flag is REPORTED instead,
    /// on SetLinkedPasswordResult.TargetIsActive.
    /// </summary>
    private async Task<PasswordTargetDecision> EvaluateLinkedTargetGuards(EformUser user)
    {
        // RULE 1. Every rule below needs the caller's principal; read it once and fail
        // closed immediately when there isn't one, rather than letting a later rule
        // dereference a missing HttpContext.
        var caller = httpContextAccessor.HttpContext?.User;
        if (caller == null)
        {
            return PasswordTargetDecision.Refuse(
                PasswordTargetRefusal.NoCallerPrincipal, "YouMayOnlySetPasswordsForWorkers");
        }

        // RULE 2. The primary admin can only be targeted by itself. Decision D-1: never
        // relaxed, parameterised or exempted — not for a linked account, not for an admin
        // caller, not when a link exists. Link creation already refuses tenant user Id 1
        // (ExternalUserLinkService.CreateLink), so this branch is defence in depth: it
        // exists to keep the endpoint safe against a link created out-of-band or written
        // straight into the database.
        if (user.Id == 1 && userService.UserId != 1)
        {
            return PasswordTargetDecision.Refuse(
                PasswordTargetRefusal.PrimaryAdmin, "CantEditPrimaryAdminUser");
        }

        var callerIsAdmin = caller.IsInRole(EformRole.Admin);

        // RULE 3. A non-admin may not reset an administrator's password. Mirrors
        // AdminService.Update, so editing a user and resetting their password follow one
        // rule. A principal that cannot reset an admin through change-password-admin
        // cannot reset one through this route either.
        if (!callerIsAdmin && await userManager.IsInRoleAsync(user, EformRole.Admin))
        {
            return PasswordTargetDecision.Refuse(
                PasswordTargetRefusal.TargetIsAdmin, "YouCantViewChangeOrDeleteAdmin");
        }

        // RULE 4. A non-admin changes their own password through change-password, which
        // requires the current one; this route would skip that check.
        if (!callerIsAdmin && user.Id == userService.UserId)
        {
            return PasswordTargetDecision.Refuse(
                PasswordTargetRefusal.OwnAccount, "UseChangePasswordForYourOwnAccount");
        }

        // RULES 5 and 6. A caller who reached this route on device_users_update alone
        // manages property workers, so they may reset only a live worker's account. Being
        // a worker is not the same as holding only a worker's rights — a user manager who
        // also logs time is a live worker — so the target must also hold no permission
        // the caller itself lacks, or resetting their password would hand the caller
        // rights it does not have.
        if (!AccountPolicies.MayResetAnyNonAdmin(caller))
        {
            if (!await workerAccountLookup.IsLiveWorkerAsync(user.Email))
            {
                return PasswordTargetDecision.Refuse(
                    PasswordTargetRefusal.NotALiveWorker, "YouMayOnlySetPasswordsForWorkers");
            }

            var targetClaims = await claimsService.GetUserClaims(user.Id);
            if (targetClaims.Any(claim => !caller.HasClaim(claim.Type, AuthConsts.ClaimDefaultValue)))
            {
                return PasswordTargetDecision.Refuse(
                    PasswordTargetRefusal.MorePrivilegedAccount,
                    "YouCantSetPasswordForMorePrivilegedAccount");
            }
        }

        return PasswordTargetDecision.Allow;
    }

    /// <summary>
    /// Sets the password of the account linked to (<paramref name="model"/>.LoginProvider,
    /// ProviderKey), and of no other account.
    ///
    /// THIS ENDPOINT CANNOT NAME A USER. There is no email parameter, no user-id
    /// parameter and no fallback lookup: the target is resolved only by
    /// FindByLoginAsync against a link an administrator created explicitly. That single
    /// property is what makes the wrong-person failure structurally impossible — a
    /// caller holding the credential does not get to choose a target.
    ///
    /// It is strictly NARROWER than change-password-admin, which any principal passing
    /// the same policy can already call with an arbitrary email, subject to the same
    /// target guards. It subtracts the caller's reach; it adds none.
    /// </summary>
    public async Task<OperationDataResult<SetLinkedPasswordResult>> SetLinkedAccountPassword(
        SetLinkedAccountPasswordModel model)
    {
        // 1. One supported provider. This is not a generic external-login tool, and a
        //    malformed request is the only case that fails rather than returning a verdict.
        if (!ExternalLoginProviders.IsSupported(model.LoginProvider))
        {
            return new OperationDataResult<SetLinkedPasswordResult>(false,
                localizationService.GetString("UnsupportedExternalLoginProvider"));
        }

        if (string.IsNullOrWhiteSpace(model.ProviderKey))
        {
            return new OperationDataResult<SetLinkedPasswordResult>(false,
                localizationService.GetString("ExternalLinkProviderKeyRequired"));
        }

        // 2. The ONLY way this method learns which account to touch. Always the constant,
        //    never the caller's spelling of the provider.
        var user = await userManager.FindByLoginAsync(
            ExternalLoginProviders.MyMicroting, model.ProviderKey);
        if (user == null)
        {
            // No password is changed. Nothing is looked up by email as a consolation.
            return Decided(new SetLinkedPasswordResult
            {
                Outcome = SetLinkedPasswordOutcome.NoLink,
                Detail = localizationService.GetString("NoLinkedAccountForProviderKey")
            }, model.ProviderKey);
        }

        // 3. Provider-filtered re-read. The schema permits one account to hold two
        //    different provider keys, and we cannot add a unique index on
        //    (LoginProvider, UserId) without a migration in every installation. So an
        //    account carrying more than one of OUR links is undecidable, and its password
        //    is never changed: the residual race fails closed, costing a manual relink,
        //    rather than failing open and setting someone's password. Filtering by
        //    provider also keeps a future Google login on the same account from reading
        //    as our ambiguity.
        var ourLinks = (await userManager.GetLoginsAsync(user))
            .Where(x => x.LoginProvider == ExternalLoginProviders.MyMicroting)
            .ToList();
        if (ourLinks.Count > 1)
        {
            return Decided(new SetLinkedPasswordResult
            {
                Outcome = SetLinkedPasswordOutcome.AmbiguousLink,
                TargetUserId = user.Id,
                TargetEmail = user.Email,
                TargetIsActive = user.IsActive,
                Detail = localizationService.GetString("AmbiguousExternalLink")
            }, model.ProviderKey);
        }

        // 4. This path's OWN copy of the target rules — see EvaluateLinkedTargetGuards's
        //    doc comment for why there are two copies and what keeps them equal.
        var decision = await EvaluateLinkedTargetGuards(user);
        if (!decision.Allowed)
        {
            return Decided(new SetLinkedPasswordResult
            {
                Outcome = decision.Refusal == PasswordTargetRefusal.PrimaryAdmin
                    ? SetLinkedPasswordOutcome.RefusedPrimaryAdmin
                    : SetLinkedPasswordOutcome.RefusedByPolicy,
                TargetUserId = user.Id,
                TargetEmail = user.Email,
                TargetIsActive = user.IsActive,
                Detail = localizationService.GetString(decision.MessageKey)
            }, model.ProviderKey);
        }

        // 5. The SAME password write as change-password-admin and as user management:
        //    UserManagerLockoutExtensions.ReplacePasswordAsync. One shared home for the
        //    write means this endpoint cannot drift from the others, and it inherits both
        //    the atomic reset (a validation failure leaves the row untouched, so the old
        //    password still works) and the lockout lift that every password path performs
        //    — a lockout answers with the same message as a wrong password, so without it
        //    a just-reset account would be refused with its NEW password.
        var identityResult = await userManager.ReplacePasswordAsync(
            user, model.NewPassword, logger);
        if (!identityResult.Succeeded)
        {
            return Decided(new SetLinkedPasswordResult
            {
                Outcome = SetLinkedPasswordOutcome.PasswordRejected,
                TargetUserId = user.Id,
                TargetEmail = user.Email,
                TargetIsActive = user.IsActive,
                Detail = string.Join(" ", identityResult.Errors.Select(x => x.Description))
            }, model.ProviderKey);
        }

        return Decided(new SetLinkedPasswordResult
        {
            Outcome = SetLinkedPasswordOutcome.Changed,
            TargetUserId = user.Id,
            TargetEmail = user.Email,
            TargetIsActive = user.IsActive,
            Detail = localizationService.GetString("PasswordSuccessfullyUpdated")
        }, model.ProviderKey);
    }

    /// <summary>
    /// Wraps a decided verdict and emits the one structured log line this endpoint owes a
    /// local administrator: it is the only record on this installation's own side that a
    /// my.microting.com-initiated password change happened, so it must name the RESOLVED
    /// target user id — without that, the line is unauditable from here.
    ///
    /// NEVER the password, never a hash of it, never a prefix, length or fingerprint: a
    /// length leak is a real leak against a 6-character minimum.
    ///
    /// Success is true for every DECIDED verdict, because the caller reads Outcome rather
    /// than Success; Success is false only for a malformed request.
    /// </summary>
    private OperationDataResult<SetLinkedPasswordResult> Decided(
        SetLinkedPasswordResult result, string providerKey)
    {
        var caller = httpContextAccessor.HttpContext?.User;
        logger.LogInformation(
            "set-linked-account-password: callerUserId={CallerUserId}, callerEmail={CallerEmail}, " +
            "loginProvider={LoginProvider}, providerKey={ProviderKey}, " +
            "targetUserId={TargetUserId}, outcome={Outcome}",
            // Read through the principal, so a request with none logs null rather than
            // dereferencing a missing HttpContext inside IUserService.
            caller == null ? null : (int?)userService.UserId,
            caller?.FindFirst(ClaimTypes.Email)?.Value ?? caller?.Identity?.Name,
            ExternalLoginProviders.MyMicroting,
            providerKey,
            result.TargetUserId,
            result.Outcome);

        return new OperationDataResult<SetLinkedPasswordResult>(true, result);
    }

    public async Task<OperationResult> ProfilePictureDelete()
    {
        var user = await userService.GetCurrentUserAsync();
        if (user == null)
        {
            return new OperationResult(false, localizationService.GetString("UserNotFound"));
        }
        user.ProfilePicture = null;
        user.ProfilePictureSnapshot = null;
        await userManager.UpdateAsync(user);

        return new OperationResult(true);
    }

    public async Task<OperationResult> ForgotPassword(ForgotPasswordModel model)
    {
        var core = await coreHelper.GetCore();
        var user = await userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return new OperationResult(false, $"User with {model.Email} not found");
        }

        // Set the culture based on user locale
        if (!string.IsNullOrEmpty(user.Locale))
        {
            var culture = new CultureInfo(user.Locale);
            CultureInfo.CurrentCulture = culture;
            CultureInfo.CurrentUICulture = culture;
        }


        var code = HttpUtility.UrlEncode(await userManager.GeneratePasswordResetTokenAsync(user));
        var link = await core.GetSdkSetting(Settings.httpServerAddress);
        link = $"{link}/auth/restore-password-confirmation?userId={user.Id}&code={code}";
/*            await _emailSender.SendEmailAsync(user.Email, "EForm Password Reset",
                "Please reset your password by clicking <a href=\"" + link + "\">here</a>");*/

        var html = string.Format(localizationService.GetString("ForgotPasswordEmailHtml"),
            user.FirstName,
            user.LastName,
            link);

        await emailService.SendAsync(
            EformEmailConst.FromEmail,
            "no-reply@microting.com",
            localizationService.GetString("ForgotPasswordEmailSubject"),
            user.Email,
            html: html);

        return new OperationResult(true);
    }


    public async Task<OperationResult> ResetPassword(Infrastructure.Models.ResetPasswordModel model)
    {
        var user = await userManager.FindByIdAsync(model.UserId.ToString());
        if (user == null)
        {
            return new OperationResult(false);
        }

        if (await userManager.IsDelegatedPrincipalAsync(user))
        {
            logger.LogWarning("Refused to reset the password of user {UserId}: the account is a delegated principal",
                user.Id);
            return new OperationResult(false, UserManagerLockoutExtensions.CredentialLessAccountResult()
                .Errors.First().Description);
        }

        var result = await userManager.ResetPasswordAsync(user, model.Code, model.NewPassword);
        if (result.Succeeded)
        {
            await userManager.LiftLockoutAsync(user, logger);
            return new OperationResult(true);
        }

        return new OperationResult(false, string.Join(" ", result.Errors.Select(x=>x.Description).ToArray()));
    }
}