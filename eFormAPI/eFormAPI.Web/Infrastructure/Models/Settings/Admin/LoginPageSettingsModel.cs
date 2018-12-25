namespace Microting.eFormApi.BasePn.Infrastructure.Models.Settings.Admin
{
    public class LoginPageSettingsModel
    {
        public string MainText { get; set; }
        public bool MainTextVisible { get; set; }
        public string SecondaryText { get; set; }
        public bool SecondaryTextVisible { get; set; }
        public string ImageLink { get; set; }
        public bool ImageLinkVisible { get; set; }
        public bool IsSMTPExists { get; set; }
    }
}