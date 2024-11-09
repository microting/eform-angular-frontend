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
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Advanced;
using Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.EformAngularFrontendBase.Infrastructure.Const;

[Authorize]
public class WorkersController(IWorkersService workersService) : Controller
{
    [HttpGet]
    [Authorize(Policy = AuthConsts.EformPolicies.Workers.Read)]
    public async Task<OperationDataResult<List<WorkerDto>>> Index()
    {
        return await workersService.Index();
    }

    [HttpPost]
    [Route("api/workers/create")]
    [Authorize(Policy = AuthConsts.EformPolicies.Workers.Create)]
    public async Task<OperationResult> Сreate([FromBody] WorkerCreateModel model)
    {
        return await workersService.Create(model);
    }
        
    [HttpGet]
    [Authorize(Policy = AuthConsts.EformPolicies.Workers.Update)]
    public async Task<OperationDataResult<WorkerDto>> Read(int id)
    {
        return await workersService.Read(id);
    }

    [HttpPost]
    [Authorize(Policy = AuthConsts.EformPolicies.Workers.Update)]
    public async Task<OperationResult> Update([FromBody] WorkerModel workerModel)
    {
        return await workersService.Update(workerModel);
    }

    [HttpGet]
    [Authorize(Policy = AuthConsts.EformPolicies.Workers.Delete)]
    public async Task<OperationResult> Delete(int id)
    {
        return await workersService.Delete(id);
    }
}