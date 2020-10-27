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
    using System.Collections.Generic;

    public static class MenuItemEnglishTranslationsSeed
    {
        public static ModelBuilder AddDefaultMenuEnglishTranslations(this ModelBuilder modelBuilder)
        {
            var entities = new List<MenuItemTranslation>()
            {
                new MenuItemTranslation
                {
                    Id = 1,
                    Name = "My eForms",
                    MenuItemId = MenuTemplateIds.MyEforms,
                },
                new MenuItemTranslation
                {
                    Id = 2,
                    Name = "Device Users",
                    MenuItemId = MenuTemplateIds.DeviceUsers
                },
                new MenuItemTranslation
                {
                    Id = 3,
                    Name = "Advanced",
                    MenuItemId = MenuTemplateIds.Advanced
                },
                new MenuItemTranslation
                {
                    Id = 4,
                    Name = "Sites",
                    MenuItemId = MenuTemplateIds.Sites
                },
                new MenuItemTranslation
                {
                    Id = 5,
                    Name = "Workers",
                    MenuItemId = MenuTemplateIds.Workers
                },
                new MenuItemTranslation
                {
                    Id = 6,
                    Name = "Units",
                    MenuItemId = MenuTemplateIds.Units
                },
                new MenuItemTranslation
                {
                    Id = 7,
                    Name = "Searchable List",
                    MenuItemId = MenuTemplateIds.SearchableList
                },
                new MenuItemTranslation
                {
                    Id = 8,
                    Name = "Selectable list",
                    MenuItemId = MenuTemplateIds.SelectableList
                },
                new MenuItemTranslation
                {
                    Id = 9,
                    Name = "Application Settings",
                    MenuItemId = MenuTemplateIds.ApplicationSettings
                },
                new MenuItemTranslation
                {
                    Id = 10,
                    Name = "Plugins Settings",
                    MenuItemId = MenuTemplateIds.PluginsSettings
                },
                new MenuItemTranslation
                {
                    Id = 11,
                    Name = "Folders",
                    MenuItemId = MenuTemplateIds.Folders
                },
                new MenuItemTranslation
                {
                    Id = 12,
                    Name = "Email Recipients",
                    MenuItemId = MenuTemplateIds.EmailRecipients
                }
            };

            foreach (var menuTranslation in entities)
            {
                menuTranslation.LocaleName = LocaleNames.English;
                menuTranslation.Language = LanguageNames.English;
            }

            modelBuilder.Entity<MenuItemTranslation>().HasData(entities);
            return modelBuilder;
        }
    }
    
}
