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

using System;
using System.IO;
using System.Net.Mime;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure;
using eFormShared;
using ICSharpCode.SharpZipLib.Zip;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using OpenStack.NetCoreSwiftClient.Extensions;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace eFormAPI.Web.Controllers.Eforms
{
    public class TemplateFilesController : Controller
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly IEformPermissionsService _permissionsService;
        private readonly ILocalizationService _localizationService;

        public TemplateFilesController(IEFormCoreService coreHelper,
            ILocalizationService localizationService,
            IEformPermissionsService permissionsService)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
            _permissionsService = permissionsService;
        }

        [HttpGet]
        [Route("api/template-files/csv/{id}")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme,
            Policy = AuthConsts.EformPolicies.Eforms.GetCsv)]
        public async Task<IActionResult> Csv(int id)
        {
            if (!await _permissionsService.CheckEform(id,
                AuthConsts.EformClaims.EformsClaims.GetCsv))
            {
                return Forbid();
            }

            var core = _coreHelper.GetCore();
            var fileName = $"{id}_{DateTime.Now.Ticks}.csv";
            var filePath = PathHelper.GetOutputPath(fileName);
            var fullPath = core.CasesToCsv(id, null, null, filePath,
                $"{core.GetSdkSetting(Settings.httpServerAddress)}/" + "api/template-files/get-image/", ",", "");
            var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "application/octet-stream", fileName);
        }

        [HttpGet]        
        [AllowAnonymous]
        [Route("api/template-files/get-image/{fileName}.{ext}")]
