﻿/*
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

using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Menu;

public abstract class AbstractBehavior(
    BaseDbContext dbContext,
    NavigationMenuItemModel menuItemModel,
    int? parentId = null)
{
    protected readonly BaseDbContext DbContext = dbContext;
    protected readonly int? ParentId = parentId;
    public NavigationMenuItemModel MenuItemModel { get; set; } = menuItemModel;

    public abstract bool IsExecute();

    public abstract void Setup(MenuItem menuItem);

    protected void SetTranslations(int menuItemId)
    {
        foreach(var translationModel in MenuItemModel.Translations)
        {
            var menuItemTranslation = new MenuItemTranslation()
            {
                MenuItemId = menuItemId,
                LocaleName = translationModel.LocaleName,
                Name = translationModel.Name,
                Language = translationModel.Language
            };

            DbContext.MenuItemTranslations.Add(menuItemTranslation);
            DbContext.SaveChanges();
        }
    }

}