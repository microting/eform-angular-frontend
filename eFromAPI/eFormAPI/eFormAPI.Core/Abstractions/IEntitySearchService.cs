using System.Collections.Generic;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Common;
using eFormAPI.Common.Models.SearchableList;
using eFormData;

namespace eFormAPI.Core.Abstractions
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