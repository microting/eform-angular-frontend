using System.Configuration;
using eFormAPI.Web.Infrastructure.Consts;
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
            if (!roleManager.RoleExists(EformRoles.Admin))
            {
                roleManager.Create(new EformRole(EformRoles.Admin));
            }
            if (!roleManager.RoleExists(EformRoles.User))
            {
                roleManager.Create(new EformRole(EformRoles.User));
            }
        }
    }
}
