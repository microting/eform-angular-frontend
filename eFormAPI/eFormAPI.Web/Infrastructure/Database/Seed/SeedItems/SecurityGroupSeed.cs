using eFormAPI.Web.Infrastructure.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Web.Infrastructure.Database.Seed.SeedItems
{
    public static class SecurityGroupSeed
    {
        public static ModelBuilder AddDefaultSecurityGroups(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SecurityGroup>().HasData(
                new SecurityGroup()
                {
                    Id = AuthConsts.DbIds.SecurityGroups.EformAdmins,
                    Name = "eForm admins"
                },
                new SecurityGroup()
                {
                    Id = AuthConsts.DbIds.SecurityGroups.EformUsers,
                    Name = "eForm users"
                });
            return modelBuilder;
        }
    }
}