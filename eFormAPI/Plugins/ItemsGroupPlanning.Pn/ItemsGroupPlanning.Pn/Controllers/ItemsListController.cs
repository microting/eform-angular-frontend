namespace ItemsGroupPlanning.Pn.Controllers
{
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Models;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Const;

    [Authorize]
    public class ItemsListController : Controller
    {        
        private readonly IItemsListService _listService;

        public ItemsListController(IItemsListService listService)
        {
            _listService = listService;
        }

        [HttpGet]
        [Route("api/items-group-planning-pn/lists")]
        public async Task<OperationDataResult<ItemsListsModel>> Index(ItemsListRequestModel requestModel)
        {
            return await _listService.Index(requestModel);
        }

        [HttpPost]
        [Route("api/items-group-planning-pn/lists")]
        [Authorize(Policy = ItemsGroupPlanningClaims.CreateItemsLists)]
        public async Task<OperationResult> Create([FromBody] ItemsListPnModel createModel)
        {
            return await _listService.Create(createModel);
        }

        [HttpGet]
        [Route("api/items-group-planning-pn/lists/{id}")]
        public async Task<OperationDataResult<ItemsListPnModel>> Read(int id)
        {
            return await _listService.Read(id);
        }

        [HttpPut]
        [Route("api/items-group-planning-pn/lists")]
        public async Task<OperationResult> Update([FromBody] ItemsListPnModel updateModel)
        {
            return await _listService.Update(updateModel);
        }

        [HttpDelete]
        [Route("api/items-group-planning-pn/lists/{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _listService.Delete(id);
        }
        
        [HttpPost]
        [Route("api/items-group-planning-pn/lists/import")]
        public async Task<OperationResult> ImportUnit([FromBody] UnitImportModel unitImportModel)
        {
            return await _listService.ImportUnit(unitImportModel);
        }
    }
}