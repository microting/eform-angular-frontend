using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.WritableOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using Microting.eFormApi.BasePn.Infrastructure.Models.User;

namespace eFormAPI.Web.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserService _userService;
        private readonly IWritableOptions<ApplicationSettings> _appSettings;
        private readonly ILogger<AdminService> _logger;
        private readonly ILocalizationService _localizationService;
        private readonly UserManager<EformUser> _userManager;

        public AdminService(ILogger<AdminService> logger,
            UserManager<EformUser> userManager,
            IWritableOptions<ApplicationSettings> appSettings,
            IUserService userService, 
            ILocalizationService localizationService)
        {
            _logger = logger;
            _userManager = userManager;
            _appSettings = appSettings;
            _userService = userService;
            _localizationService = localizationService;
        }

        public async Task<OperationDataResult<UserRegisterModel>> GetUser(int userId)
        {
            try
            {
                EformUser user = await _userService.GetByIdAsync(userId);
                if (user == null)
                {
                    return new OperationDataResult<UserRegisterModel>(false,
                        _localizationService.GetString("UserNotFound"));
                }

                UserRegisterModel result = new UserRegisterModel()
                {
                    Email = user.Email,
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                };
                // get role
                IList<string> roles = await _userManager.GetRolesAsync(user);
                result.Role = roles.FirstOrDefault();
                return new OperationDataResult<UserRegisterModel>(true, result);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return new OperationDataResult<UserRegisterModel>(false,
                    _localizationService.GetString("ErrorWhileObtainUsers"));
            }
        }

        public OperationDataResult<UserInfoModelList> GetAllUsers(PaginationModel paginationModel)
        {
            try
            {
                List<UserInfoViewModel> userList = new List<UserInfoViewModel>();
                List<EformUser> userResult = _userManager.Users
                    .Include(x => x.UserRoles)
                    .ThenInclude(x => x.Role)
                    .OrderBy(z => z.Id)
                    .Skip(paginationModel.Offset)
                    .Take(paginationModel.PageSize)
                    .ToList();

                userResult.ForEach(userItem =>
                {
                    string roleName = userItem.UserRoles.Select(y => y.Role.Name).FirstOrDefault();
                    UserInfoViewModel modelItem = new UserInfoViewModel();
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
                int totalUsers = _userManager.Users.Count();
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
                    _localizationService.GetString("ErrorWhileObtainUsers"));
            }
        }

        public async Task<OperationResult> UpdateUser(UserRegisterModel userRegisterModel)
        {
            try
            {
                EformUser user = await _userService.GetByIdAsync(userRegisterModel.Id);
                if (user == null)
                {
                    return new OperationResult(false,
                        _localizationService.GetString("UserNotFoundUserName", userRegisterModel.UserName));
                }

                if (userRegisterModel.Role == null)
                {
                    return new OperationResult(false, _localizationService.GetString("RoleIsRequired"));
                }

                user.Email = userRegisterModel.Email;
                user.UserName = userRegisterModel.UserName;
                user.FirstName = userRegisterModel.FirstName;
                user.LastName = userRegisterModel.LastName;
                IdentityResult result = await _userManager.UpdateAsync(user);
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
                return new OperationResult(true, _localizationService.GetString("UserUserNameWasUpdated", user.UserName));
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return new OperationResult(false, _localizationService.GetString("ErrorWhileUpdatingUser"));
            }
        }

        public async Task<OperationResult> CreateUser(UserRegisterModel userRegisterModel)
        {
            try
            {
                EformUser userResult = await _userManager.FindByNameAsync(userRegisterModel.UserName);
                if (userResult != null)
                {
                    return new OperationResult(false,
                        _localizationService.GetString("UserUserNameAlreadyExist", userRegisterModel.UserName));
                }

                if (userRegisterModel.Role == null)
                {
                    return new OperationResult(false, _localizationService.GetString("RoleIsRequired"));
                }

                EformUser user = new EformUser
                {
                    Email = userRegisterModel.Email,
                    UserName = userRegisterModel.UserName,
                    FirstName = userRegisterModel.FirstName,
                    LastName = userRegisterModel.LastName,
                    TwoFactorEnabled = false,
                    IsGoogleAuthenticatorEnabled = false
                };

                IdentityResult result = await _userManager.CreateAsync(user, userRegisterModel.Password);
                if (!result.Succeeded)
                {
                    return new OperationResult(false, string.Join(" ", result.Errors));
                }

                // change role
                await _userManager.AddToRoleAsync(user, userRegisterModel.Role.ToLower());
                return new OperationResult(true, _localizationService.GetString("UserUserNameWasCreated", user.UserName));
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return new OperationResult(false, _localizationService.GetString("ErrorWhileCreatingUser"));
            }
        }

        public async Task<OperationResult> DeleteUser(int userId)
        {
            try
            {
                if (userId == 1)
                {
                    return new OperationResult(false, _localizationService.GetString("CantDeletePrimaryAdminUser"));
                }

                EformUser user = await _userService.GetByIdAsync(userId);
                if (user == null)
                {
                    return new OperationResult(false, _localizationService.GetString("UserUserNameNotFound", userId));
                }

                IdentityResult result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    return new OperationResult(false, string.Join(" ", result.Errors));
                }

                return new OperationResult(true, _localizationService.GetString("UserParamWasDeleted", userId));
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return new OperationResult(false, _localizationService.GetString("ErrorWhileDeletingUser"));
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