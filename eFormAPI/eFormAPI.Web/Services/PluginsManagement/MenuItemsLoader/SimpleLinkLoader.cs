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

namespace eFormAPI.Web.Services.PluginsManagement.MenuItemsLoader;

using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;
using System.Linq;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Menu;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Permissions;

public class SimpleLinkLoader : AbstractLoader
{
    private readonly BaseDbContext _dbContext;
    public SimpleLinkLoader(BaseDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext;
    }
    public override bool IsExecute(PluginMenuItemModel menuItem)
        => menuItem.Type == MenuItemTypeEnum.Link;

    public override void Load(PluginMenuItemModel MenuItem, string pluginId, int? parentId)
    {
        var menuTemplate = new MenuTemplate()
        {
            Name = MenuItem.MenuTemplate.Name,
            E2EId = MenuItem.MenuTemplate.E2EId,
            DefaultLink = MenuItem.MenuTemplate.DefaultLink,
            EformPluginId = _dbContext.EformPlugins.Single(x => x.PluginId == pluginId).Id
        };

        _dbContext.MenuTemplates.Add(menuTemplate);
        _dbContext.SaveChanges();

        foreach (var translation in MenuItem.MenuTemplate.Translations)
        {
            var menuTemplateTranslation = new MenuTemplateTranslation
            {
                Language = translation.Language,
                LocaleName = translation.LocaleName,
                Name = translation.Name,
                MenuTemplateId = menuTemplate.Id
            };

            _dbContext.MenuTemplateTranslations.Add(menuTemplateTranslation);
            _dbContext.SaveChanges();
        }

        if (MenuItem.MenuTemplate.Permissions.Any())
        {
            foreach (var itemPermission in MenuItem.MenuTemplate.Permissions)
            {
                PermissionType newPermissionType = null;

                var permissionType = _dbContext.PermissionTypes.FirstOrDefault(x => x.Name == itemPermission.PermissionTypeName);

                if(permissionType == null)
                {
                    newPermissionType = new PermissionType
                    {
                        Name = itemPermission.PermissionTypeName
                    };

                    _dbContext.PermissionTypes.Add(newPermissionType);
                    _dbContext.SaveChanges();
                }

                var permission = new Permission
                {
                    PermissionName = itemPermission.PermissionName,
                    ClaimName = itemPermission.ClaimName,
                    PermissionTypeId = newPermissionType == null 
                        ? permissionType.Id 
                        : newPermissionType.Id 
                };
                    
                _dbContext.Permissions.Add(permission);
                _dbContext.SaveChanges();

                var menuTemplatePermission = new MenuTemplatePermission
                {
                    MenuTemplateId = menuTemplate.Id,
                    PermissionId = permission.Id
                };

                _dbContext.MenuTemplatePermissions.Add(menuTemplatePermission);
                _dbContext.SaveChanges();
            }
        }

        var newMenuItem = new MenuItem()
        {
            E2EId = MenuItem.E2EId,
            Name = MenuItem.Name,
            Link = MenuItem.Link,
            Type = MenuItem.Type,
            Position = parentId != null 
                ? MenuItem.Position 
                : _dbContext.MenuItems.Where(x => x.ParentId == null).Max(x => x.Position) + MenuItem.Position + 1,
            MenuTemplateId = menuTemplate.Id,
            ParentId = parentId
        };

        _dbContext.MenuItems.Add(newMenuItem);
        _dbContext.SaveChanges();

        foreach (var menuItemTranslation in MenuItem.Translations)
        {
            var translation = new MenuItemTranslation
            {
                Language = menuItemTranslation.Language,
                LocaleName = menuItemTranslation.LocaleName,
                Name = menuItemTranslation.Name,
                MenuItemId = newMenuItem.Id
            };

            _dbContext.MenuItemTranslations.Add(translation);
            _dbContext.SaveChanges();
        }
    }
}