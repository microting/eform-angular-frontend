using System.Collections.Generic;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Common;
using eFormAPI.Common.Models.SearchableList;
using eFormAPI.Core.Abstractions;
using eFormAPI.Core.Services;
using eFormData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class EntitySearchController : Controller
    {
        private readonly IEntitySearchService _entitySearchService;

        public EntitySearchController(IEntitySearchService entitySearchService)
        {
            _entitySearchService = entitySearchService;
        }

        [HttpPost]
        [Route("api/searchable-groups")]
        public OperationDataResult<EntityGroupList> GetEntityGroupList(
            AdvEntitySearchableGroupListRequestModel requestModel)
        {
            return _entitySearchService.GetEntityGroupList(requestModel);
        }

        [HttpPost]
        [Route("api/searchable-groups/create")]
        public OperationResult CreateEntityGroup(AdvEntitySearchableGroupEditModel editModel)
        {
            return _entitySearchService.CreateEntityGroup(editModel);
        }

        [HttpPost]
        [Route("api/searchable-groups/update")]
        public OperationResult UpdateEntityGroup(AdvEntitySearchableGroupEditModel editModel)
        {
            return _entitySearchService.UpdateEntityGroup(editModel);
        }

        [HttpGet]
        [Route("api/searchable-groups/get/{entityGroupUid}")]
        public OperationDataResult<EntityGroup> GetEntityGroup(string entityGroupUid)
        {
            return _entitySearchService.GetEntityGroup(entityGroupUid);
        }

        [HttpGet]
        [Route("api/searchable-groups/dict/{entityGroupUid}")]
        public OperationDataResult<List<CommonDictionaryTextModel>> GetEntityGroupDictionary(string entityGroupUid,
            string searchString)
        {
            return _entitySearchService.GetEntityGroupDictionary(entityGroupUid, searchString);
        }

        [HttpGet]
        [Route("api/searchable-groups/delete/{entityGroupUid}")]
        public OperationResult DeleteEntityGroup(string entityGroupUid)
        {
            return _entitySearchService.DeleteEntityGroup(entityGroupUid);
        }


        [HttpPost]
        [Route("api/searchable-groups/send")]
        public OperationResult SendSearchableGroup(string entityGroupUid)
        {
            return _entitySearchService.SendSearchableGroup(entityGroupUid);
        }
    }
}