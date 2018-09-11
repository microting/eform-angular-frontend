using System;
using System.Collections.Generic;
using System.Linq;
using eFormAPI.Common.Infrastructure;
using eFormAPI.Common.Infrastructure.Helpers;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Common;
using eFormAPI.Common.Models.SearchableList;
using eFormAPI.Core.Abstractions;
using eFormData;
using eFormShared;

namespace eFormAPI.Core.Services
{
    public class EntitySearchService : IEntitySearchService
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        public OperationDataResult<EntityGroupList> GetEntityGroupList(
            AdvEntitySearchableGroupListRequestModel requestModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var model = core.Advanced_EntityGroupAll(requestModel.Sort, requestModel.NameFilter,
                    requestModel.PageIndex, requestModel.PageSize, Constants.FieldTypes.EntitySearch,
                    requestModel.IsSortDsc,
                    Constants.WorkflowStates.NotRemoved);
                return new OperationDataResult<EntityGroupList>(true, model);
            }
            catch (Exception)
            {
                return new OperationDataResult<EntityGroupList>(false,
                    LocaleHelper.GetString("SearchableListLoadingFailed"));
            }
        }

        public OperationResult CreateEntityGroup(AdvEntitySearchableGroupEditModel editModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var groupCreate = core.EntityGroupCreate(Constants.FieldTypes.EntitySearch, editModel.Name);
                if (editModel.AdvEntitySearchableItemModels.Any())
                {
                    var entityGroup = core.EntityGroupRead(groupCreate.EntityGroupMUId);
                    var nextItemUid = entityGroup.EntityGroupItemLst.Count;
                    foreach (var entityItem in editModel.AdvEntitySearchableItemModels)
                    {
                        entityGroup.EntityGroupItemLst.Add(new EntityItem(entityItem.Name,
                            entityItem.Description, nextItemUid.ToString(), Constants.WorkflowStates.Created));
                        nextItemUid++;
                    }

                    core.EntityGroupUpdate(entityGroup);
                }

                return new OperationResult(true,
                    LocaleHelper.GetString("ParamCreatedSuccessfully", groupCreate.EntityGroupMUId));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("SearchableListCreationFailed"));
            }
        }

        public OperationResult UpdateEntityGroup(AdvEntitySearchableGroupEditModel editModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var entityGroup = core.EntityGroupRead(editModel.GroupUid);
                entityGroup.EntityGroupItemLst = editModel.AdvEntitySearchableItemModels;
                entityGroup.Name = editModel.Name;
                core.EntityGroupUpdate(entityGroup);
                return new OperationResult(true,
                    LocaleHelper.GetString("ParamUpdatedSuccessfully", editModel.GroupUid));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("SearchableListCreationFailed"));
            }
        }

        public OperationDataResult<EntityGroup> GetEntityGroup(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();

                var entityGroup = core.EntityGroupRead(entityGroupUid);

                return new OperationDataResult<EntityGroup>(true, entityGroup);
            }
            catch (Exception)
            {
                return new OperationDataResult<EntityGroup>(false,
                    LocaleHelper.GetString("ErrorWhenObtainingSearchableList"));
            }
        }

        public OperationDataResult<List<CommonDictionaryTextModel>> GetEntityGroupDictionary(string entityGroupUid,
            string searchString)
        {
            try
            {
                var core = _coreHelper.GetCore();

                var entityGroup = core.EntityGroupRead(entityGroupUid, null, searchString);

                var mappedEntityGroupDict = new List<CommonDictionaryTextModel>();

                foreach (var entityGroupItem in entityGroup.EntityGroupItemLst)
                {
                    mappedEntityGroupDict.Add(new CommonDictionaryTextModel()
                    {
                        Id = entityGroupItem.MicrotingUId,
                        Text = entityGroupItem.Name
                    });
                }

                return new OperationDataResult<List<CommonDictionaryTextModel>>(true, mappedEntityGroupDict);
            }
            catch (Exception)
            {
                return new OperationDataResult<List<CommonDictionaryTextModel>>(false,
                    LocaleHelper.GetString("ErrorWhenObtainingSearchableList"));
            }
        }

        public OperationResult DeleteEntityGroup(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();
                
                return core.EntityGroupDelete(entityGroupUid)
                    ? new OperationResult(true, LocaleHelper.GetString("ParamDeletedSuccessfully", entityGroupUid))
                    : new OperationResult(false, LocaleHelper.GetString("ErrorWhenDeletingSearchableList"));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhenDeletingSearchableList"));
            }
        }

        public OperationResult SendSearchableGroup(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();


                return new OperationResult(true, LocaleHelper.GetString("ParamDeletedSuccessfully", entityGroupUid));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhenDeletingSearchableList"));
            }
        }
    }
}