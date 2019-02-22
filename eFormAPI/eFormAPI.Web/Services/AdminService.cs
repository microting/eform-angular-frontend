using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Models.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

namespace eFormAPI.Web.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserService _userService;
        private readonly IDbOptions<ApplicationSettings> _appSettings;
        private readonly ILogger<AdminService> _logger;
        private readonly ILocalizationService _localizationService;
        private readonly BaseDbContext _dbContext;
        private readonly UserManager<EformUser> _userManager;

        public AdminService(ILogger<AdminService> logger,
            UserManager<EformUser> userManager,
            IDbOptions<ApplicationSettings> appSettings,
            IUserService userService,
            ILocalizationService localizationService,
            BaseDbContext dbContext)
        {
            _logger = logger;
            _userManager = userManager;
            _appSettings = appSettings;
            _userService = userService;
            _localizationService = localizationService;
            _dbContext = dbContext;
        }

        public async Task<OperationDataResult<UserRegisterModel>> GetUser(int userId)
        {
            try
            {
                var user = await _userService.GetByIdAsync(userId);
                if (user == null)
                {
                    return new OperationDataResult<UserRegisterModel>(false,
                        _localizationService.GetString("UserNotFound"));
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
                // get user group
                result.GroupId = await _dbContext.SecurityGroupUsers
                    .Where(x => x.EformUserId == user.Id)
                    .Select(x => x.SecurityGroup.Id)
                    .FirstOrDefaultAsync();

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
                    _localizationService.GetString("ErrorWhileObtainUsers"));
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
                        _localizationService.GetStringWithFormat("UserNotFoundUserName", userRegisterModel.UserName));
                }

                var isAdmin = await _userManager.IsInRoleAsync(user, EformRole.Admin);
                if (!_dbContext.SecurityGroups.Any(x => x.Id == userRegisterModel.GroupId) && !isAdmin)
                {
                    return new OperationResult(false,
                        _localizationService.GetString("SecurityGroupNotFound"));
                }

                if (userRegisterModel.Role == null)
                {
                    return new OperationResult(false, _localizationService.GetString("RoleIsRequired"));
                }

                if (isAdmin && _userService.Role != EformRole.Admin)
                {
                    return new OperationResult(false, _localizationService.GetString("YouCantViewChangeOrDeleteAdmin"));
                }

                user.Email = userRegisterModel.Email;
                user.EmailConfirmed = true;
                user.UserName = userRegisterModel.Email;
                user.FirstName = userRegisterModel.FirstName;
                user.LastName = userRegisterModel.LastName;
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    return new OperationResult(false, string.Join(" ", result.Errors.Select(x=>x.Description).ToArray()));
                }

                // password
                if (userRegisterModel.Password != null)
                {
                    await _userManager.RemovePasswordAsync(user);
                    await _userManager.AddPasswordAsync(user, userRegisterModel.Password);
                }

                // Change group
                if (userRegisterModel.GroupId > 0 && user.Id > 0)
                {
                    var securityGroupUsers = _dbContext.SecurityGroupUsers
                        .Where(x => x.EformUserId == user.Id
                                    && x.SecurityGroupId != userRegisterModel.GroupId);

                    _dbContext.SecurityGroupUsers.RemoveRange(securityGroupUsers);
                    if (!_dbContext.SecurityGroupUsers.Any(x =>
                        x.EformUserId == user.Id && x.SecurityGroupId == userRegisterModel.GroupId))
                    {
                        var securityGroupUser = new SecurityGroupUser()
                        {
                            SecurityGroupId = (int) userRegisterModel.GroupId,
                            EformUserId = user.Id
                        };
                        _dbContext.SecurityGroupUsers.Add(securityGroupUser);
                    }

                    await _dbContext.SaveChangesAsync();
                }

                return new OperationResult(true,
                    _localizationService.GetStringWithFormat("UserUserNameWasUpdated", user.UserName));
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
                var userResult = await _userManager.FindByNameAsync(userRegisterModel.Email);
                if (userResult != null)
                {
                    return new OperationResult(false,
                        _localizationService.GetStringWithFormat("UserUserNameAlreadyExist", userRegisterModel.Email));
                }

                if (!_dbContext.SecurityGroups.Any(x => x.Id == userRegisterModel.GroupId))
                {
                    return new OperationResult(false,
                        _localizationService.GetString("SecurityGroupNotFound"));
                }

                var user = new EformUser
                {
                    Email = userRegisterModel.Email,
                    UserName = userRegisterModel.Email,
                    FirstName = userRegisterModel.FirstName,
                    LastName = userRegisterModel.LastName,
                    EmailConfirmed =  true,
                    TwoFactorEnabled = false,
                    IsGoogleAuthenticatorEnabled = false
                };

                var result = await _userManager.CreateAsync(user, userRegisterModel.Password);
                if (!result.Succeeded)
                {
                    return new OperationResult(false, string.Join(" ", result.Errors.Select(x=>x.Description).ToArray()));
                }

                // change role
                await _userManager.AddToRoleAsync(user, EformRole.User);
                // add to group
                if (userRegisterModel.GroupId > 0 && user.Id > 0)
                {
                    var securityGroupUser = new SecurityGroupUser()
                    {
                        SecurityGroupId = (int) userRegisterModel.GroupId,
                        EformUserId = user.Id
                    };
                    _dbContext.SecurityGroupUsers.Add(securityGroupUser);
                    await _dbContext.SaveChangesAsync();
                }

                return new OperationResult(true,
                    _localizationService.GetStringWithFormat("UserUserNameWasCreated", user.UserName));
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

                var user = await _userService.GetByIdAsync(userId);
                if (await _userManager.IsInRoleAsync(user, EformRole.Admin)
                    && _userService.Role != EformRole.Admin)
                {
                    return new OperationResult(false, _localizationService.GetString("YouCantViewChangeOrDeleteAdmin"));
                }

                if (user == null)
                {
                    return new OperationResult(false, _localizationService.GetStringWithFormat("UserUserNameNotFound", userId));
                }

                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    return new OperationResult(false, string.Join(" ", result.Errors.Select(x=>x.Description).ToArray()));
                }

                return new OperationResult(true, _localizationService.GetStringWithFormat("UserParamWasDeleted", userId));
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                return new OperationResult(false, _localizationService.GetString("ErrorWhileDeletingUser"));
            }
        }

        public async Task<OperationResult> EnableTwoFactorAuthForce()
        {
            try
            {
                await _appSettings.UpdateDb((options) => { options.IsTwoFactorForced = true; }, _dbContext);
            }
            catch (Exception)
            {
                return new OperationResult(false);
            }

            return new OperationResult(true);
        }

        public async Task<OperationResult> DisableTwoFactorAuthForce()
        {
            try
            {
                await _appSettings.UpdateDb((options) => { options.IsTwoFactorForced = false; }, _dbContext);
            }
            catch (Exception)
            {
                return new OperationResult(false);
            }

            return new OperationResult(true);
        }
    }
}