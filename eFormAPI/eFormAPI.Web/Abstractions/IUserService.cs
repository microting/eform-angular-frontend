using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace eFormAPI.Web.Abstractions
{
    public interface IUserService
    {
        int UserId { get; }
        string Role { get; }
        bool IsInRole(string role);
        bool IsAdmin();
        Task<EformUser> GetByIdAsync(int id);
        Task<EformUser> GetByUsernameAsync(string username);
        Task<EformUser> GetCurrentUserAsync();
        Task AddPasswordAsync(EformUser user, string password);
        Task AddToRoleAsync(EformUser user, string role);
    }
}