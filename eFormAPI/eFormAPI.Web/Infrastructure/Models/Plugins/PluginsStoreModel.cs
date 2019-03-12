using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Plugins
{
    public class PluginsStoreModel
    {
        public int Total { get; set; }

        public List<PluginStoreModel> PluginsList
            = new List<PluginStoreModel>();
    }
}