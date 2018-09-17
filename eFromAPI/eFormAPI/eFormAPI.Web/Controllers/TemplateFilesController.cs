using System;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using eFormAPI.BasePn.Helpers;
using eFormAPI.BasePn.Infrastructure.Helpers;
using eFormAPI.BasePn.Infrastructure.Messages;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace eFormAPI.Web.Controllers
{
    // TODO refactor it and test
    public class TemplateFilesController : Controller
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TemplateFilesController(IEFormCoreService coreHelper,
            IHttpContextAccessor httpContextAccessor)
        {
            _coreHelper = coreHelper;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        [Authorize]
        [Route("api/template-files/csv/{id}")]
        public HttpResponseMessage Csv(int id)
        {
            var core = _coreHelper.GetCore();

            var fileName = $"{id}_{DateTime.Now.Ticks}.csv";
            var filePath = PathHelper.GetOutputPath(fileName);
            var fullPath = core.CasesToCsv(id, null, null, filePath,
                $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image/");

            var result = new HttpResponseMessage(HttpStatusCode.OK);
            var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);

            result.Content = new StreamContent(fileStream);
            result.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment") {FileName = fileName};
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/octet-stream");
            return result;
        }

        [HttpGet]
        [Route("api/template-files/get-image/{fileName}.{ext}")]
        public HttpResponseMessage GetImage(string fileName, string ext, string noCache = "noCache")
        {
            var core = _coreHelper.GetCore();

            var filePath = $"{core.GetPicturePath()}\\{fileName}.{ext}";
            if (!System.IO.File.Exists(filePath))
            {
                var resultNotFound = new HttpResponseMessage(HttpStatusCode.NotFound);
                resultNotFound.Content = new StringContent($"Trying to find file at location: {filePath}");
                return resultNotFound;
            }

            var extention = Path.GetExtension(filePath).Replace(".", "");

            var result = new HttpResponseMessage(HttpStatusCode.OK);
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            result.Content = new StreamContent(fileStream);
            result.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("inline") {FileName = fileName};
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue($"image/{extention}");
            return result;
        }

        [HttpGet]
        [Authorize]
        [Route("api/template-files/rotate-image")]
        public OperationResult RotateImage(string fileName)
        {
            var core = _coreHelper.GetCore();

            var filePath = $"{core.GetPicturePath()}\\{fileName}";
            if (!System.IO.File.Exists(filePath))
            {
                return new OperationResult(false, LocaleHelper.GetString("FileNotFound"));
            }

            try
            {
                var img = Image.Load(filePath);

                img.Mutate(x => x
                    .Rotate(RotateMode.Rotate90)); // TODO RotateFlip???
                // img.RotateFlip(RotateFlipType.Rotate90FlipNone);
                img.Save(filePath);
                img.Dispose();
            }
            catch (Exception e)
            {
                if (e.Message == "A generic error occurred in GDI+.")
                {
                    return new OperationResult(true);
                }

                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileRotateImage"));
            }

            return new OperationResult(true, LocaleHelper.GetString("ImageRotatedSuccessfully"));
        }

        [HttpGet]
        [Authorize]
        [Route("api/template-files/delete-image")]
        public OperationResult DeleteImage(string fileName, int fieldId, int uploadedObjId)
        {
            try
            {
                var core = _coreHelper.GetCore();
                if (!core.Advanced_DeleteUploadedData(fieldId, uploadedObjId))
                {
                    return new OperationResult(false, LocaleHelper.GetString("ImageNotDeleted"));
                }
            }

            catch (Exception e)
            {
                Console.WriteLine(e);
                return new OperationResult(false, LocaleHelper.GetString("ImageNotDeleted"));
            }

            return new OperationResult(true, LocaleHelper.GetString("ImageDeletedSuccessfully"));
        }


        [HttpGet]
        [Authorize]
        [Route("api/template-files/get-pdf-file")]
        public HttpResponseMessage GetPdfFile(string fileName)
        {
            var core = _coreHelper.GetCore();

            var filePath = $"{core.GetPdfPath()}\\{fileName}.pdf";
            if (!System.IO.File.Exists(filePath))
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }

            var result = new HttpResponseMessage(HttpStatusCode.OK);
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            result.Content = new StreamContent(fileStream);
            result.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment") {FileName = fileName + ".pdf"};
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/pdf");
            return result;
        }

        [HttpGet]
        [Authorize]
        [Route("api/template-files/download-case-pdf/{templateId}")]
        public HttpResponseMessage DownloadEFormPDF(int templateId, int caseId)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var filePath = core.CaseToPdf(caseId, templateId.ToString(),
                    DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                    $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image/");
                //DateTime.Now.ToString("yyyyMMddHHmmssffff"), $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image?&filename=");
                if (!System.IO.File.Exists(filePath))
                {
                    return new HttpResponseMessage(HttpStatusCode.NotFound);
                }

                var result = new HttpResponseMessage(HttpStatusCode.OK);
                var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

                result.Content = new StreamContent(fileStream);
                result.Content.Headers.ContentDisposition =
                    new ContentDispositionHeaderValue("attachment") {FileName = Path.GetFileName(filePath)};
                result.Content.Headers.ContentType =
                    new MediaTypeHeaderValue("application/pdf");
                return result;
            }
            catch (Exception)
            {
                return new HttpResponseMessage(HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet]
        [Authorize]
        [Route("api/template-files/download-eform-xml/{templateId}")]
        public HttpResponseMessage DownloadEFormXML(int templateId)
        {
            try
            {
                var core = _coreHelper.GetCore();
                int? caseId = core.CaseReadFirstId(templateId, "not_revmoed");
                var filePath = core.CaseToJasperXml((int) caseId, DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                    $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image/");
                if (!System.IO.File.Exists(filePath))
                {
                    return new HttpResponseMessage(HttpStatusCode.NotFound);
                }

                var result = new HttpResponseMessage(HttpStatusCode.OK);
                var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                result.Content = new StreamContent(fileStream);
                result.Content.Headers.ContentDisposition =
                    new ContentDispositionHeaderValue("attachment")
                    {
                        FileName = Path.GetFileName(filePath)
                    };
                result.Content.Headers.ContentType =
                    new MediaTypeHeaderValue("application/xml");
                return result;
            }
            catch (Exception)
            {
                return new HttpResponseMessage(HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("api/template-files/upload-eform-zip")]
        public async Task<IActionResult> UploadEformZip()
        {
            try
            {
                var core = _coreHelper.GetCore();
                int.TryParse(_httpContextAccessor.HttpContext.Request.Form.Keys.FirstOrDefault(x => x == "templateId"),
                    out int templateId);
                if (templateId <= 0)
                {
                    return BadRequest("Invalid Request!");
                }

                var saveFolder =
                    Path.Combine(core.GetJasperPath(),
                        Path.Combine("templates", templateId.ToString()));

                var zipArchiveFolder =
                    Path.Combine(core.GetJasperPath(),
                        Path.Combine("templates", Path.Combine("zip-archives", templateId.ToString())));

                if (string.IsNullOrEmpty(saveFolder))
                {
                    return BadRequest("Folder error");
                }

                if (!Directory.Exists(saveFolder))
                {
                    Directory.CreateDirectory(saveFolder);
                }

                if (!Directory.Exists(zipArchiveFolder))
                {
                    Directory.CreateDirectory(zipArchiveFolder);
                }

                var files = _httpContextAccessor.HttpContext.Request.Form.Files;
                if (files.Count > 0)
                {
                    var httpPostedFile = files[0];
                    if (httpPostedFile.Length > 0)
                    {
                        var filePath = Path.Combine(zipArchiveFolder, Path.GetFileName(httpPostedFile.FileName));
                        var extractPath = Path.Combine(saveFolder);
                        if (!System.IO.File.Exists(filePath))
                        {
                            if (httpPostedFile.Length > 0)
                            {
                                using (var fileStream = new FileStream(filePath, FileMode.Create))
                                {
                                    await httpPostedFile.CopyToAsync(fileStream);
                                }
                            }
                        }

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

                            ZipFile.ExtractToDirectory(filePath, extractPath);
                            System.IO.File.Delete(filePath);
                            await _coreHelper.Bus.SendLocal(new GenerateJasperFiles(templateId));
                            return Ok();
                        }
                    }
                }

                return BadRequest(LocaleHelper.GetString("InvalidRequest"));
            }
            catch (Exception)
            {
                return BadRequest("Invalid Request!");
            }
        }
    }
}