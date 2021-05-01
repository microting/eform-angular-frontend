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
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Constants;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Factories;
using OuterInnerResource.Pn.Abstractions;
using OuterInnerResource.Pn.Infrastructure.Data.Seed;
using OuterInnerResource.Pn.Infrastructure.Data.Seed.Data;
using OuterInnerResource.Pn.Infrastructure.Models.Settings;
using OuterInnerResource.Pn.Services;

namespace OuterInnerResource.Pn
{
    public class EformOuterInnerResourcePlugin : IEformPlugin
    {
        public string Name => "Microting Outer Inner Resource plugin";
        public string PluginId => "eform-angular-outer-inner-resource-plugin";
        public string PluginPath => PluginAssembly().Location;
        public string PluginBaseUrl => "outer-inner-resource-pn";

        private string _connectionString;
        private string _outerResourceName = "OuterResources";
        private string _innerResourceName = "InnerResources";
        private int _maxParallelism = 1;
        private int _numberOfWorkers = 1;

        public Assembly PluginAssembly()
        {
            return typeof(EformOuterInnerResourcePlugin).GetTypeInfo().Assembly;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IOuterInnerResourceLocalizationService, OuterInnerResourceLocalizationService>();
            services.AddTransient<IOuterResourceService, OuterResourceService>();
            services.AddTransient<IInnerResourceService, InnerResourceService>();
            services.AddTransient<IOuterInnerResourceSettingsService, OuterInnerResourceSettingsService>();
            services.AddTransient<IOuterInnerResourceReportService, OuterInnerResourceReportService>();
            services.AddTransient<IResourceTimeRegistrationService, ResourceTimeRegistrationService>();
            services.AddTransient<IExcelService, ExcelService>();
            services.AddSingleton<IRebusService, RebusService>();
        }

        public void AddPluginConfig(IConfigurationBuilder builder, string connectionString)
        {
            OuterInnerResourceConfigurationSeedData seedData = new OuterInnerResourceConfigurationSeedData();
            OuterInnerResourcePnContextFactory contextFactory = new OuterInnerResourcePnContextFactory();
            builder.AddPluginConfiguration(
                connectionString,
                seedData,
                contextFactory);
        }

        public void ConfigureOptionsServices(
            IServiceCollection services,
            IConfiguration configuration)
        {
            services.ConfigurePluginDbOptions<OuterInnerResourceSettings>(
                configuration.GetSection("OuterInnerResourceSettings"));
        }

        public void ConfigureDbContext(IServiceCollection services, string connectionString)
        {
            _connectionString = connectionString;
            if (connectionString.ToLower().Contains("convert zero datetime"))
            {
                services.AddDbContext<OuterInnerResourcePnDbContext>(o => o.UseMySql(connectionString,
                    b => b.MigrationsAssembly(PluginAssembly().FullName)));
            }
            else
            {
                services.AddDbContext<OuterInnerResourcePnDbContext>(o => o.UseSqlServer(connectionString,
                    b => b.MigrationsAssembly(PluginAssembly().FullName)));
            }

            OuterInnerResourcePnContextFactory contextFactory = new OuterInnerResourcePnContextFactory();

            using (OuterInnerResourcePnDbContext context = contextFactory.CreateDbContext(new[] {connectionString}))
            {  
                context.Database.Migrate();
                try
                {
                    _outerResourceName = context.PluginConfigurationValues.SingleOrDefault(x => x.Name == "OuterInnerResourceSettings:OuterResourceName")?.Value;
                    _innerResourceName = context.PluginConfigurationValues.SingleOrDefault(x => x.Name == "OuterInnerResourceSettings:InnerResourceName")?.Value;
                    string temp = context.PluginConfigurationValues
                        .SingleOrDefault(x => x.Name == "OuterInnerResourceSettings:MaxParallelism")?.Value;
                    _maxParallelism = string.IsNullOrEmpty(temp) ? 1 : int.Parse(temp);

                    temp = context.PluginConfigurationValues
                        .SingleOrDefault(x => x.Name == "OuterInnerResourceSettings:NumberOfWorkers")?.Value;
                    _numberOfWorkers = string.IsNullOrEmpty(temp) ? 1 : int.Parse(temp);
                } catch {}
                
            }

            // Seed database
            SeedDatabase(connectionString);
            
            
        }

        public void Configure(IApplicationBuilder appBuilder)
        {
            IServiceProvider serviceProvider = appBuilder.ApplicationServices;
            IRebusService rebusService = serviceProvider.GetService<IRebusService>();
            if (!_connectionString.Contains("..."))
            {
                rebusService.Start(_connectionString, _maxParallelism, _numberOfWorkers);
            }
        }

