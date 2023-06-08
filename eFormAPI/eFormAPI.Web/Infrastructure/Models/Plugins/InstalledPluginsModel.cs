using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Plugins;

public class InstalledPluginsModel
{
    public int Total { get; set; }

    public List<InstalledPluginModel> PluginsList
        = new List<InstalledPluginModel>();
}