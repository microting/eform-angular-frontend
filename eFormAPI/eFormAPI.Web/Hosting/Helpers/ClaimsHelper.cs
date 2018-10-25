using System.Collections.Generic;
using System.Security.Claims;
using eFormAPI.Web.Infrastructure;

namespace eFormAPI.Web.Hosting.Helpers
{
    public static class ClaimsHelper
    {
        public const string ClaimDefaultValue = "1";

        public static List<Claim> GetAllAuthClaims()
        {
            return new List<Claim>()
            {
                // Workers
                new Claim(AuthConsts.EformClaims.WorkersClaims.Read, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.WorkersClaims.Create, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.WorkersClaims.Delete, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.WorkersClaims.Update, ClaimDefaultValue),
                // Sites
                new Claim(AuthConsts.EformClaims.SitesClaims.Read, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.SitesClaims.Create, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.SitesClaims.Delete, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.SitesClaims.Update, ClaimDefaultValue),
                // Entity Search
                new Claim(AuthConsts.EformClaims.EntitySearchClaims.Read, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EntitySearchClaims.Create, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EntitySearchClaims.Delete, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EntitySearchClaims.Update, ClaimDefaultValue),
                // Entity Select
                new Claim(AuthConsts.EformClaims.EntitySelectClaims.Read, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EntitySelectClaims.Create, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EntitySelectClaims.Delete, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EntitySelectClaims.Update, ClaimDefaultValue),
                // User Management
                new Claim(AuthConsts.EformClaims.UserManagementClaims.Read, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.UserManagementClaims.Create, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.UserManagementClaims.Delete, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.UserManagementClaims.Update, ClaimDefaultValue),
                // Eform
                new Claim(AuthConsts.EformClaims.EformsClaims.Delete, ClaimDefaultValue),
                new Claim(AuthConsts.EformClaims.EformsClaims.Create, ClaimDefaultValue)
            };
        }
    }
}
