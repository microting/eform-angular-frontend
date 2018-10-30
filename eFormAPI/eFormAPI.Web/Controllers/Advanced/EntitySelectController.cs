using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure;
using eFormData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using Microting.eFormApi.BasePn.Infrastructure.Models.SelectableList;

namespace eFormAPI.Web.Controllers.Advanced
{
    [Authorize]
    public class EntitySelectController : Controller
    {
        private readonly IEntitySelectService _entitySelectService;

        public EntitySelectController(IEntitySelectService entitySelectService)
        {
            _entitySelectService = entitySelectService;
        }

        [HttpPost]
        [Route("api/selectable-groups")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySelect.Read)]
        public OperationDataResult<EntityGroupList> GetEntityGroupList(
            [FromBody] AdvEntitySelectableGroupListRequestModel requestModel)
        {
            return _entitySelectService.GetEntityGroupList(requestModel);
        }

        [HttpPost]
        [Route("api/selectable-groups/create")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySelect.Create)]
        public OperationResult CreateEntityGroup([FromBody] AdvEntitySelectableGroupEditModel editModel)
        {
            return _entitySelectService.CreateEntityGroup(editModel);
        }

        [HttpPost]
        [Route("api/selectable-groups/update")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySelect.Update)]
        public OperationResult UpdateEntityGroup([FromBody] AdvEntitySelectableGroupEditModel editModel)
        {
            return _entitySelectService.UpdateEntityGroup(editModel);
        }

        [HttpGet]
        [Route("api/selectable-groups/get/{entityGroupUid}")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySelect.Read)]
        public OperationDataResult<EntityGroup> GetEntityGroup(string entityGroupUid)
        {
            return _entitySelectService.GetEntityGroup(entityGroupUid);
        }

        [HttpGet]
        [Route("api/selectable-groups/dict/{entityGroupUid}")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySelect.Read)]
        public OperationDataResult<List<CommonDictionaryTextModel>> GetEntityGroupDictionary(string entityGroupUid)
        {
            return _entitySelectService.GetEntityGroupDictionary(entityGroupUid);
        }

        [HttpGet]
        [Route("api/selectable-groups/delete/{entityGroupUid}")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySelect.Delete)]
        public OperationResult DeleteEntityGroup(string entityGroupUid)
        {
            return _entitySelectService.DeleteEntityGroup(entityGroupUid);
        }


        [HttpPost]
        [Route("api/selectable-groups/send")]
        public OperationResult SendSearchableGroup(string entityGroupUid)
        {
            return _entitySelectService.SendSearchableGroup(entityGroupUid);
        }
    }
}