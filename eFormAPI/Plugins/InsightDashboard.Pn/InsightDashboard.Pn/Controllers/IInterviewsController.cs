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
namespace InsightDashboard.Pn.Controllers
{
    using System.IO;
    using System.Text;
    using System.Threading.Tasks;
    using Infrastructure.Models.Export;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Services.InterviewsService;

    [Authorize]
    public class InterviewsController : Controller
    {
        private readonly IInterviewsService _interviewsService;

        public InterviewsController(IInterviewsService interviewsService)
        {
            _interviewsService = interviewsService;
        }

        /// <summary>
        /// Download interviews export excel
        /// </summary>
        /// <param name="requestModel"></param>
        /// <returns code="200">Return excel blob</returns>
        /// <returns code="400">Error message</returns>
        [HttpGet]
        [Route("api/insight-dashboard-pn/dashboard-items/export-interviews")]
        [ProducesResponseType(typeof(string), 400)]
        public async Task GenerateReportFile(DashboardItemExportRequestModel requestModel)
        {
            OperationDataResult<FileStreamModel> result = await _interviewsService.GenerateFile(requestModel);
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
