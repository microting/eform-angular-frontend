using Microsoft.Extensions.Configuration;

namespace eFormAPI.Web.Hosting.Settings
{
    public static class ConfigurationBuilderExtensions
    {
        public static IConfigurationBuilder AddEfConfiguration(
            this IConfigurationBuilder builder,
            string connectionString)
        {
            return builder.Add(new EfConfigurationSource(connectionString));
        }
    }
}