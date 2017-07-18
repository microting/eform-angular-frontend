using Microsoft.AspNet.Identity.EntityFramework;

namespace eFormAPI.Web.Infrastructure.Data.Entities
{
    public class EformUserStore : UserStore<EformUser, EformRole, int,
        EformUserLogin, EformUserRole, EformUserClaim>
    {
        public EformUserStore(BaseDbContext context)
            : base(context)
        {
        }
    }
}