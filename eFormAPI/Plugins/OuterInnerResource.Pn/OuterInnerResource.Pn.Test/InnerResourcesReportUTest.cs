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
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Dto;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities;
using NUnit.Framework;
using OuterInnerResource.Pn.Infrastructure.Enums;
using OuterInnerResource.Pn.Infrastructure.Helpers;
using OuterInnerResource.Pn.Infrastructure.Models.Report;

namespace MachineArea.Pn.Test
{
    [TestFixture]
    public class InnerResourcesReportUTest : DbTestFixture
    {
        [Test]
        public async Task InnerResourcesReportByDay_Generate_DoesGenerate()
        {
            OuterResource newArea = new OuterResource() { Name = "My OuterResource 1", Version = 1 };
            OuterResource newArea1 = new OuterResource() { Name = "My OuterResource 2", Version = 1 };
            OuterResource newArea2 = new OuterResource() { Name = "My OuterResource 3", Version = 1 };
            InnerResource newMachine = new InnerResource() { Name = "My InnerResource 1", Version = 1 };
            InnerResource newMachine1 = new InnerResource() { Name = "My InnerResource 2", Version = 1 };
            InnerResource newMachine2 = new InnerResource() { Name = "My InnerResource 3", Version = 1 };
            await newArea.Create(DbContext);
            await newArea1.Create(DbContext);
            await newArea2.Create(DbContext);
            await newMachine.Create(DbContext);
            await newMachine1.Create(DbContext);
            await newMachine2.Create(DbContext);

            // Different days
            ResourceTimeRegistration newTimeRegistrationDay = new ResourceTimeRegistration()
            { OuterResourceId = newArea.Id, Version = 1, SDKSiteId = 1, InnerResourceId = newMachine.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 05, 13) };
            ResourceTimeRegistration newTimeRegistrationDay1 = new ResourceTimeRegistration()
            { OuterResourceId = newArea1.Id, Version = 1, SDKSiteId = 1, InnerResourceId = newMachine1.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 05, 14) };
            ResourceTimeRegistration newTimeRegistrationDay2 = new ResourceTimeRegistration()
            { OuterResourceId = newArea2.Id, Version = 1, SDKSiteId = 1, InnerResourceId = newMachine2.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 05, 15) };
            ResourceTimeRegistration newTimeRegistrationDay3 = new ResourceTimeRegistration()
            { OuterResourceId = newArea.Id, Version = 1, SDKSiteId = 2, InnerResourceId = newMachine.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 05, 13) };
            ResourceTimeRegistration newTimeRegistrationDay4 = new ResourceTimeRegistration()
            { OuterResourceId = newArea1.Id, Version = 1, SDKSiteId = 2, InnerResourceId = newMachine1.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 05, 14) };
            ResourceTimeRegistration newTimeRegistrationDay5 = new ResourceTimeRegistration()
            { OuterResourceId = newArea1.Id, Version = 1, SDKSiteId = 2, InnerResourceId = newMachine2.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 05, 15) };
            ResourceTimeRegistration newTimeRegistrationDay6 = new ResourceTimeRegistration()
            { OuterResourceId = newArea1.Id, Version = 1, SDKSiteId = 2, InnerResourceId = newMachine1.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 05, 15) };

            await DbContext.ResourceTimeRegistrations.AddRangeAsync(newTimeRegistrationDay, newTimeRegistrationDay1,
                newTimeRegistrationDay2, newTimeRegistrationDay3, newTimeRegistrationDay4, newTimeRegistrationDay5,
                newTimeRegistrationDay6);

            await DbContext.SaveChangesAsync();

            GenerateReportModel model = new GenerateReportModel()
            {
                DateFrom = new DateTime(2019, 5, 13),
                DateTo = new DateTime(2019, 5, 16),
                Relationship = ReportRelationshipType.InnerResource,
                Type = ReportType.Day
            };

            List<SiteDto> sitesList = new List<SiteDto>()
            {
                new SiteDto(1, "Test Site 1", "", "", 1, 1, 1, 1),
                new SiteDto(2, "Test Site 2", "", "", 1, 1, 1, 1)
            };

            DateTime modelDateFrom = new DateTime(
                model.DateFrom.Year,
                model.DateFrom.Month,
                model.DateFrom.Day,
                0, 0, 0);
            DateTime modelDateTo = new DateTime(
                model.DateTo.Year,
                model.DateTo.Month,
                model.DateTo.Day,
                23, 59, 59);

            List<ResourceTimeRegistration> jobsList = await DbContext.ResourceTimeRegistrations
                .Include(x => x.InnerResource)
                .Include(x => x.OuterResource)
                .Where(x => x.DoneAt >= modelDateFrom && x.DoneAt <= modelDateTo)
                .ToListAsync();

            ReportModel reportModel = ReportsHelper.GetReportData(model, jobsList, sitesList, (int)ReportTimeType.Minutes);

            Assert.AreEqual(reportModel.SubReports.Count, 1);
            Assert.AreEqual(reportModel.SubReports[0].TotalTime, 4200);
            Assert.AreEqual(reportModel.SubReports[0].Entities.Count, 3);
            Assert.AreEqual(reportModel.SubReports[0].Entities[0].EntityName, newMachine.Name);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].EntityName, newMachine1.Name);
            Assert.AreEqual(reportModel.SubReports[0].Entities[2].EntityName, newMachine2.Name);

            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TotalTime, 1200);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TotalTime, 1800);

            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TimePerTimeUnit[0], 1200);
            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TimePerTimeUnit[1], 0);
            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TimePerTimeUnit[2], 0);
            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TimePerTimeUnit[3], 0);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TimePerTimeUnit[0], 0);

            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TimePerTimeUnit[1], 1200);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TimePerTimeUnit[2], 600);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TimePerTimeUnit[3], 0);
        }

        [Test]
        public async Task InnerResourcesReportByWeek_Generate_DoesGenerate()
        {
            OuterResource newArea = new OuterResource() { Name = "My OuterResource 1", Version = 1 };
            OuterResource newArea1 = new OuterResource() { Name = "My OuterResource 2", Version = 1 };
            OuterResource newArea2 = new OuterResource() { Name = "My OuterResource 3", Version = 1 };
            InnerResource newMachine = new InnerResource() { Name = "My InnerResource 1", Version = 1 };
            InnerResource newMachine1 = new InnerResource() { Name = "My InnerResource 2", Version = 1 };
            InnerResource newMachine2 = new InnerResource() { Name = "My InnerResource 3", Version = 1 };

            await newArea.Create(DbContext);
            await newArea1.Create(DbContext);
            await newArea2.Create(DbContext);
            await newMachine.Create(DbContext);
            await newMachine1.Create(DbContext);
            await newMachine2.Create(DbContext);

            // Different Weeks
            ResourceTimeRegistration newTimeRegistrationWeek = new ResourceTimeRegistration()
            { OuterResourceId = newArea.Id, Version = 1, SDKSiteId = 1, InnerResourceId = newMachine.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 05, 20) };
            ResourceTimeRegistration newTimeRegistrationWeek1 = new ResourceTimeRegistration()
            { OuterResourceId = newArea1.Id, Version = 1, SDKSiteId = 1, InnerResourceId = newMachine1.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 05, 20) };
            ResourceTimeRegistration newTimeRegistrationWeek2 = new ResourceTimeRegistration()
            { OuterResourceId = newArea2.Id, Version = 1, SDKSiteId = 1, InnerResourceId = newMachine2.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 05, 27) };
            ResourceTimeRegistration newTimeRegistrationWeek3 = new ResourceTimeRegistration()
            { OuterResourceId = newArea.Id, Version = 1, SDKSiteId = 2, InnerResourceId = newMachine.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 06, 27) };
            ResourceTimeRegistration newTimeRegistrationWeek4 = new ResourceTimeRegistration()
            { OuterResourceId = newArea1.Id, Version = 1, SDKSiteId = 2, InnerResourceId = newMachine1.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 06, 05) };
            ResourceTimeRegistration newTimeRegistrationWeek5 = new ResourceTimeRegistration()
            { OuterResourceId = newArea1.Id, Version = 1, SDKSiteId = 2, InnerResourceId = newMachine2.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 06, 05) };
            ResourceTimeRegistration newTimeRegistrationWeek6 = new ResourceTimeRegistration()
            { OuterResourceId = newArea1.Id, Version = 1, SDKSiteId = 2, InnerResourceId = newMachine1.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 06, 06) };

            await DbContext.ResourceTimeRegistrations.AddRangeAsync(newTimeRegistrationWeek, newTimeRegistrationWeek1,
                newTimeRegistrationWeek2, newTimeRegistrationWeek3, newTimeRegistrationWeek4, newTimeRegistrationWeek5,
                newTimeRegistrationWeek6);

            await DbContext.SaveChangesAsync();

            GenerateReportModel model = new GenerateReportModel()
            {
                DateFrom = new DateTime(2019, 5, 13),
                DateTo = new DateTime(2019, 6, 07),
                Relationship = ReportRelationshipType.InnerResource,
                Type = ReportType.Week
            };

            List<SiteDto> sitesList = new List<SiteDto>()
            {
                new SiteDto(1, "Test Site 1", "", "", 1, 1, 1, 1),
                new SiteDto(2, "Test Site 2", "", "", 1, 1, 1, 1)
            };

            DateTime modelDateFrom = new DateTime(
                model.DateFrom.Year,
                model.DateFrom.Month,
                model.DateFrom.Day,
                0, 0, 0);
            DateTime modelDateTo = new DateTime(
                model.DateTo.Year,
                model.DateTo.Month,
                model.DateTo.Day,
                23, 59, 59);

            List<ResourceTimeRegistration> jobsList = await DbContext.ResourceTimeRegistrations
                .Include(x => x.InnerResource)
                .Include(x => x.OuterResource)
                .Where(x => x.DoneAt >= modelDateFrom && x.DoneAt <= modelDateTo)
                .ToListAsync();

            ReportModel reportModel = ReportsHelper.GetReportData(model, jobsList, sitesList, (int)ReportTimeType.Minutes);

            Assert.AreEqual(reportModel.SubReports.Count, 1);
            Assert.AreEqual(reportModel.SubReports[0].TotalTime, 3600);
            Assert.AreEqual(reportModel.SubReports[0].Entities.Count, 3);
            Assert.AreEqual(reportModel.SubReports[0].Entities[0].EntityName, newMachine.Name);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].EntityName, newMachine1.Name);
            Assert.AreEqual(reportModel.SubReports[0].Entities[2].EntityName, newMachine2.Name);

            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TotalTime, 600);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TotalTime, 1800);

            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TimePerTimeUnit[0], 0);
            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TimePerTimeUnit[1], 600);
            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TimePerTimeUnit[2], 0);
            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TimePerTimeUnit[3], 0);

            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TimePerTimeUnit[0], 0);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TimePerTimeUnit[1], 600);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TimePerTimeUnit[2], 0);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TimePerTimeUnit[3], 1200);
        }

        [Test]
        public async Task InnerResourcesReportByMonth_Generate_DoesGenerate()
        {
            OuterResource newArea = new OuterResource() { Name = "My OuterResource 1", Version = 1 };
            OuterResource newArea1 = new OuterResource() { Name = "My OuterResource 2", Version = 1 };
            OuterResource newArea2 = new OuterResource() { Name = "My OuterResource 3", Version = 1 };
            InnerResource newMachine = new InnerResource() { Name = "My InnerResource 1", Version = 1 };
            InnerResource newMachine1 = new InnerResource() { Name = "My InnerResource 2", Version = 1 };
            InnerResource newMachine2 = new InnerResource() { Name = "My InnerResource 3", Version = 1 };

            await newArea.Create(DbContext);
            await newArea1.Create(DbContext);
            await newArea2.Create(DbContext);
            await newMachine.Create(DbContext);
            await newMachine1.Create(DbContext);
            await newMachine2.Create(DbContext);

            // Different Month
            ResourceTimeRegistration newTimeRegistrationMonth = new ResourceTimeRegistration()
            { OuterResourceId = newArea.Id, Version = 1, SDKSiteId = 1, InnerResourceId = newMachine.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 06, 13) };
            ResourceTimeRegistration newTimeRegistrationMonth1 = new ResourceTimeRegistration()
            { OuterResourceId = newArea1.Id, Version = 1, SDKSiteId = 1, InnerResourceId = newMachine1.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 07, 14) };
            ResourceTimeRegistration newTimeRegistrationMonth2 = new ResourceTimeRegistration()
            { OuterResourceId = newArea2.Id, Version = 1, SDKSiteId = 1, InnerResourceId = newMachine2.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 07, 15) };
            ResourceTimeRegistration newTimeRegistrationMonth3 = new ResourceTimeRegistration()
            { OuterResourceId = newArea.Id, Version = 1, SDKSiteId = 2, InnerResourceId = newMachine.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 08, 13) };
            ResourceTimeRegistration newTimeRegistrationMonth4 = new ResourceTimeRegistration()
            { OuterResourceId = newArea1.Id, Version = 1, SDKSiteId = 2, InnerResourceId = newMachine1.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 08, 14) };
            ResourceTimeRegistration newTimeRegistrationMonth5 = new ResourceTimeRegistration()
            { OuterResourceId = newArea1.Id, Version = 1, SDKSiteId = 2, InnerResourceId = newMachine2.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 09, 15) };
            ResourceTimeRegistration newTimeRegistrationMonth6 = new ResourceTimeRegistration()
            { OuterResourceId = newArea1.Id, Version = 1, SDKSiteId = 2, InnerResourceId = newMachine1.Id, TimeInSeconds = 36000, DoneAt = new DateTime(2019, 09, 15) };

            await DbContext.ResourceTimeRegistrations.AddRangeAsync(newTimeRegistrationMonth, newTimeRegistrationMonth1,
                newTimeRegistrationMonth2, newTimeRegistrationMonth3, newTimeRegistrationMonth4, newTimeRegistrationMonth5,
                newTimeRegistrationMonth6);

            await DbContext.SaveChangesAsync();

            GenerateReportModel model = new GenerateReportModel()
            {
                DateFrom = new DateTime(2019, 5, 13),
                DateTo = new DateTime(2019, 9, 13),
                Relationship = ReportRelationshipType.InnerResource,
                Type = ReportType.Month
            };

            List<SiteDto> sitesList = new List<SiteDto>()
            {
                new SiteDto(1, "Test Site 1", "", "", 1, 1, 1, 1),
                new SiteDto(2, "Test Site 2", "", "", 1, 1, 1, 1)
            };

            DateTime modelDateFrom = new DateTime(
                model.DateFrom.Year,
                model.DateFrom.Month,
                model.DateFrom.Day,
                0, 0, 0);
            DateTime modelDateTo = new DateTime(
                model.DateTo.Year,
                model.DateTo.Month,
                model.DateTo.Day,
                23, 59, 59);

            List<ResourceTimeRegistration> jobsList = await DbContext.ResourceTimeRegistrations
                .Include(x => x.InnerResource)
                .Include(x => x.OuterResource)
                .Where(x => x.DoneAt >= modelDateFrom && x.DoneAt <= modelDateTo)
                .ToListAsync();

            ReportModel reportModel = ReportsHelper.GetReportData(model, jobsList, sitesList, (int)ReportTimeType.Minutes);

            Assert.AreEqual(reportModel.SubReports.Count, 1);
            Assert.AreEqual(reportModel.SubReports[0].TotalTime, 3000);
            Assert.AreEqual(reportModel.SubReports[0].Entities.Count, 3);
            Assert.AreEqual(reportModel.SubReports[0].Entities[0].EntityName, newMachine.Name);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].EntityName, newMachine1.Name);
            Assert.AreEqual(reportModel.SubReports[0].Entities[2].EntityName, newMachine2.Name);

            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TotalTime, 1200);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TotalTime, 1200);

            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TimePerTimeUnit[0], 0);
            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TimePerTimeUnit[1], 600);
            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TimePerTimeUnit[2], 0);
            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TimePerTimeUnit[3], 600);
            Assert.AreEqual(reportModel.SubReports[0].Entities[0].TimePerTimeUnit[4], 0);

            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TimePerTimeUnit[0], 0);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TimePerTimeUnit[1], 0);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TimePerTimeUnit[2], 600);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TimePerTimeUnit[3], 600);
            Assert.AreEqual(reportModel.SubReports[0].Entities[1].TimePerTimeUnit[4], 0);
        }
    }
}