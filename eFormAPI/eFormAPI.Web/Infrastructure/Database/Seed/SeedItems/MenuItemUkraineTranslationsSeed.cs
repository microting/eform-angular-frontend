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

using System.Collections.Generic;
using eFormAPI.Web.Infrastructure.Const;
using eFormAPI.Web.Infrastructure.Database.Entities.Menu;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Infrastructure.Consts;

namespace eFormAPI.Web.Infrastructure.Database.Seed.SeedItems
{
    public static class MenuItemUkrainianTranslationsSeed
    {
        //[FromServices]ILocalizationService localizationService
        public static ModelBuilder AddDefaultMenuUkrainianTranslations(this ModelBuilder modelBuilder)
        {
            var entities = new List<MenuItemTranslation>()
            {
                new MenuItemTranslation
                {
                    Id = 14,
                    Name = "Мої ЕФорми",
                    MenuItemId = MenuTemplateIds.MyEforms,
                },
                new MenuItemTranslation
                {
                    Id = 15,
                    Name = "Користувачі пристроїв",
                    MenuItemId = MenuTemplateIds.DeviceUsers
                },
                new MenuItemTranslation
                {
                    Id = 3,
                    Name = "Додатково",
                    MenuItemId = MenuTemplateIds.Advanced
                },
                new MenuItemTranslation
                {
                    Id = 4,
                    Name = "Місця",
                    MenuItemId = MenuTemplateIds.Sites
                },
                new MenuItemTranslation
                {
                    Id = 5,
                    Name = "Працівники",
                    MenuItemId = MenuTemplateIds.Workers
                },
                new MenuItemTranslation
                {
                    Id = 6,
                    Name = "Юніти",
                    MenuItemId = MenuTemplateIds.Units
                },
                new MenuItemTranslation
                {
                    Id = 7,
                    Name = "Пошуковий список",
                    MenuItemId = MenuTemplateIds.SearchableList
                },
                new MenuItemTranslation
                {
                    Id = 8,
                    Name = "Вибірковий список",
                    MenuItemId = MenuTemplateIds.SelectableList
                },
                new MenuItemTranslation
                {
                    Id = 9,
                    Name = "Налаштування застосунку",
                    MenuItemId = MenuTemplateIds.ApplicationSettings
                },
                new MenuItemTranslation
                {
                    Id = 10,
                    Name = "Налаштування плагінів",
                    MenuItemId = MenuTemplateIds.PluginsSettings
                },
                new MenuItemTranslation
                {
                    Id = 11,
                    Name = "Папки",
                    MenuItemId = MenuTemplateIds.Folders
                },
                new MenuItemTranslation
                {
                    Id = 12,
                    Name = "Email одержувачі",
                    MenuItemId = MenuTemplateIds.EmailRecipients
                }
            };

            foreach (var menuTranslation in entities)
            {
                menuTranslation.LocaleName = LocaleNames.Ukrainian;
                menuTranslation.Language = LanguageNames.Ukrainian;
            }

            modelBuilder.Entity<MenuItemTranslation>().HasData(entities);
            return modelBuilder;
        }
    }
}