using System.Collections.Generic;
using eFormData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Models.Common;
using Microting.eFormApi.BasePn.Models.SelectableList;

namespace eFormAPI.Web.Controllers
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
        public OperationDataResult<EntityGroupList> GetEntityGroupList(
            [FromBody] AdvEntitySelectableGroupListRequestModel requestModel)
        {
            return _entitySelectService.GetEntityGroupList(requestModel);
        }

        [HttpPost]
        [Route("api/selectable-groups/create")]
        public OperationResult CreateEntityGroup([FromBody] AdvEntitySelectableGroupEditModel editModel)
        {
            return _entitySelectService.CreateEntityGroup(editModel);
        }

        [HttpPost]
        [Route("api/selectable-groups/update")]
        public OperationResult UpdateEntityGroup([FromBody] AdvEntitySelectableGroupEditModel editModel)
        {
            return _entitySelectService.UpdateEntityGroup(editModel);
        }

        [HttpGet]
        [Route("api/selectable-groups/get/{entityGroupUid}")]
        public OperationDataResult<EntityGroup> GetEntityGroup(string entityGroupUid)
        {
            return _entitySelectService.GetEntityGroup(entityGroupUid);
        }

        [HttpGet]
        [Route("api/selectable-groups/dict/{entityGroupUid}")]
        public OperationDataResult<List<CommonDictionaryTextModel>> GetEntityGroupDictionary(string entityGroupUid)
        {
            return _entitySelectService.GetEntityGroupDictionary(entityGroupUid);
        }

        [HttpGet]
        [Route("api/selectable-groups/delete/{entityGroupUid}")]
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