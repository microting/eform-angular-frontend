namespace eFormAPI.Web.Services.Export
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Threading.Tasks;
    using Abstractions;
    using Controllers.Eforms;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Dto;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using OfficeOpenXml;

    public class EformExcelExportService : IEformExcelExportService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;
        private readonly ILogger<EformExcelExportService> _logger;

        public EformExcelExportService(
            IEFormCoreService coreHelper,
            ILocalizationService localizationService,
            ILogger<EformExcelExportService> logger)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
            _logger = logger;
        }


        public async Task<OperationDataResult<Stream>> EformExport(EformDownloadExcelModel excelModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                CultureInfo cultureInfo = new CultureInfo("de-DE");
                TimeZoneInfo timeZoneInfo;

                var timeZones = TimeZoneInfo.GetSystemTimeZones();
                if (timeZones.Contains(TimeZoneInfo.FromSerializedString("Europe/Copenhagen")))
                {
                    timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("Europe/Copenhagen");
                }
                else
                {
                    timeZoneInfo = TimeZoneInfo.Local;
                }

                var customPathForUploadedData = $"{await core.GetSdkSetting(Settings.httpServerAddress)}/" +
                                                "api/template-files/get-image/";

                List<List<string>> dataSet = await core.GenerateDataSetFromCases(
                    excelModel.TemplateId,
                    excelModel.DateFrom,
                    excelModel.DateTo,
                    customPathForUploadedData,
                    ",",
                    "",
                    false,
                    cultureInfo,
                    timeZoneInfo);

                if (dataSet == null)
                    return null;

                var fileName = $"{excelModel.TemplateId}_eform_excel.xlsx";
                var excelSaveFolder =
                    Path.Combine(await core.GetSdkSetting(Settings.fileLocationPicture),
                        Path.Combine("excel", fileName));

                Stream stream;
                if (core.GetSdkSetting(Settings.swiftEnabled).Result.ToLower() == "true")
                {
                    var swiftResult = await core.GetFileFromSwiftStorage(fileName);
                    if (!swiftResult.IsSuccess)
                    {
                        return new OperationDataResult<Stream>(
                            false,
                            "Excel template not found in storage!");
                    }

                    stream = swiftResult.ObjectStreamContent;
                }
                else if (core.GetSdkSetting(Settings.s3Enabled).Result.ToLower() == "true")
                {
                    var s3Result = await core.GetFileFromS3Storage(fileName);

                    if (s3Result == null)
                    {
                        return new OperationDataResult<Stream>(
                            false,
                            "Excel template not found in storage!");
                    }

                    stream = s3Result.ResponseStream;
                }
                else
                {
                    if (File.Exists(excelSaveFolder))
                    {
                        stream = File.Open(excelSaveFolder, FileMode.Open);
                    }
                    else
                    {
                        return new OperationDataResult<Stream>(
                            false,
                            "Excel template not found in storage!");
                    }
                }

                Stream result;
                using (var package = new ExcelPackage(stream))
                {
                    //var worksheet = package.Workbook.Worksheets.Add("Worksheet Name");
                    var worksheet = package.Workbook.Worksheets[1];
                    worksheet.Cells[1, 1].Value = "Total total";

                    result = new MemoryStream(package.GetAsByteArray());
                }

                return new OperationDataResult<Stream>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationDataResult<Stream>(
                    false,
                    "Error while exporting excel file!");
            }
        }
    }
}
