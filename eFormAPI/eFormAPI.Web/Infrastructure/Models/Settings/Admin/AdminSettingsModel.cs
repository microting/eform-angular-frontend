namespace Microting.eFormApi.BasePn.Infrastructure.Models.Settings.Admin
{
    public class AdminSettingsModel
    {
        public HeaderSettingsModel HeaderSettingsModel { get; set; }
        public LoginPageSettingsModel LoginPageSettingsModel { get; set; }
        public SMTPSettingsModel SMTPSettingsModel { get; set; }
        public string SiteLink { get; set; }
        public string AssemblyVersion { get; set; }

        public AdminSettingsModel()
        {
            HeaderSettingsModel = new HeaderSettingsModel();
            LoginPageSettingsModel = new LoginPageSettingsModel();
            SMTPSettingsModel = new SMTPSettingsModel();
        }
    }
}