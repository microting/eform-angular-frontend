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


namespace ItemsPlanning.Pn.Controllers
{
    using Infrastructure.Models.Planning;
    using Services.ItemsPlanningTagsService;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    [Authorize]
    public class ItemsPlanningTagsController : Controller
    {
        private readonly IItemsPlanningTagsService _itemsPlanningTagsService;

        public ItemsPlanningTagsController(IItemsPlanningTagsService itemsPlanningTagsService)
        {
            _itemsPlanningTagsService = itemsPlanningTagsService;
        }

        [HttpGet]
        [Route("api/items-planning-pn/tags")]
        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetItemsPlanningTags()
        {
            return await _itemsPlanningTagsService.GetItemsPlanningTags();
        }

        [HttpPost]
        [Route("api/items-planning-pn/tags")]
        public async Task<OperationResult> CreateItemsPlanningTag([FromBody] PlanningTagModel requestModel)
        {
            return await _itemsPlanningTagsService.CreateItemsPlanningTag(requestModel);
        }

        [HttpPut]
        [Route("api/items-planning-pn/tags")]
        public async Task<OperationResult> UpdateItemsPlanningTag([FromBody] PlanningTagModel requestModel)
        {
            return await _itemsPlanningTagsService.UpdateItemsPlanningTag(requestModel);
        }

        [HttpDelete]
        [Route("api/items-planning-pn/tags/{id}")]
        public async Task<OperationResult> DeleteItemsPlanningTag(int id)
        {
            return await _itemsPlanningTagsService.DeleteItemsPlanningTag(id);
        }
    }
}
