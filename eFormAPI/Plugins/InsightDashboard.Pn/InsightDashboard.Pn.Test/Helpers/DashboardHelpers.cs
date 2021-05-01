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

namespace InsightDashboard.Pn.Test.Helpers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Infrastructure.Models.Dashboards;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.InsightDashboardBase.Infrastructure.Data.Entities;
    using Newtonsoft.Json;
    using NUnit.Framework;

    public static class DashboardHelpers
    {
        public static DashboardViewModel GetDashboardViewModel(string name)
        {
            var singleString = FileHelper.ReadFileFromResources(name);
            return JsonConvert.DeserializeObject<DashboardViewModel>(singleString);
        }

        public static Dictionary<DashboardViewModel, string> GetChartDataDashBoards()
        {
            var result = new Dictionary<DashboardViewModel, string>();

            var name = "DashboardHorizontalBar.data";
            result.Add(GetDashboardViewModel(name), name);
            name = "DashboardLine.data";
            result.Add(GetDashboardViewModel(name), name);
            name = "DashboardLineScore.data";
            result.Add(GetDashboardViewModel(name), name);
            name = "DashboardMultiChart.data";
            result.Add(GetDashboardViewModel(name), name);
            name = "DashboardStackedBar.data";
            result.Add(GetDashboardViewModel(name), name);
            name = "DashboardStackedGrouped.data";
            result.Add(GetDashboardViewModel(name), name);
            name = "DashboardTotal.data";
            result.Add(GetDashboardViewModel(name), name);
            name = "DashboardTotalN.data";
            result.Add(GetDashboardViewModel(name), name);
            name = "DashboardVerticalBar.data";
            result.Add(GetDashboardViewModel(name), name);

            return result;
        }

        public static DashboardItem GetDashboardItemFromModel(DashboardItemViewModel viewModel)
        {
            var rnd = new Random();

            var dashboardItem = new DashboardItem
            {
                Id = viewModel.Id,
                UpdatedByUserId = rnd.Next(1, 255),
                CreatedByUserId = rnd.Next(1, 255),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                WorkflowState = Constants.WorkflowStates.Created,
                Position = viewModel.Position,
                CompareEnabled = viewModel.CompareEnabled,
                CalculateAverage = viewModel.CalculateAverage,
                DashboardId = viewModel.Id,
                ChartType = viewModel.ChartType,
                Period = viewModel.Period,
                FilterAnswerId = viewModel.FilterAnswerId,
                FilterQuestionId = viewModel.FilterQuestionId,
                FirstQuestionId = viewModel.FirstQuestionId,
                CompareLocationsTags = viewModel.CompareLocationsTags
                    .Select(x=> new DashboardItemCompare()
                    {
                        LocationId = x.LocationId,
                        Position = x.Position,
                        TagId = x.TagId
                    })
                    .ToList(),
                IgnoredAnswerValues = viewModel.IgnoredAnswerValues
                    .Select(x => new DashboardItemIgnoredAnswer()
                    {
                        AnswerId = x.AnswerId,
                    })
                    .ToList(),
            };

            return dashboardItem;
        }
        public static DashboardItemViewModel CopyDashboardItem(DashboardItemViewModel viewModel)
        {
            var dashboardItem = new DashboardItemViewModel
            {
                Position = viewModel.Position,
                CompareEnabled = viewModel.CompareEnabled,
                CalculateAverage = viewModel.CalculateAverage,
                ChartType = viewModel.ChartType,
                Period = viewModel.Period,
                FilterAnswerId = viewModel.FilterAnswerId,
                FilterQuestionId = viewModel.FilterQuestionId,
                FirstQuestionId = viewModel.FirstQuestionId,
                FilterAnswerName = viewModel.FilterAnswerName,
                FilterQuestionName = viewModel.FilterQuestionName,
                Id = viewModel.Id,
                FirstQuestionName = viewModel.FirstQuestionName,
                CompareLocationsTags = viewModel.CompareLocationsTags,
                IgnoredAnswerValues = viewModel.IgnoredAnswerValues,
                FirstQuestionType = viewModel.FirstQuestionType,
            };

            return dashboardItem;
        }

        public static void CheckData(
            DashboardItemViewModel originalItem,
            DashboardItemViewModel processedItem,
            DashboardViewModel originalViewModel,
            string templateName)
        {
            var originalItemString = JsonConvert.SerializeObject(originalItem);
            var processedItemString = JsonConvert.SerializeObject(processedItem);

            // Build info
            var message = $"Check data for template: \"{templateName}\"\n" +
                          $"Dashboard id: {originalViewModel.Id}\n" +
                          $"Dashboard name: {originalViewModel.DashboardName}\n" +
                          "Dashboard item:\n" +
                          $"Id: {originalItem.Id}\n" +
                          $"Chart type: {originalItem.ChartType}\n" +
                          $"Calculate average: {originalItem.CalculateAverage}\n" +
                          $"Compare enabled: {originalItem.CompareEnabled}\n" +
                          $"Period: {originalItem.Period}\n" +
                          $"Position: {originalItem.Position}\n" +
                          $"First question: ({originalItem.FirstQuestionId}, {originalItem.FirstQuestionName})" +
                          "\n\n" +
                          $"Original item: \n{originalItemString}" +
                          "\n\n" +
                          $"Processed item: \n{processedItemString}" +
                          "\n\n" +
                          "Test error: \n";

            Assert.AreEqual(
                originalItem.Id,
                processedItem.Id,
                message);
            Assert.AreEqual(
                originalItem.CalculateAverage,
                processedItem.CalculateAverage,
                message);
            Assert.AreEqual(
                originalItem.ChartType,
                processedItem.ChartType,
                message);
            Assert.AreEqual(
                originalItem.CompareEnabled,
                processedItem.CompareEnabled,
                message);
            Assert.AreEqual(
                originalItem.Period,
                processedItem.Period,
                message);
            Assert.AreEqual(
                originalItem.Position,
                processedItem.Position,
                message);
            Assert.AreEqual(
                originalItem.Position,
                processedItem.Position,
                message);
            Assert.AreEqual(
                originalItem.ChartData.Single.Count,
                processedItem.ChartData.Single.Count,
                message);
            Assert.AreEqual(
                originalItem.ChartData.Multi.Count,
                processedItem.ChartData.Multi.Count,
                message);
            Assert.AreEqual(
                originalItem.ChartData.MultiStacked.Count,
                processedItem.ChartData.MultiStacked.Count,
                message);

            // Single data
            for (var index = 0; index < originalItem.ChartData.Single.Count; index++)
            {
                var dataOriginal = originalItem.ChartData.Single[index];
                var dataProcessed = processedItem.ChartData.Single[index];

                Assert.AreEqual(dataOriginal.Name, dataProcessed.Name, message);
                Assert.AreEqual(dataOriginal.Value, dataProcessed.Value, message);
            }

            // Multi data
            for (var index = 0; index < originalItem.ChartData.Multi.Count; index++)
            {
                var dataOriginal = originalItem.ChartData.Multi[index];
                var dataProcessed = processedItem.ChartData.Multi[index];

                Assert.AreEqual(dataOriginal.Name, dataProcessed.Name, message);

                for (var i = 0; i < dataOriginal.Series.Count; i++)
                {
                    var originalSeries = dataOriginal.Series[i];
                    var originalProcessed = dataProcessed.Series[i];

                    Assert.AreEqual(originalSeries.Name, originalProcessed.Name, message);
                    Assert.AreEqual(originalSeries.Value, originalProcessed.Value, message);
                }
            }

            // Multi stacked data
            for (var index = 0; index < originalItem.ChartData.MultiStacked.Count; index++)
            {
                var dataOriginal = originalItem.ChartData.MultiStacked[index];
                var dataProcessed = processedItem.ChartData.MultiStacked[index];

                Assert.AreEqual(dataOriginal.Id, dataProcessed.Id, message);
                Assert.AreEqual(dataOriginal.Name, dataProcessed.Name, message);

                for (var i = 0; i < dataOriginal.Series.Count; i++)
                {
                    var originalSeries = dataOriginal.Series[i];
                    var processedSeries = dataProcessed.Series[i];

                    Assert.AreEqual(originalSeries.Name, processedSeries.Name, message);

                    for (var y = 0; y < originalSeries.Series.Count; y++)
                    {
                        var originalSeriesSeries = originalSeries.Series[y];
                        var processedSeriesSeries = processedSeries.Series[y];

                        Assert.AreEqual(originalSeriesSeries.Name, processedSeriesSeries.Name, message);
                        Assert.AreEqual(originalSeriesSeries.Value, processedSeriesSeries.Value, message);
                    }
                }
            }

            // Raw chart data
            for (var x = 0; x < originalItem.ChartData.RawData.Count; x++)
            {
                var rawDataItemOriginal = originalItem.ChartData.RawData[x];
                var rawDataItemProcessed = processedItem.ChartData.RawData[x];

                // Check table header
                for (var i = 0; i < rawDataItemOriginal.RawHeaders.Count; i++)
                {
                    Assert.AreEqual(rawDataItemOriginal.RawHeaders[i], rawDataItemProcessed.RawHeaders[i], message);
                }

                for (var index = 0; index < rawDataItemOriginal.RawDataItems.Count; index++)
                {
                    var dataOriginal = rawDataItemOriginal.RawDataItems[index];
                    var dataProcessed = rawDataItemProcessed.RawDataItems[index];

                    Assert.AreEqual(dataOriginal.RawValueName, dataProcessed.RawValueName, message);
                    Assert.AreEqual(dataOriginal.RawDataValues.Count, dataProcessed.RawDataValues.Count, message);

                    // Check table data
                    for (var i = 0; i < dataOriginal.RawDataValues.Count; i++)
                    {
                        var originalSeries = dataOriginal.RawDataValues[i];
                        var processedSeries = dataProcessed.RawDataValues[i];

                        Assert.AreEqual(originalSeries.ValueName, processedSeries.ValueName, message);

                        // Values
                        for (var y = 0; y < originalSeries.Amounts.Length; y++)
                        {
                            var originalValue = originalSeries.Percents[y];
                            var processedValue = processedSeries.Percents[y];

                            Assert.AreEqual(originalValue, processedValue, message);
                        }

                        // Amounts
                        for (var y = 0; y < originalSeries.Amounts.Length; y++)
                        {
                            var originalAmount = originalSeries.Amounts[y];
                            var processedAmount = processedSeries.Amounts[y];

                            Assert.AreEqual(originalAmount, processedAmount, message);
                        }
                    }
                }
            }
        }
    }
}