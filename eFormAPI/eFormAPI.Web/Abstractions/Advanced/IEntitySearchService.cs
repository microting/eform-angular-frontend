using System.Collections.Generic;
using eFormAPI.Web.Infrastructure.Models.SearchableList;
using eFormData;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

namespace eFormAPI.Web.Abstractions.Advanced
{
    public interface IEntitySearchService
    {
        OperationDataResult<EntityGroupList> GetEntityGroupList(
            AdvEntitySearchableGroupListRequestModel requestModel);

        OperationDataResult<List<CommonDictionaryTextModel>> GetEntityGroupDictionary(string entityGroupUid,
            string searchString);

        OperationResult CreateEntityGroup(AdvEntitySearchableGroupEditModel editModel);
        OperationResult UpdateEntityGroup(AdvEntitySearchableGroupEditModel editModel);
        OperationDataResult<EntityGroup> GetEntityGroup(string entityGroupUid);
        OperationResult DeleteEntityGroup(string entityGroupUid);
        OperationResult SendSearchableGroup(string entityGroupUid);
    }
}