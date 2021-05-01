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
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using OfficeOpenXml;
using OuterInnerResource.Pn.Abstractions;
using OuterInnerResource.Pn.Infrastructure.Consts;
using OuterInnerResource.Pn.Infrastructure.Extensions;
using OuterInnerResource.Pn.Infrastructure.Models.Report;

namespace OuterInnerResource.Pn.Services
{
    public class ExcelService : IExcelService
    {
        private readonly IHttpContextAccessor _httpAccessor;
        private readonly IOuterInnerResourceLocalizationService _outerInnerResourceLocalizationService;
        private readonly ILogger<ExcelService> _logger;

        public ExcelService(
            ILogger<ExcelService> logger,
            IOuterInnerResourceLocalizationService outerInnerResourceLocalizationService,
            IHttpContextAccessor httpAccessor)
        {
            _logger = logger;
            _outerInnerResourceLocalizationService = outerInnerResourceLocalizationService;
            _httpAccessor = httpAccessor;
        }

        #region Write to excel

        public bool WriteRecordsExportModelsToExcelFile(ReportModel reportModel, GenerateReportModel generateReportModel, string destFile)
        {
            FileInfo file = new FileInfo(destFile);
            using (ExcelPackage package = new ExcelPackage(file))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[ExcelConsts.MachineAreaReportSheetNumber];
                // Fill base info
                string periodFromTitle = _outerInnerResourceLocalizationService.GetString("DateFrom");
                worksheet.Cells[ExcelConsts.EmployeeReport.PeriodFromTitleRow, ExcelConsts.EmployeeReport.PeriodFromTitleCol].Value = periodFromTitle;
                worksheet.Cells[ExcelConsts.EmployeeReport.PeriodFromRow, ExcelConsts.EmployeeReport.PeriodFromCol].Value = generateReportModel.DateFrom;

                string periodToTitle = _outerInnerResourceLocalizationService.GetString("DateTo");
                worksheet.Cells[ExcelConsts.EmployeeReport.PeriodToTitleRow, ExcelConsts.EmployeeReport.PeriodToTitleCol].Value = periodToTitle;
                worksheet.Cells[ExcelConsts.EmployeeReport.PeriodToRow, ExcelConsts.EmployeeReport.PeriodToCol].Value = generateReportModel.DateTo;        

                string showDataByTitle = _outerInnerResourceLocalizationService.GetString("ShowDataBy");
                worksheet.Cells[ExcelConsts.EmployeeReport.PeriodTypeTitleRow, ExcelConsts.EmployeeReport.PeriodTypeTitleCol].Value = showDataByTitle;        
                string showDataByValue = _outerInnerResourceLocalizationService.GetString(generateReportModel.Type.ToString());
                worksheet.Cells[ExcelConsts.EmployeeReport.PeriodTypeRow, ExcelConsts.EmployeeReport.PeriodTypeCol].Value = showDataByValue;        
                
                string reportTitle = _outerInnerResourceLocalizationService.GetString("Report");
                worksheet.Cells[ExcelConsts.EmployeeReport.ReportTitleRow, ExcelConsts.EmployeeReport.ReportTitleCol].Value = reportTitle;
                string reportName = _outerInnerResourceLocalizationService.GetString(reportModel.HumanReadableName);
                worksheet.Cells[ExcelConsts.EmployeeReport.ReportNameRow, ExcelConsts.EmployeeReport.ReportNameCol].Value = reportName;

//                Debugger.Break();
                int entityPosition = 0;
                foreach (SubReportModel subReport in reportModel.SubReports)
                {
                    // entity names
                    for (int i = 0; i < subReport.Entities.Count; i++)
                    {
                        int rowIndex = ExcelConsts.EmployeeReport.EntityNameStartRow + i + entityPosition;
                        ReportEntityModel reportEntity = subReport.Entities[i];
                        worksheet.UpdateValue(rowIndex, ExcelConsts.EmployeeReport.EntityNameStartCol, reportEntity?.EntityName, true);
                    }

                    // related entity names
                    for (int i = 0; i < subReport.Entities.Count; i++)
                    {
                        int rowIndex = ExcelConsts.EmployeeReport.RelatedEntityNameStartRow + i + entityPosition;
                        ReportEntityModel reportEntity = subReport.Entities[i];
                        worksheet.UpdateValue(rowIndex, ExcelConsts.EmployeeReport.RelatedEntityNameStartCol,
                            reportEntity?.RelatedEntityName, true);
                    }

                    // headers
                    for (int i = 0; i < reportModel.ReportHeaders.Count; i++)
                    {
                        ReportEntityHeaderModel reportHeader = reportModel.ReportHeaders[i];
                        int colIndex = ExcelConsts.EmployeeReport.HeaderStartCol + i;
                        int rowIndex = ExcelConsts.EmployeeReport.HeaderStartRow + entityPosition;
                        worksheet.UpdateValue(rowIndex, colIndex, reportHeader?.HeaderValue, true, true, Color.Wheat);
                    }

                    // vertical sum
                    for (int i = 0; i < subReport.Entities.Count; i++)
                    {
                        int rowIndex = ExcelConsts.EmployeeReport.VerticalSumStartRow + i + entityPosition;
                        ReportEntityModel reportEntity = subReport.Entities[i];
                        worksheet.UpdateValue(rowIndex, ExcelConsts.EmployeeReport.VerticalSumStartCol, reportEntity?.TotalTime, true, "0");
                    }

                    // vertical sum title
                    worksheet.UpdateValue(ExcelConsts.EmployeeReport.VerticalSumTitleRow + entityPosition, ExcelConsts.EmployeeReport.VerticalSumTitleCol, "Sum", true, true);

                    // data
                    for (int i = 0; i < subReport.Entities.Count; i++)
                    {
                        ReportEntityModel reportEntity = subReport.Entities[i];
                        int rowIndex = ExcelConsts.EmployeeReport.DataStartRow + i + entityPosition;
                        for (int y = 0; y < reportEntity.TimePerTimeUnit.Count; y++)
                        {
                            decimal time = reportEntity.TimePerTimeUnit[y];
                            int colIndex = ExcelConsts.EmployeeReport.DataStartCol + y;
                            worksheet.UpdateValue(rowIndex, colIndex, time, true, "0");
                        }
                    }

                    // horizontal sum
                    int horizontalSumRowIndex = ExcelConsts.EmployeeReport.DataStartRow + subReport.Entities.Count + entityPosition;
                    for (int i = 0; i < subReport.TotalTimePerTimeUnit.Count; i++)
                    {
                        decimal time = subReport.TotalTimePerTimeUnit[i];
                        int colIndex = ExcelConsts.EmployeeReport.HorizontalSumStartCol + i;
                        worksheet.UpdateValue(horizontalSumRowIndex, colIndex, time, true, "0");
                    }

                    // Report sum
                    int totalSumRowIndex = ExcelConsts.EmployeeReport.DataStartRow + subReport.Entities.Count + entityPosition;
                    decimal totalSum = subReport.TotalTime;
                    worksheet.UpdateValue(totalSumRowIndex, ExcelConsts.EmployeeReport.TotalSumCol, totalSum, true);
                    worksheet.UpdateValue(totalSumRowIndex, ExcelConsts.EmployeeReport.TotalSumTitleCol, "Sum", true);
                    entityPosition += subReport.Entities.Count + 3;
                } 

                package.Save(); //Save the workbook.
            }
            return true;
        }

