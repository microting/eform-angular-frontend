using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace Customers.Pn.Infrastructure.Data.Seed.Data
{
    public class CustomersConfigurationSeedData : IPluginConfigurationSeedData
    {
        public PluginConfigurationValue[] Data => new[]
        {
            new PluginConfigurationValue()
            {
                Name = "CustomersSettings:RelatedEntityGroupId",
                Value = ""
            },
        };
    }
}