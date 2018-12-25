namespace Microting.eFormApi.BasePn.Infrastructure.Models.Settings.Initial
{
    public class InitialSettingsModel
    {
        public ConnectionStringMainModel ConnectionStringMain { get; set; }
        public ConnectionStringSDKModel ConnectionStringSdk { get; set; }
        public AdminSetupModel AdminSetupModel { get; set; }
        public GeneralAppSetupSettingsModel GeneralAppSetupSettingsModel { get; set; }
    }
}