using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Models.Tags;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

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
        public async Task<OperationResult> DeleteTag(int tagId)
        {
            return await _tagsService.DeleteTag(tagId);
        }

        [HttpPost]
        [Route("api/tags")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.UpdateTags)]
        public OperationResult CreateTag(string tagName)
        {
            return _tagsService.CreateTag(tagName);
        }

        [HttpGet]
        [Route("api/tags/saved")]
        public async Task<OperationDataResult<SavedTagsModel>> GetSavedTags()
        {
            return await _tagsService.GetSavedTags();
        }

        [HttpPut]
        [Route("api/tags/saved")]
        public async Task<OperationResult> AddTagToSaved([FromBody] SavedTagModel model)
        {
            return await _tagsService.AddTagToSaved(model);
        }

        [HttpDelete]
        [Route("api/tags/saved")]
        public async Task<OperationResult> RemoveTagFromSaved(int tagId)
        {
            return await _tagsService.RemoveTagFromSaved(tagId);
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