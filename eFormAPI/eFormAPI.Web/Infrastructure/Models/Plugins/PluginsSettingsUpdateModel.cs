using eFormAPI.Web.Hosting.Enums;

namespace eFormAPI.Web.Infrastructure.Models.Plugins
{
    public class PluginsSettingsUpdateModel
    {
        public int Id { get; set; }
        public string PluginId { get; set; }
        public PluginStatus Status { get; set; }
        public string ConnectionString { get; set; }
    }
}