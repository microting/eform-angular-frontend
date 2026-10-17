using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Abstractions.Translation;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers;

[Authorize]
public class TranslationController(ITranslationService translationService)
    : Controller
{
    [HttpGet]
    [Route("api/get-translation")]
    public async Task<OperationDataResult<string>> TranslateText(string sourceText, string sourceLanguageCode, string targetLanguageCode)
    {
        return await translationService.TranslateText(sourceText, sourceLanguageCode, targetLanguageCode);
    }

    [HttpGet]
    [Route("api/translation-possible")]
    public OperationDataResult<bool> TranslateTextPossible()
    {
        return new OperationDataResult<bool>(true, translationService.IsConfigured);
    }

}
