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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
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
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Const;
using TrashInspection.Pn.Infrastructure.Data.Seed;
using TrashInspection.Pn.Infrastructure.Data.Seed.Data;
using TrashInspection.Pn.Infrastructure.Models;
using TrashInspection.Pn.Services;

namespace TrashInspection.Pn
{
    public class EformTrashInspectionPlugin : IEformPlugin
    {
        public string Name => "Microting Trash Inspection Plugin";
        public string PluginId => "eform-angular-trashinspection-plugin";
        public string PluginBaseUrl => "trash-inspection-pn";
        public string PluginPath => PluginAssembly().Location;
        private string _connectionString;
        private string _sdkConnectionString;
        private int _maxParallelism = 1;
        private int _numberOfWorkers = 1;

        public Assembly PluginAssembly()
        {
            return typeof(EformTrashInspectionPlugin).GetTypeInfo().Assembly;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<IFractionService, FractionService>();
            services.AddTransient<ISegmentService, SegmentService>();
            services.AddTransient<IInstallationService, InstallationService>();
            services.AddSingleton<ITrashInspectionLocalizationService, TrashInspectionLocalizationService>();
            services.AddTransient<ITrashInspectionService, TrashInspectionService>();
            services.AddTransient<ITrashInspectionPnSettingsService, TrashInspectionPnSettingsService>();
            services.AddTransient<ITransporterService, TransporterService>();
            services.AddTransient<IProducerService, ProducerService>();
            services.AddSingleton<IRebusService, RebusService>();
        }

        public void AddPluginConfig(IConfigurationBuilder builder, string connectionString)
        {
            var seedData = new TrashInspectionConfigurationSeedData();
            var contextFactory = new TrashInspectionPnContextFactory();
            builder.AddPluginConfiguration(
                connectionString,
                seedData,
                contextFactory);
        }

        public void ConfigureDbContext(IServiceCollection services, string connectionString)
        {
            _connectionString = connectionString;
            services.AddDbContext<TrashInspectionPnDbContext>(o => o.UseMySql(connectionString,
                b => b.MigrationsAssembly(PluginAssembly().FullName)));

            TrashInspectionPnContextFactory contextFactory = new TrashInspectionPnContextFactory();
            var context = contextFactory.CreateDbContext(new[] { connectionString });
            context.Database.Migrate();

            // Seed database
            SeedDatabase(connectionString);

            string temp = context.PluginConfigurationValues
                .SingleOrDefault(x => x.Name == "TrashInspectionBaseSettings:MaxParallelism")?.Value;
            _maxParallelism = string.IsNullOrEmpty(temp) ? 1 : int.Parse(temp);

            temp = context.PluginConfigurationValues
                .SingleOrDefault(x => x.Name == "TrashInspectionBaseSettings:NumberOfWorkers")?.Value;
            _numberOfWorkers = string.IsNullOrEmpty(temp) ? 1 : int.Parse(temp);

            _sdkConnectionString = context.PluginConfigurationValues
                .SingleOrDefault(x => x.Name == "TrashInspectionBaseSettings:SdkConnectionString")?.Value;
        }

        public void Configure(IApplicationBuilder appBuilder)
        {
            var serviceProvider = appBuilder.ApplicationServices;
            IRebusService rebusService = serviceProvider.GetService<IRebusService>();
            Console.WriteLine($"[DBG] EformTrashInspectionPlugin.Configure _sdkConnectionString is {_sdkConnectionString}");
            if (!_sdkConnectionString.Contains("..."))
            {
                rebusService.Start(_sdkConnectionString, _connectionString, _maxParallelism, _numberOfWorkers);
            }

        }

