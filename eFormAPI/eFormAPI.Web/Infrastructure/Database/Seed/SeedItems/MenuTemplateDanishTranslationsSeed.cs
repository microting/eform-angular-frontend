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
    using System.Collections.Generic;
    using Const;
    using Entities.Menu;
    using Microsoft.EntityFrameworkCore;
    using Microting.eFormApi.BasePn.Infrastructure.Consts;

    public static class MenuTemplateDanishTranslationsSeed
    {
        public static ModelBuilder AddMenuTemplateDanishTranslations(this ModelBuilder modelBuilder)
        {
            var entities = new List<MenuTemplateTranslation>()
            {
                new MenuTemplateTranslation
                {
                    Id = 13,
                    Name = "Mine eForms",
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                },
                new MenuTemplateTranslation
                {
                    Id = 14,
                    Name = "Mobilbrugere",
                    MenuTemplateId = MenuTemplateIds.DeviceUsers
                },
                new MenuTemplateTranslation
                {
                    Id = 15,
                    Name = "Admin",
                    MenuTemplateId = MenuTemplateIds.Advanced
                },
                new MenuTemplateTranslation
                {
                    Id = 16,
                    Name = "Lokationer",
                    MenuTemplateId = MenuTemplateIds.Sites
                },
                new MenuTemplateTranslation
                {
                    Id = 17,
                    Name = "Medarbejder",
                    MenuTemplateId = MenuTemplateIds.Workers
                },
                new MenuTemplateTranslation
                {
                    Id = 18,
                    Name = "Enheder",
                    MenuTemplateId = MenuTemplateIds.Units
                },
                new MenuTemplateTranslation
                {
                    Id = 19,
                    Name = "Søgbar Lister",
                    MenuTemplateId = MenuTemplateIds.SearchableList
                },
                new MenuTemplateTranslation
                {
                    Id = 20,
                    Name = "Valgbar Liste",
                    MenuTemplateId = MenuTemplateIds.SelectableList
                },
                new MenuTemplateTranslation
                {
                    Id = 21,
                    Name = "Applikationsindstillinger",
                    MenuTemplateId = MenuTemplateIds.ApplicationSettings
                },
                new MenuTemplateTranslation
                {
                    Id = 22,
                    Name = "Plugins",
                    MenuTemplateId = MenuTemplateIds.PluginsSettings
                },
                new MenuTemplateTranslation
                {
                    Id = 23,
                    Name = "Folders",
                    MenuTemplateId = MenuTemplateIds.Folders
                },
                new MenuTemplateTranslation
                {
                    Id = 24,
                    Name = "E-mail-modtagere",
                    MenuTemplateId = MenuTemplateIds.EmailRecipients
                }
            };

            foreach (var menuTranslation in entities)
            {
                menuTranslation.LocaleName = LocaleNames.Danish;
                menuTranslation.Language = LanguageNames.Danish;
            }

            modelBuilder.Entity<MenuTemplateTranslation>().HasData(entities);
            return modelBuilder;
        }
    }
}