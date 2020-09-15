/*
The MIT License (MIT)

Copyright (c) 2007 - 2020 Microting A/S

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

namespace eFormAPI.Web.Controllers.Advanced
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Abstractions.Advanced;
    using Infrastructure.Models.Sites;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    [Authorize]
    public class SiteTagsController : Controller
    {
        private readonly ISiteTagsService _siteTagsService;

        public SiteTagsController(ISiteTagsService siteTagsService)
        {
            _siteTagsService = siteTagsService;
        }

        [HttpGet]
        [Route("api/sites/tags")]
        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetSitesTags()
        {
            return await _siteTagsService.GetSitesTags();
        }

        [HttpPost]
        [Route("api/sites/tags/create")]
        public async Task<OperationResult> CreateSiteTag(string tagName)
        {
            return await _siteTagsService.CreateSiteTag(tagName);
        }

        [HttpGet]
        [Route("api/sites/tags/delete")]
        public async Task<OperationResult> DeleteTag(int tagId)
        {
            return await _siteTagsService.DeleteTag(tagId);
        }

        [HttpPost]
        [Route("api/sites/tags/update")]
        public async Task<OperationResult> UpdateTag([FromBody] UpdateSiteTagsModel siteTagsModel)
        {
            return await _siteTagsService.UpdateSiteTags(siteTagsModel);
        }
    }
}