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

namespace eFormAPI.Web.Services
{
    public class MenuService : IMenuService
    {
        private readonly ILogger<MenuService> _logger;
        private readonly IClaimsService _claimsService;
        private readonly IUserService _userService;
        private readonly BaseDbContext _dbContext;

        public MenuService(ILogger<MenuService> logger,
            BaseDbContext dbContext,
            IClaimsService claimsService,
            IUserService userService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _claimsService = claimsService;
            _userService = userService;
        }

        public async Task<OperationDataResult<MenuModel>> GetCurrentUserMenu()
        {
            try
            {
                var menuItems = await _dbContext.MenuItems.ToListAsync();
                var userClaims = _claimsService.GetUserClaimsNames(_userService.UserId);
                if (!_userService.IsInRole(EformRole.Admin))
                {
                    menuItems = FilterMenuForUser(menuItems, userClaims);
                }
                // Add user first and last name
                foreach (var menuItem in menuItems)
                {
                    if (menuItem.Name == "user")
                    {
                        var user = await _userService.GetCurrentUserAsync();
                        menuItem.Name = $"{user.FirstName} {user.LastName}";
                    }
                }

                var orderedLeft = menuItems
                    .Where(p => p.Parent == null && p.MenuPosition == MenuPosition.Left)
                    .OrderBy(p => p.Position)
                    .Select(p => new MenuItemModel()
                        {
                            Name = p.Name,
                            Position = p.Position,
                            E2EId = p.E2EId,
                            Link = p.Link,
                            MenuItems = menuItems
                                .Where(c => c.ParentId == p.Id && p.MenuPosition == MenuPosition.Left)
                                .OrderBy(c => c.Position)
                                .Select(x => new MenuItemModel()
                                {
                                    Name = x.Name,
                                    Position = x.Position,
                                    Link = x.Link,
                                    E2EId = x.E2EId
                                }).ToList()
                        }
                    ).ToList();

                var orderedRight = menuItems
                    .Where(p => p.Parent == null && p.MenuPosition == MenuPosition.Right)
                    .OrderBy(p => p.Position)
                    .Select(p => new MenuItemModel()
                        {
                            Name = p.Name,
                            Position = p.Position,
                            E2EId = p.E2EId,
                            Link = p.Link,
                            MenuItems = menuItems
                                .Where(c => c.ParentId == p.Id && p.MenuPosition == MenuPosition.Right)
                                .OrderBy(c => c.Position)
                                .Select(x => new MenuItemModel()
                                {
                                    Name = x.Name,
                                    Position = x.Position,
                                    Link = x.Link,
                                    E2EId = x.E2EId
                                }).ToList()
                        }
                    ).ToList();
                var result = new MenuModel()
                {
                    LeftMenu = orderedLeft,
                    RightMenu = orderedRight,
                };
                // Add menu from plugins
                if (Startup.Plugins.Any())
                {
                    foreach (var plugin in Startup.Plugins)
                    {
                        var pluginMenu = plugin.HeaderMenu();
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
                return new OperationDataResult<MenuModel>(false, "Error while obtaining user menu");
            }
        }


        private List<MenuItem> FilterMenuForUser(IEnumerable<MenuItem> items, ICollection<string> claims)
        {
            var newList = new List<MenuItem>();
            foreach (var menuItem in items)
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