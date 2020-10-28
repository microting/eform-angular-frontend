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

    public static class MenuTemplateSeed
    {
        public static ModelBuilder AddDefaultTemplates(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuTemplate>().HasData(
                new MenuTemplate
                {
                    Id = MenuTemplateIds.MyEforms,
                    Name = "My Eforms",
                    E2EId = "my-eforms",
                    DefaultLink = "/",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.DeviceUsers,
                    Name = "Device Users",
                    E2EId = "device-users",
                    DefaultLink = "/device-users",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.Advanced,
                    Name = "Advanced",
                    E2EId = "advanced",
                    DefaultLink = "",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.Sites,
                    Name = "Sites",
                    E2EId = "sites",
                    DefaultLink = "/advanced/sites",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.Workers,
                    Name = "Workers",
                    E2EId = "workers",
                    DefaultLink = "/advanced/workers",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.Units,
                    Name = "Units",
                    E2EId = "units",
                    DefaultLink = "/advanced/units",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.SearchableList,
                    Name = "Searchable List",
                    E2EId = "search",
                    DefaultLink = "/advanced/entity-search",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.SelectableList,
                    Name = "Selectable List",
                    E2EId = "selectable-list",
                    DefaultLink = "/advanced/entity-select",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.ApplicationSettings,
                    Name = "Application Settings",
                    E2EId = "application-settings",
                    DefaultLink = "/application-settings",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.PluginsSettings,
                    Name = "Plugins Settings",
                    E2EId = "plugins-settings",
                    DefaultLink = "/plugins-settings",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.Folders,
                    Name = "Folders",
                    E2EId = "folders",
                    DefaultLink = "/advanced/folders",
                },
                new MenuTemplate
                {
                    Id = MenuTemplateIds.EmailRecipients,
                    Name = "Email Recipients",
                    E2EId = "email-recipients",
                    DefaultLink = "/email-recipients",
                }
            );
            return modelBuilder;
        }
    }
}