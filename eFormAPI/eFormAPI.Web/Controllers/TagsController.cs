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
[Route("api/tags")]
public class TagsController(
    ITagsService tagsService,
    IEformPermissionsService permissionsService)
    : Controller
{
    [HttpGet]
    [Route("index")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.ReadTags)]
    public async Task<OperationDataResult<List<CommonDictionaryModel>>> Index()
    {
        return await tagsService.Index();
    }
        
    [HttpPost]
    [Route("")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateTags)]
    public async Task<OperationResult> Create([FromBody] CommonTagModel tag)
    {
        return await tagsService.Create(tag.Name);
    }


    [HttpPost]
    [Route("template")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateTags)]
    public async Task<IActionResult> Update([FromBody] UpdateTemplateTagsModel requestModel)
    {
        if (!await permissionsService.CheckEform(requestModel.TemplateId,
                AuthConsts.EformClaims.EformsClaims.UpdateTags))
        {
            return Forbid();
        }

        return Ok(await tagsService.Update(requestModel));
    }

    [HttpDelete]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateTags)]
    public async Task<OperationResult> DeleteTag(int tagId)
    {
        return await tagsService.Delete(tagId);
    }

        

    [HttpGet]
    [Route("saved")]
    public async Task<OperationDataResult<SavedTagsModel>> GetSavedTags()
    {
        return await tagsService.GetSavedTags();
    }

    [HttpPut]
    [Route("saved")]
    public async Task<OperationResult> AddTagToSaved([FromBody] SavedTagModel model)
    {
        return await tagsService.AddTagToSaved(model);
    }

    [HttpDelete]
    [Route("saved")]
    public async Task<OperationResult> RemoveTagFromSaved(int tagId)
    {
        return await tagsService.RemoveTagFromSaved(tagId);
    }

    [HttpPut]
    public async Task<OperationResult> UpdateTag([FromBody] CommonTagModel commonTagModel)
    {
        return await tagsService.UpdateTag(commonTagModel);
    }
}