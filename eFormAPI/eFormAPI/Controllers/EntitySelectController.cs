using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Models.Common;
using eFormAPI.Web.Infrastructure.Models.SelectableList;
using eFormData;
using eFormShared;
using eFormApi.BasePn.Infrastructure;
using eFormApi.BasePn.Infrastructure.Helpers;
using eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class EntitySelectController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpPost]
        [Route("api/selectable-groups")]
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
                return new OperationDataResult<EntityGroupList>(false, LocaleHelper.GetString("SelectableGroupLoadingFailed"));
            }
        }

        [HttpPost]
        [Route("api/selectable-groups/create")]
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
                        core.EntitySelectItemCreate(entityGroup.Id, entityItem.Name, entityItem.DisplayIndex, nextItemUid.ToString());
                        //entityGroup.EntityGroupItemLst.Add(new EntityItem(entityItem.Name,
                        //    entityItem.Description, nextItemUid.ToString(), Constants.WorkflowStates.Created));
                        nextItemUid++;
                    }
                    //core.EntityGroupUpdate(entityGroup);
                }
                return new OperationResult(true, LocaleHelper.GetString("ParamCreatedSuccessfully", groupCreate.MicrotingUUID));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("SelectableListCreationFailed"));
            }
        }

        [HttpPost]
        [Route("api/selectable-groups/update")]
        public OperationResult UpdateEntityGroup(AdvEntitySelectableGroupEditModel editModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var entityGroup = core.EntityGroupRead(editModel.GroupUid);

                if (editModel.AdvEntitySelectableItemModels.Any())
                {
                    var nextItemUid = entityGroup.EntityGroupItemLst.Count;
                    List<int> currentIds = new List<int>();
                    foreach (EntityItem entityItem in editModel.AdvEntitySelectableItemModels)
                    {
                        if (string.IsNullOrEmpty(entityItem.MicrotingUUID))
                        {
                            EntityItem et = core.EntitySelectItemCreate(entityGroup.Id, entityItem.Name, entityItem.DisplayIndex, nextItemUid.ToString());
                            currentIds.Add(et.Id);
                        }
                        else
                        {
                            core.EntityItemUpdate(entityItem.Id, entityItem.Name, entityItem.Description, entityItem.EntityItemUId, entityItem.DisplayIndex);
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
                }
                return new OperationResult(true, LocaleHelper.GetString("ParamUpdatedSuccessfully", editModel.GroupUid));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("SelectableListCreationFailed"));
            }
        }

        [HttpGet]
        [Route("api/selectable-groups/get/{entityGroupUid}")]
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
                return new OperationDataResult<EntityGroup>(false, LocaleHelper.GetString("ErrorWhileObtainSelectableList"));
            }
        }

        [HttpGet]
        [Route("api/selectable-groups/dict/{entityGroupUid}")]
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
                        Id = entityGroupItem.MicrotingUUID,
                        Text = entityGroupItem.Name
                    });
                }

                return new OperationDataResult<List<CommonDictionaryTextModel>>(true, mappedEntityGroupDict);
            }
            catch (Exception)
            {
                return new OperationDataResult<List<CommonDictionaryTextModel>>(false,
                    LocaleHelper.GetString("ErrorWhileObtainSelectableList"));
            }
        }

        [HttpGet]
        [Route("api/selectable-groups/delete/{entityGroupUid}")]
        public OperationResult DeleteEntityGroup(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();


                return core.EntityGroupDelete(entityGroupUid)
                    ? new OperationResult(true, LocaleHelper.GetString("ParamDeletedSuccessfully", entityGroupUid))
                    : new OperationResult(false, LocaleHelper.GetString("ErrorWhileDeletingSelectableList"));
            }
            catch (Exception )
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileDeletingSelectableList"));
            }
        }


        [HttpPost]
        [Route("api/selectable-groups/send")]
        public OperationResult SendSearchableGroup(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();


                return new OperationResult(true, LocaleHelper.GetString("ParamDeletedSuccessfully", entityGroupUid));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileDeletingSelectableList"));
            }
        }
    }
}