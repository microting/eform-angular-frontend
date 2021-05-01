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
    using System.Collections.Generic;
    using System.Text;
    using System.Threading.Tasks;
    using Infrastructure.Models.Report;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Services.ItemsPlanningReportService;

    [Authorize]
    public class ItemsPlanningReportsController : Controller
    {
        private readonly IItemsPlanningReportService _reportService;

        public ItemsPlanningReportsController(IItemsPlanningReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpPost]
        [Route("api/items-planning-pn/reports")]
        public async Task<OperationDataResult<List<ReportEformModel>>> GenerateReport([FromBody]GenerateReportModel requestModel)
        {
            return await _reportService.GenerateReport(requestModel);
        }

        /// <summary>
        /// Download records export word
        /// </summary>
        /// <param name="requestModel">The request model.</param>
        [HttpGet]
        [Route("api/items-planning-pn/reports/word")]
        [ProducesResponseType(typeof(string), 400)]
        public async Task GenerateReportFile(GenerateReportModel requestModel)
        {
            var result = await _reportService.GenerateReportFile(requestModel);
            const int bufferSize = 4086;
            byte[] buffer = new byte[bufferSize];
            Response.OnStarting(async () =>
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
                    using (var wordStream = result.Model)
                    {
                        int bytesRead;
                        Response.ContentLength = wordStream.Length;
                        Response.ContentType =
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                        while ((bytesRead = wordStream.Read(buffer, 0, buffer.Length)) > 0 &&
                               !HttpContext.RequestAborted.IsCancellationRequested)
                        {
                            await Response.Body.WriteAsync(buffer, 0, bytesRead);
                            await Response.Body.FlushAsync();
                        }
                    }
                }
            });
        }
    }
}