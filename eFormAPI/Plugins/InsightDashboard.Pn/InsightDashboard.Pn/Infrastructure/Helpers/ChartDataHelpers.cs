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
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eForm.Infrastructure.Data.Entities;
    using Microting.InsightDashboardBase.Infrastructure.Data;
    using Microting.InsightDashboardBase.Infrastructure.Data.Entities;
    using Microting.InsightDashboardBase.Infrastructure.Enums;
    using Models.Dashboards;
    using Services.Common.InsightDashboardLocalizationService;

    public static class ChartDataHelpers
    {
        // public for unit tests
        /// <summary>
        /// Not use it. public for unit tests
        /// </summary>
        [Obsolete(message: "public only for unit tests. use CalculateDashboard")]
        public static async Task CalculateDashboardItem(
            DashboardItemViewModel dashboardItemModel,
            MicrotingDbContext sdkContext,
            DashboardItem dashboardItem,
            IInsightDashboardLocalizationService localizationService,
            int? dashboardLocationId,
            int? dashboardLocationTagId,
            int dashboardSurveyId,
            DashboardEditAnswerDates answerDates)
        {
            // Chart data
            var singleData = false;
            var smileyLabels = new List<KeyValuePair<int, string>>()
            {
                new KeyValuePair<int, string>(100, "Meget glad"),
                new KeyValuePair<int, string>(75, "Glad"),
                new KeyValuePair<int, string>(50, "Neutral"),
                new KeyValuePair<int, string>(25, "Sur"),
                new KeyValuePair<int, string>(0, "Meget sur"),
                new KeyValuePair<int, string>(999, "Ved ikke")
            };
            switch (dashboardItem.ChartType)
            {
                case DashboardChartTypes.Line:
                    break;
                case DashboardChartTypes.Pie:
                    singleData = true;
                    break;
                case DashboardChartTypes.AdvancedPie:
                    singleData = true;
                    break;
                case DashboardChartTypes.PieGrid:
                    singleData = true;
                    break;
                case DashboardChartTypes.HorizontalBar:
                    singleData = true;
                    break;
                case DashboardChartTypes.HorizontalBarStacked:
                    break;
                case DashboardChartTypes.HorizontalBarGrouped:
                    break;
                case DashboardChartTypes.VerticalBar:
                    singleData = true;
                    break;
                case DashboardChartTypes.VerticalBarStacked:
                    break;
                case DashboardChartTypes.VerticalBarGrouped:
                    break;
                case DashboardChartTypes.GroupedStackedBarChart:
                    break;
                case 0:
                    if (dashboardItemModel.FirstQuestionType != "text")
                    {
                        throw new ArgumentOutOfRangeException();
                    }
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            bool isStackedData;
            if (
                dashboardItem.ChartType == DashboardChartTypes.GroupedStackedBarChart
                && dashboardItem.CompareEnabled
                && dashboardItem.CalculateAverage == false)
            {
                isStackedData = true;
            }
            else
            {
                isStackedData = false;
            }

            var isComparedData = false;
            if (dashboardItem.ChartType == DashboardChartTypes.GroupedStackedBarChart
                || dashboardItem.ChartType == DashboardChartTypes.Line)
            {
                if (dashboardItem.CompareEnabled)
                {
                    isComparedData = true;
                }
                else if (dashboardItem.ChartType == DashboardChartTypes.Line && dashboardItem.CalculateAverage)
                {
                    isComparedData = true;
                }
            }

            var answerQueryable = sdkContext.AnswerValues
                .AsNoTracking()
                .Include(x => x.Question)
                .Include(x => x.Option)
                .Include(x => x.Answer)
                .Include(x => x.Option.OptionTranslationses)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .AsQueryable();

            if (answerDates.Today)
            {
                var dateTimeNow = DateTime.Now;
                answerDates.DateTo = new DateTime(
                    dateTimeNow.Year,
                    dateTimeNow.Month,
                    dateTimeNow.Day,
                    23,
                    59,
                    59);
            }

            if (answerDates.DateFrom != null)
            {
                answerQueryable = answerQueryable
                    .Where(x => x.Answer.FinishedAt >= answerDates.DateFrom);
            }

            if (answerDates.DateTo != null)
            {
                answerQueryable = answerQueryable
                    .Where(x => x.Answer.FinishedAt <= answerDates.DateTo);
            }

            answerQueryable = answerQueryable
                .Where(x => x.Answer.QuestionSetId == dashboardSurveyId);

            if (dashboardItem.FilterQuestionId != null && dashboardItem.FilterAnswerId != null)
            {
                var answerIds = answerQueryable
                    .Where(y => y.QuestionId == dashboardItem.FilterQuestionId &&
                                y.OptionId == dashboardItem.FilterAnswerId)
                    .Select(y => y.AnswerId)
                    .ToList();

                answerQueryable = answerQueryable
                    .Where(x => answerIds
                        .Contains(x.AnswerId))
                    .Where(x => x.QuestionId == dashboardItem.FirstQuestionId);
            }
            else
            {
                answerQueryable = answerQueryable
                    .Where(x => x.QuestionId == dashboardItem.FirstQuestionId);
            }

            // Question type == Text
            if (dashboardItemModel.FirstQuestionType == Constants.QuestionTypes.Text)
            {
                if (dashboardLocationId != null)
                {
                    answerQueryable = answerQueryable
                        .Where(x => x.Answer.SiteId == dashboardLocationId);
                }
                else if (dashboardLocationTagId != null)
                {
                    answerQueryable = answerQueryable
                        .Where(x => x.Answer.Site.SiteTags.Any(
                            y => y.TagId == dashboardLocationTagId));
                }

                var textData = await answerQueryable
                    .Select(x => new DashboardItemTextQuestionDataModel
                    {
                        Date = x.Answer.FinishedAt,
                        LocationName = x.Answer.Site.Name,
                        Commentary = x.Value,
                        Id = x.Answer.Id,
                    }).Where(y => !string.IsNullOrEmpty(y.Commentary))
                    .OrderBy(t => t.Date)
                    .ToListAsync();

                dashboardItemModel.TextQuestionData.AddRange(textData);
            }
            else
            {
                // Question type != Text
                if (!dashboardItem.CompareEnabled)
                {
                    if (dashboardLocationId != null)
                    {
                        answerQueryable = answerQueryable
                            .Where(x => x.Answer.SiteId == dashboardLocationId);
                    }
                    else if (dashboardLocationTagId != null)
                    {
                        answerQueryable = answerQueryable
                            .Where(x => x.Answer.Site.SiteTags.Any(
                                y => y.TagId == dashboardLocationTagId));
                    }
                }

                var ignoreOptions = new List<Option>();

                if (dashboardItem.IgnoredAnswerValues
                    .Any(x => x.WorkflowState != Constants.WorkflowStates.Removed))
                {
                    var optionIds = dashboardItem.IgnoredAnswerValues
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(x => x.AnswerId)
                        .ToArray();

                    answerQueryable = answerQueryable
                        .Where(x => !optionIds.Contains(x.OptionId));

                    ignoreOptions = await sdkContext.Options.Where(x => optionIds.Contains(x.Id)).ToListAsync();
                }

                var data = new List<ChartDataItem>();
                if (isComparedData)
                {
                    var tagIds = new List<int>();
                    if (dashboardItem.CompareEnabled)
                    {
                        tagIds = dashboardItem.CompareLocationsTags
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.TagId != null)
                            .Select(x => (int)x.TagId)
                            .ToList();
                    }
                    else
                    {
                        if (dashboardLocationTagId != null)
                        {
                            tagIds.Add((int)dashboardLocationTagId);
                        }
                    }

                    var tagsData = new List<ChartDataItem>();
                    foreach (var tagId in tagIds)
                    {
                        var tagData = await answerQueryable
                            .Where(x => x.Answer.Site.SiteTags.Any(
                                y => y.TagId == tagId))
                            .Select(x => new ChartDataItem
                            {
                                Name = x.Question.IsSmiley()
                                    ? x.Option.WeightValue.ToString()
                                    : x.Question.QuestionType == Constants.QuestionTypes.Multi
                                        ? x.Option.OptionTranslationses.Where(ot => ot.WorkflowState != Constants.WorkflowStates.Removed)
                                            .Join(sdkContext.Options,
                                                optionTranslations => optionTranslations.OptionId,
                                                options => options.Id,
                                                (optionTranslations, options) => new
                                                {
                                                    optionTranslations.Name,
                                                    options.QuestionId
                                                }).Join(sdkContext.QuestionTranslations,
                                                preTranslations => preTranslations.QuestionId,
                                                questionTranslations => questionTranslations.QuestionId,
                                                (preTranslations, questionTranslations) => new
                                                {
                                                    optionname = preTranslations.Name,
                                                    qtname = questionTranslations.Name,
                                                    questionTranslations.WorkflowState
                                                }).Where(z => z.WorkflowState != Constants.WorkflowStates.Removed)
                                            .Select(z => $"{z.qtname}_{z.optionname}").First()
                                        : x.Question.QuestionType == Constants.QuestionTypes.List
                                          || x.Question.QuestionType == Constants.QuestionTypes.Buttons
                                            ? x.Option.OptionTranslationses
                                                .Where(ws => ws.WorkflowState != Constants.WorkflowStates.Removed)
                                                .Select(z => z.Name)
                                                .FirstOrDefault()
                                            : x.Value,
                                Finished = x.Answer.FinishedAt,
                                LocationTagName = x.Answer.Site.SiteTags
                                    .Where(y => y.TagId == tagId)
                                    .Select(y => y.Tag.Name)
                                    .FirstOrDefault(),
                                LocationTagId = (int)x.Answer.Site.SiteTags
                                    .Where(y => y.TagId == tagId)
                                    .Select(y => y.TagId)
                                    .FirstOrDefault(),
                                IsTag = true,
                                Weight = x.Option.WeightValue,
                                OptionIndex = x.Option.OptionIndex,
                                AnswerId = x.AnswerId,
                            })
                            .ToListAsync();

                        tagsData.AddRange(tagData);
                    }

                    var siteIds = new List<int>();
                    if (dashboardItem.CompareEnabled)
                    {
                        siteIds = dashboardItem.CompareLocationsTags
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.LocationId != null)
                            .Select(x => (int)x.LocationId)
                            .ToList();
                    }
                    else
                    {
                        if (dashboardLocationId != null)
                        {
                            siteIds.Add((int)dashboardLocationId);
                        }
                    }

                    var sitesData = await answerQueryable
                        .Where(x => siteIds.Contains(x.Answer.SiteId))
                        .Select(x => new ChartDataItem
                        {
                            Name = x.Question.IsSmiley()
                                ? x.Option.WeightValue.ToString()
                                : x.Question.QuestionType == Constants.QuestionTypes.Multi
                                    ? x.Option.OptionTranslationses.Where(ot => ot.WorkflowState != Constants.WorkflowStates.Removed)
                                        .Join(sdkContext.Options,
                                            optionTranslations => optionTranslations.OptionId,
                                            options => options.Id,
                                            (optionTranslations, options) => new
                                            {
                                                optionTranslations.Name,
                                                options.QuestionId
                                            }).Join(sdkContext.QuestionTranslations,
                                            preTranslations => preTranslations.QuestionId,
                                            questionTranslations => questionTranslations.QuestionId,
                                            (preTranslations, questionTranslations) => new
                                            {
                                                optionname = preTranslations.Name,
                                                qtname = questionTranslations.Name,
                                                questionTranslations.WorkflowState
                                            }).Where(z => z.WorkflowState != Constants.WorkflowStates.Removed)
                                        .Select(z => $"{z.qtname}_{z.optionname}").First()
                                    : x.Question.QuestionType == Constants.QuestionTypes.List
                                      || x.Question.QuestionType == Constants.QuestionTypes.Buttons
                                        ? x.Option.OptionTranslationses
                                            .Where(ws => ws.WorkflowState != Constants.WorkflowStates.Removed)
                                            .Select(z => z.Name)
                                            .FirstOrDefault()
                                        : x.Value,
                            Finished = x.Answer.FinishedAt,
                            LocationTagName = x.Answer.Site.Name,
                            LocationTagId = x.Answer.SiteId,
                            IsTag = false,
                            Weight = x.Option.WeightValue,
                            OptionIndex = x.Option.OptionIndex,
                            AnswerId = x.AnswerId,
                        })
                        .ToListAsync();

                    data.AddRange(tagsData);
                    data.AddRange(sitesData);
                    data = data.OrderBy(t => t.Finished).ToList();
                }
                else
                {
                    if (dashboardLocationId != null)
                    {
                        data = await answerQueryable
                            .Select(x => new ChartDataItem
                            {
                                Name = x.Question.IsSmiley()
                                    ? x.Option.WeightValue.ToString()
                                    : x.Question.QuestionType == Constants.QuestionTypes.Multi
                                    ? x.Option.OptionTranslationses.Where(ot => ot.WorkflowState != Constants.WorkflowStates.Removed)
                                        .Join(sdkContext.Options,
                                            optionTranslations => optionTranslations.OptionId,
                                            options => options.Id,
                                            (optionTranslations, options) => new
                                            {
                                                optionTranslations.Name,
                                                options.QuestionId
                                            }).Join(sdkContext.QuestionTranslations,
                                            preTranslations => preTranslations.QuestionId,
                                            questionTranslations => questionTranslations.QuestionId,
                                            (preTranslations, questionTranslations) => new
                                            {
                                                optionname = preTranslations.Name,
                                                qtname = questionTranslations.Name,
                                                questionTranslations.WorkflowState
                                            }).Where(z => z.WorkflowState != Constants.WorkflowStates.Removed)
                                        .Select(z => $"{z.qtname}_{z.optionname}").First()
                                        : x.Question.QuestionType == Constants.QuestionTypes.List
                                          || x.Question.QuestionType == Constants.QuestionTypes.Buttons
                                            ? x.Option.OptionTranslationses
                                                .Where(ws => ws.WorkflowState != Constants.WorkflowStates.Removed)
                                                .Select(z => z.Name)
                                                .FirstOrDefault()
                                            : x.Value,
                                Finished = x.Answer.FinishedAt,
                                LocationTagName = x.Answer.Site.Name,
                                LocationTagId = x.Answer.SiteId,
                                IsTag = false,
                                Weight = x.Option.WeightValue,
                                OptionIndex = x.Option.OptionIndex,
                                AnswerId = x.AnswerId
                            })
                            .OrderBy(t => t.Finished)
                            .ToListAsync();
                    }

                    if (dashboardLocationTagId != null)
                    {
                        data = await answerQueryable
                            .Select(x => new ChartDataItem
                            {
                                Name = x.Question.IsSmiley()
                                    ? x.Option.WeightValue.ToString()
                                    : x.Question.QuestionType == Constants.QuestionTypes.Multi
                                        ? x.Option.OptionTranslationses.Where(ot => ot.WorkflowState != Constants.WorkflowStates.Removed)
                                            .Join(sdkContext.Options,
                                                optionTranslations => optionTranslations.OptionId,
                                                options => options.Id,
                                                (optionTranslations, options) => new
                                                {
                                                    optionTranslations.Name,
                                                    options.QuestionId
                                                }).Join(sdkContext.QuestionTranslations,
                                                preTranslations => preTranslations.QuestionId,
                                                questionTranslations => questionTranslations.QuestionId,
                                                (preTranslations, questionTranslations) => new
                                                {
                                                    optionname = preTranslations.Name,
                                                    qtname = questionTranslations.Name,
                                                    questionTranslations.WorkflowState
                                                }).Where(z => z.WorkflowState != Constants.WorkflowStates.Removed)
                                            .Select(z => $"{z.qtname}_{z.optionname}").First()
                                        : x.Question.QuestionType == Constants.QuestionTypes.List
                                          || x.Question.QuestionType == Constants.QuestionTypes.Buttons
                                            ? x.Option.OptionTranslationses
                                                .Where(ws => ws.WorkflowState != Constants.WorkflowStates.Removed)
                                                .Select(z => z.Name)
                                                .FirstOrDefault()
                                            : x.Value,
                                Finished = x.Answer.FinishedAt,
                                LocationTagName = x.Answer.Site.SiteTags
                                    .Where(y => y.TagId == dashboardLocationTagId)
                                    .Select(y => y.Tag.Name)
                                    .FirstOrDefault(),
                                LocationTagId = (int)x.Answer.Site.SiteTags
                                    .Where(y => y.TagId == dashboardLocationTagId)
                                    .Select(y => y.TagId)
                                    .FirstOrDefault(),
                                IsTag = true,
                                Weight = x.Option.WeightValue,
                                OptionIndex = x.Option.OptionIndex,

                                AnswerId = x.AnswerId,
                            })
                            .OrderBy(t => t.Finished)
                            .ToListAsync();
                    }
                }

                // Get question type
                var questionTypeData = await sdkContext.Questions
                    .AsNoTracking()
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.Id == dashboardItem.FirstQuestionId)
                    .Select(x => new
                    {
                        IsSmiley = x.IsSmiley(),
                        IsMulti = x.QuestionType == Constants.QuestionTypes.Multi,
                    })
                    .FirstOrDefaultAsync();


                var isSmiley = questionTypeData.IsSmiley;
                var isMulti = questionTypeData.IsMulti;

                // Count of answers
                var answerDataCount = data.Select(u => u.AnswerId)
                    .Distinct()
                    .Count();

                List<string> lines;
                if (dashboardItem.CalculateAverage)
                {
                    lines = data
                        .GroupBy(x => x.LocationTagName)
                        .OrderBy(x => x.Key)
                        .Select(x => x.Key)
                        .ToList();
                }
                else
                {
                    lines = data
                        .GroupBy(x => x.Name)
                        .OrderBy(x => x.Key)
                        .Select(x => x.Key)
                        .ToList();
                }

                if (singleData)
                {
                    var count = data.Count;

                    var groupedData = new List<DashboardViewChartDataSingleModel>();
                    if (isMulti)
                    {
                        groupedData = data
                            .GroupBy(x => new { x.Name, x.OptionIndex })
                            .Select(x => new DashboardViewChartDataSingleModel
                            {
                                Name = x.Key.Name,
                                DataCount = x.Count(),
                                Value = GetDataPercentage(x.Count(), answerDataCount),
                                OptionIndex = x.Key.OptionIndex
                            })
                            .ToList();
                    }
                    else
                    {
                        groupedData = data
                            .GroupBy(x => new { x.Name, x.OptionIndex })
                            .Select(x => new DashboardViewChartDataSingleModel
                            {
                                Name = x.Key.Name,
                                DataCount = x.Count(),
                                Value = GetDataPercentage(x.Count(), count),
                                OptionIndex = x.Key.OptionIndex
                            })
                            .ToList();
                    }

                    var options = sdkContext.Options.Where(x => x.QuestionId == dashboardItem.FirstQuestionId)
                        .ToList();
                    if (isSmiley)
                    {
                        var tmpData = new List<DashboardViewChartDataSingleModel>();
                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 100) == null && options.Any(x => x.WeightValue == 100))
                            tmpData.Add(new DashboardViewChartDataSingleModel { Name = "100", Value = 0 });
                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 75) == null && options.Any(x => x.WeightValue == 75))
                            tmpData.Add(new DashboardViewChartDataSingleModel { Name = "75", Value = 0 });
                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 50) == null && options.Any(x => x.WeightValue == 50))
                            tmpData.Add(new DashboardViewChartDataSingleModel { Name = "50", Value = 0 });
                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 25) == null && options.Any(x => x.WeightValue == 25))
                            tmpData.Add(new DashboardViewChartDataSingleModel { Name = "25", Value = 0 });
                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 0) == null && options.Any(x => x.WeightValue == 0))
                            tmpData.Add(new DashboardViewChartDataSingleModel { Name = "0", Value = 0 });
                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 999) == null && options.Any(x => x.WeightValue == 999))
                            tmpData.Add(new DashboardViewChartDataSingleModel { Name = "999", Value = 0 });

                        foreach (var tmpDataModel in tmpData)
                        {
                            var chartDataSingleModel = groupedData
                                .FirstOrDefault(x => x.Name == tmpDataModel.Name);

                            if (chartDataSingleModel != null)
                            {
                                var parseResult = int.TryParse(chartDataSingleModel.Name, out var labelNumber);
                                if (parseResult)
                                {
                                    tmpDataModel.Name = smileyLabels.Single(z => z.Key == labelNumber).Value;
                                    tmpDataModel.Value = chartDataSingleModel.Value;
                                    tmpDataModel.DataCount = chartDataSingleModel.DataCount;
                                    tmpDataModel.OptionIndex = chartDataSingleModel.OptionIndex;
                                }
                            }
                            else
                            {
                                var parseResult = int.TryParse(tmpDataModel.Name, out var labelNumber);
                                if (parseResult)
                                {
                                    tmpDataModel.Name = smileyLabels.Single(z => z.Key == labelNumber).Value;
                                    tmpDataModel.Value = 0;
                                    tmpDataModel.DataCount = 0;
                                    var option = options.SingleOrDefault(x => x.WeightValue == labelNumber);
                                    if (option == null)
                                    {
                                        //Log.LogException($"ChartDataHelpers. we could not find a OptionsIndex for option with labelNumber {labelNumber} for question {dashboardItem.FirstQuestionId}");
                                    }
                                    tmpDataModel.OptionIndex = option != null ? options.Single(x => x.WeightValue == labelNumber).OptionIndex : 0;
                                }
                            }
                        }

                        groupedData = tmpData;
                    }
                    else
                    {
                        var tmpData = groupedData;
                        foreach (Option option in options)
                        {
                            OptionTranslation optionTranslation = await sdkContext.OptionTranslations.FirstAsync(x =>
                                x.OptionId == option.Id && x.WorkflowState != Constants.WorkflowStates.Removed);
                            var optionName = optionTranslation.Name;
                            if (!groupedData.Any(x => x.Name.Contains(optionName)))
                            {
                                DashboardViewChartDataSingleModel dashboardViewChartDataSingleModel = new DashboardViewChartDataSingleModel()
                                {
                                    AnswersDataCount = 0,
                                    DataCount = 0,
                                    OptionIndex = option.OptionIndex,
                                    Name = optionName,
                                    Value = 0
                                };
                                if (ignoreOptions.SingleOrDefault(x => x.Id == option.Id) == null)
                                {
                                    tmpData.Add(dashboardViewChartDataSingleModel);
                                }
                            }
                        }
                        groupedData = tmpData;
                    }

                    groupedData = groupedData.OrderBy(x => x.OptionIndex).ToList();

                    var rawData = ChartRawDataHelpers.ConvertSingleData(localizationService, groupedData, isMulti, answerDataCount);

                    // Convert data for pie chart
                    if (dashboardItem.ChartType == DashboardChartTypes.AdvancedPie ||
                        dashboardItem.ChartType == DashboardChartTypes.PieGrid)
                    {
                        foreach (var singleModel in groupedData)
                        {
                            singleModel.Value = singleModel.DataCount;
                        }
                    }

                    dashboardItemModel.ChartData.RawData = rawData;
                    dashboardItemModel.ChartData.Single.AddRange(groupedData);
                }
                else
                {
                    var multiData = new List<DashboardViewChartDataMultiModel>();
                    var multiStackedData = new List<DashboardViewChartDataMultiStackedModel>();
                    var multiStackedRawData = new List<DashboardViewChartDataMultiStackedModel>();
                    switch (dashboardItem.Period)
                    {
                        case DashboardPeriodUnits.Week:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => new { x.LocationTagName, x.IsTag })
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                        Name = x.Key.LocationTagName, // Location or tag name
                                        IsTag = x.Key.IsTag,
                                        Series = x
                                            .GroupBy(y => ChartHelpers.GetWeekString(y.Finished))
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // Week name
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = x.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key.Name)).Value
                                                            : i.Key.Name,
                                                        OptionIndex = i.Key.OptionIndex,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();

                                multiStackedRawData = data
                                    .GroupBy(ms => ChartHelpers.GetWeekString(ms.Finished))
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Name = x.Key, // Week
                                        Series = x
                                            .GroupBy(ms => new { ms.LocationTagName, ms.IsTag })
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Id = y.Select(i => i.LocationTagId).FirstOrDefault(),
                                                Name = y.Key.LocationTagName, // Location
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = y.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key.Name))
                                                                .Value
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(y => new { y.LocationTagName, y.IsTag })
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                            Name = x.Key.LocationTagName, // Location or tag name
                                            IsTag = x.Key.IsTag,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x
                                                .GroupBy(y => ChartHelpers.GetWeekString(y.Finished))
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(x => ChartHelpers.GetWeekString(x.Finished))
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key.ToString(),
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x.GroupBy(g => new { g.Name, g.OptionIndex })
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Key == int.Parse(y.Key.Name)).Value
                                                        : y.Key.Name,
                                                    DataCount = y.Count(),
                                                    OptionIndex = y.Key.OptionIndex,
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : isMulti
                                                            ? GetDataPercentage(y.Count(), GetAnswersCount(x))
                                                            : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .OrderBy(f => f.OptionIndex)
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.Month:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => new { x.LocationTagName, x.IsTag })
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                        Name = x.Key.LocationTagName, // Location or tag name
                                        IsTag = x.Key.IsTag,
                                        Series = x
                                            .GroupBy(ms => ChartHelpers.GetMonthString(ms.Finished))
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // Month name
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = x.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key.Name)).Value
                                                            : i.Key.Name,
                                                        OptionIndex = i.Key.OptionIndex,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            // .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();

                                multiStackedRawData = data
                                    .GroupBy(ms => ChartHelpers.GetMonthString(ms.Finished))
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Name = x.Key, // Month
                                        Series = x
                                            .GroupBy(ms => new { ms.LocationTagName, ms.IsTag })
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Id = y.Select(i => i.LocationTagId).FirstOrDefault(),
                                                Name = y.Key.LocationTagName, // Location
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = y.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key.Name))
                                                                .Value
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            //.OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(y => new { y.LocationTagName, y.IsTag })
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                            Name = x.Key.LocationTagName, // Location or tag name
                                            IsTag = x.Key.IsTag,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x
                                                .GroupBy(ms => ChartHelpers.GetMonthString(ms.Finished))
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(ms => ChartHelpers.GetMonthString(ms.Finished))
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key.ToString(),
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x.GroupBy(g => new { g.Name, g.OptionIndex })
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Key == int.Parse(y.Key.Name)).Value
                                                        : y.Key.Name,
                                                    OptionIndex = y.Key.OptionIndex,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : isMulti
                                                            ? GetDataPercentage(y.Count(), GetAnswersCount(x))
                                                            : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .OrderBy(f => f.OptionIndex)
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.Quarter:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => new { x.LocationTagName, x.IsTag })
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                        Name = x.Key.LocationTagName, // Location or tag name
                                        IsTag = x.Key.IsTag,
                                        Series = x
                                            .GroupBy(item =>
                                                $"{item.Finished:yy}_K{((item.Finished.Month - 1) / 3) + 1}")
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // Quarter name
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = x.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key.Name)).Value
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();

                                multiStackedRawData = data
                                    .GroupBy(ms => $"{ms.Finished:yy}_K{((ms.Finished.Month - 1) / 3) + 1}")
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Name = x.Key, // Quarter
                                        Series = x
                                            .GroupBy(ms => new { ms.LocationTagName, ms.IsTag })
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Id = y.Select(i => i.LocationTagId).FirstOrDefault(),
                                                Name = y.Key.LocationTagName, // Location
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = y.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key.Name))
                                                                .Value
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(y => new { y.LocationTagName, y.IsTag })
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                            Name = x.Key.LocationTagName, // Location or tag name
                                            IsTag = x.Key.IsTag,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x.GroupBy(item =>
                                                    $"{item.Finished:yy}_K{((item.Finished.Month - 1) / 3) + 1}")
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(item => $"{item.Finished:yy}_K{((item.Finished.Month - 1) / 3) + 1}")
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x.GroupBy(g => new { g.Name, g.OptionIndex })
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Key == int.Parse(y.Key.Name)).Value
                                                        : y.Key.Name,
                                                    DataCount = y.Count(),
                                                    OptionIndex = y.Key.OptionIndex,
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : isMulti
                                                            ? GetDataPercentage(y.Count(), GetAnswersCount(x))
                                                            : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .OrderBy(f => f.OptionIndex)
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.SixMonth:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => new { x.LocationTagName, x.IsTag })
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                        Name = x.Key.LocationTagName, // Location or tag name
                                        IsTag = x.Key.IsTag,
                                        Series = x
                                            .GroupBy(item =>
                                                $"{item.Finished:yy}_{ChartHelpers.GetHalfOfYear(item.Finished)}H")
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // SixMonth name
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = x.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key.Name)).Value
                                                            : i.Key.Name,
                                                        OptionIndex = i.Key.OptionIndex,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();

                                multiStackedRawData = data
                                    .GroupBy(ms => $"{ms.Finished:yy}_{ChartHelpers.GetHalfOfYear(ms.Finished)}H")
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Name = x.Key, // Half of year
                                        Series = x
                                            .GroupBy(ms => new { ms.LocationTagName, ms.IsTag })
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Id = y.Select(i => i.LocationTagId).FirstOrDefault(),
                                                Name = y.Key.LocationTagName, // Location
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = y.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key.Name))
                                                                .Value
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(y => new { y.LocationTagName, y.IsTag })
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                            Name = x.Key.LocationTagName, // Location or tag name
                                            IsTag = x.Key.IsTag,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x
                                                .GroupBy(item =>
                                                    $"{item.Finished:yy}_{ChartHelpers.GetHalfOfYear(item.Finished)}H")
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(item =>
                                            $"{item.Finished:yy}_{ChartHelpers.GetHalfOfYear(item.Finished)}H")
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x.GroupBy(g => new { g.Name, g.OptionIndex })
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Key == int.Parse(y.Key.Name)).Value
                                                        : y.Key.Name,
                                                    OptionIndex = y.Key.OptionIndex,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : isMulti
                                                            ? GetDataPercentage(y.Count(), GetAnswersCount(x))
                                                            : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .OrderBy(f => f.OptionIndex)
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.Year:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => new { x.LocationTagName, x.IsTag })
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                        Name = x.Key.LocationTagName, // Location or tag name
                                        IsTag = x.Key.IsTag,
                                        Series = x
                                            .GroupBy(ms => $"{ms.Finished:yyyy}")
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // Year name
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = x.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key.Name)).Value
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();

                                multiStackedRawData = data
                                    .GroupBy(ms => $"{ms.Finished:yyyy}")
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Name = x.Key, // Year
                                        Series = x
                                            .GroupBy(ms => new { ms.LocationTagName, ms.IsTag })
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Id = y.Select(i => i.LocationTagId).FirstOrDefault(),
                                                Name = y.Key.LocationTagName, // Location
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = y.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Key == int.Parse(i.Key.Name)).Value
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(y => new { y.LocationTagName, y.IsTag })
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                            Name = x.Key.LocationTagName, // Location or tag name
                                            IsTag = x.Key.IsTag,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x
                                                .GroupBy(ms => $"{ms.Finished:yyyy}")
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(ms => $"{ms.Finished:yyyy}")
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key.ToString(),
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x.GroupBy(y => new { y.Name, y.OptionIndex })
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    OptionIndex = y.Key.OptionIndex,
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Key == int.Parse(y.Key.Name)).Value
                                                        : y.Key.Name,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : isMulti
                                                            ? GetDataPercentage(y.Count(), GetAnswersCount(x))
                                                            : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .OrderBy(f => f.OptionIndex)
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.Total:
                            var totalPeriod = new DashboardViewChartDataMultiModel
                            {
                                Name = localizationService.GetString("TotalPeriod")
                            };

                            totalPeriod.Series = data
                                .GroupBy(g => new { g.Name, g.OptionIndex })
                                .Select(x => new DashboardViewChartDataSingleModel
                                {
                                    Name = isSmiley ? smileyLabels.Single(z => z.Key == int.Parse(x.Key.Name)).Value : x.Key.Name,
                                    OptionIndex = x.Key.OptionIndex,
                                    DataCount = x.Count(),
                                    Value = dashboardItem.CalculateAverage
                                        ? GetAverageDataPercentage(x.Average(k => k.Weight))
                                        : GetDataPercentage(x.Count(), data.Count),
                                })
                                .OrderBy(f => f.OptionIndex)
                                .ToList();
                            multiData.Add(totalPeriod);
                            break;
                        default:
                            throw new ArgumentOutOfRangeException();
                    }

                    if (dashboardItem.ChartType == DashboardChartTypes.Line)
                    {
                        if (dashboardItem.CalculateAverage)
                        {
                            var lineData = new List<DashboardViewChartDataMultiModel>();
                            var newLineData = new List<DashboardViewChartDataMultiModel>();
                            if (!multiData.Any())
                            {
                                foreach (var line in lines)
                                {
                                    var multiItem = new DashboardViewChartDataMultiModel
                                    {
                                        Name = isSmiley && !isComparedData ? smileyLabels.Single(z => z.Key == int.Parse(line)).Value : line,
                                    };

                                    foreach (var groupedItem in multiData)
                                    {
                                        foreach (var item in groupedItem.Series)
                                        {
                                            if (item.Name == (isSmiley && !isComparedData
                                                    ? smileyLabels.Single(z => z.Key == int.Parse(line)).Value
                                                    : line))
                                            {
                                                var singleItem = new DashboardViewChartDataSingleModel
                                                {
                                                    Name = groupedItem.Name,
                                                    Value = item.Value,
                                                    DataCount = item.DataCount,
                                                    OptionIndex = item.OptionIndex
                                                };
                                                multiItem.Series.Add(singleItem);
                                            }
                                        }
                                    }

                                    lineData.Add(multiItem);
                                }

                                var columnNames = new List<string>();
                                var lineNames = new List<string>();

                                foreach (var model in lineData)
                                {
                                    if (!lineNames.Contains(model.Name))
                                    {
                                        lineNames.Add(model.Name);
                                    }

                                    foreach (var dashboardViewChartDataSingleModel in model.Series)
                                    {
                                        if (!columnNames.Contains(dashboardViewChartDataSingleModel.Name))
                                        {
                                            columnNames.Add(dashboardViewChartDataSingleModel.Name);
                                        }
                                    }
                                }

                                if (dashboardItem.Period != DashboardPeriodUnits.Month)
                                {
                                    columnNames.Sort();
                                }

                                lineNames.Sort();

                                if (isSmiley)
                                {
                                    var options = sdkContext.Options.Where(x => x.QuestionId == dashboardItem.FirstQuestionId)
                                        .ToList();
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 100) == null && options.Any(x => x.WeightValue == 100))
                                        newLineData.Add(new DashboardViewChartDataMultiModel
                                        { Name = smileyLabels.Single(z => z.Key == 100).Value });
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 75) == null && options.Any(x => x.WeightValue == 75))
                                        newLineData.Add(new DashboardViewChartDataMultiModel
                                        { Name = smileyLabels.Single(z => z.Key == 75).Value });
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 50) == null && options.Any(x => x.WeightValue == 50))
                                        newLineData.Add(new DashboardViewChartDataMultiModel
                                        { Name = smileyLabels.Single(z => z.Key == 50).Value });
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 25) == null && options.Any(x => x.WeightValue == 25))
                                        newLineData.Add(new DashboardViewChartDataMultiModel
                                        { Name = smileyLabels.Single(z => z.Key == 25).Value });
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 0) == null && options.Any(x => x.WeightValue == 0))
                                        newLineData.Add(new DashboardViewChartDataMultiModel
                                        { Name = smileyLabels.Single(z => z.Key == 0).Value });
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 999) == null && options.Any(x => x.WeightValue == 999))
                                        newLineData.Add(new DashboardViewChartDataMultiModel
                                        { Name = smileyLabels.Single(z => z.Key == 999).Value });

                                    foreach (var model in newLineData)
                                    {
                                        foreach (var columnName in columnNames)
                                        {
                                            var singleItem = new DashboardViewChartDataSingleModel
                                            {
                                                Name = columnName,
                                                Value = 0,
                                            };
                                            model.Series.Add(singleItem);
                                        }
                                    }

                                    foreach (var model in newLineData)
                                    {
                                        foreach (var multiModel in lineData)
                                        {
                                            if (model.Name == multiModel.Name)
                                            {
                                                foreach (var series in multiModel.Series)
                                                {
                                                    foreach (var modelSeries in model.Series)
                                                    {
                                                        if (modelSeries.Name == series.Name)
                                                        {
                                                            modelSeries.Value = series.Value;
                                                            modelSeries.DataCount = series.DataCount;
                                                            modelSeries.OptionIndex = series.OptionIndex;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    foreach (var lineName in lineNames)
                                    {
                                        var multiItem = new DashboardViewChartDataMultiModel
                                        {
                                            Name = lineName,
                                        };

                                        foreach (var columnName in columnNames)
                                        {
                                            var singleItem = new DashboardViewChartDataSingleModel
                                            {
                                                Name = columnName,
                                                Value = 0,
                                            };
                                            multiItem.Series.Add(singleItem);
                                        }

                                        newLineData.Add(multiItem);
                                    }

                                    foreach (var model in newLineData)
                                    {
                                        foreach (var multiModel in lineData)
                                        {
                                            if (model.Name == multiModel.Name)
                                            {
                                                foreach (var series in multiModel.Series)
                                                {
                                                    foreach (var modelSeries in model.Series)
                                                    {
                                                        if (modelSeries.Name == series.Name)
                                                        {
                                                            modelSeries.Value = series.Value;
                                                            modelSeries.DataCount = series.DataCount;
                                                            modelSeries.OptionIndex = series.OptionIndex;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                newLineData = multiData;
                            }

                            // Sort by location position
                            if (isComparedData && lines.Any())
                            {
                                if (dashboardItem.CompareEnabled == false)
                                {
                                    newLineData =
                                        ChartHelpers.SortMultiDataLocationPosition(
                                            newLineData,
                                            dashboardItem,
                                            dashboardLocationId,
                                            dashboardLocationTagId);
                                }
                                else
                                {
                                    newLineData =
                                        ChartHelpers.SortMultiDataLocationPosition(
                                            newLineData,
                                            dashboardItem,
                                            null,
                                            null);
                                }
                            }

                            var rawData = ChartRawDataHelpers.ConvertMultiData(localizationService, newLineData, true, isMulti);
                            dashboardItemModel.ChartData.RawData = rawData;
                            dashboardItemModel.ChartData.Multi.AddRange(newLineData);
                        }
                        else
                        {
                            var lineData = new List<DashboardViewChartDataMultiModel>();
                            foreach (var line in lines)
                            {
                                var multiItem = new DashboardViewChartDataMultiModel
                                {
                                    Name = isSmiley ? smileyLabels.Single(z => z.Key == int.Parse(line)).Value : line,
                                };

                                foreach (var groupedItem in multiData)
                                {
                                    foreach (var item in groupedItem.Series)
                                    {
                                        if (item.Name == (isSmiley
                                                ? smileyLabels.Single(z => z.Key == int.Parse(line)).Value
                                                : line))
                                        {
                                            var singleItem = new DashboardViewChartDataSingleModel
                                            {
                                                Name = groupedItem.Name,
                                                Value = item.Value,
                                                DataCount = item.DataCount,
                                                OptionIndex = item.OptionIndex
                                            };

                                            var count = multiData
                                                .Where(x => x.Name == groupedItem.Name)
                                                .Select(x => x.AnswersCount)
                                                .FirstOrDefault();

                                            if (count > 0)
                                            {
                                                singleItem.AnswersDataCount = count;
                                            }

                                            multiItem.Series.Add(singleItem);
                                        }
                                    }
                                }

                                lineData.Add(multiItem);
                            }

                            var columnNames = new List<string>();
                            var lineNames = new List<string>();

                            foreach (var model in lineData)
                            {
                                if (!lineNames.Contains(model.Name))
                                {
                                    lineNames.Add(model.Name);
                                }

                                foreach (var dashboardViewChartDataSingleModel in model.Series)
                                {
                                    if (!columnNames.Contains(dashboardViewChartDataSingleModel.Name))
                                    {
                                        columnNames.Add(dashboardViewChartDataSingleModel.Name);
                                    }
                                }
                            }

                            if (dashboardItem.Period != DashboardPeriodUnits.Month)
                            {
                                columnNames.Sort();
                            }
                            lineNames.Sort();

                            var newLineData = new List<DashboardViewChartDataMultiModel>();

                            if (isSmiley)
                            {
                                var options = sdkContext.Options.Where(x => x.QuestionId == dashboardItem.FirstQuestionId)
                                    .ToList();
                                if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 100) == null && options.Any(x => x.WeightValue == 100))
                                    newLineData.Add(new DashboardViewChartDataMultiModel
                                    { Name = smileyLabels.Single(z => z.Key == 100).Value });
                                if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 75) == null && options.Any(x => x.WeightValue == 75))
                                    newLineData.Add(new DashboardViewChartDataMultiModel
                                    { Name = smileyLabels.Single(z => z.Key == 75).Value });
                                if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 50) == null && options.Any(x => x.WeightValue == 50))
                                    newLineData.Add(new DashboardViewChartDataMultiModel
                                    { Name = smileyLabels.Single(z => z.Key == 50).Value });
                                if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 25) == null && options.Any(x => x.WeightValue == 25))
                                    newLineData.Add(new DashboardViewChartDataMultiModel
                                    { Name = smileyLabels.Single(z => z.Key == 25).Value });
                                if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 0) == null && options.Any(x => x.WeightValue == 0))
                                    newLineData.Add(new DashboardViewChartDataMultiModel
                                    { Name = smileyLabels.Single(z => z.Key == 0).Value });
                                if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 999) == null && options.Any(x => x.WeightValue == 999))
                                    newLineData.Add(new DashboardViewChartDataMultiModel
                                    { Name = smileyLabels.Single(z => z.Key == 999).Value });

                                foreach (var model in newLineData)
                                {
                                    foreach (var columnName in columnNames)
                                    {
                                        var singleItem = new DashboardViewChartDataSingleModel
                                        {
                                            Name = columnName,
                                            Value = 0,
                                        };
                                        model.Series.Add(singleItem);
                                    }
                                }

                                foreach (var model in newLineData)
                                {
                                    foreach (var multiModel in lineData)
                                    {
                                        if (model.Name == multiModel.Name)
                                        {
                                            foreach (var series in multiModel.Series)
                                            {
                                                foreach (var modelSeries in model.Series)
                                                {
                                                    if (modelSeries.Name == series.Name)
                                                    {
                                                        modelSeries.Value = series.Value;
                                                        modelSeries.DataCount = series.DataCount;
                                                        modelSeries.OptionIndex = series.OptionIndex;
                                                        modelSeries.AnswersDataCount = series.AnswersDataCount;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                foreach (var lineName in lineNames)
                                {
                                    var multiItem = new DashboardViewChartDataMultiModel
                                    {
                                        Name = lineName,
                                    };

                                    foreach (var columnName in columnNames)
                                    {
                                        var singleItem = new DashboardViewChartDataSingleModel
                                        {
                                            Name = columnName,
                                            Value = 0,
                                        };
                                        multiItem.Series.Add(singleItem);
                                    }

                                    newLineData.Add(multiItem);
                                }

                                foreach (var model in newLineData)
                                {
                                    foreach (var multiModel in lineData)
                                    {
                                        if (model.Name == multiModel.Name)
                                        {
                                            foreach (var series in multiModel.Series)
                                            {
                                                foreach (var modelSeries in model.Series)
                                                {
                                                    if (modelSeries.Name == series.Name)
                                                    {
                                                        modelSeries.Value = series.Value;
                                                        modelSeries.DataCount = series.DataCount;
                                                        modelSeries.OptionIndex = series.OptionIndex;
                                                        modelSeries.AnswersDataCount = series.AnswersDataCount;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // Sort by location position
                            if (isComparedData)
                            {
                                if (dashboardItem.CompareEnabled == false)
                                {
                                    newLineData =
                                        ChartHelpers.SortMultiDataLocationPosition(
                                            newLineData,
                                            dashboardItem,
                                            dashboardLocationId,
                                            dashboardLocationTagId);
                                }
                                else
                                {
                                    newLineData =
                                        ChartHelpers.SortMultiDataLocationPosition(
                                            newLineData,
                                            dashboardItem,
                                            null,
                                            null);
                                }
                            }

                            var rawData = ChartRawDataHelpers.ConvertMultiData(localizationService, newLineData, true, isMulti);
                            dashboardItemModel.ChartData.RawData = rawData;
                            dashboardItemModel.ChartData.Multi.AddRange(newLineData);
                        }
                    }
                    else
                    {
                        if (!isStackedData)
                        {
                            var columnNames = new List<string>();
                            var lineNames = new List<string>();

                            if (multiData.Any())
                            {
                                foreach (var multiDataModel in multiData)
                                {
                                    if (!columnNames.Contains(multiDataModel.Name))
                                    {
                                        columnNames.Add(multiDataModel.Name);
                                    }

                                    foreach (var dashboardViewChartDataSingleModel in multiDataModel.Series)
                                    {
                                        if (!lineNames.Contains(dashboardViewChartDataSingleModel.Name))
                                        {
                                            lineNames.Add(dashboardViewChartDataSingleModel.Name);
                                        }
                                    }
                                }
                            }
                            else
                            {
                                columnNames.Add(localizationService.GetString("NoData"));
                            }

                            var newLineData = new List<DashboardViewChartDataMultiModel>();

                            var options = sdkContext.Options.Where(x => x.QuestionId == dashboardItem.FirstQuestionId)
                                .ToList();
                            if (isSmiley)
                            {
                                foreach (var columnName in columnNames)
                                {
                                    var model = new DashboardViewChartDataMultiModel { Name = columnName };
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 100) == null && options.Any(x => x.WeightValue == 100))
                                    {
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                        {
                                            Name = smileyLabels.Single(z => z.Key == 100).Value,
                                            Value = 0
                                        });
                                    }

                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 75) == null && options.Any(x => x.WeightValue == 75))
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                        { Name = smileyLabels.Single(z => z.Key == 75).Value, Value = 0 });
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 50) == null && options.Any(x => x.WeightValue == 50))
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                        { Name = smileyLabels.Single(z => z.Key == 50).Value, Value = 0 });
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 25) == null && options.Any(x => x.WeightValue == 25))
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                        { Name = smileyLabels.Single(z => z.Key == 25).Value, Value = 0 });
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 0) == null && options.Any(x => x.WeightValue == 0))
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                        { Name = smileyLabels.Single(z => z.Key == 0).Value, Value = 0 });
                                    if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 999) == null && options.Any(x => x.WeightValue == 999))
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                        { Name = smileyLabels.Single(z => z.Key == 999).Value, Value = 0 });
                                    newLineData.Add(model);
                                }

                                foreach (var model in newLineData)
                                {
                                    foreach (var multiModel in multiData)
                                    {
                                        if (model.Name == multiModel.Name)
                                        {
                                            foreach (var series in multiModel.Series)
                                            {
                                                foreach (var modelSeries in model.Series)
                                                {
                                                    if (modelSeries.Name == series.Name)
                                                    {
                                                        modelSeries.Value = series.Value;
                                                        modelSeries.DataCount = series.DataCount;
                                                        modelSeries.OptionIndex = series.OptionIndex;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else if (isMulti)
                            {
                                foreach (var stackedModel in multiData)
                                {
                                    var newStackedModel = new DashboardViewChartDataMultiModel
                                    {
                                        Id = stackedModel.Id,
                                        Name = stackedModel.Name,
                                        AnswersCount = stackedModel.AnswersCount,
                                        IsTag = stackedModel.IsTag,
                                        Series = stackedModel.Series
                                            .OrderBy(x => x.Name)
                                            .ToList(),
                                    };


                                    newLineData.Add(newStackedModel);
                                }
                            }
                            else
                            {
                                foreach (var columnName in columnNames)
                                {
                                    var model = new DashboardViewChartDataMultiModel { Name = columnName };
                                    foreach (Option option in options.OrderBy(x => x.OptionIndex))
                                    {
                                        string optionTranslationName = sdkContext.OptionTranslations
                                            .First(ws => ws.WorkflowState != Constants.WorkflowStates.Removed
                                                         && ws.OptionId == option.Id).Name;
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                        {
                                            Name = optionTranslationName,
                                            Value = 0,
                                            DataCount = 0,
                                            OptionIndex = 0,
                                            AnswersDataCount = 0
                                        });
                                    }
                                    newLineData.Add(model);
                                }

                                foreach (var model in multiData)
                                {
                                    foreach (var newModel in newLineData)
                                    {
                                        if (model.Name == newModel.Name)
                                        {
                                            foreach (var newModelSeries in newModel.Series)
                                            {
                                                foreach (var modelSeries in model.Series)
                                                {
                                                    if (newModelSeries.Name == modelSeries.Name)
                                                    {
                                                        newModelSeries.Value = modelSeries.Value;
                                                        newModelSeries.DataCount = modelSeries.DataCount;
                                                        newModelSeries.OptionIndex = modelSeries.OptionIndex;
                                                        newModelSeries.AnswersDataCount = modelSeries.AnswersDataCount;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // Sort by location position
                            if (isComparedData)
                            {
                                if (dashboardItem.CompareEnabled == false)
                                {
                                    newLineData =
                                        ChartHelpers.SortMultiDataLocationPosition(
                                            newLineData,
                                            dashboardItem,
                                            dashboardLocationId,
                                            dashboardLocationTagId);
                                }
                                else
                                {
                                    newLineData =
                                        ChartHelpers.SortMultiDataLocationPosition(
                                            newLineData,
                                            dashboardItem,
                                            null,
                                            null);
                                }
                            }

                            var rawData = ChartRawDataHelpers.ConvertMultiData(localizationService, newLineData, false, isMulti);
                            dashboardItemModel.ChartData.RawData = rawData;
                            dashboardItemModel.ChartData.Multi.AddRange(newLineData);
                        }
                        else
                        {
                            multiStackedData =
                                ChartHelpers.SortMultiStackedDataLocationPosition(
                                    multiStackedData,
                                    dashboardItem);

                            multiStackedRawData =
                                ChartHelpers.SortMultiStackedRawDataLocationPosition(
                                    multiStackedRawData,
                                    dashboardItem);

                            if (isSmiley)
                            {
                                var newLineData = new List<DashboardViewChartDataMultiStackedModel>();
                                var columnNames = new List<string>();

                                if (multiStackedData.Any())
                                {
                                    foreach (var stackedModel in multiStackedData)
                                    {
                                        foreach (var modelSeries in stackedModel.Series)
                                        {
                                            if (!columnNames.Contains(modelSeries.Name))
                                            {
                                                columnNames.Add(modelSeries.Name);
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    var model = new DashboardViewChartDataMultiStackedModel()
                                    {
                                        Name = localizationService.GetString("NoData"),
                                        IsTag = false,
                                        Id = 0,
                                    };
                                    multiStackedData.Add(model);
                                    columnNames.Add(localizationService.GetString("NoData"));
                                }

                                foreach (var stackedModel in multiStackedData)
                                {
                                    var model = new DashboardViewChartDataMultiStackedModel()
                                    {
                                        Name = stackedModel.Name,
                                        IsTag = stackedModel.IsTag,
                                        Id = stackedModel.Id,
                                    };


                                    foreach (var columnName in columnNames)
                                    {
                                        var innerModel = new DashboardViewChartDataMultiModel() { Name = columnName };
                                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 100) == null)
                                            innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                            { Name = smileyLabels.Single(z => z.Key == 100).Value, Value = 0 });
                                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 75) == null)
                                            innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                            { Name = smileyLabels.Single(z => z.Key == 75).Value, Value = 0 });
                                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 50) == null)
                                            innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                            { Name = smileyLabels.Single(z => z.Key == 50).Value, Value = 0 });
                                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 25) == null)
                                            innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                            { Name = smileyLabels.Single(z => z.Key == 25).Value, Value = 0 });
                                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 0) == null)
                                            innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                            { Name = smileyLabels.Single(z => z.Key == 0).Value, Value = 0 });
                                        if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 999) == null)
                                            innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                            { Name = smileyLabels.Single(z => z.Key == 999).Value, Value = 0 });
                                        model.Series.Add(innerModel);
                                    }

                                    foreach (var modelSeries in stackedModel.Series)
                                    {
                                        // var innerModel = new DashboardViewChartDataMultiModel() {Name = modelSeries.Name};
                                        var innerModel = model.Series.Single(x => x.Name == modelSeries.Name);

                                        // foreach (var modelSeries in model.Series)
                                        // {
                                        //     if (modelSeries.Name == series.Name)
                                        //     {
                                        //         modelSeries.Value = series.Value;
                                        //     }
                                        // }
                                        // if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 100) == null)
                                        //     innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                        //         {Name = smileyLabels.Single(z => z.Key == 100).Value, Value = 0});
                                        // if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 75) == null)
                                        //     innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                        //         {Name = smileyLabels.Single(z => z.Key == 75).Value, Value = 0});
                                        // if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 50) == null)
                                        //     innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                        //         {Name = smileyLabels.Single(z => z.Key == 50).Value, Value = 0});
                                        // if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 25) == null)
                                        //     innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                        //         {Name = smileyLabels.Single(z => z.Key == 25).Value, Value = 0});
                                        // if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 0) == null)
                                        //     innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                        //         {Name = smileyLabels.Single(z => z.Key == 0).Value, Value = 0});
                                        // if (ignoreOptions.SingleOrDefault(x => x.WeightValue == 999) == null)
                                        //     innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                        //         {Name = smileyLabels.Single(z => z.Key == 999).Value, Value = 0});

                                        foreach (var innerSeries in modelSeries.Series)
                                        {
                                            foreach (var newInnerSeriesModel in innerModel.Series)
                                            {
                                                if (innerSeries.Name == newInnerSeriesModel.Name)
                                                {
                                                    newInnerSeriesModel.Value = innerSeries.Value;
                                                    newInnerSeriesModel.DataCount = innerSeries.DataCount;
                                                    newInnerSeriesModel.OptionIndex = innerSeries.OptionIndex;
                                                }
                                            }
                                        }
                                    }

                                    newLineData.Add(model);
                                }

                                dashboardItemModel.ChartData.MultiStacked.AddRange(newLineData);
                            }
                            else if (isMulti)
                            {
                                var newLineData = new List<DashboardViewChartDataMultiStackedModel>();

                                foreach (var stackedModel in multiStackedData)
                                {
                                    var newStackedModel = new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = stackedModel.Id,
                                        Name = stackedModel.Name,
                                        IsTag = stackedModel.IsTag,
                                    };

                                    foreach (var stackedModelSeries in stackedModel.Series)
                                    {
                                        stackedModelSeries.Series = stackedModelSeries.Series
                                            .OrderBy(x => x.Name)
                                            .ToList();
                                    }

                                    newStackedModel.Series = stackedModel.Series
                                        .OrderBy(x => x.Name)
                                        .ToList();

                                    newLineData.Add(newStackedModel);
                                }

                                dashboardItemModel.ChartData.MultiStacked.AddRange(newLineData);
                            }
                            else
                            {
                                dashboardItemModel.ChartData.MultiStacked.AddRange(multiStackedData);
                            }

                            // convert
                            var rawData = ChartRawDataHelpers.ConvertMultiStackedData(
                                dashboardItemModel.ChartData.MultiStacked,
                                multiStackedRawData,
                                isMulti);

                            dashboardItemModel.ChartData.RawData = rawData;
                        }
                    }
                }
            }
        }

        private static decimal GetAverageDataPercentage(double averageValue)
        {
            var value = Math.Round((decimal)averageValue, 2, MidpointRounding.AwayFromZero);
            return value;
        }

        private static int GetAnswersCount(IGrouping<object, ChartDataItem> grouping)
        {
            var value = grouping.GroupBy(u => u.AnswerId)
                .Select(u => u.Key)
                .Count();
            return value;
        }

        public static decimal GetDataPercentage(int subCount, int totalCount)
        {
            var value = Math.Round(((decimal)subCount * 100) / totalCount, 2, MidpointRounding.AwayFromZero);
            return value;
        }


        private static async Task CalculateDashboardItemByWeight(
            DashboardItemViewModel dashboardItemModel,
            MicrotingDbContext sdkContext,
            DashboardItem dashboardItem,
            IInsightDashboardLocalizationService localizationService,
            int? dashboardLocationId,
            int? dashboardLocationTagId,
            int dashboardSurveyId,
            DashboardEditAnswerDates answerDates)
        {
            // Chart data
            var singleData = false;
            var smileyLabels = sdkContext.Options
                .Where(x => x.QuestionId == dashboardItem.FilterQuestionId)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Select(x => new
                {
                    x.Weight,
                    sdkContext.OptionTranslations
                        .FirstOrDefault(y => y.OptionId == x.Id).Name
                })
                .ToList();
            switch (dashboardItem.ChartType)
            {
                case DashboardChartTypes.Line:
                    break;
                case DashboardChartTypes.Pie:
                    singleData = true;
                    break;
                case DashboardChartTypes.AdvancedPie:
                    singleData = true;
                    break;
                case DashboardChartTypes.PieGrid:
                    singleData = true;
                    break;
                case DashboardChartTypes.HorizontalBar:
                    singleData = true;
                    break;
                case DashboardChartTypes.HorizontalBarStacked:
                    break;
                case DashboardChartTypes.HorizontalBarGrouped:
                    break;
                case DashboardChartTypes.VerticalBar:
                    singleData = true;
                    break;
                case DashboardChartTypes.VerticalBarStacked:
                    break;
                case DashboardChartTypes.VerticalBarGrouped:
                    break;
                case DashboardChartTypes.GroupedStackedBarChart:
                    break;
                case 0:
                    if (dashboardItemModel.FirstQuestionType != "text")
                    {
                        throw new ArgumentOutOfRangeException();
                    }
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            bool isStackedData;
            if (
                dashboardItem.ChartType == DashboardChartTypes.GroupedStackedBarChart
                && dashboardItem.CompareEnabled
                && dashboardItem.CalculateAverage == false)
            {
                isStackedData = true;
            }
            else
            {
                isStackedData = false;
            }

            var isComparedData = false;
            if (dashboardItem.ChartType == DashboardChartTypes.GroupedStackedBarChart
                || dashboardItem.ChartType == DashboardChartTypes.Line)
            {
                if (dashboardItem.CompareEnabled)
                {
                    isComparedData = true;
                }
                else if (dashboardItem.ChartType == DashboardChartTypes.Line && dashboardItem.CalculateAverage)
                {
                    isComparedData = true;
                }
            }

            var answerQueryable = sdkContext.AnswerValues
                .AsNoTracking()
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Include(x => x.Question)
                .Include(x => x.Option)
                .Include(x => x.Answer)
                .Include(x => x.Option.OptionTranslationses)
                .AsQueryable();

            if (answerDates.Today)
            {
                var dateTimeNow = DateTime.Now;
                answerDates.DateTo = new DateTime(
                    dateTimeNow.Year,
                    dateTimeNow.Month,
                    dateTimeNow.Day,
                    23,
                    59,
                    59);
            }

            if (answerDates.DateFrom != null)
            {
                answerQueryable = answerQueryable
                    .Where(x => x.Answer.FinishedAt >= answerDates.DateFrom);
            }

            if (answerDates.DateTo != null)
            {
                answerQueryable = answerQueryable
                    .Where(x => x.Answer.FinishedAt <= answerDates.DateTo);
            }

            answerQueryable = answerQueryable
                .Where(x => x.Answer.QuestionSetId == dashboardSurveyId);

            if (dashboardItem.FilterQuestionId != null && dashboardItem.FilterAnswerId != null)
            {
                var answerIds = answerQueryable
                    .Where(y => y.QuestionId == dashboardItem.FilterQuestionId &&
                                y.OptionId == dashboardItem.FilterAnswerId)
                    .Select(y => y.AnswerId)
                    .ToList();

                answerQueryable = answerQueryable
                    .Where(x => answerIds
                        .Contains(x.AnswerId))
                    .Where(x => x.QuestionId == dashboardItem.FirstQuestionId);
            }
            else
            {
                answerQueryable = answerQueryable
                    .Where(x => x.QuestionId == dashboardItem.FirstQuestionId);
            }

            // Question type == Text
            if (dashboardItemModel.FirstQuestionType == Constants.QuestionTypes.Text)
            {
                if (dashboardLocationId != null)
                {
                    answerQueryable = answerQueryable
                        .Where(x => x.Answer.SiteId == dashboardLocationId);
                }
                else if (dashboardLocationTagId != null)
                {
                    answerQueryable = answerQueryable
                        .Where(x => x.Answer.Site.SiteTags.Any(
                            y => y.TagId == dashboardLocationTagId));
                }

                var textData = await answerQueryable
                    .Select(x => new DashboardItemTextQuestionDataModel
                    {
                        Date = x.Answer.FinishedAt,
                        LocationName = x.Answer.Site.Name,
                        Commentary = x.Value,
                        Id = x.Answer.Id,
                    }).Where(y => !string.IsNullOrEmpty(y.Commentary))
                    .OrderBy(t => t.Date)
                    .ToListAsync();

                dashboardItemModel.TextQuestionData.AddRange(textData);
            }
            else
            {
                // Question type != Text
                if (!dashboardItem.CompareEnabled)
                {
                    if (dashboardLocationId != null)
                    {
                        answerQueryable = answerQueryable
                            .Where(x => x.Answer.SiteId == dashboardLocationId);
                    }
                    else if (dashboardLocationTagId != null)
                    {
                        answerQueryable = answerQueryable
                            .Where(x => x.Answer.Site.SiteTags.Any(
                                y => y.TagId == dashboardLocationTagId));
                    }
                }

                var ignoreOptions = new List<Option>();

                if (dashboardItem.IgnoredAnswerValues
                    .Any(x => x.WorkflowState != Constants.WorkflowStates.Removed))
                {
                    var optionIds = dashboardItem.IgnoredAnswerValues
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(x => x.AnswerId)
                        .ToArray();

                    answerQueryable = answerQueryable
                        .Where(x => !optionIds.Contains(x.OptionId));

                    ignoreOptions = await sdkContext.Options.Where(x => optionIds.Contains(x.Id)).ToListAsync();
                }

                var data = new List<ChartDataItem>();
                if (isComparedData)
                {
                    var tagIds = new List<int>();
                    if (dashboardItem.CompareEnabled)
                    {
                        tagIds = dashboardItem.CompareLocationsTags
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.TagId != null)
                            .Select(x => (int)x.TagId)
                            .ToList();
                    }
                    else
                    {
                        if (dashboardLocationTagId != null)
                        {
                            tagIds.Add((int)dashboardLocationTagId);
                        }
                    }

                    var tagsData = new List<ChartDataItem>();
                    foreach (var tagId in tagIds)
                    {
                        var tagData = await answerQueryable
                            .Where(x => x.Answer.Site.SiteTags.Any(
                                y => y.TagId == tagId))
                            .Select(x => new ChartDataItem
                            {
                                Name = GetNameAnswerValue(x, sdkContext),
                                Finished = x.Answer.FinishedAt,
                                LocationTagName = x.Answer.Site.SiteTags
                                    .Where(y => y.TagId == tagId)
                                    .Select(y => y.Tag.Name)
                                    .FirstOrDefault(),
                                LocationTagId = (int)x.Answer.Site.SiteTags
                                    .Where(y => y.TagId == tagId)
                                    .Select(y => y.TagId)
                                    .FirstOrDefault(),
                                IsTag = true,
                                Weight = x.Option.WeightValue,
                                OptionIndex = x.Option.OptionIndex,
                                AnswerId = x.AnswerId,
                            })
                            .ToListAsync();

                        tagsData.AddRange(tagData);
                    }

                    var siteIds = new List<int>();
                    if (dashboardItem.CompareEnabled)
                    {
                        siteIds = dashboardItem.CompareLocationsTags
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.LocationId != null)
                            .Select(x => (int)x.LocationId)
                            .ToList();
                    }
                    else
                    {
                        if (dashboardLocationId != null)
                        {
                            siteIds.Add((int)dashboardLocationId);
                        }
                    }

                    var sitesData = await answerQueryable
                        .Where(x => siteIds.Contains(x.Answer.SiteId))
                        .Select(x => new ChartDataItem
                        {
                            Name = GetNameAnswerValue(x, sdkContext),
                            Finished = x.Answer.FinishedAt,
                            LocationTagName = x.Answer.Site.Name,
                            LocationTagId = x.Answer.SiteId,
                            IsTag = false,
                            Weight = x.Option.WeightValue,
                            OptionIndex = x.Option.OptionIndex,
                            AnswerId = x.AnswerId,
                        })
                        .ToListAsync();

                    data.AddRange(tagsData);
                    data.AddRange(sitesData);
                    data = data.OrderBy(t => t.Finished).ToList();
                }
                else
                {
                    if (dashboardLocationId != null)
                    {
                        data = await answerQueryable
                            .Select(x => new ChartDataItem
                            {
                                Name = GetNameAnswerValue(x, sdkContext),
                                Finished = x.Answer.FinishedAt,
                                LocationTagName = x.Answer.Site.Name,
                                LocationTagId = x.Answer.SiteId,
                                IsTag = false,
                                Weight = x.Option.WeightValue,
                                OptionIndex = x.Option.OptionIndex,
                                AnswerId = x.AnswerId
                            })
                            .OrderBy(t => t.Finished)
                            .ToListAsync();
                    }

                    if (dashboardLocationTagId != null)
                    {
                        data = await answerQueryable
                            .Select(x => new ChartDataItem
                            {
                                Name = GetNameAnswerValue(x, sdkContext),
                                Finished = x.Answer.FinishedAt,
                                LocationTagName = x.Answer.Site.SiteTags
                                    .Where(y => y.TagId == dashboardLocationTagId)
                                    .Select(y => y.Tag.Name)
                                    .FirstOrDefault(),
                                LocationTagId = (int)x.Answer.Site.SiteTags
                                    .Where(y => y.TagId == dashboardLocationTagId)
                                    .Select(y => y.TagId)
                                    .FirstOrDefault(),
                                IsTag = true,
                                Weight = x.Option.WeightValue,
                                OptionIndex = x.Option.OptionIndex,

                                AnswerId = x.AnswerId,
                            })
                            .OrderBy(t => t.Finished)
                            .ToListAsync();
                    }
                }

                // Get question type
                var questionTypeData = await sdkContext.Questions
                    .AsNoTracking()
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.Id == dashboardItem.FirstQuestionId)
                    .Select(x => new
                    {
                        IsSmiley = x.IsSmiley(),
                        IsMulti = x.QuestionType == Constants.QuestionTypes.Multi,
                    })
                    .FirstOrDefaultAsync();


                var isSmiley = questionTypeData.IsSmiley;
                var isMulti = questionTypeData.IsMulti;

                // Count of answers
                var answerDataCount = data.Select(u => u.AnswerId)
                    .Distinct()
                    .Count();

                List<string> lines;
                if (dashboardItem.CalculateAverage)
                {
                    lines = data
                        .GroupBy(x => x.LocationTagName)
                        .OrderBy(x => x.Key)
                        .Select(x => x.Key)
                        .ToList();
                }
                else
                {
                    lines = data
                        .GroupBy(x => x.Name)
                        .OrderBy(x => x.Key)
                        .Select(x => x.Key)
                        .ToList();
                }

                if (singleData)
                {
                    var count = data.Count;

                    var groupedData = new List<DashboardViewChartDataSingleModel>();
                    if (isMulti)
                    {
                        groupedData = data
                            .GroupBy(x => new { x.Name, x.OptionIndex })
                            .Select(x => new DashboardViewChartDataSingleModel
                            {
                                Name = x.Key.Name,
                                DataCount = x.Count(),
                                Value = GetDataPercentage(x.Count(), answerDataCount),
                                OptionIndex = x.Key.OptionIndex
                            })
                            .ToList();
                    }
                    else
                    {
                        groupedData = data
                            .GroupBy(x => new { x.Name, x.OptionIndex })
                            .Select(x => new DashboardViewChartDataSingleModel
                            {
                                Name = x.Key.Name,
                                DataCount = x.Count(),
                                Value = GetDataPercentage(x.Count(), count),
                                OptionIndex = x.Key.OptionIndex
                            })
                            .ToList();
                    }

                    var options = sdkContext.Options.Where(x => x.QuestionId == dashboardItem.FirstQuestionId)
                        .ToList();
                    if (isSmiley)
                    {
                        var ignoredValues = ignoreOptions.Where(x => smileyLabels.Any(y => y.Weight == x.Weight)).ToList();
                        var tmpData = new List<DashboardViewChartDataSingleModel>();
                        if (ignoredValues.Any() && options.Any(x => smileyLabels.Any(y => y.Weight == x.WeightValue)))
                        {
                            ignoredValues.ForEach(x => tmpData.Add(new DashboardViewChartDataSingleModel
                            { Name = x.WeightValue.ToString(), Value = 0 }));
                        }


                        foreach (var tmpDataModel in tmpData)
                        {
                            var chartDataSingleModel = groupedData
                                .FirstOrDefault(x => x.Name == tmpDataModel.Name);

                            if (chartDataSingleModel != null)
                            {
                                var parseResult = int.TryParse(chartDataSingleModel.Name, out var labelNumber);
                                if (parseResult)
                                {
                                    tmpDataModel.Name = smileyLabels.Single(z => z.Weight == labelNumber).Name;
                                    tmpDataModel.Value = chartDataSingleModel.Value;
                                    tmpDataModel.DataCount = chartDataSingleModel.DataCount;
                                    tmpDataModel.OptionIndex = chartDataSingleModel.OptionIndex;
                                }
                            }
                            else
                            {
                                var parseResult = int.TryParse(tmpDataModel.Name, out var labelNumber);
                                if (parseResult)
                                {
                                    tmpDataModel.Name = smileyLabels.Single(z => z.Weight == labelNumber).Name;
                                    tmpDataModel.Value = 0;
                                    tmpDataModel.DataCount = 0;
                                    var option = options.SingleOrDefault(x => x.WeightValue == labelNumber);
                                    if (option == null)
                                    {
                                        //Log.LogException($"ChartDataHelpers. we could not find a OptionsIndex for option with labelNumber {labelNumber} for question {dashboardItem.FirstQuestionId}");
                                    }
                                    tmpDataModel.OptionIndex = option != null ? options.Single(x => x.WeightValue == labelNumber).OptionIndex : 0;
                                }
                            }
                        }

                        groupedData = tmpData;
                    }
                    else
                    {
                        var tmpData = groupedData;
                        foreach (Option option in options)
                        {
                            OptionTranslation optionTranslation = await sdkContext.OptionTranslations.FirstAsync(x =>
                                x.OptionId == option.Id && x.WorkflowState != Constants.WorkflowStates.Removed);
                            var optionName = optionTranslation.Name;
                            if (!groupedData.Any(x => x.Name.Contains(optionName)))
                            {
                                DashboardViewChartDataSingleModel dashboardViewChartDataSingleModel = new DashboardViewChartDataSingleModel()
                                {
                                    AnswersDataCount = 0,
                                    DataCount = 0,
                                    OptionIndex = option.OptionIndex,
                                    Name = optionName,
                                    Value = 0
                                };
                                if (ignoreOptions.SingleOrDefault(x => x.Id == option.Id) == null)
                                {
                                    tmpData.Add(dashboardViewChartDataSingleModel);
                                }
                            }
                        }
                        groupedData = tmpData;
                    }

                    groupedData = groupedData.OrderBy(x => x.OptionIndex).ToList();

                    var rawData = ChartRawDataHelpers.ConvertSingleData(localizationService, groupedData, isMulti, answerDataCount);

                    // Convert data for pie chart
                    if (dashboardItem.ChartType == DashboardChartTypes.AdvancedPie ||
                        dashboardItem.ChartType == DashboardChartTypes.PieGrid)
                    {
                        foreach (var singleModel in groupedData)
                        {
                            singleModel.Value = singleModel.DataCount;
                        }
                    }

                    dashboardItemModel.ChartData.RawData = rawData;
                    dashboardItemModel.ChartData.Single.AddRange(groupedData);
                }
                else
                {
                    var multiData = new List<DashboardViewChartDataMultiModel>();
                    var multiStackedData = new List<DashboardViewChartDataMultiStackedModel>();
                    var multiStackedRawData = new List<DashboardViewChartDataMultiStackedModel>();
                    switch (dashboardItem.Period)
                    {
                        case DashboardPeriodUnits.Week:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => new { x.LocationTagName, x.IsTag })
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                        Name = x.Key.LocationTagName, // Location or tag name
                                        IsTag = x.Key.IsTag,
                                        Series = x
                                            .GroupBy(y => ChartHelpers.GetWeekString(y.Finished))
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // Week name
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = x.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Weight == int.Parse(i.Key.Name)).Name
                                                            : i.Key.Name,
                                                        OptionIndex = i.Key.OptionIndex,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();

                                multiStackedRawData = data
                                    .GroupBy(ms => ChartHelpers.GetWeekString(ms.Finished))
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Name = x.Key, // Week
                                        Series = x
                                            .GroupBy(ms => new { ms.LocationTagName, ms.IsTag })
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Id = y.Select(i => i.LocationTagId).FirstOrDefault(),
                                                Name = y.Key.LocationTagName, // Location
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = y.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Weight == int.Parse(i.Key.Name))
                                                                .Name
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(y => new { y.LocationTagName, y.IsTag })
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                            Name = x.Key.LocationTagName, // Location or tag name
                                            IsTag = x.Key.IsTag,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x
                                                .GroupBy(y => ChartHelpers.GetWeekString(y.Finished))
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(x => ChartHelpers.GetWeekString(x.Finished))
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key.ToString(),
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x.GroupBy(g => new { g.Name, g.OptionIndex })
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Weight == int.Parse(y.Key.Name)).Name
                                                        : y.Key.Name,
                                                    DataCount = y.Count(),
                                                    OptionIndex = y.Key.OptionIndex,
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : isMulti
                                                            ? GetDataPercentage(y.Count(), GetAnswersCount(x))
                                                            : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .OrderBy(f => f.OptionIndex)
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.Month:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => new { x.LocationTagName, x.IsTag })
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                        Name = x.Key.LocationTagName, // Location or tag name
                                        IsTag = x.Key.IsTag,
                                        Series = x
                                            .GroupBy(ms => ChartHelpers.GetMonthString(ms.Finished))
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // Month name
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = x.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Weight == int.Parse(i.Key.Name)).Name
                                                            : i.Key.Name,
                                                        OptionIndex = i.Key.OptionIndex,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            // .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();

                                multiStackedRawData = data
                                    .GroupBy(ms => ChartHelpers.GetMonthString(ms.Finished))
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Name = x.Key, // Month
                                        Series = x
                                            .GroupBy(ms => new { ms.LocationTagName, ms.IsTag })
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Id = y.Select(i => i.LocationTagId).FirstOrDefault(),
                                                Name = y.Key.LocationTagName, // Location
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = y.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Weight == int.Parse(i.Key.Name))
                                                                .Name
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            //.OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(y => new { y.LocationTagName, y.IsTag })
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                            Name = x.Key.LocationTagName, // Location or tag name
                                            IsTag = x.Key.IsTag,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x
                                                .GroupBy(ms => ChartHelpers.GetMonthString(ms.Finished))
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(ms => ChartHelpers.GetMonthString(ms.Finished))
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key.ToString(),
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x.GroupBy(g => new { g.Name, g.OptionIndex })
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Weight == int.Parse(y.Key.Name)).Name
                                                        : y.Key.Name,
                                                    OptionIndex = y.Key.OptionIndex,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : isMulti
                                                            ? GetDataPercentage(y.Count(), GetAnswersCount(x))
                                                            : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .OrderBy(f => f.OptionIndex)
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.Quarter:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => new { x.LocationTagName, x.IsTag })
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                        Name = x.Key.LocationTagName, // Location or tag name
                                        IsTag = x.Key.IsTag,
                                        Series = x
                                            .GroupBy(item =>
                                                $"{item.Finished:yy}_K{((item.Finished.Month - 1) / 3) + 1}")
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // Quarter name
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = x.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Weight == int.Parse(i.Key.Name)).Name
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();

                                multiStackedRawData = data
                                    .GroupBy(ms => $"{ms.Finished:yy}_K{((ms.Finished.Month - 1) / 3) + 1}")
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Name = x.Key, // Quarter
                                        Series = x
                                            .GroupBy(ms => new { ms.LocationTagName, ms.IsTag })
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Id = y.Select(i => i.LocationTagId).FirstOrDefault(),
                                                Name = y.Key.LocationTagName, // Location
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = y.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Weight == int.Parse(i.Key.Name))
                                                                .Name
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(y => new { y.LocationTagName, y.IsTag })
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                            Name = x.Key.LocationTagName, // Location or tag name
                                            IsTag = x.Key.IsTag,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x.GroupBy(item =>
                                                    $"{item.Finished:yy}_K{((item.Finished.Month - 1) / 3) + 1}")
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(item => $"{item.Finished:yy}_K{((item.Finished.Month - 1) / 3) + 1}")
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x.GroupBy(g => new { g.Name, g.OptionIndex })
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Weight == int.Parse(y.Key.Name)).Name
                                                        : y.Key.Name,
                                                    DataCount = y.Count(),
                                                    OptionIndex = y.Key.OptionIndex,
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : isMulti
                                                            ? GetDataPercentage(y.Count(), GetAnswersCount(x))
                                                            : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .OrderBy(f => f.OptionIndex)
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.SixMonth:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => new { x.LocationTagName, x.IsTag })
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                        Name = x.Key.LocationTagName, // Location or tag name
                                        IsTag = x.Key.IsTag,
                                        Series = x
                                            .GroupBy(item =>
                                                $"{item.Finished:yy}_{ChartHelpers.GetHalfOfYear(item.Finished)}H")
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // SixMonth name
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = x.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Weight == int.Parse(i.Key.Name)).Name
                                                            : i.Key.Name,
                                                        OptionIndex = i.Key.OptionIndex,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();

                                multiStackedRawData = data
                                    .GroupBy(ms => $"{ms.Finished:yy}_{ChartHelpers.GetHalfOfYear(ms.Finished)}H")
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Name = x.Key, // Half of year
                                        Series = x
                                            .GroupBy(ms => new { ms.LocationTagName, ms.IsTag })
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Id = y.Select(i => i.LocationTagId).FirstOrDefault(),
                                                Name = y.Key.LocationTagName, // Location
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = y.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Weight == int.Parse(i.Key.Name))
                                                                .Name
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(y => new { y.LocationTagName, y.IsTag })
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                            Name = x.Key.LocationTagName, // Location or tag name
                                            IsTag = x.Key.IsTag,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x
                                                .GroupBy(item =>
                                                    $"{item.Finished:yy}_{ChartHelpers.GetHalfOfYear(item.Finished)}H")
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(item =>
                                            $"{item.Finished:yy}_{ChartHelpers.GetHalfOfYear(item.Finished)}H")
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x.GroupBy(g => new { g.Name, g.OptionIndex })
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Weight == int.Parse(y.Key.Name)).Name
                                                        : y.Key.Name,
                                                    OptionIndex = y.Key.OptionIndex,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : isMulti
                                                            ? GetDataPercentage(y.Count(), GetAnswersCount(x))
                                                            : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .OrderBy(f => f.OptionIndex)
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.Year:
                            if (isStackedData)
                            {
                                multiStackedData = data
                                    .GroupBy(x => new { x.LocationTagName, x.IsTag })
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                        Name = x.Key.LocationTagName, // Location or tag name
                                        IsTag = x.Key.IsTag,
                                        Series = x
                                            .GroupBy(ms => $"{ms.Finished:yyyy}")
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Name = y.Key, // Year name
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = x.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Weight == int.Parse(i.Key.Name)).Name
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();

                                multiStackedRawData = data
                                    .GroupBy(ms => $"{ms.Finished:yyyy}")
                                    .Select(x => new DashboardViewChartDataMultiStackedModel
                                    {
                                        Name = x.Key, // Year
                                        Series = x
                                            .GroupBy(ms => new { ms.LocationTagName, ms.IsTag })
                                            .Select(y => new DashboardViewChartDataMultiModel
                                            {
                                                Id = y.Select(i => i.LocationTagId).FirstOrDefault(),
                                                Name = y.Key.LocationTagName, // Location
                                                AnswersCount = GetAnswersCount(y),
                                                IsTag = y.Key.IsTag,
                                                Series = y
                                                    .GroupBy(g => new { g.Name, g.OptionIndex })
                                                    .Select(i => new DashboardViewChartDataSingleModel
                                                    {
                                                        OptionIndex = i.Key.OptionIndex,
                                                        Name = isSmiley
                                                            ? smileyLabels.Single(z => z.Weight == int.Parse(i.Key.Name)).Name
                                                            : i.Key.Name,
                                                        DataCount = i.Count(),
                                                        Value = isMulti
                                                            ? GetDataPercentage(i.Count(), GetAnswersCount(y))
                                                            : GetDataPercentage(i.Count(), y.Count()),
                                                    })
                                                    .OrderByDescending(
                                                        t => t.Name.All(char.IsDigit) ? int.Parse(t.Name) : 0)
                                                    .ThenBy(f => f.OptionIndex)
                                                    .ToList(),
                                            })
                                            .OrderBy(y => y.Name)
                                            .ToList(),
                                    }).ToList();
                            }
                            else
                            {
                                if (isComparedData)
                                {
                                    multiData = data
                                        .GroupBy(y => new { y.LocationTagName, y.IsTag })
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Id = x.Select(i => i.LocationTagId).FirstOrDefault(),
                                            Name = x.Key.LocationTagName, // Location or tag name
                                            IsTag = x.Key.IsTag,
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x
                                                .GroupBy(ms => $"{ms.Finished:yyyy}")
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    Name = y.Key,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .ToList(),
                                        }).ToList();
                                }
                                else
                                {
                                    multiData = data
                                        .GroupBy(ms => $"{ms.Finished:yyyy}")
                                        .Select(x => new DashboardViewChartDataMultiModel
                                        {
                                            Name = x.Key.ToString(),
                                            AnswersCount = GetAnswersCount(x),
                                            Series = x.GroupBy(y => new { y.Name, y.OptionIndex })
                                                .Select(y => new DashboardViewChartDataSingleModel
                                                {
                                                    OptionIndex = y.Key.OptionIndex,
                                                    Name = isSmiley
                                                        ? smileyLabels.Single(z => z.Weight == int.Parse(y.Key.Name)).Name
                                                        : y.Key.Name,
                                                    DataCount = y.Count(),
                                                    Value = dashboardItem.CalculateAverage
                                                        ? GetAverageDataPercentage(y.Average(k => k.Weight))
                                                        : isMulti
                                                            ? GetDataPercentage(y.Count(), GetAnswersCount(x))
                                                            : GetDataPercentage(y.Count(), x.Count()),
                                                })
                                                .OrderBy(f => f.OptionIndex)
                                                .ToList(),
                                        }).ToList();
                                }
                            }

                            break;
                        case DashboardPeriodUnits.Total:
                            var totalPeriod = new DashboardViewChartDataMultiModel
                            {
                                Name = localizationService.GetString("TotalPeriod")
                            };

                            totalPeriod.Series = data
                                .GroupBy(g => new { g.Name, g.OptionIndex })
                                .Select(x => new DashboardViewChartDataSingleModel
                                {
                                    Name = isSmiley ? smileyLabels.Single(z => z.Weight == int.Parse(x.Key.Name)).Name : x.Key.Name,
                                    OptionIndex = x.Key.OptionIndex,
                                    DataCount = x.Count(),
                                    Value = dashboardItem.CalculateAverage
                                        ? GetAverageDataPercentage(x.Average(k => k.Weight))
                                        : GetDataPercentage(x.Count(), data.Count),
                                })
                                .OrderBy(f => f.OptionIndex)
                                .ToList();
                            multiData.Add(totalPeriod);
                            break;
                        default:
                            throw new ArgumentOutOfRangeException();
                    }

                    if (dashboardItem.ChartType == DashboardChartTypes.Line)
                    {
                        if (dashboardItem.CalculateAverage)
                        {
                            var lineData = new List<DashboardViewChartDataMultiModel>();
                            var newLineData = new List<DashboardViewChartDataMultiModel>();
                            if (!multiData.Any())
                            {
                                foreach (var line in lines)
                                {
                                    var multiItem = new DashboardViewChartDataMultiModel
                                    {
                                        Name = isSmiley && !isComparedData ? smileyLabels.Single(z => z.Weight == int.Parse(line)).Name : line,
                                    };

                                    foreach (var groupedItem in multiData)
                                    {
                                        foreach (var item in groupedItem.Series)
                                        {
                                            if (item.Name == (isSmiley && !isComparedData
                                                    ? smileyLabels.Single(z => z.Weight == int.Parse(line)).Name
                                                    : line))
                                            {
                                                var singleItem = new DashboardViewChartDataSingleModel
                                                {
                                                    Name = groupedItem.Name,
                                                    Value = item.Value,
                                                    DataCount = item.DataCount,
                                                    OptionIndex = item.OptionIndex
                                                };
                                                multiItem.Series.Add(singleItem);
                                            }
                                        }
                                    }

                                    lineData.Add(multiItem);
                                }

                                var columnNames = new List<string>();
                                var lineNames = new List<string>();

                                foreach (var model in lineData)
                                {
                                    if (!lineNames.Contains(model.Name))
                                    {
                                        lineNames.Add(model.Name);
                                    }

                                    foreach (var dashboardViewChartDataSingleModel in model.Series)
                                    {
                                        if (!columnNames.Contains(dashboardViewChartDataSingleModel.Name))
                                        {
                                            columnNames.Add(dashboardViewChartDataSingleModel.Name);
                                        }
                                    }
                                }

                                if (dashboardItem.Period != DashboardPeriodUnits.Month)
                                {
                                    columnNames.Sort();
                                }

                                lineNames.Sort();

                                if (isSmiley)
                                {
                                    var options = sdkContext.Options.Where(x => x.QuestionId == dashboardItem.FirstQuestionId)
                                        .ToList();
                                    if (ignoreOptions.Any(x => options.Any(y => x.WeightValue == y.WeightValue)))
                                    {
                                        ignoreOptions.Where(x => options.Any(y => x.WeightValue == y.WeightValue))
                                            .ToList().ForEach(x =>
                                                newLineData.Add(new DashboardViewChartDataMultiModel
                                                { Name = smileyLabels.Single(y => y.Weight == x.WeightValue).Name }));
                                    }

                                    foreach (var model in newLineData)
                                    {
                                        foreach (var columnName in columnNames)
                                        {
                                            var singleItem = new DashboardViewChartDataSingleModel
                                            {
                                                Name = columnName,
                                                Value = 0,
                                            };
                                            model.Series.Add(singleItem);
                                        }
                                    }

                                    foreach (var model in newLineData)
                                    {
                                        foreach (var multiModel in lineData)
                                        {
                                            if (model.Name == multiModel.Name)
                                            {
                                                foreach (var series in multiModel.Series)
                                                {
                                                    foreach (var modelSeries in model.Series)
                                                    {
                                                        if (modelSeries.Name == series.Name)
                                                        {
                                                            modelSeries.Value = series.Value;
                                                            modelSeries.DataCount = series.DataCount;
                                                            modelSeries.OptionIndex = series.OptionIndex;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    foreach (var lineName in lineNames)
                                    {
                                        var multiItem = new DashboardViewChartDataMultiModel
                                        {
                                            Name = lineName,
                                        };

                                        foreach (var columnName in columnNames)
                                        {
                                            var singleItem = new DashboardViewChartDataSingleModel
                                            {
                                                Name = columnName,
                                                Value = 0,
                                            };
                                            multiItem.Series.Add(singleItem);
                                        }

                                        newLineData.Add(multiItem);
                                    }

                                    foreach (var model in newLineData)
                                    {
                                        foreach (var multiModel in lineData)
                                        {
                                            if (model.Name == multiModel.Name)
                                            {
                                                foreach (var series in multiModel.Series)
                                                {
                                                    foreach (var modelSeries in model.Series)
                                                    {
                                                        if (modelSeries.Name == series.Name)
                                                        {
                                                            modelSeries.Value = series.Value;
                                                            modelSeries.DataCount = series.DataCount;
                                                            modelSeries.OptionIndex = series.OptionIndex;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                newLineData = multiData;
                            }

                            // Sort by location position
                            if (isComparedData && lines.Any())
                            {
                                if (dashboardItem.CompareEnabled == false)
                                {
                                    newLineData =
                                        ChartHelpers.SortMultiDataLocationPosition(
                                            newLineData,
                                            dashboardItem,
                                            dashboardLocationId,
                                            dashboardLocationTagId);
                                }
                                else
                                {
                                    newLineData =
                                        ChartHelpers.SortMultiDataLocationPosition(
                                            newLineData,
                                            dashboardItem,
                                            null,
                                            null);
                                }
                            }

                            var rawData = ChartRawDataHelpers.ConvertMultiData(localizationService, newLineData, true, isMulti);
                            dashboardItemModel.ChartData.RawData = rawData;
                            dashboardItemModel.ChartData.Multi.AddRange(newLineData);
                        }
                        else
                        {
                            var lineData = new List<DashboardViewChartDataMultiModel>();
                            foreach (var line in lines)
                            {
                                var multiItem = new DashboardViewChartDataMultiModel
                                {
                                    Name = isSmiley ? smileyLabels.Single(z => z.Weight == int.Parse(line)).Name : line,
                                };

                                foreach (var groupedItem in multiData)
                                {
                                    foreach (var item in groupedItem.Series)
                                    {
                                        if (item.Name == (isSmiley
                                                ? smileyLabels.Single(z => z.Weight == int.Parse(line)).Name
                                                : line))
                                        {
                                            var singleItem = new DashboardViewChartDataSingleModel
                                            {
                                                Name = groupedItem.Name,
                                                Value = item.Value,
                                                DataCount = item.DataCount,
                                                OptionIndex = item.OptionIndex
                                            };

                                            var count = multiData
                                                .Where(x => x.Name == groupedItem.Name)
                                                .Select(x => x.AnswersCount)
                                                .FirstOrDefault();

                                            if (count > 0)
                                            {
                                                singleItem.AnswersDataCount = count;
                                            }

                                            multiItem.Series.Add(singleItem);
                                        }
                                    }
                                }

                                lineData.Add(multiItem);
                            }

                            var columnNames = new List<string>();
                            var lineNames = new List<string>();

                            foreach (var model in lineData)
                            {
                                if (!lineNames.Contains(model.Name))
                                {
                                    lineNames.Add(model.Name);
                                }

                                foreach (var dashboardViewChartDataSingleModel in model.Series)
                                {
                                    if (!columnNames.Contains(dashboardViewChartDataSingleModel.Name))
                                    {
                                        columnNames.Add(dashboardViewChartDataSingleModel.Name);
                                    }
                                }
                            }

                            if (dashboardItem.Period != DashboardPeriodUnits.Month)
                            {
                                columnNames.Sort();
                            }
                            lineNames.Sort();

                            var newLineData = new List<DashboardViewChartDataMultiModel>();

                            if (isSmiley)
                            {
                                var options = sdkContext.Options.Where(x => x.QuestionId == dashboardItem.FirstQuestionId)
                                    .ToList();
                                if (ignoreOptions.Any(x => options.Any(y => x.WeightValue == y.WeightValue)))
                                {
                                    ignoreOptions.Where(x => options.Any(y => x.WeightValue == y.WeightValue))
                                        .ToList().ForEach(x =>
                                            newLineData.Add(new DashboardViewChartDataMultiModel
                                            { Name = smileyLabels.Single(y => y.Weight == x.WeightValue).Name }));
                                }

                                foreach (var model in newLineData)
                                {
                                    foreach (var columnName in columnNames)
                                    {
                                        var singleItem = new DashboardViewChartDataSingleModel
                                        {
                                            Name = columnName,
                                            Value = 0,
                                        };
                                        model.Series.Add(singleItem);
                                    }
                                }

                                foreach (var model in newLineData)
                                {
                                    foreach (var multiModel in lineData)
                                    {
                                        if (model.Name == multiModel.Name)
                                        {
                                            foreach (var series in multiModel.Series)
                                            {
                                                foreach (var modelSeries in model.Series)
                                                {
                                                    if (modelSeries.Name == series.Name)
                                                    {
                                                        modelSeries.Value = series.Value;
                                                        modelSeries.DataCount = series.DataCount;
                                                        modelSeries.OptionIndex = series.OptionIndex;
                                                        modelSeries.AnswersDataCount = series.AnswersDataCount;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                foreach (var lineName in lineNames)
                                {
                                    var multiItem = new DashboardViewChartDataMultiModel
                                    {
                                        Name = lineName,
                                    };

                                    foreach (var columnName in columnNames)
                                    {
                                        var singleItem = new DashboardViewChartDataSingleModel
                                        {
                                            Name = columnName,
                                            Value = 0,
                                        };
                                        multiItem.Series.Add(singleItem);
                                    }

                                    newLineData.Add(multiItem);
                                }

                                foreach (var model in newLineData)
                                {
                                    foreach (var multiModel in lineData)
                                    {
                                        if (model.Name == multiModel.Name)
                                        {
                                            foreach (var series in multiModel.Series)
                                            {
                                                foreach (var modelSeries in model.Series)
                                                {
                                                    if (modelSeries.Name == series.Name)
                                                    {
                                                        modelSeries.Value = series.Value;
                                                        modelSeries.DataCount = series.DataCount;
                                                        modelSeries.OptionIndex = series.OptionIndex;
                                                        modelSeries.AnswersDataCount = series.AnswersDataCount;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // Sort by location position
                            if (isComparedData)
                            {
                                if (dashboardItem.CompareEnabled == false)
                                {
                                    newLineData =
                                        ChartHelpers.SortMultiDataLocationPosition(
                                            newLineData,
                                            dashboardItem,
                                            dashboardLocationId,
                                            dashboardLocationTagId);
                                }
                                else
                                {
                                    newLineData =
                                        ChartHelpers.SortMultiDataLocationPosition(
                                            newLineData,
                                            dashboardItem,
                                            null,
                                            null);
                                }
                            }

                            var rawData = ChartRawDataHelpers.ConvertMultiData(localizationService, newLineData, true, isMulti);
                            dashboardItemModel.ChartData.RawData = rawData;
                            dashboardItemModel.ChartData.Multi.AddRange(newLineData);
                        }
                    }
                    else
                    {
                        if (!isStackedData)
                        {
                            var columnNames = new List<string>();
                            var lineNames = new List<string>();

                            if (multiData.Any())
                            {
                                foreach (var multiDataModel in multiData)
                                {
                                    if (!columnNames.Contains(multiDataModel.Name))
                                    {
                                        columnNames.Add(multiDataModel.Name);
                                    }

                                    foreach (var dashboardViewChartDataSingleModel in multiDataModel.Series)
                                    {
                                        if (!lineNames.Contains(dashboardViewChartDataSingleModel.Name))
                                        {
                                            lineNames.Add(dashboardViewChartDataSingleModel.Name);
                                        }
                                    }
                                }
                            }
                            else
                            {
                                columnNames.Add(localizationService.GetString("NoData"));
                            }

                            var newLineData = new List<DashboardViewChartDataMultiModel>();

                            var options = sdkContext.Options.Where(x => x.QuestionId == dashboardItem.FirstQuestionId)
                                .ToList();
                            if (isSmiley)
                            {
                                foreach (var columnName in columnNames)
                                {
                                    var model = new DashboardViewChartDataMultiModel { Name = columnName };
                                    if (ignoreOptions.Any(x => options.Any(y => x.WeightValue == y.WeightValue)))
                                    {
                                        ignoreOptions.Where(x => options.Any(y => x.WeightValue == y.WeightValue))
                                            .ToList().ForEach(x =>
                                                model.Series.Add(new DashboardViewChartDataSingleModel
                                                { Name = smileyLabels.Single(y => y.Weight == x.WeightValue).Name, Value = 0}));
                                    }
                                    newLineData.Add(model);
                                }

                                foreach (var model in newLineData)
                                {
                                    foreach (var multiModel in multiData.Where(x => x.Name == model.Name).ToList())
                                    {
                                        foreach (var series in multiModel.Series)
                                        {
                                            foreach (var modelSeries in model.Series.Where(x => x.Name == series.Name).ToList())
                                            {
                                                modelSeries.Value = series.Value;
                                                modelSeries.DataCount = series.DataCount;
                                                modelSeries.OptionIndex = series.OptionIndex;
                                            }
                                        }
                                    }
                                }
                            }
                            else if (isMulti)
                            {
                                foreach (var stackedModel in multiData)
                                {
                                    var newStackedModel = new DashboardViewChartDataMultiModel
                                    {
                                        Id = stackedModel.Id,
                                        Name = stackedModel.Name,
                                        AnswersCount = stackedModel.AnswersCount,
                                        IsTag = stackedModel.IsTag,
                                        Series = stackedModel.Series
                                            .OrderBy(x => x.Name)
                                            .ToList(),
                                    };


                                    newLineData.Add(newStackedModel);
                                }
                            }
                            else
                            {
                                foreach (var columnName in columnNames)
                                {
                                    var model = new DashboardViewChartDataMultiModel { Name = columnName };
                                    foreach (Option option in options.OrderBy(x => x.OptionIndex))
                                    {
                                        string optionTranslationName = sdkContext.OptionTranslations
                                            .First(ws => ws.WorkflowState != Constants.WorkflowStates.Removed
                                                         && ws.OptionId == option.Id).Name;
                                        model.Series.Add(new DashboardViewChartDataSingleModel
                                        {
                                            Name = optionTranslationName,
                                            Value = 0,
                                            DataCount = 0,
                                            OptionIndex = 0,
                                            AnswersDataCount = 0
                                        });
                                    }
                                    newLineData.Add(model);
                                }

                                foreach (var model in multiData)
                                {
                                    foreach (var newModel in newLineData)
                                    {
                                        if (model.Name == newModel.Name)
                                        {
                                            foreach (var newModelSeries in newModel.Series)
                                            {
                                                foreach (var modelSeries in model.Series)
                                                {
                                                    if (newModelSeries.Name == modelSeries.Name)
                                                    {
                                                        newModelSeries.Value = modelSeries.Value;
                                                        newModelSeries.DataCount = modelSeries.DataCount;
                                                        newModelSeries.OptionIndex = modelSeries.OptionIndex;
                                                        newModelSeries.AnswersDataCount = modelSeries.AnswersDataCount;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // Sort by location position
                            if (isComparedData)
                            {
                                if (dashboardItem.CompareEnabled == false)
                                {
                                    newLineData =
                                        ChartHelpers.SortMultiDataLocationPosition(
                                            newLineData,
                                            dashboardItem,
                                            dashboardLocationId,
                                            dashboardLocationTagId);
                                }
                                else
                                {
                                    newLineData =
                                        ChartHelpers.SortMultiDataLocationPosition(
                                            newLineData,
                                            dashboardItem,
                                            null,
                                            null);
                                }
                            }

                            var rawData = ChartRawDataHelpers.ConvertMultiData(localizationService, newLineData, false, isMulti);
                            dashboardItemModel.ChartData.RawData = rawData;
                            dashboardItemModel.ChartData.Multi.AddRange(newLineData);
                        }
                        else
                        {
                            multiStackedData =
                                ChartHelpers.SortMultiStackedDataLocationPosition(
                                    multiStackedData,
                                    dashboardItem);

                            multiStackedRawData =
                                ChartHelpers.SortMultiStackedRawDataLocationPosition(
                                    multiStackedRawData,
                                    dashboardItem);

                            if (isSmiley)
                            {
                                var newLineData = new List<DashboardViewChartDataMultiStackedModel>();
                                var columnNames = new List<string>();

                                if (multiStackedData.Any())
                                {
                                    foreach (var stackedModel in multiStackedData)
                                    {
                                        foreach (var modelSeries in stackedModel.Series.Where(x => !columnNames.Contains(x.Name)).ToList())
                                        {
                                                columnNames.Add(modelSeries.Name);
                                        }
                                    }
                                }
                                else
                                {
                                    var model = new DashboardViewChartDataMultiStackedModel()
                                    {
                                        Name = localizationService.GetString("NoData"),
                                        IsTag = false,
                                        Id = 0,
                                    };
                                    multiStackedData.Add(model);
                                    columnNames.Add(localizationService.GetString("NoData"));
                                }

                                var options = sdkContext.Options.Where(x => x.QuestionId == dashboardItem.FirstQuestionId)
                                    .ToList();
                                foreach (var stackedModel in multiStackedData)
                                {
                                    var model = new DashboardViewChartDataMultiStackedModel()
                                    {
                                        Name = stackedModel.Name,
                                        IsTag = stackedModel.IsTag,
                                        Id = stackedModel.Id,
                                    };

                                    foreach (var columnName in columnNames)
                                    {
                                        var innerModel = new DashboardViewChartDataMultiModel() { Name = columnName };
                                        if (ignoreOptions.Any(x => options.Any(y => x.WeightValue == y.WeightValue)))
                                        {
                                            ignoreOptions.Where(x => options.Any(y => x.WeightValue == y.WeightValue))
                                                .ToList().ForEach(x =>
                                                    innerModel.Series.Add(new DashboardViewChartDataSingleModel
                                                        { Name = smileyLabels.Single(z => z.Weight == x.WeightValue).Name, Value = 0 }));
                                        }
                                        model.Series.Add(innerModel);
                                    }

                                    foreach (var modelSeries in stackedModel.Series)
                                    {
                                        var innerModel = model.Series.Single(x => x.Name == modelSeries.Name);


                                        foreach (var innerSeries in modelSeries.Series)
                                        {
                                            foreach (var newInnerSeriesModel in innerModel.Series)
                                            {
                                                if (innerSeries.Name == newInnerSeriesModel.Name)
                                                {
                                                    newInnerSeriesModel.Value = innerSeries.Value;
                                                    newInnerSeriesModel.DataCount = innerSeries.DataCount;
                                                    newInnerSeriesModel.OptionIndex = innerSeries.OptionIndex;
                                                }
                                            }
                                        }
                                    }

                                    newLineData.Add(model);
                                }

                                dashboardItemModel.ChartData.MultiStacked.AddRange(newLineData);
                            }
                            else if (isMulti)
                            {
                                var newLineData = new List<DashboardViewChartDataMultiStackedModel>();

                                foreach (var stackedModel in multiStackedData)
                                {
                                    var newStackedModel = new DashboardViewChartDataMultiStackedModel
                                    {
                                        Id = stackedModel.Id,
                                        Name = stackedModel.Name,
                                        IsTag = stackedModel.IsTag,
                                    };

                                    foreach (var stackedModelSeries in stackedModel.Series)
                                    {
                                        stackedModelSeries.Series = stackedModelSeries.Series
                                            .OrderBy(x => x.Name)
                                            .ToList();
                                    }

                                    newStackedModel.Series = stackedModel.Series
                                        .OrderBy(x => x.Name)
                                        .ToList();

                                    newLineData.Add(newStackedModel);
                                }

                                dashboardItemModel.ChartData.MultiStacked.AddRange(newLineData);
                            }
                            else
                            {
                                dashboardItemModel.ChartData.MultiStacked.AddRange(multiStackedData);
                            }

                            // convert
                            var rawData = ChartRawDataHelpers.ConvertMultiStackedData(
                                dashboardItemModel.ChartData.MultiStacked,
                                multiStackedRawData,
                                isMulti);

                            dashboardItemModel.ChartData.RawData = rawData;
                        }
                    }
                }
            }
        }

        // do not use the ternary operator half-screen, please, it's not readable
        private static string GetNameAnswerValue(AnswerValue x, MicrotingDbContext sdkContext)
        {

            if (x.Question.IsSmiley())
            {
                return x.Option.WeightValue.ToString();
            }

            switch (x.Question.QuestionType)
            {
                case Constants.QuestionTypes.Multi:
                    return x.Option.OptionTranslationses.Where(ot => ot.WorkflowState != Constants.WorkflowStates.Removed)
                        .Join(sdkContext.Options,
                            optionTranslations => optionTranslations.OptionId,
                            options => options.Id,
                            (optionTranslations, options) => new
                            {
                                optionTranslations.Name,
                                options.QuestionId
                            }).Join(sdkContext.QuestionTranslations,
                            preTranslations => preTranslations.QuestionId,
                            questionTranslations => questionTranslations.QuestionId,
                            (preTranslations, questionTranslations) => new
                            {
                                optionname = preTranslations.Name,
                                qtname = questionTranslations.Name,
                                questionTranslations.WorkflowState
                            }).Where(z => z.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(z => $"{z.qtname}_{z.optionname}").First();
                case Constants.QuestionTypes.List:
                case Constants.QuestionTypes.Buttons:
                    return x.Option.OptionTranslationses
                        .Where(ws => ws.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(z => z.Name)
                        .FirstOrDefault();
                default:
                    return x.Value;
            }
        }

        public static async Task CalculateDashboard(DashboardItemViewModel dashboardItemModel,
            MicrotingDbContext sdkContext,
            DashboardItem dashboardItem,
            IInsightDashboardLocalizationService localizationService,
            int? dashboardLocationId,
            int? dashboardLocationTagId,
            int dashboardSurveyId,
            DashboardEditAnswerDates answerDates/*,
            InsightDashboardPnDbContext dbContext*/)
        {
            //var calculateByWeight =
                //dbContext.DashboardItems.FirstOrDefault(x => x.Id == dashboardItem.Id).CalculateByWeight;
            if (dashboardItem.CalculateByWeight)
            {
                await CalculateDashboardItemByWeight(dashboardItemModel, sdkContext, dashboardItem, localizationService,
                    dashboardLocationId, dashboardLocationTagId, dashboardSurveyId, answerDates);
            }
            else
            {
                await CalculateDashboardItem(dashboardItemModel, sdkContext, dashboardItem, localizationService,
                    dashboardLocationId, dashboardLocationTagId, dashboardSurveyId, answerDates);
            }
        }
    }
}