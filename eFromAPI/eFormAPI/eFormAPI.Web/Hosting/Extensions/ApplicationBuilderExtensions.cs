using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Localization;
using Microting.eFormApi.BasePn;

namespace eFormAPI.Web.Hosting.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static void UseAngularMiddleware(this IApplicationBuilder app, IHostingEnvironment env)
        {
            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value))
                {
                    var indexFile = Path.Combine(env.ContentRootPath, "wwwroot", "index.html");
                    if (File.Exists(indexFile))
                    {
                        context.Response.StatusCode = 200;
                        const int BUFFER_SIZE = 1024;
                        var buffer = new byte[BUFFER_SIZE];
                        using (var indexFileStream = File.OpenRead(indexFile))
                        {
                            int bytesReaded;
                            context.Response.ContentLength = indexFileStream.Length;
                            context.Response.ContentType = "text/html";
                            while ((bytesReaded = indexFileStream.Read(buffer, 0, buffer.Length)) > 0 &&
                                   !context.RequestAborted.IsCancellationRequested)
                            {
                                await context.Response.Body.WriteAsync(buffer, 0, bytesReaded);
                                await context.Response.Body.FlushAsync();
                            }
                        }
                    }

                    return;
                }

                await next();
            });
        }

        public static void UseEFormPlugins(this IApplicationBuilder app, 
            List<IEformPlugin> plugins)
        {
            foreach (var plugin in plugins)
            {
                plugin.Configure(app);
            }
        }

        public static void UseEFormLocalization(this IApplicationBuilder app)
        {

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
        }
    }
}