//        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme, 
//            Policy = AuthConsts.EformPolicies.Cases.CasesRead)]
        public async Task<IActionResult> GetImage(string fileName, string ext, string noCache = "noCache")
        {
            var core = _coreHelper.GetCore();
            var filePath = $"{core.GetSdkSetting(Settings.fileLocationPicture)}\\{fileName}.{ext}";
            string fileType = "";
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
            
            if (core.GetSdkSetting(Settings.swiftEnabled).ToLower() == "true")
            {
                var ss = await core.GetFileFromSwiftStorage($"{fileName}.{ext}");
                    
                Response.ContentType = ss.ContentType;
                Response.ContentLength = ss.ContentLength;
                
                return File(ss.ObjectStreamContent, ss.ContentType.IfNullOrEmpty($"{fileType}"));
            }

            if (core.GetSdkSetting(Settings.s3Enabled).ToLower() == "true")
            {
                var ss = await core.GetFileFromS3Storage($"{fileName}.{ext}");

                Response.ContentLength = ss.ContentLength;

                return File(ss.ResponseStream, ss.Headers["Content-Type"]);
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
            var core = _coreHelper.GetCore();
            Directory.CreateDirectory(Path.Combine("tmp"));
            var filePath = Path.Combine("tmp",fileName);
            if (core.GetSdkSetting(Settings.swiftEnabled).ToLower() == "true")
            {
                return await RotateImageSwift(fileName);
            }
            else
            {
                if (core.GetSdkSetting(Settings.s3Enabled).ToLower() == "true")
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
        public OperationResult DeleteImage(string fileName, int fieldId, int uploadedObjId)
        {
            try
            {
                var core = _coreHelper.GetCore();
                if (!core.Advanced_DeleteUploadedData(fieldId, uploadedObjId))
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
        public IActionResult GetPdfFile(string fileName)
        {
            var core = _coreHelper.GetCore();
            var filePath = Path.Combine(core.GetSdkSetting(Settings.fileLocationPdf), fileName + ".pdf");
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "application/pdf", Path.GetFileName(filePath));
        }

        [HttpGet]
        [Route("api/template-files/download-case-pdf/{templateId}")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme,
            Policy = AuthConsts.EformPolicies.Cases.CaseGetPdf)]
        public async Task<IActionResult> DownloadEFormPdf(int templateId, int caseId, string fileType)
        {
            if (!await _permissionsService.CheckEform(templateId,
                AuthConsts.EformClaims.CasesClaims.CaseGetPdf))
            {
                return Forbid();
            }

            try
            {
                var core = _coreHelper.GetCore();
                var filePath = core.CaseToPdf(caseId, templateId.ToString(),
                    DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                    $"{core.GetSdkSetting(Settings.httpServerAddress)}/" + "api/template-files/get-image/", fileType, "");
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
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme,
            Policy = AuthConsts.EformPolicies.Eforms.DownloadXml)]
        public async Task<IActionResult> DownloadEFormXml(int templateId)
        {
            if (!await _permissionsService.CheckEform(templateId,
                AuthConsts.EformClaims.EformsClaims.DownloadXml))
            {
                return Forbid();
            }

            try
            {
                var core = _coreHelper.GetCore();
                var caseId = core.CaseReadFirstId(templateId, "not_revmoed");
                var filePath = core.CaseToJasperXml((int) caseId, DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                    $"{core.GetSdkSetting(Settings.httpServerAddress)}/" + "api/template-files/get-image/", "");
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }

                var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                return File(fileStream, "application/xml", Path.GetFileName(filePath));
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("api/template-files/upload-eform-zip")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme,
            Policy = AuthConsts.EformPolicies.Eforms.UploadZip)]
        public async Task<IActionResult> UploadEformZip(EformZipUploadModel uploadModel)
        {
            if (!await _permissionsService.CheckEform(uploadModel.TemplateId,
                AuthConsts.EformClaims.EformsClaims.UploadZip))
            {
                return Forbid();
            }

            try
            {
                var core = _coreHelper.GetCore();
                var templateId = uploadModel.TemplateId;
                if (templateId <= 0)
                {
                    return BadRequest("Invalid Request!");
                }

                var saveFolder =
                    Path.Combine(core.GetSdkSetting(Settings.fileLocationJasper),
                        Path.Combine("templates", templateId.ToString()));

                var zipArchiveFolder =
                    Path.Combine(core.GetSdkSetting(Settings.fileLocationJasper),
                        Path.Combine("templates", Path.Combine("zip-archives", templateId.ToString())));

                if (string.IsNullOrEmpty(saveFolder))
                {
                    return BadRequest("Folder error");
                }

                Directory.CreateDirectory(saveFolder);
                Directory.CreateDirectory(zipArchiveFolder);
                if (uploadModel.File.Length > 0)
                {
                    var filePath = Path.Combine(zipArchiveFolder, Path.GetFileName(uploadModel.File.FileName));
                    if (!System.IO.File.Exists(filePath))
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await uploadModel.File.CopyToAsync(stream);
                        }
                    }

                    var extractPath = Path.Combine(saveFolder);
                    if (System.IO.File.Exists(filePath))
                    {
                        if (!Directory.Exists(extractPath))
                        {
                            Directory.CreateDirectory(extractPath);
                        }
                        else
                        {
                            FoldersHelper.ClearFolder(extractPath);
                        }

                        // extract
                        var fastZip = new FastZip();
                        // Will always overwrite if target filenames already exist
                        fastZip.ExtractZip(filePath, extractPath, null);
                        if (core.GetSdkSetting(Settings.swiftEnabled).ToLower() == "true")
                        {
                            core.PutFileToStorageSystem(filePath, templateId.ToString() + "_" + uploadModel.File.FileName);
                        }
                        //ZipFile.ExtractToDirectory(filePath, extractPath);
                        System.IO.File.Delete(filePath);
//                        await Startup.Bus.SendLocal(new GenerateJasperFiles(templateId)); // TODO disabled for now 3. dec. 2018
                        return Ok();
                    }
                }

                return BadRequest(_localizationService.GetString("InvalidRequest"));
            }
            catch (Exception)
            {
                return BadRequest("Invalid Request!");
            }
        }
        
        private async Task<OperationResult> RotateImageSwift(string fileName)
        {
            var core = _coreHelper.GetCore();
            var result =  await core.GetFileFromSwiftStorage(fileName);
            var filePath = Path.Combine("tmp",fileName);
            var fileStream = System.IO.File.Create(filePath);
            result.ObjectStreamContent.CopyTo(fileStream);

            fileStream.Close();
            fileStream.Dispose();
                
            result.ObjectStreamContent.Close();
            result.ObjectStreamContent.Dispose();
            try
            {
                var img = Image.Load(filePath);
                img.Mutate(x => x.Rotate(RotateMode.Rotate90));
                img.Save(filePath);
                img.Dispose();
                core.PutFileToStorageSystem(filePath, fileName);
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

        private async Task<OperationResult> RotateImageS3(string fileName)
        {
            var core = _coreHelper.GetCore();
            var result =  await core.GetFileFromS3Storage(fileName);
            var filePath = Path.Combine("tmp",fileName);
            var fileStream = System.IO.File.Create(filePath);
            result.ResponseStream.CopyTo(fileStream);

            fileStream.Close();
            fileStream.Dispose();
                
            result.ResponseStream.Close();
            result.ResponseStream.Dispose();
            try
            {
                var img = Image.Load(filePath);
                img.Mutate(x => x.Rotate(RotateMode.Rotate90));
                img.Save(filePath);
                img.Dispose();
                core.PutFileToStorageSystem(filePath, fileName);
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
        
        private async Task<OperationResult> RotateImageLocal(string filePath)
        {
            if (!System.IO.File.Exists(filePath))
            {
                
                return new OperationResult(false, _localizationService.GetString("FileNotFound"));
            }

            try
            {
                var img = Image.Load(filePath);
                img.Mutate(x => x.Rotate(RotateMode.Rotate90));
                img.Save(filePath);
                img.Dispose();
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

    }

    public class EformZipUploadModel
    {
        public IFormFile File { get; set; }
        public int TemplateId { get; set; }
    }
}