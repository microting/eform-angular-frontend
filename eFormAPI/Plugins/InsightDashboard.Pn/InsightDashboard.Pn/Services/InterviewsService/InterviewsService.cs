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
namespace InsightDashboard.Pn.Services.InterviewsService
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using Common.InsightDashboardLocalizationService;
    using DashboardService;
    using Infrastructure.Models.Export;
    using InterviewsExcelService;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public class InterviewsService : IInterviewsService
    {
        private readonly ILogger<InterviewsService> _logger;
        private readonly IInsightDashboardLocalizationService _localizationService;
        private readonly IInterviewsExcelService _interviewsExcelService;
        private readonly IDashboardService _dashboardService;

        public InterviewsService(
            ILogger<InterviewsService> logger,
            IInsightDashboardLocalizationService localizationService,
            IInterviewsExcelService interviewsExcelService,
            IDashboardService dashboardService)
        {
            _logger = logger;
            _localizationService = localizationService;
            _interviewsExcelService = interviewsExcelService;
            _dashboardService = dashboardService;
        }

        public async Task<OperationDataResult<FileStreamModel>> GenerateFile(
            DashboardItemExportRequestModel requestModel)
        {
            string excelFile = null;
            try
            {
                var reportDataResult = await _dashboardService
                    .GetSingleForView(
                        requestModel.DashboardId,
                        true,
                        requestModel.ItemId);

                if (!reportDataResult.Success)
                {
                    return new OperationDataResult<FileStreamModel>(false, reportDataResult.Message);
                }

                var dashboardItemView = reportDataResult.Model.Items.FirstOrDefault();

                if (dashboardItemView == null)
                {
                    return new OperationDataResult<FileStreamModel>(
                        false,
                        _localizationService.GetString("DashboardItemNotFound"));
                }

                var interviews = new List<InterviewsExportModel>();
                foreach (var textQuestionData in dashboardItemView.TextQuestionData)
                {
                    var interviewsExportModel = new InterviewsExportModel
                    {
                        Id = textQuestionData.Id,
                        Comments = textQuestionData.Commentary,
                        Tag = textQuestionData.LocationName,
                        Date = textQuestionData.Date,
                        Question = dashboardItemView.FirstQuestionName,
                        FilterQuestion = dashboardItemView.FilterQuestionName,
                        FilterAnswer = dashboardItemView.FilterAnswerName,
                    };
                    interviews.Add(interviewsExportModel);
                }

                excelFile = _interviewsExcelService.CopyTemplateForNewAccount("interviews-template");
                bool writeResult = _interviewsExcelService.WriteInterviewsExportToExcelFile(
                    interviews,
                    excelFile);

                if (!writeResult)
                {
                    throw new Exception($"Error while writing excel file {excelFile}");
                }

                var result = new FileStreamModel()
                {
                    FilePath = excelFile,
                    FileStream = new FileStream(excelFile, FileMode.Open),
                };

                return new OperationDataResult<FileStreamModel>(true, result);
            }
            catch (Exception e)
            {
                if (!string.IsNullOrEmpty(excelFile) && File.Exists(excelFile))
                {
                    File.Delete(excelFile);
                }

                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<FileStreamModel>(
                    false,
                    _localizationService.GetString("ErrorWhileExportingInterviews"));
            }
        }
    }
}