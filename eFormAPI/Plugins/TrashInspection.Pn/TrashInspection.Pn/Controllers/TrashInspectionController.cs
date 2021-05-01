using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;

namespace TrashInspection.Pn.Controllers
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Const;
    using Infrastructure.Models;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    public class TrashInspectionController : Controller
    {
        private readonly ITrashInspectionService _trashInspectionService;

        public TrashInspectionController(ITrashInspectionService trashInspectionService)
        {
            _trashInspectionService = trashInspectionService;
        }

        [HttpPost]
        [Authorize(Policy = TrashInspectionClaims.AccessTrashInspectionPlugin)]
        [Route("api/trash-inspection-pn/inspections/index")]
        public async Task<OperationDataResult<Paged<TrashInspectionModel>>> Index([FromBody] TrashInspectionRequestModel requestModel)
        {
            return await _trashInspectionService.Index(requestModel);
        }

        [HttpPost]
        [AllowAnonymous]
        [DebuggingFilter]
        [Route("api/trash-inspection-pn/inspections")]
        public async Task<OperationResult> Create([FromBody] TrashInspectionModel createModel)
        {
            return await _trashInspectionService.Create(createModel);
        }

        [HttpGet]
        [Authorize(Policy = TrashInspectionClaims.AccessTrashInspectionPlugin)]
        [Route("api/trash-inspection-pn/inspections/{id}")]
        public async Task<OperationDataResult<TrashInspectionModel>> Read(int id)
        {
            return await _trashInspectionService.Read(id);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/trash-inspection-pn/versions/{id}")]
        public async Task<OperationDataResult<TrashInspectionVersionsModel>> ReadVersion(int id)
        {
            return await _trashInspectionService.ReadVersion(id);
        }

        [HttpPost]
        [Authorize(Policy = TrashInspectionClaims.AccessTrashInspectionPlugin)]
        [AllowAnonymous]
        [Route("api/trash-inspection-pn/case-versions/{id}")]
        public async Task<OperationDataResult<TrashInspectionCaseVersionsModel>> IndexVersions(int id)
        {
            return await _trashInspectionService.IndexVersions(id);
        }

        [HttpPut]
        [Authorize(Policy = TrashInspectionClaims.AccessTrashInspectionPlugin)]
        [Route("api/trash-inspection-pn/inspections")]
        public async Task<OperationResult> Update([FromBody] TrashInspectionModel updateModel)
        {
            return await _trashInspectionService.Update(updateModel);
        }

        [HttpDelete]
        [Authorize(Policy = TrashInspectionClaims.AccessTrashInspectionPlugin)]
        [Route("api/trash-inspection-pn/inspections/{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _trashInspectionService.Delete(id);
        }

        [HttpDelete]
        [AllowAnonymous]
        [Route("api/trash-inspection-pn/inspection-results/{weighingNumber}", Name = "token")]
        public async Task<OperationResult> Delete(string weighingNumber, string token)
        {
            return await _trashInspectionService.Delete(weighingNumber, token);

        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/trash-inspection-pn/inspection-results/{weighingNumber}")]
        public async Task<IActionResult> InspectionResults(string weighingNumber, string token, string fileType)
        {
            try
            {
                if (fileType == "result")
                {
                    var result =  await _trashInspectionService.Read(weighingNumber, token);
                    return new JsonResult(result.Model);
                }

                if (string.IsNullOrEmpty(fileType))
                {
                    fileType = "pdf";
                }
                var filePath = await _trashInspectionService.DownloadEFormPdf(weighingNumber, token, fileType);

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }
                var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                return File(fileStream, "application/pdf", Path.GetFileName(filePath));
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch
            {
                return BadRequest();

            }
        }

        private class DebuggingFilter : AuthorizeAttribute, IAuthorizationFilter
        {
            public void OnAuthorization(AuthorizationFilterContext context)
            {
                if (context.HttpContext.Request.Method != "POST")
                {
                    return;
                }

                // NEW! enable sync IO beacuse the JSON reader apparently doesn't use async and it throws an exception otherwise
                var syncIoFeature = context.HttpContext.Features.Get<IHttpBodyControlFeature>();
                if (syncIoFeature != null)
                {
                    syncIoFeature.AllowSynchronousIO = true;

                    var req = context.HttpContext.Request;

                    req.EnableBuffering();

                    // read the body here as a workarond for the JSON parser disposing the stream
                    if (!req.Body.CanSeek) return;
                    req.Body.Seek(0, SeekOrigin.Begin);

                    // if body (stream) can seek, we can read the body to a string for logging purposes
                    using (var reader = new StreamReader(
                        req.Body,
                        Encoding.UTF8,
                        false,
                        8192,
                        true))
                    {
                        var jsonString = reader.ReadToEnd();

                        Console.WriteLine(jsonString);
                    }

                    // go back to beginning so json reader get's the whole thing
                    req.Body.Seek(0, SeekOrigin.Begin);
                }
            }
        }
    }
}
