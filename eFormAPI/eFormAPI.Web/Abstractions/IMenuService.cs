using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions
{
    public interface IMenuService
    {
        Task<OperationDataResult<MenuModel>> GetCurrentUserMenu();
    }
}