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

namespace InsightDashboard.Pn.Infrastructure.Helpers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Models.Dashboards;
    using Models.Dashboards.RawData;
    using Services.Common.InsightDashboardLocalizationService;

    public static class ChartRawDataHelpers
    {
        public static List<DashboardViewChartRawDataModel> ConvertMultiStackedData(
            List<DashboardViewChartDataMultiStackedModel> multiStackedData,
            List<DashboardViewChartDataMultiStackedModel> multiStackedRawData,
            bool isMulti)
        {
            var result = new List<DashboardViewChartRawDataModel>();
            var invertedDataItem = new DashboardViewChartRawDataModel();
            var dataItem = new DashboardViewChartRawDataModel();

            // Get element with max Option count
            var maxOptionObject = multiStackedData
                    .Select(location => location.Series.OrderByDescending(item => item.Series.Count)
                        .First())
                    .Select(x => x.Series)
                    .FirstOrDefault();

            if (maxOptionObject == null)
            {
                throw new Exception($"{nameof(maxOptionObject)} is null");
            }

            // Add percent headers
            var headers = new List<string>(maxOptionObject.Count);
            foreach (var dataMultiModel in maxOptionObject)
            {
                headers.Add(dataMultiModel.Name); // Option name
            }

            // Add total header
            headers.Add("%");

            // Add amount headers
            foreach (var dataMultiModel in maxOptionObject)
            {
                headers.Add(dataMultiModel.Name); // Option name
            }

            // Add total header
            headers.Add("n");

            invertedDataItem.RawHeaders = headers;
            dataItem.RawHeaders = headers;


            // Year
            // // Location
            // // // Option
            // // // // Value
            var invertedMultiStackedDataResult = new List<DashboardViewChartRawDataItemModel>();
            foreach (var dataMultiStackedModel in multiStackedRawData)
            {
                var chartRawDataModel = new DashboardViewChartRawDataItemModel
                {
                    RawValueName = dataMultiStackedModel.Name, // Year
                };

                // Rows
                if (dataMultiStackedModel.Series.Any())
                {
                    var rawDataList = new List<DashboardViewChartRawDataValuesModel>();

                    // column count + total column
                    var columnCount = maxOptionObject.Count + 1;
                    var lastColumnArrayIndex = columnCount - 1;

                    // Get row names
                    foreach (var multiModel in dataMultiStackedModel.Series)
                    {
                        var rawDataValuesModel = new DashboardViewChartRawDataValuesModel
                        {
                            ValueName = multiModel.Name, // location name
                            Percents = new decimal[columnCount],
                            Amounts = new decimal[columnCount],
                        };

                        rawDataList.Add(rawDataValuesModel);
                    }

                    // by location
                    for (var i = 0; i < dataMultiStackedModel.Series.Count; i++)
                    {
                        // location
                        var dataMultiModel = dataMultiStackedModel.Series[i];

                        // by Item
                        for (var y = 0; y < maxOptionObject.Count; y++)
                        {
                            var maxObjectSingleModel = maxOptionObject[y];

                            // TODO: FIX
                            var singleModel = dataMultiModel.Series
                                .FirstOrDefault(x => x.Name == maxObjectSingleModel.Name);

                            if (singleModel == null)
                            {
                                rawDataList[i].Percents[y] = 0;
                                rawDataList[i].Amounts[y] = 0;
                            }
                            else
                            {
                                rawDataList[i].Percents[y] = (decimal)singleModel.Value;
                                rawDataList[i].Amounts[y] = singleModel.DataCount;
                            }
                        }

                        // calculate total
                        rawDataList[i].Percents[lastColumnArrayIndex] = dataMultiModel.Series
                            .Where(x => x.Value != null)
                            .Sum(x => (decimal)x.Value);

                        if (isMulti)
                        {
                            rawDataList[i].Amounts[lastColumnArrayIndex] = dataMultiModel.AnswersCount;
                        }
                        else
                        {
                            rawDataList[i].Amounts[lastColumnArrayIndex] = dataMultiModel.Series
                                .Sum(x => x.DataCount);
                        }
                    }

                    chartRawDataModel.RawDataValues = rawDataList;
                }

                invertedMultiStackedDataResult.Add(chartRawDataModel);
            }

            // Location
            // // Year name
            // // // Option
            // // // // Value
            var multiStackedDataResult = new List<DashboardViewChartRawDataItemModel>();
            foreach (var dataMultiStackedModel in multiStackedData)
            {
                var chartRawDataModel = new DashboardViewChartRawDataItemModel
                {
                    RawValueName = dataMultiStackedModel.Name, // Location
                };

                // Rows
                if (dataMultiStackedModel.Series.Any())
                {
                    var rawDataList = new List<DashboardViewChartRawDataValuesModel>();

                    // Get element with max rows (years)
                    var maxObject = dataMultiStackedModel.Series
                        .OrderByDescending(item => item.Series.Count)
                        .First();

                    // column count + total column
                    var columnCount = maxObject.Series.Count + 1;
                    var lastColumnArrayIndex = columnCount - 1;

                    // Get row names
                    foreach (var multiModel in dataMultiStackedModel.Series)
                    {
                        var rawDataValuesModel = new DashboardViewChartRawDataValuesModel
                        {
                            ValueName = multiModel.Name, // year name
                            Percents = new decimal[columnCount],
                            Amounts = new decimal[columnCount],
                        };

                        rawDataList.Add(rawDataValuesModel);
                    }

                    // by year
                    for (var i = 0; i < dataMultiStackedModel.Series.Count; i++)
                    {
                        // year
                        var dataMultiModel = dataMultiStackedModel.Series[i];

                        // by Item
                        for (var y = 0; y < maxOptionObject.Count; y++)
                        {
                            var maxObjectSingleModel = maxOptionObject[y];

                            // TODO: FIX
                            var singleModel = dataMultiModel.Series
                                .FirstOrDefault(x => x.Name == maxObjectSingleModel.Name);

                            if (singleModel == null)
                            {
                                rawDataList[i].Percents[y] = 0;
                                rawDataList[i].Amounts[y] = 0;
                            }
                            else
                            {
                                rawDataList[i].Percents[y] = (decimal)singleModel.Value;
                                rawDataList[i].Amounts[y] = singleModel.DataCount;
                            }
                        }

                        // calculate total
                        rawDataList[i].Percents[lastColumnArrayIndex] = dataMultiModel.Series
                            .Where(x => x.Value != null)
                            .Sum(x => (decimal)x.Value);

                        if (isMulti)
                        {
                            rawDataList[i].Amounts[lastColumnArrayIndex] = dataMultiModel.AnswersCount;
                        }
                        else
                        {
                            rawDataList[i].Amounts[lastColumnArrayIndex] = dataMultiModel.Series
                                .Sum(x => x.DataCount);
                        }
                    }

                    chartRawDataModel.RawDataValues = rawDataList;
                }

                multiStackedDataResult.Add(chartRawDataModel);
            }

            invertedDataItem.RawDataItems = invertedMultiStackedDataResult;
            dataItem.RawDataItems = multiStackedDataResult;

            result.Add(invertedDataItem);
            result.Add(dataItem);
            return result;
        }


        public static List<DashboardViewChartRawDataModel> ConvertMultiData(
            IInsightDashboardLocalizationService localizationService,
            List<DashboardViewChartDataMultiModel> multiData,
            bool isLineData,
            bool isMulti)
        {
            var result = new List<DashboardViewChartRawDataModel>();
            var data = new DashboardViewChartRawDataModel();

            if (multiData.Count == 0)
            {
                return result;
            }

            var chartRawDataModel = new DashboardViewChartRawDataItemModel
            {
                RawValueName = string.Empty, // Empty location
            };

            // If it's data for line chart - it should be inverted
            if (isLineData)
            {
                // Get element with max columns
                var maxColumnsObject = multiData
                    .OrderByDescending(item => item.Series.Count)
                    .First();

                // Headers
                foreach (var dataSingleModel in maxColumnsObject.Series)
                {
                    data.RawHeaders.Add(dataSingleModel.Name); // Year name
                }

                // Rows
                var rawDataList = new List<DashboardViewChartRawDataValuesModel>();

                // Get row names
                foreach (var multiModel in multiData)
                {
                    var rawDataValuesModel = new DashboardViewChartRawDataValuesModel
                    {
                        ValueName = multiModel.Name,
                        Percents = new decimal[maxColumnsObject.Series.Count],
                        Amounts = new decimal[maxColumnsObject.Series.Count],
                    };

                    rawDataList.Add(rawDataValuesModel);
                }

                // Add total row
                var totalRow = new DashboardViewChartRawDataValuesModel
                {
                    ValueName = localizationService.GetString("Total"),
                    Percents = new decimal[maxColumnsObject.Series.Count],
                    Amounts = new decimal[maxColumnsObject.Series.Count],
                };

                rawDataList.Add(totalRow);

                // by Item
                for (var i = 0; i < multiData.Count; i++)
                {
                    var dataMultiModel = multiData[i];

                    // by week
                    for (var y = 0; y < dataMultiModel.Series.Count; y++)
                    {
                        var dataSingleModel = dataMultiModel.Series[y];

                        rawDataList[i].Amounts[y] = dataSingleModel.DataCount;
                        rawDataList[i].Percents[y] = (decimal) dataSingleModel.Value;
                    }
                }


                // calculate total
                var lastRow = multiData.Count;
                for (var i = 0; i < maxColumnsObject.Series.Count; i++)
                {
                    decimal totalValue = 0;
                    decimal totalAmounts = 0;
                    foreach (var rowData in rawDataList)
                    {
                        totalValue += rowData.Percents[i];
                        totalAmounts += rowData.Amounts[i];
                    }

                    // find total
                    if (isMulti)
                    {
                        foreach (var dataMultiModel in multiData)
                        {
                            var seriesItem = dataMultiModel.Series[i];

                            if (seriesItem.AnswersDataCount > 0)
                            {
                                totalAmounts = seriesItem.AnswersDataCount;
                                break;
                            }
                        }
                    }
                    rawDataList[lastRow].Percents[i] = totalValue;
                    rawDataList[lastRow].Amounts[i] = totalAmounts;
                }

                chartRawDataModel.RawDataValues = rawDataList;
            }
            else
            {
                // Headers
                foreach (var multiModel in multiData)
                {
                    data.RawHeaders.Add(multiModel.Name); // Year name
                }

                // Rows
                var rawDataList = new List<DashboardViewChartRawDataValuesModel>();

                // Get element with max rows
                var maxObject = multiData
                    .OrderByDescending(item => item.Series.Count)
                    .First();

                // Get row names
                foreach (var singleModel in maxObject.Series)
                {
                    var rawDataValuesModel = new DashboardViewChartRawDataValuesModel
                    {
                        ValueName = singleModel.Name,
                        Percents = new decimal[multiData.Count],
                        Amounts = new decimal[multiData.Count],
                    };

                    rawDataList.Add(rawDataValuesModel);
                }

                // Add total row
                var totalRow = new DashboardViewChartRawDataValuesModel
                {
                    ValueName = localizationService.GetString("Total"),
                    Percents = new decimal[multiData.Count],
                    Amounts = new decimal[multiData.Count],
                };

                rawDataList.Add(totalRow);

                // by week
                for (var i = 0; i < multiData.Count; i++)
                {
                    var dataMultiModel = multiData[i];

                    // by Item
                    for (var y = 0; y < maxObject.Series.Count; y++)
                    {
                        var maxObjectSingleModel = maxObject.Series[y];

                        // TODO: FIX
                        var singleModel = dataMultiModel.Series
                            .FirstOrDefault(x => x.Name == maxObjectSingleModel.Name);

                        if (singleModel == null)
                        {
                            rawDataList[y].Percents[i] = 0;
                            rawDataList[y].Amounts[i] = 0;
                        }
                        else
                        {
                            rawDataList[y].Percents[i] = (decimal)singleModel.Value;
                            rawDataList[y].Amounts[i] = singleModel.DataCount;
                        }
                    }

                    // calculate total
                    var lastRow = maxObject.Series.Count;

                    rawDataList[lastRow].Percents[i] = dataMultiModel.Series
                        .Where(x => x.Value != null)
                        .Sum(x => (decimal) x.Value);

                    if (isMulti)
                    {
                        rawDataList[lastRow].Amounts[i] = dataMultiModel.AnswersCount;
                    }
                    else
                    {
                        rawDataList[lastRow].Amounts[i] = dataMultiModel.Series
                            .Sum(x => x.DataCount);
                    }
                }

                chartRawDataModel.RawDataValues = rawDataList;
            }

            data.RawDataItems.Add(chartRawDataModel);
            result.Add(data);
            return result;
        }

        public static List<DashboardViewChartRawDataModel> ConvertSingleData(
            IInsightDashboardLocalizationService localizationService,
            List<DashboardViewChartDataSingleModel> singleData,
            bool isMulti,
            int answersCount)
        {
            const int columnsCount = 1;
            var result = new List<DashboardViewChartRawDataModel>();
            var data = new DashboardViewChartRawDataModel();
            var chartRawDataModel = new DashboardViewChartRawDataItemModel
            {
                RawValueName = string.Empty, // Empty location
            };

            // Headers
            data.RawHeaders.Add(
                localizationService.GetString("TotalPeriod"));

            // Rows
            var rawDataList = new List<DashboardViewChartRawDataValuesModel>();

            // Get row names
            foreach (var singleModel in singleData)
            {
                var rawDataValuesModel = new DashboardViewChartRawDataValuesModel
                {
                    ValueName = singleModel.Name,
                    Percents = new decimal[columnsCount],
                    Amounts = new decimal[columnsCount],
                };

                rawDataList.Add(rawDataValuesModel);
            }

            var totalRow = new DashboardViewChartRawDataValuesModel
            {
                ValueName = localizationService.GetString("Total"),
                Percents = new decimal[columnsCount],
                Amounts = new decimal[columnsCount],
            };

            rawDataList.Add(totalRow);

            // by Item
            if (isMulti)
            {
                var percentageList = new List<decimal>();
                for (var y = 0; y < singleData.Count; y++)
                {
                    var dataSingleModel = singleData[y];
                    decimal percentage = Math.Round((decimal)dataSingleModel.DataCount / (decimal)answersCount * 100m, 0, MidpointRounding.AwayFromZero);
                    percentageList.Add(percentage);
                    rawDataList[y].Percents[0] = percentage;
                    rawDataList[y].Amounts[0] = dataSingleModel.DataCount;
                }
                // calculate total
                var lastRow = singleData.Count;

                rawDataList[lastRow].Percents[0] = percentageList.Sum(x => x);
                rawDataList[lastRow].Amounts[0] = answersCount;
            }
            else
            {
                for (var y = 0; y < singleData.Count; y++)
                {
                    var dataSingleModel = singleData[y];
                    rawDataList[y].Percents[0] = (decimal)dataSingleModel.Value;
                    rawDataList[y].Amounts[0] = dataSingleModel.DataCount;
                }
                // calculate total
                var lastRow = singleData.Count;

                rawDataList[lastRow].Percents[0] = singleData
                    .Where(x => x.Value != null)
                    .Sum(x => (decimal)x.Value);

                rawDataList[lastRow].Amounts[0] = singleData
                    .Sum(x => x.DataCount);
            }

            chartRawDataModel.RawDataValues = rawDataList;
            data.RawDataItems.Add(chartRawDataModel);
            result.Add(data);
            return result;
        }
    }
}