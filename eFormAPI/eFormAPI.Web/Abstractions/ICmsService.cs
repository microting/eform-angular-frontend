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

namespace eFormAPI.Web.Abstractions;

using System.Collections.Generic;
using System.Threading.Tasks;
using Infrastructure.Models.Cms;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

public interface ICmsService
{
    // Pages
    Task<OperationDataResult<List<CmsPageListModel>>> GetAllPages();
    Task<OperationDataResult<CmsPageModel>> GetPage(int id);
    Task<OperationResult> CreatePage(CmsPageModel model);
    Task<OperationResult> UpdatePage(int id, CmsPageModel model);
    Task<OperationResult> DeletePage(int id);

    // Menus
    Task<OperationDataResult<List<CmsMenuModel>>> GetAllMenus();
    Task<OperationDataResult<CmsMenuModel>> GetMenu(int id);
    Task<OperationResult> CreateMenu(CmsMenuModel model);
    Task<OperationResult> DeleteMenu(int id);
    Task<OperationResult> SaveMenuItems(int menuId, List<CmsMenuItemSaveModel> items);

    // Settings
    Task<OperationDataResult<CmsSettingsModel>> GetSettings();
    Task<OperationResult> UpdateSettings(CmsSettingsModel model);

    // Public (no auth)
    Task<OperationDataResult<CmsPublicConfigModel>> GetPublicConfig();
    Task<OperationDataResult<CmsPublicLandingModel>> GetPublicLanding();
    Task<OperationDataResult<CmsPublicLandingModel>> GetPublicPage(string slug);
}
