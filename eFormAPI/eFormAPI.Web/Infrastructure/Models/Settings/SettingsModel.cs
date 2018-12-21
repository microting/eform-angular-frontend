namespace eFormAPI.Web.Infrastructure.Models.Settings
{
    public class SettingsModel
    {
        public ConnectionStringMainModel ConnectionStringMain { get; set; }
        public ConnectionStringSdkModel ConnectionStringSdk { get; set; }
        public AdminSetupModel AdminSetupModel { get; set; }
    }
}