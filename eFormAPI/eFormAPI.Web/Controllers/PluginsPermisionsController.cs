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
public class PluginsPermissionsController(IClaimsService claimsService) : Controller
{
    [HttpGet("api/plugins-permissions/{id}")]
    public async Task<OperationDataResult<ICollection<PluginPermissionModel>>> GetPluginPermissions(int id)
    {
        return await claimsService.GetPluginPermissions(id);
    }

    [HttpGet("api/plugins-permissions/group-permissions/{id}")]
    public async Task<OperationDataResult<ICollection<PluginGroupPermissionsListModel>>> GetPluginGroupPermissions(int id)
    {
        return await claimsService.GetPluginGroupPermissions(id);
    }

    [HttpPut("api/plugins-permissions/group-permissions/{id}")]
    public async Task<OperationResult> SetPluginGroupPermissions(int id, [FromBody]ICollection<PluginGroupPermissionsListModel> permissions)
    {
        return await claimsService.SetPluginGroupPermissions(id, permissions);
    }
}