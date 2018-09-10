//using eFormAPI.Common.Infrastructure.Data;
//using eFormAPI.Common.Infrastructure.Data.Entities;

//namespace eFormAPI.Web.Infrastructure.Identity
//{
//    public class EformRoleManager : RoleManager<EformRole, int>
//    {
//        public EformRoleManager(IRoleStore<EformRole, int> roleStore)
//            : base(roleStore)
//        {
//        }

//        public static EformRoleManager Create(IdentityFactoryOptions<EformRoleManager> options, IOwinContext context)
//        {
//            var appRoleManager = new EformRoleManager(new EformRoleStore(context.Get<BaseDbContext>()));

//            return appRoleManager;
//        }
//    }
//}