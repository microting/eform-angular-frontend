using System.Data.Entity;
using eFormAPI.Web.Infrastructure.Data.Entities;
using Microsoft.AspNet.Identity.EntityFramework;
using Microting.eFormApi.BasePn.Infrastructure.Data.Entities;

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
            Database.SetInitializer<BaseDbContext>(null);
        }

        public BaseDbContext(string connectionString)
            : base(connectionString)
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;
            Database.SetInitializer<BaseDbContext>(null);
        }

        public static BaseDbContext Create()
        {
            return new BaseDbContext();
        }        
        
        // Common
        public DbSet<SavedTag> SavedTags { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<EformUser>().ToTable("Users");
            modelBuilder.Entity<EformRole>().ToTable("Roles");
            modelBuilder.Entity<EformUserRole>().ToTable("UserRoles");
            modelBuilder.Entity<EformUserClaim>().ToTable("UserClaims");
            modelBuilder.Entity<EformUserLogin>().ToTable("UserLogins");

            modelBuilder.Entity<SavedTag>()
                .HasIndex(p => new
                {
                    p.EformUserId,
                    p.TagId,
                }).IsUnique();

        }
    }
}