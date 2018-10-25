using System;
using System.Collections.Generic;
using System.Text;
using eFormAPI.Web.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.WritableOptions;
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
                var environment = provider.GetService<IHostingEnvironment>();
                var options = provider.GetService<IOptionsMonitor<T>>();
                return new WritableOptions<T>(environment, options, section.Key, file);
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

        public static void AddEFormAuth(this IServiceCollection services, IConfiguration configuration)
        {
            var tokenValidationParameters = new TokenValidationParameters()
            {
                ValidIssuer = configuration["EformTokenOptions:Issuer"],
                ValidAudience = configuration["EformTokenOptions:Issuer"],
                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration["EformTokenOptions:SigningKey"]))
            };
            services.AddAuthentication()
                .AddCookie(cfg =>
                {
                    cfg.SlidingExpiration = true;
                    cfg.ExpireTimeSpan = TimeSpan.FromHours(10);
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
                    policy => policy.RequireClaim(AuthConsts.EformClaims.WorkersClaims.Create));
                options.AddPolicy(AuthConsts.EformPolicies.Workers.Read, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.WorkersClaims.Read));
                options.AddPolicy(AuthConsts.EformPolicies.Workers.Update, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.WorkersClaims.Update));
                options.AddPolicy(AuthConsts.EformPolicies.Workers.Delete, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.WorkersClaims.Delete));
                // Sites
                options.AddPolicy(AuthConsts.EformPolicies.Sites.Create, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.SitesClaims.Create));
                options.AddPolicy(AuthConsts.EformPolicies.Sites.Read, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.SitesClaims.Read));
                options.AddPolicy(AuthConsts.EformPolicies.Sites.Update, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.SitesClaims.Update));
                options.AddPolicy(AuthConsts.EformPolicies.Sites.Delete, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.SitesClaims.Delete));
                // Entity Search
                options.AddPolicy(AuthConsts.EformPolicies.EntitySearch.Create, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySearchClaims.Create));
                options.AddPolicy(AuthConsts.EformPolicies.EntitySearch.Read, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySearchClaims.Read));
                options.AddPolicy(AuthConsts.EformPolicies.EntitySearch.Update, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySearchClaims.Update));
                options.AddPolicy(AuthConsts.EformPolicies.EntitySearch.Delete, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySearchClaims.Delete));
                // Entity Select
                options.AddPolicy(AuthConsts.EformPolicies.EntitySelect.Create, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySelectClaims.Create));
                options.AddPolicy(AuthConsts.EformPolicies.EntitySelect.Read, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySelectClaims.Read));
                options.AddPolicy(AuthConsts.EformPolicies.EntitySelect.Update, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySelectClaims.Update));
                options.AddPolicy(AuthConsts.EformPolicies.EntitySelect.Delete, 
                    policy => policy.RequireClaim(AuthConsts.EformClaims.EntitySelectClaims.Delete));


            });
        }
        public static void AddEFormMvc(this IServiceCollection services,
            List<IEformPlugin> plugins)
        {
            var mvcBuilder = services.AddMvc()
                .AddJsonOptions(options => options.SerializerSettings.ContractResolver =
                    new CamelCasePropertyNamesContractResolver())
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

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
            foreach (var plugin in plugins)
            {
                var connectionString = configuration.GetConnectionString(plugin.ConnectionStringName());
                plugin.ConfigureDbContext(services, connectionString);
            }
        }
    }
}