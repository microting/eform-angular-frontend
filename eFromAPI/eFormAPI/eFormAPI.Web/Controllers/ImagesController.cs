using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using eFormAPI.Common.Consts;
using eFormAPI.Common.Infrastructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class ImagesController : Controller
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ImagesController(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        [Route("api/images/eform-images")]
        public HttpResponseMessage GetImage(string fileName)
        {
            var filePath = HttpContext.Current.Server.MapPath($"~/output/datafolder/picture/settings/{fileName}");
            if (!System.IO.File.Exists(filePath))
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
            var extention = Path.GetExtension(filePath).Replace(".", "");
            if (extention == "jpg")
            {
                extention = "jpeg";
            }
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(fileStream)
            };
            result.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment") { FileName = fileName };
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue($"image/{extention}");
            return result;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/images/login-page-images")]
        public HttpResponseMessage GetLoginPageImage(string fileName)
        {
            var filePath =
                HttpContext.Current.Server.MapPath($"~/output/datafolder/picture/settings/login-page/{fileName}");
            if (!System.IO.File.Exists(filePath))
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
            var extention = Path.GetExtension(filePath).Replace(".", "");
            if (extention == "jpg")
            {
                extention = "jpeg";
            }
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(fileStream)
            };
            result.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment") { FileName = fileName };
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue($"image/{extention}");
            return result;
        }

        [HttpPost]
        [Authorize(Roles = EformRoles.Admin)]
        [Route("api/images/login-page-images")]
        public HttpResponseMessage PostLoginPageImages()
        {
            var iUploadedCnt = 0;
            var saveFolder =
                System.Web.Hosting.HostingEnvironment.MapPath("~/output/datafolder/picture/settings/login-page");
            if (string.IsNullOrEmpty(saveFolder))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, LocaleHelper.GetString("FolderError"));
            }
            if (!Directory.Exists(saveFolder))
            {
                Directory.CreateDirectory(saveFolder);
            }
            var files = HttpContext.Current.Request.Files;
            for (var i = 0; i <= files.Count - 1; i++)
            {
                var hpf = files[i];
                if (hpf.ContentLength > 0)
                {
                    var filePath = Path.Combine(saveFolder, Path.GetFileName(hpf.FileName));
                    if (!File.Exists(filePath))
                    {
                        hpf.SaveAs(filePath);
                        iUploadedCnt++;
                    }
                }
            }
            if (iUploadedCnt > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, LocaleHelper.GetString("InvalidRequest"));
        }

        [HttpPost]
        [Authorize(Roles = EformRoles.Admin)]
        [Route("api/images/eform-images")]
        public HttpResponseMessage PostEformImages()
        {
            var iUploadedCnt = 0;
            var saveFolder = System.Web.Hosting.HostingEnvironment.MapPath("~/output/datafolder/picture/settings");
            if (string.IsNullOrEmpty(saveFolder))
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, LocaleHelper.GetString("FolderError"));
            }
            if (!Directory.Exists(saveFolder))
            {
                Directory.CreateDirectory(saveFolder);
            }
            var files = HttpContext.Current.Request.Files;
            for (var i = 0; i <= files.Count - 1; i++)
            {
                var hpf = files[i];
                if (hpf.ContentLength > 0)
                {
                    var filePath = Path.Combine(saveFolder, Path.GetFileName(hpf.FileName));
                    if (!File.Exists(filePath))
                    {
                        hpf.SaveAs(filePath);
                        iUploadedCnt++;
                    }
                }
            }
            if (iUploadedCnt > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, LocaleHelper.GetString("InvalidRequest"));
        }
    }
}