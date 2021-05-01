/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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

using System;
using System.Collections.Generic;
using System.Linq;
using Microting.eForm.Dto;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities;
using OuterInnerResource.Pn.Infrastructure.Enums;
using OuterInnerResource.Pn.Infrastructure.Extensions;
using OuterInnerResource.Pn.Infrastructure.Models.Report;

namespace OuterInnerResource.Pn.Infrastructure.Helpers
{
    public static class ReportsHelper
    {
        public static ReportModel GetReportData(
            GenerateReportModel model, List<ResourceTimeRegistration> jobsList,
            List<SiteDto> sitesList, int timeType)
        {
                List<ReportEntityModel> reportEntitiesList = new List<ReportEntityModel>();
                List<DateTime> reportDates = new List<DateTime>();
                List<ReportEntityHeaderModel> reportHeaders = new List<ReportEntityHeaderModel>();
                ReportModel finalModel = new ReportModel();
                switch (model.Type)
                {
                    case ReportType.Day:
                        DateTime dateFrom = new DateTime(
                            model.DateFrom.Year,
                            model.DateFrom.Month,
                            model.DateFrom.Day,
                            0, 0, 0);

                        DateTime dateTo = new DateTime(
                            model.DateTo.Year,
                            model.DateTo.Month,
                            model.DateTo.Day,
                            23, 59, 59);

                        for (DateTime date = dateFrom; date <= dateTo; date = date.AddDays(1))
                        {
                            reportDates.Add(date);
                        }

                        foreach (DateTime reportDate in reportDates)
                        {
                            reportHeaders.Add(new ReportEntityHeaderModel
                            {
                                HeaderValue = reportDate.ToString("dd/MM/yyyy")
                            });
                        }

                        switch (model.Relationship)
                        {
                            case ReportRelationshipType.EmployeeTotal:
                            case ReportRelationshipType.Employee:
                                reportEntitiesList = jobsList.GroupBy(x => x.SDKSiteId)
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = sitesList.FirstOrDefault(y => y.SiteId == x.Key)?.SiteName,
                                        EntityId = x.Key,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt.Day == z.Day
                                                                && j.DoneAt.Month == z.Month
                                                                && j.DoneAt.Year == z.Year)
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType)
                                                        )
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    })
                                    .ToList();
                                break;
                            case ReportRelationshipType.OuterResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.OuterResourceId, x.OuterResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = x.Key.OuterResource?.Name,
                                        EntityId = x.Key.OuterResourceId,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt.Day == z.Day
                                                                && j.DoneAt.Month == z.Month
                                                                && j.DoneAt.Year == z.Year)
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType)
                                                    )
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    })
                                    .ToList();
                                break;
                            case ReportRelationshipType.InnerResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.InnerResourceId, x.InnerResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = x.Key.InnerResource?.Name,
                                        EntityId = x.Key.InnerResourceId,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt.Day == z.Day
                                                                && j.DoneAt.Month == z.Month
                                                                && j.DoneAt.Year == z.Year)
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    })
                                    .ToList();
                                break;
                            case ReportRelationshipType.EmployeeInnerResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.SDKSiteId, x.InnerResourceId, x.InnerResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = sitesList.FirstOrDefault(y => y.SiteId == x.Key.SDKSiteId)?.SiteName,
                                        EntityId = x.Key.SDKSiteId,
                                        RelatedEntityId = x.Key.InnerResourceId,
                                        RelatedEntityName = x.Key.InnerResource.Name,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt.Day == z.Day
                                                                && j.DoneAt.Month == z.Month
                                                                && j.DoneAt.Year == z.Year)
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    }).ToList();
                                break;
                            case ReportRelationshipType.EmployeeOuterResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.SDKSiteId, x.OuterResourceId, x.OuterResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = sitesList.FirstOrDefault(y => y.SiteId == x.Key.SDKSiteId)?.SiteName,
                                        EntityId = x.Key.SDKSiteId,
                                        RelatedEntityId = x.Key.OuterResourceId,
                                        RelatedEntityName = x.Key.OuterResource.Name,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt.Day == z.Day
                                                                && j.DoneAt.Month == z.Month
                                                                && j.DoneAt.Year == z.Year)
                                                    .Sum(s => (decimal)TimeSpan.FromSeconds(s.TimeInSeconds).TotalMinutes)
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)TimeSpan.FromSeconds(z.TimeInSeconds).TotalMinutes)
                                    }).ToList();
                                break;
                            case ReportRelationshipType.OuterInnerResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.OuterResourceId, x.OuterResource, x.InnerResourceId, x.InnerResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = x.Key.OuterResource.Name,
                                        EntityId = x.Key.OuterResourceId,
                                        RelatedEntityId = x.Key.InnerResourceId,
                                        RelatedEntityName = x.Key.InnerResource.Name,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt.Day == z.Day
                                                                && j.DoneAt.Month == z.Month
                                                                && j.DoneAt.Year == z.Year)
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    }).ToList();
                                break;
                            case ReportRelationshipType.InnerOuterResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.InnerResourceId, x.InnerResource, x.OuterResourceId, x.OuterResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = x.Key.InnerResource.Name,
                                        EntityId = x.Key.InnerResourceId,
                                        RelatedEntityId = x.Key.OuterResourceId,
                                        RelatedEntityName = x.Key.OuterResource.Name,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt.Day == z.Day
                                                                && j.DoneAt.Month == z.Month
                                                                && j.DoneAt.Year == z.Year)
                                                    .Sum(s => (decimal)TimeSpan.FromSeconds(s.TimeInSeconds).TotalMinutes)
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)TimeSpan.FromSeconds(z.TimeInSeconds).TotalMinutes)
                                    }).ToList();
                            break;
                        default:
                                throw new ArgumentOutOfRangeException();
                        }

                        // Employee - Machine
                        break;
                    case ReportType.Week:

                        DateTime firstDayOfWeek = model.DateFrom.FirstDayOfWeek(DayOfWeek.Monday);
                        DateTime lastDayOfWeek = model.DateTo.LastDayOfWeek(DayOfWeek.Monday);

                        DateTime dateFromWeek = new DateTime(
                            firstDayOfWeek.Year,
                            firstDayOfWeek.Month,
                            firstDayOfWeek.Day,
                            0, 0, 0);

                        DateTime dateToWeek = new DateTime(
                            lastDayOfWeek.Year,
                            lastDayOfWeek.Month,
                            lastDayOfWeek.Day,
                            23, 59, 59);

                        for (DateTime date = dateFromWeek; date <= dateToWeek; date = date.AddDays(7))
                        {
                            reportDates.Add(date);
                        }

                        foreach (DateTime reportDate in reportDates)
                        {
                            reportHeaders.Add(new ReportEntityHeaderModel
                            {
                                HeaderValue = $"W{DatesHelper.GetIso8601WeekOfYear(reportDate)}-{reportDate:yy}"
                            });
                        }

                        switch (model.Relationship)
                        {
                            case ReportRelationshipType.Employee:
                            case ReportRelationshipType.EmployeeTotal:
                                reportEntitiesList = jobsList.GroupBy(x => x.SDKSiteId)
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = sitesList.FirstOrDefault(y => y.SiteId == x.Key)?.SiteName,
                                        EntityId = x.Key,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddDays(7))
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    })
                                    .ToList();
                                break;
                            case ReportRelationshipType.OuterResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.OuterResourceId, x.OuterResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = x.Key.OuterResource?.Name,
                                        EntityId = x.Key.OuterResourceId,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddDays(7))
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    })
                                    .ToList();
                                break;
                            case ReportRelationshipType.InnerResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.InnerResourceId, x.InnerResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = x.Key.InnerResource?.Name,
                                        EntityId = x.Key.InnerResourceId,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddDays(7))
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    })
                                    .ToList();
                                break;
                            case ReportRelationshipType.EmployeeOuterResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.SDKSiteId, x.OuterResourceId, x.OuterResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = sitesList.FirstOrDefault(y => y.SiteId == x.Key.SDKSiteId)?.SiteName,
                                        EntityId = x.Key.SDKSiteId,
                                        RelatedEntityId = x.Key.OuterResourceId,
                                        RelatedEntityName = x.Key.OuterResource.Name,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddDays(7))
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    }).ToList();
                                break;
                            case ReportRelationshipType.EmployeeInnerResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.SDKSiteId, x.InnerResourceId, x.InnerResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = sitesList.FirstOrDefault(y => y.SiteId == x.Key.SDKSiteId)?.SiteName,
                                        EntityId = x.Key.SDKSiteId,
                                        RelatedEntityId = x.Key.InnerResourceId,
                                        RelatedEntityName = x.Key.InnerResource.Name,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddDays(7))
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    }).ToList();
                                break;
                            case ReportRelationshipType.OuterInnerResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.OuterResourceId, x.OuterResource, x.InnerResourceId, x.InnerResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = x.Key.OuterResource.Name,
                                        EntityId = x.Key.OuterResourceId,
                                        RelatedEntityId = x.Key.InnerResourceId,
                                        RelatedEntityName = x.Key.InnerResource.Name,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddDays(7))
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    }).ToList();
                            break;
                            case ReportRelationshipType.InnerOuterResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.InnerResourceId, x.InnerResource, x.OuterResourceId, x.OuterResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = x.Key.InnerResource.Name,
                                        EntityId = x.Key.InnerResourceId,
                                        RelatedEntityId = x.Key.OuterResourceId,
                                        RelatedEntityName = x.Key.OuterResource.Name,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddDays(7))
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    }).ToList();
                            break;
                        default:
                                throw new ArgumentOutOfRangeException();
                        }
                        break;
                    case ReportType.Month:

                        DateTime firstDayOfMonth = model.DateFrom.FirstDayOfMonth();
                        DateTime lastDayOfMonth = model.DateTo.LastDayOfMonth();

                        DateTime dateFromMonth = new DateTime(
                            firstDayOfMonth.Year,
                            firstDayOfMonth.Month,
                            firstDayOfMonth.Day,
                            0, 0, 0);

                        DateTime dateToMonth = new DateTime(
                            lastDayOfMonth.Year,
                            lastDayOfMonth.Month,
                            lastDayOfMonth.Day,
                            23, 59, 59);

                        // Fill dates array to arrange time by time unit
                        for (DateTime date = dateFromMonth; date <= dateToMonth; date = date.AddMonths(1))
                        {
                            reportDates.Add(date);
                        }

                        // Add headers with required format
                        foreach (DateTime reportDate in reportDates)
                        {
                            reportHeaders.Add(new ReportEntityHeaderModel
                            {
                                HeaderValue = reportDate.ToString("MM/yyyy")
                            });
                        }

                        switch (model.Relationship)
                        {
                            case ReportRelationshipType.Employee:
                            case ReportRelationshipType.EmployeeTotal:
                                reportEntitiesList = jobsList.GroupBy(x => x.SDKSiteId)
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = sitesList.FirstOrDefault(y => y.SiteId == x.Key)?.SiteName,
                                        EntityId = x.Key,
                                        // Fill dates array foreach date and calc sum for this date
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddMonths(1))
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    })
                                    .ToList();
                                break;
                            case ReportRelationshipType.OuterResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.OuterResourceId, x.OuterResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = x.Key.OuterResource?.Name,
                                        EntityId = x.Key.OuterResourceId,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddMonths(1))
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    })
                                    .ToList();
                                break;
                            case ReportRelationshipType.InnerResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.InnerResourceId, x.InnerResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = x.Key.InnerResource?.Name,
                                        EntityId = x.Key.InnerResourceId,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddMonths(1))
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    })
                                    .ToList();
                                break;
                            case ReportRelationshipType.EmployeeOuterResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.SDKSiteId, x.OuterResourceId, x.OuterResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = sitesList.FirstOrDefault(y => y.SiteId == x.Key.SDKSiteId)?.SiteName,
                                        EntityId = x.Key.SDKSiteId,
                                        RelatedEntityId = x.Key.OuterResourceId,
                                        RelatedEntityName = x.Key.OuterResource.Name,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddMonths(1))
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    }).ToList();
                                break;
                            case ReportRelationshipType.EmployeeInnerResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.SDKSiteId, x.InnerResourceId, x.InnerResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = sitesList.FirstOrDefault(y => y.SiteId == x.Key.SDKSiteId)?.SiteName,
                                        EntityId = x.Key.SDKSiteId,
                                        RelatedEntityId = x.Key.InnerResourceId,
                                        RelatedEntityName = x.Key.InnerResource.Name,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddMonths(1))
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    }).ToList();
                                break;
                            case ReportRelationshipType.OuterInnerResource:
                                reportEntitiesList = jobsList.GroupBy(x => new { x.OuterResourceId, x.OuterResource, x.InnerResourceId, x.InnerResource })
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = x.Key.OuterResource.Name,
                                        EntityId = x.Key.OuterResourceId,
                                        RelatedEntityId = x.Key.InnerResourceId,
                                        RelatedEntityName = x.Key.InnerResource.Name,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddMonths(1))
                                                    .Sum(s => (decimal)CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal)CorrectedTime(z, timeType))
                                    }).ToList();
                                break;
                            case ReportRelationshipType.InnerOuterResource:
                                reportEntitiesList = jobsList.GroupBy(x => new {x.InnerResourceId, x.InnerResource, x.OuterResourceId, x.OuterResource})
                                    .Select(x => new ReportEntityModel()
                                    {
                                        EntityName = x.Key.InnerResource.Name,
                                        EntityId = x.Key.InnerResourceId,
                                        RelatedEntityId = x.Key.OuterResourceId,
                                        RelatedEntityName = x.Key.OuterResource.Name,
                                        TimePerTimeUnit = reportDates.Select(z =>
                                                x
                                                    .Where(j => j.DoneAt >= z
                                                                && j.DoneAt < z.AddMonths(1))
                                                    .Sum(s => (decimal) CorrectedTime(s, timeType))
                                            )
                                            .ToList(),
                                        TotalTime = x.Sum(z => (decimal) CorrectedTime(z, timeType))
                                    }).ToList();
                                break;
                            default:
                                throw new ArgumentOutOfRangeException();
                        }

                        break;
                }

                if (model.Relationship == ReportRelationshipType.EmployeeOuterResource
                    || model.Relationship == ReportRelationshipType.EmployeeInnerResource)
                {
                    // Group reports by employee
                    List<IGrouping<int, ReportEntityModel>> groupedReports = reportEntitiesList.GroupBy(x => x.EntityId).ToList();
                    foreach (IGrouping<int, ReportEntityModel> groupedReport in groupedReports)
                    {
                        // Calculate sum for sub report
                        List<decimal> sumByTimeUnit = new List<decimal>();
                        foreach (ReportEntityModel reportEntity in groupedReport)
                        {
                            int i = 0;
                            foreach (decimal timePerTimeUnit in reportEntity.TimePerTimeUnit)
                            {
                                if (sumByTimeUnit.Count <= i)
                                {
                                    sumByTimeUnit.Add(timePerTimeUnit);
                                }
                                else
                                {
                                    sumByTimeUnit[i] += timePerTimeUnit;
                                }

                                i++;
                            }
                        }

                        // Push sub report to reports array
                        finalModel.SubReports.Add(new SubReportModel()
                        {
                            Entities = groupedReport.ToList(),
                            TotalTime = groupedReport.Sum(x => x.TotalTime),
                            TotalTimePerTimeUnit = sumByTimeUnit
                        });
                    }
                }
                else
                {
                    // Calculate only one sub report for employee/area/machine
                    List<decimal> sumByTimeUnit = new List<decimal>();
                    foreach (ReportEntityModel reportEntity in reportEntitiesList)
                    {
                        int i = 0;
                        foreach (decimal timePerTimeUnit in reportEntity.TimePerTimeUnit)
                        {
                            if (sumByTimeUnit.Count <= i)
                            {
                                sumByTimeUnit.Add(timePerTimeUnit);
                            }
                            else
                            {
                                sumByTimeUnit[i] += timePerTimeUnit;
                            }

                            i++;
                        }
                    }

                    finalModel.SubReports = new List<SubReportModel>()
                    {
                        new SubReportModel()
                        {
                            Entities = reportEntitiesList,
                            TotalTime = reportEntitiesList.Sum(x => x.TotalTime),
                            TotalTimePerTimeUnit = sumByTimeUnit
                        }
                    };
                }

                finalModel.ReportHeaders = reportHeaders;
                finalModel.Relationship = model.Relationship;

                return finalModel;
        }

        private static double CorrectedTime(ResourceTimeRegistration machineAreaTimeRegistration, int timeType)
        {
            switch (timeType)
            {
                case (int)ReportTimeType.Seconds:
                    return TimeSpan.FromSeconds(machineAreaTimeRegistration.TimeInSeconds).TotalSeconds;
                case (int)ReportTimeType.Minutes:
                    return TimeSpan.FromSeconds(machineAreaTimeRegistration.TimeInSeconds).TotalMinutes;
                default:
                    return TimeSpan.FromSeconds(machineAreaTimeRegistration.TimeInSeconds).TotalHours;
                
            }
        }
    }
}
