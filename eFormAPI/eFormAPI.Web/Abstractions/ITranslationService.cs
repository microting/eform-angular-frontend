using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions;

public interface ITranslationService
{
    Task<OperationDataResult<string>> TranslateText(string sourceText, string sourceLanguageCode, string targetLanguageCode, string apiKey);

}