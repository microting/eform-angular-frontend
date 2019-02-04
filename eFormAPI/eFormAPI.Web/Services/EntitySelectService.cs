using System;
using System.Collections.Generic;
using System.Linq;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Infrastructure.Models.SelectableList;
using eFormData;
using eFormShared;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;


namespace eFormAPI.Web.Services
{
    public class EntitySelectService : IEntitySelectService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;

        public EntitySelectService(ILocalizationService localizationService, IEFormCoreService coreHelper)
        {
            _localizationService = localizationService;
            _coreHelper = coreHelper;
        }


        public OperationDataResult<EntityGroupList> GetEntityGroupList(
            AdvEntitySelectableGroupListRequestModel requestModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var model = core.Advanced_EntityGroupAll(requestModel.Sort, requestModel.NameFilter,
                    requestModel.PageIndex, requestModel.PageSize, Constants.FieldTypes.EntitySelect,
                    requestModel.IsSortDsc,
                    Constants.WorkflowStates.NotRemoved);
                return new OperationDataResult<EntityGroupList>(true, model);
            }
            catch (Exception)
            {
                return new OperationDataResult<EntityGroupList>(false,
                    _localizationService.GetString("SelectableGroupLoadingFailed"));
            }
        }

        public OperationResult CreateEntityGroup(AdvEntitySelectableGroupEditModel editModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var groupCreate = core.EntityGroupCreate(Constants.FieldTypes.EntitySelect, editModel.Name);
                if (editModel.AdvEntitySelectableItemModels.Any())
                {
                    var entityGroup = core.EntityGroupRead(groupCreate.MicrotingUUID);
                    var nextItemUid = entityGroup.EntityGroupItemLst.Count;
                    foreach (var entityItem in editModel.AdvEntitySelectableItemModels)
                    {
                        core.EntitySelectItemCreate(entityGroup.Id, entityItem.Name, entityItem.DisplayIndex,
                            nextItemUid.ToString());
                        //entityGroup.EntityGroupItemLst.Add(new EntityItem(entityItem.Name,
                        //    entityItem.Description, nextItemUid.ToString(), Constants.WorkflowStates.Created));
                        nextItemUid++;
                    }

                    //core.EntityGroupUpdate(entityGroup);
                }

                return new OperationResult(true,
                    _localizationService.GetStringWithFormat("ParamCreatedSuccessfully", groupCreate.MicrotingUUID));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("SelectableListCreationFailed"));
            }
        }

        public OperationResult UpdateEntityGroup(AdvEntitySelectableGroupEditModel editModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var entityGroup = core.EntityGroupRead(editModel.GroupUid);

                if (editModel.AdvEntitySelectableItemModels.Any())
                {
                    var nextItemUid = entityGroup.EntityGroupItemLst.Count;
                    var currentIds = new List<int>();
                    foreach (var entityItem in editModel.AdvEntitySelectableItemModels)
                    {
                        if (string.IsNullOrEmpty(entityItem.MicrotingUUID))
                        {
                            var et = core.EntitySelectItemCreate(entityGroup.Id, entityItem.Name,
                                entityItem.DisplayIndex, nextItemUid.ToString());
                            currentIds.Add(et.Id);
                        }
                        else
                        {
                            core.EntityItemUpdate(entityItem.Id, entityItem.Name, entityItem.Description,
                                entityItem.EntityItemUId, entityItem.DisplayIndex);
                            currentIds.Add(entityItem.Id);
                        }

                        nextItemUid++;
                    }

                    foreach (var entityItem in entityGroup.EntityGroupItemLst)
                    {
                        if (!currentIds.Contains(entityItem.Id))
                        {
                            core.EntityItemDelete(entityItem.Id);
                        }
                    }
                }

                return new OperationResult(true,
                    _localizationService.GetStringWithFormat("ParamUpdatedSuccessfully", editModel.GroupUid));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("SelectableListCreationFailed"));
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
                    _localizationService.GetString("ErrorWhileObtainSelectableList"));
            }
        }

        public OperationDataResult<List<CommonDictionaryTextModel>> GetEntityGroupDictionary(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();

                var entityGroup = core.EntityGroupRead(entityGroupUid);

                var mappedEntityGroupDict = new List<CommonDictionaryTextModel>();

                foreach (var entityGroupItem in entityGroup.EntityGroupItemLst)
                {
                    mappedEntityGroupDict.Add(new CommonDictionaryTextModel()
                    {
                        Id = entityGroupItem.Id.ToString(),
                        Text = entityGroupItem.Name
                    });
                }

                return new OperationDataResult<List<CommonDictionaryTextModel>>(true, mappedEntityGroupDict);
            }
            catch (Exception)
            {
                return new OperationDataResult<List<CommonDictionaryTextModel>>(false,
                    _localizationService.GetString("ErrorWhileObtainSelectableList"));
            }
        }

        public OperationResult DeleteEntityGroup(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();


                return core.EntityGroupDelete(entityGroupUid)
                    ? new OperationResult(true, _localizationService.GetStringWithFormat("ParamDeletedSuccessfully", entityGroupUid))
                    : new OperationResult(false, _localizationService.GetString("ErrorWhileDeletingSelectableList"));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("ErrorWhileDeletingSelectableList"));
            }
        }


        public OperationResult SendSearchableGroup(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();


                return new OperationResult(true, _localizationService.GetStringWithFormat("ParamDeletedSuccessfully", entityGroupUid));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("ErrorWhileDeletingSelectableList"));
            }
        }
    }
}