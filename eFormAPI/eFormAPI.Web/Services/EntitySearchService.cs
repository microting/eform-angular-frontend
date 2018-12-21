using System;
using System.Collections.Generic;
using System.Linq;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Infrastructure.Models.SearchableList;
using eFormCore;
using eFormData;
using eFormShared;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

namespace eFormAPI.Web.Services
{
    public class EntitySearchService : IEntitySearchService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;

        public EntitySearchService(IEFormCoreService coreHelper, ILocalizationService localizationService)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
        }


        public OperationDataResult<EntityGroupList> GetEntityGroupList(
            AdvEntitySearchableGroupListRequestModel requestModel)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                EntityGroupList model = core.Advanced_EntityGroupAll(requestModel.Sort, requestModel.NameFilter,
                    requestModel.PageIndex, requestModel.PageSize, Constants.FieldTypes.EntitySearch,
                    requestModel.IsSortDsc,
                    Constants.WorkflowStates.NotRemoved);
                return new OperationDataResult<EntityGroupList>(true, model);
            }
            catch (Exception)
            {
                return new OperationDataResult<EntityGroupList>(false,
                    _localizationService.GetString("SearchableListLoadingFailed"));
            }
        }

        public OperationResult CreateEntityGroup(AdvEntitySearchableGroupEditModel editModel)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                EntityGroup groupCreate = core.EntityGroupCreate(Constants.FieldTypes.EntitySearch, editModel.Name);
                if (editModel.AdvEntitySearchableItemModels.Any())
                {
                    EntityGroup entityGroup = core.EntityGroupRead(groupCreate.MicrotingUUID);
                    int nextItemUid = entityGroup.EntityGroupItemLst.Count;
                    foreach (EntityItem entityItem in editModel.AdvEntitySearchableItemModels)
                    {
                        core.EntitySearchItemCreate(entityGroup.Id, entityItem.Name, entityItem.Description,
                            nextItemUid.ToString());

                        //entityGroup.EntityGroupItemLst.Add(new EntityItem(entityItem.Name,
                        //    entityItem.Description, nextItemUid.ToString(), Constants.WorkflowStates.Created));
                        nextItemUid++;
                    }

                    //core.EntityGroupUpdate(entityGroup);
                }

                return new OperationResult(true,
                    _localizationService.GetString("ParamCreatedSuccessfully", groupCreate.MicrotingUUID));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("SearchableListCreationFailed"));
            }
        }

        public OperationResult UpdateEntityGroup(AdvEntitySearchableGroupEditModel editModel)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                EntityGroup entityGroup = core.EntityGroupRead(editModel.GroupUid);

                int nextItemUid = entityGroup.EntityGroupItemLst.Count;
                List<int> currentIds = new List<int>();

                foreach (EntityItem entityItem in editModel.AdvEntitySearchableItemModels)
                {
                    if (string.IsNullOrEmpty(entityItem.MicrotingUUID))
                    {
                        EntityItem et = core.EntitySearchItemCreate(entityGroup.Id, entityItem.Name,
                            entityItem.Description, nextItemUid.ToString());
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

                foreach (EntityItem entityItem in entityGroup.EntityGroupItemLst)
                {
                    if (!currentIds.Contains(entityItem.Id))
                    {
                        core.EntityItemDelete(entityItem.Id);
                    }
                }

                return new OperationResult(true,
                    _localizationService.GetString("ParamUpdatedSuccessfully", editModel.GroupUid));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("SearchableListCreationFailed"));
            }
        }

        public OperationDataResult<EntityGroup> GetEntityGroup(string entityGroupUid)
        {
            try
            {
                Core core = _coreHelper.GetCore();

                EntityGroup entityGroup = core.EntityGroupRead(entityGroupUid);

                return new OperationDataResult<EntityGroup>(true, entityGroup);
            }
            catch (Exception)
            {
                return new OperationDataResult<EntityGroup>(false,
                    _localizationService.GetString("ErrorWhenObtainingSearchableList"));
            }
        }

        public OperationDataResult<List<CommonDictionaryTextModel>> GetEntityGroupDictionary(string entityGroupUid,
            string searchString)
        {
            try
            {
                Core core = _coreHelper.GetCore();

                EntityGroup entityGroup = core.EntityGroupRead(entityGroupUid, null, searchString);

                List<CommonDictionaryTextModel> mappedEntityGroupDict = new List<CommonDictionaryTextModel>();

                foreach (EntityItem entityGroupItem in entityGroup.EntityGroupItemLst)
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
                    _localizationService.GetString("ErrorWhenObtainingSearchableList"));
            }
        }

        public OperationResult DeleteEntityGroup(string entityGroupUid)
        {
            try
            {
                Core core = _coreHelper.GetCore();


                return core.EntityGroupDelete(entityGroupUid)
                    ? new OperationResult(true, _localizationService.GetString("ParamDeletedSuccessfully", entityGroupUid))
                    : new OperationResult(false, _localizationService.GetString("ErrorWhenDeletingSearchableList"));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("ErrorWhenDeletingSearchableList"));
            }
        }

        public OperationResult SendSearchableGroup(string entityGroupUid)
        {
            try
            {
                Core core = _coreHelper.GetCore();


                return new OperationResult(true, _localizationService.GetString("ParamDeletedSuccessfully", entityGroupUid));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("ErrorWhenDeletingSearchableList"));
            }
        }
    }
}