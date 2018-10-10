using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using Microting.eFormApi.BasePn.Infrastructure.Models.Tags;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class TagsController : Controller
    {
        private readonly ITagsService _tagsService;

        public TagsController(ITagsService tagsService)
        {
            _tagsService = tagsService;
        }

        [HttpGet]
        [Route("api/tags")]
        public OperationDataResult<List<CommonDictionaryModel>> GetAllTags()
        {
            return _tagsService.GetAllTags();
        }

        [HttpGet]
        [Route("api/tags/delete")]
        public OperationResult DeleteTag(int tagId)
        {
            return _tagsService.DeleteTag(tagId);
        }

        [HttpPost]
        [Route("api/tags")]
        public OperationResult CreateTag(string tagName)
        {
            return _tagsService.CreateTag(tagName);
        }

        [HttpPost]
        [Route("api/tags/template")]
        public OperationResult UpdateTemplateTags([FromBody] UpdateTemplateTagsModel requestModel)
        {
            return _tagsService.UpdateTemplateTags(requestModel);
        }
    }
}