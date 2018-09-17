using System.Collections.Generic;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models.Common;
using eFormAPI.BasePn.Models.Tags;

namespace eFormAPI.BasePn.Abstractions
{
    public interface ITagsService
    {
        OperationDataResult<List<CommonDictionaryModel>> GetAllTags();
        OperationResult DeleteTag(int tagId);
        OperationResult CreateTag(string tagName);
        OperationResult UpdateTemplateTags(UpdateTemplateTagsModel requestModel);
    }
}