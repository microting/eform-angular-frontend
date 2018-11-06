using System.Collections.Generic;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using Microting.eFormApi.BasePn.Infrastructure.Models.Tags;

namespace eFormAPI.Web.Abstractions.Eforms
{
    public interface ITagsService
    {
        OperationDataResult<List<CommonDictionaryModel>> GetAllTags();
        OperationResult DeleteTag(int tagId);
        OperationResult CreateTag(string tagName);
        OperationResult UpdateTemplateTags(UpdateTemplateTagsModel requestModel);
    }
}