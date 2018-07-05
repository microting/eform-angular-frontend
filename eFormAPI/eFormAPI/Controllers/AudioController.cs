using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class AudioController : ApiController
    {
        [HttpGet]
        [Route("api/audio/eform-audio/{fileName}.{ext}")]
        public HttpResponseMessage GetAudio(string fileName, string ext)
        {
            var filePath = HttpContext.Current.Server.MapPath($"~/output/datafolder/picture/{fileName}.{ext}");
            if (!File.Exists(filePath))
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
            const string mime = "vnd.wave";
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            var result = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(fileStream)
            };
            result.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment") {FileName = fileName};
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue($"audio/{mime}");
            return result;
        }
    }
}