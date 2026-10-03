using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Abstractions.Translation;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services;

/// <summary>
/// Google Translate backed <see cref="ITranslationService"/>. The interface lives in
/// eFormApi.BasePn so plugins can translate server-side (#1384 in the
/// backendconfiguration plugin); the options, and so the API key, stay in the host.
/// Registered as a singleton: it holds only the key and a shared HttpClient.
/// </summary>
public class TranslationService(IOptions<GoogleTranslateOptions> options) : ITranslationService
{
    // One client for the process (a client per call exhausts sockets); the pooled
    // connections are recycled so a DNS change is picked up. The timeout bounds a save
    // that waits on a translation.
    private static readonly HttpClient Client =
        new(new SocketsHttpHandler { PooledConnectionLifetime = TimeSpan.FromMinutes(5) })
        {
            Timeout = TimeSpan.FromSeconds(10)
        };

    private readonly string _apiKey = options.Value.ApiKey;

    public bool IsConfigured => !string.IsNullOrEmpty(_apiKey);

    public async Task<OperationDataResult<string>> TranslateText(string sourceText, string sourceLanguageCode,
        string targetLanguageCode)
    {
        if (!IsConfigured)
        {
            return new OperationDataResult<string>(false, "Translate: no API key configured");
        }

        // E2E hook: a sentinel key returns deterministic fake text instead of
        // calling Google. Gated behind ALLOW_FAKE_TRANSLATE (set only in CI) so
        // it can NEVER fire in production, even if API_KEY were the sentinel.
        if (_apiKey == "FAKE_TRANSLATE_E2E"
            && Environment.GetEnvironmentVariable("ALLOW_FAKE_TRANSLATE") == "true")
        {
            return new OperationDataResult<string>(true, "", $"[{targetLanguageCode}] {sourceText}");
        }

        var (apiUrl, form) = BuildTranslateRequest(sourceText, sourceLanguageCode, targetLanguageCode, _apiKey);

        // The interface promises an unsuccessful result instead of an exception, so a
        // network failure or the timeout never fails the caller's save.
        try
        {
            using var response = await Client.PostAsync(apiUrl, new FormUrlEncodedContent(form));
            var responseBody = await response.Content.ReadAsStringAsync();
            return ToResult(response, responseBody);
        }
        catch (Exception e) when (e is HttpRequestException or TaskCanceledException or JsonException)
        {
            Console.WriteLine($"Translate error: {e.Message}");
            return new OperationDataResult<string>(false, $"Translate failed: {e.Message}");
        }
    }

    private static OperationDataResult<string> ToResult(HttpResponseMessage response, string responseBody)
    {
        if (response.IsSuccessStatusCode)
        {
            var responseObject = JsonSerializer.Deserialize<TranslationResponse>(responseBody);
            var translated = responseObject?.data?.translations is { Length: > 0 }
                ? responseObject.data.translations[0].translatedText
                : null;
            if (translated != null)
            {
                return new OperationDataResult<string>(true, "", translated);
            }

            return new OperationDataResult<string>(false, $"Translate: unexpected response: {responseBody}");
        }

        Console.WriteLine($"Translate error: {response.ReasonPhrase}: {responseBody}");
        return new OperationDataResult<string>(false, $"Translate failed ({(int)response.StatusCode}): {responseBody}");
    }

    // Pure + testable: normalise locale codes to bare ISO (de-DE -> de; Google v2
    // rejects locale codes) and assemble the request. FormUrlEncodedContent will
    // URL-encode the values (a raw "q=Tank 4" body otherwise 400s).
    public static (string url, Dictionary<string, string> form) BuildTranslateRequest(
        string sourceText, string sourceLanguageCode, string targetLanguageCode, string apiKey)
    {
        static string Iso(string code) => (code ?? string.Empty).Split('-')[0];
        var url = "https://translation.googleapis.com/language/translate/v2?key=" + apiKey;
        var form = new Dictionary<string, string>
        {
            ["q"] = sourceText ?? string.Empty,
            ["source"] = Iso(sourceLanguageCode),
            ["target"] = Iso(targetLanguageCode),
            ["format"] = "text",
        };
        return (url, form);
    }
}
