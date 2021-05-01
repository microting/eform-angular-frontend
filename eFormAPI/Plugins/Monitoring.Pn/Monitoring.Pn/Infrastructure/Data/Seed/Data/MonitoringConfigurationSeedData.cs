using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace Monitoring.Pn.Infrastructure.Data.Seed.Data
{
    public class MonitoringConfigurationSeedData : IPluginConfigurationSeedData
    {
        public PluginConfigurationValue[] Data => new[]
        {
            new PluginConfigurationValue()
            {
                Name = "MonitoringBaseSettings:LogLevel",
                Value = "4"
            },
            new PluginConfigurationValue()
            {
                Name = "MonitoringBaseSettings:LogLimit",
                Value = "25000"
            },
            new PluginConfigurationValue()
            {
                Name = "MonitoringBaseSettings:SdkConnectionString",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "MonitoringBaseSettings:SendGridApiKey",
                Value = ""
            },
            new PluginConfigurationValue()
            {
                Name = "MonitoringBaseSettings:FromEmailAddress",
                Value = ""
            },
            new PluginConfigurationValue()
            {
                Name = "MonitoringBaseSettings:FromEmailName",
                Value = ""
            },
        };
    }
}