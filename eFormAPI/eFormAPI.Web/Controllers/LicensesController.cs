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

namespace eFormAPI.Web.Controllers;

using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[Route("api/licenses")]
public class LicensesController(IHttpClientFactory httpClientFactory) : Controller
{
    private static readonly string[] AllowedDomains =
    {
        "raw.githubusercontent.com",
        "github.com",
        "www.npmjs.com",
        "registry.npmjs.org"
    };

    [HttpGet]
    [Route("fetch")]
    public async Task<IActionResult> FetchLicense([FromQuery] string url)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            return BadRequest("URL is required");
        }

        // Validate URL
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            return BadRequest("Invalid URL format");
        }

        // Check if URL uses HTTPS (security requirement)
        if (uri.Scheme != Uri.UriSchemeHttps)
        {
            return BadRequest("Only HTTPS URLs are allowed");
        }

        // Check if domain is in the allowed list
        // Must be exact match or a proper subdomain (e.g., foo.github.com)
        // Note: EndsWith with "." prefix ensures only real subdomains match, not "evil-github.com"
        var isAllowedDomain = AllowedDomains.Any(domain =>
            uri.Host.Equals(domain, StringComparison.OrdinalIgnoreCase) ||
            uri.Host.EndsWith("." + domain, StringComparison.OrdinalIgnoreCase));

        if (!isAllowedDomain)
        {
            return BadRequest("The requested URL is not from an allowed domain");
        }

        try
        {
            // Fetch the license text with timeout
            var httpClient = httpClientFactory.CreateClient();
            httpClient.Timeout = TimeSpan.FromSeconds(30);
            
            // Try multiple variations of license file names
            var urlsToTry = new[] { url, url + ".txt", url + ".md" };
            
            foreach (var urlToTry in urlsToTry)
            {
                // Re-validate each URL variation
                if (!Uri.TryCreate(urlToTry, UriKind.Absolute, out var uriToTry))
                {
                    continue;
                }
                
                // Ensure the modified URL is still in allowed domains
                var isStillAllowed = AllowedDomains.Any(domain =>
                    uriToTry.Host.Equals(domain, StringComparison.OrdinalIgnoreCase) ||
                    uriToTry.Host.EndsWith("." + domain, StringComparison.OrdinalIgnoreCase));
                
                if (!isStillAllowed)
                {
                    continue;
                }
                
                var response = await httpClient.GetAsync(urlToTry);
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return Content(content, "text/plain");
                }
                
                // If not found (404), try the next variation
                if (response.StatusCode != System.Net.HttpStatusCode.NotFound)
                {
                    // For non-404 errors, return immediately
                    return StatusCode((int)response.StatusCode, "Failed to fetch license");
                }
            }
            
            // All variations failed
            return StatusCode(404, "License file not found with any common extension (LICENSE, LICENSE.txt, LICENSE.md)");
        }
        catch (HttpRequestException)
        {
            return StatusCode(500, "Error fetching license from remote server");
        }
        catch (Exception)
        {
            return StatusCode(500, "An unexpected error occurred");
        }
    }
}
