using System.Collections.Generic;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models.Common;
using eFormAPI.BasePn.Models.SelectableList;
using eFormData;

namespace eFormAPI.BasePn.Abstractions
{
    public interface IEntitySelectService
    {
        OperationDataResult<EntityGroupList> GetEntityGroupList(
            AdvEntitySelectableGroupListRequestModel requestModel);

        OperationResult CreateEntityGroup(AdvEntitySelectableGroupEditModel editModel);
        OperationResult UpdateEntityGroup(AdvEntitySelectableGroupEditModel editModel);
        OperationDataResult<EntityGroup> GetEntityGroup(string entityGroupUid);
        OperationDataResult<List<CommonDictionaryTextModel>> GetEntityGroupDictionary(string entityGroupUid);
        OperationResult SendSearchableGroup(string entityGroupUid);
        OperationResult DeleteEntityGroup(string entityGroupUid);
    }
}