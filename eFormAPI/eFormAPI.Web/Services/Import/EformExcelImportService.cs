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

using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using eFormAPI.Web.Infrastructure.Models.Import;
using eFormAPI.Web.Services.Export;
using Microsoft.Extensions.Logging;
using Microting.EformAngularFrontendBase.Infrastructure.Const.Import;

namespace eFormAPI.Web.Services.Import;

public class EformExcelImportService(ILogger<EformExcelExportService> logger) : IEformExcelImportService
{
    public List<EformImportExcelModel> EformImport(Stream excelStream)
    {
        try
        {
            var result = new List<EformImportExcelModel>();

            // Open the spreadsheet document
            using var document = SpreadsheetDocument.Open(excelStream, false);
            var workbookPart = document.WorkbookPart;
            // printe the names of the sheets in the workbook
            var sheets = workbookPart.Workbook.Descendants<Sheet>();
            foreach (var asheet in sheets)
            {
                Console.WriteLine(asheet.Name);
            }
            var sheet = workbookPart.Workbook.Sheets.Elements<Sheet>()
                .FirstOrDefault(s => s.Name == "Bruttoliste eForm");

            if (sheet == null)
            {
                throw new Exception("Worksheet not found.");
            }

            var worksheetPart = (WorksheetPart)workbookPart.GetPartById(sheet.Id);
            var rows = worksheetPart.Worksheet.GetFirstChild<SheetData>().Elements<Row>();

            foreach (var row in rows.Skip(1)) // Skip header
            {

                var item = new EformImportExcelModel
                {
                    Name = GetCellValue(workbookPart, row, EformImportExcelConsts.EformNameCol),
                    EformXML = GetCellValue(workbookPart, row, EformImportExcelConsts.EformXMLCol),
                    ExcelRow = (int)row.RowIndex.Value
                };
                if (item.EformXML == "")
                {
                    continue;
                }

                // Add tags
                AddTagIfNotEmpty(item.Tags, GetCellValue(workbookPart, row, EformImportExcelConsts.Tag1Col));
                AddTagIfNotEmpty(item.Tags, GetCellValue(workbookPart, row, EformImportExcelConsts.Tag2Col));
                AddTagIfNotEmpty(item.Tags, GetCellValue(workbookPart, row, EformImportExcelConsts.Tag3Col));
                AddTagIfNotEmpty(item.Tags, GetCellValue(workbookPart, row, EformImportExcelConsts.Tag4Col));
                AddTagIfNotEmpty(item.Tags, GetCellValue(workbookPart, row, EformImportExcelConsts.Tag5Col));
                AddTagIfNotEmpty(item.Tags, GetCellValue(workbookPart, row, EformImportExcelConsts.Tag6Col));
                AddTagIfNotEmpty(item.Tags, GetCellValue(workbookPart, row, EformImportExcelConsts.Tag7Col));
                AddTagIfNotEmpty(item.Tags, GetCellValue(workbookPart, row, EformImportExcelConsts.Tag8Col));
                AddTagIfNotEmpty(item.Tags, GetCellValue(workbookPart, row, EformImportExcelConsts.Tag9Col));
                AddTagIfNotEmpty(item.Tags, GetCellValue(workbookPart, row, EformImportExcelConsts.Tag10Col));

                // Report headers
                item.ReportH1 = GetCellValue(workbookPart, row, EformImportExcelConsts.ReportH1);
                item.ReportH2 = GetCellValue(workbookPart, row, EformImportExcelConsts.ReportH2);
                item.ReportH3 = GetCellValue(workbookPart, row, EformImportExcelConsts.ReportH3);
                item.ReportH4 = GetCellValue(workbookPart, row, EformImportExcelConsts.ReportH4);

                result.Add(item);
            }

            return result;
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            throw;
        }
    }

    private string GetCellValue(WorkbookPart workbookPart, Row row, int columnIndex)
    {
        // Get the column letter for the given columnIndex (e.g., A, B, C)
        var columnLetter = GetColumnLetter(columnIndex);

        // Create the cell reference (e.g., A1, B1, C1)
        var cellReference = columnLetter + row.RowIndex;

        // Find the cell with the matching CellReference
        var cell = row.Elements<Cell>().FirstOrDefault(c => c.CellReference.Value == cellReference);

        if (cell == null || cell.CellValue == null)
        {
            return string.Empty; // Handle empty or missing cells
        }

        // If the cell is using a Shared String Table (most string values are stored here)
        if (cell.DataType != null && cell.DataType.Value == CellValues.SharedString)
        {
            var sharedStringTablePart = workbookPart.GetPartsOfType<SharedStringTablePart>().FirstOrDefault();
            if (sharedStringTablePart != null)
            {
                var sharedStringTable = sharedStringTablePart.SharedStringTable;
                return sharedStringTable.ElementAt(int.Parse(cell.CellValue.Text)).InnerText;
            }
        }

        // Return the cell value directly for non-shared strings
        return cell.CellValue.Text;
    }

    private string GetColumnLetter(int columnIndex)
    {
        string columnLetter = "";
        while (columnIndex > 0)
        {
            int modulo = (columnIndex - 1) % 26;
            columnLetter = Convert.ToChar(65 + modulo) + columnLetter;
            columnIndex = (columnIndex - modulo) / 26;
        }
        return columnLetter;
    }

    // Helper method to add tags to the list if not empty
    private void AddTagIfNotEmpty(List<string> tags, string tagValue)
    {
        if (!string.IsNullOrEmpty(tagValue))
        {
            tags.Add(tagValue);
        }
    }
}