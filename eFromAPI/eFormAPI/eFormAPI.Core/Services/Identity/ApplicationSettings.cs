namespace eFormAPI.Core.Services.Identity
{
    public class ApplicationSettings
    {
        public string DefaultLocale { get; set; }
        public string SiteLink { get; set; }
        public string SecurityCode { get; set; }
        public string DefaultPassword { get; set; }
        public bool IsTwoFactorForced { get; set; }
    }

    public class EmailSettings
    {
        public string SmtpHost { get; set; }
        public int SmtpPort { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
    }

    public class LoginPageSettings
    {
        public string MainText { get; set; }
        public bool MainTextVisible { get; set; }
        public string SecondaryText { get; set; }
        public bool SecondaryTextVisible { get; set; }
        public string ImageLink { get; set; }
        public bool ImageLinkVisible { get; set; }
    }

    public class HeaderSettings
    {
        public string MainText { get; set; }
        public bool MainTextVisible { get; set; }
        public string SecondaryText { get; set; }
        public bool SecondaryTextVisible { get; set; }
        public string ImageLink { get; set; }
        public bool ImageLinkVisible { get; set; }
    }

    public class ConnectionStrings
    {
        public string DefaultConnection { get; set; }
        public string SdkConnection { get; set; }
    }
}