using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services;

public class TranslationService : ITranslationService
{
    public TranslationService()
    {

    }

    public async Task<OperationDataResult<string>> TranslateText(string sourceText, string sourceLanguageCode,
        string targetLanguageCode, string apiKey)
    {
        // E2E hook: a sentinel key returns deterministic fake text instead of
        // calling Google. Gated behind ALLOW_FAKE_TRANSLATE (set only in CI) so
        // it can NEVER fire in production, even if API_KEY were the sentinel.
        if (apiKey == "FAKE_TRANSLATE_E2E"
            && Environment.GetEnvironmentVariable("ALLOW_FAKE_TRANSLATE") == "true")
        {
            return new OperationDataResult<string>(true, "", $"[{targetLanguageCode}] {sourceText}");
        }

        var (apiUrl, form) = BuildTranslateRequest(sourceText, sourceLanguageCode, targetLanguageCode, apiKey);

        using HttpClient client = new HttpClient();
        HttpResponseMessage response = await client.PostAsync(apiUrl, new FormUrlEncodedContent(form));
        string responseBody = await response.Content.ReadAsStringAsync();

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