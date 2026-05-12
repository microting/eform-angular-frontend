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
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Routing.Matching;

namespace eFormAPI.Web.Hosting;

/// <summary>
/// When multiple plugins call <c>services.AddGrpc()</c> (each plugin needs
/// its own call so its <c>MapGrpcService&lt;T&gt;</c> validation passes),
/// each registration adds a catch-all "Unimplemented service" endpoint
/// to the host's shared endpoint table. Three plugins => three duplicates =>
/// <c>AmbiguousMatchException</c> on any unmapped gRPC route.
///
/// This policy runs at endpoint selection time and invalidates all but
/// one duplicate so the request gets a clean gRPC <c>UNIMPLEMENTED</c>
/// status (status code 12) instead of HTTP 500.
///
/// The DisplayName string ("gRPC - Unimplemented service") is set by
/// <c>Grpc.AspNetCore.Server</c> in
/// <c>ServiceRouteBuilder.CreateUnimplementedEndpoint</c>.
/// </summary>
public sealed class DeduplicateUnimplementedGrpcMatcherPolicy : MatcherPolicy, IEndpointSelectorPolicy
{
    private const string UnimplementedMarker = "Unimplemented service";

    public override int Order => -100;

    public bool AppliesToEndpoints(IReadOnlyList<Endpoint> endpoints)
    {
        var seen = false;
        foreach (var endpoint in endpoints)
        {
            if (IsUnimplemented(endpoint))
            {
                if (seen) return true;
                seen = true;
            }
        }
        return false;
    }

    public Task ApplyAsync(HttpContext httpContext, CandidateSet candidates)
    {
        var keptOne = false;
        for (var i = 0; i < candidates.Count; i++)
        {
            if (!candidates.IsValidCandidate(i)) continue;
            var endpoint = candidates[i].Endpoint;
            if (!IsUnimplemented(endpoint)) continue;

            if (keptOne)
            {
                candidates.SetValidity(i, false);
            }
            else
            {
                keptOne = true;
            }
        }
        return Task.CompletedTask;
    }

    private static bool IsUnimplemented(Endpoint endpoint)
    {
        var displayName = endpoint?.DisplayName;
        return displayName != null && displayName.Contains(UnimplementedMarker, StringComparison.Ordinal);
    }
}
