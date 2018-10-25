using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microting.eFormApi.BasePn;
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
            services.AddAuthentication((cfg =>
                {
                    cfg.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    cfg.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    cfg.DefaultForbidScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                }))
                .AddCookie(cfg =>
                {
                    cfg.SlidingExpiration = true;
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