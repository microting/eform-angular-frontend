using eFormAPI.Web.Infrastructure.Data;
using eFormAPI.Web.Infrastructure.Data.Entities;
using eFormAPI.Web.Infrastructure.Identity;
using Microsoft.AspNet.Identity;

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

        protected override void Seed(eFormAPI.Web.Infrastructure.Data.BaseDbContext context)
        {
            var manager = new EformUserManager(new EformUserStore(new BaseDbContext()));

            var user = new EformUser()
            {
                UserName = "admin",
                Email = "admin@mail.com",
                EmailConfirmed = true,
                FirstName = "Taiseer",
                LastName = "Joudeh",
                Level = 1,
                JoinDate = DateTime.Now.AddYears(-3)
            };

            manager.Create(user, "MySuperP@ssword!");
            //manager.AddToRole(user.Id, "admin");
        }
    }
}
