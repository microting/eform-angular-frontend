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
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Models.Plugins;
using eFormAPI.Web.Infrastructure.Models.Settings.Plugins;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Newtonsoft.Json;

namespace eFormAPI.Web.Services
{
    public class PluginsManagementService : IPluginsManagementService
    {
        private readonly BaseDbContext _dbContext;
        private readonly ILocalizationService _localizationService;
        private readonly ILogger<PluginsManagementService> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IDbOptions<PluginStoreSettings> _options;

        public PluginsManagementService(BaseDbContext dbContext,
            ILocalizationService localizationService,
            ILogger<PluginsManagementService> logger,
            IHttpClientFactory httpClientFactory,
            IDbOptions<PluginStoreSettings> options)
        {
            _dbContext = dbContext;
            _localizationService = localizationService;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
            _options = options;
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
                            ConnectionString = eformPlugin.ConnectionString,
                            Status = (PluginStatus) eformPlugin.Status,
                            Name = loadedPlugin.Name,
                            Version = loadedPlugin.PluginAssembly().GetName().Version.ToString(),
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

                eformPlugin.ConnectionString = updateModel.ConnectionString;
                eformPlugin.Status = (int) updateModel.Status;
                _dbContext.EformPlugins.Update(eformPlugin);
                await _dbContext.SaveChangesAsync();
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

                const string pluginInstallDirectory = "/tmp";
                var filePath = Path.Combine(pluginInstallDirectory, "install.sh");
                using (var file = new StreamWriter(filePath))
                {
                    file.Write(scriptContent);    
                    file.Close();
                }
                
                // Execute file
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