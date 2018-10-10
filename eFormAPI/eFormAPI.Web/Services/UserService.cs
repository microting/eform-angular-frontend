using System.Security.Claims;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Infrastructure.Database;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace eFormAPI.Web.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<EformUser> _userManager;
        private readonly IHttpContextAccessor _httpAccessor;
        private readonly BaseDbContext _dbContext;   
        private readonly ILocalizationService _localizationService;


        public UserService(BaseDbContext dbContext,
            UserManager<EformUser> userManager,
            IHttpContextAccessor httpAccessor, 
            ILocalizationService localizationService)
        {
            _userManager = userManager;
            _httpAccessor = httpAccessor;
            _localizationService = localizationService;
            _dbContext = dbContext;
        }

        public async Task<EformUser> GetByIdAsync(int id)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<EformUser> GetByUsernameAsync(string username)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(x => x.UserName == username);
        }

        public int UserId
        {
            get
            {
                var value = _httpAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return value == null ? 0 : int.Parse(value);
            }
        }

        public string Role => _httpAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);

        public bool IsInRole(string role) => _httpAccessor.HttpContext.User.IsInRole(role);

        public async Task<EformUser> GetCurrentUserAsync()
        {
            return await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == UserId);
        }

        public Task AddPasswordAsync(EformUser user, string password)
        {
            return _userManager.AddPasswordAsync(user, password);
        }

        public async Task AddToRoleAsync(EformUser user, string role)
        {
            if (!await _userManager.IsInRoleAsync(user, role))
            {
                await _userManager.AddToRoleAsync(user, role);
            }
        }
    }
}