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
using System.Text;
using System.Threading.Tasks;
using Castle.Core.Internal;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Database.Factories;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.WritableOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Newtonsoft.Json.Serialization;

namespace eFormAPI.Web.Hosting.Extensions
{
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

        public static void AddEFormAuth(this IServiceCollection services, IConfiguration configuration, ICollection<PluginPermissionModel> pluginPermissions)
        {
            var tokenValidationParameters = new TokenValidationParameters()
            {
                ValidIssuer = configuration["EformTokenOptions:Issuer"],
                ValidAudience = configuration["EformTokenOptions:Issuer"],
                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration["EformTokenOptions:SigningKey"]))
            };
            services.AddAuthentication((cfg =>
                {
                    cfg.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    cfg.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    cfg.DefaultForbidScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                }))
                .AddCookie(cfg =>
                {
                    cfg.Cookie.Name = "eFormIdentity";
                    cfg.SlidingExpiration = false;
                    cfg.Cookie.Expiration = TimeSpan.FromHours(10);
                    cfg.Cookie.MaxAge = TimeSpan.FromHours(10);
                    cfg.ExpireTimeSpan = TimeSpan.FromHours(10);
                    cfg.Events.OnRedirectToLogin = context =>
                    {
                        context.Response.StatusCode = 401;
                        return Task.CompletedTask;
                    };
                    cfg.Events.OnRedirectToAccessDenied = context =>
                    {
                        context.Response.StatusCode = 403;
                        return Task.CompletedTask;
                    };
                    cfg.Events.OnRedirectToReturnUrl = context =>
                    {
                        context.Response.StatusCode = 403;
                        return Task.CompletedTask;
                    };
                })
                .AddJwtBearer(cfg =>
                {
                    // JWT Bearer
                    cfg.RequireHttpsMetadata = false;
                    cfg.SaveToken = true;
                    cfg.TokenValidationParameters = tokenValidationParameters;
                });
            services.AddAuthorization(options =>
            {
                // Workers
                options.AddPolicy(AuthConsts.EformPolicies.Workers.Create,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.WorkersClaims.Create,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Workers.Read,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.WorkersClaims.Read,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Workers.Update,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.WorkersClaims.Update,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Workers.Delete,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.WorkersClaims.Delete,
                        AuthConsts.ClaimDefaultValue));
                // Sites
                options.AddPolicy(AuthConsts.EformPolicies.Sites.Read,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.SitesClaims.Read,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Sites.Update,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.SitesClaims.Update,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Sites.Delete,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.SitesClaims.Delete,
                        AuthConsts.ClaimDefaultValue));
                // Entity Search
                options.AddPolicy(AuthConsts.EformPolicies.EntitySearch.Create,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySearchClaims.Create,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.EntitySearch.Read,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySearchClaims.Read,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.EntitySearch.Update,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySearchClaims.Update,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.EntitySearch.Delete,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySearchClaims.Delete,
                        AuthConsts.ClaimDefaultValue));
                // Entity Select
                options.AddPolicy(AuthConsts.EformPolicies.EntitySelect.Create,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySelectClaims.Create,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.EntitySelect.Read,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySelectClaims.Read,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.EntitySelect.Update,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySelectClaims.Update,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.EntitySelect.Delete,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySelectClaims.Delete,
                        AuthConsts.ClaimDefaultValue));
                // User management
                options.AddPolicy(AuthConsts.EformPolicies.UserManagement.Create,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.UserManagementClaims.Create,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.UserManagement.Read,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.UserManagementClaims.Read,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.UserManagement.Update,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.UserManagementClaims.Update,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.UserManagement.Delete,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.UserManagementClaims.Delete,
                        AuthConsts.ClaimDefaultValue));
                // Entity Select
                options.AddPolicy(AuthConsts.EformPolicies.Units.Update,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.UnitsClaims.Update,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Units.Read,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.UnitsClaims.Read,
                        AuthConsts.ClaimDefaultValue));
                // Entity Select
                options.AddPolicy(AuthConsts.EformPolicies.DeviceUsers.Create,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.DeviceUsersClaims.Create,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.DeviceUsers.Read,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.DeviceUsersClaims.Read,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.DeviceUsers.Update,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.DeviceUsersClaims.Update,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.DeviceUsers.Delete,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.DeviceUsersClaims.Delete,
                        AuthConsts.ClaimDefaultValue));
                // Cases
                options.AddPolicy(AuthConsts.EformPolicies.Cases.CasesRead,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.CasesClaims.CasesRead,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Cases.CaseRead,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.CasesClaims.CaseRead,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Cases.CaseUpdate,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.CasesClaims.CaseUpdate,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Cases.CaseDelete,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.CasesClaims.CaseDelete,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Cases.CaseGetPdf,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.CasesClaims.CaseGetPdf,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Cases.CaseGetDocx,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.CasesClaims.CaseGetDocx,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Cases.CaseGetPptx,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.CasesClaims.CaseGetPptx,
                        AuthConsts.ClaimDefaultValue));
                // Eforms
                options.AddPolicy(AuthConsts.EformPolicies.Eforms.Create,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.Create,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Eforms.Delete,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.Delete,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Eforms.Read,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.Read,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Eforms.UpdateColumns,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.UpdateColumns,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Eforms.DownloadXml,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.DownloadXml,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Eforms.UploadZip,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.UploadZip,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Eforms.PairingRead,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.PairingRead,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Eforms.PairingUpdate,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.PairingUpdate,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Eforms.ReadTags,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.ReadTags,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Eforms.UpdateTags,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.UpdateTags,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Eforms.GetCsv,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.GetCsv,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Eforms.ReadJasperReport,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.ReadJasperReport,
                        AuthConsts.ClaimDefaultValue));
                options.AddPolicy(AuthConsts.EformPolicies.Eforms.UpdateJasperReport,
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.UpdateJasperReport,
                        AuthConsts.ClaimDefaultValue));

                foreach (var permission in pluginPermissions)
                {
                    options.AddPolicy(
                        permission.ClaimName, 
                        policy => policy.RequireClaim(permission.ClaimName, AuthConsts.ClaimDefaultValue)
                    );
                }
            });
        }

        public static void AddEFormMvc(this IServiceCollection services,
            List<IEformPlugin> plugins)
        {
            var mvcBuilder = services.AddMvc()
                .AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver =
                    new CamelCasePropertyNamesContractResolver())
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

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
            if (!connectionString.IsNullOrEmpty() && connectionString != "...")
            {
                List<EformPlugin> eformPlugins;
                var contextFactory = new BaseDbContextFactory();
                using (var dbContext = contextFactory.CreateDbContext(new[] {configuration.MyConnectionString()}))
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

        private static void SetAdminGroupPluginPermissions(IEformPlugin plugin, string connectionString)
        {
            // Set all plugin permissions for EformAdmins security group
            var permissionsManager = plugin.GetPermissionsManager(connectionString);
            var pluginPermissions = permissionsManager.GetPluginPermissions().Result;
            permissionsManager.SetPluginGroupPermissions(new List<PluginGroupPermissionsListModel>
                {
                    new PluginGroupPermissionsListModel
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
                }
            );
        }
    }
}