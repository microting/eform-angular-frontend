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

namespace eFormAPI.Web.Controllers.Eforms;

using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application.Case.CaseEdit;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Abstractions.Security;
using Infrastructure.Models.Cases.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

[Route("api/cases")]
[Authorize]
public class CasesController : Controller
{
    private readonly ICasesService _casesService;
    private readonly IEformPermissionsService _permissionsService;

    public CasesController(ICasesService casesService,
        IEformPermissionsService permissionsService)
    {
        _casesService = casesService;
        _permissionsService = permissionsService;
    }

    [HttpPost]
    [Authorize(Policy = AuthConsts.EformPolicies.Cases.CasesRead)]
    public async Task<IActionResult> Index([FromBody] CaseRequestModel requestModel)
    {
        if (requestModel.TemplateId != null
            && ! await _permissionsService.CheckEform((int) requestModel.TemplateId,
                AuthConsts.EformClaims.CasesClaims.CasesRead))
        {
            return Forbid();
        }

        return Ok(await _casesService.Index(requestModel));
    }

    [HttpGet]
    [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseRead)]
    public async Task<IActionResult> Read(int id, int templateId)
    {
        if (! await _permissionsService.CheckEform(templateId, 
                AuthConsts.EformClaims.CasesClaims.CaseRead))
        {
            return Forbid();
        }

        return Ok(await _casesService.Read(id));
    }

    [HttpPut]
    [Route("{templateId}")]
    [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseUpdate)]
    public async Task<IActionResult> Update([FromBody] ReplyRequest model, int templateId)
    {
        if (!await _permissionsService.CheckEform(templateId,
                AuthConsts.EformClaims.CasesClaims.CaseUpdate))
        {
            return Forbid();
        }

        return Ok(await _casesService.Update(model));
    }
        
    [HttpDelete]
    [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseDelete)]
    public async Task<IActionResult> Delete(int id, int templateId)
    {
        if (! await _permissionsService.CheckEform(templateId,
                AuthConsts.EformClaims.CasesClaims.CaseDelete))
        {
            return Forbid();
        }

        return Ok(await _casesService.Delete(id));
    }

    [HttpPut]
    [Route("archive")]
    [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseUpdate)]
    public async Task<OperationResult> Archive([FromBody]int caseId)
    {
        return await _casesService.Archive(caseId);
    }

    [HttpPut]
    [Route("unarchive")]
    [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseUpdate)]
    public async Task<OperationResult> Unarchive([FromBody] int caseId)
    {
        return await _casesService.Unarchive(caseId);
    }
}