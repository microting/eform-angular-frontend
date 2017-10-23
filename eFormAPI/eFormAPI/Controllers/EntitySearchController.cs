using System;
using System.Linq;
using System.Web.Http;
using eFormAPI.Common.API;
using eFormAPI.Common.Models.SearchableList;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormData;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class EntitySearchController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpPost]
        [Route("api/searchable-groups")]
        public OperationDataResult<EntityGroupList> GetEntityGroupList(AdvEntityGroupListRequestModel requestModel)
        {         
            try
            {
                var core = _coreHelper.GetCore();
                var model = core.Advanced_EntityGroupAll(requestModel.Sort, requestModel.NameFilter, requestModel.PageIndex, requestModel.PageSize, "EntitySearch", requestModel.IsSortDsc, "not_removed");
                return new OperationDataResult<EntityGroupList>(true, model);
            }
            catch (Exception e)
            {
                return new OperationDataResult<EntityGroupList>(false, "Searchable list loading failed");
            }
        }

        [HttpPost]
        [Route("api/searchable-groups/create")]
        public OperationResult CreateEntityGroup(AdvEntityGroupEditModel editModel)
        {
            try
            {
                var core = _coreHelper.GetCore();

                var groupCreate = core.EntityGroupCreate("EntitySearch", editModel.Name);

                if (editModel.AdvEntityItemModels.Any())
                {
                    EntityGroup entityGroup = core.EntityGroupRead(groupCreate.EntityGroupMUId);

                    var nextItemUid = entityGroup.EntityGroupItemLst.Count;

                    foreach (var entityItem in editModel.AdvEntityItemModels)
                    {
                        entityGroup.EntityGroupItemLst.Add(new EntityItem(entityItem.Name,
                            entityItem.Description, nextItemUid.ToString(), "created"));
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
        public OperationResult UpdateEntityGroup(AdvEntityGroupEditModel editModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
              
                    EntityGroup entityGroup = core.EntityGroupRead(editModel.GroupUid);

                    entityGroup.EntityGroupItemLst = editModel.AdvEntityItemModels;
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

                EntityGroup entityGroup = core.EntityGroupRead(entityGroupUid);

                return new OperationDataResult<EntityGroup>(true, entityGroup);
            }
            catch (Exception exception)
            {
                return new OperationDataResult<EntityGroup>(false, "Error when obtaining searchable list");
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