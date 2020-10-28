/*
The MIT License (MIT)

Copyright (c) 2007 - 2020 Microting A/S

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
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using eFormAPI.Web.Services.NavigationMenu;
using System.Collections.Generic;
using eFormAPI.Web.Infrastructure.Database.Entities.Menu;
using eFormAPI.Web.Infrastructure.Const;

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

        [HttpGet]
        [Route("api/navigation-menu")]
        public async Task<OperationDataResult<NavigationMenuModel>> GetCurrentNavigationMenu()
        {
            return await _menuService.GetCurrentNavigationMenu();
        }

        [HttpPut]
        [Route("api/navigation-menu")]
        public Task<OperationDataResult<NavigationMenuModel>> UpdateCurrentUserMenu(List<NavigationMenuItemModel> menuItemModels)
        {
            //var actualMenu = new List<NavigationMenuItemModel>()
            //    {
            //        new NavigationMenuItemModel
            //        {
            //            Id = 1,
            //            Type = MenuItemTypeEnum.Dropdown,
            //            Link = "",
            //            RelatedTemplateItemId = null,
            //            ParentId = null,
            //            SecurityGroupsIds = new List<int>{2},
            //            Translations = new List<NavigationMenuTranslationModel>()
            //            {
            //                new NavigationMenuTranslationModel
            //                {
            //                    Name = "Advanced",
            //                    LocaleName = LocaleNames.English,
            //                    Language = LanguageNames.English,
            //                },
            //                new NavigationMenuTranslationModel
            //                {
            //                    Name = "German",
            //                    LocaleName = LocaleNames.German,
            //                    Language = LanguageNames.German,
            //                },
            //                new NavigationMenuTranslationModel
            //                {
            //                    Name = "Danish",
            //                    LocaleName = LocaleNames.Danish,
            //                    Language = LanguageNames.Danish,
            //                }
            //            },
            //            Children = new List<NavigationMenuItemModel>()
            //            {
            //                new NavigationMenuItemModel
            //        {
            //            Type = MenuItemTypeEnum.Link,
            //            Link = "/advanced/workers",
            //            RelatedTemplateItemId = 5,
            //             Translations = new List<NavigationMenuTranslationModel>()
            //            {
            //                new NavigationMenuTranslationModel
            //                {
            //                    Name = "Workers",
            //                    LocaleName = LocaleNames.English,
            //                    Language = LanguageNames.English,
            //                },
            //                new NavigationMenuTranslationModel
            //                {
            //                    Name = "German",
            //                    LocaleName = LocaleNames.German,
            //                    Language = LanguageNames.German,
            //                },
            //                new NavigationMenuTranslationModel
            //                {
            //                    Name = "Danish",
            //                    LocaleName = LocaleNames.Danish,
            //                    Language = LanguageNames.Danish,
            //                }
            //            },

            //        },
            //                     new NavigationMenuItemModel
            //        {
            //            Type = MenuItemTypeEnum.Link,
            //            Link = "/advanced/workers",
            //            RelatedTemplateItemId = 5,
            //             Translations = new List<NavigationMenuTranslationModel>()
            //            {
            //                new NavigationMenuTranslationModel
            //                {
            //                    Name = "Test",
            //                    LocaleName = LocaleNames.English,
            //                    Language = LanguageNames.English,
            //                },
            //                new NavigationMenuTranslationModel
            //                {
            //                    Name = "German",
            //                    LocaleName = LocaleNames.German,
            //                    Language = LanguageNames.German,
            //                },
            //                new NavigationMenuTranslationModel
            //                {
            //                    Name = "Danish",
            //                    LocaleName = LocaleNames.Danish,
            //                    Language = LanguageNames.Danish,
            //                }
            //            },

            //        },

            //                  new NavigationMenuItemModel
            //        {
            //            Type = MenuItemTypeEnum.Link,
            //            Link = "/advanced/sites",
            //            RelatedTemplateItemId = 4,
            //              Translations = new List<NavigationMenuTranslationModel>()
            //            {
            //                new NavigationMenuTranslationModel
            //                {
            //                    Name = "Sites",
            //                    LocaleName = LocaleNames.English,
            //                    Language = LanguageNames.English,
            //                },
            //                new NavigationMenuTranslationModel
            //                {
            //                    Name = "German",
            //                    LocaleName = LocaleNames.German,
            //                    Language = LanguageNames.German,
            //                },
            //                new NavigationMenuTranslationModel
            //                {
            //                    Name = "Danish",
            //                    LocaleName = LocaleNames.Danish,
            //                    Language = LanguageNames.Danish,
            //                }
            //            },
            //        }
            //    }

            //        }
            //    };

            return _menuService.UpdateCurrentUserMenu(menuItemModels);
        }
    }
}