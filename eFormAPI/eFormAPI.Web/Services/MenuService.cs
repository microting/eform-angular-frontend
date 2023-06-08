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

namespace eFormAPI.Web.Services;

using Hosting.Enums;
using NavigationMenu;
using NavigationMenu.Builder;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Consts;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;
using Abstractions;
using eFormAPI.Web.Abstractions.Security;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Menu;

public class MenuService : IMenuService
{
    private readonly ILogger<MenuService> _logger;
    private readonly IClaimsService _claimsService;
    private readonly IUserService _userService;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILocalizationService _localizationService;
    private readonly BaseDbContext _dbContext;

    public MenuService(ILogger<MenuService> logger,
        BaseDbContext dbContext,
        IClaimsService claimsService,
        IUserService userService,
        IServiceProvider serviceProvider,
        ILocalizationService localizationService)
    {
        _logger = logger;
        _dbContext = dbContext;
        _claimsService = claimsService;
        _userService = userService;
        _localizationService = localizationService;
        _serviceProvider = serviceProvider;
    }

    public async Task<OperationDataResult<NavigationMenuModel>> UpdateCurrentUserMenu(List<NavigationMenuItemModel> menuItemModels)
    {
        // Step 1. Firstly remove all menu items from database
        var actualMenu = await _dbContext.MenuItems.ToListAsync();

        _dbContext.MenuItems.RemoveRange(actualMenu);
        await _dbContext.SaveChangesAsync();

        // Step 2. Traversal collection and add to database depend on menu item type
        for (var i = 0; i < menuItemModels.Count; i++)
        {
            var menuItemBuilder = new MenuItemBuilder(_dbContext, menuItemModels[i], i);

            menuItemBuilder.Build();
        }

        return new OperationDataResult<NavigationMenuModel>(true,
            _localizationService.GetString("NavigationMenuUpdate"));
    }

