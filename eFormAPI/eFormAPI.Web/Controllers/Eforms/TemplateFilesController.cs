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


using System.Collections.Generic;
using System.Linq;
using eFormCore;

namespace eFormAPI.Web.Controllers.Eforms
{
    using Abstractions;
    using eFormAPI.Web.Abstractions.Security;
    using ICSharpCode.SharpZipLib.Zip;
    using ImageMagick;
    using Infrastructure.Models;
    using Infrastructure.Models.Import;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Dto;
    using Microting.eForm.Infrastructure.Models;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using OpenStack.NetCoreSwiftClient.Extensions;
    using Services.Export;
    using System;
    using System.Globalization;
    using System.IO;
    using System.Threading.Tasks;
    using System.Xml.Linq;
    using Microting.EformAngularFrontendBase.Infrastructure.Const;
    using Settings = Microting.eForm.Dto.Settings;

    [Authorize]
    public class TemplateFilesController : Controller
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly IEformPermissionsService _permissionsService;
        private readonly ILocalizationService _localizationService;
        private readonly IEformExcelExportService _eformExcelExportService;
        private readonly IUserService _userService;

        public TemplateFilesController(IEFormCoreService coreHelper,
            ILocalizationService localizationService,
            IUserService userService,
            IEformPermissionsService permissionsService,
            IEformExcelExportService eformExcelExportService)
        {
            _coreHelper = coreHelper;
            _userService = userService;
            _localizationService = localizationService;
            _permissionsService = permissionsService;
            _eformExcelExportService = eformExcelExportService;
        }

