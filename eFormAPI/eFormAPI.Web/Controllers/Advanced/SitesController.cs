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

using System.Collections.Generic;
using Infrastructure.Models.Sites;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Advanced;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

[Authorize]
public class SitesController : Controller
{
    private readonly ISitesService _sitesService;

    public SitesController(ISitesService sitesService)
    {
        _sitesService = sitesService;
    }

    [HttpGet]
    [Route("api/sites/index")]
    [Authorize(Policy = AuthConsts.EformPolicies.Sites.Read)]
    public async Task<OperationDataResult<List<SiteModel>>> Index()
    {
        return await _sitesService.Index();
    }

    [HttpGet]
    [Route("api/sites/dictionary")]
    [Authorize(Policy = AuthConsts.EformPolicies.Sites.Read)]
    public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetSitesDictionary()
    {
        return await _sitesService.GetSitesDictionary();
    }

    [HttpGet]
    [Route("api/sites/pairing")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.PairingRead)]
    public async Task<OperationDataResult<List<SiteModel>>> ReadPairing()
    {
        return await _sitesService.Index();
    }

    [HttpGet]
    [Route("api/sites")]
    [Authorize(Policy = AuthConsts.EformPolicies.Sites.Read)]
    public async Task<OperationDataResult<SiteModel>> Read(int id)
    {
        return await _sitesService.Read(id);
    }

    [HttpPut]
    [Route("api/sites")]
    [Authorize(Policy = AuthConsts.EformPolicies.Sites.Update)]
    public async Task<OperationResult> Update([FromBody] SiteUpdateModel updateModel)
    {
        return await _sitesService.Update(updateModel);
    }

    [HttpDelete]
    [Route("api/sites")]
    [Authorize(Policy = AuthConsts.EformPolicies.Sites.Delete)]
    public async Task<OperationResult> Delete(int id)
    {
        return await _sitesService.Delete(id);
    }
}