using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Data;
using eFormAPI.Web.Infrastructure.Identity;
using eFormData;
using eFromAPI.Common.API;
using eFromAPI.Common.Models;
using eFromAPI.Common.Models.Auth;
using eFromAPI.Common.Models.User;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    [RoutePrefix("api/admin")]
    public class AdminController : ApiController
    {
        private readonly BaseDbContext _dbContext;
        private EformUserManager _eformUserManager;
        private EformRoleManager _eformRoleManager;

        public AdminController(BaseDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        
        public EformUserManager UserManager
        {
            get => _eformUserManager ?? Request.GetOwinContext().GetUserManager<EformUserManager>();
            private set => _eformUserManager = value;
        }

        public EformRoleManager RoleManager
        {
            get => _eformRoleManager ?? Request.GetOwinContext().GetUserManager<EformRoleManager>();
            private set => _eformRoleManager = value;
        }

        [HttpGet]
        [Route("user/{userId}")]
        public OperationDataResult<UserRegisterModel> GetUser(int userId)
        {
            try
            {
                var user = _dbContext.Users.Include(x => x.Roles).FirstOrDefault(x => x.Id == userId);


                var model = new UserRegisterModel
                {
                    Email = user?.Email,
                    Id = userId,
                    FirstName = user.FirstName,
                    LastName = user.LastName
                };

               // var userRoles = user.Roles.FirstOrDefault();
               // 
               // if (userRoles != null)
               // {
               //     model.Role = _eformRoleManager.FindById(userRoles.RoleId).Name;
               // }

                return new OperationDataResult<UserRegisterModel>(true, model);

            }
            catch (Exception exception)
            {
                return new OperationDataResult<UserRegisterModel>(false, "Error when obtaining users");
            }
        }

        [HttpPost]
        [Route("get-users")]
        public OperationDataResult<List<UserInfoViewModel>> GetAllUsers(PaginationModel paginationModel)
        {
            try
            {
                var userList = _dbContext.Users.Include(x => x.Roles).ToList();
                
                var model = userList.Select(user => new UserInfoViewModel
                    {
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        Id = user.Id
                    })
                    .ToList();

                return new OperationDataResult<List<UserInfoViewModel>>(true, model);
            }
            catch (Exception exception)
            {
                return new OperationDataResult<List<UserInfoViewModel>>(false, "Error when obtaining users");
            }
        }

        [HttpPost]
        [Route("update-user")]
        public OperationResult UpdateUser(UserRegisterModel userRegisterModel)
        {
            try
            {
                var user = _dbContext.Users.Include(x => x.Roles).FirstOrDefault(x => x.Id == userRegisterModel.Id);

                if (user == null) throw new Exception();

                
                if (userRegisterModel.Password.Equals(userRegisterModel.PasswordConfimation))
                {
                    user.Email = userRegisterModel.Email;
                    user.UserName = userRegisterModel.UserName;
                    user.FirstName = userRegisterModel.FirstName;
                    user.LastName = userRegisterModel.LastName;
                    user.PasswordHash = new PasswordHasher().HashPassword(userRegisterModel.Password);
                }
                
                _dbContext.Entry(user).State = EntityState.Modified;
                _dbContext.SaveChanges();

                return new OperationResult (true, $"User {userRegisterModel.Id} was updated");
            }
            catch (Exception exception)
            {
                return new OperationResult(false, "Error when updating user");
            }
        }

        [HttpPost]
        [Route("delete-user/{userId}")]
        public OperationResult DeleteUser(int userId)
        {
            try
            {
                var user = _dbContext.Users.Include(x => x.Roles).FirstOrDefault(x => x.Id == userId);

                if (user == null) throw new Exception();

                _dbContext.Entry(user).State = EntityState.Deleted;

                return new OperationResult(true, $"User {userId} was deleted");
            }
            catch (Exception exception)
            {
                return new OperationResult(false, "Error while deleting user");
            }
        }
    }
}