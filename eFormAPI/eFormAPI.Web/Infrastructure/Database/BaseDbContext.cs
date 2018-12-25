using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Database.Seed;
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

        // Common
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<SavedTag> SavedTags { get; set; }
        public DbSet<EformConfigurationValue> ConfigurationValues { get; set; }

        // Reports
        public DbSet<EformReport> EformReports { get; set; }
        public DbSet<EformReportElement> EformReportElements { get; set; }
        
        // Security
        public DbSet<SecurityGroup> SecurityGroups { get; set; }
        public DbSet<SecurityGroupUser> SecurityGroupUsers { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<GroupPermission> GroupPermissions { get; set; }
        public DbSet<PermissionType> PermissionTypes { get; set; }
        public DbSet<EformInGroup> EformInGroups { get; set; }
        public DbSet<EformPermission> EformPermissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Reports
            modelBuilder.Entity<EformReport>()
                .HasIndex(p => p.TemplateId)
                .IsUnique();

            modelBuilder.Entity<EformReport>()
                .Property(b => b.Description)
                .HasDefaultValue("");

            modelBuilder.Entity<EformReportElement>()
                .HasIndex(p => p.ElementId);

            modelBuilder.Entity<EformReportElement>()
                .HasOne(x => x.Parent)
                .WithMany(x => x.NestedElements)
                .OnDelete(DeleteBehavior.Restrict);


            // Security
            modelBuilder.Entity<SecurityGroupUser>()
                .HasIndex(p => new
                {
                    p.EformUserId,
                    p.SecurityGroupId,
                }).IsUnique();

            modelBuilder.Entity<GroupPermission>()
                .HasIndex(p => new
                {
                    p.PermissionId,
                    p.SecurityGroupId,
                }).IsUnique();

            modelBuilder.Entity<PermissionType>()
                .HasIndex(p => p.Name)
                .IsUnique();

            modelBuilder.Entity<Permission>()
                .HasIndex(p => p.ClaimName)
                .IsUnique();

            modelBuilder.Entity<EformPermission>()
                .HasIndex(p => new
                {
                    p.PermissionId,
                    p.EformInGroupId,
                }).IsUnique();

            modelBuilder.Entity<EformInGroup>()
                .HasIndex(p => new
                {
                    p.TemplateId,
                    p.SecurityGroupId,
                }).IsUnique();

            modelBuilder.Entity<EformInGroup>()
                .HasIndex(p => p.TemplateId);

            modelBuilder.Entity<EformConfigurationValue>()
                .HasKey(value => value.Id);

            modelBuilder.Entity<EformConfigurationValue>()
                .HasIndex(value => value.Id)
                .IsUnique();

            modelBuilder.Entity<SavedTag>()
                .HasIndex(p => new
                {
                    p.EformUserId,
                    p.TagId,
                }).IsUnique();

            // Seed
            modelBuilder.SeedLatest();
            // Identity
            modelBuilder.AddIdentityRules();
        }
    }
}