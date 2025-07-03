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

using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Abstractions.Security;
using Infrastructure.Models.Templates;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.EformAngularFrontendBase.Infrastructure.Const;

[Route("api/template-columns")]
[Route("api/eform-columns")]
[Authorize]
public class EFormColumnsController(
    ITemplateColumnsService templateColumnsService,
    IEformPermissionsService permissionsService)
    : Controller
{
    [HttpGet]
    [Route("{templateId}")]
    public async Task<OperationDataResult<List<TemplateColumnModel>>> GetAvailableColumns(int templateId)
    {
        return await templateColumnsService.GetAvailableColumns(templateId);
    }

    [HttpGet]
    [Route("current/{templateId}")]
    public async Task<OperationDataResult<DisplayTemplateColumnsModel>> GetCurrentColumns(int templateId)
    {
        return await templateColumnsService.GetCurrentColumns(templateId);
    }

    [HttpPost]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateColumns)]
    public async Task<IActionResult> UpdateColumns([FromBody] UpdateTemplateColumnsModel model)
    {
        if (model.TemplateId != null
            && !await permissionsService.CheckEform((int) model.TemplateId,
                AuthConsts.EformClaims.EformsClaims.UpdateColumns))
        {
            return Forbid();
        }

        return Ok(await templateColumnsService.UpdateColumns(model));
    }
}