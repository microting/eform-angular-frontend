using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Customers.Pn.Abstractions;
using Customers.Pn.Infrastructure.Data.Seed;
using Customers.Pn.Infrastructure.Data.Seed.Data;
using Customers.Pn.Infrastructure.Extensions;
using Customers.Pn.Infrastructure.Models.Settings;
using Customers.Pn.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Models;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Consts;
using Microting.eFormApi.BasePn.Infrastructure.Database.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;
using Microting.eFormApi.BasePn.Infrastructure.Settings;
using Microting.eFormBaseCustomerBase.Infrastructure.Const;
using Microting.eFormBaseCustomerBase.Infrastructure.Data;
using Microting.eFormBaseCustomerBase.Infrastructure.Data.Entities;
using Microting.eFormBaseCustomerBase.Infrastructure.Data.Factories;
using Field = Microting.eFormBaseCustomerBase.Infrastructure.Data.Entities.Field;

namespace Customers.Pn
{
    public class EformCustomersPlugin : IEformPlugin
    {
        public string Name => "Microting Customers Plugin";
        public string PluginId => "eform-angular-basecustomer-plugin";
        public string PluginPath => PluginAssembly().Location;
        public string PluginBaseUrl => "customers-pn";

        public Assembly PluginAssembly()
        {
            return typeof(EformCustomersPlugin).GetTypeInfo().Assembly;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<ICustomersLocalizationService, CustomersLocalizationService>();
            services.AddTransient<IFieldsService, FieldsService>();
            services.AddTransient<ICustomersService, CustomersService>();
            services.AddTransient<ICustomersSettingsService, CustomersSettingsService>();

            SeedCustomersEntityGroup(services);
        }

        public void ConfigureOptionsServices(
            IServiceCollection services,
            IConfiguration configuration)
        {
            services.ConfigurePluginDbOptions<CustomersSettings>(configuration.GetSection("CustomersSettings"));
        }

        public void ConfigureDbContext(IServiceCollection services, string connectionString)
        {
            services.AddDbContext<CustomersPnDbAnySql>(o => o.UseMySql(connectionString,
                b => b.MigrationsAssembly(PluginAssembly().FullName)));

            CustomersPnContextFactory contextFactory = new CustomersPnContextFactory();
            using (CustomersPnDbAnySql context = contextFactory.CreateDbContext(new[] {connectionString}))
            {
                context.Database.Migrate();
            }

            // Seed database
            SeedDatabase(connectionString);
        }

        public void Configure(IApplicationBuilder appBuilder)
        {
        }

        public List<PluginMenuItemModel> GetNavigationMenu(IServiceProvider serviceProvider)
        {
            var pluginMenu = new List<PluginMenuItemModel>()
                {
                    new PluginMenuItemModel
                            {
                                Name = "Customers",
                                E2EId = "customers-pn",
                                Link = "/plugins/customers-pn",
                                Type = MenuItemTypeEnum.Link,
                                Position = 0,
                                MenuTemplate = new PluginMenuTemplateModel()
                                {
                                    Name = "Customers",
                                    E2EId = "customers-pn",
                                    DefaultLink = "/plugins/customers-pn",
                                    Permissions = new List<PluginMenuTemplatePermissionModel>()
                                    {
                                        new PluginMenuTemplatePermissionModel
                                        {
                                            ClaimName = CustomersClaims.AccessCustomersPlugin,
                                            PermissionName = "Obtain customers",
                                            PermissionTypeName = "Customers",
                                        },
                                    },
                                    Translations = new List<PluginMenuTranslationModel>
                                    {
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.English,
                                            Name = "Customers",
                                            Language = LanguageNames.English,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.German,
                                            Name = "Customers",
                                            Language = LanguageNames.German,
                                        },
                                        new PluginMenuTranslationModel
                                        {
                                            LocaleName = LocaleNames.Danish,
                                            Name = "Kunder",
                                            Language = LanguageNames.Danish,
                                        },
                                    }
                                },
                                Translations = new List<PluginMenuTranslationModel>
                                {
                                    new PluginMenuTranslationModel
                                {
                                    LocaleName = LocaleNames.English,
                                    Name = "Customers",
                                    Language = LanguageNames.English,
                                },
                                    new PluginMenuTranslationModel
                                {
                                    LocaleName = LocaleNames.German,
                                    Name = "Customers",
                                    Language = LanguageNames.German,
                                },
                                    new PluginMenuTranslationModel
                                {
                                    LocaleName = LocaleNames.Danish,
                                    Name = "Kunder",
                                    Language = LanguageNames.Danish,
                                },
                                }
                            },
                };

