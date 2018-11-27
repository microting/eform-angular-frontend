using System;
using System.Reflection;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Settings.Admin;
using Microting.eFormApi.BasePn.Infrastructure.Models.Settings.Initial;

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
        public OperationResult ConnectionStringExist()
        {
            return _settingsService.ConnectionStringExist();
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("api/settings/default-locale")]
        public OperationDataResult<string> GetDefaultLocale()
        {
            return _settingsService.GetDefaultLocale();
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("api/settings/connection-string")]
        public Task<OperationResult> UpdateConnectionString([FromBody] InitialSettingsModel initialSettingsModel)
        {
            return _settingsService.UpdateConnectionString(initialSettingsModel);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/settings/login-page")]
        public OperationDataResult<LoginPageSettingsModel> GetLoginPageSettings()
        {
            return _settingsService.GetLoginPageSettings();
        }


        [HttpGet]
        [Authorize]
        [Route("api/settings/page-header")]
        public OperationDataResult<HeaderSettingsModel> GetPageHeaderSettings()
        {
            return _settingsService.GetPageHeaderSettings();
        }


        [Authorize(Roles = EformRole.Admin)]
        [HttpGet]
        [Route("api/settings/admin")]
        public OperationDataResult<AdminSettingsModel> GetAdminSettings()
        {
            return _settingsService.GetAdminSettings();
        }


        [Authorize(Roles = EformRole.Admin)]
        [HttpPost]
        [Route("api/settings/admin")]
        public OperationResult UpdateAdminSettings([FromBody] AdminSettingsModel adminSettingsModel)
        {
            return _settingsService.UpdateAdminSettings(adminSettingsModel);
        }

        #region ResetSettingsSection

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/settings/reset-login-page")]
        public OperationResult ResetLoginPageSettings()
        {
            return _settingsService.ResetLoginPageSettings();
        }

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/settings/reset-page-header")]
        public OperationResult ResetPageHeaderSettings()
        {
            return _settingsService.ResetPageHeaderSettings();
        }

        #endregion

        [Authorize]
        [HttpGet]
        [Route("api/settings/version")]
        public OperationDataResult<string> GetApplicationVersion()
        {
            return _settingsService.GetAssemblyVersion();
        }
    }
}