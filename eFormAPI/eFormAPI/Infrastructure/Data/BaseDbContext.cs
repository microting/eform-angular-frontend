using System.Data.Entity;
using eFormAPI.Web.Infrastructure.Data.Entities;
using Microsoft.AspNet.Identity.EntityFramework;

namespace eFormAPI.Web.Infrastructure.Data
{
    public class BaseDbContext : IdentityDbContext<EformUser, EformRole,
        int, EformUserLogin, EformUserRole, EformUserClaim>
    {
        public BaseDbContext()
            : base("eFormMainConnection")
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;
        }

        public static BaseDbContext Create()
        {
            return new BaseDbContext();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<EformUser>().ToTable("Users");
            modelBuilder.Entity<EformRole>().ToTable("Roles");
            modelBuilder.Entity<EformUserRole>().ToTable("UserRoles");
            modelBuilder.Entity<EformUserClaim>().ToTable("UserClaims");
            modelBuilder.Entity<EformUserLogin>().ToTable("UserLogins");
        }
    }
}