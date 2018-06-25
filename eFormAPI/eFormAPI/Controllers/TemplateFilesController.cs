using System;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Helpers;
using EformBase.Pn.Helpers;
using EformBase.Pn.Infrastructure;
using EformBase.Pn.Infrastructure.Messages;
using EformBase.Pn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers
{

    public class TemplateFilesController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpGet]
        [Authorize]
        [Route("api/template-files/csv/{id}")]
        public HttpResponseMessage Csv(int id)
        {
            var core = _coreHelper.GetCore();

            var fileName = $"{id}_{DateTime.Now.Ticks}.csv";
            Directory.CreateDirectory(System.Web.Hosting.HostingEnvironment.MapPath("~/bin/output/"));
            var filePath = System.Web.Hosting.HostingEnvironment.MapPath($"~/bin/output/{fileName}");
            var fullPath = core.CasesToCsv(id, null, null, filePath,
                $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image/");

            var result = new HttpResponseMessage(HttpStatusCode.OK);
            var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);

            result.Content = new StreamContent(fileStream);
            result.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment") { FileName = fileName };
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
            if (!File.Exists(filePath))
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
                new ContentDispositionHeaderValue("inline") { FileName = fileName };
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
            if (!File.Exists(filePath))
            {
                return new OperationResult(false, LocaleHelper.GetString("FileNotFound"));
            }
            try
            {
                var img = Image.FromFile(filePath);
                img.RotateFlip(RotateFlipType.Rotate90FlipNone);
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
            if (!File.Exists(filePath))
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }

            var result = new HttpResponseMessage(HttpStatusCode.OK);
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            result.Content = new StreamContent(fileStream);
            result.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment") { FileName = fileName + ".pdf" };
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
                    DateTime.Now.ToString("yyyyMMddHHmmssffff"), $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image/");
                //DateTime.Now.ToString("yyyyMMddHHmmssffff"), $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image?&filename=");
                if (!File.Exists(filePath))
                {
                    return new HttpResponseMessage(HttpStatusCode.NotFound);
                }

                var result = new HttpResponseMessage(HttpStatusCode.OK);
                var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

                result.Content = new StreamContent(fileStream);
                result.Content.Headers.ContentDisposition =
                    new ContentDispositionHeaderValue("attachment") { FileName = Path.GetFileName(filePath) };
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
                var filePath = core.CaseToJasperXml((int)caseId, DateTime.Now.ToString("yyyyMMddHHmmssffff"), $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image/");
                if (!File.Exists(filePath))
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
        public HttpResponseMessage UploadEformZip()
        {
            try
            {
                var core = _coreHelper.GetCore();
                int.TryParse(HttpContext.Current.Request.Form.Get("templateId"), out int templateId);
                if (templateId <= 0)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid Request!");
                }

                var saveFolder =
                    Path.Combine(core.GetJasperPath(),
                        Path.Combine("templates", templateId.ToString()));

                var zipArchiveFolder =
                    Path.Combine(core.GetJasperPath(),
                        Path.Combine("templates", Path.Combine("zip-archives", templateId.ToString())));

                if (string.IsNullOrEmpty(saveFolder))
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Folder error");
                }
                if (!Directory.Exists(saveFolder))
                {
                    Directory.CreateDirectory(saveFolder);
                }
                if (!Directory.Exists(zipArchiveFolder))
                {
                    Directory.CreateDirectory(zipArchiveFolder);
                }
                var files = HttpContext.Current.Request.Files;
                if (files.Count > 0)
                {
                    var httpPostedFile = files[0];
                    if (httpPostedFile.ContentLength > 0)
                    {
                        var filePath = Path.Combine(zipArchiveFolder, Path.GetFileName(httpPostedFile.FileName));
                        var extractPath = Path.Combine(saveFolder);
                        if (!File.Exists(filePath))
                        {
                            httpPostedFile.SaveAs(filePath);
                        }
                        if (File.Exists(filePath))
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
                            File.Delete(filePath);
                            _coreHelper.bus.SendLocal(new GenerateJasperFiles(templateId));

                            return Request.CreateResponse(HttpStatusCode.OK);
                        }
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, LocaleHelper.GetString("InvalidRequest"));
            }
            catch (Exception)
            {
                return new HttpResponseMessage(HttpStatusCode.InternalServerError);
            }
        }
    }
}