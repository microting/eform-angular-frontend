using eFormAPI.Web.Infrastructure.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Web.Infrastructure.Seed.SeedItems
{
    public static class GroupPermissionSeed
    {
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
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CaseRead,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 8,
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CasesRead,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 9,
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CaseUpdate,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 10,
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CaseDelete,
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
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CaseGetPdf,
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
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CaseRead,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                new GroupPermission()
                {
                    Id = 16,
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CasesRead,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                new GroupPermission()
                {
                    Id = 17,
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CaseUpdate,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                new GroupPermission()
                {
                    Id = 18,
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CaseGetPdf,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                }
            );
            return modelBuilder;
        }
    }
}