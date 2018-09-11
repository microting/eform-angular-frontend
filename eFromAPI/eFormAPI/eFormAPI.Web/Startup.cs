using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using Dapper;
using eFormAPI.Common.Infrastructure.Data;
using eFormAPI.Core.Abstractions;
using eFormAPI.Core.Services;
using eFormAPI.Web.Hosting.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.PlatformAbstractions;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Swagger;

namespace eFormAPI.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Configuration
            services.AddSingleton(Configuration);
            services.AddOptions();
            services.Configure<TokenOptions>(Configuration.GetSection("TokenOptions"));
            //     services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
            // Entity framework PostgreSQL
            services.AddEntityFrameworkSqlServer()
                .AddDbContext<BaseDbContext>(o => o.UseSqlServer(Configuration.MyConnectionString(),
                    b => b.MigrationsAssembly("eFormAPI.Web")));
            // Identity services
            //services.AddIdentity<PbUser, PbRole>()
            //    .AddEntityFrameworkStores<BaseDbContext>()
            //    .AddDefaultTokenProviders()
            //    .AddErrorDescriber<CustomIdentityErrorDescriber>();
            // Identity configuration
            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = false;
                options.Password.RequiredUniqueChars = 6;
                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 10;
                options.Lockout.AllowedForNewUsers = true;
                // User settings
                options.User.RequireUniqueEmail = true;
            });
            // Authentication
            services.AddAuthentication(o =>
                {
                    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    o.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(cfg =>
                {
                    // JWT Bearer
                    cfg.RequireHttpsMetadata = false;
                    cfg.SaveToken = true;
                    cfg.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidIssuer = Configuration["TokenOptions:Issuer"],
                        ValidAudience = Configuration["TokenOptions:Issuer"],
                        IssuerSigningKey =
                            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenOptions:SigningKey"]))
                    };
                });
            // Localiation
            services.AddLocalization(o =>
            {
                // We will put our translations in a folder called Resources
                o.ResourcesPath = "Resources";
            });
            // MVC and API services with CamelCase support
            services.AddMvc()
                .AddJsonOptions(options => options.SerializerSettings.ContractResolver =
                    new CamelCasePropertyNamesContractResolver())
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            // Enable node.js services
            services.AddNodeServices();
            // Form options
            services.Configure<FormOptions>(x =>
            {
                x.ValueLengthLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = long.MaxValue; // In case of multipart
            });
            // Register the Swagger generator, defining one or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info
                {
                    Version = "v1",
                    Title = "eForm API",
                    Description = "API documentation"
                });
                //Set the comments path for the swagger json and ui.
                var basePath = PlatformServices.Default.Application.ApplicationBasePath;
                var xmlPath = Path.Combine(basePath, "API.doc.xml");
                c.IncludeXmlComments(xmlPath);
                c.AddSecurityDefinition("Bearer", new ApiKeyScheme
                {
                    Description =
                        "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = "header",
                    Type = "apiKey"
                });
            });
            ConnectServices(services);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            if (env.IsDevelopment())
            {
                app.UseForwardedHeaders(new ForwardedHeadersOptions
                {
                    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
                    // IIS is also tagging a X-Forwarded-For header on, so we need to increase this limit, 
                    // otherwise the X-Forwarded-For we are passing along from the browser will be ignored
                    ForwardLimit = 2
                });
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            if (env.IsDevelopment())
            {
                loggerFactory.AddConsole(Configuration.GetSection("Logging"));
                loggerFactory.AddDebug();
            //              loggerFactory.AddContext(LogLevel.Warning, Configuration.MyConnectionString());
            }

//     if (env.IsStaging() || env.IsTesting())
            //        {
            //  /   //         loggerFactory.AddContext(LogLevel.Warning, Configuration.MyConnectionString());
            //         }
            //     if (env.IsProduction())
            //      {
            //           loggerFactory.AddContext(LogLevel.Warning, Configuration.MyConnectionString());
            //      }

            //if (env.IsDevelopment() || env.IsTesting())
            //{
            //    app.UseDeveloperExceptionPage();
            //    app.UseDatabaseErrorPage();
            //    app.UseBrowserLink();
            //}
            //else
            //{
            //    app.UseExceptionHandler("/Home/Error");
            //}

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseAuthentication();
            // Automapper configuration
            //          MapConfig.AutoMapperConfig();
            DefaultTypeMap.MatchNamesWithUnderscores = true;

            IList<CultureInfo> supportedCultures = new List<CultureInfo>
            {
                new CultureInfo("en-US"),
                new CultureInfo("da-DK"),
            };
            var localizationOptions = new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture("en-US"),
                SupportedCultures = supportedCultures,
                SupportedUICultures = supportedCultures,
            };
            // Find the cookie provider with LINQ
            var cookieProvider = localizationOptions.RequestCultureProviders
                .OfType<CookieRequestCultureProvider>()
                .First();
            // Set the new cookie name
            cookieProvider.CookieName = "culture";
            app.UseRequestLocalization(localizationOptions);
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    "default",
                    "api/{controller=Home}/{action=Index}/{id?}");
            });
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1"); });
            }

            //
            // Route all unknown requests to app root
            app.UseAngularMiddleware(env);
        }


        private void ConnectServices(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient(provider => provider.GetService<IHttpContextAccessor>().HttpContext.User);
            services.AddScoped<ITagsService, TagsService>();
            services.AddScoped<ITemplateColumnsService, TemplateColumnsService>();
            services.AddScoped<IUnitsService, UnitsService>();
            services.AddScoped<IWorkersService, WorkersService>();
            services.AddScoped<ISitesService, SitesService>();
            services.AddScoped<ISimpleSitesService, SimpleSitesService>();
            services.AddScoped<IEntitySearchService, EntitySearchService>();
            services.AddScoped<IEntitySelectService, EntitySelectService>();
            services.AddScoped<ICasesService, CasesService>();

        }
    }
}