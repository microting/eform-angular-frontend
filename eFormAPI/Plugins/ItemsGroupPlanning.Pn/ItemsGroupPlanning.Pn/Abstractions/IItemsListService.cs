namespace ItemsGroupPlanning.Pn.Abstractions
{
    using System.Threading.Tasks;
    using Infrastructure.Models;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public interface IItemsListService
    {
        Task<OperationDataResult<ItemsListsModel>> Index(ItemsListRequestModel requestModel);
        Task<OperationResult> Create(ItemsListPnModel model);
        Task<OperationDataResult<ItemsListPnModel>> Read(int itemListId);
        Task<OperationResult> Update(ItemsListPnModel updateModel);
        Task<OperationResult> Delete(int id);
        Task<OperationResult> ImportUnit(UnitImportModel unitImportModel);

    }
}