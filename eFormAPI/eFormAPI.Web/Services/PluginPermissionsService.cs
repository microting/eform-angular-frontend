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
using eFormAPI.Web.Hosting.Helpers;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
    public class PluginPermissionsService : IPluginPermissionsService
    {
        private readonly BaseDbContext _dbContext;
        private readonly List<IEformPlugin> _loadedPlugins;

        public PluginPermissionsService(BaseDbContext dbContext)
        {
            _dbContext = dbContext;
            _loadedPlugins = PluginHelper.GetAllPlugins();
        }

        public async Task<OperationDataResult<ICollection<PluginPermissionModel>>> GetPluginPermissions(int id)
        {
            var eformPlugin = await _dbContext.EformPlugins.FirstOrDefaultAsync(p => p.Id == id);
            var loadedPlugin = _loadedPlugins.First(x => x.PluginId == eformPlugin.PluginId);
            var helper = loadedPlugin.GetPermissionsHelper(eformPlugin.ConnectionString);
            var result = await helper.GetPluginPermissions();

            return new OperationDataResult<ICollection<PluginPermissionModel>>(true, result);
        }

        public async Task<OperationDataResult<ICollection<PluginGroupPermissionsListModel>>> GetPluginGroupPermissions(int id)
        {
            var eformPlugin = await _dbContext.EformPlugins.FirstOrDefaultAsync(p => p.Id == id);
            var loadedPlugin = _loadedPlugins.First(x => x.PluginId == eformPlugin.PluginId);
            var helper = loadedPlugin.GetPermissionsHelper(eformPlugin.ConnectionString);
            var result = await helper.GetPluginGroupPermissions();

            return new OperationDataResult<ICollection<PluginGroupPermissionsListModel>>(true, result);
        }

        public async Task<OperationResult> SetPluginGroupPermissions(int id, ICollection<PluginGroupPermissionsListModel> permissions)
        {
            var eformPlugin = await _dbContext.EformPlugins.FirstOrDefaultAsync(p => p.Id == id);
            var loadedPlugin = _loadedPlugins.First(x => x.PluginId == eformPlugin.PluginId);
            var helper = loadedPlugin.GetPermissionsHelper(eformPlugin.ConnectionString);
            await helper.SetPluginGroupPermissions(permissions);

            return new OperationResult(true);
        }
    }
}