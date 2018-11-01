using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Web.Services.Security
{
    public class EformPermissionsService : IEformPermissionsService
    {
        private readonly BaseDbContext _dbContext;

        public EformPermissionsService(BaseDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> CheckEform(int eformId, string claimName)
        {
            var result = await _dbContext.EformPermissions
                .Where(x => x.EformInGroup.TemplateId == eformId)
                .Where(x => x.Permission.ClaimName == claimName)
                .AnyAsync();
            return result;
        }
    }
}