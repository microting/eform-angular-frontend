namespace ItemsGroupPlanning.Pn.Abstractions
{
    using System.Threading.Tasks;
    using Infrastructure.Models;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public interface IItemsListCaseService
    {
        Task<OperationDataResult<ItemsListCasePnModel>> GetSingleList(ItemListCasesPnRequestModel requestModel);

        Task<OperationDataResult<ItemListPnCaseResultListModel>> GetSingleListResults(
            ItemListCasesPnRequestModel requestModel);
        Task<OperationDataResult<FileStreamModel>> GenerateSingleListResults(
            ItemListCasesPnRequestModel requestModel);
        Task<OperationDataResult<ItemsListPnItemCaseModel>> GetSingleCase(int caseId);
        Task<string> DownloadEFormPdf(int caseId, string token, string fileType);

    }
}