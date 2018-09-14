using eFormAPI.Database.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Database.Extensions
{
    public static class ModelBuilderExtensions
    {
        public static void AddIdentityRules(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EformUser>(i => { i.ToTable("Users"); });
            modelBuilder.Entity<EformRole>(i => { i.ToTable("Roles"); });
            modelBuilder.Entity<EformUserRole>(i => { i.ToTable("UserRoles"); });
            modelBuilder.Entity<IdentityUserLogin<int>>(i => { i.ToTable("UserLogins"); });
            modelBuilder.Entity<IdentityRoleClaim<int>>(i => { i.ToTable("RoleClaims"); });
            modelBuilder.Entity<IdentityUserClaim<int>>(i => { i.ToTable("UserClaims"); });
            modelBuilder.Entity<IdentityUserToken<int>>(i => { i.ToTable("UserTokens"); });


            modelBuilder.Entity<EformUserRole>(userRole =>
            {
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

                userRole.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                userRole.HasOne(ur => ur.User)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });

            
        }
    }
}