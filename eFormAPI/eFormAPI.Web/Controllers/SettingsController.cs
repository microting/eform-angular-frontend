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

using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models;
using eFormAPI.Web.Infrastructure.Models.Settings.Admin;
using eFormAPI.Web.Infrastructure.Models.Settings.Initial;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers;

[Authorize]
[Route("api/settings")]
public class SettingsController(ISettingsService settingsService, IAdminService adminService)
    : Controller
{
    [AllowAnonymous]
    [HttpGet]
    [Route("connection-string-exist")]
    public OperationResult ConnectionStringExist()
    {
        return settingsService.ConnectionStringExist();
    }

    [AllowAnonymous]
    [HttpGet]
    [Route("default-locale")]
    public OperationDataResult<string> GetDefaultLocale()
    {
        return settingsService.GetDefaultLocale();
    }

    [AllowAnonymous]
    [HttpPost]
    [Route("connection-string")]
    public async Task<OperationResult> UpdateConnectionString([FromBody] InitialSettingsModel initialSettingsModel)
    {
        return await settingsService.UpdateConnectionString(initialSettingsModel);
    }

    [HttpGet]
    [AllowAnonymous]
    [Route("login-page")]
    public OperationDataResult<LoginPageSettingsModel> GetLoginPageSettings()
    {
        return settingsService.GetLoginPageSettings();
    }


    [HttpGet]
    [Route("page-header")]
    public OperationDataResult<HeaderSettingsModel> GetPageHeaderSettings()
    {
        return settingsService.GetPageHeaderSettings();
    }


    [HttpGet]
    [Authorize(Roles = EformRole.Admin)]
    [Route("admin")]
    public async Task<OperationDataResult<AdminSettingsModel>> GetAdminSettings()
    {
        return await settingsService.GetAdminSettings();
    }


    [HttpPost]
    [Authorize(Roles = EformRole.Admin)]
    [Route("admin")]
    public async Task<OperationResult> UpdateAdminSettings([FromBody] AdminSettingsModel adminSettingsModel)
    {
        await settingsService.IntegrityCheck();
        return await settingsService.UpdateAdminSettings(adminSettingsModel);
    }

    #region ResetSettingsSection

    [HttpGet]
    [Authorize(Roles = EformRole.Admin)]
    [Route("reset-login-page")]
    public async Task<OperationResult> ResetLoginPageSettings()
    {
        return await settingsService.ResetLoginPageSettings();
    }

    [HttpGet]
    [Authorize(Roles = EformRole.Admin)]
    [Route("reset-page-header")]
    public async Task<OperationResult> ResetPageHeaderSettings()
    {
        return await settingsService.ResetPageHeaderSettings();
    }

    #endregion

    [HttpGet]
    [AllowAnonymous]
    [Route("version")]
    public OperationDataResult<string> GetApplicationVersion()
    {
        return settingsService.GetAssemblyVersion();
    }

    [HttpGet]
    [AllowAnonymous]
    [Route("hostos")]
    public OperationDataResult<string> GetApplicationHostOs()
    {
        return settingsService.GetApplicationHostOs();
    }

    [HttpGet]
    [AllowAnonymous]
    [Route("latest-version")]
    public OperationDataResult<string> GetLatestVersion()
    {
        return settingsService.GetLatestVersion();
    }

    [HttpGet]
    [Route(("integrity-test"))]
    public async Task<OperationResult> IntegrityCheck()
    {
        return await settingsService.IntegrityCheck();
    }

    [HttpPut]
    [Route("userback-widget")]
    [Authorize(Roles = EformRole.Admin)]
    public Task<OperationResult> UpdateUserbackWidget([FromBody] bool isEnableWidget)
    {
        return adminService.UpdateUserbackWidget(isEnableWidget);
    }

    [HttpGet]
    [Route("userback-widget")]
    //[Authorize(Roles = EformRole.Admin)]
    public Task<OperationDataResult<UserbackWidgetModel>> IsUserbackWidget()
    {
        return adminService.GetUserbackWidget();
    }

    [HttpGet]
    [Route("languages")]
    public Task<OperationDataResult<LanguagesModel>> GetLanguages()
    {
        return settingsService.GetLanguages();
    }

    [HttpPut]
    [Route("languages")]
    public Task<OperationResult> UpdateLanguages([FromBody] LanguagesModel languages)
    {
        return settingsService.UpdateLanguages(languages);
    }
}