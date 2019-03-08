/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 microting

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
using eFormAPI.Web.Infrastructure.Models.Plugins;
using eFormAPI.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers
{
    [Authorize(Roles = EformRole.Admin)]
    public class PluginsController : Controller
    {
        private readonly IPluginsSettingsService _pluginsSettingsService;

        public PluginsController(IPluginsSettingsService pluginsSettingsService)
        {
            _pluginsSettingsService = pluginsSettingsService;
        }

        [HttpGet]
        [Route("api/plugins/settings")]
        public async Task<OperationDataResult<PluginsSettingsModel>> GetCurrentUserMenu(PluginsSettingsRequestModel model)
        {
            return await _pluginsSettingsService.GetPlugins(model);
        }

        [HttpPut]
        [Route("api/plugins/settings")]
        public async Task<OperationResult> GetCurrentUserMenu([FromBody] PluginsSettingsUpdateModel model)
        {
            return await _pluginsSettingsService.UpdatePluginSettings(model);
        }
    }
}