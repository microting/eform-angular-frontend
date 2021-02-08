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

    public static class MenuItemDanishTranslationsSeed
    {
        public static ModelBuilder AddDefaultMenuDanishTranslations(this ModelBuilder modelBuilder)
        {
            var entities = new List<MenuItemTranslation>()
            {
                new MenuItemTranslation
                {
                    Id = 14,
                    Name = "Mine eForms",
                    MenuItemId = MenuTemplateIds.MyEforms,
                },
                new MenuItemTranslation
                {
                    Id = 15,
                    Name = "Mobilbrugere",
                    MenuItemId = MenuTemplateIds.DeviceUsers
                },
                new MenuItemTranslation
                {
                    Id = 16,
                    Name = "Admin",
                    MenuItemId = MenuTemplateIds.Advanced
                },
                new MenuItemTranslation
                {
                    Id = 17,
                    Name = "Lokationer",
                    MenuItemId = MenuTemplateIds.Sites
                },
                new MenuItemTranslation
                {
                    Id = 18,
                    Name = "Medarbejder",
                    MenuItemId = MenuTemplateIds.Workers
                },
                new MenuItemTranslation
                {
                    Id = 19,
                    Name = "Enheder",
                    MenuItemId = MenuTemplateIds.Units
                },
                new MenuItemTranslation
                {
                    Id = 20,
                    Name = "Søgbar Lister",
                    MenuItemId = MenuTemplateIds.SearchableList
                },
                new MenuItemTranslation
                {
                    Id = 21,
                    Name = "Valgbar Liste",
                    MenuItemId = MenuTemplateIds.SelectableList
                },
                new MenuItemTranslation
                {
                    Id = 22,
                    Name = "Applikationsindstillinger",
                    MenuItemId = MenuTemplateIds.ApplicationSettings
                },
                new MenuItemTranslation
                {
                    Id = 23,
                    Name = "Plugins",
                    MenuItemId = MenuTemplateIds.PluginsSettings
                },
                new MenuItemTranslation
                {
                    Id = 24,
                    Name = "Folders",
                    MenuItemId = MenuTemplateIds.Folders
                },
                new MenuItemTranslation
                {
                    Id = 25,
                    Name = "E-mail-modtagere",
                    MenuItemId = MenuTemplateIds.EmailRecipients
                }
            };

            foreach (var menuTranslation in entities)
            {
                menuTranslation.LocaleName = LocaleNames.Danish;
                menuTranslation.Language = LanguageNames.Danish;
            }

            modelBuilder.Entity<MenuItemTranslation>().HasData(entities);
            return modelBuilder;
        }
    }
}
