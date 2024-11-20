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

using Sentry;

namespace eFormAPI.Web.Services.Security;

using Cache.AuthCache;
using Microsoft.Extensions.Logging;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Security;
using Hosting.Enums;
using Hosting.Helpers;
using Microsoft.EntityFrameworkCore;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;

public class ClaimsService(
    BaseDbContext dbContext,
    IAuthCacheService authCacheService,
    ILogger<ClaimsService> logger)
    : IClaimsService
{
    public async Task UpdateAuthenticatedUsers(List<int> securityGroups)
    {
        try
        {
            var groupUsers = await dbContext.SecurityGroupUsers
                .AsNoTracking()
                .Where(x => securityGroups.Contains(x.SecurityGroupId))
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Select(x => new
                {
                    UserId = x.EformUserId,
                    Role = x.EformUser.UserRoles
                        .Select(y => y.Role.Name)
                        .FirstOrDefault()
                })
                .ToListAsync();

            foreach (var user in groupUsers)
            {
                // try to get auth item
                var auth = authCacheService.TryGetValue(user.UserId);

                if (auth != null)
                {
                    var isAdmin = user.Role == EformRole.Admin;
                    var timeStamp = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeMilliseconds();
                    var claims = await GetUserPermissions(user.UserId, isAdmin);

                    auth.Claims = claims;
                    auth.TimeStamp = timeStamp;
                    authCacheService.Set(auth, user.UserId);
                }
            }
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            throw;
        }
    }

    public async Task<List<Claim>> GetUserPermissions(int userId, bool isAdmin)
    {
        try
        {
            var memoryClaims = new List<Claim>();

            // Permissions
            if (isAdmin)
            {
                memoryClaims.AddRange(await GetAllAuthClaims());
            }
            else
            {
                memoryClaims.AddRange(await GetUserClaims(userId));
            }

            return memoryClaims;
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            throw;
        }
    }

    public async Task<List<Claim>> GetUserClaims(int userId)
    {
        try
        {
            var claims = new List<Claim>();
            var groups = dbContext.SecurityGroupUsers
                .Where(x => x.EformUserId == userId)
                .Select(x => x.SecurityGroupId)
                .ToList();
            if (groups.Any())
            {
                var claimNames = dbContext.GroupPermissions
                    .Where(x => groups.Contains(x.SecurityGroupId))
                    .Select(x => x.Permission.ClaimName)
                    .ToList();
                claimNames.ForEach(claimName =>
                {
                    claims.Add(new Claim(claimName, AuthConsts.ClaimDefaultValue));
                });

                claims.AddRange(await GetPluginGroupClaims(groups));
            }

            return claims;
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            throw;
        }
    }

    public async Task<List<string>> GetUserClaimsNames(int userId)
    {
        try
        {
            var claims = await GetUserClaims(userId);
            var result = new List<string>();
            if (claims.Any())
            {
                result = claims.Select(x => x.Type).ToList();
            }

            return result;
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            throw;
        }
    }

    public async Task<List<Claim>> GetAllAuthClaims()
    {
        var claims = new List<Claim>()
        {
            // Workers
            new Claim(AuthConsts.EformClaims.WorkersClaims.Read, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.WorkersClaims.Create, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.WorkersClaims.Delete, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.WorkersClaims.Update, AuthConsts.ClaimDefaultValue),
            // Sites
            new Claim(AuthConsts.EformClaims.SitesClaims.Read, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.SitesClaims.Delete, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.SitesClaims.Update, AuthConsts.ClaimDefaultValue),
            // Entity Search
            new Claim(AuthConsts.EformClaims.EntitySearchClaims.Read, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EntitySearchClaims.Create, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EntitySearchClaims.Delete, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EntitySearchClaims.Update, AuthConsts.ClaimDefaultValue),
            // Entity Select
            new Claim(AuthConsts.EformClaims.EntitySelectClaims.Read, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EntitySelectClaims.Create, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EntitySelectClaims.Delete, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EntitySelectClaims.Update, AuthConsts.ClaimDefaultValue),
            // User Management
            new Claim(AuthConsts.EformClaims.UserManagementClaims.Read, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.UserManagementClaims.Create, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.UserManagementClaims.Delete, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.UserManagementClaims.Update, AuthConsts.ClaimDefaultValue),
            // Units
            new Claim(AuthConsts.EformClaims.UnitsClaims.Read, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.UnitsClaims.Update, AuthConsts.ClaimDefaultValue),
            // Device users
            new Claim(AuthConsts.EformClaims.DeviceUsersClaims.Read, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.DeviceUsersClaims.Create, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.DeviceUsersClaims.Delete, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.DeviceUsersClaims.Update, AuthConsts.ClaimDefaultValue),
            // Cases
            new Claim(AuthConsts.EformClaims.CasesClaims.CasesRead, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.CasesClaims.CaseRead, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.CasesClaims.CaseUpdate, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.CasesClaims.CaseDelete, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.CasesClaims.CaseGetPdf, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.CasesClaims.CaseGetDocx, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.CasesClaims.CaseGetPptx, AuthConsts.ClaimDefaultValue),
            // Eform
            new Claim(AuthConsts.EformClaims.EformsClaims.Delete, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.Create, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.Read, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.UpdateColumns, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.DownloadXml, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.UploadZip, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.PairingRead, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.PairingUpdate, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.ReadTags, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.UpdateTags, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.GetCsv, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.ReadJasperReport, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.UpdateJasperReport, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.ExportEformExcel, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EformsClaims.AllowManagingEformTags, AuthConsts.ClaimDefaultValue),
            // E-mail recipients
            new Claim(AuthConsts.EformClaims.EmailRecipientsClaims.Create, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EmailRecipientsClaims.Delete, AuthConsts.ClaimDefaultValue),
            new Claim(AuthConsts.EformClaims.EmailRecipientsClaims.Read, AuthConsts.ClaimDefaultValue)
        };

        claims.AddRange(await GetAllPluginClaims());

        return claims;
    }


    public async Task<OperationResult> SetPluginGroupPermissions(int id, ICollection<PluginGroupPermissionsListModel> permissions)
    {
        var permissionsManager = await GetPluginPermissionsManager(id);
        await permissionsManager.SetPluginGroupPermissions(permissions);

        var securityGroupIds = permissions.Select(x => x.GroupId).ToList();

        // Update claims in memory store
        await UpdateAuthenticatedUsers(securityGroupIds);

        return new OperationResult(true);
    }

    private async Task<List<Claim>> GetAllPluginClaims()
    {
        var claims = new List<Claim>();

        foreach (var eformPlugin in dbContext.EformPlugins.Where(p => p.Status == (int)PluginStatus.Enabled).ToList())
        {
            var permissionManager = await GetPluginPermissionsManager(eformPlugin.Id);

            if (permissionManager == null) continue;

            var pluginPermissions = await permissionManager.GetPluginPermissions();
            claims.AddRange(pluginPermissions.Select(p => new Claim(p.ClaimName, AuthConsts.ClaimDefaultValue)));
        }

        return claims;
    }

    private async Task<List<Claim>> GetPluginGroupClaims(ICollection<int> groups)
    {
        var claims = new List<Claim>();

        foreach (var eformPlugin in dbContext.EformPlugins.Where(p => p.Status == (int)PluginStatus.Enabled).ToList())
        {
            var permissionManager = await GetPluginPermissionsManager(eformPlugin.Id);

            if (permissionManager == null) continue;

            foreach (var group in groups)
            {
                var pluginGroupPermissions = await permissionManager.GetPluginGroupPermissions(group);
                var pluginClaims = pluginGroupPermissions
                    .FirstOrDefault(p => p.GroupId == group)?.Permissions
                    .Where(p => p.IsEnabled)
                    .Select(p => new Claim(p.ClaimName, AuthConsts.ClaimDefaultValue));

                if (pluginClaims != null)
                {
                    claims.AddRange(pluginClaims);
                }
            }
        }

        return claims;
    }


    public async Task<OperationDataResult<ICollection<PluginPermissionModel>>> GetPluginPermissions(int id)
    {
        var permissionsManager = await GetPluginPermissionsManager(id);
        var result = await permissionsManager.GetPluginPermissions();

        return new OperationDataResult<ICollection<PluginPermissionModel>>(true, result);
    }

    public async Task<OperationDataResult<ICollection<PluginGroupPermissionsListModel>>> GetPluginGroupPermissions(int id)
    {
        var permissionsManager = await GetPluginPermissionsManager(id);
        var result = await permissionsManager.GetPluginGroupPermissions();

        return new OperationDataResult<ICollection<PluginGroupPermissionsListModel>>(true, result);
    }

    public async Task<PluginPermissionsManager> GetPluginPermissionsManager(int pluginId)
    {
        var loadedPlugins = PluginHelper.GetAllPlugins();
        var eformPlugin = await dbContext.EformPlugins.FirstOrDefaultAsync(p => p.Id == pluginId);
        var loadedPlugin = loadedPlugins.FirstOrDefault(x => x.PluginId == eformPlugin.PluginId);

        return loadedPlugin?.GetPermissionsManager(eformPlugin.ConnectionString);
    }
}