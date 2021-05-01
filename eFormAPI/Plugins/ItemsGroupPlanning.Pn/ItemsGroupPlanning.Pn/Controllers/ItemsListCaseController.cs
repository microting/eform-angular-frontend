namespace ItemsGroupPlanning.Pn.Controllers
{
    using System;
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Models;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    [Authorize]
    public class ItemsListCaseController : Controller
    {
        private readonly IItemsListCaseService _listService;

        public ItemsListCaseController(IItemsListCaseService listService)
        {
            _listService = listService;
        }


        [HttpGet]
        [Route("api/items-group-planning-pn/list-cases/")]
        public async Task<OperationDataResult<ItemsListCasePnModel>> GetSingleList(ItemListCasesPnRequestModel requestModel)
        {
            return await _listService.GetSingleList(requestModel);
        }

        [HttpGet]
        [Route("api/items-group-planning-pn/list-case-results")]
        public async Task<OperationDataResult<ItemListPnCaseResultListModel>> GetSingleListResults(ItemListCasesPnRequestModel requestModel)
        {
            return await _listService.GetSingleListResults(requestModel);
        }
        
        [HttpGet]
        [Route("api/items-group-planning-pn/list-case-results/excel")]
        [ProducesResponseType(typeof(string), 400)]
        public async Task GenerateSingleListResults(ItemListCasesPnRequestModel requestModel)
        {
            OperationDataResult<FileStreamModel> result = await _listService.GenerateSingleListResults(requestModel);
            const int bufferSize = 4086;
            byte[] buffer = new byte[bufferSize];
            Response.OnStarting(async () =>
            {
                try
                {
                    if (!result.Success)
                    {
                        Response.ContentLength = result.Message.Length;
                        Response.ContentType = "text/plain";
                        Response.StatusCode = 400;
                        byte[] bytes = Encoding.UTF8.GetBytes(result.Message);
                        await Response.Body.WriteAsync(bytes, 0, result.Message.Length);
                        await Response.Body.FlushAsync();
                    }
                    else
                    {
                        using (FileStream excelStream = result.Model.FileStream)
                        {
                            int bytesRead;
                            Response.ContentLength = excelStream.Length;
                            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                            while ((bytesRead = excelStream.Read(buffer, 0, buffer.Length)) > 0 &&
                                   !HttpContext.RequestAborted.IsCancellationRequested)
                            {
                                await Response.Body.WriteAsync(buffer, 0, bytesRead);
                                await Response.Body.FlushAsync();
                            }
                        }
                    
                    }
                }
                finally
                {
                    if (!string.IsNullOrEmpty(result?.Model?.FilePath)
                        && System.IO.File.Exists(result.Model.FilePath))
                    {
                        System.IO.File.Delete(result.Model.FilePath);
                    }
                }
            });
            
//            return await _listService.GenerateSingleListResults(requestModel);
        }
        

        [HttpGet]
        [Route("api/items-group-planning-pn/list-cases/{id}/{caseId}")]
        public async Task<OperationDataResult<ItemsListPnItemCaseModel>> GetSingleCase(int caseId)
        {
            return await _listService.GetSingleCase(caseId);
        }

        [HttpGet]
        [Route("api/items-group-planning-pn/list-case-file-report/{caseId}")]
        [AllowAnonymous]
        public async Task<IActionResult> ItemListCaseResult(int caseId, string token, string fileType)
        {
            try {
                string filePath = await _listService.DownloadEFormPdf(caseId, token, fileType);
                
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }
                var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                if (fileType == "pdf")
                {
                    return File(fileStream, "application/pdf", Path.GetFileName(filePath));
                }
                else
                {
                    return File(fileStream, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", Path.GetFileName(filePath));
                }
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                Log.LogException($"ItemsListCaseController.ItemListCaseResult: Got exception {ex.Message}");
                return BadRequest();
                
            }
        }
    }
}