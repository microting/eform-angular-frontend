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

namespace eFormAPI.Web.Hosting.Security;

using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Services.Cache.AuthCache;

public static class AuthServiceCollectionExtensions
{
    public static void AddEFormAuth(
        this IServiceCollection services,
        IConfiguration configuration,
        ICollection<PluginPermissionModel> pluginPermissions)
    {
        // in memory storage
        services.AddMemoryCache();
        // cache and claims services
        services.AddSingleton<IAuthCacheService, AuthCacheService>();
        services.AddSingleton<IClaimsTransformation, ClaimsTransformer>();
        // identity configuration
        services.Configure<IdentityOptions>(options =>
        {
            // Password settings
            options.Password.RequireDigit = false;
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = false;
            // Lockout settings
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10);
            options.Lockout.MaxFailedAccessAttempts = 10;
            options.Lockout.AllowedForNewUsers = true;
            // User settings
            options.User.RequireUniqueEmail = true;
        });
        // token options
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
            options.AddPolicy(AuthConsts.EformPolicies.Eforms.ExportEformExcel,
                policy => policy.RequireClaim(AuthConsts.EformClaims.EformsClaims.ExportEformExcel,
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
}