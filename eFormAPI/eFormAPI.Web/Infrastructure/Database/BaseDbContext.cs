using eFormAPI.Web.Infrastructure.Database.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Database.Extensions;

namespace eFormAPI.Web.Infrastructure.Database
{
    public class BaseDbContext : IdentityDbContext<EformUser,
        EformRole,
        int,
        IdentityUserClaim<int>,
        EformUserRole,
        IdentityUserLogin<int>,
        IdentityRoleClaim<int>,
        IdentityUserToken<int>>
    {
        public BaseDbContext(DbContextOptions<BaseDbContext> options) : base(options)
        {
        }

        // Security
        public DbSet<SecurityGroup> SecurityGroups { get; set; }
        public DbSet<SecurityGroupUser> SecurityGroupUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Security
            modelBuilder.Entity<SecurityGroupUser>()
                .HasIndex(p => new
                {
                    p.EformUserId,
                    p.SecurityGroupId,
                }).IsUnique();

            // Identity
            modelBuilder.AddIdentityRules();
        }
    }
}