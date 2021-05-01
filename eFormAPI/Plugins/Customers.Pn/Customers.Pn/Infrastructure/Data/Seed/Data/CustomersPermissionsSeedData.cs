using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormBaseCustomerBase.Infrastructure.Const;

namespace Customers.Pn.Infrastructure.Data.Seed.Data
{
    public static class CustomersPermissionsSeedData
    {
        public static PluginPermission[] Data => new[]
        {
            new PluginPermission()
            {
                PermissionName = "Access BaseCustomer Plugin",
                ClaimName = CustomersClaims.AccessCustomersPlugin
            },
            new PluginPermission()
            {
                PermissionName = "Create Customers",
                ClaimName = CustomersClaims.CreateCustomers
            },
        };
    }
}