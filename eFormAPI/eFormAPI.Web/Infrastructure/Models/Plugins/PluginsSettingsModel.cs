using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Plugins
{
    public class PluginsSettingsModel
    {
        public int Total { get; set; }

        public List<PluginSettingsModel> SettingsList
            = new List<PluginSettingsModel>();
    }
}