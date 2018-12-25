using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace eFormAPI.Web.Hosting.Settings
{
    public static class ConfigurationBuilderExtensions
    {
        public static IConfigurationBuilder AddEfConfiguration(
            this IConfigurationBuilder builder,
            Action<DbContextOptionsBuilder> optionsAction)
        {
            return builder.Add(new EfConfigurationSource(optionsAction));
        }
    }
}