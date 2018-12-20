using System;
using System.IO;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure;
using eFormCore;
using ICSharpCode.SharpZipLib.Zip;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
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
        [Authorize]
        [Route("api/template-files/csv/{id}")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.GetCsv)]
        public async Task<IActionResult> Csv(int id)
        {
            if (!await _permissionsService.CheckEform(id,
                AuthConsts.EformClaims.EformsClaims.GetCsv))
            {
                return Forbid();
            }

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
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CasesRead)]
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
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseUpdate)]
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
                img.Mutate(x => x.Rotate(RotateMode.Rotate90));
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
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseUpdate)]
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
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseGetPdf)]
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
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseGetPdf)]
        public async Task<IActionResult> DownloadEFormPdf(int templateId, int caseId)
        {
            if (!await _permissionsService.CheckEform(templateId,
                AuthConsts.EformClaims.CasesClaims.CaseGetPdf))
            {
                return Forbid();
            }

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
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UploadZip)]
        public async Task<IActionResult> UploadEformZip(EformZipUploadModel uploadModel)
        {
            if (!await _permissionsService.CheckEform(uploadModel.TemplateId,
                AuthConsts.EformClaims.EformsClaims.UploadZip))
            {
                return Forbid();
            }

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
    }

    public class EformZipUploadModel
    {
        public IFormFile File { get; set; }
        public int TemplateId { get; set; }
    }
}