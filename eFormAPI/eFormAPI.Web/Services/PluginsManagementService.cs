
namespace eFormAPI.Web.Services;

using Microsoft.EntityFrameworkCore;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Menu;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Permissions;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Abstractions;
using Hosting.Enums;
using Hosting.Helpers;
using Hosting.Helpers.DbOptions;
using Infrastructure.Models.Plugins;
using Infrastructure.Models.Settings.Plugins;
using PluginsManagement.MenuItemsLoader;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;
using Newtonsoft.Json;

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
                        Status = (PluginStatus)eformPlugin.Status,
                        Name = loadedPlugin.Name,
                        Version = loadedPlugin.PluginAssembly().GetName().Version.ToString(),
                        VersionAvailable = PluginHelper.GetLatestRepositoryVersion("microting", loadedPlugin.PluginId),
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

            eformPlugin.Status = (int)updateModel.Status;
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

        foreach (var menuTemplate in menuTemplates)
        {
            permissionIds.AddRange(_dbContext.MenuTemplatePermissions.Where(x => x.MenuTemplateId == menuTemplate.Id).Select(x => x.PermissionId).Distinct());
            permissionTypeIds.AddRange(_dbContext.MenuTemplatePermissions.Include(x => x.Permission).Where(x => x.MenuTemplateId == menuTemplate.Id).Select(x => x.Permission.PermissionTypeId).Distinct());

            // check menu items that has menu templates ids in order to set null foreign key
            var menuItems = await _dbContext.MenuItems
                .Where(x => x.MenuTemplateId == menuTemplate.Id)
                .ToListAsync();

            foreach (var menuItem in menuItems)
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

        var pluginMenu = plugin.GetNavigationMenu(_serviceProvider).OrderBy(x => x.Position).ToList();

        // get all menu templates from plugin
        var menuTemplatesFromPlugin = new List<PluginMenuTemplateModel>();

        foreach (var pluginMenuItem in pluginMenu)
        {
            if (pluginMenuItem.Type == MenuItemTypeEnum.Link)
            {
                menuTemplatesFromPlugin.Add(pluginMenuItem.MenuTemplate);
            }

            if (pluginMenuItem.Type == MenuItemTypeEnum.Dropdown)
            {
                foreach (var childMenuItem in pluginMenuItem.ChildItems)
                {
                    if (childMenuItem.Type == MenuItemTypeEnum.Link)
                    {
                        menuTemplatesFromPlugin.Add(childMenuItem.MenuTemplate);
                    }
                }
            }
        }

        var menuTemplatesFromDatabase = _dbContext.MenuTemplates
            .Where(x => x.EformPluginId == eformPlugin.Id)
            .ToList();

        if (menuTemplatesFromDatabase.Any())
        {
            if (menuTemplatesFromPlugin.Count() != menuTemplatesFromDatabase.Count())
            {
                foreach (var menuTemplateFromPlugin in menuTemplatesFromPlugin)
                {
                    // get all templates name that in database
                    var menuTemplatesFromDatabaseNames = menuTemplatesFromDatabase.Select(x => x.E2EId).ToList();

                    // if template from plugin is not contains in database
                    if (!menuTemplatesFromDatabaseNames.Contains(menuTemplateFromPlugin.E2EId))
                    {
                        // add to database menu templates from plugin
                        var menuTemplateToDatabase = new MenuTemplate()
                        {
                            Name = menuTemplateFromPlugin.Name,
                            E2EId = menuTemplateFromPlugin.E2EId,
                            DefaultLink = menuTemplateFromPlugin.DefaultLink,
                            EformPluginId = eformPlugin.Id
                        };

                        _dbContext.MenuTemplates.Add(menuTemplateToDatabase);
                        _dbContext.SaveChanges();

                        foreach (var translation in menuTemplateFromPlugin.Translations)
                        {
                            var menuTemplateTranslation = new MenuTemplateTranslation
                            {
                                Language = translation.Language,
                                LocaleName = translation.LocaleName,
                                Name = translation.Name,
                                MenuTemplateId = menuTemplateToDatabase.Id
                            };

                            _dbContext.MenuTemplateTranslations.Add(menuTemplateTranslation);
                            _dbContext.SaveChanges();
                        }

                        if (menuTemplateFromPlugin.Permissions.Any())
                        {
                            foreach (var itemPermission in menuTemplateFromPlugin.Permissions)
                            {
                                PermissionType newPermissionType = null;

                                var permissionType = _dbContext.PermissionTypes.FirstOrDefault(x => x.Name == itemPermission.PermissionTypeName);

                                if (permissionType == null)
                                {
                                    newPermissionType = new PermissionType
                                    {
                                        Name = itemPermission.PermissionTypeName
                                    };

                                    _dbContext.PermissionTypes.Add(newPermissionType);
                                    _dbContext.SaveChanges();
                                }

                                var permission = new Permission
                                {
                                    PermissionName = itemPermission.PermissionName,
                                    ClaimName = itemPermission.ClaimName,
                                    PermissionTypeId = newPermissionType == null
                                        ? permissionType.Id
                                        : newPermissionType.Id
                                };

                                _dbContext.Permissions.Add(permission);
                                _dbContext.SaveChanges();

                                var menuTemplatePermission = new MenuTemplatePermission
                                {
                                    MenuTemplateId = menuTemplateToDatabase.Id,
                                    PermissionId = permission.Id
                                };

                                _dbContext.MenuTemplatePermissions.Add(menuTemplatePermission);
                                _dbContext.SaveChanges();
                            }
                        }
                    }
                }
            }
        }
        else
        {
            // Load to database all navigation menu from plugin by id
            var pluginMenuItemsLoader = new PluginMenuItemsLoader(_dbContext, pluginId);

            pluginMenuItemsLoader.Load(pluginMenu);
        }

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

        var pluginMenu = plugin.GetNavigationMenu(_serviceProvider).OrderBy(x => x.Position).ToList();

        // Load to database all navigation menu from plugin by id
        var pluginMenuItemsLoader = new PluginMenuItemsLoader(_dbContext, pluginId);

        pluginMenuItemsLoader.Load(pluginMenu);

        return new OperationResult(true);
    }

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
                PluginsList = list
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