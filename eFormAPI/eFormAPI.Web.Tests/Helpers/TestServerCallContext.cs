using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Grpc.Core;

namespace eFormAPI.Web.Tests.Helpers;

public static class TestServerCallContextFactory
{
    public static ServerCallContext Create(
        Metadata requestHeaders = null,
        CancellationToken cancellationToken = default)
    {
        return new TestCallContext(requestHeaders ?? new Metadata(), cancellationToken);
    }

    private class TestCallContext : ServerCallContext
    {
        public TestCallContext(Metadata requestHeaders, CancellationToken ct)
        {
            RequestHeadersCore = requestHeaders;
            CancellationTokenCore = ct;
            DeadlineCore = DateTime.UtcNow.AddHours(1);
        }

        protected override string MethodCore => "TestMethod";
        protected override string HostCore => "localhost";
        protected override string PeerCore => "ipv4:127.0.0.1:0";
        protected override DateTime DeadlineCore { get; }
        protected override Metadata RequestHeadersCore { get; }
        protected override CancellationToken CancellationTokenCore { get; }
        protected override Metadata ResponseTrailersCore => new();
        protected override Status StatusCore { get; set; }
        protected override WriteOptions WriteOptionsCore { get; set; }

        protected override AuthContext AuthContextCore =>
            new(string.Empty, new Dictionary<string, List<AuthProperty>>());

        protected override ContextPropagationToken CreatePropagationTokenCore(
            ContextPropagationOptions options) => throw new NotImplementedException();

        protected override Task WriteResponseHeadersAsyncCore(Metadata responseHeaders) =>
            Task.CompletedTask;
    }
}