    public async Task<OperationDataResult<NavigationMenuModel>> GetCurrentNavigationMenu()
    {
        try
        {
            var menuItems = await _dbContext.MenuItems
                .Include(x => x.MenuTemplate)
                .ThenInclude(x => x.EformPlugin)
                .ToListAsync();

            var userClaims = await _claimsService.GetUserClaimsNames(_userService.UserId);

            if (!_userService.IsInRole(EformRole.Admin))
            {
                menuItems = FilterMenuForUser(menuItems, userClaims);
            }

            //var user = await _userService.GetCurrentUserAsync();

            var menuTemplates = new List<NavigationMenuTemplateModel>()
            {
                new NavigationMenuTemplateModel
                {
                    Id = 1,
                    Name = "Main application",
                    Items = _dbContext.MenuTemplates
                        .Where(x => x.EformPluginId == null && !string.IsNullOrEmpty(x.DefaultLink))
                        .Select(p => new NavigationMenuTemplateItemModel
                        {
                            Id = p.Id,
                            Name = p.Name,
                            E2EId = p.E2EId,
                            Link = p.DefaultLink,
                            Translations = _dbContext.MenuTemplateTranslations
                                .Where(x => x.MenuTemplateId == p.Id)
                                .Select(e => new NavigationMenuTranslationModel
                                {
                                    Id = e.Id,
                                    Name = e.Name,
                                    LocaleName = e.LocaleName,
                                    Language = e.Language

                                })
                                .ToList(),
                            RelatedTemplateItemId = 1
                        })
                        .ToList()
                }
            };

            var enablePlugins = await _dbContext.EformPlugins
                .Where(x => x.Status == (int)PluginStatus.Enabled)
                .ToListAsync();

            if (enablePlugins.Any())
            {
                menuTemplates.AddRange(enablePlugins.Select(x => new NavigationMenuTemplateModel()
                {
                    Id = x.Id,
                    Name = Program.EnabledPlugins.Single(p => p.PluginId == x.PluginId).Name,// changed plugin
                    Items = _dbContext.MenuTemplates
                        .Where(p => p.EformPluginId == x.Id && !string.IsNullOrEmpty(p.DefaultLink))
                        .Select(p => new NavigationMenuTemplateItemModel
                        {
                            Id = p.Id,
                            Name = p.Name,
                            E2EId = p.E2EId,
                            Link = p.DefaultLink,
                            Translations = _dbContext.MenuTemplateTranslations
                                .Where(y => y.MenuTemplateId == p.Id)
                                .Select(e => new NavigationMenuTranslationModel
                                {
                                    Id = e.Id,
                                    Name = e.Name,
                                    LocaleName = e.LocaleName,
                                    Language = e.Language
                                })
                                .ToList(),
                            RelatedTemplateItemId = p.Id
                        })
                        .ToList()
                }));
            }

            var securityGroupsIds = await _dbContext.MenuItemSecurityGroups
                .ToListAsync();

            var actualMenu = menuItems
                .Where(x => x.ParentId == null)
                .OrderBy(x => x.Position)
                .Select(x => new NavigationMenuItemModel
                {
                    Id = x.Id,
                    E2EId = x.E2EId,
                    Name = x.Name,
                    Type = x.Type,
                    Link = x.Link,
                    RelatedTemplateItemId = x.MenuTemplateId,
                    ParentId = x.ParentId,
                    Position = x.Position,
                    IsInternalLink = x.IsInternalLink,
                    Translations = _dbContext.MenuItemTranslations
                        .Where(p => p.MenuItemId == x.Id)
                        .Select(p => new NavigationMenuTranslationModel
                        {
                            Id = p.Id,
                            Name = p.Name,
                            LocaleName = p.LocaleName,
                            Language = p.Language
                        })
                        .ToList(),
                    SecurityGroupsIds = securityGroupsIds
                        .Where(p => p.MenuItemId == x.Id).Select(j => j.SecurityGroupId)
                        .ToList(),
                    Children = menuItems.Where(p => p.ParentId == x.Id)
                        .OrderBy(p => p.Position)
                        .Select(p => new NavigationMenuItemModel
                        {
                            Id = p.Id,
                            E2EId = x.E2EId,
                            Name = p.Name,
                            Type = p.Type,
                            Link = p.Link,
                            RelatedTemplateItemId = p.MenuTemplateId,
                            ParentId = p.ParentId,
                            Position = p.Position,
                            Translations = _dbContext.MenuItemTranslations
                                .Where(k => k.MenuItemId == p.Id)
                                .Select(k => new NavigationMenuTranslationModel
                                {
                                    Id = k.Id,
                                    Name = k.Name,
                                    LocaleName = k.LocaleName,
                                    Language = k.Language
                                })
                                .ToList(),
                            SecurityGroupsIds = _dbContext.MenuItemSecurityGroups
                                .Where(k => k.MenuItemId == p.Id)
                                .Select(k => k.SecurityGroupId)
                                .ToList(),
                            IsInternalLink = p.IsInternalLink
                        })
                        .ToList()
                })
                .ToList();

            var result = new NavigationMenuModel()
            {
                MenuTemplates = menuTemplates,
                ActualMenu = actualMenu
            };

            return new OperationDataResult<NavigationMenuModel>(true, result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            _logger.LogError(e.Message);
            return new OperationDataResult<NavigationMenuModel>(false,
                _localizationService.GetString("ErrorWhileObtainingUserMenu"));
        }
    }

    public async Task<OperationDataResult<MenuModel>> GetCurrentUserMenu()
    {
        try
        {

            // Get all user claims and filter menu for user
            var userClaims = await _claimsService.GetUserClaimsNames(_userService.UserId);
            var menuItemsForFilter = await _dbContext.MenuItems
                .Include(x => x.MenuTemplate)
                .ThenInclude(x => x.EformPlugin)
                .ToListAsync();

            var locale = await _userService.GetCurrentUserLocale();

            var currentLocale = string.IsNullOrEmpty(locale)
                ? LocaleNames.English
                : locale;


            if (!_userService.IsInRole(EformRole.Admin))
            {
                menuItemsForFilter = FilterMenuForUser(menuItemsForFilter, userClaims);
            }

            var menuItems = menuItemsForFilter
                .Where(x => x.ParentId == null)
                .OrderBy(x => x.Position)
                .Select(x => new MenuItemModel
                {
                    Name = _dbContext.MenuItemTranslations.Any(d => d.MenuItemId == x.Id && d.LocaleName == currentLocale)
                        ? _dbContext.MenuItemTranslations.First(d => d.MenuItemId == x.Id && d.LocaleName == currentLocale).Name
                        : _dbContext.MenuItemTranslations.First(d => d.MenuItemId == x.Id && d.LocaleName == "en-US").Name,
                    LocaleName = currentLocale,
                    E2EId = x.E2EId,
                    Link = x.Link,
                    Guards =_dbContext.MenuTemplatePermissions
                        .Include(y => y.Permission)
                        .Where(d => d.MenuTemplateId == x.MenuTemplateId)
                        .Select(y => y.Permission.ClaimName)
                        .ToList(),
                    // Guards = x.Type == MenuItemTypeEnum.Link
                    //     ? _dbContext.MenuTemplatePermissions
                    //             .Include(y => y.Permission)
                    //             .Where(d => d.MenuTemplateId == x.MenuTemplateId)
                    //             .Select(y => y.Permission.ClaimName)
                    //             .ToList()
                    //     : new List<string>(),
                    Position = x.Position,
                    IsInternalLink = x.IsInternalLink,
                    MenuItems = _dbContext.MenuItems
                        .Include(p => p.MenuTemplate)
                        .Where(p => p.ParentId == x.Id)
                        .OrderBy(p => p.Position)
                        .Select(p => new MenuItemModel
                        {
                            Name = _dbContext.MenuItemTranslations.Any(d => d.MenuItemId == p.Id && d.LocaleName == currentLocale)
                                ? _dbContext.MenuItemTranslations.First(d => d.MenuItemId == p.Id && d.LocaleName == currentLocale).Name
                                : _dbContext.MenuItemTranslations.First(d => d.MenuItemId == p.Id && d.LocaleName == "en-US").Name,
                            //LocaleName = _dbContext.MenuItemTranslations.First(d => d.MenuItemId == p.Id && d.LocaleName == currentLocale).LocaleName,
                            LocaleName = currentLocale,
                            E2EId = p.E2EId,
                            Link = p.Link,
                            Guards = _dbContext.MenuTemplatePermissions
                                .Include(y => y.Permission)
                                .Where(d => d.MenuTemplateId == p.MenuTemplateId)
                                .Select(y => y.Permission.ClaimName)
                                .ToList(),
                            // Guards = p.Type == MenuItemTypeEnum.Link
                            // ? _dbContext.MenuTemplatePermissions
                            //         .Include(y => y.Permission)
                            //         .Where(d => d.MenuTemplateId == p.MenuTemplateId)
                            //         .Select(y => y.Permission.ClaimName)
                            //         .ToList()
                            // : new List<string>(),
                            Position = p.Position,
                            IsInternalLink = p.IsInternalLink
                        })
                        .ToList()
                })
                .ToList();

            var orderedRightMenu = RightMenuStorage.GetRightMenu().Select(x => new MenuItemModel
            {
                Name = x.Translations.FirstOrDefault(y => y.LocaleName == currentLocale)?.Name ?? x.Name,
                LocaleName = currentLocale,
                E2EId = x.E2EId,
                Link = x.Link,
                //Guards = x.MenuTemplate.Permissions.Select(y => y.ClaimName).ToList(),
                Guards = x.Type == MenuItemTypeEnum.Link
                    ? x.MenuTemplate.Permissions.Select(y => y.ClaimName).ToList()
                    : new List<string>(),
                Position = x.Position,
                MenuItems = x.ChildItems.Select(d => new MenuItemModel
                    {
                        Name = d.Translations.Any(y => y.LocaleName == currentLocale)
                            ? d.Translations.First(y => y.LocaleName == currentLocale).Name
                            :  d.Translations.First(y => y.LocaleName == "en-US").Name,
                        LocaleName = currentLocale,
                        E2EId = d.E2EId,
                        Link = d.Link,
                        Guards = d.MenuTemplate.Permissions.Select(y => y.ClaimName).ToList(),
                        // Guards = d.Type == MenuItemTypeEnum.Link
                        //     ? d.MenuTemplate.Permissions.Select(y => y.ClaimName).ToList()
                        //     : new List<string>(),
                        Position = d.Position,
                        IsInternalLink = true
                    })
                    .ToList(),
                IsInternalLink = true
            }).ToList();

            // Add user first and last name
            var rightMenuItem = orderedRightMenu.First(x => x.Name == "user");
            rightMenuItem.Name = await _userService.GetCurrentUserFullName();

            // Create result
            var result = new MenuModel
            {
                LeftMenu = menuItems,
                RightMenu = orderedRightMenu
            };

            // Add menu from plugins
            foreach (var pluginMenu in Program.EnabledPlugins.Select(plugin => plugin.HeaderMenu(_serviceProvider)))
            {
                //result.LeftMenu.AddRange(pluginMenu.LeftMenu);
                result.RightMenu.AddRange(pluginMenu.RightMenu);
            }

            return new OperationDataResult<MenuModel>(true, result);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            _logger.LogError(e.Message);
            return new OperationDataResult<MenuModel>(false,
                _localizationService.GetString("ErrorWhileObtainingUserMenu"));
        }
    }

    public async Task<OperationResult> ResetCurrentUserMenu()
    {
        // Step 1. Firstly remove all menu items from database
        var actualMenu = await _dbContext.MenuItems.ToListAsync();

        _dbContext.MenuItems.RemoveRange(actualMenu);
        await _dbContext.SaveChangesAsync();

        var defaultMenu = DefaultMenuStorage.GetDefaultMenu();

        _dbContext.MenuItems.AddRange(defaultMenu);
        await _dbContext.SaveChangesAsync();

        foreach (var plugin in Program.EnabledPlugins)
        {
            var pluginMenu = plugin.GetNavigationMenu(_serviceProvider);

            var currentPosition = _dbContext.MenuItems.Where(x => x.ParentId == null).Max(x => x.Position) + 1;
            foreach (var pluginMenuItem in pluginMenu)
            {
                AddToDatabase(pluginMenuItem, null, currentPosition);
                currentPosition++;
            }
        }

        return new OperationResult(true);
    }

    private void AddToDatabase(PluginMenuItemModel pluginMenuItem, int? parentId, int currentPosition)
    {
        if (pluginMenuItem.Type == MenuItemTypeEnum.Link)
        {
            var newMenuItem = new MenuItem()
            {
                E2EId = pluginMenuItem.E2EId,
                Name = pluginMenuItem.Name,
                Link = pluginMenuItem.Link,
                Type = pluginMenuItem.Type,
                Position = currentPosition,
                MenuTemplateId = _dbContext.MenuTemplates.First(x => x.E2EId == pluginMenuItem.E2EId).Id,
                ParentId = parentId
            };

            _dbContext.MenuItems.Add(newMenuItem);
            _dbContext.SaveChanges();

            foreach (var translation in pluginMenuItem.Translations.Select(menuItemTranslation => new MenuItemTranslation
                     {
                         Language = menuItemTranslation.Language,
                         LocaleName = menuItemTranslation.LocaleName,
                         Name = menuItemTranslation.Name,
                         MenuItemId = newMenuItem.Id
                     }))
            {
                _dbContext.MenuItemTranslations.Add(translation);
                _dbContext.SaveChanges();
            }
        }
        else
        {
            var newMenuItem = new MenuItem()
            {
                E2EId = pluginMenuItem.E2EId,
                Name = pluginMenuItem.Type == MenuItemTypeEnum.Dropdown ? "Dropdown" : pluginMenuItem.Name,
                Link = pluginMenuItem.Link,
                Type = pluginMenuItem.Type,
                Position = currentPosition,
                MenuTemplateId = null,
                ParentId = parentId
            };

            _dbContext.MenuItems.Add(newMenuItem);
            _dbContext.SaveChanges();

            foreach (var translation in pluginMenuItem.Translations.Select(menuItemTranslation => new MenuItemTranslation
                     {
                         Language = menuItemTranslation.Language,
                         LocaleName = menuItemTranslation.LocaleName,
                         Name = menuItemTranslation.Name,
                         MenuItemId = newMenuItem.Id
                     }))
            {
                _dbContext.MenuItemTranslations.Add(translation);
                _dbContext.SaveChanges();
            }

            if (pluginMenuItem.ChildItems.Any())
            {
                var childPosition = 0;
                foreach (var childMenuItem in pluginMenuItem.ChildItems)
                {
                    AddToDatabase(childMenuItem, newMenuItem.Id, childPosition);
                    childPosition++;
                }
            }
        }

    }

    private List<MenuItem> FilterMenuForUser(IEnumerable<MenuItem> items, ICollection<string> claims)
    {
        var newList = new List<MenuItem>();

        var currentUser = _userService.GetCurrentUserAsync().GetAwaiter().GetResult();

        foreach (var menuItem in items)
        {
            // if (menuItem.Type == MenuItemTypeEnum.Dropdown || menuItem.Type == MenuItemTypeEnum.CustomLink)
            // {
            //     var menuItemSecurityGroups = _dbContext.MenuItemSecurityGroups
            //         .Where(x => x.MenuItemId == menuItem.Id)
            //         .Select(x => x.SecurityGroupId)
            //         .ToList();
            //
            //     if (menuItemSecurityGroups.Any())
            //     {
            //         foreach (var securityGroupId in menuItemSecurityGroups)
            //         {
            //             if (_dbContext.SecurityGroupUsers.Any(x => x.SecurityGroupId == securityGroupId && x.EformUserId == currentUser.Id))
            //             {
            //                 newList.Add(menuItem);
            //                 break;
            //             }
            //         }
            //     }
            // }
            // else
            // {
            var menuItemEnglishName = menuItem.Translations
                .FirstOrDefault(x => x.LocaleName == LocaleNames.English && x.MenuItemId == menuItem.Id)?.Name;

            switch (menuItemEnglishName)
            {
                case "Device Users":
                    if (claims.Contains(AuthConsts.EformClaims.DeviceUsersClaims.Read))
                    {
                        newList.Add(menuItem);
                    }

                    break;
                case "Sites":
                    if (claims.Contains(AuthConsts.EformClaims.SitesClaims.Read))
                    {
                        newList.Add(menuItem);
                    }

                    break;
                case "Workers":
                    if (claims.Contains(AuthConsts.EformClaims.WorkersClaims.Read))
                    {
                        newList.Add(menuItem);
                    }

                    break;
                case "Units":
                    if (claims.Contains(AuthConsts.EformClaims.UnitsClaims.Read))
                    {
                        newList.Add(menuItem);
                    }

                    break;
                case "Searchable list":
                    if (claims.Contains(AuthConsts.EformClaims.EntitySearchClaims.Read))
                    {
                        newList.Add(menuItem);
                    }

                    break;
                case "Selectable list":
                    if (claims.Contains(AuthConsts.EformClaims.EntitySelectClaims.Read))
                    {
                        newList.Add(menuItem);
                    }

                    break;
                case "User Management":
                    if (claims.Contains(AuthConsts.EformClaims.UserManagementClaims.Read))
                    {
                        newList.Add(menuItem);
                    }
                    break;
                case "Plugins":
                    if (_userService.IsAdmin())
                    {
                        newList.Add(menuItem);
                    }

                    break;
                case "Folders":
                    if (claims.Contains(AuthConsts.EformClaims.SitesClaims.Read))
                    {
                        newList.Add(menuItem);
                    }
                    break;
                case "Email recipients":
                    if (claims.Contains(AuthConsts.EformClaims.EmailRecipientsClaims.Read))
                    {
                        newList.Add(menuItem);
                    }
                    break;
                case "Security":
                    break;
                case "Application settings":
                    break;
                default:
                    var menuItemSecurityGroups = _dbContext.MenuItemSecurityGroups
                        .Where(x => x.MenuItemId == menuItem.Id)
                        .Select(x => x.SecurityGroupId)
                        .ToList();

                    if (menuItemSecurityGroups.Any())
                    {
                        foreach (var securityGroupId in menuItemSecurityGroups)
                        {
                            if (_dbContext.SecurityGroupUsers.Any(x => x.SecurityGroupId == securityGroupId && x.EformUserId == currentUser.Id))
                            {
                                newList.Add(menuItem);
                                break;
                            }
                        }
                    }
                    else
                    {
                        newList.Add(menuItem);
                    }
                    //newList.Add(menuItem);
                    break;
            }
            //}
        }

        return newList;
    }
}