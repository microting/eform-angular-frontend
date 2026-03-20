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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abstractions;
using Infrastructure.Models.Cms;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities.Cms;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

public class CmsService(
    ILogger<CmsService> logger,
    BaseDbContext dbContext) : ICmsService
{
    // ── Pages ────────────────────────────────────────────────────────────────

    public async Task<OperationDataResult<List<CmsPageListModel>>> GetAllPages()
    {
        try
        {
            var pages = await dbContext.CmsPages
                .AsNoTracking()
                .OrderByDescending(p => p.UpdatedAt)
                .Select(p => new CmsPageListModel
                {
                    Id = p.Id,
                    Title = p.Title,
                    Slug = p.Slug,
                    IsLandingPage = p.IsLandingPage,
                    IsPublished = p.IsPublished,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();

            return new OperationDataResult<List<CmsPageListModel>>(true, pages);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting CMS pages");
            return new OperationDataResult<List<CmsPageListModel>>(false, ex.Message);
        }
    }

    public async Task<OperationDataResult<CmsPageModel>> GetPage(int id)
    {
        try
        {
            var page = await dbContext.CmsPages.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
            if (page == null)
                return new OperationDataResult<CmsPageModel>(false, $"Page {id} not found");

            return new OperationDataResult<CmsPageModel>(true, new CmsPageModel
            {
                Id = page.Id,
                Title = page.Title,
                Body = page.Body,
                Slug = page.Slug,
                IsLandingPage = page.IsLandingPage,
                IsPublished = page.IsPublished
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting CMS page {Id}", id);
            return new OperationDataResult<CmsPageModel>(false, ex.Message);
        }
    }

    public async Task<OperationResult> CreatePage(CmsPageModel model)
    {
        try
        {
            if (model.IsLandingPage)
                await ClearLandingPageFlag();

            var now = DateTime.UtcNow;
            var page = new CmsPage
            {
                Title = model.Title,
                Body = model.Body,
                Slug = model.Slug,
                IsLandingPage = model.IsLandingPage,
                IsPublished = model.IsPublished,
                CreatedAt = now,
                UpdatedAt = now
            };

            dbContext.CmsPages.Add(page);
            await dbContext.SaveChangesAsync();
            return new OperationResult(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating CMS page");
            return new OperationResult(false, ex.Message);
        }
    }

    public async Task<OperationResult> UpdatePage(int id, CmsPageModel model)
    {
        try
        {
            var page = await dbContext.CmsPages.FirstOrDefaultAsync(p => p.Id == id);
            if (page == null)
                return new OperationResult(false, $"Page {id} not found");

            if (model.IsLandingPage && !page.IsLandingPage)
                await ClearLandingPageFlag();

            page.Title = model.Title;
            page.Body = model.Body;
            page.Slug = model.Slug;
            page.IsLandingPage = model.IsLandingPage;
            page.IsPublished = model.IsPublished;
            page.UpdatedAt = DateTime.UtcNow;

            await dbContext.SaveChangesAsync();
            return new OperationResult(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating CMS page {Id}", id);
            return new OperationResult(false, ex.Message);
        }
    }

    public async Task<OperationResult> DeletePage(int id)
    {
        try
        {
            var page = await dbContext.CmsPages.FirstOrDefaultAsync(p => p.Id == id);
            if (page == null)
                return new OperationResult(false, $"Page {id} not found");

            dbContext.CmsPages.Remove(page);
            await dbContext.SaveChangesAsync();
            return new OperationResult(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting CMS page {Id}", id);
            return new OperationResult(false, ex.Message);
        }
    }

    // ── Menus ────────────────────────────────────────────────────────────────

    public async Task<OperationDataResult<List<CmsMenuModel>>> GetAllMenus()
    {
        try
        {
            var menus = await dbContext.CmsMenus
                .AsNoTracking()
                .Include(m => m.Items).ThenInclude(i => i.Page)
                .ToListAsync();

            var result = menus.Select(m => new CmsMenuModel
            {
                Id = m.Id,
                Name = m.Name,
                Items = BuildTree(m.Items.ToList())
            }).ToList();

            return new OperationDataResult<List<CmsMenuModel>>(true, result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting CMS menus");
            return new OperationDataResult<List<CmsMenuModel>>(false, ex.Message);
        }
    }

    public async Task<OperationDataResult<CmsMenuModel>> GetMenu(int id)
    {
        try
        {
            var menu = await dbContext.CmsMenus
                .AsNoTracking()
                .Include(m => m.Items).ThenInclude(i => i.Page)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (menu == null)
                return new OperationDataResult<CmsMenuModel>(false, $"Menu {id} not found");

            return new OperationDataResult<CmsMenuModel>(true, new CmsMenuModel
            {
                Id = menu.Id,
                Name = menu.Name,
                Items = BuildTree(menu.Items.ToList())
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting CMS menu {Id}", id);
            return new OperationDataResult<CmsMenuModel>(false, ex.Message);
        }
    }

    public async Task<OperationResult> CreateMenu(CmsMenuModel model)
    {
        try
        {
            var now = DateTime.UtcNow;
            var menu = new CmsMenu
            {
                Name = model.Name,
                CreatedAt = now,
                UpdatedAt = now
            };

            dbContext.CmsMenus.Add(menu);
            await dbContext.SaveChangesAsync();
            return new OperationResult(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating CMS menu");
            return new OperationResult(false, ex.Message);
        }
    }

    public async Task<OperationResult> DeleteMenu(int id)
    {
        try
        {
            var menu = await dbContext.CmsMenus.FirstOrDefaultAsync(m => m.Id == id);
            if (menu == null)
                return new OperationResult(false, $"Menu {id} not found");

            dbContext.CmsMenus.Remove(menu);
            await dbContext.SaveChangesAsync();
            return new OperationResult(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting CMS menu {Id}", id);
            return new OperationResult(false, ex.Message);
        }
    }

    public async Task<OperationResult> SaveMenuItems(int menuId, List<CmsMenuItemSaveModel> items)
    {
        try
        {
            var menu = await dbContext.CmsMenus.FirstOrDefaultAsync(m => m.Id == menuId);
            if (menu == null)
                return new OperationResult(false, $"Menu {menuId} not found");

            // Replace all existing items
            var existing = await dbContext.CmsMenuItems
                .Where(i => i.CmsMenuId == menuId)
                .ToListAsync();
            dbContext.CmsMenuItems.RemoveRange(existing);

            var now = DateTime.UtcNow;
            var newItems = items.Select(i => new CmsMenuItem
            {
                CmsMenuId = menuId,
                ParentId = i.ParentId,
                Title = i.Title,
                PageId = i.PageId,
                ExternalUrl = i.ExternalUrl,
                Target = i.Target,
                Order = i.Order,
                CreatedAt = now,
                UpdatedAt = now
            }).ToList();

            dbContext.CmsMenuItems.AddRange(newItems);
            await dbContext.SaveChangesAsync();
            return new OperationResult(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving menu items for menu {MenuId}", menuId);
            return new OperationResult(false, ex.Message);
        }
    }

    // ── Settings ─────────────────────────────────────────────────────────────

    public async Task<OperationDataResult<CmsSettingsModel>> GetSettings()
    {
        try
        {
            var settings = await GetOrCreateSettings();
            return new OperationDataResult<CmsSettingsModel>(true, new CmsSettingsModel
            {
                IsCmsEnabled = settings.IsCmsEnabled,
                IsMenuSticky = settings.IsMenuSticky,
                ActiveMenuId = settings.ActiveMenuId
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting CMS settings");
            return new OperationDataResult<CmsSettingsModel>(false, ex.Message);
        }
    }

    public async Task<OperationResult> UpdateSettings(CmsSettingsModel model)
    {
        try
        {
            var settings = await GetOrCreateSettings();
            settings.IsCmsEnabled = model.IsCmsEnabled;
            settings.IsMenuSticky = model.IsMenuSticky;
            settings.ActiveMenuId = model.ActiveMenuId;

            await dbContext.SaveChangesAsync();
            return new OperationResult(true);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating CMS settings");
            return new OperationResult(false, ex.Message);
        }
    }

    // ── Public ───────────────────────────────────────────────────────────────

    public async Task<OperationDataResult<CmsPublicConfigModel>> GetPublicConfig()
    {
        try
        {
            var settings = await dbContext.CmsSettings.AsNoTracking().FirstOrDefaultAsync();
            return new OperationDataResult<CmsPublicConfigModel>(true, new CmsPublicConfigModel
            {
                IsCmsEnabled = settings?.IsCmsEnabled ?? false,
                IsMenuSticky = settings?.IsMenuSticky ?? false
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting CMS public config");
            return new OperationDataResult<CmsPublicConfigModel>(false, ex.Message);
        }
    }

    public async Task<OperationDataResult<CmsPublicLandingModel>> GetPublicLanding()
    {
        try
        {
            var page = await dbContext.CmsPages
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.IsLandingPage && p.IsPublished);

            if (page == null)
                return new OperationDataResult<CmsPublicLandingModel>(false, "No published landing page found");

            return new OperationDataResult<CmsPublicLandingModel>(true, new CmsPublicLandingModel
            {
                Title = page.Title,
                Body = page.Body,
                Menu = await GetActiveMenuModel()
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting CMS public landing");
            return new OperationDataResult<CmsPublicLandingModel>(false, ex.Message);
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private async Task ClearLandingPageFlag()
    {
        var currentLanding = await dbContext.CmsPages
            .Where(p => p.IsLandingPage)
            .ToListAsync();
        foreach (var p in currentLanding)
            p.IsLandingPage = false;
    }

    private async Task<CmsSettings> GetOrCreateSettings()
    {
        var settings = await dbContext.CmsSettings.FirstOrDefaultAsync();
        if (settings != null) return settings;

        settings = new CmsSettings
        {
            IsCmsEnabled = false,
            IsMenuSticky = false
        };
        dbContext.CmsSettings.Add(settings);
        await dbContext.SaveChangesAsync();
        return settings;
    }

    private static List<CmsMenuItemModel> BuildTree(List<CmsMenuItem> items, int? parentId = null)
    {
        return items
            .Where(i => i.ParentId == parentId)
            .OrderBy(i => i.Order)
            .Select(i => new CmsMenuItemModel
            {
                Id = i.Id,
                ParentId = i.ParentId,
                Title = i.Title,
                PageId = i.PageId,
                PageSlug = i.Page?.Slug,
                ExternalUrl = i.ExternalUrl,
                Target = i.Target,
                Order = i.Order,
                Children = BuildTree(items, i.Id)
            })
            .ToList();
    }

    private async Task<CmsMenuModel?> GetActiveMenuModel()
    {
        var settings = await dbContext.CmsSettings.AsNoTracking().FirstOrDefaultAsync();
        if (settings?.ActiveMenuId == null) return null;

        var menu = await dbContext.CmsMenus
            .AsNoTracking()
            .Include(m => m.Items).ThenInclude(i => i.Page)
            .FirstOrDefaultAsync(m => m.Id == settings.ActiveMenuId);

        if (menu == null) return null;

        return new CmsMenuModel
        {
            Id = menu.Id,
            Name = menu.Name,
            Items = BuildTree(menu.Items.ToList())
        };
    }

    public async Task<OperationDataResult<CmsPublicLandingModel>> GetPublicPage(string slug)
    {
        try
        {
            var page = await dbContext.CmsPages
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Slug == slug && p.IsPublished);

            if (page == null)
                return new OperationDataResult<CmsPublicLandingModel>(false, $"Page '{slug}' not found");

            return new OperationDataResult<CmsPublicLandingModel>(true, new CmsPublicLandingModel
            {
                Title = page.Title,
                Body = page.Body,
                Menu = await GetActiveMenuModel()
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting CMS public page {Slug}", slug);
            return new OperationDataResult<CmsPublicLandingModel>(false, ex.Message);
        }
    }
}
