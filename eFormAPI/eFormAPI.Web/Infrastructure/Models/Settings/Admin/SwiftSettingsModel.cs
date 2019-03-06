namespace eFormAPI.Web.Infrastructure.Models.Settings.Admin
{
    public class SwiftSettingsModel
    {
        public bool SwiftEnabled { get; set; }
        public string SwiftUserName { get; set; }
        public string SwiftPassword { get; set; }
        public string SwiftEndpoints { get; set; }
    }
}