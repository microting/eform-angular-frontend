using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure;
using eFormData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using Microting.eFormApi.BasePn.Infrastructure.Models.SearchableList;

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
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySearch.Read)]
        public OperationDataResult<EntityGroupList> GetEntityGroupList(
            [FromBody] AdvEntitySearchableGroupListRequestModel requestModel)
        {
            return _entitySearchService.GetEntityGroupList(requestModel);
        }

        [HttpGet]
        [Route("api/searchable-groups/get/{entityGroupUid}")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySearch.Read)]
        public OperationDataResult<EntityGroup> GetEntityGroup(string entityGroupUid)
        {
            return _entitySearchService.GetEntityGroup(entityGroupUid);
        }

        [HttpGet]
        [Route("api/searchable-groups/dict/{entityGroupUid}")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySearch.Read)]
        public OperationDataResult<List<CommonDictionaryTextModel>> GetEntityGroupDictionary(string entityGroupUid,
            string searchString)
        {
            return _entitySearchService.GetEntityGroupDictionary(entityGroupUid, searchString);
        }

        [HttpPost]
        [Route("api/searchable-groups/create")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySearch.Create)]
        public OperationResult CreateEntityGroup([FromBody] AdvEntitySearchableGroupEditModel editModel)
        {
            return _entitySearchService.CreateEntityGroup(editModel);
        }

        [HttpPost]
        [Route("api/searchable-groups/update")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySearch.Update)]
        public OperationResult UpdateEntityGroup([FromBody] AdvEntitySearchableGroupEditModel editModel)
        {
            return _entitySearchService.UpdateEntityGroup(editModel);
        }

        [HttpGet]
        [Route("api/searchable-groups/delete/{entityGroupUid}")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySearch.Delete)]
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