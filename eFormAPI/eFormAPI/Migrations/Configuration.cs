using System.Linq;
using eFormAPI.Web.Infrastructure.Data;
using eFormAPI.Web.Infrastructure.Data.Entities;
using eFormAPI.Web.Infrastructure.Identity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace eFormAPI.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    internal sealed class Configuration : DbMigrationsConfiguration<eFormAPI.Web.Infrastructure.Data.BaseDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(BaseDbContext context)
        {
            // Seed roles
            var roleManager = new EformRoleManager(new EformRoleStore(new BaseDbContext()));
            if (!roleManager.RoleExists("admin"))
            {
                roleManager.Create(new EformRole("admin"));
            }
            if (!roleManager.RoleExists("user"))
            {
                roleManager.Create(new EformRole("user"));
            }
            // Seed admin and demo users
            var manager = new EformUserManager(new EformUserStore(new BaseDbContext()));
            var adminUser = new EformUser()
            {
                UserName = "admin",
                Email = "admin@mail.com",
                EmailConfirmed = true,
            };
            var testUser = new EformUser()
            {
                UserName = "test",
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
