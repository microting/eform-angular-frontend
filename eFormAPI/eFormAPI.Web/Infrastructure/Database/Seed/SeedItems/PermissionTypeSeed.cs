using eFormAPI.Web.Infrastructure.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Web.Infrastructure.Database.Seed.SeedItems
{
    public static class PermissionTypeSeed
    {
        public static ModelBuilder AddPermissionTypes(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PermissionType>().HasData(
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.Workers,
                    Name = "Workers"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.Sites,
                    Name = "Sites"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.EntitySearch,
                    Name = "Entity search"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.EntitySelect,
                    Name = "Entity select"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.UserManagement,
                    Name = "User management"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.Units,
                    Name = "Units"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.DeviceUsers,
                    Name = "Device users"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.Cases,
                    Name = "Cases"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.Eforms,
                    Name = "Eforms"
                });
            return modelBuilder;
        }
    }
}