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

namespace ItemsGroupPlanning.Pn.Services
{
    using System;
    using System.IO;
    using System.Reflection;
    using System.Security.Claims;
    using Abstractions;
    using Infrastructure.Models;
    using Infrastructure.Models.Report;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using OfficeOpenXml;
    using OfficeOpenXml.Style;

    public class ExcelService : IExcelService
    {
        private readonly IHttpContextAccessor _httpAccessor;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly ILogger<ExcelService> _logger;

        public ExcelService(IHttpContextAccessor httpAccessor, IItemsPlanningLocalizationService itemsPlanningLocalizationService, ILogger<ExcelService> logger)
        {
            _httpAccessor = httpAccessor;
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
            _logger = logger;
        }

        #region Write to excel

        public bool WriteRecordsExportModelsToExcelFile(ReportModel reportModel, GenerateReportModel generateReportModel, string destFile)
        {
            var file = new FileInfo(destFile);
            using (var package = new ExcelPackage(file))
            {
                var worksheet = package.Workbook.Worksheets[1];
                // Fill base info
                var nameTitle = _itemsPlanningLocalizationService.GetString("Name");
                worksheet.Cells[2, 2].Value = nameTitle;
                worksheet.Cells[2, 3].Value = reportModel.Name;

                var descriptionTitle = _itemsPlanningLocalizationService.GetString("Description");
                worksheet.Cells[3, 2].Value = descriptionTitle;
                worksheet.Cells[3, 3].Value = reportModel.Description;   

                var periodFromTitle = _itemsPlanningLocalizationService.GetString("DateFrom");
                worksheet.Cells[5, 2].Value = periodFromTitle;
                worksheet.Cells[5, 3].Value = reportModel.DateFrom?.ToString("MM/dd/yyyy HH:mm");

                var periodToTitle = _itemsPlanningLocalizationService.GetString("DateTo");
                worksheet.Cells[6, 2].Value = periodToTitle;
                worksheet.Cells[6, 3].Value = reportModel.DateTo?.ToString("MM/dd/yyyy HH:mm");

                var col = 4;
                var row = 8;

                // Fill dates headers
                var idName = _itemsPlanningLocalizationService.GetString("Id");
                worksheet.Cells[8, 3].Value = idName;
                foreach (var id in reportModel.Ids)
                {
                    worksheet.Cells[row, col].Value = id;
                    worksheet.Cells[row, col].Style.Font.Bold = true;
                    worksheet.Cells[row, col].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    worksheet.Cells[row, col].AutoFitColumns();
                    col++;
                }

                row += 1;
                col = 4;
                var deployedAt = _itemsPlanningLocalizationService.GetString("Deployed at");
                worksheet.Cells[9, 3].Value = deployedAt;
                foreach (var date in reportModel.Dates)
                {
                    worksheet.Cells[row, col].Value = date?.ToString("MM/dd/yyyy");
                    worksheet.Cells[row, col].Style.Font.Bold = true;
                    worksheet.Cells[row, col].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    worksheet.Cells[row, col].AutoFitColumns();
                    col++;
                }

                row += 1;
                col = 4;
                var doneAt = _itemsPlanningLocalizationService.GetString("Date of doing");
                worksheet.Cells[10, 3].Value = doneAt;
                foreach (var date in reportModel.DatesDoneAt)
                {
                    worksheet.Cells[row, col].Value = date?.ToString("MM/dd/yyyy");
                    worksheet.Cells[row, col].Style.Font.Bold = true;
                    worksheet.Cells[row, col].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    worksheet.Cells[row, col].AutoFitColumns();
                    col++;
                }

                row += 1;
                col = 4;
                var doneBy = _itemsPlanningLocalizationService.GetString("Done by");
                worksheet.Cells[11, 3].Value = doneBy;
                foreach (var name in reportModel.DoneBy)
                {
                    worksheet.Cells[row, col].Value = name;
                    worksheet.Cells[row, col].Style.Font.Bold = true;
                    worksheet.Cells[row, col].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    worksheet.Cells[row, col].AutoFitColumns();
                    col++;
                }
                col = 4;

                worksheet.Cells[row, 2, row, col - 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                row++;

                // Fill form fields and options with data
                foreach (var field in reportModel.FormFields)
                {
                    worksheet.Cells[row, 2].Value = field.Label;
                    worksheet.Cells[row, 2, row + field.Options.Count - 1, 2].Merge = true;

                    var fRow = row;

                    foreach (var option in field.Options)
                    {
                        col = 4;

                        foreach (var value in option.Values)
                        {
                            if (value?.GetType() == typeof(decimal))
                            {
                                worksheet.Cells[row, col].Style.Numberformat.Format = "0.00";
                            }

                            worksheet.Cells[row, col].Value = value;
                            worksheet.Cells[row, col].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                            col++;
                        }

                        worksheet.Cells[row, 3].Value = option.Label;
                        worksheet.Cells[row, 3].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                        row++;
                    }

                    worksheet.Cells[fRow, 2, row - 1, col - 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                }

                package.Save(); //Save the workbook.
            }
            return true;
        }

        public bool WriteTableToExcel(string name, string description, ItemListPnCaseResultListModel reportModel,
            ItemListCasesPnRequestModel requestModel, string destFile)
        {
            var file = new FileInfo(destFile);
            using (var package = new ExcelPackage(file))
            {
                var worksheet = package.Workbook.Worksheets[1];
                // Fill base info
                var nameTitle = _itemsPlanningLocalizationService.GetString("Name");
                worksheet.Cells[2, 2].Value = nameTitle;
                worksheet.Cells[2, 3].Value = name;

                var descriptionTitle = _itemsPlanningLocalizationService.GetString("Description");
                worksheet.Cells[3, 2].Value = descriptionTitle;
                worksheet.Cells[3, 3].Value = description;

                var periodFromTitle = _itemsPlanningLocalizationService.GetString("DateFrom");
                worksheet.Cells[5, 2].Value = periodFromTitle;
                worksheet.Cells[5, 3].Value = requestModel.DateFrom?.ToString("MM/dd/yyyy");

                var periodToTitle = _itemsPlanningLocalizationService.GetString("DateTo");
                worksheet.Cells[6, 2].Value = periodToTitle;
                worksheet.Cells[6, 3].Value = requestModel.DateTo?.ToString("MM/dd/yyyy");

                var col = 2;
                var row = 8;
                
                // Fill headers

                worksheet = SetHeaders(worksheet, row, col, reportModel);

                row = 9;

                worksheet = SetRows(worksheet, row, col, reportModel);

                package.Save(); //Save the workbook.
            }

            return true;
        }

        private ExcelWorksheet SetHeaders(ExcelWorksheet worksheet, int row, int col, ItemListPnCaseResultListModel reportModel)
        {
            worksheet = SetRow(worksheet, row, col, true, true, false, _itemsPlanningLocalizationService.GetString("Id"));
            col += 1;
            
            if (reportModel.DeployedAtEnabled) {
                worksheet = SetRow(worksheet, row, col, true, true, true, _itemsPlanningLocalizationService.GetString("Deployed at"));
                col += 1;
            }
            if (reportModel.DoneAtEnabled) {
                worksheet = SetRow(worksheet, row, col, true, true, true, _itemsPlanningLocalizationService.GetString("Date of doing"));
                col += 1;
            }
            if (reportModel.DoneByUserNameEnabled) {
                worksheet = SetRow(worksheet, row, col, true, true, true, _itemsPlanningLocalizationService.GetString("Done by"));
                col += 1;
            }
            if (reportModel.LabelEnabled) {
                worksheet = SetRow(worksheet, row, col, true, true, true, _itemsPlanningLocalizationService.GetString("Name"));
                col += 1;
            }
            if (reportModel.DescriptionEnabled) {
                worksheet = SetRow(worksheet, row, col, true, true, true, _itemsPlanningLocalizationService.GetString("Description"));
                col += 1;
            }
            if (reportModel.ItemNumberEnabled) {
                worksheet = SetRow(worksheet, row, col, true, true, true, _itemsPlanningLocalizationService.GetString("Item number"));
                col += 1;
            }
            if (reportModel.LocationCodeEnabled) {
                worksheet = SetRow(worksheet, row, col, true, true, true, _itemsPlanningLocalizationService.GetString("Location code"));
                col += 1;
            }
            if (reportModel.BuildYearEnabled) {
                worksheet = SetRow(worksheet, row, col, true, true, true, _itemsPlanningLocalizationService.GetString("Build year"));
                col += 1;
            }
            if (reportModel.TypeEnabled) {
                worksheet = SetRow(worksheet, row, col, true, true, true, _itemsPlanningLocalizationService.GetString("Type"));
                col += 1;
            }
            
            if (reportModel.FieldEnabled1) {
                worksheet = SetRow(worksheet, row, col, true, true, true, reportModel.FieldName1);
                col += 1;
            }
            if (reportModel.FieldEnabled2) {
                worksheet = SetRow(worksheet, row, col, true, true, true, reportModel.FieldName2);
                col += 1;
            }
            if (reportModel.FieldEnabled3) {
                worksheet = SetRow(worksheet, row, col, true, true, true, reportModel.FieldName3);
                col += 1;
            }
            if (reportModel.FieldEnabled4) {
                worksheet = SetRow(worksheet, row, col, true, true, true, reportModel.FieldName4);
                col += 1;
            }
            if (reportModel.FieldEnabled5) {
                worksheet = SetRow(worksheet, row, col, true, true, true, reportModel.FieldName5);
                col += 1;
            }
            if (reportModel.FieldEnabled6) {
                worksheet = SetRow(worksheet, row, col, true, true, true, reportModel.FieldName6);
                col += 1;
            }
            if (reportModel.FieldEnabled7) {
                worksheet = SetRow(worksheet, row, col, true, true, true, reportModel.FieldName7);
                col += 1;
            }
            if (reportModel.FieldEnabled8) {
                worksheet = SetRow(worksheet, row, col, true, true, true, reportModel.FieldName8);
                col += 1;
            }
            if (reportModel.FieldEnabled9) {
                worksheet = SetRow(worksheet, row, col, true, true, true, reportModel.FieldName9);
                col += 1;
            }
            if (reportModel.FieldEnabled10) {
                worksheet = SetRow(worksheet, row, col, true, true, true, reportModel.FieldName10);
                col += 1;
            }
            if (reportModel.NumberOfImagesEnabled) {
                worksheet = SetRow(worksheet, row, col, true, true, true, _itemsPlanningLocalizationService.GetString("Number of images"));
                col += 1;
            }

            return worksheet;
        }

        private ExcelWorksheet SetRows(ExcelWorksheet worksheet, int row, int col, ItemListPnCaseResultListModel reportModel)
        {
            int startColNo = col;
            foreach (ItemsListPnCaseResultModel itemsListPnCaseResultModel in reportModel.Items)
            {
                col = startColNo;
                worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.Id);
                col += 1;

                if (reportModel.DeployedAtEnabled)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, true, itemsListPnCaseResultModel.DeployedAt?.ToString("MM/dd/yyyy hh:mm"));
                    col += 1;
                }

                if (reportModel.DoneAtEnabled)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, true, itemsListPnCaseResultModel.DoneAt?.ToString("MM/dd/yyyy hh:mm"));
                    col += 1;
                }

