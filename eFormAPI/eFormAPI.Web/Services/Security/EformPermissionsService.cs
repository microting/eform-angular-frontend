using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace eFormAPI.Web.Services.Security
{
    public class EformPermissionsService : IEformPermissionsService
    {
        private readonly BaseDbContext _dbContext;
        private readonly IUserService _userService;

        public EformPermissionsService(BaseDbContext dbContext,
            IUserService userService)
        {
            _dbContext = dbContext;
            _userService = userService;
        }

        public async Task<bool> CheckEform(int eformId, string claimName)
        {
            if (!_userService.IsInRole(EformRole.Admin))
            {
                var result = await _dbContext
                    .EformInGroups
                    .Where(x => x.TemplateId == eformId
                                && x.SecurityGroup.SecurityGroupUsers.Any(u => u.EformUserId == _userService.UserId))
                    .Select(x => new
                    {
                        iss = x.EformPermissions.Any(y => y.Permission.ClaimName == claimName)
                    })
                    .FirstOrDefaultAsync();
                if (result != null && result.iss)
                {
                    return result.iss;
                }
            }
            return true;
        }
    }
}