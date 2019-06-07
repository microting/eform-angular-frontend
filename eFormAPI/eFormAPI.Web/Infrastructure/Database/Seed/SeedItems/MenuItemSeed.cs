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
using eFormAPI.Web.Infrastructure.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Web.Infrastructure.Database.Seed.SeedItems
{
    public static class MenuItemSeed
    {
        public static ModelBuilder AddDefaultMenu(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuItem>().HasData(
                new MenuItem
                {
                    Id = 1,
                    Name = "My eForms",
                    LocaleName = "MyEforms",
                    E2EId = "my-eforms",
                    Link = "/",
                    Position = 0,
                    MenuPosition = 1,
                },
                new MenuItem
                {
                    Id = 2,
                    Name = "Device Users",
                    LocaleName = "DeviceUsers",
                    E2EId = "device-users",
                    Link = "/simplesites",
                    Position = 1,
                    MenuPosition = 1,
                },
                new MenuItem
                {
                    Id = 3,
                    Name = "Advanced",
                    LocaleName = "Advanced",
                    E2EId = "advanced",
                    Link = "",
                    Position = 2,
                    MenuPosition = 1,
                },
                new MenuItem
                {
                    Id = 4,
                    Name = "Sites",
                    LocaleName = "Sites",
                    E2EId = "sites",
                    Link = "/advanced/sites",
                    Position = 0,
                    ParentId = 3,
                    MenuPosition = 1,
                },
                new MenuItem
                {
                    Id = 5,
                    Name = "Workers",
                    LocaleName = "Workers",
                    E2EId = "workers",
                    Link = "/advanced/workers",
                    Position = 1,
                    ParentId = 3,
                    MenuPosition = 1,
                },
                new MenuItem
                {
                    Id = 6,
                    Name = "Units",
                    LocaleName = "Units",
                    E2EId = "units",
                    Link = "/advanced/units",
                    Position = 2,
                    ParentId = 3,
                    MenuPosition = 1,
                },
                new MenuItem
                {
                    Id = 7,
                    Name = "SearchableList",
                    LocaleName = "SearchableList",
                    E2EId = "search",
                    Link = "/advanced/entity-search",
                    Position = 3,
                    ParentId = 3,
                    MenuPosition = 1,
                },
                new MenuItem
                {
                    Id = 8,
                    Name = "Selectable list",
                    LocaleName = "SelectableList",
                    E2EId = "selectable-list",
                    Link = "/advanced/entity-select",
                    Position = 4,
                    ParentId = 3,
                    MenuPosition = 1,
                },
                new MenuItem
                {
                    Id = 9,
                    Name = "Application Settings",
                    LocaleName = "ApplicationSettings",
                    E2EId = "application-settings",
                    Link = "/application-settings",
                    Position = 6,
                    ParentId = 3,
                    MenuPosition = 1,
                },

                new MenuItem
                {
                    Id = 10,
                    Name = "user",
                    E2EId = "sign-out-dropdown",
                    Link = "",
                    Position = 0,
                    MenuPosition = 2,
                },
                new MenuItem
                {
                    Id = 11,
                    Name = "User Management",
                    LocaleName = "UserManagement",
                    E2EId = "user-management-menu",
                    Link = "/account-management/users",
                    Position = 0,
                    ParentId = 10,
                    MenuPosition = 2,
                },
                new MenuItem
                {
                    Id = 12,
                    Name = "Settings",
                    LocaleName = "Settings",
                    E2EId = "settings",
                    Link = "/account-management/settings",
                    Position = 1,
                    ParentId = 10,
                    MenuPosition = 2,
                },
                new MenuItem
                {
                    Id = 13,
                    Name = "Security",
                    LocaleName = "Security",
                    E2EId = "security",
                    Link = "/security",
                    Position = 2,
                    ParentId = 10,
                    MenuPosition = 2,
                },
                new MenuItem
                {
                    Id = 14,
                    Name = "Change password",
                    LocaleName = "ChangePassword",
                    E2EId = "change-password",
                    Link = "/account-management/change-password",
                    Position = 3,
                    ParentId = 10,
                    MenuPosition = 2,
                },
                new MenuItem
                {
                    Id = 15,
                    Name = "Logout",
                    LocaleName = "Logout",
                    E2EId = "sign-out",
                    Link = "/auth/sign-out",
                    Position = 4,
                    ParentId = 10,
                    MenuPosition = 2,
                },
                new MenuItem
                {
                    Id = 16,
                    Name = "Plugins Settings",
                    LocaleName = "PluginsSettings",
                    E2EId = "plugins-settings",
                    Link = "/plugins-settings",
                    Position = 7,
                    ParentId = 3,
                    MenuPosition = 1,
                },
                new MenuItem
                {
                    Id = 17,
                    Name = "Folders",
                    LocaleName = "Folders",
                    E2EId = "folders",
                    Link = "/advanced/folders",
                    Position = 5,
                    ParentId = 3,
                    MenuPosition = 1,
                }
            );
            return modelBuilder;
        }
    }
}