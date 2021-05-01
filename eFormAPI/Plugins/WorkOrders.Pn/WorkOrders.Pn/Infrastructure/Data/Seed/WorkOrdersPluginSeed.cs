namespace WorkOrders.Pn.Infrastructure.Data.Seed
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Data;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
    using Microting.WorkOrderBase.Infrastructure.Data;

    public class WorkOrdersPluginSeed
    {
        public static void SeedData(WorkOrderPnDbContext dbContext)
        {
            WorkOrdersConfigurationSeedData seedData = new WorkOrdersConfigurationSeedData();
            PluginConfigurationValue[] configurationList = seedData.Data;
            foreach (PluginConfigurationValue configurationItem in configurationList)
            {
                if (!dbContext.PluginConfigurationValues.Any(x => x.Name == configurationItem.Name))
                {
                    PluginConfigurationValue newConfigValue = new PluginConfigurationValue()
                    {
                        Name = configurationItem.Name,
                        Value = configurationItem.Value,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        Version = 1,
                        WorkflowState = Constants.WorkflowStates.Created,
                        CreatedByUserId = 1
                    };
                    dbContext.PluginConfigurationValues.Add(newConfigValue);
                    dbContext.SaveChanges();
                }
            }

            // Seed plugin permissions
            IEnumerable<PluginPermission> newPermissions = WorkOrdersPermissionsSeedData.Data
                .Where(p => dbContext.PluginPermissions.All(x => x.ClaimName != p.ClaimName))
                .Select(p => new PluginPermission
                {
                    PermissionName = p.PermissionName,
                    ClaimName = p.ClaimName,
                    CreatedAt = DateTime.UtcNow,
                    Version = 1,
                    WorkflowState = Constants.WorkflowStates.Created,
                    CreatedByUserId = 1
                });
            dbContext.PluginPermissions.AddRange(newPermissions);

            dbContext.SaveChanges();
        }
    }
}
