using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormAPI.Web.Infrastructure.Identity;
using eFormAPI.Web.Infrastructure.Models.Common;
using eFormAPI.Web.Infrastructure.Models.User;
using EformBase.Pn.Consts;
using EformBase.Pn.Helpers;
using EformBase.Pn.Infrastructure.Data;
using EformBase.Pn.Infrastructure.Data.Entities;
using EformBase.Pn.Infrastructure.Models.API;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using NLog;

namespace eFormAPI.Web.Controllers
{
    [Authorize(Roles = EformRoles.Admin)]
    public class AdminController : ApiController
    {
        private EformUserManager _eformUserManager;
        private EformRoleManager _eformRoleManager;
        private readonly string _connectionString;
        private readonly Logger _logger = LogManager.GetCurrentClassLogger();

        public AdminController()
        {
            _connectionString = ConfigurationManager.ConnectionStrings["eFormMainConnection"].ConnectionString;
        }

        public EformUserManager UserManager
        {
            get => _eformUserManager ?? Request.GetOwinContext().GetUserManager<EformUserManager>();
            set => _eformUserManager = value;
        }

        public EformRoleManager RoleManager
        {
            get => _eformRoleManager ?? new EformRoleManager(new EformRoleStore(BaseDbContext.Create()));
            set => _eformRoleManager = value;
        }

        [HttpGet]
        [Route("api/admin/user/{userId}")]
        public OperationDataResult<UserRegisterModel> GetUser(int userId)
        {
            try
            {
                var model = UserManager.Users
                    .Include(x => x.Roles)
                    .Select(userResult => new UserRegisterModel
                    {
                        Email = userResult.Email,
                        Id = userResult.Id,
                        FirstName = userResult.FirstName,
                        LastName = userResult.LastName,
                        UserName = userResult.UserName,
                        RoleId = userResult.Roles.FirstOrDefault().RoleId
                    }).FirstOrDefault(x => x.Id == userId);

                if (model?.RoleId != null)
                {
                    model.Role = RoleManager.FindById((int) model.RoleId).Name;
                }
                return new OperationDataResult<UserRegisterModel>(true, model);
            }
            catch (Exception exception)
            {
                _logger.Error(exception.Message);
                return new OperationDataResult<UserRegisterModel>(false, LocaleHelper.GetString("ErrorWhileObtainUsers"));
            }
        }

        [HttpPost]
        [Route("api/admin/get-users")]
        public OperationDataResult<UserInfoModelList> GetAllUsers(PaginationModel paginationModel)
        {
            try
            {
                var roles = RoleManager.Roles.ToList();
                var userList = new List<UserInfoViewModel>();
                var userResult = UserManager.Users
                    .Include(x => x.Roles)
                    .OrderBy(z => z.Id)
                    .Skip(paginationModel.Offset)
                    .Take(paginationModel.PageSize)
                    .ToList();

                userResult.ForEach(userItem =>
                {
                    var roleName =
                        roles.FirstOrDefault(x => x.Id == userItem.Roles.Select(y => y.RoleId).FirstOrDefault());
                    var modelItem = new UserInfoViewModel();
                    if (roleName != null)
                    {
                        modelItem.Role = roleName.Name;
                    }
                    modelItem.FirstName = userItem.FirstName;
                    modelItem.LastName = userItem.LastName;
                    modelItem.Email = userItem.Email;
                    modelItem.Id = userItem.Id;
                    modelItem.UserName = userItem.UserName;
                    userList.Add(modelItem);
                });
                var totalUsers = UserManager.Users.Count();
                return new OperationDataResult<UserInfoModelList>(true, new UserInfoModelList()
                {
                    TotalUsers = totalUsers,
                    UserList = userList
                });
            }
            catch (Exception exception)
            {
                _logger.Error(exception.Message);
                return new OperationDataResult<UserInfoModelList>(false, LocaleHelper.GetString("ErrorWhileObtainUsers"));
            }
        }

