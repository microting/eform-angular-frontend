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
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure.Models.EformPermissions;
using eFormAPI.Web.Infrastructure.Models.Templates;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers.Security;

[Authorize]
public class EformGroupController : Controller
{
    private readonly IEformGroupService _eformGroupService;

    public EformGroupController(IEformGroupService eformGroupService)
    {
        _eformGroupService = eformGroupService;
    }

    [HttpGet]
    [Authorize(Roles = EformRole.Admin)]
    [Route("api/security/eforms/{groupId}")]
    public async Task<OperationDataResult<TemplateListModel>> GetAvailableEforms(TemplateRequestModel model,
        int groupId)
    {
        return await _eformGroupService.GetAvailableEforms(model, groupId);
    }

    [HttpPut]
    [Route("api/security/eforms")]
    [Authorize(Roles = EformRole.Admin)]
    public async Task<OperationResult> AddEformToGroup([FromBody] EformBindGroupModel model)
    {
        return await _eformGroupService.AddEformToGroup(model);
    }

    [HttpGet]
    [Authorize(Roles = EformRole.Admin)]
    [Route("api/security/eforms-permissions/{groupId}")]
    public async Task<OperationDataResult<EformsPermissionsModel>> GetGroupEforms(int groupId)
    {
        return await _eformGroupService.GetGroupEforms(groupId);
    }

    [HttpPost]
    [Authorize(Roles = EformRole.Admin)]
    [Route("api/security/eforms-permissions")]
    public async Task<OperationResult> UpdateGroupEformPermissions([FromBody] EformPermissionsModel model)
    {
        return await _eformGroupService.UpdateGroupEformPermissions(model);
    }

    [HttpGet]
    [Route("api/security/eforms-permissions/simple")]
    public async Task<IActionResult> GetEformSimpleInfo()
    {
        return Ok(await _eformGroupService.GetEformSimpleInfo());
    }

    [HttpDelete]
    [Authorize(Roles = EformRole.Admin)]
    [Route("api/security/eforms/{eformId}/{groupId}")]
    public async Task<OperationResult> DeleteEformFromGroup(int eformId, int groupId)
    {
        return await _eformGroupService.DeleteEformFromGroup(eformId, groupId);
    }
}