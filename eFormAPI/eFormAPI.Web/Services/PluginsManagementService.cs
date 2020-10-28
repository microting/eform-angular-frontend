using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Hosting.Enums;
using eFormAPI.Web.Hosting.Helpers;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Infrastructure.Const;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Database.Entities.Menu;
using eFormAPI.Web.Infrastructure.Database.Entities.Permissions;
using eFormAPI.Web.Infrastructure.Models.Plugins;
using eFormAPI.Web.Infrastructure.Models.Settings.Plugins;
using eFormAPI.Web.Services.NavigationMenu;
using eFormAPI.Web.Services.PluginsManagement;
using eFormAPI.Web.Services.PluginsManagement.MenuItemsLoader;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace eFormAPI.Web.Services
{
    public class PluginsManagementService : IPluginsManagementService
    {
        private readonly BaseDbContext _dbContext;
        private readonly ILocalizationService _localizationService;
        private readonly ILogger<PluginsManagementService> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IDbOptions<PluginStoreSettings> _options;
        private readonly IServiceProvider _serviceProvider;

        public PluginsManagementService(BaseDbContext dbContext,
            ILocalizationService localizationService,
            ILogger<PluginsManagementService> logger,
            IHttpClientFactory httpClientFactory,
            IServiceProvider serviceProvider,
        IDbOptions<PluginStoreSettings> options)
        {
            _dbContext = dbContext;
            _localizationService = localizationService;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
            _options = options;
            _serviceProvider = serviceProvider;
        }

        public async Task<OperationDataResult<InstalledPluginsModel>> GetInstalledPlugins(
            InstalledPluginsRequestModel requestModel)
        {
            try
            {
                var result = new InstalledPluginsModel();
                var eformPlugins = await _dbContext.EformPlugins.ToListAsync();
                var loadedPlugins = PluginHelper.GetAllPlugins();

                foreach (var eformPlugin in eformPlugins)
                {
                    var loadedPlugin = loadedPlugins.FirstOrDefault(x => x.PluginId == eformPlugin.PluginId);
                    if (loadedPlugin != null)
                    {
                        var pluginSettingsModel = new InstalledPluginModel()
                        {
                            Id = eformPlugin.Id,
                            PluginId = eformPlugin.PluginId,
                            Status = (PluginStatus) eformPlugin.Status,
                            Name = loadedPlugin.Name,
                            Version = loadedPlugin.PluginAssembly().GetName().Version.ToString(),
                            VersionAvailable = await PluginHelper.GetLatestRepositoryVersion("microting", loadedPlugin.PluginId),
                            BaseUrl = loadedPlugin.PluginBaseUrl
                        };
                        result.PluginsList.Add(pluginSettingsModel);
                    }
                }

                result.Total = loadedPlugins.Count;
                return new OperationDataResult<InstalledPluginsModel>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<InstalledPluginsModel>(false, 
                    _localizationService.GetString("ErrorWhileObtainingPlugins"));
            }
        }

        public async Task<OperationResult> UpdateInstalledPlugins(InstalledPluginUpdateModel updateModel)
        {
            try
            {
                var eformPlugin = await _dbContext.EformPlugins
                    .FirstOrDefaultAsync(x => x.Id == updateModel.Id
                                         && x.PluginId == updateModel.PluginId);

                if (eformPlugin == null)
                {
                    return new OperationDataResult<InstalledPluginsModel>(false, 
                        _localizationService.GetString("PluginNotFound"));
                }

                eformPlugin.Status = (int) updateModel.Status;
                _dbContext.EformPlugins.Update(eformPlugin);

                await _dbContext.SaveChangesAsync();
               
                if (updateModel.Status == PluginStatus.Enabled)
                {
                    await LoadNavigationMenuOfPlugin(updateModel.PluginId);
                }
                else
                {
                    await RemoveNavigationMenuOfPlugin(updateModel.PluginId);
                }

                Program.Restart();

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<InstalledPluginsModel>(false, 
                    _localizationService.GetString("ErrorWhileUpdatingPluginSettings"));
            }
        }

        public async Task<OperationResult> RemoveNavigationMenuOfPlugin(string pluginId)
        {
            // check exists eformPlugin
            var eformPlugin = await _dbContext.EformPlugins
                  .FirstOrDefaultAsync(x => x.PluginId == pluginId);

            if (eformPlugin == null)
            {
                return new OperationDataResult<InstalledPluginsModel>(false,
                    _localizationService.GetString("PluginNotFound"));
            }

            // get all menu templates that related with plugin id
            var menuTemplates = await _dbContext.MenuTemplates
                .Where(x => x.EformPluginId == eformPlugin.Id)
                .ToListAsync();

            // get all permission ids in order to delete all records
            var permissionIds = new List<int>();
            var permissionTypeIds = new List<int>();

            foreach(var menuTemplate in menuTemplates)
            {
                permissionIds.AddRange(_dbContext.MenuTemplatePermissions.Where(x => x.MenuTemplateId == menuTemplate.Id).Select(x => x.PermissionId).Distinct());
                permissionTypeIds.AddRange(_dbContext.MenuTemplatePermissions.Include(x => x.Permission).Where(x => x.MenuTemplateId == menuTemplate.Id).Select(x => x.Permission.PermissionTypeId).Distinct());

                // check menu items that has menu templates ids in order to set null foreign key
                var menuItems = await _dbContext.MenuItems
                    .Where(x => x.MenuTemplateId == menuTemplate.Id)
                    .ToListAsync();

                foreach(var menuItem in menuItems)
                {
                    menuItem.MenuTemplateId = null;
                }

                _dbContext.MenuItems.UpdateRange(menuItems);
            }

            _dbContext.RemoveRange(menuTemplates);
            _dbContext.SaveChanges();

            // delete all permissions connected with removed menu templates 
            foreach (var permissionId in permissionIds)
            {
                var permission = _dbContext.Permissions.Single(x => x.Id == permissionId);

                _dbContext.Permissions.Remove(permission);
                _dbContext.SaveChanges();
            }

            // delete all permission types connected with removed permissions 
            foreach (var permissionTypeId in permissionTypeIds)
            {
                var permissions = _dbContext.Permissions.Where(x => x.PermissionTypeId == permissionTypeId);

                if (!permissions.Any())
                {
                    var permissionType = _dbContext.PermissionTypes.Single(x => x.Id == permissionTypeId);
                    _dbContext.PermissionTypes.Remove(permissionType);
                    _dbContext.SaveChanges();
                }
            }

            return new OperationResult(true);
        }

        public async Task<OperationResult> LoadNavigationMenuDuringStartProgram(string pluginId)
        {
            var eformPlugin = await _dbContext.EformPlugins
                   .FirstOrDefaultAsync(x => x.PluginId == pluginId);

            if (eformPlugin == null)
            {
                return new OperationDataResult<InstalledPluginsModel>(false,
                    _localizationService.GetString("PluginNotFound"));
            }

            var plugin = Program.EnabledPlugins.FirstOrDefault(x => x.PluginId == pluginId);

            if (plugin == null)
            {
                return new OperationDataResult<InstalledPluginsModel>(false,
                _localizationService.GetString("PluginNotFound"));
            }


            //var pluginMenu = plugin.GetNavigationMenu(_serviceProvider);

            var pluginMenu = new List<PluginMenuItemModel>()
                {
                    new PluginMenuItemModel
                    {
                        Link = "items-planning-pn",
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
                                 Name = "Elementer planlægning",
                                 Language = LanguageNames.Danish,
                            }
                        },
                        ChildItems = new List<PluginMenuItemModel>()
                        {
                            new PluginMenuItemModel
                            {
                            Link = "/plugins/items-planning-pn/plannings",
                            Type = MenuItemTypeEnum.Link,
                            Position = 0,
                            MenuTemplate = new PluginMenuTemplateModel()
                        {
                            Name = "Planning",
                            E2EId = "items-planning-pn-plannings",
                            DefaultLink = "/plugins/items-planning-pn/plannings",
                            Permissions = new List<PluginPermissionModel>()
                            {
                                new PluginPermissionModel
                                {
                                    ClaimName = "itemsPlanningPluginAccess",
                                    PermissionName = "Access ItemsPlanning Plugin",
                                    PermissionTypeName = "Plannings",
                                },
                                new PluginPermissionModel
                                {
                                     ClaimName = "planningsCreate",
                                    PermissionName = "Create Notification Rules",
                                    PermissionTypeName = "Plannings",
                                },
                                new PluginPermissionModel
                                {
                                     ClaimName = "planningEdit",
                                    PermissionName = "Edit Planning",
                                    PermissionTypeName = "Plannings",
                                },
                                new PluginPermissionModel
                                {
                                    ClaimName = "planningsGet",
                                    PermissionName = "Obtain plannings",
                                    PermissionTypeName = "Plannings",
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
                                    Name = "German",
                                    Language = LanguageNames.German,
                                },
                                new PluginMenuTranslationModel
                                {
                                    LocaleName = LocaleNames.Danish,
                                    Name = "Dania",
                                    Language = LanguageNames.Danish,
                                },
                            }
                            },
                            new PluginMenuItemModel
                            {
                            Link = "/plugins/items-planning-pn/reports",
                            Type = MenuItemTypeEnum.Link,
                            Position = 1,
                            MenuTemplate = new PluginMenuTemplateModel()
                            {
                            Name = "Reports",
                            E2EId = "items-planning-pn-reports",
                            DefaultLink = "/plugins/items-planning-pn/reports",
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
                                    Name = "German",
                                    Language = LanguageNames.German,
                                },
                                new PluginMenuTranslationModel
                                {
                                    LocaleName = LocaleNames.Danish,
                                    Name = "Dania",
                                    Language = LanguageNames.Danish,
                                },
                            }
                            }
                        }
                    }
                };

            // Load to database all navigation menu from plugin by id
            var pluginMenuItemsLoader = new PluginMenuItemsLoader(_dbContext, pluginId);

            pluginMenuItemsLoader.Load(pluginMenu);

            return new OperationResult(true);
        }

        public async Task<OperationResult> LoadNavigationMenuOfPlugin(string pluginId)
        {
            var eformPlugin = await _dbContext.EformPlugins
                   .FirstOrDefaultAsync(x => x.PluginId == pluginId);

            if (eformPlugin == null)
            {
                return new OperationDataResult<InstalledPluginsModel>(false,
                    _localizationService.GetString("PluginNotFound"));
            }

            var plugin = Program.DisabledPlugins.FirstOrDefault(x => x.PluginId == pluginId);
           
            if (plugin == null)
            {
                return new OperationDataResult<InstalledPluginsModel>(false,
                _localizationService.GetString("PluginNotFound"));
            }


            //var pluginMenu = plugin.GetNavigationMenu(_serviceProvider);

            var pluginMenu = new List<PluginMenuItemModel>()
                {
                    new PluginMenuItemModel
                    {
                        Link = "items-planning-pn",
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
                                 Name = "Elementer planlægning",
                                 Language = LanguageNames.Danish,
                            }
                        },
                        ChildItems = new List<PluginMenuItemModel>()
                        {
                            new PluginMenuItemModel
                            {
                            Link = "/plugins/items-planning-pn/plannings",
                            Type = MenuItemTypeEnum.Link,
                            Position = 0,
                            MenuTemplate = new PluginMenuTemplateModel()
                        {
                            E2EId = "items-planning-pn-plannings",
                            DefaultLink = "/plugins/items-planning-pn/plannings",
                            Permissions = new List<PluginPermissionModel>()
                            {
                                new PluginPermissionModel
                                {
                                    ClaimName = "itemsPlanningPluginAccess",
                                    PermissionName = "Access ItemsPlanning Plugin",
                                    PermissionTypeName = "Plannings",
                                },
                                new PluginPermissionModel
                                {
                                     ClaimName = "planningsCreate",
                                    PermissionName = "Create Notification Rules",
                                    PermissionTypeName = "Plannings",
                                },
                                new PluginPermissionModel
                                {
                                     ClaimName = "planningEdit",
                                    PermissionName = "Edit Planning",
                                    PermissionTypeName = "Plannings",
                                },
                                new PluginPermissionModel
                                {
                                    ClaimName = "planningsGet",
                                    PermissionName = "Obtain plannings",
                                    PermissionTypeName = "Plannings",
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
                                    Name = "German",
                                    Language = LanguageNames.German,
                                },
                                new PluginMenuTranslationModel
                                {
                                    LocaleName = LocaleNames.Danish,
                                    Name = "Dania",
                                    Language = LanguageNames.Danish,
                                },
                            }
                            },
                            new PluginMenuItemModel
                            {
                            Link = "/plugins/items-planning-pn/reports",
                            Type = MenuItemTypeEnum.Link,
                            Position = 1,
                            MenuTemplate = new PluginMenuTemplateModel()
                            {
                            E2EId = "items-planning-pn-reports",
                            DefaultLink = "/plugins/items-planning-pn/reports",
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
                                    Name = "German",
                                    Language = LanguageNames.German,
                                },
                                new PluginMenuTranslationModel
                                {
                                    LocaleName = LocaleNames.Danish,
                                    Name = "Dania",
                                    Language = LanguageNames.Danish,
                                },
                            }
                            }
                        }
                    }
                };

            // Load to database all navigation menu from plugin by id
            var pluginMenuItemsLoader = new PluginMenuItemsLoader(_dbContext, pluginId);

            pluginMenuItemsLoader.Load(pluginMenu);

            return new OperationResult(true);
        }

        //private void AddToDatabase(List<PluginMenuItemModel> menuItems, int? parentId, string pluginId)
        //{
        
        //        foreach (var menuItem in menuItems)
        //        {
        //            if (menuItem.Type == MenuItemTypeEnum.Link)
        //            {
        //                var menuTemplate = new MenuTemplate()
        //                {
        //                    E2EId = menuItem.MenuTemplate.E2EId,
        //                    DefaultLink = menuItem.MenuTemplate.DefaultLink,
        //                    EformPluginId = _dbContext.EformPlugins.Single(x => x.PluginId == pluginId).Id
        //                };

        //                _dbContext.MenuTemplates.Add(menuTemplate);
        //                _dbContext.SaveChanges();

        //                foreach (var translation in menuItem.MenuTemplate.Translations)
        //                {
        //                    var menuTemplateTranslation = new MenuTemplateTranslation
        //                    {
        //                        Language = translation.Language,
        //                        LocaleName = translation.LocaleName,
        //                        Name = translation.Name,
        //                        MenuTemplateId = menuTemplate.Id,
        //                    };

        //                    _dbContext.MenuTemplateTranslations.Add(menuTemplateTranslation);
        //                    _dbContext.SaveChanges();
        //                }

        //                if (menuItem.MenuTemplate.Permissions.Any())
        //                {
        //                    foreach (var itemPermission in menuItem.MenuTemplate.Permissions)
        //                    {
        //                        var permission = new Permission
        //                        {
        //                            PermissionName = itemPermission.PermissionName,
        //                            ClaimName = itemPermission.ClaimName,
        //                            PermissionTypeId = 1,
        //                        };

        //                        _dbContext.Permissions.Add(permission);
        //                        _dbContext.SaveChanges();

        //                        var menuTemplatePermission = new MenuTemplatePermission
        //                        {
        //                            MenuTemplateId = menuTemplate.Id,
        //                            PermissionId = permission.Id,
        //                        };

        //                        _dbContext.MenuTemplatePermissions.Add(menuTemplatePermission);
        //                        _dbContext.SaveChanges();
        //                    }
        //                }

        //                var newMenuItem = new MenuItem()
        //                {
        //                    Link = menuItem.Link,
        //                    Type = menuItem.Type,
        //                    Position = menuItem.Position,
        //                    MenuTemplateId = menuTemplate.Id,
        //                    ParentId = parentId,
        //                };

        //                _dbContext.MenuItems.Add(newMenuItem);
        //                _dbContext.SaveChanges();

        //                foreach (var menuItemTranslation in menuItem.Translations)
        //                {
        //                    var translation = new MenuItemTranslation
        //                    {
        //                        Language = menuItemTranslation.Language,
        //                        LocaleName = menuItemTranslation.LocaleName,
        //                        Name = menuItemTranslation.Name,
        //                        MenuItemId = newMenuItem.Id,
        //                    };

        //                    _dbContext.MenuItemTranslations.Add(translation);
        //                    _dbContext.SaveChanges();
        //                }
        //            }
        //            else
        //            {
        //                var newMenuItem = new MenuItem()
        //                {
        //                    Link = menuItem.Link,
        //                    Type = menuItem.Type,
        //                    Position = menuItem.ChildItems.Any() ?
        //                        _dbContext.MenuItems.Where(x => x.ParentId == null).Max(x => x.Position) + menuItem.Position + 1
        //                        : menuItem.Position,
        //                    MenuTemplateId = null,
        //                    ParentId = null
        //                };

        //                _dbContext.MenuItems.Add(newMenuItem);
        //                _dbContext.SaveChanges();

        //                foreach (var menuItemTranslation in menuItem.Translations)
        //                {
        //                    var translation = new MenuItemTranslation
        //                    {
        //                        Language = menuItemTranslation.Language,
        //                        LocaleName = menuItemTranslation.LocaleName,
        //                        Name = menuItemTranslation.Name,
        //                        MenuItemId = newMenuItem.Id,
        //                    };

        //                    _dbContext.MenuItemTranslations.Add(translation);
        //                    _dbContext.SaveChanges();
        //                }

        //                if (menuItem.ChildItems.Any())
        //                {
        //                    AddToDatabase(menuItem.ChildItems, newMenuItem.Id, pluginId);
        //                }
        //            }
        //        }
        //    }
           
        public async Task<OperationDataResult<PluginsStoreModel>> GetMarketplacePlugins(MarketplacePluginsRequestModel model)
        {
            try
            {
                var url = _options.Value.PluginListLink;
                var httpClient = _httpClientFactory.CreateClient();
                var stream = httpClient.GetStreamAsync(url).Result;
                string json;
                using (var reader = new StreamReader(stream))
                {
                    json = await reader.ReadToEndAsync();
                }

                if (string.IsNullOrEmpty(json))
                {
                    throw new Exception("Error while obtaining json file");
                }

                var list = JsonConvert.DeserializeObject<List<PluginStoreModel>>(json);
                var result = new PluginsStoreModel()
                {
                    Total = list.Count,
                    PluginsList = list,
                };
                return new OperationDataResult<PluginsStoreModel>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<PluginsStoreModel>(false,
                    _localizationService.GetString("ErrorWhileObtainingPluginList"));
            }
        }

        public async Task<OperationResult> InstallMarketplacePlugin(string pluginId)
        {
            try
            {
                var pluginListResult = await GetMarketplacePlugins(new MarketplacePluginsRequestModel());
                if (!pluginListResult.Success)
                {
                    return new OperationResult(false, pluginListResult.Message);
                }

                var pluginList = pluginListResult.Model.PluginsList;
                // Find plugin info
                var plugin = pluginList.FirstOrDefault(x => x.PluginId == pluginId);
                if (plugin == null)
                {
                    return new OperationDataResult<PluginsStoreModel>(false,
                        _localizationService.GetString("PluginNotFound"));
                }
                
                var link = plugin.InstallScript;
                var httpClient = _httpClientFactory.CreateClient();
                var stream = httpClient.GetStreamAsync(link).Result;
                string scriptContent;
                using (var reader = new StreamReader(stream))
                {
                    scriptContent = await reader.ReadToEndAsync();
                }

                if (string.IsNullOrEmpty(scriptContent))
                {
                    throw new Exception("Error while obtaining install script file");
                }

                const string pluginInstallDirectory = "/var/www/microting/eform-angular-frontend/eFormAPI/eFormAPI.Web/PluginInstallDaemonQueue";
                var filePath = Path.Combine(pluginInstallDirectory, "install.sh");
                using (var file = new StreamWriter(filePath))
                {
                    file.Write(scriptContent);    
                    file.Close();
                }
                
                // Execute file
                //
              
                var result = Bash("sudo systemctl plugin-install start");
                return new OperationResult(true, result);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<PluginsStoreModel>(false,
                    _localizationService.GetString("ErrorWhileExecutingPluginInstall"));
            }
        }

        public string Bash(string cmd)
        {
            var command = cmd;
            var result = "";
            using (var proc = new Process())
            {
                proc.StartInfo.FileName = "/bin/bash";
                proc.StartInfo.Arguments = "-c \" " + command + " \"";
                proc.StartInfo.UseShellExecute = false;
                proc.StartInfo.RedirectStandardOutput = true;
                proc.StartInfo.RedirectStandardError = true;
                proc.Start();

                result += proc.StandardOutput.ReadToEnd();
                result += proc.StandardError.ReadToEnd();

                proc.WaitForExit();
            }
            return result;
        }
    }
}