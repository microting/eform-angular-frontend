using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.EformMonitoringBase.Infrastructure.Const;

namespace Monitoring.Pn.Infrastructure.Data.Seed.Data
{
    using Microting.EformMonitoringBase.Infrastructure.Const;

    public static class MonitoringPermissionsSeedData
    {
        public static PluginPermission[] Data => new[]
        {
            new PluginPermission()
            {
                PermissionName = "Access Monitoring Plugin",
                ClaimName = MonitoringClaims.AccessMonitoringPlugin
            },
            new PluginPermission()
            {
                PermissionName = "Create Notification Rules",
                ClaimName = MonitoringClaims.CreateNotificationRules
            },
            new PluginPermission()
            {
                PermissionName = "Update Notification Rules",
                ClaimName = MonitoringClaims.UpdateNotificationRules
            },
            new PluginPermission()
            {
                PermissionName = "Delete Notification Rules",
                ClaimName = MonitoringClaims.DeleteNotificationRules
            }
        };
    }
}