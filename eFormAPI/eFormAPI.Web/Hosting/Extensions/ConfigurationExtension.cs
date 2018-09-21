using Microsoft.Extensions.Configuration;

namespace eFormAPI.Web.Hosting.Extensions
{
    public static class ConfigurationExtension
    {
        public static string MyConnectionString(this IConfiguration configuration)
        {
            return configuration.GetConnectionString("DefaultConnection");
        }
    }
}