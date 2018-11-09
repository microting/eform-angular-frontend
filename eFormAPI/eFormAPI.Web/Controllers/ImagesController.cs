using System.IO;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class ImagesController : Controller
    {
        private readonly ILocalizationService _localizationService;

        public ImagesController(ILocalizationService localizationService)
        {
            _localizationService = localizationService;
        }

        [HttpGet]
        [Route("api/images/eform-images")]
        public IActionResult GetImage(string fileName)
        {
            string filePath = PathHelper.GetEformSettingsImagesPath(fileName);
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            string extention = Path.GetExtension(filePath).Replace(".", "");
            if (extention == "jpg")
            {
                extention = "jpeg";
            }
            FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, $"image/{extention}");
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/images/login-page-images")]
        public IActionResult GetLoginPageImage(string fileName)
        {
            string filePath = PathHelper.GetEformLoginPageSettingsImagesPath(fileName);
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            string extention = Path.GetExtension(filePath).Replace(".", "");
            if (extention == "jpg")
            {
                extention = "jpeg";
            }
            FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, $"image/{extention}");
        }

        [HttpPost]
        [Authorize(Roles = EformRole.Admin, AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [Route("api/images/login-page-images")]
        public async Task<IActionResult> PostLoginPageImages(IFormFile file)
        {
            int iUploadedCnt = 0;
            string saveFolder = PathHelper.GetEformLoginPageSettingsImagesPath();
            if (string.IsNullOrEmpty(saveFolder))
            {
                return BadRequest(_localizationService.GetString("FolderError"));
            }

            if (!Directory.Exists(saveFolder))
            {
                Directory.CreateDirectory(saveFolder);
            }

            if (file.Length > 0)
            {
                string filePath = Path.Combine(saveFolder, Path.GetFileName(file.FileName));
                if (!System.IO.File.Exists(filePath))
                {
                    using (FileStream stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    iUploadedCnt++;
                }
            }

            if (iUploadedCnt > 0)
            {
                return Ok();
            }
            return BadRequest(_localizationService.GetString("InvalidRequest"));
        }

        [HttpPost]
        [Authorize(Roles = EformRole.Admin, AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [Route("api/images/eform-images")]
        public async Task<IActionResult> PostEformImages(IFormFile file)
        {
            int iUploadedCnt = 0;
            string saveFolder = PathHelper.GetEformSettingsImagesPath();
            if (string.IsNullOrEmpty(saveFolder))
            {
                return BadRequest(_localizationService.GetString("FolderError"));
            }

            if (!Directory.Exists(saveFolder))
            {
                Directory.CreateDirectory(saveFolder);
            }

            if (file.Length > 0)
            {
                string filePath = Path.Combine(saveFolder, Path.GetFileName(file.FileName));
                if (!System.IO.File.Exists(filePath))
                {
                    using (FileStream stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    iUploadedCnt++;
                }
            }

            if (iUploadedCnt > 0)
            {
                return Ok();
            }
            return BadRequest(_localizationService.GetString("InvalidRequest"));
        }
    }
}