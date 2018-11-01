using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Services.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using Microting.eFormApi.BasePn.Infrastructure.Models.Tags;

namespace eFormAPI.Web.Controllers.Eforms
{
    [Authorize]
    public class TagsController : Controller
    {
        private readonly ITagsService _tagsService;
        private readonly IEformPermissionsService _permissionsService;

        public TagsController(ITagsService tagsService,
            IEformPermissionsService permissionsService)
        {
            _tagsService = tagsService;
            _permissionsService = permissionsService;
        }

        [HttpGet]
        [Route("api/tags")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.ReadTags)]
        public OperationDataResult<List<CommonDictionaryModel>> GetAllTags()
        {
            return _tagsService.GetAllTags();
        }

        [HttpGet]
        [Route("api/tags/delete")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateTags)]
        public OperationResult DeleteTag(int tagId)
        {
            return _tagsService.DeleteTag(tagId);
        }

        [HttpPost]
        [Route("api/tags")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateTags)]
        public OperationResult CreateTag(string tagName)
        {
            return _tagsService.CreateTag(tagName);
        }

        [HttpPost]
        [Route("api/tags/template")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateTags)]
        public async Task<IActionResult> UpdateTemplateTags([FromBody] UpdateTemplateTagsModel requestModel)
        {
            if (!await _permissionsService.CheckEform(requestModel.TemplateId,
                AuthConsts.EformClaims.EformsClaims.UpdateTags))
            {
                return Forbid();
            }

            return Ok(_tagsService.UpdateTemplateTags(requestModel));
        }
    }
}