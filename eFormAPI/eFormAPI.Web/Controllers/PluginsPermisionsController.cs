using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;

namespace eFormAPI.Web.Controllers;

using Abstractions.Security;

[Authorize(Roles = EformRole.Admin)]
public class PluginsPermissionsController : Controller
{
    private readonly IClaimsService _claimsService;

    public PluginsPermissionsController(IClaimsService claimsService)
    {
        _claimsService = claimsService;
    }

    [HttpGet("api/plugins-permissions/{id}")]
    public async Task<OperationDataResult<ICollection<PluginPermissionModel>>> GetPluginPermissions(int id)
    {
        return await _claimsService.GetPluginPermissions(id);
    }

    [HttpGet("api/plugins-permissions/group-permissions/{id}")]
    public async Task<OperationDataResult<ICollection<PluginGroupPermissionsListModel>>> GetPluginGroupPermissions(int id)
    {
        return await _claimsService.GetPluginGroupPermissions(id);
    }

    [HttpPut("api/plugins-permissions/group-permissions/{id}")]
    public async Task<OperationResult> SetPluginGroupPermissions(int id, [FromBody]ICollection<PluginGroupPermissionsListModel> permissions)
    {
        return await _claimsService.SetPluginGroupPermissions(id, permissions);
    }
}