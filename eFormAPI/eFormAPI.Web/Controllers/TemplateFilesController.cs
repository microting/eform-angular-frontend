using System;
using System.IO;
using System.IO.Compression;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Messages;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace eFormAPI.Web.Controllers
{
    public class TemplateFilesController : Controller
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILocalizationService _localizationService;

        public TemplateFilesController(IEFormCoreService coreHelper,
            IHttpContextAccessor httpContextAccessor,
            ILocalizationService localizationService)
        {
            _coreHelper = coreHelper;
            _httpContextAccessor = httpContextAccessor;
            _localizationService = localizationService;
        }

        [HttpGet]
        [Authorize]
        [Route("api/template-files/csv/{id}")]
        public IActionResult Csv(int id)
        {
            var core = _coreHelper.GetCore();
            var fileName = $"{id}_{DateTime.Now.Ticks}.csv";
            var filePath = PathHelper.GetOutputPath(fileName);
            var fullPath = core.CasesToCsv(id, null, null, filePath,
                $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image/");
            var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "application/octet-stream", fileName);
        }

        [HttpGet]
        [Route("api/template-files/get-image/{fileName}.{ext}")]
        public IActionResult GetImage(string fileName, string ext, string noCache = "noCache")
        {
            var core = _coreHelper.GetCore();
            var filePath = $"{core.GetPicturePath()}\\{fileName}.{ext}";
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound($"Trying to find file at location: {filePath}");
            }

            var extention = Path.GetExtension(filePath).Replace(".", "");
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, $"image/{extention}");
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
                return new OperationResult(false, _localizationService.GetString("FileNotFound"));
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

                return new OperationResult(false, _localizationService.GetString("ErrorWhileRotateImage"));
            }

            return new OperationResult(true, _localizationService.GetString("ImageRotatedSuccessfully"));
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
        [Authorize]
        [Route("api/template-files/get-pdf-file")]
        public IActionResult GetPdfFile(string fileName)
        {
            var core = _coreHelper.GetCore();
            var filePath = $"{core.GetPdfPath()}\\{fileName}.pdf";
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "application/pdf", Path.GetFileName(filePath));
        }

        [HttpGet]
        [Authorize]
        [Route("api/template-files/download-case-pdf/{templateId}")]
        public IActionResult DownloadEFormPdf(int templateId, int caseId)
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
        [Authorize]
        [Route("api/template-files/download-eform-xml/{templateId}")]
        public IActionResult DownloadEFormXml(int templateId)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var caseId = core.CaseReadFirstId(templateId, "not_revmoed");
                var filePath = core.CaseToJasperXml((int) caseId, DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                    $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image/");
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
        [Authorize]
        [Route("api/template-files/upload-eform-zip")]
        public async Task<IActionResult> UploadEformZip(EformZipUploadModel uploadModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var templateId = uploadModel.TemplateId;
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
                Directory.CreateDirectory(saveFolder);
                Directory.CreateDirectory(zipArchiveFolder);
                if (uploadModel.File.Length > 0)
                {
                    var filePath = Path.Combine(saveFolder, Path.GetFileName(uploadModel.File.FileName));
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

                        ZipFile.ExtractToDirectory(filePath, extractPath);
                        System.IO.File.Delete(filePath);
                        await _coreHelper.Bus.SendLocal(new GenerateJasperFiles(templateId));
                        return Ok();
                    }
                }



                //var files = _httpContextAccessor.HttpContext.Request.Form.Files;
                //if (files.Count > 0)
                //{
                //    var httpPostedFile = files[0];
                //    if (httpPostedFile.Length > 0)
                //    {
                //        var filePath = Path.Combine(zipArchiveFolder, Path.GetFileName(httpPostedFile.FileName));
                //        
                //        if (System.IO.File.Exists(filePath))
                //        {
                //            System.IO.File.Delete(filePath);
                //        }
                //        httpPostedFile.SaveAs(filePath);
                //        if (System.IO.File.Exists(filePath))
                //        {
                //            Directory.CreateDirectory(extractPath);
                //            FoldersHelper.ClearFolder(extractPath);

                //            using (var zip = ZipFile.Read(filePath))
                //            {
                //                foreach (var entry in zip.Entries)
                //                {
                //                    if (entry.FileName.Contains(".png") || entry.FileName.Contains("jrxml"))
                //                    {
                //                        entry.Extract(extractPath);
                //                    }
                //                }
                //            }
                //            System.IO.File.Delete(filePath);
                //            await _coreHelper.Bus.SendLocal(new GenerateJasperFiles(templateId));

                //            return Ok();
                //        }
                //    }
                //}
                return BadRequest(_localizationService.GetString("InvalidRequest"));
            }
            catch (Exception)
            {
                return BadRequest("Invalid Request!");
            }
        }
    }

    public class EformZipUploadModel
    {
        public IFormFile File { get; set; }
        public int TemplateId { get; set; }
    }
}