using System.Collections.Generic;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Common;
using eFormAPI.Common.Models.Tags;

namespace eFormAPI.Core.Abstractions
{
    public interface ITagsService
    {
        OperationDataResult<List<CommonDictionaryModel>> GetAllTags();
        OperationResult DeleteTag(int tagId);
        OperationResult CreateTag(string tagName);
        OperationResult UpdateTemplateTags(UpdateTemplateTagsModel requestModel);
    }
}