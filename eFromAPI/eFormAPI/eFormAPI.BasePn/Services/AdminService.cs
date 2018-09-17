using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.BasePn.Abstractions;
using eFormAPI.BasePn.Database.Entities;
using eFormAPI.BasePn.Helpers.WritableOptions;
using eFormAPI.BasePn.Infrastructure.Helpers;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models.Application;
using eFormAPI.BasePn.Models.Common;
using eFormAPI.BasePn.Models.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace eFormAPI.BasePn.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserService _userService;
        private readonly IWritableOptions<ApplicationSettings> _appSettings;
        private readonly ILogger<AdminService> _logger;
        private readonly UserManager<EformUser> _userManager;

        public AdminService(ILogger<AdminService> logger,
            UserManager<EformUser> userManager,
            IWritableOptions<ApplicationSettings> appSettings,
            IUserService userService)
        {
            _logger = logger;
            _userManager = userManager;
            _appSettings = appSettings;
            _userService = userService;
        }

        public async Task<OperationDataResult<UserRegisterModel>> GetUser(int userId)
        {
            try
            {
                var user = await _userService.GetByIdAsync(userId);
                if (user == null)
                {
                    return new OperationDataResult<UserRegisterModel>(false,
                        LocaleHelper.GetString("UserNotFound"));
                }

                var result = new UserRegisterModel()
                {
                    Email = user.Email,
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                };
                // get role
                var roles = await _userManager.GetRolesAsync(user);
                result.Role = roles.FirstOrDefault();
                return new OperationDataResult<UserRegisterModel>(true, result);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return new OperationDataResult<UserRegisterModel>(false,
                    LocaleHelper.GetString("ErrorWhileObtainUsers"));
            }
        }

        public OperationDataResult<UserInfoModelList> GetAllUsers(PaginationModel paginationModel)
        {
            try
            {
                var userList = new List<UserInfoViewModel>();
                var userResult = _userManager.Users
                    .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                    .OrderBy(z => z.Id)
                    .Skip(paginationModel.Offset)
                    .Take(paginationModel.PageSize)
                    .ToList();

                userResult.ForEach(userItem =>
                {
                    var roleName = userItem.UserRoles.Select(y => y.Role.Name).FirstOrDefault();
                    var modelItem = new UserInfoViewModel();
                    if (roleName != null)
                    {
                        modelItem.Role = roleName;
                    }

                    modelItem.FirstName = userItem.FirstName;
                    modelItem.LastName = userItem.LastName;
                    modelItem.Email = userItem.Email;
                    modelItem.Id = userItem.Id;
                    modelItem.UserName = userItem.UserName;
                    userList.Add(modelItem);
                });
                var totalUsers = _userManager.Users.Count();
                return new OperationDataResult<UserInfoModelList>(true, new UserInfoModelList()
                {
                    TotalUsers = totalUsers,
                    UserList = userList
                });
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return new OperationDataResult<UserInfoModelList>(false,
                    LocaleHelper.GetString("ErrorWhileObtainUsers"));
            }
        }

        public async Task<OperationResult> UpdateUser(UserRegisterModel userRegisterModel)
        {
            try
            {
                var user = await _userService.GetByIdAsync(userRegisterModel.Id);
                if (user == null)
                {
                    return new OperationResult(false,
                        LocaleHelper.GetString("UserNotFoundUserName", userRegisterModel.UserName));
                }

                if (userRegisterModel.Role == null)
                {
                    return new OperationResult(false, LocaleHelper.GetString("RoleIsRequired"));
                }

                user.Email = userRegisterModel.Email;
                user.UserName = userRegisterModel.UserName;
                user.FirstName = userRegisterModel.FirstName;
                user.LastName = userRegisterModel.LastName;
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    return new OperationResult(false, string.Join(" ", result.Errors));
                }

                // password
                if (userRegisterModel.Password != null)
                {
                    await _userManager.RemovePasswordAsync(user);
                    await _userManager.AddPasswordAsync(user, userRegisterModel.Password);
                }

                // change role
                await _userManager.RemoveFromRolesAsync(user, new[] {EformRole.Admin, EformRole.User});
                await _userManager.AddToRoleAsync(user, userRegisterModel.Role);
                return new OperationResult(true, LocaleHelper.GetString("UserUserNameWasUpdated", user.UserName));
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileUpdatingUser"));
            }
        }

        public async Task<OperationResult> CreateUser(UserRegisterModel userRegisterModel)
        {
            try
            {
                var userResult = await _userManager.FindByNameAsync(userRegisterModel.UserName);
                if (userResult != null)
                {
                    return new OperationResult(false,
                        LocaleHelper.GetString("UserUserNameAlreadyExist", userRegisterModel.UserName));
                }

                if (userRegisterModel.Role == null)
                {
                    return new OperationResult(false, LocaleHelper.GetString("RoleIsRequired"));
                }

                var user = new EformUser
                {
                    Email = userRegisterModel.Email,
                    UserName = userRegisterModel.UserName,
                    FirstName = userRegisterModel.FirstName,
                    LastName = userRegisterModel.LastName,
                    TwoFactorEnabled = false,
                    IsGoogleAuthenticatorEnabled = false
                };

                var result = await _userManager.CreateAsync(user, userRegisterModel.Password);
                if (!result.Succeeded)
                {
                    return new OperationResult(false, string.Join(" ", result.Errors));
                }

                // change role
                await _userManager.AddToRoleAsync(user, userRegisterModel.Role.ToLower());
                return new OperationResult(true, LocaleHelper.GetString("UserUserNameWasCreated", user.UserName));
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileCreatingUser"));
            }
        }

        public async Task<OperationResult> DeleteUser(int userId)
        {
            try
            {
                if (userId == 1)
                {
                    return new OperationResult(false, LocaleHelper.GetString("CantDeletePrimaryAdminUser"));
                }

                var user = await _userService.GetByIdAsync(userId);
                if (user == null)
                {
                    return new OperationResult(false, LocaleHelper.GetString("UserUserNameNotFound", userId));
                }

                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    return new OperationResult(false, string.Join(" ", result.Errors));
                }

                return new OperationResult(true, LocaleHelper.GetString("UserParamWasDeleted", userId));
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileDeletingUser"));
            }
        }

        public OperationResult EnableTwoFactorAuthForce()
        {
            try
            {
                _appSettings.Update((options) => { options.IsTwoFactorForced = true; });
            }
            catch (Exception)
            {
                return new OperationResult(false);
            }

            return new OperationResult(true);
        }

        public OperationResult DisableTwoFactorAuthForce()
        {
            try
            {
                _appSettings.Update((options) => { options.IsTwoFactorForced = false; });
            }
            catch (Exception)
            {
                return new OperationResult(false);
            }

            return new OperationResult(true);
        }
    }
}