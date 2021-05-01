using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.WorkOrderBase.Infrastructure.Const;

namespace WorkOrders.Pn.Infrastructure.Data.Seed.Data
{
    public class WorkOrdersPermissionsSeedData
    {
        public static PluginPermission[] Data => new[]
{
            new PluginPermission()
            {
                PermissionName = "Access WorkOrder Plugin",
                ClaimName = WorkOrdersClaims.AccessWorkOrdersPlugin
            }
        };
    }
}
