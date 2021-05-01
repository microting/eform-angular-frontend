using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace WorkOrders.Pn.Infrastructure.Data.Seed.Data
{
    using Consts;

    public class WorkOrdersConfigurationSeedData : IPluginConfigurationSeedData
    {
        public PluginConfigurationValue[] Data => new[]
        {
            new PluginConfigurationValue()
            {
                Name = "WorkOrdersBaseSettings:NewTaskId",
                Value = "0",
            },
            new PluginConfigurationValue()
            {
                Name = "WorkOrdersBaseSettings:TaskListId",
                Value = "0",
            },
            new PluginConfigurationValue()
            {
                Name = "WorkOrdersBaseSettings:MaxParallelism",
                Value = "1"
            },
            new PluginConfigurationValue()
            {
                Name = "WorkOrdersBaseSettings:NumberOfWorkers",
                Value = "1"
            },
            new PluginConfigurationValue()
            {
                Name = "WorkOrdersBaseSettings:FolderId",
                Value = "0"
            },
            new PluginConfigurationValue()
            {
                Name = "WorkOrdersBaseSettings:FolderTasksId",
                Value = "0"
            },
        };
    }
}
