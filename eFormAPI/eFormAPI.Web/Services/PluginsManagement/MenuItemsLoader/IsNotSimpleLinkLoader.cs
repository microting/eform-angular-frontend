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
using System.Collections.Generic;
using System.Linq;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Menu;

public class IsNotSimpleLinkLoader(BaseDbContext dbContext) : AbstractLoader(dbContext)
{
    private readonly BaseDbContext _dbContext = dbContext;

    public override bool IsExecute(PluginMenuItemModel menuItem)
        => menuItem.Type != MenuItemTypeEnum.Link;

    public override void Load(PluginMenuItemModel menuItem, string pluginId, int? parentId)
    {
        int currentPosition;

        if (menuItem.Type == MenuItemTypeEnum.Dropdown)
        {
            currentPosition = _dbContext.MenuItems
                .Where(x => x.ParentId == null)
                .Max(x => x.Position) + menuItem.Position + 1;
        }
        else
        {
            currentPosition = parentId != null
                ? menuItem.Position
                : _dbContext.MenuItems
                    .Where(x => x.ParentId == null)
                    .Max(x => x.Position) + menuItem.Position + 1;
        }

        var newMenuItem = new MenuItem()
        {
            E2EId = menuItem.E2EId,
            Name = menuItem.Type == MenuItemTypeEnum.Dropdown ? "Dropdown" : menuItem.Name,
            Link = menuItem.Link,
            Type = menuItem.Type,
            Position = currentPosition,
            MenuTemplateId = null,
            ParentId = parentId
        };

        _dbContext.MenuItems.Add(newMenuItem);
        _dbContext.SaveChanges();

        foreach (var translation in menuItem.Translations
                     .Select(menuItemTranslation => new MenuItemTranslation
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

        if (menuItem.ChildItems.Any())
        {
            foreach (var menuItemChild in menuItem.ChildItems)
            {
                var loaders = new List<AbstractLoader>()
                {
                    new SimpleLinkLoader(_dbContext),
                    new IsNotSimpleLinkLoader(_dbContext)
                };

                foreach (var loader in loaders.Where(loader => loader.IsExecute(menuItemChild)))
                {
                    loader.Load(menuItemChild, pluginId, newMenuItem.Id);
                }
            }
        }
    }
}