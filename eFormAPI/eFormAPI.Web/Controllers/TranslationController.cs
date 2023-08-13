using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers;

//[Authorize]
public class TranslationController : Controller
{
    private readonly ITranslationService _translationService;
    private readonly string _apiKey;

    public TranslationController(ITranslationService translationService, IOptions<GoogleTranslateOptions> options)
    {
        _translationService = translationService;
        _apiKey = options.Value.ApiKey;
    }

    [HttpGet]
    [Route("api/get-translation")]
    public async Task<OperationDataResult<string>> TranslateText(string sourceText, string sourceLanguageCode, string targetLanguageCode)
    {
        return await _translationService.TranslateText(sourceText, sourceLanguageCode, targetLanguageCode, _apiKey);
    }

    [HttpGet]
    [Route("api/translation-possible")]
    public OperationDataResult<bool> TranslateTextPossible()
    {
        return new OperationDataResult<bool>(true, !string.IsNullOrEmpty(_apiKey));
    }

}