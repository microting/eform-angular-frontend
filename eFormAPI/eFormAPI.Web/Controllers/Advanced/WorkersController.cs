/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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
using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers.Advanced
{
    [Authorize]
    public class WorkersController : Controller
    {
        private readonly IWorkersService _workersService;

        public WorkersController(IWorkersService workersService)
        {
            _workersService = workersService;
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.Workers.Read)]
        public async Task<OperationDataResult<List<Worker_Dto>>> Index()
        {
            return await _workersService.Index();
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.Workers.Update)]
        public async Task<OperationDataResult<Worker_Dto>> Edit(int id)
        {
            return await _workersService.Edit(id);
        }

        [HttpPost]
        [Authorize(Policy = AuthConsts.EformPolicies.Workers.Update)]
        public async Task<OperationResult> Update([FromBody] WorkerModel workerModel)
        {
            return await _workersService.Update(workerModel);
        }

        [HttpPost]
        [Route("api/workers/create")]
        [Authorize(Policy = AuthConsts.EformPolicies.Workers.Create)]
        public async Task<OperationResult> Сreate([FromBody] WorkerCreateModel model)
        {
            return await _workersService.Сreate(model);
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.Workers.Delete)]
        public async Task<OperationResult> Delete(int id)
        {
            return await _workersService.Delete(id);
        }
    }
}