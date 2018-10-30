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
                // User management
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
                // Units
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Units.Read,
                    ClaimName = AuthConsts.EformClaims.UnitsClaims.Read,
                    PermissionName = "Read",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Units
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Units.Update,
                    ClaimName = AuthConsts.EformClaims.UnitsClaims.Update,
                    PermissionName = "Update",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Units
                },
                // Device users
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.DeviceUsers.Read,
                    ClaimName = AuthConsts.EformClaims.DeviceUsersClaims.Read,
                    PermissionName = "Read",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.DeviceUsers
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.DeviceUsers.Create,
                    ClaimName = AuthConsts.EformClaims.DeviceUsersClaims.Create,
                    PermissionName = "Create",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.DeviceUsers
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.DeviceUsers.Delete,
                    ClaimName = AuthConsts.EformClaims.DeviceUsersClaims.Delete,
                    PermissionName = "Delete",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.DeviceUsers
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.DeviceUsers.Update,
                    ClaimName = AuthConsts.EformClaims.DeviceUsersClaims.Update,
                    PermissionName = "Update",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.DeviceUsers,
                },
                // Eforms
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.Create,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.Create,
                    PermissionName = "Create",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.Delete,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.Delete,
                    PermissionName = "Delete",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.Read,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.Read,
                    PermissionName = "Read",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.UpdateColumns,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.UpdateColumns,
                    PermissionName = "Update columns",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.DownloadXml,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.DownloadXml,
                    PermissionName = "Download XML",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.UploadZip,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.UploadZip,
                    PermissionName = "Upload ZIP",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.CaseRead,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.CaseRead,
                    PermissionName = "Case read",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.CasesRead,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.CasesRead,
                    PermissionName = "Cases read",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.CasesUpdate,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.CasesUpdate,
                    PermissionName = "Cases update",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.CasesDelete,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.CasesDelete,
                    PermissionName = "Cases delete",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.GetPdf,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.GetPdf,
                    PermissionName = "Get PDF",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.PairingRead,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.PairingRead,
                    PermissionName = "Pairing read",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.PairingUpdate,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.PairingUpdate,
                    PermissionName = "Pairing update",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.ReadTags,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.ReadTags,
                    PermissionName = "Read tags",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.UpdateTags,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.UpdateTags,
                    PermissionName = "Update tags",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                },
                new Permission()
                {
                    Id = AuthConsts.DbIds.Permissions.Eforms.GetCsv,
                    ClaimName = AuthConsts.EformClaims.EformsClaims.GetCsv,
                    PermissionName = "Get CSV",
                    PermissionTypeId = AuthConsts.DbIds.PermissionTypes.Eforms,
                }
            );
            return modelBuilder;
        }


        public static ModelBuilder AddDefaultGroupPermission(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GroupPermission>().HasData(
                // eForm admin group
                new GroupPermission()
                {
                    Id = 1,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.Read,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 2,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.Create,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 3,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.Delete,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 4,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.UpdateColumns,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 5,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.DownloadXml,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 6,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.UploadZip,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 7,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.CaseRead,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 8,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.CasesRead,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },

                new GroupPermission()
                {
                    Id = 9,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.CasesUpdate,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 10,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.CasesDelete,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 11,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.GetCsv,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 12,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.GetPdf,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                // eForm user group
                new GroupPermission()
                {
                    Id = 13,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.Read,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                new GroupPermission()
                {
                    Id = 14,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.GetCsv,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                new GroupPermission()
                {
                    Id = 15,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.CaseRead,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                new GroupPermission()
                {
                    Id = 16,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.CasesRead,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                new GroupPermission()
                {
                    Id = 17,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.CasesUpdate,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                new GroupPermission()
                {
                    Id = 18,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.GetPdf,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                }
            );
            return modelBuilder;
        }

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