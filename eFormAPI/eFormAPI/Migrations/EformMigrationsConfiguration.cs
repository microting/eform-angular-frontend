using System.Configuration;
using System.Linq;
using eFormAPI.Web.Infrastructure.Data;
using eFormAPI.Web.Infrastructure.Data.Entities;
using eFormAPI.Web.Infrastructure.Identity;
using Microsoft.AspNet.Identity;

namespace eFormAPI.Web.Migrations
{
    using System.Data.Entity.Migrations;

    internal sealed class EformMigrationsConfiguration : DbMigrationsConfiguration<BaseDbContext>
    {
        private string _connectionString;
        public EformMigrationsConfiguration(string connectionString)
        {
            AutomaticMigrationsEnabled = false;
            _connectionString = connectionString;
        }

        public EformMigrationsConfiguration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(BaseDbContext context)
        {
            if (_connectionString == null)
            {
                _connectionString = ConfigurationManager.ConnectionStrings["eFormMainConnection"].ConnectionString;
            }
            // Seed roles
            var roleManager = new EformRoleManager(new EformRoleStore(new BaseDbContext(_connectionString)));
            if (!roleManager.RoleExists("admin"))
            {
                roleManager.Create(new EformRole("admin"));
            }
            if (!roleManager.RoleExists("user"))
            {
                roleManager.Create(new EformRole("user"));
            }
            // Seed admin and demo users
            var manager = new EformUserManager(new EformUserStore(new BaseDbContext(_connectionString)));
            var adminUser = new EformUser()
            {
                UserName = "admin",
                Email = "admin@mail.com",
                FirstName = "admin",
                LastName = "admin",
                EmailConfirmed = true
            };
            var testUser = new EformUser()
            {
                UserName = "test",
                FirstName = "John",
                LastName = "Smith",
                Email = "test@mail.com",
                EmailConfirmed = true,
            };
            if (!manager.Users.Any(x => x.Email.Equals(adminUser.Email)))
            {
                manager.Create(adminUser, "AdminP@ssword!");
                manager.AddToRole(adminUser.Id, "admin");
            }
            if (!manager.Users.Any(x => x.Email.Equals(testUser.Email)))
            {
                manager.Create(testUser, "TestP@ssword!");
                manager.AddToRole(testUser.Id, "user");
            }
        }
    }
}
