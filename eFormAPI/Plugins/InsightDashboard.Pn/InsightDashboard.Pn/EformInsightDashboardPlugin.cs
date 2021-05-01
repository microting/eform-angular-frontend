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

using InsightDashboard.Pn.Services.AnswersService;

namespace InsightDashboard.Pn
{
    using System;
    using System.Collections.Generic;
    using System.Reflection;
    using Infrastructure.Data.Seed;
    using Infrastructure.Data.Seed.Data;
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
    using Microting.InsightDashboardBase.Infrastructure.Consts;
    using Microting.InsightDashboardBase.Infrastructure.Data;
    using Microting.InsightDashboardBase.Infrastructure.Data.Factories;
    using Microting.InsightDashboardBase.Infrastructure.Models;
    using Services.Common.InsightDashboardLocalizationService;
    using Services.Common.InsightDashboardPnSettingsService;
    using Services.DashboardService;
    using Services.DictionaryService;
    using Services.InterviewsExcelService;
    using Services.InterviewsService;
    using Services.SurveysService;
    using Services.WordService;

    public class EformInsightDashboardPlugin : IEformPlugin
    {
        public string Name => "Microting InSight Dashboard Plugin";
        public string PluginId => "eform-angular-insight-dashboard-plugin";
        public string PluginPath => PluginAssembly().Location;
        public string PluginBaseUrl => "insight-dashboard-pn";

        public Assembly PluginAssembly()
        {
            return typeof(EformInsightDashboardPlugin).GetTypeInfo().Assembly;
        }

        public void Configure(IApplicationBuilder appBuilder)
        {
            // Do nothing
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IInsightDashboardLocalizationService, InsightDashboardLocalizationService>();
            services.AddTransient<IInsightDashboardPnSettingsService, InsightDashboardPnSettingsService>();
            services.AddScoped<ISurveysService, SurveysService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IDictionaryService, DictionaryService>();
            services.AddScoped<IInterviewsService, InterviewsService>();
            services.AddScoped<IAnswersService, AnswersService>();
            services.AddTransient<IInterviewsExcelService, InterviewsExcelService>();
            services.AddTransient<IWordService, WordService>();
        }

        public void ConfigureOptionsServices(IServiceCollection services, IConfiguration configuration)
        {
            services.ConfigurePluginDbOptions<InsightDashboardBaseSettings>(
                configuration.GetSection("InsightDashboardBaseSettings"));
        }

        public void ConfigureDbContext(IServiceCollection services, string connectionString)
        {
            if (connectionString.ToLower().Contains("convert zero datetime"))
            {
                services.AddDbContext<InsightDashboardPnDbContext>(o => o.UseMySql(connectionString,
                    b => b.MigrationsAssembly(PluginAssembly().FullName)));
            }
            else
            {
                services.AddDbContext<InsightDashboardPnDbContext>(o => o.UseMySql(connectionString,
                    b => b.MigrationsAssembly(PluginAssembly().FullName)));
            }

            var contextFactory = new InsightDashboardPnDbContextFactory();
            var context = contextFactory.CreateDbContext(new[] {connectionString});

            context.Database.Migrate();

            // Seed database
            SeedDatabase(connectionString);
        }

