using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using Castle.Core.Internal;
using eFormAPI.Web.Hosting.Extensions;
using McMaster.NETCore.Plugins;
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
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Database;
using Microting.eFormApi.BasePn.Database.Entities;
using Microting.eFormApi.BasePn.Models.Application;
using Microting.eFormApi.BasePn.Services;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Swagger;

namespace eFormAPI.Web
{
    public class Startup
    {
        private readonly List<IEformPlugin> _plugins = new List<IEformPlugin>();

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            LoadPlugins();
        }

        public void LoadPlugins()
        {
            var loaders = new List<PluginLoader>();

            // create plugin loaders
            var pluginsDir = Path.Combine(Directory.GetCurrentDirectory(), "Plugins");
            if (!Directory.Exists(pluginsDir))
            {
                try
                {
                    Directory.CreateDirectory(pluginsDir);
                }
                catch
                {
                    throw new Exception("Unable to create directory for plugins");
                }
            }

            //   var assemblies = new List<Assembly>();
            var directories = Directory.EnumerateDirectories(pluginsDir);

            foreach (var directory in directories)
            {
                var pluginList = Directory.GetFiles(directory)
                    .Where(x => x.EndsWith("Pn.dll") && Path.GetFileName(x) != "eFormApi.BasePn.dll")
                    .ToList();

                foreach (var pluginFile in pluginList)
                {
                    var loader = PluginLoader.CreateFromAssemblyFile(pluginFile,
                        // this ensures that the plugin resolves to the same version of DependencyInjection
                        // and ASP.NET Core that the current app uses
                        new[]
                        {
                            typeof(IApplicationBuilder),
                            typeof(IEformPlugin),
                            typeof(IServiceCollection),
                        });
                    foreach (var type in loader.LoadDefaultAssembly()
                        .GetTypes()
                        .Where(t => typeof(IEformPlugin).IsAssignableFrom(t) && !t.IsAbstract))
                    {
                        Console.WriteLine("Found plugin " + type.Name);
                        var plugin = (IEformPlugin) Activator.CreateInstance(type);
                        _plugins.Add(plugin);
                    }

                    //var loader = PluginLoader.CreateFromAssemblyFile(
                    //    plugin,
                    //    sharedTypes: new [] { typeof(IEformPlugin), typeof(IServiceCollection), typeof(ILogger) });
                    loaders.Add(loader);
                }
            }


            //// Create an instance of plugin types
            //foreach (var loader in loaders)
            //{
            //    foreach (var pluginType in loader
            //        .LoadDefaultAssembly()
            //        .GetTypes()
            //        .Where(t => typeof(IEformPlugin).IsAssignableFrom(t) && !t.IsAbstract))
            //    {
            //        // This assumes the implementation of IPlugin has a parameterless constructor
            //        IEformPlugin plugin = (IEformPlugin)Activator.CreateInstance(pluginType);

            //        Console.WriteLine($"Created plugin instance '{plugin.GetName()}'.");
            //    }
            //}
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Configuration
            services.AddSingleton(Configuration);
            services.AddOptions();
            services.Configure<EformTokenOptions>(Configuration.GetSection("EformTokenOptions"));
            // Entity framework
            services.AddEntityFrameworkSqlServer()
                .AddDbContext<BaseDbContext>(o => o.UseSqlServer(Configuration.MyConnectionString(),
                    b => b.MigrationsAssembly("eFormAPI.Web")));

            // plugins
            foreach (var plugin in _plugins)
            {
                var connectionString = Configuration.GetConnectionString(plugin.ConnectionStringName());
                plugin.ConfigureDbContext(services, connectionString);
            }

            // Identity services
            services.AddIdentity<EformUser, EformRole>()
                .AddEntityFrameworkStores<BaseDbContext>()
                .AddDefaultTokenProviders();
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
                        ValidIssuer = Configuration["EformTokenOptions:Issuer"],
                        ValidAudience = Configuration["EformTokenOptions:Issuer"],
                        IssuerSigningKey =
                            new SymmetricSecurityKey(
                                Encoding.UTF8.GetBytes(Configuration["EformTokenOptions:SigningKey"]))
                    };
                });
            // Localiation
            services.AddLocalization(o =>
            {
                // We will put our translations in a folder called Resources
                o.ResourcesPath = "Resources";
            });
            // MVC and API services with CamelCase support
            var mvcBuilder = services.AddMvc()
                .AddJsonOptions(options => options.SerializerSettings.ContractResolver =
                    new CamelCasePropertyNamesContractResolver())
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // plugins
            foreach (var plugin in _plugins)
            {
                mvcBuilder.AddApplicationPart(plugin.PluginAssembly())
                    .AddControllersAsServices();
            }

            // Writable options
            services.ConfigureWritable<ApplicationSettings>(Configuration.GetSection("ApplicationSettings"));
            services.ConfigureWritable<EmailSettings>(Configuration.GetSection("EmailSettings"));
            services.ConfigureWritable<LoginPageSettings>(Configuration.GetSection("LoginPageSettings"));
            services.ConfigureWritable<HeaderSettings>(Configuration.GetSection("HeaderSettings"));
            services.ConfigureWritable<ConnectionStrings>(Configuration.GetSection("ConnectionStrings"));
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
            // plugins
            foreach (var plugin in _plugins)
            {
                plugin.ConfigureServices(services);
            }

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

            // plugin
            foreach (var plugin in _plugins)
            {
                plugin.Configure(app);
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
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<ISettingsService, SettingsService>();
            services.AddScoped<ITemplatesService, TemplatesService>();
            services.AddScoped<IEFormCoreService, EFormCoreService>();
        }
    }
}