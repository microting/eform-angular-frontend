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
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using eFormCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities;
using OuterInnerResource.Pn.Abstractions;
using OuterInnerResource.Pn.Infrastructure.Enums;
using OuterInnerResource.Pn.Infrastructure.Helpers;
using OuterInnerResource.Pn.Infrastructure.Models;
using OuterInnerResource.Pn.Infrastructure.Models.Report;
using OuterInnerResource.Pn.Infrastructure.Models.Settings;

namespace OuterInnerResource.Pn.Services
{
    public class OuterInnerResourceReportService : IOuterInnerResourceReportService
    {
        private readonly ILogger<OuterInnerResourceReportService> _logger;
        private readonly IOuterInnerResourceLocalizationService _outerInnerResourceLocalizationService;
        private readonly IExcelService _excelService;
        private readonly OuterInnerResourcePnDbContext _dbContext;
        private readonly IEFormCoreService _coreHelper;
        private readonly IPluginDbOptions<OuterInnerResourceSettings> _options;

        public OuterInnerResourceReportService(ILogger<OuterInnerResourceReportService> logger,
            OuterInnerResourcePnDbContext dbContext,
            IEFormCoreService coreHelper,
            IOuterInnerResourceLocalizationService outerInnerResourceLocalizationService,
            IPluginDbOptions<OuterInnerResourceSettings> options,
            IExcelService excelService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _outerInnerResourceLocalizationService = outerInnerResourceLocalizationService;
            _excelService = excelService;
            _options = options;
        }

        public OperationDataResult<ReportNamesModel> GetReportNames()
        {
            var reportNamesModel = new ReportNamesModel
            {
                ReportNameModels = new List<ReportNameModel>()
            };
            var outerResourceName = _options.Value.OuterResourceName;
            var innerResourceName = _options.Value.InnerResourceName;

            reportNamesModel.ReportNameModels.Add(new ReportNameModel
            {
                Id = 1,
                Name = _outerInnerResourceLocalizationService.GetString("Employee")
            });
            reportNamesModel.ReportNameModels.Add(new ReportNameModel
            {
                Id = 2,
                Name = innerResourceName
            });
            reportNamesModel.ReportNameModels.Add(new ReportNameModel
            {
                Id = 3,
                Name = outerResourceName
            });
            reportNamesModel.ReportNameModels.Add(new ReportNameModel
            {
                Id = 4,
                Name = _outerInnerResourceLocalizationService.GetString("Employee") + "-"+outerResourceName
            });
            reportNamesModel.ReportNameModels.Add(new ReportNameModel
            {
                Id = 5,
                Name = _outerInnerResourceLocalizationService.GetString("Employee") + "-"+innerResourceName
            });
            reportNamesModel.ReportNameModels.Add(new ReportNameModel
            {
                Id = 6,
                Name = _outerInnerResourceLocalizationService.GetString("Employee") + "-Total"
            });
            reportNamesModel.ReportNameModels.Add(new ReportNameModel
            {
                Id = 7,
                Name = $"{outerResourceName} {innerResourceName}",
            });
            reportNamesModel.ReportNameModels.Add(new ReportNameModel
            {
                Id = 8,
                Name = $"{innerResourceName} {outerResourceName}",
            });

            return new OperationDataResult<ReportNamesModel>(true, reportNamesModel);
        }

