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

namespace eFormAPI.Web.Controllers;

using System.Collections.Generic;
using System.Threading.Tasks;
using Abstractions;
using eFormAPI.Web.Abstractions.Advanced;
using Infrastructure.Models;
using Infrastructure.Models.DeviceUsers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

[Authorize]
[Route("api/device-users")]
public class DeviceUsersController(
    IDeviceUsersService deviceUsersService,
    ILocalizationService localizationService)
    : Controller
{
    [HttpPost]
    [Route("index")]
    [Authorize(Policy = AuthConsts.EformPolicies.DeviceUsers.Read)]
    public async Task<OperationDataResult<List<DeviceUser>>> Index([FromBody] DeviceUserSearchRequestModel requestModel)
    {
        return await deviceUsersService.Index(requestModel);
    }

    [HttpPut]
    [Route("create")]
    [Authorize(Policy = AuthConsts.EformPolicies.DeviceUsers.Create)]
    public async Task<OperationDataResult<int>> Create([FromBody] DeviceUserModel deviceUserModel)
    {
        if (!ModelState.IsValid)
            return new OperationDataResult<int>(false,
                localizationService.GetString("DeviceUserCouldNotBeCreated"));

        return await deviceUsersService.Create(deviceUserModel);
    }

    [HttpGet]
    [Route("read/{id}")]
    [Authorize(Policy = AuthConsts.EformPolicies.DeviceUsers.Update)]
    public async Task<OperationDataResult<DeviceUser>> Read(int id)
    {
        return await deviceUsersService.Read(id);
    }

    [HttpPost]
    [Route("update")]
    [Authorize(Policy = AuthConsts.EformPolicies.DeviceUsers.Update)]
    public async Task<OperationResult> Update([FromBody] DeviceUserModel deviceUserModel)
    {
        return await deviceUsersService.Update(deviceUserModel);
    }

    [HttpDelete]
    [Route("delete/{id}")]
    [Authorize(Policy = AuthConsts.EformPolicies.DeviceUsers.Delete)]
    public async Task<OperationResult> Delete(int id)
    {
        return await deviceUsersService.Delete(id);
    }

    [HttpGet]
    [Route("common-dictionary")]
    [Authorize(Policy = AuthConsts.EformPolicies.DeviceUsers.Update)]
    public async Task<OperationDataResult<List<CommonDictionaryModel>>> ReadCommonDictionary()
    {
        return await deviceUsersService.ReadCommonDictionary();
    }
}