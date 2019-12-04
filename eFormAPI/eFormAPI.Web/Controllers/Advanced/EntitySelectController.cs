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
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Models;
using eFormAPI.Web.Infrastructure.Models.SelectableList;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

namespace eFormAPI.Web.Controllers.Advanced
{
    [Authorize]
    public class EntitySelectController : Controller
    {
        private readonly IEntitySelectService _entitySelectService;

        public EntitySelectController(IEntitySelectService entitySelectService)
        {
            _entitySelectService = entitySelectService;
        }

        [HttpPost]
        [Route("api/selectable-groups")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySelect.Read)]
        public async Task<OperationDataResult<EntityGroupList>> Index(
            [FromBody] AdvEntitySelectableGroupListRequestModel requestModel)
        {
            return await _entitySelectService.GetEntityGroupList(requestModel);
        }

        [HttpPost]
        [Route("api/selectable-groups/create")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySelect.Create)]
        public async Task<OperationResult> Create([FromBody] AdvEntitySelectableGroupEditModel editModel)
        {
            return await _entitySelectService.CreateEntityGroup(editModel);
        }
        
        [HttpGet]
        [Route("api/selectable-groups/get/{entityGroupUid}")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySelect.Read)]
        public async Task<OperationDataResult<EntityGroup>> Read(string entityGroupUid)
        {
            return await _entitySelectService.GetEntityGroup(entityGroupUid);
        }

        [HttpPost]
        [Route("api/selectable-groups/update")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySelect.Update)]
        public async Task<OperationResult> Update([FromBody] AdvEntitySelectableGroupEditModel editModel)
        {
            return await _entitySelectService.UpdateEntityGroup(editModel);
        }
        
        [HttpGet]
        [Route("api/selectable-groups/delete/{entityGroupUid}")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySelect.Delete)]
        public async Task<OperationResult> Delete(string entityGroupUid)
        {
            return await _entitySelectService.DeleteEntityGroup(entityGroupUid);
        }

        [HttpGet]
        [Route("api/selectable-groups/dict/{entityGroupUid}")]
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseRead)]
        public async Task<OperationDataResult<List<CommonDictionaryTextModel>>> GetEntityGroupDictionary(string entityGroupUid)
        {
            return await _entitySelectService.GetEntityGroupDictionary(entityGroupUid);
        }


        [HttpPost]
        [Route("api/selectable-groups/send")]
        public async Task<OperationResult> SendSearchableGroup(string entityGroupUid)
        {
            return await _entitySelectService.SendSearchableGroup(entityGroupUid);
        }
    }
}