        public async Task<OperationDataResult<ReportModel>> GenerateReport(GenerateReportModel model)
        {
            try
            {
                var reportTimeType = _options.Value.ReportTimeType;
                Core core = await _coreHelper.GetCore();
                List<SiteDto> sitesList = await core.SiteReadAll(false);

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
                
                // results to exclude
                
                string outerResourceName = "";
                OuterResource areaToExclude;
                InnerResource machineToExclude;
                string innerResourceName = "";
                List<ResourceTimeRegistration> jobsList;
                
                outerResourceName = _dbContext.PluginConfigurationValues.SingleOrDefault(x => x.Name == "OuterInnerResourceSettings:OuterTotalTimeName")?.Value;
                areaToExclude = _dbContext.OuterResources.SingleOrDefaultAsync(x => x.Name == outerResourceName).Result;
                innerResourceName = _dbContext.PluginConfigurationValues.SingleOrDefault(x => x.Name == "OuterInnerResourceSettings:InnerTotalTimeName")?.Value;
                machineToExclude = await _dbContext.InnerResources.SingleOrDefaultAsync(x => x.Name == innerResourceName);

                IQueryable<ResourceTimeRegistration> query = _dbContext.ResourceTimeRegistrations
                    .Include(x => x.InnerResource)
                    .Include(x => x.OuterResource);

                if (areaToExclude != null && machineToExclude != null)
                {
                    if (model.Relationship == ReportRelationshipType.EmployeeTotal)
                    {
                        query = query.Where(x =>
                            x.OuterResourceId == areaToExclude.Id && x.InnerResourceId == machineToExclude.Id);
                    }
                    else
                    {
                        query = query.Where(x =>
                            x.OuterResourceId != areaToExclude.Id && x.InnerResourceId != machineToExclude.Id);
                    }
                }
                else
                {
                    query = query
                        .Where(x => x.DoneAt >= modelDateFrom && x.DoneAt <= modelDateTo);
                }

                jobsList = await query.ToListAsync();

                ReportModel reportModel = ReportsHelper.GetReportData(model, jobsList, sitesList, reportTimeType);

                return new OperationDataResult<ReportModel>(true, reportModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<ReportModel>(false,
                    _outerInnerResourceLocalizationService.GetString("ErrorWhileGeneratingReport"));
            }
        }

        public async Task<OperationDataResult<FileStreamModel>> GenerateReportFile(GenerateReportModel model)
        {
            string excelFile = null;
            try
            {
                OperationDataResult<ReportModel> reportDataResult = await GenerateReport(model);
                if (!reportDataResult.Success)
                {
                    return new OperationDataResult<FileStreamModel>(false, reportDataResult.Message);
                }
                
                string outerResourceName = "";
                string innerResourceName = "";
                try
                {
                    outerResourceName = _dbContext.PluginConfigurationValues.SingleOrDefault(x => x.Name == "OuterInnerResourceSettings:OuterResourceName")?.Value;
                    innerResourceName = _dbContext.PluginConfigurationValues.SingleOrDefault(x => x.Name == "OuterInnerResourceSettings:InnerResourceName")?.Value; 
                }
                catch
                {
                }

                switch (reportDataResult.Model.Relationship)
                {
                    case ReportRelationshipType.Employee:
                        reportDataResult.Model.HumanReadableName =
                            _outerInnerResourceLocalizationService.GetString("Employee");
                        break;
                    case ReportRelationshipType.InnerResource:
                        reportDataResult.Model.HumanReadableName = innerResourceName;
                        break;
                    case ReportRelationshipType.OuterResource:
                        reportDataResult.Model.HumanReadableName = outerResourceName;
                        break;
                    case ReportRelationshipType.EmployeeInnerResource:
                        reportDataResult.Model.HumanReadableName =
                            _outerInnerResourceLocalizationService.GetString("Employee") + "-" + innerResourceName;
                        break;
                    case ReportRelationshipType.EmployeeOuterResource:
                        reportDataResult.Model.HumanReadableName =
                            _outerInnerResourceLocalizationService.GetString("Employee") + "-" + outerResourceName;
                        break;
                    case ReportRelationshipType.EmployeeTotal:
                        reportDataResult.Model.HumanReadableName =
                            _outerInnerResourceLocalizationService.GetString("Employee" + "-Total");
                        break;
                    case ReportRelationshipType.OuterInnerResource:
                        reportDataResult.Model.HumanReadableName =
                            $"{outerResourceName} {innerResourceName}";
                        break;
                    case ReportRelationshipType.InnerOuterResource:
                        reportDataResult.Model.HumanReadableName =
                            $"{innerResourceName} {outerResourceName}";
                        break;
                }

                excelFile = _excelService.CopyTemplateForNewAccount("report_template");
                bool writeResult = _excelService.WriteRecordsExportModelsToExcelFile(
                    reportDataResult.Model,
                    model,
                    excelFile);

                if (!writeResult)
                {
                    throw new Exception($"Error while writing excel file {excelFile}");
                }

                FileStreamModel result = new FileStreamModel()
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
                    _outerInnerResourceLocalizationService.GetString("ErrorWhileGeneratingReportFile"));
            }
        }
    }
}