                if (reportModel.DoneByUserNameEnabled)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, true, itemsListPnCaseResultModel.DoneByUserName);
                    col += 1;
                }

                if (reportModel.LabelEnabled)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, true, itemsListPnCaseResultModel.Label);
                    col += 1;
                }

                if (reportModel.DescriptionEnabled)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, true, itemsListPnCaseResultModel.Description);
                    col += 1;
                }

                if (reportModel.ItemNumberEnabled)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.ItemNumber);
                    col += 1;
                }

                if (reportModel.LocationCodeEnabled)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.LocationCode);
                    col += 1;
                }

                if (reportModel.BuildYearEnabled)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.BuildYear);
                    col += 1;
                }

                if (reportModel.TypeEnabled)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.Type);
                    col += 1;
                }

                if (reportModel.FieldEnabled1)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.Field1);
                    col += 1;
                }

                if (reportModel.FieldEnabled2)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.Field2);
                    col += 1;
                }

                if (reportModel.FieldEnabled3)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.Field3);
                    col += 1;
                }

                if (reportModel.FieldEnabled4)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.Field4);
                    col += 1;
                }

                if (reportModel.FieldEnabled5)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.Field5);
                    col += 1;
                }

                if (reportModel.FieldEnabled6)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.Field6);
                    col += 1;
                }

                if (reportModel.FieldEnabled7)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.Field7);
                    col += 1;
                }

                if (reportModel.FieldEnabled8)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.Field8);
                    col += 1;
                }

                if (reportModel.FieldEnabled9)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.Field9);
                    col += 1;
                }

                if (reportModel.FieldEnabled10)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.Field10);
                    col += 1;
                }

                if (reportModel.NumberOfImagesEnabled)
                {
                    worksheet = SetRow(worksheet, row, col, false, true, false, itemsListPnCaseResultModel.NumberOfImages);
                    col += 1;
                }

                row += 1;
            }
            return worksheet;
        }
        
        private ExcelWorksheet SetRow(ExcelWorksheet worksheet, int row, int col, bool boldText, bool thinBorder, bool
            autoFitColumns, object value)
        {
            worksheet.Cells[row, col].Value = value;
            worksheet.Cells[row, col].Style.Font.Bold = boldText;
            if (thinBorder) {
                worksheet.Cells[row, col].Style.Border.BorderAround(ExcelBorderStyle.Thin);
            }
            if (autoFitColumns)
            {
                worksheet.Cells[row, col].AutoFitColumns();    
            }
            
            return worksheet;
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

                Assembly assembly = typeof(EformItemsGroupPlanningPlugin).GetTypeInfo().Assembly;
                Stream resourceStream = assembly.GetManifestResourceStream(
                    $"ItemsPlanning.Pn.Resources.Templates.{templateId}.xlsx");

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