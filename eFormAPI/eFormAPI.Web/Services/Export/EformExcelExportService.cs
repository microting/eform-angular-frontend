/*
The MIT License (MIT)

Copyright (c) 2007 - 2020 Microting A/S

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

using System.Linq;
using ICSharpCode.SharpZipLib.Zip;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;

namespace eFormAPI.Web.Services.Export
{
    using System;
    using System.Globalization;
    using System.IO;
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Models;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Dto;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using ClosedXML.Excel;

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

                var locale = await _userService.GetCurrentUserLocale();
                Language language = core.DbContextHelper.GetDbContext().Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());
                TimeZoneInfo timeZoneInfo;

                try
                {
                    timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("Europe/Copenhagen");
                }
                catch
                {
                    timeZoneInfo = TimeZoneInfo.Local;
                }

                var customPathForUploadedData = $"{await core.GetSdkSetting(Settings.httpServerAddress)}/" +
                                                "api/template-files/get-image/";

                TimeSpan ts = new TimeSpan(0, 0, 0);
                DateTime startDate = excelModel.DateFrom.Date + ts;
                ts = new TimeSpan(23, 59, 59);
                DateTime endDate = excelModel.DateTo.Date + ts;
                var dataSet = await core.GenerateDataSetFromCases(
                    excelModel.TemplateId,
                    startDate,
                    endDate,
                    customPathForUploadedData,
                    ",",
                    "",
                    false,
                    cultureInfo,
                    timeZoneInfo, language).ConfigureAwait(false);

                if (dataSet == null)
                {
                    return new OperationDataResult<Stream>(
                        false,
                        _localizationService.GetString("DataNotFound"));
                }

                var sourceFileName =
                    Path.Combine(await core.GetSdkSetting(Settings.fileLocationJasper),
                        Path.Combine("templates", $"{excelModel.TemplateId}", "compact", $"{excelModel.TemplateId}.xlsx"));
                Directory.CreateDirectory(Path.Combine(await core.GetSdkSetting(Settings.fileLocationJasper)
                    .ConfigureAwait(false), "results"));

                string timeStamp = $"{DateTime.UtcNow:yyyyMMdd}_{DateTime.UtcNow:hhmmss}";

                string resultDocument = Path.Combine(Path.GetTempPath(), "results",
                    $"{timeStamp}_{excelModel.TemplateId}.xlsx");

                Directory.CreateDirectory(Path.Combine(await core.GetSdkSetting(Settings.fileLocationJasper)
                    .ConfigureAwait(false), "results"));

                if (core.GetSdkSetting(Settings.s3Enabled).Result.ToLower() == "true")
                {
                    try
                    {
                        var objectResponse = await core.GetFileFromS3Storage($"{excelModel.TemplateId}.xlsx");
                        Directory.CreateDirectory(Path.Combine(Path.GetTempPath(), "results"));
                        await using var fileStream = File.Create(resultDocument);
                        await objectResponse.ResponseStream.CopyToAsync(fileStream);
                    }
                    catch (Exception exception)
                    {
                        try
                        {
                            Log.LogException($"EformExcelExportService.EformExport: Got exeption {exception.Message}");
                            var objectResponse = await core.GetFileFromS3Storage($"{excelModel.TemplateId}_xlxs_compact.zip");
                            string zipFileName = Path.Combine(Path.GetTempPath(), $"{excelModel.TemplateId}.zip");
                            await using var fileStream = File.Create(zipFileName);
                            await objectResponse.ResponseStream.CopyToAsync(fileStream);
                            fileStream.Close();
                            var fastZip = new FastZip();
                            // Will always overwrite if target filenames already exist
                            string extractPath = Path.Combine(Path.GetTempPath(), "results");
                            Directory.CreateDirectory(extractPath);
                            fastZip.ExtractZip(zipFileName, extractPath, "");
                            string extractedFile = Path.Combine(extractPath, "compact", $"{excelModel.TemplateId}.xlsx");
                            await core.PutFileToStorageSystem(extractedFile, $"{excelModel.TemplateId}.xlsx");
                            File.Move(extractedFile, resultDocument);
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e);
                            throw;
                        }
                    }
                }

                //string resultFile = Path.Combine(Path.GetTempPath(), $"{excelModel.TemplateId}.xlsx");
                if (!File.Exists(resultDocument))
                {
                    return new OperationDataResult<Stream>(
                        false,
                        _localizationService.GetString("ExcelTemplateNotFoundInStorage"));
                }

                var wb = new XLWorkbook(resultDocument);
                try {
                    var workSheetToDelete = wb.Worksheets.Worksheet($"Data_{excelModel.TemplateId}");
                    workSheetToDelete.Delete();
                } catch {}

                IXLWorksheet worksheet = wb.Worksheets.Add($"Data_{excelModel.TemplateId}");
                for (var y = 0; y < dataSet.Count; y++)
                {
                    var dataX = dataSet[y];
                    for (var x = 0; x < dataX.Count; x++)
                    {
                        var dataY = dataX[x];

                        if (x != 0)
                        {
                            switch (y)
                            {
                                case 0:
                                case 10:
                                    worksheet.Cell(x + 1, y + 1).Value = int.Parse(dataY);
                                    break;
                                case 1:
                                    worksheet.Cell(x + 1, y + 1).Value = dataY;
                                    //worksheet.Cell(x + 1, y + 1).Style = "yyyy-MM-dd";
                                    break;
                                case 2:
                                    worksheet.Cell(x + 1, y + 1).Value = dataY;
                                    //worksheet.Cell(x + 1, y + 1).Style.Numberformat.Format = "HH:mm:ss";
                                    break;
                                case 6:
                                    worksheet.Cell(x + 1, y + 1).Value = dataY;
                                    //worksheet.Cell(x + 1, y + 1).Style.Numberformat.Format = "yyyy";
                                    break;
                                case 7:
                                    worksheet.Cell(x + 1, y + 1).Value = dataY;
                                    //worksheet.Cell(x + 1, y + 1).Style.Numberformat.Format = "yyyy-MM-dd HH:mm:ss";
                                    break;
                                default:
                                    int i;
                                    if (int.TryParse(dataY, out i))
                                    {
                                        worksheet.Cell(x + 1, y + 1).Value = i;
                                    }
                                    else
                                    {
                                        worksheet.Cell(x + 1, y + 1).Value = dataY;
                                    }

                                    break;
                            }
                        }

                        if (x == 0)
                        {
                            worksheet.Cell(x + 1, y + 1).Value = dataY;
                            worksheet.Cell(x + 1, y + 1).Style.Font.Bold = true;
                        }
                    }
                }
                wb.SaveAs(resultDocument);

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
    }
}
