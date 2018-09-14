using System.Threading.Tasks;
using eFormAPI.Database.Entities;

namespace eFormAPI.Core.Abstractions
{
    public interface IUserService
    {
        int UserId { get; }
        string Role { get; }
        bool IsInRole(string role);
        Task<EformUser> GetByIdAsync(int id);
        Task<EformUser> GetByUsernameAsync(string username);
        Task<EformUser> GetCurrentUserAsync();
        Task AddPasswordAsync(EformUser user, string password);
        Task AddToRoleAsync(EformUser user, string role);
    }
}