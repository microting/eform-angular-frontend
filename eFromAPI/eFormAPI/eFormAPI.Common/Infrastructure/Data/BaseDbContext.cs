using eFormAPI.Common.Infrastructure.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Common.Infrastructure.Data
{
    public class BaseDbContext : IdentityDbContext
    {
        public BaseDbContext(DbContextOptions<BaseDbContext> options) : base(options)
        {
        }

        // public BaseDbContext()
        //     : base("eFormMainConnection")
        // {
        ////   Configuration.ProxyCreationEnabled = false;
        ////     Configuration.LazyLoadingEnabled = false;
        ////     Database.SetInitializer<BaseDbContext>(null);
        // }

        // public BaseDbContext(string connectionString)
        //     : base(connectionString)
        // {
        //  //   Configuration.ProxyCreationEnabled = false;
        ////     Configuration.LazyLoadingEnabled = false;
        //  //   Database.SetInitializer<BaseDbContext>(null);
        // }

        //public static BaseDbContext Create()
        //{
        //    return new BaseDbContext(new DbC);
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
    //        modelBuilder.Entity<EformUser>().ToTable("Users");
    //        modelBuilder.Entity<EformRole>().ToTable("Roles");
            modelBuilder.Entity<EformUserRole>().ToTable("UserRoles");
            modelBuilder.Entity<EformUserClaim>().ToTable("UserClaims");
            modelBuilder.Entity<EformUserLogin>().ToTable("UserLogins");
        }
    }
}