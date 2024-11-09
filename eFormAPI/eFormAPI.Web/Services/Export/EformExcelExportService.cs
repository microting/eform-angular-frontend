using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Validation;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormAPI.Web.Infrastructure.Models;
using Microsoft.Extensions.Logging;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Sentry;

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
            var filePath = Path.Combine(Path.GetTempPath(), "results",
                $"{timeStamp}_{excelModel.TemplateId}.xlsx");

            // Create the Excel file using DocumentFormat.OpenXML
            using (var document =
                   SpreadsheetDocument.Create(filePath, SpreadsheetDocumentType.Workbook))
            {
                WorkbookPart workbookPart1 = document.AddWorkbookPart();
                OpenXMLHelper.GenerateWorkbookPart1Content(workbookPart1,
                    [new($"Data_{excelModel.TemplateId}", "rId1")]);

                WorkbookStylesPart workbookStylesPart1 = workbookPart1.AddNewPart<WorkbookStylesPart>("rId3");
                OpenXMLHelper.GenerateWorkbookStylesPart1Content(workbookStylesPart1);

                ThemePart themePart1 = workbookPart1.AddNewPart<ThemePart>("rId2");
                OpenXMLHelper.GenerateThemePart1Content(themePart1);

                WorksheetPart worksheetPart1 = workbookPart1.AddNewPart<WorksheetPart>("rId1");

                List<string> headerStrings = new List<string>();
                for (var y = 0; y < dataSet.Count; y++)
                {
                    var dataX = dataSet[y];

                    for (var x = 0; x < dataX.Count; x++)
                    {
                        var dataY = dataX[x];
                        if (x == 0)
                        {
                            headerStrings.Add(dataY);
                        }
                    }
                }

                Worksheet worksheet1 = new Worksheet()
                    { MCAttributes = new MarkupCompatibilityAttributes() { Ignorable = "x14ac xr xr2 xr3" } };
                worksheet1.AddNamespaceDeclaration("r",
                    "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
                worksheet1.AddNamespaceDeclaration("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006");
                worksheet1.AddNamespaceDeclaration("x14ac",
                    "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac");
                worksheet1.AddNamespaceDeclaration("xr",
                    "http://schemas.microsoft.com/office/spreadsheetml/2014/revision");
                worksheet1.AddNamespaceDeclaration("xr2",
                    "http://schemas.microsoft.com/office/spreadsheetml/2015/revision2");
                worksheet1.AddNamespaceDeclaration("xr3",
                    "http://schemas.microsoft.com/office/spreadsheetml/2016/revision3");
                worksheet1.SetAttribute(new OpenXmlAttribute("xr", "uid",
                    "http://schemas.microsoft.com/office/spreadsheetml/2014/revision",
                    "{00000000-0001-0000-0000-000000000000}"));

                SheetFormatProperties sheetFormatProperties1 = new SheetFormatProperties()
                    { DefaultRowHeight = 15D, DyDescent = 0.25D };

                SheetData sheetData1 = new SheetData();

                Row row1 = new Row()
                {
                    RowIndex = (UInt32Value)1U, Spans = new ListValue<StringValue>() { InnerText = "1:19" },
                    DyDescent = 0.25D
                };

                foreach (var header in headerStrings)
                {
                    var cell = new Cell()
                    {
                        CellValue = new CellValue(header),
                        DataType = CellValues.String,
                        StyleIndex = (UInt32Value)1U
                    };
                    row1.Append(cell);
                }

                sheetData1.Append(row1);

                int rowIndex = 2;
                for (var y = 0; y < dataSet.Count; y++)
                {
                    var dataX = dataSet[y];

                    for (var x = 0; x < dataX.Count; x++)
                    {
                        var dataY = dataX[x];
                        var row = sheetData1.Elements<Row>().FirstOrDefault(r => r.RowIndex == (uint)(x + 1)) ??
                                  new Row { RowIndex = (uint)(x + 1) };

                        if (!sheetData1.Elements<Row>().Any(r => r.RowIndex == (uint)(x + 1)))
                        {
                            sheetData1.Append(row);
                            rowIndex++;
                        }

                        var cell = CreateCell(dataY);
                        row.Append(cell);
                    }
                }

                var columnLetter = GetColumnLetter(headerStrings.Count);
                AutoFilter autoFilter1 = new AutoFilter() { Reference = $"A1:{columnLetter}{rowIndex}" };
                autoFilter1.SetAttribute(new OpenXmlAttribute("xr", "uid",
                    "http://schemas.microsoft.com/office/spreadsheetml/2014/revision",
                    "{00000000-0001-0000-0000-000000000000}"));
                PageMargins pageMargins1 = new PageMargins()
                    { Left = 0.7D, Right = 0.7D, Top = 0.75D, Bottom = 0.75D, Header = 0.3D, Footer = 0.3D };

                worksheet1.Append(sheetFormatProperties1);
                worksheet1.Append(sheetData1);
                worksheet1.Append(autoFilter1);
                worksheet1.Append(pageMargins1);

                worksheetPart1.Worksheet = worksheet1;
            }

            ValidateExcel(filePath);

            // Return the generated Excel file as a Stream
            Stream result = File.Open(filePath, FileMode.Open);
            return new OperationDataResult<Stream>(true, result);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<Stream>(
                false,
                localizationService.GetString("ErrorWhileExportingExcelFile"));
        }
    }

    private void ValidateExcel(string fileName)
    {
        try
        {
            var validator = new OpenXmlValidator();
            int count = 0;
            StringBuilder sb = new StringBuilder();
            var doc = SpreadsheetDocument.Open(fileName, true);
            foreach (ValidationErrorInfo error in validator.Validate(doc))
            {

                count++;
                sb.Append(("Error Count : " + count) + "\r\n");
                sb.Append(("Description : " + error.Description) + "\r\n");
                sb.Append(("Path: " + error.Path.XPath) + "\r\n");
                sb.Append(("Part: " + error.Part.Uri) + "\r\n");
                sb.Append("\r\n-------------------------------------------------\r\n");
            }

            doc.Dispose();
            if (count <= 0) return;
            sb.Append(("Total Errors in file: " + count));
            throw new Exception(sb.ToString());
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
        }
    }

    private Cell CreateCell(string value)
    {
        return new Cell()
        {
            CellValue = new CellValue(value),
            DataType = CellValues.String // Explicitly setting the data type to string
        };
    }

    private Cell CreateNumericCell(double value)
    {
        return new Cell()
        {
            CellValue = new CellValue(value.ToString(CultureInfo.InvariantCulture)),
            DataType = CellValues.Number
        };
    }

    private Cell CreateDateCell(DateTime dateValue)
    {
        return new Cell()
        {
            CellValue = new CellValue(dateValue.ToOADate()
                .ToString(CultureInfo.InvariantCulture)), // Excel stores dates as OLE Automation date values
            DataType = CellValues.Number, // Excel treats dates as numbers
            StyleIndex = 2 // Assuming StyleIndex 2 corresponds to the date format in the stylesheet
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
}