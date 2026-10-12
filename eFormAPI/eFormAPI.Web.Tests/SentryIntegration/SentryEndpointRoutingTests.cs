using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using eFormAPI.Web.Hosting.SentryIntegration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NUnit.Framework;
using Sentry;

namespace eFormAPI.Web.Tests.SentryIntegration;

/// <summary>
/// The gRPC and plugin endpoints of Startup run behind UseRouting, where the SDK inserts its tracing
/// middleware by itself. That only happens in a Startup-style Configure (a WebApplication pipeline is
/// not wrapped), hence a generic host of its own.
/// </summary>
[TestFixture]
public class SentryEndpointRoutingTests
{
    private const string TraceId = "771a43a4192642f0b136d5159a501700";

    [Test]
    public async Task RoutedEndpoint_RunsWithoutATransaction_AndNoneIsSent()
    {
        var disableSentry = Environment.GetEnvironmentVariable("DISABLE_SENTRY");
        Environment.SetEnvironmentVariable("DISABLE_SENTRY", null);
        var transport = new RecordingSentryTransport();
        using var host = new HostBuilder()
            .ConfigureWebHost(web => web
                .UseKestrel()
                .UseUrls("http://127.0.0.1:0")
                .UseSentry(options =>
                {
                    SentryHostSetup.Configure(options, null);
                    options.Dsn = RecordingSentryTransport.HostDsn;
                    options.Transport = transport;
                    options.AutoSessionTracking = false;
                })
                .ConfigureServices(services => services.AddRouting())
                .Configure(app =>
                {
                    app.UseSentryHost();
                    app.UseRouting();
                    app.UseEndpoints(endpoints => endpoints.MapGet("/routed",
                        context => context.Response.WriteAsync(SentrySdk.GetSpan() == null ? "no span" : "span")));
                }))
            .Build();
        try
        {
            await host.StartAsync();
            var address = host.Services.GetRequiredService<IServer>().Features
                .Get<IServerAddressesFeature>()!.Addresses.First();
            using var http = new HttpClient { BaseAddress = new Uri(address) };
            using var request = new HttpRequestMessage(HttpMethod.Get, "/routed");
            request.Headers.Add("sentry-trace", TraceId + "-b72fa28504b07285-1");

            using var response = await http.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();
            await SentrySdk.FlushAsync(TimeSpan.FromSeconds(5));

            Assert.Multiple(() =>
            {
                Assert.That(body, Is.EqualTo("no span"), "the SDK's tracing middleware must not be registered");
                Assert.That(transport.Transactions, Is.Empty);
            });
        }
        finally
        {
            try
            {
                await host.StopAsync();
            }
            finally
            {
                SentrySdk.Close();
                Environment.SetEnvironmentVariable("DISABLE_SENTRY", disableSentry);
            }
        }
    }
}
