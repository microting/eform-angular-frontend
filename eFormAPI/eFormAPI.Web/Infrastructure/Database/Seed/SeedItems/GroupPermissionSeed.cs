/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Web.Infrastructure.Database.Seed.SeedItems
{
    using Entities.Permissions;

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
                new GroupPermission()
                {
                    Id = 25,
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CaseGetDocx,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 26,
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CaseGetPptx,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 13,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.PairingRead,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 14,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.PairingUpdate,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 15,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.UpdateTags,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 16,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.ReadTags,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                // eForm user group
                new GroupPermission()
                {
                    Id = 17,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.Read,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                new GroupPermission()
                {
                    Id = 18,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.GetCsv,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                new GroupPermission()
                {
                    Id = 19,
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CaseRead,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                new GroupPermission()
                {
                    Id = 20,
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CasesRead,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                new GroupPermission()
                {
                    Id = 21,
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CaseUpdate,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                new GroupPermission()
                {
                    Id = 22,
                    PermissionId = AuthConsts.DbIds.Permissions.Cases.CaseGetPdf,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformUsers
                },
                // eForm admin group
                new GroupPermission()
                {
                    Id = 23,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.ReadJasperReport,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                },
                new GroupPermission()
                {
                    Id = 24,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.UpdateJasperReport,
                    SecurityGroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins
                }
            );
            return modelBuilder;
        }
    }
}