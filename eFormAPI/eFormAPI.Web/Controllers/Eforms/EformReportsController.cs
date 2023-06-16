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
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Abstractions.Security;
using Infrastructure.Models.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
public class EformReportsController : Controller
{
    private readonly IEformReportsService _eformReportsService;
    private readonly IEformPermissionsService _permissionsService;

    public EformReportsController(IEformReportsService eformReportsService,
        IEformPermissionsService permissionsService)
    {
        _eformReportsService = eformReportsService;
        _permissionsService = permissionsService;
    }

    [HttpGet]
    [Route("api/templates/{templateId}/report")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.ReadJasperReport)]
    public async Task<IActionResult> GetEformReport(int templateId)
    {
        if (!await _permissionsService.CheckEform(templateId,
                AuthConsts.EformClaims.EformsClaims.ReadJasperReport))
        {
            return Forbid();
        }

        return Ok(await _eformReportsService.GetEformReport(templateId));
    }

    [HttpPut]
    [Route("api/templates/report")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateJasperReport)]
    public async Task<IActionResult> UpdateEformReport([FromBody] EformReportFullModel eformReportModel)
    {
        if (!await _permissionsService.CheckEform(eformReportModel.EformReport.TemplateId,
                AuthConsts.EformClaims.EformsClaims.UpdateJasperReport))
        {
            return Forbid();
        }

        return Ok(await _eformReportsService.UpdateEformReport(eformReportModel));
    }
}