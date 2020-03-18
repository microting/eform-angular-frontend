/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Database.Seed;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Database.Extensions;

namespace eFormAPI.Web.Infrastructure.Database
{
    using Entities.Mailing;
    using Entities.Permissions;
    using Entities.Reports;

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
        public DbSet<EformPlugin> EformPlugins { get; set; }
        
        // Reports
        public DbSet<EformReport> EformReports { get; set; }
        public DbSet<EformReportElement> EformReportElements { get; set; }
        public DbSet<EformReportDataItem> EformReportDataItems { get; set; }

        // Security
        public DbSet<SecurityGroup> SecurityGroups { get; set; }
        public DbSet<SecurityGroupUser> SecurityGroupUsers { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<GroupPermission> GroupPermissions { get; set; }
        public DbSet<PermissionType> PermissionTypes { get; set; }
        public DbSet<EformInGroup> EformInGroups { get; set; }
        public DbSet<EformPermission> EformPermissions { get; set; }

        // Mailing
        public DbSet<CasePostEmailRecipient> CasePostEmailRecipients { get; set; }
        public DbSet<CasePostEmailTag> CasePostEmailTags { get; set; }
        public DbSet<CasePost> CasePosts { get; set; }
        public DbSet<EmailTagRecipient> EmailTagRecipients { get; set; }
        public DbSet<EmailRecipient> EmailRecipients { get; set; }
        public DbSet<EmailTag> EmailTags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<EformPlugin>()
                .HasIndex(p => p.PluginId)
                .IsUnique();

            // Reports
            modelBuilder.Entity<EformReport>()
                .HasIndex(p => p.TemplateId)
                .IsUnique();

            modelBuilder.Entity<EformReportElement>()
                .HasIndex(p => p.ElementId);

            modelBuilder.Entity<EformReportElement>()
                .HasMany(e => e.NestedElements)
                .WithOne(e => e.Parent)
                .HasForeignKey(e => e.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<EformReportDataItem>()
                .HasIndex(p => p.DataItemId);

            modelBuilder.Entity<EformReportDataItem>()
                .HasMany(e => e.NestedDataItems)
                .WithOne(e => e.Parent)
                .HasForeignKey(e => e.ParentId)
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

            // Mailing
            modelBuilder.Entity<EmailTag>()
                .HasIndex(i => i.Name);

            modelBuilder.Entity<EmailRecipient>()
                .HasIndex(i => i.Name);

            modelBuilder.Entity<EmailRecipient>()
                .HasIndex(i => i.Email);

            modelBuilder.Entity<CasePost>()
                .HasIndex(i => i.CaseId);

            // Seed
            modelBuilder.SeedLatest();
            // Identity
            modelBuilder.AddIdentityRules();
        }
    }
}