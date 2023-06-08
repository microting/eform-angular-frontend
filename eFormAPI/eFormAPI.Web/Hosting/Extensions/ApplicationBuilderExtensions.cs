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
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Localization;
using Microting.eFormApi.BasePn;

namespace eFormAPI.Web.Hosting.Extensions;

public static class ApplicationBuilderExtensions
{
    public static void UseAngularMiddleware(this IApplicationBuilder app, IWebHostEnvironment env)
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

    public static void UseEFormPlugins(this IApplicationBuilder app, List<IEformPlugin> plugins)
    {
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($@"[INF] Trying to load {plugins.Count} plugins...");
        foreach (var plugin in plugins)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine($@"[INF] Loading plugin : {plugin.Name}");
            plugin.Configure(app);
        }
        Console.ForegroundColor = ConsoleColor.Gray;
    }

    public static void UseEFormLocalization(this IApplicationBuilder app)
    {

        IList<CultureInfo> supportedCultures = new List<CultureInfo>
        {
            new CultureInfo("en-US"),
            new CultureInfo("da"),
            new CultureInfo("de-DE"),
            new CultureInfo("uk-UA")
        };
        var localizationOptions = new RequestLocalizationOptions
        {
            DefaultRequestCulture = new RequestCulture("en-US"),
            SupportedCultures = supportedCultures,
            SupportedUICultures = supportedCultures
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