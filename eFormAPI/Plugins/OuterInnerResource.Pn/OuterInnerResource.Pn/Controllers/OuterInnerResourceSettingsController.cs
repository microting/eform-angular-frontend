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

using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using OuterInnerResource.Pn.Abstractions;
using OuterInnerResource.Pn.Infrastructure.Models.Settings;

namespace OuterInnerResource.Pn.Controllers
{
    public class OuterInnerResourceSettingsController : Controller
    {
        private readonly IOuterInnerResourceSettingsService _outerInnerResourceSettingsService;

        public OuterInnerResourceSettingsController(IOuterInnerResourceSettingsService outerInnerResourceSettingsService)
        {
            _outerInnerResourceSettingsService = outerInnerResourceSettingsService;
        }

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/outer-inner-resource-pn/settings")]
        public async Task<OperationDataResult<OuterInnerResourceSettings>> GetSettings()
        {
            return await _outerInnerResourceSettingsService.GetSettings();
        }


        [HttpPost]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/outer-inner-resource-pn/settings")]
        public async Task<OperationResult> UpdateSettings([FromBody] OuterInnerResourceSettings machineAreaSettingsModel)
        {
            return await _outerInnerResourceSettingsService.UpdateSettings(machineAreaSettingsModel);
        }

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/outer-inner-resource-pn/settings/sites")]
        public OperationResult GetSitesEnabled()
        {
            return _outerInnerResourceSettingsService.GetSitesEnabled();
        }

        [HttpPost]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/outer-inner-resource-pn/settings/sites")]
        public async Task<OperationResult> UpdateSitesEnabled([FromBody] List<int> siteIds)
        {
            return await _outerInnerResourceSettingsService.UpdateSitesEnabled(siteIds);
        }
    }
}
