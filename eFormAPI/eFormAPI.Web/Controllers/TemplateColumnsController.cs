using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Templates;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class TemplateColumnsController : Controller
    {
        private readonly ITemplateColumnsService _templateColumnsService;

        public TemplateColumnsController(ITemplateColumnsService templateColumnsService)
        {
            _templateColumnsService = templateColumnsService;
        }

        [HttpGet]
        [Route("api/template-columns/{templateId}")]
        public OperationDataResult<List<TemplateColumnModel>> GetAvailableColumns(int templateId)
        {
            return _templateColumnsService.GetAvailableColumns(templateId);
        }

        [HttpGet]
        [Route("api/template-columns/current/{templateId}")]
        public OperationDataResult<DisplayTemplateColumnsModel> GetCurrentColumns(int templateId)
        {
            return _templateColumnsService.GetCurrentColumns(templateId);
        }

        [HttpPost]
        [Route("api/template-columns")]
        public OperationResult UpdateColumns([FromBody] UpdateTemplateColumnsModel model)
        {
            return _templateColumnsService.UpdateColumns(model);
        }
    }
}