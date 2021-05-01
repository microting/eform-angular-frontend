namespace ItemsGroupPlanning.Pn.Controllers
{
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public class UploadedDataController : Controller
    {
        private readonly IUploadedDataService _uploadedDataService;

        public UploadedDataController(IUploadedDataService uploadedDataService)
        {
            _uploadedDataService = uploadedDataService;
        }

        [HttpGet]
        [Route("api/items-group-planning-pn/uploaded-data/get-all/{itemCaseId}")]
        public async Task<OperationDataResult<UploadedDatasModel>> Index(int itemCaseId)
        {
            return await _uploadedDataService.Index(itemCaseId);
        }

        [HttpGet]
        [Route("api/items-group-planning-pn/uploaded-data/{selectedListItemCaseId}")]
        public async Task<OperationDataResult<UploadedDataModel>> Read(int selectedListItemCaseId)
        {
            return await _uploadedDataService.Read(selectedListItemCaseId);
        }
        
        [HttpPut]
        [Route("api/items-group-planning-pn/uploaded-data")]
        public async Task<OperationResult> Update([FromBody] UploadedDataModel uploadedDataModel)
        {
            return await _uploadedDataService.Update(uploadedDataModel);
        }

        [HttpDelete]
        [Route("api/items-group-planning-pn/uploaded-data/{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _uploadedDataService.Delete(id);
        }

        [HttpPost]
        [Route("api/items-group-planning-pn/uploaded-data/pdf")]
        public async Task<IActionResult> UploadUploadedDataPdf(UploadedDataPDFUploadModel pdfUploadModel)
        {
            return await _uploadedDataService.UploadUploadedDataPdf(pdfUploadModel);
        }

        [HttpGet]
        [Route("api/items-group-planning-pn/uploaded-data/download-pdf/{fileName}")]
        public async Task<IActionResult> DownloadUploadedDataPdf(string fileName)
        {
            return await _uploadedDataService.DownloadUploadedDataPdf(fileName);
        }
    }
}