        public List<PluginMenuItemModel> GetNavigationMenu(IServiceProvider serviceProvider)
        {
            var pluginMenu = new List<PluginMenuItemModel>()
                {
                    new PluginMenuItemModel
                    {
                        Name = "Dropdown",
                        E2EId = "insight-dashboard-pn",
                        Link = "",
                        Type = MenuItemTypeEnum.Dropdown,
                        Position = 0,
                        Translations = new List<PluginMenuTranslationModel>()
                        {
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.English,
                                 Name = "InSight Dashboard",
                                 Language = LanguageNames.English,
                            },
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.German,
                                 Name = "InSight Dashboard",
                                 Language = LanguageNames.German,
                            },
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.Danish,
                                 Name = "InSight Dashboard",
                                 Language = LanguageNames.Danish,
                            }
                        },
                        ChildItems = new List<PluginMenuItemModel>()
                        {
                            new PluginMenuItemModel
                            {
                                Name ="Surveys configurations",
                                E2EId = "insight-dashboard-pn-surveys-configs",
                                Link = "/plugins/insight-dashboard-pn/surveys-configs",
                                Type = MenuItemTypeEnum.Link,
                                Position = 0,
                                MenuTemplate = new PluginMenuTemplateModel()
                                {
                                    Name ="Surveys configurations",
                                    E2EId = "insight-dashboard-pn-surveys-configs",
                                    DefaultLink = "/plugins/insight-dashboard-pn/surveys-configs",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>(),
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Surveys configurations",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Surveys configurations",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Undersøgelsesconfigurationer",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Surveys configurations",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Surveys configurations",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Undersøgelsesconfigurationer",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                            },
                            new PluginMenuItemModel
                            {
                                Name = "Dashboards",
                                E2EId = "insight-dashboard-pn-dashboards",
                                Link = "/plugins/insight-dashboard-pn/dashboards",
                                Type = MenuItemTypeEnum.Link,
                                Position = 1,
                                MenuTemplate = new PluginMenuTemplateModel()
                                {
                                    Name = "Dashboards",
                                    E2EId = "insight-dashboard-pn-dashboards",
                                    DefaultLink = "/plugins/insight-dashboard-pn/dashboards",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>(),
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Dashboards",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Dashboards",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Dashboards",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                {
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.English,
                                        Name = "Dashboards",
                                        Language = LanguageNames.English,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.German,
                                        Name = "Dashboards",
                                        Language = LanguageNames.German,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.Danish,
                                        Name = "Dashboards",
                                        Language = LanguageNames.Danish,
                                    },
                                }
                            },
                            new PluginMenuItemModel
                            {
                                Name = "Answers",
                                E2EId = "insight-dashboard-pn-answers",
                                Link = "/plugins/insight-dashboard-pn/answers",
                                Type = MenuItemTypeEnum.Link,
                                Position = 2,
                                MenuTemplate = new PluginMenuTemplateModel()
                                {
                                    Name = "Answers",
                                    E2EId = "insight-dashboard-pn-Answers",
                                    DefaultLink = "/plugins/insight-dashboard-pn/answers",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>(),
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Answers",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Antwort",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Svar",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                {
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.English,
                                        Name = "Answers",
                                        Language = LanguageNames.English,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.German,
                                        Name = "Antwort",
                                        Language = LanguageNames.German,
                                    },
                                    new PluginMenuTranslationModel
                                    {
                                        LocaleName = LocaleNames.Danish,
                                        Name = "Svar",
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
                .GetService<IInsightDashboardLocalizationService>();

            var result = new MenuModel();
            result.LeftMenu.Add(new MenuItemModel()
            {
                Name = localizationService.GetString("InsightDashboard"),
                E2EId = "",
                Link = "",
                Guards = new List<string>() { InsightDashboardClaims.AccessInsightDashboardPlugin },
                MenuItems = new List<MenuItemModel>()
                {
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("SurveysConfigs"),
                        E2EId = "insight-dashboard-pn-surveys-configs",
                        Link = "/plugins/insight-dashboard-pn/surveys-configs",
                        Position = 0
                    },
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Dashboards"),
                        E2EId = "insight-dashboard-pn-dashboards",
                        Link = "/plugins/insight-dashboard-pn/dashboards",
                        Position = 1
                    },
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Answers"),
                        E2EId = "insight-dashboard-pn-answers",
                        Link = "/plugins/insight-dashboard-pn/answers",
                        Position = 2
                    },
                }
            });
            return result;
        }

        public void SeedDatabase(string connectionString)
        {
            var contextFactory = new InsightDashboardPnDbContextFactory();
            using (var context = contextFactory.CreateDbContext(new []{connectionString}))
            {
                InsightDashboardPluginSeed.SeedData(context);
            }
        }

        public void AddPluginConfig(IConfigurationBuilder builder, string connectionString)
        {
            var seedData = new InsightDashboardConfigurationSeedData();
            var contextFactory = new InsightDashboardPnDbContextFactory();
            builder.AddPluginConfiguration(
                connectionString,
                seedData,
                contextFactory);
        }

        public PluginPermissionsManager GetPermissionsManager(string connectionString)
        {
            var contextFactory = new InsightDashboardPnDbContextFactory();
            var context = contextFactory.CreateDbContext(new[] { connectionString });

            return new PluginPermissionsManager(context);
        }
    }
}