using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Database;

namespace eFormAPI.Web.Services.Security
{
    public class ClaimsService : IClaimsService
    {
        private readonly BaseDbContext _dbContext;

        public ClaimsService(BaseDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Claim> GetUserClaims(int userId)
        {
            try
            {
                var claims = new List<Claim>();
                var groups = _dbContext.SecurityGroupUsers
                    .Where(x => x.EformUserId == userId)
                    .Select(x => x.SecurityGroupId)
                    .ToList();
                if (groups.Any())
                {
                    var claimNames = _dbContext.GroupPermissions
                        .Where(x => groups.Contains(x.SecurityGroupId))
                        .Select(x => x.Permission.ClaimName)
                        .ToList();
                    claimNames.ForEach(claimName =>
                    {
                        claims.Add(new Claim(claimName, AuthConsts.ClaimDefaultValue));
                    });
                }

                return claims;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public List<Claim> GetAllAuthClaims()
        {
            return new List<Claim>()
            {
                // Workers
                new Claim(AuthConsts.EformClaims.WorkersClaims.Read, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.WorkersClaims.Create, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.WorkersClaims.Delete, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.WorkersClaims.Update, AuthConsts.ClaimDefaultValue),
                // Sites
                new Claim(AuthConsts.EformClaims.SitesClaims.Read, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.SitesClaims.Create, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.SitesClaims.Delete, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.SitesClaims.Update, AuthConsts.ClaimDefaultValue),
                // Entity Search
                new Claim(AuthConsts.EformClaims.EntitySearchClaims.Read, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EntitySearchClaims.Create, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EntitySearchClaims.Delete, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EntitySearchClaims.Update, AuthConsts.ClaimDefaultValue),
                // Entity Select
                new Claim(AuthConsts.EformClaims.EntitySelectClaims.Read, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EntitySelectClaims.Create, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EntitySelectClaims.Delete, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EntitySelectClaims.Update, AuthConsts.ClaimDefaultValue),
                // User Management
                new Claim(AuthConsts.EformClaims.UserManagementClaims.Read, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.UserManagementClaims.Create, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.UserManagementClaims.Delete, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.UserManagementClaims.Update, AuthConsts.ClaimDefaultValue),
                // Eform
                new Claim(AuthConsts.EformClaims.EformsClaims.Delete, AuthConsts.ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EformsClaims.Create, AuthConsts.ClaimDefaultValue)
            };
        }
    }
}