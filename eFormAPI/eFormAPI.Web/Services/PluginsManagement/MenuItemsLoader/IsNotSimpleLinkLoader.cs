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

namespace eFormAPI.Web.Services.PluginsManagement.MenuItemsLoader
{
    using eFormAPI.Web.Infrastructure.Database;
    using eFormAPI.Web.Infrastructure.Database.Entities.Menu;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;
    using System.Collections.Generic;
    using System.Linq;

    public class IsNotSimpleLinkLoader : AbstractLoader
    {
        private readonly BaseDbContext _dbContext;

        public IsNotSimpleLinkLoader(BaseDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public override bool IsExecute(PluginMenuItemModel menuItem)
           => menuItem.Type != MenuItemTypeEnum.Link;

        public override void Load(PluginMenuItemModel MenuItem, string pluginId, int? parentId)
        {
            var newMenuItem = new MenuItem()
            {
                Name = MenuItem.Type == MenuItemTypeEnum.Dropdown ? "Dropdown" : MenuItem.Name,
                Link = MenuItem.Link,
                Type = MenuItem.Type,
                Position = MenuItem.ChildItems.Any()
                               ? _dbContext.MenuItems
                                    .Where(x => x.ParentId == null)
                                    .Max(x => x.Position) + MenuItem.Position + 1
                               : MenuItem.Position,
                MenuTemplateId = null,
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
                    MenuItemId = newMenuItem.Id,
                };

                _dbContext.MenuItemTranslations.Add(translation);
                _dbContext.SaveChanges();
            }

            if (MenuItem.ChildItems.Any())
            {
                foreach (var menuItemChild in MenuItem.ChildItems)
                {
                    var loaders = new List<AbstractLoader>()
                    {
                        new SimpleLinkLoader(_dbContext),
                        new IsNotSimpleLinkLoader(_dbContext)
                    };

                    foreach(var loader in loaders)
                    {
                        if(loader.IsExecute(menuItemChild))
                        {
                            loader.Load(menuItemChild, pluginId, newMenuItem.Id);
                        }
                    }
                }
            }
        }
    }
}
