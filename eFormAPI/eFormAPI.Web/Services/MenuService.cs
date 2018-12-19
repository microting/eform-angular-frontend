using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn;

namespace eFormAPI.Web.Services
{
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

        public async Task<OperationDataResult<MenuModel>> GetCurrentUserMenu()
        {
            try
            {
                List<MenuItem> menuItems = await _dbContext.MenuItems.ToListAsync();
                List<string> userClaims = _claimsService.GetUserClaimsNames(_userService.UserId);
                if (!_userService.IsInRole(EformRole.Admin))
                {
                    menuItems = FilterMenuForUser(menuItems, userClaims);
                }

                // Add user first and last name
                foreach (MenuItem menuItem in menuItems)
                {
                    if (menuItem.Name == "user")
                    {
                        EformUser user = await _userService.GetCurrentUserAsync();
                        menuItem.Name = $"{user.FirstName} {user.LastName}";
                    }
                }

                List<MenuItemModel> orderedLeft = menuItems
                    .Where(p => p.Parent == null && p.MenuPosition == 1)
                    .OrderBy(p => p.Position)
                    .Select(p => new MenuItemModel()
                        {
                            Name = _localizationService.GetString(p.LocaleName, p.Name),
                            Position = p.Position,
                            E2EId = p.E2EId,
                            Link = p.Link,
                            MenuItems = menuItems
                                .Where(c => c.ParentId == p.Id && p.MenuPosition == 1)
                                .OrderBy(c => c.Position)
                                .Select(x => new MenuItemModel()
                                {
                                    Name = _localizationService.GetString(x.LocaleName, x.Name),
                                    Position = x.Position,
                                    Link = x.Link,
                                    E2EId = x.E2EId
                                }).ToList()
                        }
                    ).ToList();

                List<MenuItemModel> orderedRight = menuItems
                    .Where(p => p.Parent == null && p.MenuPosition == 2)
                    .OrderBy(p => p.Position)
                    .Select(p => new MenuItemModel()
                        {
                            Name = _localizationService.GetString(p.LocaleName, p.Name),
                            Position = p.Position,
                            E2EId = p.E2EId,
                            Link = p.Link,
                            MenuItems = menuItems
                                .Where(c => c.ParentId == p.Id && p.MenuPosition == 2)
                                .OrderBy(c => c.Position)
                                .Select(x => new MenuItemModel()
                                {
                                    Name = _localizationService.GetString(x.LocaleName, x.Name),
                                    Position = x.Position,
                                    Link = x.Link,
                                    E2EId = x.E2EId
                                }).ToList()
                        }
                    ).ToList();
                // Create result
                MenuModel result = new MenuModel();
                orderedRight.ForEach(menuItem =>
                {
                    if (menuItem.MenuItems.Any())
                    {
                        result.RightMenu.Add(menuItem);
                    }
                    else if (!string.IsNullOrEmpty(menuItem.Link))
                    {
                        result.RightMenu.Add(menuItem);
                    }
                });
                orderedLeft.ForEach(menuItem =>
                {
                    if (menuItem.MenuItems.Any())
                    {
                        result.LeftMenu.Add(menuItem);
                    }
                    else if (!string.IsNullOrEmpty(menuItem.Link))
                    {
                        result.LeftMenu.Add(menuItem);
                    }
                });
                // Add menu from plugins
                if (Startup.Plugins.Any())
                {
                    foreach (IEformPlugin plugin in Startup.Plugins)
                    {
                        MenuModel pluginMenu = plugin.HeaderMenu(_serviceProvider);
                        result.LeftMenu.AddRange(pluginMenu.LeftMenu);
                        result.RightMenu.AddRange(pluginMenu.RightMenu);
                    }
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

        private List<MenuItem> FilterMenuForUser(IEnumerable<MenuItem> items, ICollection<string> claims)
        {
            List<MenuItem> newList = new List<MenuItem>();
            foreach (MenuItem menuItem in items)
            {
                switch (menuItem.Name)
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
                    case "Security":
                        break;
                    case "Application Settings":
                        break;
                    default:
                        newList.Add(menuItem);
                        break;
                }
            }

            return newList;
        }
    }
}