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

using Microting.EformAngularFrontendBase.Infrastructure.Const;
using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Advanced;
using Infrastructure.Models.Units;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

[Authorize]
public class UnitsController(IUnitsService unitsService) : Controller
{
    [HttpGet]
    [Authorize(Policy = AuthConsts.EformPolicies.Units.Read)]
    public Task<OperationDataResult<List<UnitModel>>> Index()
    {
        return unitsService.Index();
    }

    [HttpPost]
    [Route("api/units/create")]
    [Authorize(Policy = AuthConsts.EformPolicies.Units.Update)]
    public Task<OperationResult> Create([FromBody] UnitModel model)
    {
        return unitsService.Create(model);
    }

    [HttpPut]
    [Route("api/units/update")]
    [Authorize(Policy = AuthConsts.EformPolicies.Units.Update)]
    public Task<OperationResult> Update([FromBody] UnitModel model)
    {
        return unitsService.Update(model);
    }

    [HttpGet]
    [Authorize(Policy = AuthConsts.EformPolicies.Units.Update)]
    public Task<OperationDataResult<UnitDto>> RequestOtp(int id)
    {
        return unitsService.RequestOtp(id);
    }
}