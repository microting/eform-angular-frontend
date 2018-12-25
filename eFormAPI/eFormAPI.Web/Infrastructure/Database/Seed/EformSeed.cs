using eFormAPI.Web.Infrastructure.Database.Seed.SeedItems;
using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Web.Infrastructure.Database.Seed
{
    public static class EformSeed
    {
        public static ModelBuilder SeedLatest(this ModelBuilder modelBuilder)
        {
            modelBuilder.AddPermissionTypes()
                .AddDefaultSecurityGroups()
                .AddPermissions()
                .AddDefaultGroupPermission()
                .AddDefaultMenu()
                .AddConfigurationDefault();

            return modelBuilder;
        }
    }
}