/*
The MIT License (MIT)

Copyright (c) 2007 - 2020 Microting A/S

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

namespace eFormAPI.Web.Infrastructure.Database.Seed.SeedItems
{
    using Const;
    using Entities.Menu;
    using Microsoft.EntityFrameworkCore;

    public static class MenuTemplatePermissionsSeed
    {
        public static ModelBuilder AddMenuTemplatePermissions(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuTemplatePermission>().HasData(
                new MenuTemplatePermission()
                {
                    Id = 1,
                    PermissionId = AuthConsts.DbIds.Permissions.WorkersClaims.Read,
                    MenuTemplateId = MenuTemplateIds.Workers,
                },
                new MenuTemplatePermission()
                {
                    Id = 2,
                    PermissionId = AuthConsts.DbIds.Permissions.WorkersClaims.Create,
                    MenuTemplateId = MenuTemplateIds.Workers,
                },
                new MenuTemplatePermission()
                {
                    Id = 3,
                    PermissionId = AuthConsts.DbIds.Permissions.WorkersClaims.Delete,
                    MenuTemplateId = MenuTemplateIds.Workers,
                },
                new MenuTemplatePermission()
                {
                    Id = 4,
                    PermissionId = AuthConsts.DbIds.Permissions.WorkersClaims.Update,
                    MenuTemplateId = MenuTemplateIds.Workers,
                },
                new MenuTemplatePermission()
                {
                    Id = 5,
                    PermissionId = AuthConsts.DbIds.Permissions.SitesClaims.Read,
                    MenuTemplateId = MenuTemplateIds.Sites,
                },
                new MenuTemplatePermission()
                {
                    Id = 6,
                    PermissionId = AuthConsts.DbIds.Permissions.SitesClaims.Delete,
                    MenuTemplateId = MenuTemplateIds.Sites,
                },
                new MenuTemplatePermission()
                {
                    Id = 7,
                    PermissionId = AuthConsts.DbIds.Permissions.SitesClaims.Update,
                    MenuTemplateId = MenuTemplateIds.Sites,
                },
                new MenuTemplatePermission()
                {
                    Id = 8,
                    PermissionId = AuthConsts.DbIds.Permissions.EntitySearchClaims.Read,
                    MenuTemplateId = MenuTemplateIds.SearchableList,
                },
                new MenuTemplatePermission()
                {
                    Id = 9, 
                    PermissionId = AuthConsts.DbIds.Permissions.EntitySearchClaims.Create,
                    MenuTemplateId = MenuTemplateIds.SearchableList,
                },
                new MenuTemplatePermission()
                {
                    Id = 10,
                    PermissionId = AuthConsts.DbIds.Permissions.EntitySearchClaims.Delete,
                    MenuTemplateId = MenuTemplateIds.SearchableList,
                },
                new MenuTemplatePermission()
                {
                    Id = 11,
                    PermissionId = AuthConsts.DbIds.Permissions.EntitySearchClaims.Update,
                    MenuTemplateId = MenuTemplateIds.SearchableList,
                },
                new MenuTemplatePermission()
                {
                    Id = 12,
                    PermissionId = AuthConsts.DbIds.Permissions.EntitySelectClaims.Read,
                    MenuTemplateId = MenuTemplateIds.SearchableList,
                },
                new MenuTemplatePermission()
                {
                    Id = 13, 
                    PermissionId = AuthConsts.DbIds.Permissions.EntitySelectClaims.Create,
                    MenuTemplateId = MenuTemplateIds.SearchableList,
                },
                new MenuTemplatePermission()
                {
                    Id = 14,
                    PermissionId = AuthConsts.DbIds.Permissions.EntitySelectClaims.Delete,
                    MenuTemplateId = MenuTemplateIds.SearchableList,
                },
                new MenuTemplatePermission()
                {
                    Id = 15, 
                    PermissionId = AuthConsts.DbIds.Permissions.EntitySelectClaims.Update,
                    MenuTemplateId = MenuTemplateIds.SearchableList,
                },
                // Units
                new MenuTemplatePermission()
                {
                    Id = 16, 
                    PermissionId = AuthConsts.DbIds.Permissions.Units.Read,
                    MenuTemplateId = MenuTemplateIds.Units,
                },
                new MenuTemplatePermission()
                {
                    Id = 17,
                    PermissionId = AuthConsts.DbIds.Permissions.Units.Update,
                    MenuTemplateId = MenuTemplateIds.Units,
                },
                // Device users
                new MenuTemplatePermission()
                {
                    Id = 18,
                    PermissionId = AuthConsts.DbIds.Permissions.DeviceUsers.Read,
                    MenuTemplateId = MenuTemplateIds.DeviceUsers,
                },
                new MenuTemplatePermission()
                {
                    Id = 19,
                    PermissionId = AuthConsts.DbIds.Permissions.DeviceUsers.Create,
                    MenuTemplateId = MenuTemplateIds.DeviceUsers,
                },
                new MenuTemplatePermission()
                {
                    Id = 20,
                    PermissionId = AuthConsts.DbIds.Permissions.DeviceUsers.Delete,
                    MenuTemplateId = MenuTemplateIds.DeviceUsers,
                },
                new MenuTemplatePermission()
                {
                    Id = 21,
                    PermissionId = AuthConsts.DbIds.Permissions.DeviceUsers.Update,
                    MenuTemplateId = MenuTemplateIds.DeviceUsers,
                },
                // Eforms
                new MenuTemplatePermission()
                {
                    Id = 22, 
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.Create,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                new MenuTemplatePermission()
                {
                    Id = 23, 
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.Delete,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                new MenuTemplatePermission()
                {
                    Id = 24, 
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.Read,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                new MenuTemplatePermission()
                {
                    Id = 25, 
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.UpdateColumns,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                new MenuTemplatePermission()
                {
                    Id = 26, 
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.DownloadXml,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                new MenuTemplatePermission()
                {
                    Id = 27, 
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.UploadZip,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                
                new MenuTemplatePermission()
                {
                    Id = 28,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.PairingRead,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                new MenuTemplatePermission()
                {
                    Id = 29,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.PairingUpdate,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                new MenuTemplatePermission()
                {
                    Id = 30,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.ReadTags,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                new MenuTemplatePermission()
                {
                    Id = 31,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.UpdateTags,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                new MenuTemplatePermission()
                {
                    Id = 32,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.GetCsv,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                new MenuTemplatePermission()
                {
                    Id = 33,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.ReadJasperReport,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                new MenuTemplatePermission()
                {
                    Id = 34, 
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.UpdateJasperReport,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                new MenuTemplatePermission()
                {
                    Id = 35,
                    PermissionId = AuthConsts.DbIds.Permissions.Eforms.ExportEformExcel,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                }
            );
            return modelBuilder;
        }
    }
}
