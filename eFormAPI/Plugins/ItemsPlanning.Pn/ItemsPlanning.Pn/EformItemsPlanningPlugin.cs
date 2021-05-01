/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

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

namespace ItemsPlanning.Pn
{
    using System;
    using System.Collections.Generic;
    using System.Reflection;
    using Infrastructure.Data.Seed;
    using Infrastructure.Data.Seed.Data;
    using Infrastructure.Models.Settings;
    using Services.ItemsPlanningTagsService;
    using Messages;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microting.eFormApi.BasePn;
    using Microting.eFormApi.BasePn.Infrastructure.Consts;
    using Microting.eFormApi.BasePn.Infrastructure.Database.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;
    using Microting.eFormApi.BasePn.Infrastructure.Settings;
    using Microting.ItemsPlanningBase.Infrastructure.Const;
    using Microting.ItemsPlanningBase.Infrastructure.Data;
    using Microting.ItemsPlanningBase.Infrastructure.Data.Factories;
    using Rebus.Bus;
    using Services.ExcelService;
    using Services.ItemsPlanningLocalizationService;
    using Services.ItemsPlanningPnSettingsService;
    using Services.ItemsPlanningReportService;
    using Services.PairingService;
    using Services.PlanningImportService;
    using Services.PlanningService;
    using Services.RebusService;
    using Services.UploadedDataService;
    using Services.WordService;

    public class EformItemsPlanningPlugin : IEformPlugin
    {
        public string Name => "Microting Items Planning Plugin";
        public string PluginId => "eform-angular-items-planning-plugin";
        public string PluginPath => PluginAssembly().Location;
        public string PluginBaseUrl => "items-planning-pn";

        private string _connectionString;
        private IBus _bus;

        public Assembly PluginAssembly()
        {
            return typeof(EformItemsPlanningPlugin).GetTypeInfo().Assembly;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IItemsPlanningLocalizationService, ItemsPlanningLocalizationService>();
            services.AddTransient<IItemsPlanningPnSettingsService, ItemsPlanningPnSettingsService>();
            services.AddTransient<IItemsPlanningReportService, ItemsPlanningReportService>();
            services.AddTransient<IItemsPlanningTagsService, ItemsPlanningTagsService>();
            services.AddTransient<IPlanningService, PlanningService>();
            services.AddTransient<IPairingService, PairingService>();
            services.AddTransient<IUploadedDataService, UploadedDataService>();
            services.AddSingleton<IRebusService, RebusService>();
            services.AddTransient<IWordService, WordService>();
            services.AddTransient<IPlanningExcelService, PlanningExcelService>();
            services.AddTransient<IPlanningImportService, PlanningImportService>();
            services.AddControllers();
        }

        public void AddPluginConfig(IConfigurationBuilder builder, string connectionString)
        {
            var seedData = new ItemsPlanningConfigurationSeedData();
            var contextFactory = new ItemsPlanningPnContextFactory();
            builder.AddPluginConfiguration(
                connectionString,
                seedData,
                contextFactory);

            //CaseUpdateDelegates.CaseUpdateDelegate += UpdateRelatedCase;
        }

        public void ConfigureOptionsServices(
            IServiceCollection services,
            IConfiguration configuration)
        {
            services.ConfigurePluginDbOptions<ItemsPlanningBaseSettings>(
                configuration.GetSection("ItemsPlanningBaseSettings"));
        }

        public void ConfigureDbContext(IServiceCollection services, string connectionString)
        {
            _connectionString = connectionString;
            if (connectionString.ToLower().Contains("convert zero datetime"))
            {
                services.AddDbContext<ItemsPlanningPnDbContext>(o => o.UseMySql(connectionString,
                    b => b.MigrationsAssembly(PluginAssembly().FullName).EnableRetryOnFailure()));
            }
            else
            {
                services.AddDbContext<ItemsPlanningPnDbContext>(o => o.UseSqlServer(connectionString,
                    b => b.MigrationsAssembly(PluginAssembly().FullName)));
            }

            ItemsPlanningPnContextFactory contextFactory = new ItemsPlanningPnContextFactory();
            var context = contextFactory.CreateDbContext(new[] {connectionString});
            context.Database.Migrate();

            // Seed database
            SeedDatabase(connectionString);
        }

        public void Configure(IApplicationBuilder appBuilder)
        {
            var serviceProvider = appBuilder.ApplicationServices;
            IRebusService rebusService = serviceProvider.GetService<IRebusService>();
            rebusService.Start(_connectionString);

            _bus = rebusService.GetBus();
        }

