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

namespace eFormAPI.Web.Controllers;

using System.Collections.Generic;
using System.Threading.Tasks;
using Abstractions;
using Infrastructure.Models.Cms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

[Authorize]
[Route("api/cms")]
public class CmsController(ICmsService cmsService) : Controller
{
    // ── Public endpoints (no auth) ───────────────────────────────────────────

    [AllowAnonymous]
    [HttpGet]
    [Route("public/config")]
    public async Task<OperationDataResult<CmsPublicConfigModel>> GetPublicConfig()
    {
        return await cmsService.GetPublicConfig();
    }

    [AllowAnonymous]
    [HttpGet]
    [Route("public/landing")]
    public async Task<OperationDataResult<CmsPublicLandingModel>> GetPublicLanding()
    {
        return await cmsService.GetPublicLanding();
    }

    [AllowAnonymous]
    [HttpGet]
    [Route("public/pages/{slug}")]
    public async Task<OperationDataResult<CmsPublicLandingModel>> GetPublicPage(string slug)
    {
        return await cmsService.GetPublicPage(slug);
    }

    // ── Settings ─────────────────────────────────────────────────────────────

    [HttpGet]
    [Authorize(Roles = EformRole.Admin)]
    [Route("settings")]
    public async Task<OperationDataResult<CmsSettingsModel>> GetSettings()
    {
        return await cmsService.GetSettings();
    }

    [HttpPut]
    [Authorize(Roles = EformRole.Admin)]
    [Route("settings")]
    public async Task<OperationResult> UpdateSettings([FromBody] CmsSettingsModel model)
    {
        return await cmsService.UpdateSettings(model);
    }

    // ── Pages ────────────────────────────────────────────────────────────────

    [HttpGet]
    [Route("pages")]
    public async Task<OperationDataResult<List<CmsPageListModel>>> GetAllPages()
    {
        return await cmsService.GetAllPages();
    }

    [HttpGet]
    [Route("pages/{id:int}")]
    public async Task<OperationDataResult<CmsPageModel>> GetPage(int id)
    {
        return await cmsService.GetPage(id);
    }

    [HttpPost]
    [Authorize(Roles = EformRole.Admin)]
    [Route("pages")]
    public async Task<OperationResult> CreatePage([FromBody] CmsPageModel model)
    {
        return await cmsService.CreatePage(model);
    }

    [HttpPut]
    [Authorize(Roles = EformRole.Admin)]
    [Route("pages/{id:int}")]
    public async Task<OperationResult> UpdatePage(int id, [FromBody] CmsPageModel model)
    {
        return await cmsService.UpdatePage(id, model);
    }

    [HttpDelete]
    [Authorize(Roles = EformRole.Admin)]
    [Route("pages/{id:int}")]
    public async Task<OperationResult> DeletePage(int id)
    {
        return await cmsService.DeletePage(id);
    }

    // ── Menus ────────────────────────────────────────────────────────────────

    [HttpGet]
    [Route("menus")]
    public async Task<OperationDataResult<List<CmsMenuModel>>> GetAllMenus()
    {
        return await cmsService.GetAllMenus();
    }

    [HttpGet]
    [Route("menus/{id:int}")]
    public async Task<OperationDataResult<CmsMenuModel>> GetMenu(int id)
    {
        return await cmsService.GetMenu(id);
    }

    [HttpPost]
    [Authorize(Roles = EformRole.Admin)]
    [Route("menus")]
    public async Task<OperationResult> CreateMenu([FromBody] CmsMenuModel model)
    {
        return await cmsService.CreateMenu(model);
    }

    [HttpDelete]
    [Authorize(Roles = EformRole.Admin)]
    [Route("menus/{id:int}")]
    public async Task<OperationResult> DeleteMenu(int id)
    {
        return await cmsService.DeleteMenu(id);
    }

    [HttpPut]
    [Authorize(Roles = EformRole.Admin)]
    [Route("menus/{menuId:int}/items")]
    public async Task<OperationResult> SaveMenuItems(int menuId, [FromBody] List<CmsMenuItemSaveModel> items)
    {
        return await cmsService.SaveMenuItems(menuId, items);
    }
}
