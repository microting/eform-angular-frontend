using System.Collections.Generic;
using System.Security.Claims;
using eFormAPI.Web.Infrastructure;

namespace eFormAPI.Web.Hosting.Helpers
{
    public static class ClaimsHelper
    {
        public static List<Claim> GetAllAuthClaims()
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