        public List<PluginMenuItemModel> GetNavigationMenu(IServiceProvider serviceProvider)
        {
            var pluginMenu = new List<PluginMenuItemModel>()
                {
                    new PluginMenuItemModel
                    {
                        Name = "Dropdown",
                        E2EId = "items-planning-pn",
                        Link = "",
                        Type = MenuItemTypeEnum.Dropdown,
                        Position = 0,
                        Translations = new List<PluginMenuTranslationModel>()
                        {
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.English,
                                 Name = "Items Planning",
                                 Language = LanguageNames.English,
                            },
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.German,
                                 Name = "Artikelplanung",
                                 Language = LanguageNames.German,
                            },
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.Danish,
                                 Name = "Egenkontrol",
                                 Language = LanguageNames.Danish,
                            },
                            new PluginMenuTranslationModel
                            {
                                LocaleName = LocaleNames.Ukrainian,
                                Name = "Планування елементів",
                                Language = LanguageNames.Ukrainian,
                            }
                        },
                        ChildItems = new List<PluginMenuItemModel>()
                        {
                            new PluginMenuItemModel
                            {
                                Name = "Planning",
                                E2EId = "items-planning-pn-plannings",
                                Link = "/plugins/items-planning-pn/plannings",
                                Type = MenuItemTypeEnum.Link,
                                Position = 0,
                                MenuTemplate = new PluginMenuTemplateModel()
                                {
                                    Name = "Planning",
                                    E2EId = "items-planning-pn-plannings",
                                    DefaultLink = "/plugins/items-planning-pn/plannings",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>()
                                    {
                                        new PluginMenuTemplatePermissionModel
                                        {
                                            ClaimName = ItemsPlanningClaims.GetPlannings,
                                            PermissionName = "Obtain plannings",
                                            PermissionTypeName = "Plannings",
                                        },
                                    },
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Planning",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Planung",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Planlægning",
                                            Language = LanguageNames.Danish,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Ukrainian,
                                            Name = "Планування",
                                            Language = LanguageNames.Ukrainian,
                                        }
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                {
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.English,
                                        Name = "Planning",
                                        Language = LanguageNames.English,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.German,
                                        Name = "Planung",
                                        Language = LanguageNames.German,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.Danish,
                                        Name = "Planlægning",
                                        Language = LanguageNames.Danish,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.Ukrainian,
                                        Name = "Планування",
                                        Language = LanguageNames.Ukrainian,
                                    }
                                }
                            },
                            new PluginMenuItemModel
                            {
                                Name = "Reports",
                                E2EId = "items-planning-pn-reports",
                                Link = "/plugins/items-planning-pn/reports",
                                Type = MenuItemTypeEnum.Link,
                                Position = 1,
                                MenuTemplate = new PluginMenuTemplateModel()
                                {
                                    Name = "Reports",
                                    E2EId = "items-planning-pn-reports",
                                    DefaultLink = "/plugins/items-planning-pn/reports",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>(),
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Reports",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Berichte",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Rapporter",
                                            Language = LanguageNames.Danish,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Ukrainian,
                                            Name = "Звіти",
                                            Language = LanguageNames.Ukrainian,
                                        }
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                {
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.English,
                                        Name = "Reports",
                                        Language = LanguageNames.English,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.German,
                                        Name = "Berichte",
                                        Language = LanguageNames.German,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.Danish,
                                        Name = "Rapporter",
                                        Language = LanguageNames.Danish,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.Ukrainian,
                                        Name = "Звіти",
                                        Language = LanguageNames.Ukrainian,
                                    }
                                }
                            },
                            new PluginMenuItemModel
                            {
                                Name = "Pairing",
                                E2EId = "items-planning-pn-pairing",
                                Link = "/plugins/items-planning-pn/pairing",
                                Type = MenuItemTypeEnum.Link,
                                Position = 2,
                                MenuTemplate = new PluginMenuTemplateModel()
                                {
                                    Name = "Pairing",
                                    E2EId = "items-planning-pn-pairing",
                                    DefaultLink = "/plugins/items-planning-pn/pairing",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>(),
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Pairing",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Koppelen",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Parring",
                                            Language = LanguageNames.Danish,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Ukrainian,
                                            Name = "Зв'язування",
                                            Language = LanguageNames.Ukrainian,
                                        }
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Pairing",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Koppelen",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Parring",
                                            Language = LanguageNames.Danish,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Ukrainian,
                                            Name = "Зв'язування",
                                            Language = LanguageNames.Ukrainian,
                                        }
                                    }
                            }
                        }
                    }
                };

            return pluginMenu;
        }

        public MenuModel HeaderMenu(IServiceProvider serviceProvider)
        {
            var localizationService = serviceProvider
                .GetService<IItemsPlanningLocalizationService>();

            var result = new MenuModel();
            result.LeftMenu.Add(new MenuItemModel()
            {
                Name = localizationService.GetString("ItemsPlanning"),
                E2EId = "items-planning-pn",
                Link = "",
                Guards = new List<string>() { ItemsPlanningClaims.AccessItemsPlanningPlugin },
                MenuItems = new List<MenuItemModel>()
                {
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Plannings"),
                        E2EId = "items-planning-pn-plannings",
                        Link = "/plugins/items-planning-pn/plannings",
                        Guards = new List<string>() { ItemsPlanningClaims.GetPlannings },
                        Position = 0,
                    },
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Reports"),
                        E2EId = "items-planning-pn-reports",
                        Link = "/plugins/items-planning-pn/reports",
                        Position = 2,
                    }
                }
            });
            return result;
        }

        public void SeedDatabase(string connectionString)
        {
            // Get DbContext
            var contextFactory = new ItemsPlanningPnContextFactory();
            using (var context = contextFactory.CreateDbContext(new []{connectionString}))
            {
                // Seed configuration
                ItemsPlanningPluginSeed.SeedData(context);
            }
        }

        public PluginPermissionsManager GetPermissionsManager(string connectionString)
        {
            var contextFactory = new ItemsPlanningPnContextFactory();
            var context = contextFactory.CreateDbContext(new[] { connectionString });

            return new PluginPermissionsManager(context);
        }

        private void UpdateRelatedCase(int caseId)
        {
            _bus.SendLocal(new eFormCaseUpdated(caseId));
        }
    }
}
