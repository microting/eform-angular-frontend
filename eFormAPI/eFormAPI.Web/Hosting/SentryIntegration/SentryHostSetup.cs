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

namespace eFormAPI.Web.Hosting.SentryIntegration;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Sentry;
using Sentry.AspNetCore;
using Sentry.Extensions.Logging;

/// <summary>
/// Sentry setup of the API host. The host owns the single hub (Sentry.AspNetCore), so the
/// <c>sentry-trace</c>/<c>baggage</c> headers sent by the Angular frontend are continued and backend
/// errors and ILogger logs carry the frontend's trace id.
/// <para>
/// Plugins are loaded with the host's Sentry assembly (see PluginHelper), so their static
/// <c>SentrySdk</c> calls land on the host hub and <see cref="SentryPluginRouter"/> forwards their
/// events to their own project.
/// </para>
/// <para>
/// Transitional: plugins still call <c>SentrySdk.Init</c> from ConfigureDbContext, i.e. while
/// Startup.ConfigureServices runs. With the shared assembly that makes the plugin's hub the static
/// one for the rest of the host build; the hub UseSentry creates when the host is built then
/// replaces (and disposes) it. Requests therefore always run on the host hub with the host's
/// options. A plugin without the SentryDsn assembly metadata is not routed: its events go to the
/// host project. Plugins that build a temporary service provider from the host's IServiceCollection
/// (the Workflow, Inventory and BackendConfiguration seeders) create an identically configured twin
/// hub; that is harmless and ends when they stop doing so.
/// </para>
/// <para>
/// Known limitations:
/// <list type="bullet">
/// <item>Exception messages and log template parameters are forwarded unredacted.</item>
/// <item>Outgoing HttpClient calls are instrumented: spans and breadcrumbs contain their URLs, and
/// the trace headers are sent to third-party hosts.</item>
/// <item>For an event routed to a plugin project SentrySdk.CaptureException returns SentryId.Empty,
/// LastEventId is empty and the host project records a before_send discard.</item>
/// </list>
/// </para>
/// </summary>
public static class SentryHostSetup
{
    private const string Dsn =
        "https://a20910d51f605d94e956163ffbf9dd5a@o4506241219428352.ingest.sentry.io/4506279162019840";

    private const string CustomerNoTag = "customerNo";
    private const string Redacted = "***";
    private static readonly TimeSpan FlushTimeout = TimeSpan.FromSeconds(2);
    private static readonly TimeSpan CrashFlushTimeout = TimeSpan.FromSeconds(5);
    private static readonly string[] SecretHeaders = ["Authorization", "Cookie"];

    // Per-request/per-query chatter; from Warning up these categories are still forwarded.
    private static readonly string[] NoisyLogCategories =
        ["Microsoft.EntityFrameworkCore", "Microsoft.AspNetCore"];

    /// <summary>True when the DISABLE_SENTRY environment variable is "true" or "1".</summary>
    public static bool IsDisabled() =>
        Environment.GetEnvironmentVariable("DISABLE_SENTRY")?.ToLower() is "true" or "1";

    /// <summary>
    /// Reports a crash while the host is being built, when the hub of UseSentry does not exist yet.
    /// Uses a client of its own instead of the static hub, which at that point may be a plugin's.
    /// </summary>
    public static void ReportStartupCrash(Exception exception, string connectionString,
        Action<SentryOptions> configure = null)
    {
        if (IsDisabled())
        {
            return;
        }

        try
        {
            var options = new SentryOptions { Dsn = Dsn, AutoSessionTracking = false };
            foreach (var tag in GetHostTags(connectionString))
            {
                options.DefaultTags[tag.Key] = tag.Value;
            }

            configure?.Invoke(options);
            using var client = new SentryClient(options);
            client.CaptureException(exception);
            client.FlushAsync(CrashFlushTimeout).Wait(CrashFlushTimeout);
        }
        catch (Exception)
        {
            // Reporting must never hide the crash itself; the caller rethrows it.
        }
    }

    /// <summary>Configures the host hub. Release and environment are left to the SDK defaults.</summary>
    public static void Configure(SentryAspNetCoreOptions options, string connectionString)
    {
        options.Dsn = Dsn;
        options.AutoSessionTracking = true;
        // Owner decision: the Sentry organisation is private, so user id/name/email/IP may be sent.
        // It also makes the SDK fill the event's user from the authenticated principal's claims.
        options.SendDefaultPii = true;

        // DefaultTags rather than SentrySdk.ConfigureScope: the hub is created by DI after this runs
        // and every request gets its own scope, so tags set on the startup scope would not be seen.
        var tags = GetHostTags(connectionString);
        foreach (var tag in tags)
        {
            options.DefaultTags[tag.Key] = tag.Value;
            Console.WriteLine($"info: {tag.Key}: {tag.Value}");
        }

        // Tracing. Returning null leaves the decision to the browser's (sentry-trace) or, without
        // one, to the rate. The liveness probe and the SPA fallback are never traced.
        options.TracesSampleRate = 0.2;
        options.TracesSampler = context => IsTraced(context.TryGetHttpContext()?.Request) ? null : 0;
        // Names a transaction that matched no route; the SDK would use the raw path.
        options.TransactionNameProvider = context => RedactToken(context.Request.Path.Value);

        // Redaction, then routing of plugin events to their own project.
        options.SetBeforeSend((sentryEvent, hint) =>
        {
            RedactRequest(sentryEvent.Request);
            return SentryPluginRouter.BeforeSend(sentryEvent, hint);
        });
        options.SetBeforeSendTransaction(transaction =>
        {
            RedactRequest(transaction.Request);
            return transaction;
        });

        // Logs. The services call SentrySdk.CaptureException(e) and then logger.LogError(e.Message).
        // Turning LogError into an event as well (the SDK default) would report every such error
        // twice, as the message-only log cannot be de-duplicated against the exception. LogError
        // still reaches Sentry as a structured log and as a breadcrumb.
        options.MinimumEventLevel = LogLevel.Critical;
        options.EnableLogs = true;
        tags.TryGetValue(CustomerNoTag, out var customerNo);
        options.SetBeforeSendLog(log => BeforeSendLog(log, customerNo));
        // Breadcrumbs: "Request starting <url>" would carry a token that is part of the URL, and the
        // (redacted) request is attached to the event anyway.
        options.AddLogEntryFilter((category, level, _, _) => level < LogLevel.Warning && IsNoisy(category));
    }