            return pluginMenu;
        }

        public MenuModel HeaderMenu(IServiceProvider serviceProvider)
        {
            var localizationService = serviceProvider
                .GetService<ICustomersLocalizationService>();

            var result = new MenuModel();
            result.LeftMenu.Add(new MenuItemModel()
            {
                Name = localizationService.GetString("Customers"),
                E2EId = "customers-pn",
                Link = "/plugins/customers-pn",
                Guards = new List<string>() { CustomersClaims.AccessCustomersPlugin }
            });
            return result;
        }

        public void SeedDatabase(string connectionString)
        {
            // Get DbContext
            CustomersPnContextFactory contextFactory = new CustomersPnContextFactory();
            using (CustomersPnDbAnySql context = contextFactory.CreateDbContext(new[] {connectionString}))
            {
                // Add data
                List<string>
                    customerFields =
                        new Customer().GetPropList(); //Find all attributes for cusomers and puts them in a list
                customerFields.Remove(nameof(Customer
                    .RelatedEntityId)); // removes the related entity, because it's not relevant for fields
                foreach (string name in customerFields)
                {
                    if (!context.Fields.Any(x => x.Name == name))
                    {
                        Field newField = new Field
                        {
                            Name = name
                        };
                        newField.Create(context);
                    }
                }

                context.SaveChanges();
                var nameOf = nameof(Customer.RelatedEntityId);
                Field fieldForRemove = context.Fields.FirstOrDefault(x => x.Name == nameOf);
                if (fieldForRemove != null)
                {
                    context.Fields.Remove(fieldForRemove);
                    context.SaveChanges();
                }

                List<Field> fields = context.Fields.OrderBy(x => x.Id).ToList();
                int i = 1;
                foreach (Field field in fields)
                {
                    CustomerField customerField = new CustomerField
                    {
                        FieldId = field.Id,
                        FieldStatus = 1,
                        DisplayIndex = field.Name == "Id" ? 0 : i
                    };
                    if (!context.CustomerFields.Any(x => x.FieldId == field.Id))
                    {
                        context.CustomerFields.Add(customerField);
                    }

                    i += 1;
                }

                context.SaveChanges();

                // Seed configuration
                CustomersPluginSeed.SeedData(context);
            }
        }

        public void AddPluginConfig(
            IConfigurationBuilder builder,
            string connectionString)
        {
            var seedData = new CustomersConfigurationSeedData();
            var contextFactory = new CustomersPnContextFactory();
            builder.AddPluginConfiguration(
                connectionString,
                seedData,
                contextFactory);
        }

        public PluginPermissionsManager GetPermissionsManager(string connectionString)
        {
            var contextFactory = new CustomersPnContextFactory();
            var context = contextFactory.CreateDbContext(new[] { connectionString });

            return new PluginPermissionsManager(context);
        }

        private async void SeedCustomersEntityGroup(IServiceCollection serviceCollection)
        {
            var serviceProvider = serviceCollection.BuildServiceProvider();
            var pluginDbOptions = serviceProvider.GetRequiredService<IPluginDbOptions<CustomersSettings>>();

            if (pluginDbOptions.Value.RelatedEntityGroupId == null)
            {
                var core = await serviceProvider.GetRequiredService<IEFormCoreService>().GetCore();
                var context = serviceProvider.GetRequiredService<CustomersPnDbAnySql>();


                EntityGroupList model = await core.Advanced_EntityGroupAll(
                    "id",
                    "eform-angular-basecustomer-plugin-Customers-hidden",
                    0, 1, Constants.FieldTypes.EntitySearch,
                    false,
                    Constants.WorkflowStates.NotRemoved);

                EntityGroup group;

                if (!model.EntityGroups.Any())
                {
                    group = await core.EntityGroupCreate(Constants.FieldTypes.EntitySearch,
                        "eform-angular-basecustomer-plugin-Customers-hidden", "");
                }
                else
                {
                    group = model.EntityGroups.First();
                }

                await pluginDbOptions.UpdateDb(
                    settings => settings.RelatedEntityGroupId = int.Parse(group.MicrotingUUID),
                    context,
                    1);
            }
        }
    }
}