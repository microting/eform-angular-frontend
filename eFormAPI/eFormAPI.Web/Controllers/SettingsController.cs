/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models.Settings.Admin;
using eFormAPI.Web.Infrastructure.Models.Settings.Initial;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers
{
    public class SettingsController : Controller
    {
        private readonly ISettingsService _settingsService;

        public SettingsController(ISettingsService settingsService)
        {
            _settingsService = settingsService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("api/settings/connection-string-exist")]
        public async Task<OperationResult> ConnectionStringExist()
        {
            return await _settingsService.ConnectionStringExist();
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("api/settings/default-locale")]
        public async Task<OperationDataResult<string>> GetDefaultLocale()
        {
            return await _settingsService.GetDefaultLocale();
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("api/settings/connection-string")]
        public async Task<OperationResult> UpdateConnectionString([FromBody] InitialSettingsModel initialSettingsModel)
        {
            return await _settingsService.UpdateConnectionString(initialSettingsModel);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/settings/login-page")]
        public async Task<OperationDataResult<LoginPageSettingsModel>> GetLoginPageSettings()
        {
            return await _settingsService.GetLoginPageSettings();
        }


        [HttpGet]
        [Authorize]
        [Route("api/settings/page-header")]
        public async Task<OperationDataResult<HeaderSettingsModel>> GetPageHeaderSettings()
        {
            return await _settingsService.GetPageHeaderSettings();
        }


        [Authorize(Roles = EformRole.Admin)]
        [HttpGet]
        [Route("api/settings/admin")]
        public async Task<OperationDataResult<AdminSettingsModel>> GetAdminSettings()
        {
            return await _settingsService.GetAdminSettings();
        }


        [Authorize(Roles = EformRole.Admin)]
        [HttpPost]
        [Route("api/settings/admin")]
        public async Task<OperationResult> UpdateAdminSettings([FromBody] AdminSettingsModel adminSettingsModel)
        {
            return await _settingsService.UpdateAdminSettings(adminSettingsModel);
        }

        #region ResetSettingsSection

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/settings/reset-login-page")]
        public async Task<OperationResult> ResetLoginPageSettings()
        {
            return await _settingsService.ResetLoginPageSettings();
        }

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/settings/reset-page-header")]
        public async Task<OperationResult> ResetPageHeaderSettings()
        {
            return await _settingsService.ResetPageHeaderSettings();
        }

        #endregion

        [AllowAnonymous]
        [HttpGet]
        [Route("api/settings/version")]
        public async Task<OperationDataResult<string>> GetApplicationVersion()
        {
            return await _settingsService.GetAssemblyVersion();
        }
        
        [AllowAnonymous]
        [HttpGet]
        [Route("api/settings/hostos")]
        public async Task<OperationDataResult<string>> GetApplicationHostOs()
        {
            
            return await _settingsService.GetApplicationHostOs();
        }
    }
}