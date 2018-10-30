using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.Menu;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
    public interface IMenuService
    {
        Task<OperationDataResult<MenuModel>> GetCurrentUserMenu();
    }
}