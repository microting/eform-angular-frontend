/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


using Microsoft.Extensions.Logging;
using Sentry;

namespace eFormAPI.Web.Controllers.Eforms;

using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.EformAngularFrontendBase.Infrastructure.Const;

[Authorize]
public class AudioController(IEFormCoreService coreHelper, ILogger<AudioController> logger)
    : Controller
{
    [HttpGet]
    [Route("api/audio/eform-audio")]
    [Authorize(Policy = AuthConsts.EformPolicies.Cases.CasesRead)]
    public async Task<IActionResult> GetAudio(string fileName)
    {
        try
        {
            var core = await coreHelper.GetCore();

            if (core.GetSdkSetting(Settings.s3Enabled).Result.ToLower() == "true")
            {
                var ss = await core.GetFileFromS3Storage($"{fileName}");

                Response.ContentLength = ss.ContentLength;

                return File(ss.ResponseStream, ss.Headers.ContentType);
            }

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
            Response.Headers["Accept-Ranges"] = "bytes";
            Response.Headers.Remove("Cache-Control");
            return File(stream, "audio/wav");
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return NotFound($"Trying to find file at location: {fileName}, exception is: {e.Message}");
        }
    }
}