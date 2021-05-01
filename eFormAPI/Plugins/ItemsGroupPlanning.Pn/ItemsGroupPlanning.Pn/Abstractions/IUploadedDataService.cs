namespace ItemsGroupPlanning.Pn.Abstractions
{
    using System.Threading.Tasks;
    using Infrastructure.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public interface IUploadedDataService
    {
        Task<OperationDataResult<UploadedDatasModel>> Index(int itemCaseId);
        Task<OperationDataResult<UploadedDataModel>> Read(int selectedListItemCaseId);
        Task<OperationResult> Update(UploadedDataModel uploadedDataModel);
        Task<OperationResult> Delete(int id);
        Task<IActionResult> UploadUploadedDataPdf(UploadedDataPDFUploadModel pdfUploadModel);
        Task<IActionResult> DownloadUploadedDataPdf(string fileName);
    }
}