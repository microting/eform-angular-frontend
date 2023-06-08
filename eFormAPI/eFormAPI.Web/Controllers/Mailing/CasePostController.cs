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
namespace eFormAPI.Web.Controllers.Mailing;

using System.Threading.Tasks;
using Infrastructure.Models.Mailing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Services.Mailing.CasePost;

[Authorize]
public class CasePostController : Controller
{
    private readonly ICasePostService _casePostService;

    public CasePostController(ICasePostService casePostService)
    {
        _casePostService = casePostService;
    }

    [HttpGet]
    [Route("api/cases/posts")]
    public async Task<OperationDataResult<CasePostsListModel>> GetAllPosts(CasePostsRequest requestModel)
    {
        return await _casePostService.GetAllPosts(requestModel);
    }

    [HttpGet]
    [Route("api/cases/posts/view/{id}")]
    public async Task<OperationDataResult<CasePostViewModel>> GetPostForView(int id)
    {
        return await _casePostService.GetPostForView(id);
    }

    [HttpPost]
    [Route("api/cases/posts")]
    public async Task<OperationResult> CreatePost([FromBody] CasePostCreateModel model)
    {
        return await _casePostService.CreatePost(model);
    }
}