using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class MenuController : Controller
    {
        private readonly IMenuService _menuService;

        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        [HttpGet]
        [Route("api/menu/current-user")]
        public Task<OperationDataResult<MenuModel>> GetCurrentUserMenu()
        {
            return _menuService.GetCurrentUserMenu();
        }
    }
}