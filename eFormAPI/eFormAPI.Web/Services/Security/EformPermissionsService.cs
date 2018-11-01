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
            var x = await _dbContext.SecurityGroups.ToListAsync();
            return true;
        }
    }
}