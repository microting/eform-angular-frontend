namespace ItemsGroupPlanning.Pn.Controllers
{
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Models;
    using Infrastructure.Models.Report;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    [Authorize]
    public class ItemsPlanningReportsController : Controller
    {        
        private readonly IItemsPlanningReportService _reportService;

        public ItemsPlanningReportsController(IItemsPlanningReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet]
        [Route("api/items-group-planning-pn/reports")]
        public async Task<OperationDataResult<ReportModel>> GenerateReport(GenerateReportModel requestModel)
        {
            return await _reportService.GenerateReport(requestModel);
        }

        /// <summary>
        /// Download records export excel
        /// </summary>
        /// <param name="requestModel"></param>
        /// <returns code="200">Return excel blob</returns>
        /// <returns code="400">Error message</returns>
        [HttpGet]
        [Route("api/items-group-planning-pn/reports/excel")]
        [ProducesResponseType(typeof(string), 400)]
        public async Task GenerateReportFile(GenerateReportModel requestModel)
        {
            OperationDataResult<FileStreamModel> result = await _reportService.GenerateReportFile(requestModel);
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
        }
    }
}