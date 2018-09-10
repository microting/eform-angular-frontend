using System.Collections.Generic;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Templates;
using eFormAPI.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public OperationResult UpdateColumns(UpdateTemplateColumnsModel model)
        {
            return _templateColumnsService.UpdateColumns(model);
        }
    }
}