using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Models.Common;
using eFormAPI.Web.Infrastructure.Models.SearchableList;
using eFormData;
using eFormShared;
using eFormApi.BasePn.Infrastructure;
using eFormApi.BasePn.Infrastructure.Helpers;
using eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class EntitySearchController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpPost]
        [Route("api/searchable-groups")]
        public OperationDataResult<EntityGroupList> GetEntityGroupList(
            AdvEntitySearchableGroupListRequestModel requestModel)
        {
            try
            {
                eFormCore.Core core = _coreHelper.GetCore();
                EntityGroupList model = core.Advanced_EntityGroupAll(requestModel.Sort, requestModel.NameFilter,
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

        [HttpPost]
        [Route("api/searchable-groups/create")]
        public OperationResult CreateEntityGroup(AdvEntitySearchableGroupEditModel editModel)
        {
            try
            {
                eFormCore.Core core = _coreHelper.GetCore();
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
                    LocaleHelper.GetString("ParamCreatedSuccessfully", groupCreate.MicrotingUUID));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("SearchableListCreationFailed"));
            }
        }

        [HttpPost]
        [Route("api/searchable-groups/update")]
        public OperationResult UpdateEntityGroup(AdvEntitySearchableGroupEditModel editModel)
        {
            try
            {
                eFormCore.Core core = _coreHelper.GetCore();
                EntityGroup entityGroup = core.EntityGroupRead(editModel.GroupUid);

                int nextItemUid = entityGroup.EntityGroupItemLst.Count;
                List<int> currentIds = new List<int>();

                foreach (var entityItem in editModel.AdvEntitySearchableItemModels)
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
                    LocaleHelper.GetString("ParamUpdatedSuccessfully", editModel.GroupUid));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("SearchableListCreationFailed"));
            }
        }

        [HttpGet]
        [Route("api/searchable-groups/get/{entityGroupUid}")]
        public OperationDataResult<EntityGroup> GetEntityGroup(string entityGroupUid)
        {
            try
            {
                eFormCore.Core core = _coreHelper.GetCore();

                EntityGroup entityGroup = core.EntityGroupRead(entityGroupUid);

                return new OperationDataResult<EntityGroup>(true, entityGroup);
            }
            catch (Exception)
            {
                return new OperationDataResult<EntityGroup>(false,
                    LocaleHelper.GetString("ErrorWhenObtainingSearchableList"));
            }
        }

        [HttpGet]
        [Route("api/searchable-groups/dict/{entityGroupUid}")]
        public OperationDataResult<List<CommonDictionaryTextModel>> GetEntityGroupDictionary(string entityGroupUid,
            string searchString)
        {
            try
            {
                eFormCore.Core core = _coreHelper.GetCore();

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
                    LocaleHelper.GetString("ErrorWhenObtainingSearchableList"));
            }
        }

        [HttpGet]
        [Route("api/searchable-groups/delete/{entityGroupUid}")]
        public OperationResult DeleteEntityGroup(string entityGroupUid)
        {
            try
            {
                eFormCore.Core core = _coreHelper.GetCore();

                return core.EntityGroupDelete(entityGroupUid)
                    ? new OperationResult(true, LocaleHelper.GetString("ParamDeletedSuccessfully", entityGroupUid))
                    : new OperationResult(false, LocaleHelper.GetString("ErrorWhenDeletingSearchableList"));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhenDeletingSearchableList"));
            }
        }


        [HttpPost]
        [Route("api/searchable-groups/send")]
        public OperationResult SendSearchableGroup(string entityGroupUid)
        {
            try
            {
                eFormCore.Core core = _coreHelper.GetCore();

                return new OperationResult(true, LocaleHelper.GetString("ParamDeletedSuccessfully", entityGroupUid));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhenDeletingSearchableList"));
            }
        }
    }
}