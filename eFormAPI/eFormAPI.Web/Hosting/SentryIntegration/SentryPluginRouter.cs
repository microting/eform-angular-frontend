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
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Sentry;

/// <summary>
/// Routes error events that originate in a plugin to that plugin's own Sentry project.
/// <para>
/// The host owns the one Sentry hub, which is what lets an event carry the trace id, user and tags of
/// the request the Angular frontend started. A plugin still wants its errors in its own project, so
/// it publishes its DSN as <c>[assembly: AssemblyMetadata("SentryDsn", "...")]</c> and the host's
/// <c>BeforeSend</c> hands the finished event to a client bound to that DSN instead of sending it to
/// the host project. Transactions, sessions and structured logs stay in the host project.
/// </para>
/// </summary>
public static class SentryPluginRouter
{
    public const string DsnMetadataKey = "SentryDsn";
    private const string PluginTag = "plugin";
    private const string HostReleaseTag = "host.release";

    private sealed record Route(string Name, string Release, Lazy<SentryClient> Client);

    // Static on purpose: the host is rebuilt on Program.Restart() while plugin assemblies stay loaded.
    private static readonly ConcurrentDictionary<Assembly, Route> Routes = new();

    /// <summary>
    /// Registers a plugin assembly. Idempotent per assembly, so it is safe to call on every host build.
    /// </summary>
    /// <param name="pluginAssembly">The loaded plugin assembly.</param>
    /// <param name="configure">Adjusts the plugin client's options, e.g. to replace the transport in tests.</param>
    /// <returns>
    /// false when the assembly declares no usable DSN; its events then stay in the host project.
    /// </returns>
    public static bool Register(Assembly pluginAssembly, Action<SentryOptions> configure = null)
    {
        if (Routes.ContainsKey(pluginAssembly))
        {
            return true;
        }

        var name = pluginAssembly.GetName();
        var dsn = pluginAssembly.GetCustomAttributes<AssemblyMetadataAttribute>()
            .FirstOrDefault(x => x.Key == DsnMetadataKey)?.Value;
        if (string.IsNullOrWhiteSpace(dsn))
        {
            Log.LogEvent($"Sentry: plugin {name.Name} declares no {DsnMetadataKey} assembly metadata; " +
                         "its events stay in the host project");
            return false;
        }

        // The SDK would only reject a malformed DSN when the client is created, i.e. inside BeforeSend.
        if (!Uri.TryCreate(dsn, UriKind.Absolute, out var dsnUri) ||
            string.IsNullOrEmpty(dsnUri.UserInfo) ||
            string.IsNullOrEmpty(dsnUri.AbsolutePath.Trim('/')))
        {
            Log.LogException($"Sentry: plugin {name.Name} declares a malformed {DsnMetadataKey}; " +
                             "its events stay in the host project");
            return false;
        }

        // Created on the first routed event, so a plugin that never fails costs no background worker.
        var client = new Lazy<SentryClient>(() =>
        {
            // The event arrives already enriched by the host hub; the plugin client only delivers it.
            var options = new SentryOptions
            {
                Dsn = dsn,
                AutoSessionTracking = false
            };
            configure?.Invoke(options);
            return new SentryClient(options);
        });
        if (Routes.TryAdd(pluginAssembly, new Route(name.Name, $"{name.Name}@{name.Version}", client)))
        {
            // Never log the DSN itself: its user info is the project's key.
            Log.LogEvent($"Sentry: plugin {name.Name} is routed to its own project at {dsnUri.Host}");
        }

        return true;
    }

    /// <summary>
    /// The host's <c>BeforeSend</c> callback: re-sends a plugin's event through the plugin's client and
    /// drops it from the host project by returning null. Host events are returned unchanged, and so
    /// is a plugin event that could not be handed over.
    /// </summary>
    public static SentryEvent BeforeSend(SentryEvent sentryEvent, SentryHint hint)
    {
        if (Routes.IsEmpty)
        {
            return sentryEvent;
        }

        // An exception is attributed by its own stack trace: any plugin frame in it, whether the
        // plugin threw or the exception propagated through it. Only an event without an exception
        // (SentrySdk.CaptureMessage, ILogger) is attributed by where it was captured - otherwise a
        // host exception captured below a plugin frame would be taken for the plugin's.
        var route = sentryEvent.Exception != null
            ? FromException(sentryEvent.Exception)
            : FromFrames(new StackTrace(false));
        if (route == null)
        {
            return sentryEvent;
        }

        var hostRelease = sentryEvent.Release;
        try
        {
            var client = route.Client.Value;
            sentryEvent.SetTag(PluginTag, route.Name);
            if (!string.IsNullOrEmpty(hostRelease))
            {
                sentryEvent.SetTag(HostReleaseTag, hostRelease);
            }

            sentryEvent.Release = route.Release;
            // Same event id, trace, user, tags and breadcrumbs - only the destination project differs.
            // CaptureEvent does not throw; it returns an empty id when it dropped the event.
            if (client.CaptureEvent(sentryEvent, null, hint) != SentryId.Empty)
            {
                return null;
            }

            Log.LogException($"Sentry: the client of plugin {route.Name} dropped an event; it stays in the host project");
        }
        catch (Exception e)
        {
            Log.LogException($"Sentry: could not route an event to plugin {route.Name}: {e.Message}");
        }

        // Losing the event is worse than storing it in the host project - as the host event it was.
        sentryEvent.UnsetTag(PluginTag);
        sentryEvent.UnsetTag(HostReleaseTag);
        sentryEvent.Release = hostRelease;
        return sentryEvent;
    }

    /// <summary>Flushes the queued events of every plugin client; call when the host has stopped.</summary>
    public static Task FlushAsync(TimeSpan timeout) =>
        Task.WhenAll(Routes.Values
            .Where(x => x.Client.IsValueCreated)
            .Select(x => x.Client.Value.FlushAsync(timeout)));

    private static Route FromException(Exception exception)
    {
        for (; exception != null; exception = exception.InnerException)
        {
            if (exception is AggregateException aggregate)
            {
                foreach (var inner in aggregate.InnerExceptions)
                {
                    if (FromException(inner) is { } innerRoute)
                    {
                        return innerRoute;
                    }
                }
            }

            if (FromFrames(new StackTrace(exception, false)) is { } route)
            {
                return route;
            }
        }

        return null;
    }

    // The innermost frame (closest to the throw or capture site) owned by a registered plugin wins.
    private static Route FromFrames(StackTrace stackTrace)
    {
        foreach (var frame in stackTrace.GetFrames())
        {
            if (frame.GetMethod()?.DeclaringType?.Assembly is { } assembly &&
                Routes.TryGetValue(assembly, out var route))
            {
                return route;
            }
        }

        return null;
    }
}
