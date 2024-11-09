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

using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using Sentry;

namespace eFormAPI.Web.Services;

using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Permissions;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using System;
using System.Linq;
using System.Threading.Tasks;
using Abstractions;
using Hosting.Helpers.DbOptions;
using Infrastructure.Models.Settings.Admin;
using Infrastructure.Models.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

public class AdminService(
    ILogger<AdminService> logger,
    UserManager<EformUser> userManager,
    IDbOptions<ApplicationSettings> appSettings,
    IUserService userService,
    ILocalizationService localizationService,
    BaseDbContext dbContext,
    IEFormCoreService coreHelper)
    : IAdminService
{
    public async Task<OperationDataResult<Paged<UserInfoViewModel>>> Index(UserInfoRequest requestModel)
    {
        try
        {
            var core = await coreHelper.GetCore();
            var sdkDbContext = core.DbContextHelper.GetDbContext();
            var userQuery = userManager.Users
                .AsNoTracking()
                .AsQueryable();


            // get count
            var totalUsers = await userQuery.Select(x => x.Id).CountAsync();

            // pagination
            userQuery = userQuery
                .Skip(requestModel.Offset)
                .Take(requestModel.PageSize);

            // add select
            var userQueryWithSelect = userQuery.Select(x => new UserInfoViewModel
            {
                Role = x.UserRoles.Select(y => y.Role.Name).FirstOrDefault(),
                FirstName = x.FirstName,
                LastName = x.LastName,
                Id = x.Id,
                UserName = x.UserName,
                Email = x.Email,
                DarkTheme = x.DarkTheme,
                Language = x.Locale,
                TimeZone = x.TimeZone,
                Formats = x.Formats,
                IsDeviceUser = false,
                ArchiveModel = x.ArchiveModel,
                ArchiveManufacturer = x.ArchiveManufacturer,
                ArchiveOsVersion = x.ArchiveOsVersion,
                ArchiveSoftwareVersion = x.ArchiveSoftwareVersion,
                TimeRegistrationModel = x.TimeRegistrationModel,
                TimeRegistrationManufacturer = x.TimeRegistrationManufacturer,
                TimeRegistrationOsVersion = x.TimeRegistrationOsVersion,
                TimeRegistrationSoftwareVersion = x.TimeRegistrationSoftwareVersion
            });

            // sort
            if (!string.IsNullOrEmpty(requestModel.Sort))
            {
                if (requestModel.IsSortDsc)
                {
                    userQueryWithSelect = userQueryWithSelect
                        .CustomOrderByDescending(requestModel.Sort);
                }
                else
                {
                    userQueryWithSelect = userQueryWithSelect
                        .CustomOrderBy(requestModel.Sort);
                }
            }
            else
            {
                userQueryWithSelect = userQueryWithSelect
                    .OrderBy(x => x.Id);
            }

            // get from db
            var userResult = await userQueryWithSelect.ToListAsync();

            foreach (UserInfoViewModel userInfoViewModel in userResult)
            {
                if (!userInfoViewModel.Email.Contains("microting.com") && !userInfoViewModel.Email.Contains("admin.com"))
                {
                    userInfoViewModel.IsDeviceUser = true;

                    var fullName = userInfoViewModel.FirstName + " " + userInfoViewModel.LastName;
                    if (sdkDbContext.Sites.Any(x =>
                            x.Name.Replace(" ", "") == fullName.Replace(" ", "")
                            && x.WorkflowState != Constants.WorkflowStates.Removed))
                    {
                    }
                    else
                    {
                        await core.SiteCreate($"{userInfoViewModel.FirstName} {userInfoViewModel.LastName}", userInfoViewModel.FirstName, userInfoViewModel.LastName,
                            null, "da");
                    }

                    var site = await sdkDbContext.Sites.FirstOrDefaultAsync(x =>
                        x.Name.Replace(" ", "") == fullName.Replace(" ", "")
                        && x.WorkflowState != Constants.WorkflowStates.Removed);
                    if (site != null)
                    {
                        site.IsLocked = true;
                        await site.Update(sdkDbContext);
                        var units = await sdkDbContext.Units.Where(x => x.SiteId == site.Id).ToListAsync();
                        foreach (Unit unit in units)
                        {
                            unit.IsLocked = true;
                            await unit.Update(sdkDbContext);
                        }
                        var siteWorker = await sdkDbContext.SiteWorkers.SingleOrDefaultAsync(x => x.SiteId == site.Id);
                        var worker = await sdkDbContext.Workers.SingleOrDefaultAsync(x => x.Id == siteWorker.WorkerId);
                        // var worker = await sdkDbContext.Workers.SingleOrDefaultAsync(x => x.FirstName == userInfoViewModel.FirstName
                        //     && x.LastName == userInfoViewModel.LastName
                        //     && x.WorkflowState != Constants.WorkflowStates.Removed);
                        if (worker != null)
                        {
                            worker.IsLocked = true;
                            await worker.Update(sdkDbContext);
                        }
                    }
                }
            }

            return new OperationDataResult<Paged<UserInfoViewModel>>(true, new Paged<UserInfoViewModel>
            {
                Total = totalUsers,
                Entities = userResult
            });
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<Paged<UserInfoViewModel>>(false,
                localizationService.GetString("ErrorWhileObtainUsers"));
        }
    }

    public async Task<OperationResult> Create(UserRegisterModel userRegisterModel)
    {
        try
        {
            var core = await coreHelper.GetCore();
            var sdkDbContext = core.DbContextHelper.GetDbContext();
            if (userRegisterModel.Role != EformRole.Admin && userRegisterModel.Role != EformRole.User)
            {
                return new OperationResult(false,
                    localizationService.GetString("RoleNotFound"));
            }

            if (string.IsNullOrEmpty(userRegisterModel.Password) || userRegisterModel.Password.Length < 6)
            {
                return new OperationResult(false,
                    localizationService.GetString("PasswordIsNotValid"));
            }

            var userResult = await userManager.FindByNameAsync(userRegisterModel.Email);

            if (userResult != null)
            {
                return new OperationResult(false,
                    localizationService.GetStringWithFormat("UserUserNameAlreadyExist", userRegisterModel.Email));
            }

            var dbUser = await dbContext.Users
                .SingleOrDefaultAsync(x => x.FirstName == userRegisterModel.FirstName
                                           && x.LastName == userRegisterModel.LastName);

            if (dbUser != null)
            {
                return new OperationResult(false,
                    localizationService.GetStringWithFormat("UserUserNameAlreadyExist", userRegisterModel.FirstName + " " + userRegisterModel.LastName));
            }

            if (userRegisterModel.Role != EformRole.Admin && !dbContext.SecurityGroups.Any(x => x.Id == userRegisterModel.GroupId))
            {
                return new OperationResult(false,
                    localizationService.GetString("SecurityGroupNotFound"));
            }

            var user = new EformUser
            {
                Email = userRegisterModel.Email,
                UserName = userRegisterModel.Email,
                FirstName = userRegisterModel.FirstName.Trim(),
                LastName = userRegisterModel.LastName.Trim(),
                Locale = "da",
                EmailConfirmed = true,
                TwoFactorEnabled = false,
                IsGoogleAuthenticatorEnabled = false,
                TimeZone = "Europe/Copenhagen",
                Formats = "de-DE"
            };

            var result = await userManager.CreateAsync(user, userRegisterModel.Password);
            if (!result.Succeeded)
            {
                return new OperationResult(false, string.Join(" ", result.Errors.Select(x => x.Description).ToArray()));
            }

            // change role
            await userManager.AddToRoleAsync(user, userRegisterModel.Role);
            // add to group
            if (userRegisterModel.GroupId > 0 && user.Id > 0 && userRegisterModel.Role != EformRole.Admin)
            {
                var securityGroupUser = new SecurityGroupUser()
                {
                    SecurityGroupId = (int)userRegisterModel.GroupId,
                    EformUserId = user.Id
                };
                dbContext.SecurityGroupUsers.Add(securityGroupUser);
                await dbContext.SaveChangesAsync();
            }

            var site = await sdkDbContext.Sites.SingleOrDefaultAsync(x => x.Name == userRegisterModel.FirstName.Trim() + " " + userRegisterModel.LastName.Trim()
                                                                          && x.WorkflowState != Constants.WorkflowStates.Removed);

            if (site != null)
            {
                site.IsLocked = true;
                await site.Update(sdkDbContext);
                var units = await sdkDbContext.Units.Where(x => x.SiteId == site.Id).ToListAsync();
                foreach (Unit unit in units)
                {
                    unit.IsLocked = true;
                    await unit.Update(sdkDbContext);
                }
                var siteWorker = await sdkDbContext.SiteWorkers.SingleOrDefaultAsync(x => x.SiteId == site.Id);
                var worker = await sdkDbContext.Workers.SingleOrDefaultAsync(x => x.Id == siteWorker.WorkerId);
                if (worker != null)
                {
                    worker.IsLocked = true;
                    await worker.Update(sdkDbContext);
                }
            }

            return new OperationResult(true,
                localizationService.GetStringWithFormat("UserUserNameWasCreated", user.UserName));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false, localizationService.GetString("ErrorWhileCreatingUser"));
        }
    }

    public async Task<OperationDataResult<UserRegisterModel>> Read(int userId)
    {
        try
        {
            var user = await userService.GetByIdAsync(userId);
            if (user == null)
            {
                return new OperationDataResult<UserRegisterModel>(false,
                    localizationService.GetString("UserNotFound"));
            }
            var core = await coreHelper.GetCore();
            var sdkDbContext = core.DbContextHelper.GetDbContext();
            var site = await sdkDbContext.Sites.SingleOrDefaultAsync(x => x.Name == user.FirstName + " " + user.LastName
                                                                          && x.WorkflowState != Constants.WorkflowStates.Removed);

            var result = new UserRegisterModel()
            {
                Email = user.Email,
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                IsDeviceUser = site != null
            };
            // get role
            var roles = await userManager.GetRolesAsync(user);
            result.Role = roles.FirstOrDefault();
            // get user group
            result.GroupId = await dbContext.SecurityGroupUsers
                .Where(x => x.EformUserId == user.Id)
                .Select(x => x.SecurityGroup.Id)
                .FirstOrDefaultAsync();

            return new OperationDataResult<UserRegisterModel>(true, result);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<UserRegisterModel>(false,
                localizationService.GetString("ErrorWhileObtainUsers"));
        }
    }

    public async Task<OperationResult> Update(UserRegisterModel userRegisterModel)
    {
        try
        {
            var core = await coreHelper.GetCore();
            var sdkDbContext = core.DbContextHelper.GetDbContext();
            if (userRegisterModel.Id == 1 && userService.UserId != 1)
            {
                return new OperationResult(false, localizationService.GetString("CantEditPrimaryAdminUser"));
            }

            if (userRegisterModel.Role != EformRole.Admin && userRegisterModel.Role != EformRole.User)
            {
                return new OperationResult(false,
                    localizationService.GetString("RoleNotFound"));
            }

            var user = await userService.GetByIdAsync(userRegisterModel.Id);
            if (user == null)
            {
                return new OperationResult(false,
                    localizationService.GetStringWithFormat("UserNotFoundUserName", userRegisterModel.UserName));
            }

            // get role
            var roles = await userManager.GetRolesAsync(user);
            if (user.Id == 1 && roles.Any(x => x != userRegisterModel.Role))
            {
                return new OperationResult(false, localizationService.GetString("CantUpdateRoleForPrimaryAdminUser"));
            }

            var isAdmin = await userManager.IsInRoleAsync(user, EformRole.Admin);
            if (!dbContext.SecurityGroups.Any(x => x.Id == userRegisterModel.GroupId) && !isAdmin && userRegisterModel.Role != EformRole.Admin)
            {
                return new OperationResult(false,
                    localizationService.GetString("SecurityGroupNotFound"));
            }

            if (isAdmin && userService.Role != EformRole.Admin)
            {
                return new OperationResult(false, localizationService.GetString("YouCantViewChangeOrDeleteAdmin"));
            }

            var site = await sdkDbContext.Sites.SingleOrDefaultAsync(x => x.Name == user.FirstName + " " + user.LastName
                                                                          && x.WorkflowState != Constants.WorkflowStates.Removed);
            if (site != null)
            {
                var language = await sdkDbContext.Languages.SingleAsync(x => x.Id == site.LanguageId);

                await core.SiteUpdate((int)site.MicrotingUid,
                    $"{userRegisterModel.FirstName} {userRegisterModel.LastName}", userRegisterModel.FirstName,
                    userRegisterModel.LastName, userRegisterModel.Email, language.LanguageCode);
            }
            user.Email = userRegisterModel.Email;
            user.EmailConfirmed = true;
            user.UserName = userRegisterModel.Email;
            user.FirstName = userRegisterModel.FirstName;
            user.LastName = userRegisterModel.LastName;

            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return new OperationResult(false, string.Join(" ", result.Errors.Select(x => x.Description).ToArray()));
            }

            // password
            if (!string.IsNullOrEmpty(userRegisterModel.Password) && userRegisterModel.Password != " ")
            {
                await userManager.RemovePasswordAsync(user);
                await userManager.AddPasswordAsync(user, userRegisterModel.Password);
            }

            // change role
            if (!await userManager.IsInRoleAsync(user, userRegisterModel.Role))
            {
                var currentUserRole = await userManager.GetRolesAsync(user);
                await userManager.RemoveFromRolesAsync(user, currentUserRole);

                await userManager.AddToRoleAsync(user, userRegisterModel.Role);
            }

            // Change group
            if (userRegisterModel.GroupId > 0 && user.Id > 0)
            {
                var securityGroupUsers = dbContext.SecurityGroupUsers
                    .Where(x => x.EformUserId == user.Id
                                && x.SecurityGroupId != userRegisterModel.GroupId);

                dbContext.SecurityGroupUsers.RemoveRange(securityGroupUsers);
                if (!dbContext.SecurityGroupUsers.Any(x =>
                        x.EformUserId == user.Id && x.SecurityGroupId == userRegisterModel.GroupId))
                {
                    var securityGroupUser = new SecurityGroupUser()
                    {
                        SecurityGroupId = (int)userRegisterModel.GroupId,
                        EformUserId = user.Id
                    };
                    dbContext.SecurityGroupUsers.Add(securityGroupUser);
                }

                await dbContext.SaveChangesAsync();
            }

            if (userRegisterModel.Role == EformRole.Admin)
            {
                var securityGroupUsers = await dbContext.SecurityGroupUsers.Where(x => x.EformUserId == user.Id)
                    .ToListAsync();

                if (securityGroupUsers.Any())
                {
                    dbContext.SecurityGroupUsers.RemoveRange(securityGroupUsers);

                    await dbContext.SaveChangesAsync();
                }
            }

            return new OperationResult(true,
                localizationService.GetStringWithFormat("UserUserNameWasUpdated", user.UserName));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false, localizationService.GetString("ErrorWhileUpdatingUser"));
        }
    }

    public async Task<OperationResult> Delete(int userId)
    {
        try
        {
            var core = await coreHelper.GetCore();
            var sdkDbContext = core.DbContextHelper.GetDbContext();
            if (userId == 1)
            {
                return new OperationResult(false, localizationService.GetString("CantDeletePrimaryAdminUser"));
            }

            var user = await userService.GetByIdAsync(userId);
            if (await userManager.IsInRoleAsync(user, EformRole.Admin)
                && userService.Role != EformRole.Admin)
            {
                return new OperationResult(false, localizationService.GetString("YouCantViewChangeOrDeleteAdmin"));
            }

            if (user == null)
            {
                return new OperationResult(false, localizationService.GetStringWithFormat("UserUserNameNotFound", userId));
            }

            var site = await sdkDbContext.Sites.SingleOrDefaultAsync(x => x.Name == user.FirstName + " " + user.LastName
                                                                          && x.WorkflowState != Constants.WorkflowStates.Removed);
            if (site != null)
            {
                site.IsLocked = false;
                await site.Update(sdkDbContext);
                var units = await sdkDbContext.Units.Where(x => x.SiteId == site.Id).ToListAsync();
                foreach (Unit unit in units)
                {
                    unit.IsLocked = false;
                    await unit.Update(sdkDbContext);
                }
                var siteWorker = await sdkDbContext.SiteWorkers.SingleOrDefaultAsync(x => x.SiteId == site.Id);
                var worker = await sdkDbContext.Workers.SingleOrDefaultAsync(x => x.Id == siteWorker.WorkerId);
                if (worker != null)
                {
                    worker.IsLocked = false;
                    await worker.Update(sdkDbContext);
                }
            }

            var result = await userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return new OperationResult(false, string.Join(" ", result.Errors.Select(x => x.Description).ToArray()));
            }

            return new OperationResult(true, localizationService.GetStringWithFormat("UserParamWasDeleted", userId));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false, localizationService.GetString("ErrorWhileDeletingUser"));
        }
    }

    public async Task<OperationResult> EnableTwoFactorAuthForce()
    {
        try
        {
            await appSettings.UpdateDb((options) => { options.IsTwoFactorForced = true; }, dbContext);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false);
        }

        return new OperationResult(true);
    }

    public async Task<OperationResult> DisableTwoFactorAuthForce()
    {
        try
        {
            await appSettings.UpdateDb((options) => { options.IsTwoFactorForced = false; }, dbContext);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false);
        }

        return new OperationResult(true);
    }

    public async Task<OperationResult> UpdateUserbackWidget(bool isEnableWidget)
    {
        try
        {
            await appSettings.UpdateDb((options) => { options.IsUserbackWidgetEnabled = isEnableWidget; }, dbContext);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false);
        }

        return new OperationResult(true);
    }

#pragma warning disable CS1998
    public async Task<OperationDataResult<UserbackWidgetModel>> GetUserbackWidget()
#pragma warning restore CS1998
    {
        try
        {
            var userbackWidgetModel = new UserbackWidgetModel { IsUserbackWidgetEnabled = appSettings.Value.IsUserbackWidgetEnabled, UserbackToken = appSettings.Value.UserbackToken };

            return new OperationDataResult<UserbackWidgetModel>(true, userbackWidgetModel);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<UserbackWidgetModel>(false);
        }
    }
}