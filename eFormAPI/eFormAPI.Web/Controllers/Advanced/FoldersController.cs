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


namespace eFormAPI.Web.Controllers.Advanced;

using Infrastructure.Models.Folders;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Advanced;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

[Authorize]
public class FoldersController: Controller
{
    private readonly IFoldersService _foldersService;
        
    public FoldersController(IFoldersService foldersService)
    {
        _foldersService = foldersService;
    }

    [HttpGet]
    [Route("api/folders")]
    [Authorize(Policy = AuthConsts.EformPolicies.Sites.Read)]
    public async Task<OperationDataResult<List<FolderDtoModel>>> Index()
    {
        return await _foldersService.Index();
    }

    [HttpGet]
    [Route("api/folders/list")]
    [Authorize(Policy = AuthConsts.EformPolicies.Sites.Read)]
    public async Task<OperationDataResult<List<FolderDtoModel>>> List()
    {
        return await _foldersService.List();
    }

    [HttpPost]
    [Route("api/folders")]
    [Authorize(Policy = AuthConsts.EformPolicies.Workers.Create)]
    public async Task<OperationResult> Create([FromBody] FolderCreateModel createModel)
    {
        return await _foldersService.Create(createModel);
    }

    [HttpGet]
    [Route("api/folders/{id}")]
    [Authorize(Policy = AuthConsts.EformPolicies.Sites.Read)]
    public async Task<OperationDataResult<FolderModel>> Read(int id)
    {
        return await _foldersService.Read(id);
    }

    [HttpPut]
    [Route("api/folders")]
    [Authorize(Policy = AuthConsts.EformPolicies.Sites.Update)]
    public async Task<OperationResult> Update([FromBody] FolderUpdateModel folderUpdateModel)
    {
        return await _foldersService.Update(folderUpdateModel);
    }

    [HttpDelete]
    [Route("api/folders/{id}")]
    [Authorize(Policy = AuthConsts.EformPolicies.Sites.Delete)]
    public async Task<OperationResult> Delete(int id)
    {
        return await _foldersService.Delete(id);
    }
}