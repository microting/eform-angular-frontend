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

namespace eFormAPI.Web.Hosting.Security;

using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microting.EformAngularFrontendBase.Infrastructure.Const;
using Services.Cache.AuthCache;

public class ClaimsTransformer : IClaimsTransformation
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IAuthCacheService _authCacheService;

    public ClaimsTransformer(
        IHttpContextAccessor httpContextAccessor,
        IAuthCacheService authCacheService)
    {
        _httpContextAccessor = httpContextAccessor;
        _authCacheService = authCacheService;
    }

    public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        // create a copy
        var cp = principal.Clone();

        // get Identity
        var ci = (ClaimsIdentity) cp.Identity;

        var list = ci.Claims.Select(x => new {key = x.Type, value = x.Value}).ToList();

        var userIdClaim = list.FirstOrDefault(x => x.key == ClaimTypes.NameIdentifier);
        var timeClaim = list.FirstOrDefault(x => x.key == AuthConsts.ClaimLastUpdateKey);


        if (userIdClaim == null)
        {
            throw new Exception("user claim not found");
        }

        if (timeClaim == null)
        {
            throw new Exception("time claim not found");
        }

        var userId = int.Parse(userIdClaim.value);

        // try to get user info from memory storage
        var auth = _authCacheService.TryGetValue(userId);

        if (auth == null)
        {
            _httpContextAccessor.HttpContext.Response.Headers[AuthConsts.UpdateHeaderName] = AuthConsts.UpdateHeaderValue;
        }
        else
        {
            // check timestamp
            var timeValue = long.Parse(timeClaim.value);

            if (timeValue != auth.TimeStamp)
            {
                _httpContextAccessor.HttpContext.Response.Headers[AuthConsts.UpdateHeaderName] = AuthConsts.UpdateHeaderValue;
            }

            // Add claims
            foreach (var authClaim in auth.Claims)
            {
                ci.AddClaim(authClaim);
            }
        }

        return await Task.FromResult(cp);
    }
}