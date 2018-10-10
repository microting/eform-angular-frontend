using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class AudioController : Controller
    {
        [HttpGet]
        [Route("api/audio/eform-audio")]
        public IActionResult GetAudio(string fileName)
        {
            var filePath = PathHelper.GetAudioPath(fileName);
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }
            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            //result.Content = new StreamContent(stream);
            //result.Content.Headers.ContentType =
            //    new MediaTypeHeaderValue("application/octet-stream");
            //result.Content.Headers.ContentLength = stream.Length;
            //result.Content.Headers.ContentRange = new ContentRangeHeaderValue(0, stream.Length);
            Response.Headers.Add("Accept-Ranges", "bytes");
            Response.Headers.Remove("Cache-Control");
            return File(stream, "audio/wav");
        }
    }
}