    /// <summary>The static tags every event of this host carries.</summary>
    public static Dictionary<string, string> GetHostTags(string connectionString)
    {
        var tags = new Dictionary<string, string>
        {
            ["osVersion"] = Environment.OSVersion.ToString(),
            ["osArchitecture"] = RuntimeInformation.OSArchitecture.ToString(),
            ["osName"] = RuntimeInformation.OSDescription
        };
        var match = Regex.Match(connectionString ?? "", @"Database=(\d+)_Angular;");
        if (match.Success)
        {
            tags[CustomerNoTag] = match.Groups[1].Value;
        }

        return tags;
    }

    /// <summary>Only the API (REST under /api, and gRPC) is traced; null is a non-HTTP transaction.</summary>
    public static bool IsTraced(HttpRequest request) =>
        request == null ||
        request.Path.StartsWithSegments("/api") ||
        request.ContentType?.StartsWith("application/grpc", StringComparison.OrdinalIgnoreCase) == true;

    /// <summary>
    /// Registers the plugins' own Sentry projects with <see cref="SentryPluginRouter"/>, which logs
    /// for each plugin whether it is routed.
    /// </summary>
    public static void RegisterPlugins(IEnumerable<Assembly> pluginAssemblies,
        Action<SentryOptions> configure = null)
    {
        if (IsDisabled())
        {
            return;
        }

        foreach (var assembly in pluginAssemblies)
        {
            SentryPluginRouter.Register(assembly, configure);
        }
    }

    /// <summary>
    /// Adds the request-level Sentry middleware; call right after UseAuthentication and before UseMvc.
    /// </summary>
    public static IApplicationBuilder UseSentryHost(this IApplicationBuilder app)
    {
        if (IsDisabled())
        {
            return app;
        }

        // Stopped, not Stopping: requests that are still draining can capture events.
        app.ApplicationServices.GetRequiredService<IHostApplicationLifetime>().ApplicationStopped
            .Register(() => SentryPluginRouter.FlushAsync(FlushTimeout).Wait(FlushTimeout));

        // The SDK resolves the user lazily, when an event is captured. Structured logs and
        // transactions never trigger that, so set the user as soon as authentication has run.
        app.Use(async (context, next) =>
        {
            SetUser(context);
            await next();
        });

        // The SDK adds its tracing middleware by itself after UseRouting, but the API controllers are
        // served by the legacy UseMvc that runs before it and would get no transaction.
        return app.UseSentryTracing();
    }

    private static void SetUser(HttpContext context)
    {
        if (context.User.Identity?.IsAuthenticated != true)
        {
            return;
        }

        // The SDK's factory maps the NameIdentifier, Name and Email claims - no database access.
        var user = context.RequestServices.GetService<ISentryUserFactory>()?.Create();
        if (user != null)
        {
            SentrySdk.ConfigureScope(scope => scope.User = user);
        }
    }

    // The SDK attaches the request with all its headers; removes the credentials from it (the bearer
    // token, cookies and the token some file routes carry in the URL). Fails closed.
    private static void RedactRequest(SentryRequest request)
    {
        try
        {
            foreach (var header in request.Headers.Keys
                         .Where(x => SecretHeaders.Contains(x, StringComparer.OrdinalIgnoreCase)).ToList())
            {
                request.Headers[header] = Redacted;
            }

            if (request.Cookies != null)
            {
                request.Cookies = Redacted;
            }

            request.Url = RedactToken(request.Url);
            request.QueryString = RedactToken(request.QueryString);
        }
        catch (Exception)
        {
            request.Headers.Clear();
            request.Cookies = null;
            request.Url = null;
            request.QueryString = null;
        }
    }

    private static string RedactToken(string value) =>
        value == null ? null : Regex.Replace(value, "token=[^&]*", "token=" + Redacted, RegexOptions.IgnoreCase);

    private static bool IsNoisy(string category) =>
        NoisyLogCategories.Any(x => category.StartsWith(x, StringComparison.Ordinal));

    // Drops framework logs below Warning and stamps the customer number on the rest (DefaultTags only
    // apply to events and transactions).
    private static SentryLog BeforeSendLog(SentryLog log, string customerNo)
    {
        if (log.Level < SentryLogLevel.Warning &&
            log.TryGetAttribute("category.name", out var category) &&
            IsNoisy((string)category))
        {
            return null;
        }

        if (customerNo != null)
        {
            log.SetAttribute(CustomerNoTag, customerNo);
        }

        return log;
    }
}
