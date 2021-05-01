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
namespace InsightDashboard.Pn.Services.WordService
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Drawing;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using System.Text;
    using System.Threading.Tasks;
    using Common.InsightDashboardLocalizationService;
    using DashboardService;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.InsightDashboardBase.Infrastructure.Enums;

    public class WordService : IWordService
    {
        private readonly IDashboardService _dashboardService;
        private readonly ILogger<DashboardService> _logger;
        private readonly IInsightDashboardLocalizationService _localizationService;

        public WordService(IDashboardService dashboardService, ILogger<DashboardService> logger, IInsightDashboardLocalizationService localizationService)
        {
            _dashboardService = dashboardService;
            _logger = logger;
            _localizationService = localizationService;
        }

        public async Task<OperationDataResult<Stream>> GenerateWordDashboard(int dashboardId, List<IFormFile> files)
        {
            try
            {
                var reportDataResult = await _dashboardService
                    .GetSingleForView(
                        dashboardId,
                        false);

                if (!reportDataResult.Success)
                {
                    return new OperationDataResult<Stream>(false, reportDataResult.Message);
                }

                var dashboardView = reportDataResult.Model;

                // Read html and template
                var resourceString = "InsightDashboard.Pn.Resources.Templates.WordExport.page.html";
                var assembly = Assembly.GetExecutingAssembly();
                var resourceStream = assembly.GetManifestResourceStream(resourceString);
                string html;
                using (var reader = new StreamReader(resourceStream ?? throw new InvalidOperationException($"{nameof(resourceStream)} is null")))
                {
                    html = reader.ReadToEnd();
                }

                resourceString = "InsightDashboard.Pn.Resources.Templates.WordExport.file.docx";
                var docxFileResourceStream = assembly.GetManifestResourceStream(resourceString);
                if (docxFileResourceStream == null)
                {
                    throw new InvalidOperationException($"{nameof(docxFileResourceStream)} is null");
                }
                var docxFileStream = new MemoryStream();
                await docxFileResourceStream.CopyToAsync(docxFileStream);

                var word = new WordProcessor(docxFileStream);

                // Add dashboard page
                html = html.Replace("{%DashboardName%}", dashboardView.DashboardName);
                html = html.Replace("{%DashboardNameString%}", _localizationService.GetString("Dashboard"));

                html = html.Replace("{%SurveyName%}", dashboardView.SurveyName);
                html = html.Replace("{%SurveyNameString%}", _localizationService.GetString("Survey"));

                html = html.Replace("{%LocationTag%}", dashboardView.LocationName ?? dashboardView.TagName);
                html = html.Replace("{%LocationTagString%}", _localizationService.GetString("LocationTag"));

                // Period
                if (dashboardView.AnswerDates.DateFrom != null)
                {
                    var periodFromTemplate = $@"<p><b>{_localizationService.GetString("PeriodFrom")}:</b> {dashboardView.AnswerDates.DateFrom:dd-MM-yyyy}</p>";
                    html = html.Replace("{%PeriodFrom%}", periodFromTemplate);
                }
                else
                {
                    html = html.Replace("{%PeriodFrom%}", string.Empty);
                }

                if (dashboardView.AnswerDates.Today)
                {
                    var periodToTemplate = $@"<p><b>{_localizationService.GetString("PeriodTo")}:</b> {DateTime.Now:dd-MM-yyyy}</p>";
                    html = html.Replace("{%PeriodTo%}", periodToTemplate);
                }
                else if (dashboardView.AnswerDates.DateFrom != null)
                {
                    var periodToTemplate = $@"<p><b>{_localizationService.GetString("PeriodTo")}:</b> {dashboardView.AnswerDates.DateTo:dd-MM-yyyy}</p>";
                    html = html.Replace("{%PeriodTo%}", periodToTemplate);
                }
                else
                {
                    html = html.Replace("{%PeriodTo%}", string.Empty);
                }

                var itemsHtml = "";
                foreach (var dashboardItem in dashboardView.Items)
                {
                    var isText = dashboardItem.FirstQuestionType == "text";

                    itemsHtml += @"<div style=""page-break-before:always"">";

                    itemsHtml += $@"<p><b>{_localizationService.GetString("Question")}:</b> {dashboardItem.FirstQuestionName}</p>";

                    if (!string.IsNullOrEmpty(dashboardItem.FilterQuestionName))
                    {
                        itemsHtml += $@"<p><b>{_localizationService.GetString("FilterQuestion")}:</b> {dashboardItem.FilterQuestionName}</p>";
                    }
                    if (!string.IsNullOrEmpty(dashboardItem.FilterAnswerName))
                    {
                        itemsHtml += $@"<p><b>{_localizationService.GetString("FilterAnswer")}</b> {dashboardItem.FilterAnswerName}</p>";
                    }

                    if (isText)
                    {
                        itemsHtml += @"<br/>";
                        itemsHtml += @"<table width=""100%"" border=""1"">";

                        // Table header
                        itemsHtml += @"<tr style=""background-color:#f5f5f5;font-weight:bold"">";
                        itemsHtml += $@"<td>{_localizationService.GetString("Date")}</td>";
                        itemsHtml += $@"<td>{_localizationService.GetString("Tag")}</td>";
                        itemsHtml += $@"<td>{_localizationService.GetString("Comments")}</td>";
                        itemsHtml += @"</tr>";

                        foreach (var dataModel in dashboardItem.TextQuestionData)
                        {
                            itemsHtml += @"<tr>";
                            itemsHtml += $@"<td>{dataModel.Date:dd-MM-yyyy}</td>";
                            itemsHtml += $@"<td>{dataModel.LocationName}</td>";
                            itemsHtml += $@"<td>{dataModel.Commentary}</td>";
                            itemsHtml += @"</tr>";
                        }
                        itemsHtml += @"</table>";
                    }
                    else
                    {
                        if (dashboardItem.IgnoredAnswerValues.Any())
                        {
                            var ignoredAnswerValuesString = string.Join(
                                ", ",
                                dashboardItem.IgnoredAnswerValues
                                    .Select(x => x.Name)
                                    .ToArray());

                            itemsHtml += $@"<p><b>{_localizationService.GetString("IgnoredValues")}:</b> {ignoredAnswerValuesString}</p>";
                        }

                        itemsHtml += $@"<p><img src=""data:image/png;base64,pngBase64String_{dashboardItem.Id}"" width=""650px"" alt=""Image"" /></p>";
                        var imageFile = files.FirstOrDefault(x => x.FileName == dashboardItem.Id.ToString());
                        if (imageFile == null)
                        {
                            throw new InvalidOperationException($"{nameof(imageFile)} is null");
                        }

                        using (var image = Image.FromStream(imageFile.OpenReadStream()))
                        {
                            using (var memoryStream = new MemoryStream())
                            {
                                image.Save(memoryStream, image.RawFormat);
                                var imageBytes = memoryStream.ToArray();

                                // Convert byte[] to Base64 String
                                var base64String = Convert.ToBase64String(imageBytes);
                                itemsHtml = itemsHtml.Replace($"pngBase64String_{dashboardItem.Id}", base64String);
                            }
                        }

                        // Tables
                        foreach (var rawDataItem in dashboardItem.ChartData.RawData)
                        {
                            itemsHtml += @"<table style=""background-color:#fff"" width=""100%"" border=""1"">";

                            // multiStacked data chart with inverted values
                            if (dashboardItem.ChartType == DashboardChartTypes.GroupedStackedBarChart)
                            {
                                // Table header
                                itemsHtml += @"<tr style=""font-weight:bold"">";
                                itemsHtml += @"<th></th>";
                                itemsHtml += @"<th></th>";

                                foreach (var rawHeader in rawDataItem.RawHeaders)
                                {
                                    itemsHtml += $@"<th>{rawHeader}</th>";
                                }

                                itemsHtml += @"</tr>";

                                var totalItemNumber = 0;
                                // Table elements
                                foreach (var dataModel in rawDataItem.RawDataItems)
                                {
                                    // Table percents and average
                                    for (var i = 0; i < dataModel.RawDataValues.Count; i++)
                                    {
                                        var dataValue = dataModel.RawDataValues[i];

                                        // add row counter
                                        totalItemNumber++;
                                        var isEven = totalItemNumber % 2 == 0;

                                        // open
                                        itemsHtml += @"<tr>";

                                        // add first table text (year/location)
                                        if (i == 0)
                                        {
                                            var rowCount = dataModel.RawDataValues.Count;
                                            itemsHtml +=
                                                $@"<td rowspan=""{rowCount}"" style=""background-color:#fff"">{dataModel.RawValueName}</td>";
                                        }

                                        // location or year name
                                        itemsHtml +=
                                            $@"<td {AddStyles(false, isEven)}>{dataValue.ValueName}</td>";

                                        // for percents
                                        for (var percentIndex = 0;
                                            percentIndex < dataValue.Percents.Length;
                                            percentIndex++)
                                        {
                                            var valuePercent = dataValue.Percents[percentIndex];

                                            if (percentIndex == dataValue.Percents.Length - 1)
                                            {
                                                itemsHtml += $@"<td {AddStyles(true, isEven)}>{valuePercent}%</td>";
                                            }
                                            else
                                            {
                                                itemsHtml += $@"<td {AddStyles(false, isEven)}>{valuePercent}%</td>";
                                            }
                                        }

                                        // for amounts
                                        for (var amountIndex = 0; amountIndex < dataValue.Amounts.Length; amountIndex++)
                                        {
                                            var amountPercent = dataValue.Amounts[amountIndex];

                                            if (amountIndex == dataValue.Amounts.Length - 1)
                                            {
                                                itemsHtml += $@"<td {AddStyles(true, isEven)}>{amountPercent}</td>";
                                            }
                                            else
                                            {
                                                itemsHtml += $@"<td {AddStyles(false, isEven)}>{amountPercent}</td>";
                                            }
                                        }

                                        // close
                                        itemsHtml += @"</tr>";
                                    }
                                }
                            }
                            else
                            {
                                // Other tables for single and multi data
                                for (int y = 0; y < rawDataItem.RawDataItems.Count; y++)
                                {
                                    var dataModel = rawDataItem.RawDataItems[y];
                                    // Table header
                                    itemsHtml += @"<tr style=""font-weight:bold"">";
                                    itemsHtml += $@"<td>{dataModel.RawValueName}</td>";

                                    foreach (var rawHeader in rawDataItem.RawHeaders)
                                    {
                                        itemsHtml += $@"<td>{rawHeader}</td>";
                                    }

                                    itemsHtml += @"</tr>";

                                    // Table percents and average
                                    for (var i = 0; i < dataModel.RawDataValues.Count; i++)
                                    {
                                        var dataValue = dataModel.RawDataValues[i];

                                        if (i == dataModel.RawDataValues.Count - 1)
                                        {
                                            itemsHtml += @"<tr style=""font-weight:bold"">";
                                        }
                                        else
                                        {
                                            itemsHtml += @"<tr>";
                                        }

                                        itemsHtml += $@"<td>{dataValue.ValueName}</td>";

                                        foreach (var valuePercent in dataValue.Percents)
                                        {
                                            if (dashboardItem.CalculateAverage)
                                            {
                                                itemsHtml += $@"<td>{valuePercent}</td>";
                                            }
                                            else
                                            {
                                                itemsHtml += $@"<td>{valuePercent}%</td>";
                                            }
                                        }

                                        itemsHtml += @"</tr>";
                                    }

                                    itemsHtml += @"<tr><td></td></tr>";

                                    // Table amounts
                                    for (var i = 0; i < dataModel.RawDataValues.Count; i++)
                                    {
                                        var dataValue = dataModel.RawDataValues[i];

                                        if (i == dataModel.RawDataValues.Count - 1)
                                        {
                                            itemsHtml += @"<tr style=""font-weight:bold"">";
                                        }
                                        else
                                        {
                                            itemsHtml += @"<tr>";
                                        }

                                        itemsHtml += $@"<td>{dataValue.ValueName}</td>";
                                        foreach (var valueAmount in dataValue.Amounts)
                                        {
                                            itemsHtml += $@"<td>{valueAmount}</td>";
                                        }

                                        itemsHtml += @"</tr>";
                                    }

                                    // Empty table row
                                    if (y < dashboardItem.ChartData.RawData.Count - 1)
                                    {
                                        itemsHtml += @"<tr style=""font-weight:bold; background-color:#fff"">";
                                        foreach (var unused in rawDataItem.RawHeaders)
                                        {
                                            itemsHtml += $@"<td></td>";
                                        }
                                        itemsHtml += @"</tr>";
                                    }
                                }
                            }
                            itemsHtml += @"</table>";
                        }
                    }

                    itemsHtml += @"<div/>";
                }

                html = html.Replace("{%ItemList%}", itemsHtml);

                word.AddHtml(html);
                word.Dispose();
                docxFileStream.Position = 0;
                return new OperationDataResult<Stream>(true, docxFileStream);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<Stream>(
                    false,
                    _localizationService.GetString("ErrorWhileCreatingWordFile"));
            }
        }


        private static string AddStyles(bool bold, bool grayBackground)
        {
            var sb = new StringBuilder();

            sb.Append(@"style=""");

            if (grayBackground)
            {
                sb.Append(@"background-color:#f5f5f5;");
            }

            if (bold)
            {
                sb.Append(@"font-weight:bold;");
            }


            sb.Append(@"""");

            if (bold || grayBackground)
            {
                return sb.ToString();
            }

            return string.Empty;
        }
    }
}
