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
    using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;

    public static class MenuItemSeed
    {
        public static ModelBuilder AddDefaultMenu(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuItem>().HasData(
                new MenuItem
                {
                    Id = 1,
                    Name = "My Eforms",
                    Link = "/",
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                    Type = MenuItemTypeEnum.Link,
                    Position = 0,
                },
                new MenuItem
                {
                    Id = 2,
                    Name = "Device Users",
                    Link = "/device-users",
                    MenuTemplateId = MenuTemplateIds.DeviceUsers,
                    Type = MenuItemTypeEnum.Link,
                    Position = 1,
                },
                new MenuItem
                {
                    Id = 3,
                    Name = "Advanced",
                    Link = "",
                    MenuTemplateId = MenuTemplateIds.Advanced,
                    Type = MenuItemTypeEnum.Dropdown,
                    Position = 2,
                },
                new MenuItem
                {
                    Id = 4,
                    Name = "Sites",
                    Link = "/advanced/sites",
                    MenuTemplateId = MenuTemplateIds.Sites,
                    Type = MenuItemTypeEnum.Link,
                    Position = 0,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 5,
                    Name = "Workers",
                    Link = "/advanced/workers",
                    MenuTemplateId = MenuTemplateIds.Workers,
                    Type = MenuItemTypeEnum.Link,
                    Position = 1,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 6,
                    Name = "Units",
                    Link = "/advanced/units",
                    MenuTemplateId = MenuTemplateIds.Units,
                    Type = MenuItemTypeEnum.Link,
                    Position = 2,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 7,
                    Name = "Searchable List",
                    Link = "/advanced/entity-search",
                    MenuTemplateId = MenuTemplateIds.SearchableList,
                    Type = MenuItemTypeEnum.Link,
                    Position = 3,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 8,
                    Name = "Selectable List",
                    Link = "/advanced/entity-select",
                    MenuTemplateId = MenuTemplateIds.SelectableList,
                    Type = MenuItemTypeEnum.Link,
                    Position = 4,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 9,
                    Name = "Application Settings",
                    Link = "/advanced/application-settings",
                    MenuTemplateId = MenuTemplateIds.ApplicationSettings,
                    Type = MenuItemTypeEnum.Link,
                    Position = 6,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 10,
                    Name = "Plugin Settings",
                    Link = "/advanced/plugins-settings",
                    MenuTemplateId = MenuTemplateIds.PluginsSettings,
                    Type = MenuItemTypeEnum.Link,
                    Position = 8,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 11,
                    Name = "Folders",
                    Link = "/advanced/folders",
                    MenuTemplateId = MenuTemplateIds.Folders,
                    Type = MenuItemTypeEnum.Link,
                    Position = 5,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 12,
                    Name = "Email Recipients",
                    Link = "/email-recipients",
                    MenuTemplateId = MenuTemplateIds.EmailRecipients,
                    Type = MenuItemTypeEnum.Link,
                    Position = 7,
                    ParentId = 3,
                }
            );
            return modelBuilder;
        }
    }
}