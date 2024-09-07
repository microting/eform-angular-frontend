using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using ICSharpCode.SharpZipLib.Zip;
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

namespace eFormAPI.Web.Services.Export
{
    public class EformExcelExportService : IEformExcelExportService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly IUserService _userService;
        private readonly ILocalizationService _localizationService;
        private readonly ILogger<EformExcelExportService> _logger;

        public EformExcelExportService(
            IEFormCoreService coreHelper,
            IUserService userService,
            ILocalizationService localizationService,
            ILogger<EformExcelExportService> logger)
        {
            _coreHelper = coreHelper;
            _userService = userService;
            _localizationService = localizationService;
            _logger = logger;
        }

        public async Task<OperationDataResult<Stream>> EformExport(EformDownloadExcelModel excelModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var cultureInfo = new CultureInfo("de-DE");
                var language = await _userService.GetCurrentUserLanguage();
                var timeZoneInfo = await _userService.GetCurrentUserTimeZoneInfo();

                var customPathForUploadedData = $"{await core.GetSdkSetting(Settings.httpServerAddress)}/api/template-files/get-image/";
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
                        _localizationService.GetString("DataNotFound"));
                }

                var timeStamp = $"{DateTime.UtcNow:yyyyMMdd}_{DateTime.UtcNow:hhmmss}";
                var resultDocument = Path.Combine(Path.GetTempPath(), "results", $"{timeStamp}_{excelModel.TemplateId}.xlsx");
                Directory.CreateDirectory(Path.Combine(Path.GetTempPath(), "results"));

                if (await core.GetSdkSetting(Settings.s3Enabled) == "true")
                {
                    try
                    {
                        var objectResponse = await core.GetFileFromS3Storage($"{excelModel.TemplateId}.xlsx");
                        await using (var fileStream = File.Create(resultDocument))
                        {
                            await objectResponse.ResponseStream.CopyToAsync(fileStream);
                            await fileStream.FlushAsync();
                        }
                    }
                    catch (Exception exception)
                    {
                        try
                        {
                            var objectResponse = await core.GetFileFromS3Storage($"{excelModel.TemplateId}_xlsx_compact.zip");
                            var zipFileName = Path.Combine(Path.GetTempPath(), $"{excelModel.TemplateId}.zip");
                            await using (var fileStream = File.Create(zipFileName))
                            {
                                await objectResponse.ResponseStream.CopyToAsync(fileStream);
                            }
                            var fastZip = new FastZip();
                            var extractPath = Path.Combine(Path.GetTempPath(), "results");
                            Directory.CreateDirectory(extractPath);
                            fastZip.ExtractZip(zipFileName, extractPath, "");
                            var extractedFile = Path.Combine(extractPath, "compact", $"{excelModel.TemplateId}.xlsx");
                            await core.PutFileToStorageSystem(extractedFile, $"{excelModel.TemplateId}.xlsx");
                            File.Move(extractedFile, resultDocument);
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e.Message);
                            throw;
                        }
                    }
                }

                if (!File.Exists(resultDocument))
                {
                    return new OperationDataResult<Stream>(
                        false,
                        _localizationService.GetString("ExcelTemplateNotFoundInStorage"));
                }

                using (var spreadsheetDocument = SpreadsheetDocument.Open(resultDocument, true))
                {
                    var workbookPart = spreadsheetDocument.WorkbookPart;
                    var worksheetPart = workbookPart.WorksheetParts.FirstOrDefault();
                    if (worksheetPart == null)
                    {
                        worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
                        worksheetPart.Worksheet = new Worksheet(new SheetData());
                    }

                    var sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();
                    if (sheetData == null)
                    {
                        sheetData = new SheetData();
                        worksheetPart.Worksheet.Append(sheetData);
                    }

                    // Clear old data
                    sheetData.RemoveAllChildren();

                    // Create header row
                    var headerRow = new Row();
                    for (var i = 0; i < dataSet[0].Count; i++)
                    {
                        var headerCell = new Cell
                        {
                            CellValue = new CellValue(dataSet[0][i]),
                            DataType = new EnumValue<CellValues>(CellValues.String)
                        };
                        headerRow.Append(headerCell);
                    }
                    sheetData.Append(headerRow);

                    // Populate data rows
                    for (var y = 1; y < dataSet.Count; y++)
                    {
                        var row = new Row();
                        for (var x = 0; x < dataSet[y].Count; x++)
                        {
                            var cellValue = dataSet[y][x];
                            var cell = new Cell
                            {
                                CellValue = new CellValue(cellValue),
                                DataType = GetCellType(cellValue, y)
                            };
                            row.Append(cell);
                        }
                        sheetData.Append(row);
                    }

                    workbookPart.Workbook.Save();
                }

                Stream result = File.Open(resultDocument, FileMode.Open);
                return new OperationDataResult<Stream>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationDataResult<Stream>(
                    false,
                    _localizationService.GetString("ErrorWhileExportingExcelFile"));
            }
        }

        private EnumValue<CellValues> GetCellType(string value, int rowIndex)
        {
            if (rowIndex == 0 || float.TryParse(value, out _))
            {
                return CellValues.Number;
            }
            return CellValues.String;
        }
    }
}
