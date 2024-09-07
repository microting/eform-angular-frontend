using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using eFormAPI.Web.Infrastructure.Models.Import;
using Microsoft.Extensions.Logging;
using Microting.EformAngularFrontendBase.Infrastructure.Const.Import;

namespace eFormAPI.Web.Services.Import;

public class EformExcelImportService(ILogger<EformExcelImportService> logger) : IEformExcelImportService
{
    public List<EformImportExcelModel> EformImport(Stream excelStream)
    {
        try
        {
            var result = new List<EformImportExcelModel>();

            using (var spreadsheetDocument = SpreadsheetDocument.Open(excelStream, false))
            {
                var workbookPart = spreadsheetDocument.WorkbookPart;

                // Find the sheet by index (EformImportExcelConsts.EformsWorksheet is treated as the 1-based index)
                var sheet = workbookPart.Workbook.Sheets.Elements<Sheet>()
                    .ElementAtOrDefault(EformImportExcelConsts.EformsWorksheet - 1); // Convert to 0-based index

                if (sheet == null)
                {
                    throw new Exception($"Sheet at index {EformImportExcelConsts.EformsWorksheet} not found.");
                }

                // Get the WorksheetPart associated with the sheet
                var worksheetPart = (WorksheetPart)workbookPart.GetPartById(sheet.Id);

                // Access the sheet data
                var sheetData = worksheetPart.Worksheet.Elements<SheetData>().FirstOrDefault();
                if (sheetData == null)
                {
                    throw new Exception("SheetData not found in the worksheet.");
                }

                var rows = sheetData.Elements<Row>().Skip(1); // Skip header row

                foreach (var row in rows)
                {
                    var name = GetCellValue(workbookPart, row, EformImportExcelConsts.EformNameCol);
                    var tag1 = GetCellValue(workbookPart, row, EformImportExcelConsts.Tag1Col);
                    var tag2 = GetCellValue(workbookPart, row, EformImportExcelConsts.Tag2Col);
                    var tag3 = GetCellValue(workbookPart, row, EformImportExcelConsts.Tag3Col);
                    var tag4 = GetCellValue(workbookPart, row, EformImportExcelConsts.Tag4Col);
                    var tag5 = GetCellValue(workbookPart, row, EformImportExcelConsts.Tag5Col);
                    var tag6 = GetCellValue(workbookPart, row, EformImportExcelConsts.Tag6Col);
                    var tag7 = GetCellValue(workbookPart, row, EformImportExcelConsts.Tag7Col);
                    var tag8 = GetCellValue(workbookPart, row, EformImportExcelConsts.Tag8Col);
                    var tag9 = GetCellValue(workbookPart, row, EformImportExcelConsts.Tag9Col);
                    var tag10 = GetCellValue(workbookPart, row, EformImportExcelConsts.Tag10Col);
                    var xml = GetCellValue(workbookPart, row, EformImportExcelConsts.EformXMLCol);

                    var item = new EformImportExcelModel
                    {
                        Name = name,
                        EformXML = xml,
                        ExcelRow = (int)row.RowIndex.Value
                    };

                    AddTagsIfNotEmpty(item, tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10);

                    item.ReportH1 = GetCellValue(workbookPart, row, EformImportExcelConsts.ReportH1);
                    item.ReportH2 = GetCellValue(workbookPart, row, EformImportExcelConsts.ReportH2);
                    item.ReportH3 = GetCellValue(workbookPart, row, EformImportExcelConsts.ReportH3);
                    item.ReportH4 = GetCellValue(workbookPart, row, EformImportExcelConsts.ReportH4);

                    result.Add(item);
                }
            }

            return result;
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            throw;
        }
    }

    private void AddTagsIfNotEmpty(EformImportExcelModel item, params string[] tags)
    {
        foreach (var tag in tags)
        {
            if (!string.IsNullOrEmpty(tag))
            {
                item.Tags.Add(tag);
            }
        }
    }

    private string GetCellValue(WorkbookPart workbookPart, Row row, int columnIndex)
    {
        var cell = row.Elements<Cell>().ElementAtOrDefault(columnIndex - 1); // Convert column index to 0-based
        if (cell == null) return string.Empty;

        var value = cell.CellValue?.Text;
        if (cell.DataType?.Value == CellValues.SharedString)
        {
            return workbookPart.SharedStringTablePart.SharedStringTable
                .Elements<SharedStringItem>()
                .ElementAt(int.Parse(value)).InnerText;
        }

        return value ?? string.Empty;
    }

}