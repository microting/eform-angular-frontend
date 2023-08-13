using System;
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
        //string apiKey = "YOUR_API_KEY";
        string apiUrl = "https://translation.googleapis.com/language/translate/v2?key=" + apiKey;

        using HttpClient client = new HttpClient();
        HttpResponseMessage response = await client.PostAsync(apiUrl,
            new StringContent($"q={sourceText}&source={sourceLanguageCode}&target={targetLanguageCode}",
                System.Text.Encoding.UTF8, "application/x-www-form-urlencoded"));

        if (response.IsSuccessStatusCode)
        {
            string responseBody = await response.Content.ReadAsStringAsync();
            var responseObject = JsonSerializer.Deserialize<TranslationResponse>(responseBody);

            Console.WriteLine($"Source: {sourceText}");
            Console.WriteLine($"Translation: {responseObject.data.translations[0].translatedText}");


            return new OperationDataResult<string>(true, "",responseObject.data.translations[0].translatedText);
        }
        else
        {
            Console.WriteLine($"Error: {response.ReasonPhrase}");
        }

        return new OperationDataResult<string>(false, "Error");
    }
}