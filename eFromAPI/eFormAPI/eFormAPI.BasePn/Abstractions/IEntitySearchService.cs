using System.Collections.Generic;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models.Common;
using eFormAPI.BasePn.Models.SearchableList;
using eFormData;

namespace eFormAPI.BasePn.Abstractions
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