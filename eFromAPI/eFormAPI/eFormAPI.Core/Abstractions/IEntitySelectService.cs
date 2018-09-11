using System.Collections.Generic;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Common;
using eFormAPI.Common.Models.SelectableList;
using eFormData;

namespace eFormAPI.Core.Abstractions
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