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

namespace eFormAPI.Web.Services.NavigationMenu.Builder;

using Microting.eFormApi.BasePn.Infrastructure.Models.Application.NavigationMenu;
using System.Linq;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Menu;

public class SimpleLinkBehavior : AbstractBehavior
{
    public SimpleLinkBehavior(BaseDbContext dbContext, NavigationMenuItemModel menuItemModel, int? parentId = null)
        : base(dbContext, menuItemModel, parentId)
    {

    }
    public override bool IsExecute()
        => MenuItemModel.Type == MenuItemTypeEnum.Link;

    public override void Setup(MenuItem menuItem)
    {
        menuItem.Name = MenuItemModel.Name;
        menuItem.MenuTemplateId = MenuItemModel.RelatedTemplateItemId.Value; // value must be
        menuItem.E2EId = _dbContext.MenuTemplates.Single(x => x.Id == MenuItemModel.RelatedTemplateItemId).E2EId;
        menuItem.ParentId = _parentId;

        _dbContext.MenuItems.Add(menuItem);
        _dbContext.SaveChanges();

        //Set translation for menu item
        SetTranslations(menuItem.Id);

        foreach (var securityGroupId in MenuItemModel.SecurityGroupsIds)
        {
            var menuItemSecurityGroup = new MenuItemSecurityGroup()
            {
                SecurityGroupId = securityGroupId,
                MenuItemId = menuItem.Id
            };

            _dbContext.MenuItemSecurityGroups.Add(menuItemSecurityGroup);
            _dbContext.SaveChanges();
        }
    }
}