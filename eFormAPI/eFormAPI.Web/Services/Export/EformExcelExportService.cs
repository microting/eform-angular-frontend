using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DocumentFormat.OpenXml;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models;
using Microsoft.Extensions.Logging;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services.Export;

public class EformExcelExportService(
    IEFormCoreService coreHelper,
    IUserService userService,
    ILocalizationService localizationService,
    ILogger<EformExcelExportService> logger)
    : IEformExcelExportService
{
    public async Task<OperationDataResult<Stream>> EformExport(EformDownloadExcelModel excelModel)
    {
        try
        {
            var core = await coreHelper.GetCore();
            var cultureInfo = new CultureInfo("de-DE");

            var language = await userService.GetCurrentUserLanguage();
            var timeZoneInfo = await userService.GetCurrentUserTimeZoneInfo();

            var customPathForUploadedData = $"{await core.GetSdkSetting(Settings.httpServerAddress)}/" +
                                            "api/template-files/get-image/";

            var ts = new TimeSpan(0, 0, 0);
            var startDate = excelModel.DateFrom.Date + ts;
            ts = new TimeSpan(23, 59, 59);
            var endDate = excelModel.DateTo.Date + ts;
            var dataSet = await core.GenerateDataSetFromCases(
                excelModel.TemplateId,
                startDate,
                endDate,
                customPathForUploadedData,
                ",",
                "",
                false,
                cultureInfo,
                timeZoneInfo, language, true, false).ConfigureAwait(false);

            if (dataSet == null)
            {
                return new OperationDataResult<Stream>(
                    false,
                    localizationService.GetString("DataNotFound"));
            }

            Directory.CreateDirectory(Path.Combine(Path.GetTempPath(), "results"));
            var timeStamp = $"{DateTime.UtcNow:yyyyMMdd_HHmmss}";
            var resultDocument = Path.Combine(Path.GetTempPath(), "results",
                $"{timeStamp}_{excelModel.TemplateId}.xlsx");

            // Create the Excel file using DocumentFormat.OpenXML
            using (var spreadsheetDocument =
                   SpreadsheetDocument.Create(resultDocument, SpreadsheetDocumentType.Workbook))
            {
                WorkbookPart workbookPart = spreadsheetDocument.AddWorkbookPart();
                workbookPart.Workbook = new Workbook();

                // Add a Stylesheet with bold header formatting
                var stylesPart = workbookPart.AddNewPart<WorkbookStylesPart>();
                stylesPart.Stylesheet = CreateStylesheet();
                stylesPart.Stylesheet.Save();

                var sheets = workbookPart.Workbook.AppendChild(new Sheets());

                // Create a new worksheet
                WorksheetPart worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
                worksheetPart.Worksheet = new Worksheet(new SheetData());

                // Add the worksheet to the workbook
                var sheet = new Sheet
                {
                    Id = workbookPart.GetIdOfPart(worksheetPart),
                    SheetId = 1,
                    Name = $"Data_{excelModel.TemplateId}"
                };
                sheets.Append(sheet);

                // Get the sheet data
                SheetData sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();

                // Create the header row and make it bold
                var headerRow = new Row { RowIndex = 1 };
                sheetData.Append(headerRow);

                for (var y = 0; y < dataSet.Count; y++)
                {
                    var dataX = dataSet[y];

                    for (var x = 0; x < dataX.Count; x++)
                    {
                        var dataY = dataX[x];

                        var row = sheetData.Elements<Row>().FirstOrDefault(r => r.RowIndex == (uint)(x + 1)) ??
                                  new Row { RowIndex = (uint)(x + 1) };

                        if (!sheetData.Elements<Row>().Any(r => r.RowIndex == (uint)(x + 1)))
                        {
                            sheetData.Append(row);
                        }

                        if (x == 0)
                        {
                            var cell = ConstructCell(dataY, CellValues.String);
                            cell.StyleIndex = 1; // Make the header bold
                            row.Append(cell);
                        }
                        else
                        {
                            var cell = ConstructCell(dataY, CellValues.String);
                            row.Append(cell);
                        }
                    }
                }

                // Apply autofilter and table formatting
                ApplyTableFormatting(sheet, worksheetPart, sheetData);

                workbookPart.Workbook.Save();
            }

            // Return the generated Excel file as a Stream
            Stream result = File.Open(resultDocument, FileMode.Open);
            return new OperationDataResult<Stream>(true, result);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            return new OperationDataResult<Stream>(
                false,
                localizationService.GetString("ErrorWhileExportingExcelFile"));
        }
    }

    private void ApplyTableFormatting(Sheet sheet, WorksheetPart worksheetPart, SheetData sheetData)
    {
        // Define the range for the table
        var columns = sheetData.Elements<Row>().First().Elements<Cell>().Count();
        var rows = sheetData.Elements<Row>().Count();
        string range = $"A1:{GetColumnLetter(columns)}{rows}";

        // Apply auto filter
        AutoFilter autoFilter = new AutoFilter() { Reference = range };
        worksheetPart.Worksheet.InsertAfter(autoFilter, sheetData);

        // Define table
        TableDefinitionPart tablePart = worksheetPart.AddNewPart<TableDefinitionPart>();
        Table table = new Table()
        {
            Id = (uint)new Random().Next(1, 10000),
            Name = "Table1",
            DisplayName = "Table1",
            Reference = range,
            AutoFilter = new AutoFilter() { Reference = range }
        };

        TableColumns tableColumns = new TableColumns() { Count = (uint)columns };
        for (uint i = 1; i <= columns; i++)
        {
            tableColumns.Append(new TableColumn() { Id = i, Name = $"Column{i}" });
        }

        table.Append(tableColumns);
        table.Append(new TableStyleInfo() { Name = "TableStyleMedium2", ShowFirstColumn = false, ShowLastColumn = false, ShowRowStripes = true, ShowColumnStripes = false });
        tablePart.Table = table;
        table.Save();
    }

    private Cell ConstructCell(string value, CellValues dataType)
    {
        return new Cell
        {
            CellValue = new CellValue(value),
            DataType = new EnumValue<CellValues>(dataType)
        };
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

    private Stylesheet CreateStylesheet()
    {
        return new Stylesheet(
            new Fonts(
                new Font(
                    new Bold(),
                    new FontSize { Val = 11 }, // Bold Font for Headers
                    new FontName { Val = "Calibri" })),
            new Fills(
                new Fill(new PatternFill { PatternType = PatternValues.None }),
                new Fill(new PatternFill { PatternType = PatternValues.Gray125 })),
            new Borders(
                new Border(
                    new LeftBorder(),
                    new RightBorder(),
                    new TopBorder(),
                    new BottomBorder(),
                    new DiagonalBorder())),
            new CellFormats(
                new CellFormat(),
                new CellFormat
                {
                    FontId = 0,
                    FillId = 0,
                    BorderId = 0,
                    ApplyFont = true
                }
            )
        );
    }
}