        [HttpGet]
        [Route("api/template-files/csv/{id}")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.GetCsv)]
        public async Task<IActionResult> Csv(int id, string start, string end, bool utcTime, bool gpsCoordinates, bool includeCheckListText)
        {
            if (!await _permissionsService.CheckEform(id,
                AuthConsts.EformClaims.EformsClaims.GetCsv))
            {
                return Forbid();
            }

            var core = await _coreHelper.GetCore();
            var fileName = $"{id}_{DateTime.Now.Ticks}.csv";
            var filePath = Path.GetTempPath();// PathHelper.GetOutputPath(fileName);
            Directory.CreateDirectory(Path.Combine(filePath, "output"));
            filePath = Path.Combine(filePath, fileName);
            CultureInfo cultureInfo = new CultureInfo("de-DE");
            var language = await _userService.GetCurrentUserLanguage();


            var timeZoneInfo = await _userService.GetCurrentUserTimeZoneInfo();

            string fullPath;
            if (!string.IsNullOrEmpty(start) && !string.IsNullOrEmpty(end))
            {
                fullPath = await core.CasesToCsv(id, DateTime.Parse(start), DateTime.Parse(end), filePath,
                    $"{await core.GetSdkSetting(Settings.httpServerAddress)}/" + "api/template-files/get-image/", ",",
                    "", utcTime, cultureInfo, timeZoneInfo, language, gpsCoordinates, includeCheckListText);
            }
            else
            {
                fullPath = await core.CasesToCsv(id, null, null, filePath,
                    $"{await core.GetSdkSetting(Settings.httpServerAddress)}/" + "api/template-files/get-image/", ",",
                    "", utcTime, cultureInfo, timeZoneInfo, language, gpsCoordinates, includeCheckListText);
            }

            var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "application/octet-stream", fileName);
        }

        [HttpGet]
        //[AllowAnonymous]
        [Route("api/template-files/get-image/{fileName}.{ext}")]
        public async Task<IActionResult> GetImage(string fileName, string ext, string noCache = "noCache")
        {
            return await GetFile(fileName, ext,"image", noCache);
        }

        [HttpGet]
        //[AllowAnonymous]
        [Route("api/template-files/get-pdf/{fileName}.{ext}")]
        public async Task<IActionResult> GetPdf(string fileName, string ext, string noCache = "noCache")
        {
            return await GetFile(fileName, ext, "pdf", noCache);
        }

        [HttpGet]
        [Route("api/template-files/download-eform-excel")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.ExportEformExcel)]
        public async Task<IActionResult> DownloadExcelEform(EformDownloadExcelModel excelModel)
        {
            if (!await _permissionsService.CheckEform(excelModel.TemplateId,
                AuthConsts.EformClaims.EformsClaims.ExportEformExcel))
            {
                return Forbid();
            }

            var result = await _eformExcelExportService.EformExport(excelModel);
            if (result.Model == null)
            {
                return new NotFoundResult();
            }
            else
            {
                return new FileStreamResult(result.Model,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            }
        }

        private async Task<IActionResult> GetFile(string fileName, string ext, string fileType, string noCache = "noCache")
        {
            var core = await _coreHelper.GetCore();
            var fullFileName = $"{fileName}.{ext}";
            var filePath = Path.Combine(await core.GetSdkSetting(Settings.fileLocationPicture),fullFileName);
            if (fileType == "pdf")
            {
                filePath = Path.Combine(await core.GetSdkSetting(Settings.fileLocationPdf),fullFileName);
            }

            switch (ext)
            {
                case "png":
                    fileType = "image/png";
                    break;
                case "jpg":
                case "jpeg":
                    fileType = "image/jpeg";
                    break;
                case "wav":
                    fileType = "audio/wav";
                    break;
                case "pdf":
                    fileType = "application/pdf";
                    break;
            }

            if (core.GetSdkSetting(Settings.swiftEnabled).Result.ToLower() == "true")
            {
                var ss = await core.GetFileFromSwiftStorage($"{fileName}.{ext}");

                Response.ContentType = ss.ContentType;
                Response.ContentLength = ss.ContentLength;

                return File(ss.ObjectStreamContent, ss.ContentType.IfNullOrEmpty($"{fileType}"));
            }

            try
            {
                if (core.GetSdkSetting(Settings.s3Enabled).Result.ToLower() == "true")
                {
                    var ss = await core.GetFileFromS3Storage($"{fileName}.{ext}");

                    Response.ContentLength = ss.ContentLength;

                    return File(ss.ResponseStream, ss.Headers["Content-Type"]);
                }
            } catch (Exception e)
            {
                Console.WriteLine(e);
                return NotFound($"Trying to find file at location: {filePath}");
            }


            if (!System.IO.File.Exists(filePath))
            {
                return NotFound($"Trying to find file at location: {filePath}");
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, fileType);
        }

        [HttpGet]
        [Route("api/template-files/rotate-image")]
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseUpdate)]
        public async Task<OperationResult> RotateImage(string fileName)
        {
            var core = await _coreHelper.GetCore();
            Directory.CreateDirectory(Path.Combine("tmp"));
            var filePath = Path.Combine("tmp",fileName);
            if (core.GetSdkSetting(Settings.swiftEnabled).Result.ToLower() == "true")
            {
                return await RotateImageSwift(fileName);
            }
            else
            {
                if (core.GetSdkSetting(Settings.s3Enabled).Result.ToLower() == "true")
                {
                    return await RotateImageS3(fileName);
                }
                else
                {
                    return await RotateImageLocal(filePath);
                }
            }

        }

        [HttpGet]
        [Route("api/template-files/delete-image")]
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseUpdate)]
        public async Task<OperationResult> DeleteImage(string fileName, int fieldId, int uploadedObjId)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                if (!await core.Advanced_DeleteUploadedData(fieldId, uploadedObjId))
                {
                    return new OperationResult(false, _localizationService.GetString("ImageNotDeleted"));
                }
            }

            catch (Exception e)
            {
                Console.WriteLine(e);
                return new OperationResult(false, _localizationService.GetString("ImageNotDeleted"));
            }

            return new OperationResult(true, _localizationService.GetString("ImageDeletedSuccessfully"));
        }

        [HttpGet]
        [Route("api/template-files/get-pdf-file")]
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseGetPdf)]
        public async Task<IActionResult> GetPdfFile(string fileName)
        {
            var core = await _coreHelper.GetCore();
            if (core.GetSdkSetting(Settings.swiftEnabled).Result.ToLower() == "true")
            {
                try
                {
                    var ss = await core.GetFileFromSwiftStorage($"{fileName}.pdf");

                    Response.ContentType = ss.ContentType;
                    Response.ContentLength = ss.ContentLength;

                    return File(ss.ObjectStreamContent, ss.ContentType.IfNullOrEmpty($"pdf"));
                }
                catch (Exception)
                {
                    return NotFound();
                }

            }
            var filePath = Path.Combine(await core.GetSdkSetting(Settings.fileLocationPdf), fileName + ".pdf");
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "application/pdf", Path.GetFileName(filePath));
        }

        [HttpGet]
        [Route("api/template-files/download-case-pdf/{templateId}")]
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseGetPdf)]
        public async Task<IActionResult> DownloadEFormPdf(int templateId, int caseId, string fileType)
        {
            if (!await _permissionsService.CheckEform(templateId,
                AuthConsts.EformClaims.CasesClaims.CaseGetPdf))
            {
                return Forbid();
            }

            try
            {
                var core = await _coreHelper.GetCore();
                var language = await _userService.GetCurrentUserLanguage();

                // Fix for broken SDK not handling empty customXmlContent well
                string customXmlContent = new XElement("FillerElement",
                    new XElement("InnerElement", "SomeValue")).ToString();

                var filePath = await core.CaseToPdf(caseId, templateId.ToString(),
                    DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                    $"{core.GetSdkSetting(Settings.httpServerAddress)}/" + "api/template-files/get-image/", fileType, customXmlContent, language);
                //DateTime.Now.ToString("yyyyMMddHHmmssffff"), $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image?&filename=");
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }

                var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                return File(fileStream, "application/pdf", Path.GetFileName(filePath));
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("api/template-files/download-eform-xml/{templateId}")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.DownloadXml)]
        public async Task<IActionResult> DownloadEFormXml(int templateId)
        {
            if (!await _permissionsService.CheckEform(templateId,
                AuthConsts.EformClaims.EformsClaims.DownloadXml))
            {
                return Forbid();
            }

            try
            {
                var core = await _coreHelper.GetCore();
                var caseId = await core.CaseReadFirstId(templateId, "not_revmoed");
                CaseDto caseDto = await core.CaseLookupCaseId((int)caseId);
                var language = await _userService.GetCurrentUserLanguage();
                ReplyElement replyElement = await core.CaseRead((int)caseDto.MicrotingUId, (int)caseDto.CheckUId, language).ConfigureAwait(false);
                if (caseId != null)
                {
                    var filePath = await core.CaseToJasperXml(caseDto, replyElement, (int)caseId,
                        DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                        $"{core.GetSdkSetting(Settings.httpServerAddress)}/" + "api/template-files/get-image/",
                        "", language);
                    if (!System.IO.File.Exists(filePath))
                    {
                        return NotFound();
                    }

                    var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                    return File(fileStream, "application/xml", Path.GetFileName(filePath));
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("api/template-files/upload-eform-zip")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UploadZip)]
        public async Task<IActionResult> UploadEformZip(EformZipUploadModel uploadModel)
        {
            if (!await _permissionsService.CheckEform(uploadModel.TemplateId,
                AuthConsts.EformClaims.EformsClaims.UploadZip))
            {
                return Forbid();
            }

            if (!uploadModel.File.FileName.Contains(".zip"))
            {
                return BadRequest(_localizationService.GetString("InvalidRequest"));
            }

            try
            {
                var core = await _coreHelper.GetCore();
                var templateId = uploadModel.TemplateId;
                if (templateId <= 0)
                {
                    return BadRequest("Invalid Request!");
                }

                var saveFolder =
                    Path.Combine(Path.GetTempPath(), "templates", templateId.ToString());

                var zipArchiveFolder =
                    Path.Combine(Path.GetTempPath(), "templates", Path.Combine("zip-archives", templateId.ToString()));

                Directory.CreateDirectory(Path.GetDirectoryName(saveFolder));

                Directory.CreateDirectory(Path.GetDirectoryName(zipArchiveFolder));

                var filePath = Path.Combine(zipArchiveFolder, Path.GetFileName(uploadModel.File.FileName));

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                if (string.IsNullOrEmpty(saveFolder))
                {
                    return BadRequest("Folder error");
                }

                Directory.CreateDirectory(saveFolder);
                Directory.CreateDirectory(zipArchiveFolder);
                if (uploadModel.File.Length > 0)
                {
                    await using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await uploadModel.File.CopyToAsync(stream);
                    }

                    var extractPath = Path.Combine(saveFolder);
                    if (System.IO.File.Exists(filePath))
                    {
                        Directory.CreateDirectory(extractPath);

                        // extract
                        var fastZip = new FastZip();
                        // Will always overwrite if target filenames already exist
                        fastZip.ExtractZip(filePath, extractPath, null);

                        await using var dbContext = core.DbContextHelper.GetDbContext();
                        var compactPath = Path.Combine(extractPath, "compact");

                        if (Directory.GetFiles(compactPath, "*.jrxml").Length != 0)
                        {
                            var cl = await dbContext.CheckLists.SingleAsync(x => x.Id == templateId);
                            cl.JasperExportEnabled = true;
                            cl.DocxExportEnabled = false;
                            await cl.Update(dbContext);
                            foreach (var file in Directory.GetFiles(extractPath, "*.jasper"))
                            {
                                System.IO.File.Delete(file);
                            }

                            if (core.GetSdkSetting(Settings.swiftEnabled).Result.ToLower() == "true" ||
                                core.GetSdkSetting(Settings.s3Enabled).Result.ToLower() == "true")
                            {
                                await core.PutFileToStorageSystem(filePath,
                                    $"{templateId}_jasper_{uploadModel.File.FileName}");
                            }
                            return Ok();
                        }
                        if (Directory.GetFiles(compactPath, "*.docx").Length != 0)
                        {
                            var cl = await dbContext.CheckLists.SingleAsync(x => x.Id == templateId);
                            cl.JasperExportEnabled = false;
                            cl.DocxExportEnabled = true;
                            await cl.Update(dbContext);
                            if (core.GetSdkSetting(Settings.swiftEnabled).Result.ToLower() == "true" ||
                                core.GetSdkSetting(Settings.s3Enabled).Result.ToLower() == "true")
                            {
                                await core.PutFileToStorageSystem(Path.Combine(compactPath, $"{templateId}.docx"),
                                    $"{templateId}.docx");
                                System.IO.File.Delete(Path.Combine(compactPath, $"{templateId}.docx"));
                            }

                            return Ok();
                        }

                        var files = Directory.GetFiles(compactPath, "*.xlsx");
                        if (files.Length != 0)
                        {
                            var cl = await dbContext.CheckLists.SingleAsync(x => x.Id == templateId);
                            cl.ExcelExportEnabled = true;
                            await cl.Update(dbContext);
                            if (core.GetSdkSetting(Settings.swiftEnabled).Result.ToLower() == "true" ||
                                core.GetSdkSetting(Settings.s3Enabled).Result.ToLower() == "true")
                            {
                                await core.PutFileToStorageSystem(Path.Combine(compactPath, $"{templateId}.xlsx"),
                                    $"{templateId}.xlsx");
                                System.IO.File.Delete(Path.Combine(compactPath, $"{templateId}.xlsx"));
                            }

                            return Ok();
                        }
                    }
                }
                return BadRequest(_localizationService.GetString("InvalidRequest"));
            }
            catch (Exception e)
            {
                return BadRequest($"Invalid Request! Exception: {e.Message}");
            }
        }

        private async Task<OperationResult> RotateImageSwift(string fileName)
        {
            var core = await _coreHelper.GetCore();
            var result =  await core.GetFileFromSwiftStorage(fileName);
            var filePath = Path.Combine("tmp",fileName);
            var fileStream = System.IO.File.Create(filePath);
            await result.ObjectStreamContent.CopyToAsync(fileStream);

            fileStream.Close();
            await fileStream.DisposeAsync();

            result.ObjectStreamContent.Close();
            await result.ObjectStreamContent.DisposeAsync();
            return await RotateFileAndPutToStorage(filePath, core, fileName);
        }

        private async Task<OperationResult> RotateImageS3(string fileName)
        {
            var fileId = int.Parse(fileName.Split('_').First());
            var core = await _coreHelper.GetCore();
            var dbContext = core.DbContextHelper.GetDbContext();
            Microting.eForm.Infrastructure.Data.Entities.UploadedData uploadedDataObj = await dbContext.UploadedDatas.SingleAsync(x => x.Id == fileId);
            var result =  await core.GetFileFromS3Storage(fileName);
            var filePath = Path.Combine(Path.GetTempPath(),fileName);
            var fileStream = System.IO.File.Create(filePath);
            await result.ResponseStream.CopyToAsync(fileStream);

            fileStream.Close();
            await fileStream.DisposeAsync();

            result.ResponseStream.Close();
            await result.ResponseStream.DisposeAsync();
            string smallFilename = $"{uploadedDataObj.Id}_300_{uploadedDataObj.Checksum}{uploadedDataObj.Extension}"; //uploadedDataObj.Id + "_300_" + uploadedDataObj.Checksum;
            string bigFilename = $"{uploadedDataObj.Id}_700_{uploadedDataObj.Checksum}{uploadedDataObj.Extension}";//uploadedDataObj.Id + "_700_" + urlStr.Remove(0, index);
            System.IO.File.Copy(filePath, Path.Combine(Path.GetTempPath(), smallFilename));
            System.IO.File.Copy(filePath, Path.Combine(Path.GetTempPath(), bigFilename));
            string filePathResized = Path.Combine(Path.GetTempPath(), smallFilename);
            using (var image = new MagickImage(filePathResized))
            {
                decimal currentRation = image.Height / (decimal) image.Width;
                int newWidth = 300;
                int newHeight = (int) Math.Round((currentRation * newWidth));

                image.Resize(newWidth, newHeight);
                image.Crop(newWidth, newHeight);
                await image.WriteAsync(filePathResized);
                image.Dispose();
                await RotateFileAndPutToStorage(Path.Combine(Path.GetTempPath(), smallFilename), core, smallFilename);

            }
            System.IO.File.Delete(filePathResized);
            filePathResized = Path.Combine(Path.GetTempPath(), bigFilename);
            using (var image = new MagickImage(filePathResized))
            {
                decimal currentRation = image.Height / (decimal) image.Width;
                int newWidth = 700;
                int newHeight = (int) Math.Round((currentRation * newWidth));

                image.Resize(newWidth, newHeight);
                image.Crop(newWidth, newHeight);
                await image.WriteAsync(filePathResized);
                image.Dispose();
                await RotateFileAndPutToStorage(Path.Combine(Path.GetTempPath(), bigFilename), core, bigFilename);
            }
            System.IO.File.Delete(filePathResized);
            // await RotateFileAndPutToStorage(Path.Combine(Path.GetTempPath(), smallFilename), core, smallFilename);
            // await RotateFileAndPutToStorage(Path.Combine(Path.GetTempPath(), bigFilename), core, bigFilename);
            return await RotateFileAndPutToStorage(filePath, core, fileName);
        }

        private async Task<OperationResult> RotateImageLocal(string filePath)
        {
            if (!System.IO.File.Exists(filePath))
            {

                return new OperationResult(false, _localizationService.GetString("FileNotFound"));
            }

            try
            {
                using var image = new MagickImage(filePath);
                image.Rotate(90);
                await image.WriteAsync(filePath);
            }
            catch (Exception e)
            {
                if (e.Message == "A generic error occurred in GDI+.")
                {
                    return new OperationResult(false);
                }

                return new OperationResult(false, _localizationService.GetString("ErrorWhileRotateImage") + $" Internal error: {e.Message}");
            }

            return new OperationResult(true, _localizationService.GetString("ImageRotatedSuccessfully"));
        }

        private async Task<OperationResult> RotateFileAndPutToStorage(string filePath, Core core, string fileName)
        {
            try
            {
                using (var image = new MagickImage(filePath))
                {
                    image.Rotate(90);
                    await image.WriteAsync(filePath);
                }
                await core.PutFileToStorageSystem(filePath, fileName);
            }
            catch (Exception e)
            {
                if (e.Message == "A generic error occurred in GDI+.")
                {
                    return new OperationResult(false);
                }

                return new OperationResult(false, _localizationService.GetString("ErrorWhileRotateImage") + $" Internal error: {e.Message}");
            }
            finally
            {
                System.IO.File.Delete(filePath);
            }
            return new OperationResult(true, _localizationService.GetString("ImageRotatedSuccessfully"));
        }

    }
}