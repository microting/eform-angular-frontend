using eFormAPI.Web.Infrastructure.Data;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microting.eFormApi.BasePn.Infrastructure.Data.Entities;

namespace eFormAPI.Web.Infrastructure.Identity
{
    public class EformRoleManager : RoleManager<EformRole, int>
    {
        public EformRoleManager(IRoleStore<EformRole, int> roleStore)
            : base(roleStore)
        {
        }

        public static EformRoleManager Create(IdentityFactoryOptions<EformRoleManager> options, IOwinContext context)
        {
            var appRoleManager = new EformRoleManager(new RoleStore<EformRole, int, EformUserRole>(context.Get<BaseDbContext>()));

            return appRoleManager;
        }
    }
}