        #endregion

        #region Working with file system
        
        private int UserId
        {
            get
            {
                string value = _httpAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return value == null ? 0 : int.Parse(value);
            }
        }

        private static string GetExcelStoragePath()
        {
            string path = Path.Combine(PathHelper.GetStoragePath(), "excel-storage");
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
            return path;
        }

        /// <summary>
        /// Will return filename for excel file
        /// </summary>
        /// <returns></returns>
        private static string BuildFileNameForExcelFile(int userId, string templateId)
        {
            return $"{templateId}-{userId}-{DateTime.UtcNow.Ticks}.xlsx";
        }

        /// <summary>
        /// Get path and filename for particular user
        /// </summary>
        /// <returns></returns>
        private static string GetFilePathForUser(int userId, string templateId)
        {
            string filesDir = GetExcelStoragePath();
            string destFile = Path.Combine(filesDir, BuildFileNameForExcelFile(userId, templateId));
            return destFile;
        }

        /// <summary>
        /// Copy template file to new excel file
        /// </summary>
        /// <param name="templateId">The template identifier.</param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException">userId</exception>
        public string CopyTemplateForNewAccount(string templateId)
        {
            string destFile = null;
            try
            {
                int userId = UserId;
                if (userId <= 0)
                {
                    throw new ArgumentNullException(nameof(userId));
                }

                Assembly assembly = typeof(EformOuterInnerResourcePlugin).GetTypeInfo().Assembly;
                Stream resourceStream = assembly.GetManifestResourceStream(
                    $"OuterInnerResource.Pn.Resources.Templates.{templateId}.xlsx");

                destFile = GetFilePathForUser(userId, templateId);
                if (File.Exists(destFile))
                {
                    File.Delete(destFile);
                }
                using (FileStream fileStream = File.Create(destFile))
                {
                    resourceStream.Seek(0, SeekOrigin.Begin);
                    resourceStream.CopyTo(fileStream);
                }
                return destFile;
            }
            catch (Exception e)
            {
                _logger.LogError(e,e.Message);
                if (File.Exists(destFile))
                {
                    File.Delete(destFile);
                }
                return null;
            }
        }

        #endregion
    }
}