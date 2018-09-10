//using System.IO;
//using System.Net;
//using System.Net.Http;
//using System.Net.Http.Headers;

//namespace eFormAPI.Web.Controllers
//{
//    [Authorize]
//    public class AudioController : ApiController
//    {
//        [HttpGet]
//        [Route("api/audio/eform-audio")]
//        public HttpResponseMessage GetAudio(string fileName)
//        {
//            var filePath = HttpContext.Current.Server.MapPath($"~/output/datafolder/picture/{fileName}");
//            if (!File.Exists(filePath))
//            {
//                return new HttpResponseMessage(HttpStatusCode.NotFound);
//            }
           
//            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
//            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
//            result.Content = new StreamContent(stream);
//            result.Content.Headers.ContentType =
//                new MediaTypeHeaderValue("application/octet-stream");
//            result.Content.Headers.ContentLength = stream.Length;
//            result.Content.Headers.ContentRange = new ContentRangeHeaderValue(0, stream.Length);
//            return result;
//        }
//    }
//}