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

namespace InsightDashboard.Pn.Services.InterviewsExcelService
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Reflection;
    using System.Security.Claims;
    using Infrastructure.Consts;
    using Infrastructure.Enum.Excel;
    using Infrastructure.Models.Export;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using ClosedXML.Excel;

    public class InterviewsExcelService : IInterviewsExcelService
    {
        private readonly IHttpContextAccessor _httpAccessor;
        private readonly ILogger<InterviewsExcelService> _logger;

        public InterviewsExcelService(
            ILogger<InterviewsExcelService> logger,
            IHttpContextAccessor httpAccessor)
        {
            _logger = logger;
            _httpAccessor = httpAccessor;
        }

        public bool WriteInterviewsExportToExcelFile(List<InterviewsExportModel> excelModel, string destFile)
        {
            var wb = new XLWorkbook(destFile);
                var worksheet = wb.Worksheets.Worksheet(ExcelConsts.Interviews.TemplateSheetNumber);
                var colCount = worksheet.Worksheet.ColumnCount();
                var rowIndex = ExcelConsts.Interviews.StartRow;
                excelModel.ForEach(excelRow =>
                {
                    for (var col = ExcelConsts.Interviews.StartCol; col <= colCount; col++)
                    {
                        var columnIndex = (InterviewsExport)col;
                        if (columnIndex > 0)
                        {
                            var columnName = columnIndex.ToString();
                            if (!string.IsNullOrEmpty(columnName))
                            {
                                var value = excelRow?.GetType().GetProperty(columnName)?.GetValue(excelRow, null);
                                if (value != null)
                                {
                                    if (value is DateTime dateTime)
                                    {
                                        worksheet.Cell(rowIndex, col).Value =
                                            dateTime.ToString(CultureInfo.InvariantCulture);
                                    }
                                    else if (value is decimal decimalValue)
                                    {
                                        worksheet.Cell(rowIndex, col).Style.NumberFormat.Format = "0.00";
                                        worksheet.Cell(rowIndex, col).Value = decimalValue;
                                    }
                                    else
                                    {
                                        worksheet.Cell(rowIndex, col).Value = value;
                                    }
                                }
                            }
                        }
                    }

                    rowIndex++;
                });
                wb.Save();
                wb.Dispose();

            return true;
        }

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
            {
                Directory.CreateDirectory(path);
            }

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
                var userId = UserId;
                if (userId <= 0)
                {
                    throw new ArgumentNullException(nameof(userId));
                }

                var assembly = typeof(EformInsightDashboardPlugin).GetTypeInfo().Assembly;
                var resourceStream = assembly.GetManifestResourceStream(
                    $"InsightDashboard.Pn.Resources.Templates.{templateId}.xlsx");

                destFile = GetFilePathForUser(userId, templateId);
                if (File.Exists(destFile))
                {
                    File.Delete(destFile);
                }
                using (var fileStream = File.Create(destFile))
                {
                    resourceStream?.Seek(0, SeekOrigin.Begin);
                    resourceStream?.CopyTo(fileStream);
                }
                return destFile;
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
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
