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
    using System.Globalization;
    using System.Linq;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.InsightDashboardBase.Infrastructure.Data.Entities;
    using Models.Dashboards;

    public static class ChartHelpers
    {
        public static List<DashboardViewChartDataMultiStackedModel> SortMultiStackedDataLocationPosition(
            List<DashboardViewChartDataMultiStackedModel> multiStackedData,
            DashboardItem dashboardItem)
        {
            var result = new List<DashboardViewChartDataMultiStackedModel>();

            var locationTagList = dashboardItem.CompareLocationsTags
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Select(x => new { x.LocationId, x.TagId, x.Position })
                .OrderBy(x => x.Position)
                .Select(x => new
                {
                    IsTag = x.TagId != null,
                    IsLocation = x.LocationId != null,
                    x.TagId,
                    x.LocationId,
                })
                .ToList();


            foreach (var locationOrTag in locationTagList)
            {
                var data = new DashboardViewChartDataMultiStackedModel();
                if (locationOrTag.IsTag)
                {
                    data = multiStackedData.FirstOrDefault(x => x.Id == locationOrTag.TagId && x.IsTag);
                }
                else if (locationOrTag.IsLocation)
                {
                    data = multiStackedData.FirstOrDefault(x => x.Id == locationOrTag.LocationId && !x.IsTag);
                }

                if (data != null)
                {
                    result.Add(data);
                }
            }

            return result;
        }

        public static List<DashboardViewChartDataMultiStackedModel> SortMultiStackedRawDataLocationPosition(
            List<DashboardViewChartDataMultiStackedModel> multiStackedRawData,
            DashboardItem dashboardItem)
        {
            var locationTagList = dashboardItem.CompareLocationsTags
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Select(x => new { x.LocationId, x.TagId, x.Position })
                .OrderBy(x => x.Position)
                .Select(x => new
                {
                    IsTag = x.TagId != null,
                    IsLocation = x.LocationId != null,
                    x.TagId,
                    x.LocationId,
                })
                .ToList();

            foreach (var multiStackedModel in multiStackedRawData)
            {
                var result = new List<DashboardViewChartDataMultiModel>();
                foreach (var locationOrTag in locationTagList)
                {
                    var data = new DashboardViewChartDataMultiModel();
                    if (locationOrTag.IsTag)
                    {
                        data = multiStackedModel.Series.FirstOrDefault(x => x.Id == locationOrTag.TagId && x.IsTag);
                    }
                    else if (locationOrTag.IsLocation)
                    {
                        data = multiStackedModel.Series.FirstOrDefault(x => x.Id == locationOrTag.LocationId && !x.IsTag);
                    }

                    if (data != null)
                    {
                        result.Add(data);
                    }
                }

                multiStackedModel.Series = result;
            }

            return multiStackedRawData;
        }

        public static List<DashboardViewChartDataMultiModel> SortMultiDataLocationPosition(
            List<DashboardViewChartDataMultiModel> multiData,
            DashboardItem dashboardItem,
            int? locationId,
            int? locationTagId)
        {
            var result = new List<DashboardViewChartDataMultiModel>();
            var locationAndTagList = new Dictionary<int, bool>();
            if (locationId == null && locationTagId == null)
            {
                locationAndTagList = dashboardItem.CompareLocationsTags
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => new { x.LocationId, x.TagId, x.Position })
                    .OrderBy(x => x.Position)
                    .Select(x => new
                    {
                        IsTag = x.TagId != null,
                        LocationTagId = x.LocationId ?? x.TagId ?? 0,
                    }).ToDictionary(x => x.LocationTagId, y => y.IsTag);
            }
            else
            {
                if (locationId != null)
                {
                    locationAndTagList.Add((int)locationId, false);
                }

                if (locationTagId != null)
                {
                    locationAndTagList.Add((int)locationTagId, true);
                }
            }

            foreach (var locationOrTag in locationAndTagList)
            {
                var data = locationOrTag.Value // is tag
                    ? multiData.FirstOrDefault(x => x.Id == locationOrTag.Key && x.IsTag) // tag
                    : multiData.FirstOrDefault(x => x.Id == locationOrTag.Key && !x.IsTag); // location

                if (data != null)
                {
                    result.Add(data);
                }
            }

            return result;
        }

        public static string GetWeekString(DateTime dateTime)
        {
            var weekNumber = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
                dateTime,
                CalendarWeekRule.FirstFourDayWeek,
                DayOfWeek.Monday);

            return $"{dateTime:yy}_{weekNumber:D2}";
        }

        public static string GetMonthString(DateTime dateTime)
        {
            // TODO! C# formats all months as with a trailing ., but not for May month in danish?
            // eg. jan. feb. mar. apr. maj jun. jul. aug. sep. okt. nov. dec.
            // so we remove the trailing . for all dates.
            // Issue tracked at https://github.com/dotnet/sdk/issues/12143
            return $"{dateTime:yy}_{dateTime:MMM}".Replace(".", "");
        }

        public static int GetHalfOfYear(DateTime dateTime)
        {
            var month = dateTime.Month;
            if (month > 0 && month <= 6)
            {
                return 1;
            }

            if (month > 6 && month <= 12)
            {
                return 2;
            }

            throw new ArgumentException($"Invalid month {month}");
        }

        public static string GetSmileyLabel(string smileyString)
        {
            switch (smileyString)
            {
                case "smiley1":
                    return "Meget glad";
                case "smiley2":
                    return "Glad";
                case "smiley3":
                    return "Neutral";
                case "smiley4":
                    return "Sur";
                case "smiley5":
                    return "Meget sur";
                case "smiley6":
                    return "Ved ikke";
                default:
                    return smileyString;
            }
        }
    }
}
