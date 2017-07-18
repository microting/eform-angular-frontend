using eFormAPI.Web.Infrastructure.Data;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;

namespace eFormAPI.Web.Infrastructure.Identity
{
    public class EformRoleManager : RoleManager<IdentityRole>
    {
        public EformRoleManager(IRoleStore<IdentityRole, string> roleStore)
            : base(roleStore) {}

        public static EformRoleManager Create(IdentityFactoryOptions<EformRoleManager> options, IOwinContext context)
        {
            var appRoleManager = new EformRoleManager(new RoleStore<IdentityRole>(context.Get<BaseDbContext>()));

            return appRoleManager;
        }
    }
}