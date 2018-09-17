namespace eFormAPI.BasePn.Models.Application
{
    public class ApplicationSettings
    {
        public string DefaultLocale { get; set; }
        public string SiteLink { get; set; }
        public string SecurityCode { get; set; }
        public string DefaultPassword { get; set; }
        public bool IsTwoFactorForced { get; set; }
    }
}