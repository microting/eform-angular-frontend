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

namespace eFormAPI.Web.Hosting.Extensions;

using System.Collections.Generic;
using System.Linq;
using Helpers.DbOptions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Factories;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.WritableOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Newtonsoft.Json.Serialization;

public static class ServiceCollectionExtensions
{
    public static void ConfigureWritable<T>(
        this IServiceCollection services,
        IConfigurationSection section,
        string file = "appsettings.json") where T : class, new()
    {
        services.Configure<T>(section);
        services.AddTransient<IWritableOptions<T>>(provider =>
        {
            var environment = provider.GetService<IWebHostEnvironment>();
            var options = provider.GetService<IOptionsMonitor<T>>();
            return new WritableOptions<T>(environment, options, section.Key, file);
        });
    }

    public static void ConfigureDbOptions<T>(
        this IServiceCollection services,
        IConfigurationSection section) where T : class, new()
    {
        services.Configure<T>(section);
        services.AddTransient<IDbOptions<T>>(provider =>
        {
            var options = provider.GetService<IOptionsMonitor<T>>();
            return new DbOptions<T>(options);
        });
    }

    public static void AddEFormPlugins(this IServiceCollection services,
        List<IEformPlugin> plugins)
    {
        foreach (var plugin in plugins)
        {
            plugin.ConfigureServices(services);
        }
    }

    public static void AddEFormMvc(this IServiceCollection services,
        List<IEformPlugin> plugins)
    {
        var mvcBuilder = services.AddMvc()
            .AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver =
                new CamelCasePropertyNamesContractResolver());

        foreach (var plugin in plugins)
        {
            mvcBuilder.AddApplicationPart(plugin.PluginAssembly())
                .AddControllersAsServices();
        }
    }

    public static void AddEFormPluginsDbContext(this IServiceCollection services,
        IConfiguration configuration,
        List<IEformPlugin> plugins)
    {
        var connectionString = configuration.MyConnectionString();
        if (!string.IsNullOrEmpty(connectionString) && connectionString != "...")
        {
            List<EformPlugin> eformPlugins;
            var contextFactory = new BaseDbContextFactory();
            using (var dbContext = contextFactory.CreateDbContext(new[] { configuration.MyConnectionString() }))
            {
                eformPlugins = dbContext.EformPlugins
                    .AsNoTracking()
                    .Where(x => x.ConnectionString != "...")
                    .ToList();
            }

            foreach (var plugin in plugins)
            {
                var eformPlugin = eformPlugins.FirstOrDefault(x => x.PluginId == plugin.PluginId);
                if (eformPlugin?.ConnectionString != null)
                {
                    plugin.ConfigureDbContext(services, eformPlugin.ConnectionString);

                    SetAdminGroupPluginPermissions(plugin, eformPlugin.ConnectionString);
                }
            }
        }
    }

    private static async void SetAdminGroupPluginPermissions(IEformPlugin plugin, string connectionString)
    {
        // Set all plugin permissions for EformAdmins security group
        var permissionsManager = plugin.GetPermissionsManager(connectionString);
        if (permissionsManager != null)
        {
            var pluginPermissions = await permissionsManager.GetPluginPermissions();
            await permissionsManager.SetPluginGroupPermissions(new List<PluginGroupPermissionsListModel>
            {
                new()
                {
                    GroupId = AuthConsts.DbIds.SecurityGroups.EformAdmins,
                    Permissions = pluginPermissions.Select(pp => new PluginGroupPermissionModel
                        {
                            ClaimName = pp.ClaimName,
                            IsEnabled = true,
                            PermissionId = pp.PermissionId,
                            PermissionName = pp.PermissionName
                        }
                    ).ToList()
                }
            });
        }
    }
}