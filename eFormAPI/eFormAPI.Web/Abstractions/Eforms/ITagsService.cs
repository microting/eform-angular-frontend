using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.Tags;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using Microting.eFormApi.BasePn.Infrastructure.Models.Tags;

namespace eFormAPI.Web.Abstractions.Eforms
{
    public interface ITagsService
    {
        OperationDataResult<List<CommonDictionaryModel>> GetAllTags();
        Task<OperationResult> DeleteTag(int tagId);
        OperationResult CreateTag(string tagName);
        OperationResult UpdateTemplateTags(UpdateTemplateTagsModel requestModel);
        Task<OperationDataResult<SavedTagsModel>> GetSavedTags();
        Task<OperationResult> RemoveTagFromSaved(int tagId);
        Task<OperationResult> AddTagToSaved(SavedTagModel requestModel);
    }
}