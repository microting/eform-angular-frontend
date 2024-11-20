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

using Microsoft.Extensions.Logging;
using Sentry;

namespace eFormAPI.Web.Controllers.Eforms;

using System;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Eforms;
using Infrastructure.Models;
using Infrastructure.Models.Templates;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using System.Collections.Generic;
using Infrastructure.Models.Import;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

[Authorize]
public class TemplatesController(ITemplatesService templatesService, ILogger<TemplatesController> logger)
    : Controller
{
    [HttpPost]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.Read)]
    public async Task<IActionResult> Index([FromBody] TemplateRequestModel templateRequestModel)
    {
        try
        {
            return Ok(await templatesService.Index(templateRequestModel));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return Unauthorized();
        }
    }

    [HttpPost]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.Create)]
    public async Task<OperationResult> Create([FromBody] EFormXmlModel eFormXmlModel)
    {
        return await templatesService.Create(eFormXmlModel);
    }

    [HttpPost]
    [Route("api/templates/import")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.Create)]
    public async Task<OperationResult> Import(EformExcelUploadModel uploadModel)
    {
        return await templatesService.Import(uploadModel.File.OpenReadStream());
    }

    [HttpPost]
    [Route("api/templates/duplicate")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.Create)]
    public async Task<OperationDataResult<int>> Duplicate([FromBody]TemplateDuplicateRequestModel requestModel)
    {
        return await templatesService.Duplicate(requestModel);
    }

    [HttpGet]
    [Route("api/templates/get/{id}")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.Read)]
    public async Task<IActionResult> Read(int id)
    {
        try
        {
            return Ok(await templatesService.Get(id));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return Unauthorized();
        }
    }

    [HttpGet]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.Delete)]
    public async Task<OperationResult> Delete(int id)
    {
        return await templatesService.Delete(id);
    }

    [HttpGet]
    [Route("api/templates/get-fields/{id}")]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.Read)]
    public async Task<IActionResult> GetDataItems(int id)
    {
        try
        {
            return Ok(await templatesService.GetFields(id));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return Unauthorized();
        }
    }
        
    [HttpPost]
    [Authorize(Policy = AuthConsts.EformPolicies.Eforms.PairingUpdate)]
    public async Task<OperationResult> Deploy([FromBody] DeployModel deployModel)
    {
        return await templatesService.Deploy(deployModel);
    }

    [HttpGet]
    [Route("api/templates/common-dictionary-templates")]
    public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetCommonDictionaryTemplates(string nameFilter, int idFilter)
    {
        return await templatesService.GetDictionaryTemplates(nameFilter, idFilter);
    }
}