        public List<PluginMenuItemModel> GetNavigationMenu(IServiceProvider serviceProvider)
        {
            var pluginMenu = new List<PluginMenuItemModel>()
                {
                    new PluginMenuItemModel
                    {
                        Name = "Dropdown",
                        E2EId = "outer-inner-resource-pn",
                        Link = "",
                        Type = MenuItemTypeEnum.Dropdown,
                        Position = 0,
                        Translations = new List<PluginMenuTranslationModel>()
                        {
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.English,
                                 Name = "Outer/inner resources",
                                 Language = LanguageNames.English,
                            },
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.German,
                                 Name = "Maschinenbereich",
                                 Language = LanguageNames.German,
                            },
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.Danish,
                                 Name = "Ydre/indre resourcer",
                                 Language = LanguageNames.Danish,
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
                                    Name = _innerResourceName,
                                    E2EId = "outer-inner-resource-pn-inner-resources",
                                    DefaultLink = "/plugins/outer-inner-resource-pn/inner-resources",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>(),
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = _innerResourceName,
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = _innerResourceName,
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = _innerResourceName,
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = _innerResourceName,
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = _innerResourceName,
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = _innerResourceName,
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                            },
                            new PluginMenuItemModel
                            {
                                Name = _outerResourceName,
                                E2EId = "outer-inner-resource-pn-outer-resources",
                                Link = "/plugins/outer-inner-resource-pn/outer-resources",
                                Type = MenuItemTypeEnum.Link,
                                Position = 1,
                                MenuTemplate = new PluginMenuTemplateModel()
                                {
                                    Name = _outerResourceName,
                                    E2EId = "outer-inner-resource-pn-outer-resources",
                                    DefaultLink = "/plugins/outer-inner-resource-pn/outer-resources",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>(),
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = _outerResourceName,
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = _outerResourceName,
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = _outerResourceName,
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = _outerResourceName,
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = _outerResourceName,
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = _outerResourceName,
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                            },
                            new PluginMenuItemModel
                            {
                                Name = "Reports",
                                E2EId = "outer-inner-resource-pn-reports",
                                Link = "/plugins/outer-inner-resource-pn/reports",
                                Type = MenuItemTypeEnum.Link,
                                Position = 2,
                                MenuTemplate = new PluginMenuTemplateModel()
                                {
                                    Name = "Reports",
                                    E2EId = "outer-inner-resource-pn-outer-resources",
                                    DefaultLink = "/plugins/outer-inner-resource-pn/outer-resources",
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
                                            Name = "Rapport",
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
                                            Name = "Berichte",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Rapport",
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
            IOuterInnerResourceLocalizationService localizationService = serviceProvider
                .GetService<IOuterInnerResourceLocalizationService>();

            MenuModel result = new MenuModel();
            result.LeftMenu.Add(new MenuItemModel()
            {
                Name = localizationService.GetString("OuterInnerResource"),
                E2EId = "outer-inner-resource-pn",
                Link = "",
                Guards = new List<string>() { OuterInnerResourceClaims.AccessOuterInnerResourcePlugin },
                MenuItems = new List<MenuItemModel>()
                {
                    new MenuItemModel()
                    {
//                        Name = localizationService.GetString("Machines"),
                        Name = _innerResourceName,
                        E2EId = $"outer-inner-resource-pn-inner-resources",
                        Link = $"/plugins/outer-inner-resource-pn/inner-resources",
                        Position = 0,
                    },
                    new MenuItemModel()
                    {
//                        Name = localizationService.GetString("Areas"),
                        Name = _outerResourceName,
                        E2EId = $"outer-inner-resource-pn-outer-resources",
                        Link = $"/plugins/outer-inner-resource-pn/outer-resources",
                        Position = 1,
                    },
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Reports"),
                        E2EId = "outer-inner-resource-pn-reports",
                        Link = "/plugins/outer-inner-resource-pn/reports",
                        Position = 2,
                    }
                }
            });
            return result;
        }

        public void SeedDatabase(string connectionString)
        {
            // Get DbContext
            OuterInnerResourcePnContextFactory contextFactory = new OuterInnerResourcePnContextFactory();
            using (OuterInnerResourcePnDbContext context = contextFactory.CreateDbContext(new[] { connectionString }))
            {
                // Seed configuration
                OuterInnerResourcePluginSeed.SeedData(context);
            }
        }

        public PluginPermissionsManager GetPermissionsManager(string connectionString)
        {
            var contextFactory = new OuterInnerResourcePnContextFactory();
            var context = contextFactory.CreateDbContext(new[] { connectionString });
            return new PluginPermissionsManager(context);
        }
    }
}
