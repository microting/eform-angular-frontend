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
using Abstractions.Eforms;
using Abstractions.Security;
using Infrastructure.Models.Tags;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

[Authorize]
public class TagsController : Controller
{
    private readonly ITagsService _tagsService;
    private readonly IEformPermissionsService _permissionsService;

    public TagsController(ITagsService tagsService,
        IEformPermissionsService permissionsService)
    {
        _tagsService = tagsService;
        _permissionsService = permissionsService;
    }

    [HttpGet]
    [Route("api/tags/index")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.ReadTags)]
    public async Task<OperationDataResult<List<CommonDictionaryModel>>> Index()
    {
        return await _tagsService.Index();
    }
        
    [HttpPost]
    [Route("api/tags")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateTags)]
    public async Task<OperationResult> Create([FromBody] CommonTagModel tag)
    {
        return await _tagsService.Create(tag.Name);
    }


    [HttpPost]
    [Route("api/tags/template")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateTags)]
    public async Task<IActionResult> Update([FromBody] UpdateTemplateTagsModel requestModel)
    {
        if (!await _permissionsService.CheckEform(requestModel.TemplateId,
                AuthConsts.EformClaims.EformsClaims.UpdateTags))
        {
            return Forbid();
        }

        return Ok(await _tagsService.Update(requestModel));
    }

    [HttpDelete]
    [Route("api/tags")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateTags)]
    public async Task<OperationResult> DeleteTag(int tagId)
    {
        return await _tagsService.Delete(tagId);
    }

        

    [HttpGet]
    [Route("api/tags/saved")]
    public async Task<OperationDataResult<SavedTagsModel>> GetSavedTags()
    {
        return await _tagsService.GetSavedTags();
    }

    [HttpPut]
    [Route("api/tags/saved")]
    public async Task<OperationResult> AddTagToSaved([FromBody] SavedTagModel model)
    {
        return await _tagsService.AddTagToSaved(model);
    }

    [HttpDelete]
    [Route("api/tags/saved")]
    public async Task<OperationResult> RemoveTagFromSaved(int tagId)
    {
        return await _tagsService.RemoveTagFromSaved(tagId);
    }

    [HttpPut]
    [Route("api/tags")]
    public async Task<OperationResult> UpdateTag([FromBody] CommonTagModel commonTagModel)
    {
        return await _tagsService.UpdateTag(commonTagModel);
    }
}