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
    using Microting.eFormApi.BasePn.Infrastructure.Consts;
    using System.Collections.Generic;

    public static class MenuItemGermanTranslationsSeed
    {
        public static ModelBuilder AddDefaultMenuGermanTranslations(this ModelBuilder modelBuilder)
        {
            var entities = new List<MenuItemTranslation>()
            {
                new MenuItemTranslation
                {
                    Id = 27,
                    Name = "Meine eForms",
                    MenuItemId = MenuTemplateIds.MyEforms,
                },
                new MenuItemTranslation
                {
                    Id = 28,
                    Name = "Gerätebenutzer ",
                    MenuItemId = MenuTemplateIds.DeviceUsers
                },
                new MenuItemTranslation
                {
                    Id = 29,
                    Name = "Fortgeschritten",
                    MenuItemId = MenuTemplateIds.Advanced
                },
                new MenuItemTranslation
                {
                    Id = 30,
                    Name = "Standorte",
                    MenuItemId = MenuTemplateIds.Sites
                },
                new MenuItemTranslation
                {
                    Id = 31,
                    Name = "Mitarbeiter",
                    MenuItemId = MenuTemplateIds.Workers
                },
                new MenuItemTranslation
                {
                    Id = 32,
                    Name = "Einheiten",
                    MenuItemId = MenuTemplateIds.Units
                },
                new MenuItemTranslation
                {
                    Id = 33,
                    Name = "Durchsuchbare Listen",
                    MenuItemId = MenuTemplateIds.SearchableList
                },
                new MenuItemTranslation
                {
                    Id = 34,
                    Name = "Auswählbare Liste",
                    MenuItemId = MenuTemplateIds.SelectableList
                },
                new MenuItemTranslation
                {
                    Id = 35,
                    Name = "Anwendungseinstellungen",
                    MenuItemId = MenuTemplateIds.ApplicationSettings
                },
                new MenuItemTranslation
                {
                    Id = 36,
                    Name = "Plugins",
                    MenuItemId = MenuTemplateIds.PluginsSettings
                },
                new MenuItemTranslation
                {
                    Id = 37,
                    Name = "Folders",
                    MenuItemId = MenuTemplateIds.Folders
                },
                new MenuItemTranslation
                {
                    Id = 38,
                    Name = "E-Mail-Empfänger",
                    MenuItemId = MenuTemplateIds.EmailRecipients
                }
            };

            foreach (var menuTranslation in entities)
            {
                menuTranslation.LocaleName = LocaleNames.German;
                menuTranslation.Language = LanguageNames.German;
            }

            modelBuilder.Entity<MenuItemTranslation>().HasData(entities);
            return modelBuilder;
        }
    }
}
