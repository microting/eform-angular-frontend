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
using Appointment.Pn.Abstractions;
using Appointment.Pn.Infrastructure.Data.Seed;
using Appointment.Pn.Infrastructure.Data.Seed.Data;
using Appointment.Pn.Infrastructure.Models;
using Appointment.Pn.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microting.AppointmentBase.Infrastructure.Data;
using Microting.AppointmentBase.Infrastructure.Data.Factories;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Infrastructure.Database.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Settings;

namespace Appointment.Pn
{
    using Microting.AppointmentBase.Infrastructure.Data.Constants;
    using Microting.eFormApi.BasePn.Infrastructure.Consts;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;

    public class EformAppointmentPlugin : IEformPlugin
    {
        public string Name => "Microting Appointment Plugin";
        public string PluginId => "eform-angular-appointment-plugin";
        public string PluginPath => PluginAssembly().Location;
        public string PluginBaseUrl => "appointment-pn";

        private string _connectionString;
        private int _maxParallelism = 1;
        private int _numberOfWorkers = 1;
        
        public Assembly PluginAssembly()
        {
            return typeof(EformAppointmentPlugin).GetTypeInfo().Assembly;
        }

        public void Configure(IApplicationBuilder appBuilder)
        {
            // Do nothing
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IAppointmentLocalizationService, AppointmentLocalizationService>();
            services.AddTransient<IAppointmentPnSettingsService, AppointmentPnSettingsService>();
            services.AddTransient<IAppointmentsService, AppointmentsService>();
        }

        public void ConfigureOptionsServices(IServiceCollection services, IConfiguration configuration)
        {
            services.ConfigurePluginDbOptions<AppointmentBaseSettings>(
                configuration.GetSection("AppointmentBaseSettings"));
        }

        public void ConfigureDbContext(IServiceCollection services, string connectionString)
        {
            _connectionString = connectionString;

            services.AddDbContext<AppointmentPnDbContext>(o => o.UseMySql(connectionString,
                b => b.MigrationsAssembly(PluginAssembly().FullName)));

            AppointmentPnContextFactory contextFactory = new AppointmentPnContextFactory();
            var context = contextFactory.CreateDbContext(new[] {connectionString});
            context.Database.Migrate();

            // Seed database
            SeedDatabase(connectionString);

            string temp = context.PluginConfigurationValues
                .SingleOrDefault(x => x.Name == "AppointmentBaseSettings:MaxParallelism")?.Value;
            _maxParallelism = string.IsNullOrEmpty(temp) ? 1 : int.Parse(temp);

            temp = context.PluginConfigurationValues
                .SingleOrDefault(x => x.Name == "AppointmentBaseSettings:NumberOfWorkers")?.Value;
            _numberOfWorkers = string.IsNullOrEmpty(temp) ? 1 : int.Parse(temp);
        }

        public List<PluginMenuItemModel> GetNavigationMenu(IServiceProvider serviceProvider)
        {
            var pluginMenu = new List<PluginMenuItemModel>()
                {
                    new PluginMenuItemModel
                    {
                        Name = "Dropdown",
                        E2EId = "appointment-pn",
                        Link = "",
                        Type = MenuItemTypeEnum.Dropdown,
                        Position = 0,
                        Translations = new List<PluginMenuTranslationModel>()
                        {
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.English,
                                 Name = "Appointment",
                                 Language = LanguageNames.English,
                            },
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.German,
                                 Name = "Appointment",
                                 Language = LanguageNames.German,
                            },
                            new PluginMenuTranslationModel
                            {
                                 LocaleName = LocaleNames.Danish,
                                 Name = "Aftaler",
                                 Language = LanguageNames.Danish,
                            }
                        },
                        ChildItems = new List<PluginMenuItemModel>()
                        {
                            new PluginMenuItemModel
                            {
                                Name = "Calendar",
                                E2EId = "appointment-pn-calendar",
                                Link = "/plugins/appointment-pn/calendar",
                                Type = MenuItemTypeEnum.Link,
                                Position = 0,
                                MenuTemplate = new PluginMenuTemplateModel()
                                {
                                    Name = "Calendar",
                                    E2EId = "appointment-pn-calendar",
                                    DefaultLink = "/plugins/appointment-pn/calendar",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>(),
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Calendar",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Calendar",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Kalendar",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Calendar",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Calendar",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Kalendar",
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
                .GetService<IAppointmentLocalizationService>();

            var result = new MenuModel();
            result.LeftMenu.Add(new MenuItemModel()
            {
                Name = localizationService.GetString("Appointment"),
                E2EId = "",
                Link = "",
                Guards = new List<string>() { AppointmentClaims.AccessAppointmentPlugin },
                MenuItems = new List<MenuItemModel>()
                {
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Calendar"),
                        E2EId = "appointment-pn-calendar",
                        Link = "/plugins/appointment-pn/calendar",
                        Position = 0,
                    }
                }
            });
            return result;
        }

        public void SeedDatabase(string connectionString)
        {
            var contextFactory = new AppointmentPnContextFactory();
            using (var context = contextFactory.CreateDbContext(new []{connectionString}))
            {
                AppointmentPluginSeed.SeedData(context);
            }
        }

        public void AddPluginConfig(IConfigurationBuilder builder, string connectionString)
        {
            var seedData = new AppointmentConfigurationSeedData();
            var contextFactory = new AppointmentPnContextFactory();
            builder.AddPluginConfiguration(
                connectionString, 
                seedData, 
                contextFactory);

            // Add handlers
            //CaseUpdateDelegates.CaseUpdateDelegate += CaseUpdatePluginHandler.Handle;
        }

        public PluginPermissionsManager GetPermissionsManager(string connectionString)
        {
            var contextFactory = new AppointmentPnContextFactory();
            var context = contextFactory.CreateDbContext(new[] { connectionString });

            return new PluginPermissionsManager(context);
        }
    }
}