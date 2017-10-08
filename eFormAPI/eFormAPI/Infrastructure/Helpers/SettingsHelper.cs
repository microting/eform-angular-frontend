using System.Configuration;
using System.Linq;
using eFormAPI.Common.Models.Settings;
using eFormAPI.Common.Models.Settings.Initial;
using eFormAPI.Web.Infrastructure.Data;
using eFormAPI.Web.Infrastructure.Data.Entities;
using eFormAPI.Web.Infrastructure.Identity;
using Microsoft.AspNet.Identity;

namespace eFormAPI.Web.Infrastructure.Helpers
{
    public class SettingsHelper
    {
        private string _connectionString;

        public SettingsHelper(string connectionString)
        {
            _connectionString = connectionString;
        }

        public void CreateAdminUser(AdminSetupModel adminSetupModel)
        {
            if (_connectionString == null)
            {
                _connectionString = ConfigurationManager.ConnectionStrings["eFormMainConnection"].ConnectionString;
            }
            // Seed admin and demo users
            var manager = new EformUserManager(new EformUserStore(new BaseDbContext(_connectionString)));
            var adminUser = new EformUser()
            {
                UserName = adminSetupModel.UserName,
                Email = adminSetupModel.Email,
                FirstName = adminSetupModel.FirstName,
                LastName = adminSetupModel.LastName,
                EmailConfirmed = true,
            };
            if (!manager.Users.Any(x => x.Email.Equals(adminUser.Email)))
            {
                manager.Create(adminUser, adminSetupModel.Password);
                manager.AddToRole(adminUser.Id, "admin");
            }
        }
    }
}