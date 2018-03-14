using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormAPI.Web.Infrastructure.Models.API;
using eFormAPI.Web.Infrastructure.Models.Common;
using eFormAPI.Web.Infrastructure.Models.SearchableList;
using eFormData;
using eFormShared;

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
                var core = _coreHelper.GetCore();
                var model = core.Advanced_EntityGroupAll(requestModel.Sort, requestModel.NameFilter,
                    requestModel.PageIndex, requestModel.PageSize, Constants.FieldTypes.EntitySearch,
                    requestModel.IsSortDsc,
                    Constants.WorkflowStates.NotRemoved);
                return new OperationDataResult<EntityGroupList>(true, model);
            }
            catch (Exception e)
            {
                return new OperationDataResult<EntityGroupList>(false, "Searchable list loading failed");
            }
        }

        [HttpPost]
        [Route("api/searchable-groups/create")]
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
                return new OperationResult(true, $"{groupCreate.EntityGroupMUId} created successfully");
            }
            catch (Exception exception)
            {
                return new OperationResult(false, "Searchable list creation failed");
            }
        }

        [HttpPost]
        [Route("api/searchable-groups/update")]
        public OperationResult UpdateEntityGroup(AdvEntitySearchableGroupEditModel editModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var entityGroup = core.EntityGroupRead(editModel.GroupUid);
                entityGroup.EntityGroupItemLst = editModel.AdvEntitySearchableItemModels;
                entityGroup.Name = editModel.Name;
                core.EntityGroupUpdate(entityGroup);
                return new OperationResult(true, $"{editModel.GroupUid} updated successfully");
            }
            catch (Exception exception)
            {
                return new OperationResult(false, "Searchable list creation failed");
            }
        }

        [HttpGet]
        [Route("api/searchable-groups/get/{entityGroupUid}")]
        public OperationDataResult<EntityGroup> GetEntityGroup(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();

                var entityGroup = core.EntityGroupRead(entityGroupUid);

                return new OperationDataResult<EntityGroup>(true, entityGroup);
            }
            catch (Exception exception)
            {
                return new OperationDataResult<EntityGroup>(false, "Error when obtaining searchable list");
            }
        }

        [HttpGet]
        [Route("api/searchable-groups/dict/{entityGroupUid}")]
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
            catch (Exception ex)
            {
                return new OperationDataResult<List<CommonDictionaryTextModel>>(false,
                    "Error when obtaining searchable list");
            }
        }

        [HttpGet]
        [Route("api/searchable-groups/delete/{entityGroupUid}")]
        public OperationResult DeleteEntityGroup(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();


                return core.EntityGroupDelete(entityGroupUid)
                    ? new OperationResult(true, $"{entityGroupUid} deleted successfully")
                    : new OperationResult(false, "Error when deleting searchable list");
            }
            catch (Exception exception)
            {
                return new OperationResult(false, "Error when deleting searchable list");
            }
        }


        [HttpPost]
        [Route("api/searchable-groups/send")]
        public OperationResult SendSearchableGroup(string entityGroupUid)
        {
            try
            {
                var core = _coreHelper.GetCore();


                return new OperationResult(true, $"deleted successfully");
            }
            catch (Exception exception)
            {
                return new OperationResult(false, "Error when deleting searchable list");
            }
        }
    }
}