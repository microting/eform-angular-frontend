using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Sentry.Extensibility;
using Sentry.Protocol.Envelopes;

namespace eFormAPI.Web.Tests.SentryIntegration;

/// <summary>Keeps every envelope item in memory instead of sending it to Sentry.</summary>
public sealed class RecordingSentryTransport : ITransport
{
    // Fake DSNs on a documentation domain; nothing is ever sent to them.
    public const string HostDsn = "https://hostkey@o1.ingest.example.com/1";
    public const string PluginDsn = "https://pluginkey@o1.ingest.example.com/111";

    public sealed record Item(string Type, JsonElement Body);

    private readonly ConcurrentQueue<Item> _items = new();

    public IReadOnlyList<Item> Events => OfType("event");
    public IReadOnlyList<Item> Transactions => OfType("transaction");

    /// <summary>Structured logs, one entry per log record (they are sent in batches).</summary>
    public IReadOnlyList<JsonElement> Logs => OfType("log")
        .SelectMany(x => x.Body.GetProperty("items").EnumerateArray())
        .ToList();

    public async Task SendEnvelopeAsync(Envelope envelope, CancellationToken cancellationToken = default)
    {
        using var stream = new MemoryStream();
        await envelope.SerializeAsync(stream, null, cancellationToken);
        var lines = Encoding.UTF8.GetString(stream.ToArray())
            .Split('\n', StringSplitOptions.RemoveEmptyEntries);
        // Line 0 is the envelope header, followed by (item header, item payload) pairs.
        for (var i = 1; i + 1 < lines.Length; i += 2)
        {
            using var header = JsonDocument.Parse(lines[i]);
            using var body = JsonDocument.Parse(lines[i + 1]);
            _items.Enqueue(new Item(header.RootElement.GetProperty("type").GetString(), body.RootElement.Clone()));
        }
    }

    private List<Item> OfType(string type) => _items.Where(x => x.Type == type).ToList();
}

public static class JsonElementExtensions
{
    /// <summary>Reads a nested string, e.g. <c>body.Get("contexts", "trace", "trace_id")</c>.</summary>
    public static string Get(this JsonElement element, params string[] path)
    {
        foreach (var name in path)
        {
            if (element.ValueKind != JsonValueKind.Object || !element.TryGetProperty(name, out element))
            {
                return null;
            }
        }

        return element.ValueKind == JsonValueKind.String ? element.GetString() : element.ToString();
    }
}
