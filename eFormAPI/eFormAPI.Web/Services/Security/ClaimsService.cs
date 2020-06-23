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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Hosting.Enums;

namespace eFormAPI.Web.Services.Security
{
    public class ClaimsService : IClaimsService
    {
        private readonly BaseDbContext _dbContext;
        private readonly IPluginPermissionsService _pluginPermissionsService;

        public ClaimsService(BaseDbContext dbContext, IPluginPermissionsService pluginPermissionsService)
        {
            _dbContext = dbContext;
            _pluginPermissionsService = pluginPermissionsService;
        }

        public async Task<List<Claim>> GetUserClaims(int userId)
        {
            try
            {
                var claims = new List<Claim>();
                var groups = _dbContext.SecurityGroupUsers
                    .Where(x => x.EformUserId == userId)
                    .Select(x => x.SecurityGroupId)
                    .ToList();
                if (groups.Any())
                {
                    var claimNames = _dbContext.GroupPermissions
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
                Console.WriteLine(e);
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
                Console.WriteLine(e);
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
            };

            claims.AddRange(await GetAllPLuginClaims());

            return claims;
        }

        private async Task<List<Claim>> GetAllPLuginClaims()
        {
            var claims = new List<Claim>();

            foreach (var eformPlugin in _dbContext.EformPlugins.Where(p => p.Status == (int)PluginStatus.Enabled).ToList())
            {
                var permissionManager = await _pluginPermissionsService.GetPermissionsManager(eformPlugin.Id);

                if (permissionManager == null) continue;

                var pluginPermissions = await permissionManager.GetPluginPermissions();
                claims.AddRange(pluginPermissions.Select(p => new Claim(p.ClaimName, AuthConsts.ClaimDefaultValue)));
            }

            return claims;
        }

        private async Task<List<Claim>> GetPluginGroupClaims(ICollection<int> groups)
        {
            var claims = new List<Claim>();

            foreach (var eformPlugin in _dbContext.EformPlugins.Where(p => p.Status == (int)PluginStatus.Enabled).ToList())
            {
                var permissionManager = await _pluginPermissionsService.GetPermissionsManager(eformPlugin.Id);

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
    }
}