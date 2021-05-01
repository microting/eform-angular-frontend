/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

namespace ItemsPlanning.Pn.Controllers
{
    using System.Threading.Tasks;
    using Infrastructure.Models;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Services.UploadedDataService;

    public class UploadedDataController : Controller
    {
        private readonly IUploadedDataService _uploadedDataService;

        public UploadedDataController(IUploadedDataService uploadedDataService)
        {
            _uploadedDataService = uploadedDataService;
        }

        [HttpGet]
        [Route("api/items-planning-pn/uploaded-data/get-all/{itemCaseId}")]
        public async Task<OperationDataResult<UploadedDatasModel>> Index(int itemCaseId)
        {
            return await _uploadedDataService.Index(itemCaseId);
        }

        [HttpGet]
        [Route("api/items-planning-pn/uploaded-data/{selectedListItemCaseId}")]
        public async Task<OperationDataResult<UploadedDataModel>> Read(int selectedListItemCaseId)
        {
            return await _uploadedDataService.Read(selectedListItemCaseId);
        }

        [HttpPut]
        [Route("api/items-planning-pn/uploaded-data")]
        public async Task<OperationResult> Update([FromBody] UploadedDataModel uploadedDataModel)
        {
            return await _uploadedDataService.Update(uploadedDataModel);
        }

        [HttpDelete]
        [Route("api/items-planning-pn/uploaded-data/{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _uploadedDataService.Delete(id);
        }

        [HttpPost]
        [Route("api/items-planning-pn/uploaded-data/pdf")]
        public async Task<IActionResult> UploadUploadedDataPdf(UploadedDataPDFUploadModel pdfUploadModel)
        {
            return await _uploadedDataService.UploadUploadedDataPdf(pdfUploadModel);
        }

        [HttpGet]
        [Route("api/items-planning-pn/uploaded-data/download-pdf/{fileName}")]
        public async Task<IActionResult> DownloadUploadedDataPdf(string fileName)
        {
            return await _uploadedDataService.DownloadUploadedDataPdf(fileName);
        }
    }
}