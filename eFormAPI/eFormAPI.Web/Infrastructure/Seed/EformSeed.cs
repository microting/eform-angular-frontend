using eFormAPI.Web.Infrastructure.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Web.Infrastructure.Seed
{
    public static class EformSeed
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
                    Name = "EntitySearch"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.EntitySelect,
                    Name = "EntitySelect"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.UserManagement,
                    Name = "UserManagement"
                },
                new PermissionType
                {
                    Id = AuthConsts.DbIds.PermissionTypes.Eforms,
                    Name = "Eforms"
                });
            return modelBuilder;
        }

        public static ModelBuilder AddDefaultSecurityGroups(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SecurityGroup>().HasData(
                new SecurityGroup()
                {
                    Id = AuthConsts.DbIds.SecurityGroups.EformAdmins,
                    Name = "eForm admins"
                },
                new SecurityGroup()
                {
                    Id = AuthConsts.DbIds.SecurityGroups.EformUsers,
                    Name = "eForm users"
                });
            return modelBuilder;
        }

        public static ModelBuilder AddPermissions(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Permission>().HasData(
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.WorkersClaims.Read,
                    ClaimName = AuthConsts.EformClaims.WorkersClaims.Read,
                    PermissionName = "Read",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Workers,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.WorkersClaims.Create,
                    ClaimName = AuthConsts.EformClaims.WorkersClaims.Create,
                    PermissionName = "Create",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Workers
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.WorkersClaims.Delete,
                    ClaimName = AuthConsts.EformClaims.WorkersClaims.Delete,
                    PermissionName = "Delete",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Workers
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.WorkersClaims.Update,
                    ClaimName = AuthConsts.EformClaims.WorkersClaims.Update,
                    PermissionName = "Update",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Workers
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.SitesClaims.Read,
                    ClaimName = AuthConsts.EformClaims.SitesClaims.Read,
                    PermissionName = "Read",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Sites
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.SitesClaims.Create,
                    ClaimName = AuthConsts.EformClaims.SitesClaims.Create,
                    PermissionName = "Create",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Sites
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.SitesClaims.Delete,
                    ClaimName = AuthConsts.EformClaims.SitesClaims.Delete,
                    PermissionName = "Delete",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Sites
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.SitesClaims.Update,
                    ClaimName = AuthConsts.EformClaims.SitesClaims.Update,
                    PermissionName = "Update",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Sites
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.EntitySearchClaims.Read,
                    ClaimName = AuthConsts.EformClaims.EntitySearchClaims.Read,
                    PermissionName = "Read",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.EntitySearch
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.EntitySearchClaims.Create,
                    ClaimName = AuthConsts.EformClaims.EntitySearchClaims.Create,
                    PermissionName = "Create",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.EntitySearch
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.EntitySearchClaims.Delete,
                    ClaimName = AuthConsts.EformClaims.EntitySearchClaims.Delete,
                    PermissionName = "Delete",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.EntitySearch
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.EntitySearchClaims.Update,
                    ClaimName = AuthConsts.EformClaims.EntitySearchClaims.Update,
                    PermissionName = "Update",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.EntitySearch
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.EntitySelectClaims.Read,
                    ClaimName = AuthConsts.EformClaims.EntitySelectClaims.Read,
                    PermissionName = "Read",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.EntitySelect
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.EntitySelectClaims.Create,
                    ClaimName = AuthConsts.EformClaims.EntitySelectClaims.Create,
                    PermissionName = "Create",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.EntitySelect
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.EntitySelectClaims.Delete,
                    ClaimName = AuthConsts.EformClaims.EntitySelectClaims.Delete,
                    PermissionName = "Delete",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.EntitySelect
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.EntitySelectClaims.Update,
                    ClaimName = AuthConsts.EformClaims.EntitySelectClaims.Update,
                    PermissionName = "Update",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.EntitySelect
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.UserManagementClaims.Read,
                    ClaimName = AuthConsts.EformClaims.UserManagementClaims.Read,
                    PermissionName = "Read",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.UserManagement
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.UserManagementClaims.Create,
                    ClaimName = AuthConsts.EformClaims.UserManagementClaims.Create,
                    PermissionName = "Create",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.UserManagement
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.UserManagementClaims.Delete,
                    ClaimName = AuthConsts.EformClaims.UserManagementClaims.Delete,
                    PermissionName = "Delete",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.UserManagement
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.UserManagementClaims.Update,
                    ClaimName = AuthConsts.EformClaims.UserManagementClaims.Update,
                    PermissionName = "Update",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.UserManagement,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.EformsClaims.Create,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.Create,
                    PermissionName = "Create",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.EformsClaims.Delete,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.Delete,
                    PermissionName = "Delete",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                }
            );
            return modelBuilder;
        }

        public static ModelBuilder AddDefaultGroupPermission(this ModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<GroupPermission>().HasData(
            //    new GroupPermission()
            //    {
            //        Id = 1,
            //        PermissionId = AuthConsts.DbIds.Permissions.WorkersClaims.Read,
            //        SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
            //    });
            return modelBuilder;
        }

//eForm user - view eForms, get CSV, list cases, view cases, edit cases, get pdf.
//eForm admin - view eForms, create eForms, delete eForms, change eForm columns, download XML, upload ZIP, view cases, edit cases, delete cases, get CSV, get PDF.
        public static ModelBuilder SeedLatest(this ModelBuilder modelBuilder)
        {
            modelBuilder.AddPermissionTypes()
                .AddDefaultSecurityGroups()
                .AddPermissions()
                .AddDefaultGroupPermission();
            return modelBuilder;
        }
    }
}