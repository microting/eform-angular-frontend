/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using eFormAPI.Web.Services.NavigationMenu;
using System.Collections.Generic;
using MenuModel = eFormAPI.Web.Infrastructure.Models.Menu.MenuModel;

namespace eFormAPI.Web.Controllers;

[Authorize]
public class MenuController(IMenuService menuService) : Controller
{
    [HttpGet]
    [Route("api/menu/current-user")]
    public Task<OperationDataResult<MenuModel>> GetCurrentUserMenu()
    {
        return menuService.GetCurrentUserMenu();
    }

    [HttpGet]
    [Route("api/navigation-menu")]
    public async Task<OperationDataResult<NavigationMenuModel>> GetCurrentNavigationMenu()
    {
        return await menuService.GetCurrentNavigationMenu();
    }

    [HttpPut]
    [Route("api/navigation-menu")]
    public Task<OperationDataResult<NavigationMenuModel>> UpdateCurrentUserMenu([FromBody]List<NavigationMenuItemModel> menuItemModels)
    {
        return menuService.UpdateCurrentUserMenu(menuItemModels);
    }

    [HttpPost]
    [Route("api/navigation-menu/reset")]
    public Task<OperationResult> ResetCurrentUserMenu()
    {
        return menuService.ResetCurrentUserMenu();
    }
}