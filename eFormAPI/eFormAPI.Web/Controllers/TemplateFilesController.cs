using System;
using System.IO;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormCore;
using ICSharpCode.SharpZipLib.Zip;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Messages;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
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
            Core core = _coreHelper.GetCore();
            string fileName = $"{id}_{DateTime.Now.Ticks}.csv";
            string filePath = PathHelper.GetOutputPath(fileName);
            string fullPath = core.CasesToCsv(id, null, null, filePath,
                $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image/");
            FileStream fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "application/octet-stream", fileName);
        }

        [HttpGet]
        [Route("api/template-files/get-image/{fileName}.{ext}")]
        public IActionResult GetImage(string fileName, string ext, string noCache = "noCache")
        {
            Core core = _coreHelper.GetCore();
            string filePath = $"{core.GetPicturePath()}\\{fileName}.{ext}";
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound($"Trying to find file at location: {filePath}");
            }

            string extention = Path.GetExtension(filePath).Replace(".", "");
            FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, $"image/{extention}");
        }

        [HttpGet]
        [Authorize]
        [Route("api/template-files/rotate-image")]
        public OperationResult RotateImage(string fileName)
        {
            Core core = _coreHelper.GetCore();
            string filePath = $"{core.GetPicturePath()}\\{fileName}";
            if (!System.IO.File.Exists(filePath))
            {
                return new OperationResult(false, _localizationService.GetString("FileNotFound"));
            }

            try
            {
                Image<Rgba32> img = Image.Load(filePath);
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
                Core core = _coreHelper.GetCore();
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
            Core core = _coreHelper.GetCore();
            string filePath = $"{core.GetPdfPath()}\\{fileName}.pdf";
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "application/pdf", Path.GetFileName(filePath));
        }

        [HttpGet]
        [Authorize]
        [Route("api/template-files/download-case-pdf/{templateId}")]
        public IActionResult DownloadEFormPdf(int templateId, int caseId)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                string filePath = core.CaseToPdf(caseId, templateId.ToString(),
                    DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                    $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image/");
                //DateTime.Now.ToString("yyyyMMddHHmmssffff"), $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image?&filename=");
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }

                FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
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
                Core core = _coreHelper.GetCore();
                int? caseId = core.CaseReadFirstId(templateId, "not_revmoed");
                string filePath = core.CaseToJasperXml((int) caseId, DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                    $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image/");
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }

                FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
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
                Core core = _coreHelper.GetCore();
                int templateId = uploadModel.TemplateId;
                if (templateId <= 0)
                {
                    return BadRequest("Invalid Request!");
                }
                string saveFolder =
                    Path.Combine(core.GetJasperPath(),
                        Path.Combine("templates", templateId.ToString()));

                string zipArchiveFolder =
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
                    string filePath = Path.Combine(zipArchiveFolder, Path.GetFileName(uploadModel.File.FileName));
                    if (!System.IO.File.Exists(filePath))
                    {
                        using (FileStream stream = new FileStream(filePath, FileMode.Create))
                        {
                            await uploadModel.File.CopyToAsync(stream);
                        }
                    }

                    string extractPath = Path.Combine(saveFolder);
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
                        FastZip fastZip = new FastZip();
                        // Will always overwrite if target filenames already exist
                        fastZip.ExtractZip(filePath, extractPath, null);
                        //ZipFile.ExtractToDirectory(filePath, extractPath);
                        System.IO.File.Delete(filePath);
                        await _coreHelper.Bus.SendLocal(new GenerateJasperFiles(templateId));
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
    }

    public class EformZipUploadModel
    {
        public IFormFile File { get; set; }
        public int TemplateId { get; set; }
    }
}