        [HttpPost]
        [Route("api/admin/update-user")]
        public OperationResult UpdateUser(UserRegisterModel userRegisterModel)
        {
            try
            {
                var user = UserManager.FindById(userRegisterModel.Id);
                if (user == null)
                {
                    return new OperationResult(false, LocaleHelper.GetString("UserNotFoundUserName", userRegisterModel.UserName));
                }
                if (userRegisterModel.Role == null)
                {
                    return new OperationResult(false, LocaleHelper.GetString("RoleIsRequired"));
                }
                user.Email = userRegisterModel.Email;
                user.UserName = userRegisterModel.UserName;
                user.FirstName = userRegisterModel.FirstName;
                user.LastName = userRegisterModel.LastName;
                var result = UserManager.Update(user);
                if (!result.Succeeded)
                {
                    return new OperationResult(false, string.Join(" ", result.Errors));
                }
                // password
                if (userRegisterModel.Password != null)
                {
                    UserManager.RemovePassword(user.Id);
                    UserManager.AddPassword(user.Id, userRegisterModel.Password);
                }
                // change role
                UserManager.RemoveFromRoles(user.Id, EformRoles.Admin, EformRoles.User);
                UserManager.AddToRole(user.Id, userRegisterModel.Role);
                return new OperationResult(true, LocaleHelper.GetString("UserUserNameWasUpdated", user.UserName));
            }
            catch (Exception exception)
            {
                _logger.Error(exception.Message);
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileUpdatingUser"));
            }
        }

        [HttpPost]
        [Route("api/admin/create-user")]
        public OperationResult CreateUser(UserRegisterModel userRegisterModel)
        {
            try
            {
                var userResult = UserManager.FindByName(userRegisterModel.UserName);
                if (userResult != null)
                {
                    return new OperationResult(false, LocaleHelper.GetString("UserUserNameAlreadyExist", userRegisterModel.UserName));
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

                var result = UserManager.Create(user, userRegisterModel.Password);
                if (!result.Succeeded)
                {
                    return new OperationResult(false, string.Join(" ", result.Errors));
                }
                // change role
                UserManager.AddToRole(user.Id, userRegisterModel.Role.ToLower());
                return new OperationResult(true, LocaleHelper.GetString("UserUserNameWasCreated", user.UserName));
            }
            catch (Exception exception)
            {
                _logger.Error(exception.Message);
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileCreatingUser"));
            }
        }

        [HttpGet]
        [Route("api/admin/delete-user/{userId}")]
        public OperationResult DeleteUser(int userId)
        {
            try
            {
                if (userId == 1)
                {
                    return new OperationResult(false, LocaleHelper.GetString("CantDeletePrimaryAdminUser"));
                }
                var user = UserManager.FindById(userId);
                if (user == null)
                {
                    return new OperationResult(false, LocaleHelper.GetString("UserUserNameNotFound", userId));
                }
                var result = UserManager.Delete(user);
                if (!result.Succeeded)
                {
                    return new OperationResult(false, string.Join(" ", result.Errors));
                }
                return new OperationResult(true, LocaleHelper.GetString("UserParamWasDeleted", userId));
            }
            catch (Exception exception)
            {
                _logger.Error(exception.Message);
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileDeletingUser"));
            }
        }

        [HttpGet]
        [Route("api/admin/enable-two-factor")]
        [Authorize(Roles = EformRoles.Admin)]
        public OperationResult EnableTwoFactorAuthForce()
        {
            try
            {
                SettingsHelper.UpdateTwoFactorAuthForceInfo(true);
            }
            catch (Exception)
            {
                return new OperationResult(false);
            }
            return new OperationResult(true);
        }

        [HttpGet]
        [Route("api/admin/disable-two-factor")]
        [Authorize(Roles = EformRoles.Admin)]
        public OperationResult DisableTwoFactorAuthForce()
        {
            try
            {
                SettingsHelper.UpdateTwoFactorAuthForceInfo(false);
            }
            catch (Exception)
            {
                return new OperationResult(false);
            }
            return new OperationResult(true);
        }
    }
}