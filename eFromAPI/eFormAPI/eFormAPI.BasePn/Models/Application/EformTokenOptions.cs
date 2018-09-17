using System;

namespace eFormAPI.BasePn.Models.Application
{
    public class EformTokenOptions
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public TimeSpan Expiration { get; set; } = TimeSpan.FromMinutes(30);
        public string SigningKey { get; set; }
        public string CookieName { get; set; }
    }
}