using System.Collections.Generic;
using System.Security.Claims;

namespace eFormAPI.Web.Abstractions.Security
{
    public interface IClaimsService
    {
        List<Claim> GetAllAuthClaims();
        List<Claim> GetUserClaims(int userId);
    }
}