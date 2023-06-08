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
namespace eFormAPI.Web.Services.Cache.AuthCache;

using System;
using Infrastructure.Models.Auth;
using Microsoft.Extensions.Caching.Memory;

public sealed class AuthCacheService : IAuthCacheService
{
    /// <summary>
    /// The cache expiration
    /// </summary>
    private const int CacheExpiration = 24; // Cache Sliding Expiration in hours

    /// <summary>
    /// The key string
    /// </summary>
    private const string KeyString = "Auth";

    /// <summary>
    /// The cache
    /// </summary>
    private readonly IMemoryCache _cache;

    /// <summary>
    /// Initializes a new instance of the <see cref="AuthCacheService" /> class.
    /// </summary>
    /// <param name="memoryCache">The memory cache.</param>
    public AuthCacheService(IMemoryCache memoryCache)
    {
        _cache = memoryCache;
    }

    public AuthItem TryGetValue(int userId)
    {
        var cacheKey = $"{KeyString}:{userId}";

        // Look for cache key.
        if (!_cache.TryGetValue(cacheKey, out AuthItem cacheEntry))
        {
            return null;
        }

        return cacheEntry;
    }

    public void Set(AuthItem authItem, int userId)
    {
        var cacheKey = $"{KeyString}:{userId}";

        // Set cache options.
        var cacheEntryOptions = new MemoryCacheEntryOptions()
            .SetSlidingExpiration(TimeSpan.FromHours(CacheExpiration));

        // Save data in cache.
        _cache.Set(cacheKey, authItem, cacheEntryOptions);
    }

    public void Remove(int userId)
    {
        _cache.Remove($"{KeyString}:{userId}");
    }
}