using eFormAPI.Web.Hosting.Enums;

namespace eFormAPI.Web.Infrastructure.Models.Plugins
{
    public class PluginSettingsModel
    {
        public int Id { get; set; }
        public string PluginId { get; set; }
        public string Name { get; set; }
        public string Version { get; set; }
        public PluginStatus Status { get; set; }
        public string ConnectionString { get; set; }
    }
}