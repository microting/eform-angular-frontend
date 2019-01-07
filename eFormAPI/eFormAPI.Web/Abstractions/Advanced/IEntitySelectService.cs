using System.Collections.Generic;
using eFormAPI.Web.Infrastructure.Models.SelectableList;
using eFormData;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

namespace eFormAPI.Web.Abstractions.Advanced
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