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

using System.IO;
using Microsoft.AspNetCore.Http;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using OpenStack.NetCoreSwiftClient.Extensions;

namespace ItemsPlanning.Pn.Controllers
{
    using System.Threading.Tasks;
    using Infrastructure.Models.Settings;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Services.ItemsPlanningPnSettingsService;

    public class ItemsPlanningSettingsController : Controller
    {
        private readonly IItemsPlanningPnSettingsService _itemsPlanningPnSettingsService;
        private readonly IEFormCoreService _coreHelper;

        public ItemsPlanningSettingsController(IEFormCoreService coreHelper,
            IItemsPlanningPnSettingsService itemsPlanningPnSettingsService)
        {
            _itemsPlanningPnSettingsService = itemsPlanningPnSettingsService;
            _coreHelper = coreHelper;
        }

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/items-planning-pn/settings")]
        public async Task<OperationDataResult<ItemsPlanningBaseSettings>> GetSettings()
        {
            return await _itemsPlanningPnSettingsService.GetSettings();
        }

        [HttpPost]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/items-planning-pn/settings")]
        public async Task<OperationResult> UpdateSettings([FromBody] ItemsPlanningBaseSettings itemsPlanningBaseSettings)
        {
            return await _itemsPlanningPnSettingsService.UpdateSettings(itemsPlanningBaseSettings);
        }

        [HttpPost]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/items-planning-pn/report-page-image")]
        public async Task<IActionResult> PostLoginPageImages(IFormFile file)
        {
            var iUploadedCnt = 0;
            var saveFolder = PathHelper.GetEformLoginPageSettingsImagesPath();
            // if (string.IsNullOrEmpty(saveFolder))
            // {
            //     return BadRequest(_localizationService.GetString("FolderError"));
            // }

            if (!Directory.Exists(saveFolder))
            {
                Directory.CreateDirectory(saveFolder);
            }

            if (file.Length > 0)
            {
                var filePath = Path.Combine(saveFolder, Path.GetFileName(file.FileName));
                if (!System.IO.File.Exists(filePath))
                {
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);

                        var core = await _coreHelper.GetCore();
                        if (core.GetSdkSetting(Settings.swiftEnabled).Result.ToLower() == "true" || core.GetSdkSetting(Settings.s3Enabled).Result.ToLower() == "true")
                        {
                            await core.PutFileToStorageSystem(filePath, file.FileName);
                        }
                    }
                    iUploadedCnt++;
                }
            }

            if (iUploadedCnt > 0)
            {
                return Ok();
            }
            return BadRequest("InvalidRequest");
        }

    }
}