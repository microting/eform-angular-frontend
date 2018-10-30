using eFormAPI.Web.Infrastructure.Seed.SeedItems;
using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Web.Infrastructure.Seed
{
    public static class EformSeed
    {
        public static ModelBuilder SeedLatest(this ModelBuilder modelBuilder)
        {
            modelBuilder.AddPermissionTypes()
                .AddDefaultSecurityGroups()
                .AddPermissions()
                .AddDefaultGroupPermission()
                .AddDefaultMenu();
            return modelBuilder;
        }
    }
}