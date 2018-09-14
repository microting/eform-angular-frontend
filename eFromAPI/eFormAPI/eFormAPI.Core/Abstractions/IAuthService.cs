using System.Threading.Tasks;
using eFormAPI.Common.Infrastructure.Models.API;

namespace eFormAPI.Core.Abstractions
{
    public interface IAuthService
    {
        Task<OperationResult> LogOut();
    }
}