        public List<PluginMenuItemModel> GetNavigationMenu(IServiceProvider serviceProvider)
        {
            var pluginMenu = new List<PluginMenuItemModel>
            {
                    new PluginMenuItemModel
                    {
                        Name = "Dropdown",
                        E2EId = "trash-inspection-pn",
                        Link = "",
                        Type = MenuItemTypeEnum.Dropdown,
                        Position = 0,
                        Translations = new List<PluginMenuTranslationModel>
                        {
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.English,
                                 Name = "Trash Inspection",
                                 Language = LanguageNames.English,
                            },
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.German,
                                 Name = "Trash Inspection",
                                 Language = LanguageNames.German,
                            },
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.Danish,
                                 Name = "Affaldsinspektion",
                                 Language = LanguageNames.Danish,
                            }
                        },
                        ChildItems = new List<PluginMenuItemModel>
                        {
                            new PluginMenuItemModel
                            {
                                Name = "Trash Inspections",
                                E2EId = "trash-inspection-pn-trash-inspection",
                                Link = "/plugins/trash-inspection-pn/trash-inspections",
                                Type = MenuItemTypeEnum.Link,
                                Position = 0,
                                MenuTemplate = new PluginMenuTemplateModel
                                {
                                    Name = "Trash Inspections",
                                    E2EId = "trash-inspection-pn-trash-inspection",
                                    DefaultLink = "/plugins/trash-inspection-pn/trash-inspections",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>
                                    {
                                        new PluginMenuTemplatePermissionModel
                                        {
                                            ClaimName = TrashInspectionClaims.AccessTrashInspections,
                                            PermissionName = "Obtain trash inspections",
                                            PermissionTypeName = "TrashInspections",
                                        }
                                    },
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Trash Inspections",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Trash Inspections",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Affaldsinspektioner",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Trash Inspections",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Trash Inspections",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Affaldsinspektioner",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                            },
                            new PluginMenuItemModel
                            {
                                Name = "Installations",
                                E2EId = "trash-inspection-pn-installations",
                                Link = "/plugins/trash-inspection-pn/installations",
                                Type = MenuItemTypeEnum.Link,
                                Position = 1,
                                MenuTemplate = new PluginMenuTemplateModel
                                {
                                    Name = "Installations",
                                    E2EId = "trash-inspection-pn-installations",
                                    DefaultLink = "/plugins/trash-inspection-pn/installations",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>
                                    {
                                        new PluginMenuTemplatePermissionModel
                                        {
                                            ClaimName = TrashInspectionClaims.AccessInstallations,
                                            PermissionName = "Obtain installations",
                                            PermissionTypeName = "Installations",
                                        }
                                    },
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Installations",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Installations",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Installationer",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Installations",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Installations",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Installationer",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                            },
                            new PluginMenuItemModel
                            {
                                Name = "Fractions",
                                E2EId = "trash-inspection-pn-fractions",
                                Link = "/plugins/trash-inspection-pn/fractions",
                                Type = MenuItemTypeEnum.Link,
                                Position = 2,
                                MenuTemplate = new PluginMenuTemplateModel
                                {
                                    Name = "Fractions",
                                    E2EId = "trash-inspection-pn-fractions",
                                    DefaultLink = "/plugins/trash-inspection-pn/fractions",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>
                                    {
                                        new PluginMenuTemplatePermissionModel
                                        {
                                            ClaimName = TrashInspectionClaims.AccessFractions,
                                            PermissionName = "Obtain fractions",
                                            PermissionTypeName = "Fractions",
                                        }
                                    },
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Fractions",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Fractions",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Fraktioner",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Fractions",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Fractions",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Fraktioner",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                            },
                            new PluginMenuItemModel
                            {
                                Name = "Segments",
                                E2EId = "trash-inspection-pn-segments",
                                Link = "/plugins/trash-inspection-pn/segments",
                                Type = MenuItemTypeEnum.Link,
                                Position = 3,
                                MenuTemplate = new PluginMenuTemplateModel
                                {
                                    Name = "Segments",
                                    E2EId = "trash-inspection-pn-segments",
                                    DefaultLink = "/plugins/trash-inspection-pn/segments",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>
                                    {
                                        new PluginMenuTemplatePermissionModel
                                        {
                                            ClaimName = TrashInspectionClaims.AccessSegments,
                                            PermissionName = "Obtain segments",
                                            PermissionTypeName = "Segments",
                                        }
                                    },
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Segments",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Segments",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Områder",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Segments",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Segments",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Områder",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                            },
                            new PluginMenuItemModel
                            {
                                Name = "Producers",
                                E2EId = "trash-inspection-pn-producers",
                                Link = "/plugins/trash-inspection-pn/producers",
                                Type = MenuItemTypeEnum.Link,
                                Position = 4,
                                MenuTemplate = new PluginMenuTemplateModel
                                {
                                    Name = "Producers",
                                    E2EId = "trash-inspection-pn-producers",
                                    DefaultLink = "/plugins/trash-inspection-pn/producers",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>
                                    {
                                        new PluginMenuTemplatePermissionModel
                                        {
                                            ClaimName = TrashInspectionClaims.AccessProducers,
                                            PermissionName = "Obtain producers",
                                            PermissionTypeName = "Producers",
                                        }
                                    },
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Producers",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Producers",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Producenter",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Producers",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Producers",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Producenter",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                            },
                            new PluginMenuItemModel
                            {
                                Name = "Transporters",
                                E2EId = "trash-inspection-pn-transporters",
                                Link = "/plugins/trash-inspection-pn/transporters",
                                Type = MenuItemTypeEnum.Link,
                                Position = 5,
                                MenuTemplate = new PluginMenuTemplateModel
                                {
                                    Name = "Transporters",
                                    E2EId = "trash-inspection-pn-transporters",
                                    DefaultLink = "/plugins/trash-inspection-pn/transporters",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>
                                    {
                                        new PluginMenuTemplatePermissionModel
                                        {
                                            ClaimName = TrashInspectionClaims.AccessTransporters,
                                            PermissionName = "Obtain transporters",
                                            PermissionTypeName = "Transporters",
                                        }
                                    },
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Transporters",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Transporters",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Transportører",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Transporters",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Transporters",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Transportører",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                            },
                            new PluginMenuItemModel
                            {
                                Name = "Reports",
                                E2EId = "trash-inspection-pn-reports",
                                Link = "/plugins/trash-inspection-pn/reports",
                                Type = MenuItemTypeEnum.Link,
                                Position = 6,
                                MenuTemplate = new PluginMenuTemplateModel
                                {
                                    Name = "Reports",
                                    E2EId = "trash-inspection-pn-reports",
                                    DefaultLink = "/plugins/trash-inspection-pn/reports",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>
                                    {
                                        new PluginMenuTemplatePermissionModel
                                        {
                                            ClaimName = TrashInspectionClaims.AccessReports,
                                            PermissionName = "Obtain reports",
                                            PermissionTypeName = "Reports",
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
                                            Name = "Reports",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Rapporter",
                                            Language = LanguageNames.Danish,
                                        },
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
                                            Name = "Reports",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Rapporter",
                                            Language = LanguageNames.Danish,
                                        },
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
                .GetService<ITrashInspectionLocalizationService>();

            var result = new MenuModel();
            result.LeftMenu.Add(new MenuItemModel
            {
                Name = localizationService.GetString("TrashInspection"),
                E2EId = "",
                Link = "",
                Guards = new List<string> { TrashInspectionClaims.AccessTrashInspectionPlugin },
                MenuItems = new List<MenuItemModel>
                {
                    new MenuItemModel
                    {
                        Name = localizationService.GetString("TrashInspections"),
                        E2EId = "trash-inspection-pn-trash-inspection",
                        Link = "/plugins/trash-inspection-pn/trash-inspections",
                        Guards = new List<string> { TrashInspectionClaims.AccessTrashInspections },
                        Position = 0,
                    },
                    new MenuItemModel
                    {
                        Name = localizationService.GetString("Installations"),
                        E2EId = "trash-inspection-pn-installations",
                        Link = "/plugins/trash-inspection-pn/installations",
                        Guards = new List<string> { TrashInspectionClaims.AccessInstallations },
                        Position = 1,
                    },
                    new MenuItemModel
                    {
                        Name = localizationService.GetString("Fractions"),
                        E2EId = "trash-inspection-pn-fractions",
                        Link = "/plugins/trash-inspection-pn/fractions",
                        Guards = new List<string> { TrashInspectionClaims.AccessFractions },
                        Position = 2,
                    },
                    new MenuItemModel
                    {
                        Name = localizationService.GetString("Segments"),
                        E2EId = "trash-inspection-pn-segments",
                        Link = "/plugins/trash-inspection-pn/segments",
                        Guards = new List<string> { TrashInspectionClaims.AccessSegments },
                        Position = 3,
                    },
                    new MenuItemModel
                    {
                        Name = localizationService.GetString("Producers"),
                        E2EId = "trash-inspection-pn-producers",
                        Link = "/plugins/trash-inspection-pn/producers",
                        Guards = new List<string> { TrashInspectionClaims.AccessProducers },
                        Position = 4,
                    },
                    new MenuItemModel
                    {
                        Name = localizationService.GetString("Transporters"),
                        E2EId = "trash-inspection-pn-transporters",
                        Link = "/plugins/trash-inspection-pn/transporters",
                        Guards = new List<string> { TrashInspectionClaims.AccessTransporters },
                        Position = 5,
                    },
                    new MenuItemModel
                    {
                        Name = localizationService.GetString("Reports"),
                        E2EId = "trash-inspection-pn-reports",
                        Link = "/plugins/trash-inspection-pn/reports",
                        Guards = new List<string> { TrashInspectionClaims.AccessReports },
                        Position = 6,
                    }
                }
            });
            return result;
        }

        public void SeedDatabase(string connectionString)
        {
            var contextFactory = new TrashInspectionPnContextFactory();
            using (var context = contextFactory.CreateDbContext(new[] { connectionString }))
            {
                TrashInspectionPluginSeed.SeedData(context);
            }
        }

        public void ConfigureOptionsServices(IServiceCollection services, IConfiguration configuration)
        {
            services.ConfigurePluginDbOptions<TrashInspectionBaseSettings>(
                configuration.GetSection("TrashInspectionBaseSettings"));
        }

        public PluginPermissionsManager GetPermissionsManager(string connectionString)
        {
            var contextFactory = new TrashInspectionPnContextFactory();
            var context = contextFactory.CreateDbContext(new[] { connectionString });

            return new PluginPermissionsManager(context);
        }
    }
}