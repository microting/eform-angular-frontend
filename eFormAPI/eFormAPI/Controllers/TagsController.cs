using System;
using System.Collections.Generic;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormAPI.Web.Infrastructure.Models.API;
using eFormAPI.Web.Infrastructure.Models.Common;
using eFormAPI.Web.Infrastructure.Models.Tags;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class TagsController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpGet]
        [Route("api/tags")]
        public OperationDataResult<List<CommonDictionaryModel>> GetAllTags()
        {
            try
            {
                var core = _coreHelper.GetCore();
                var tags = core.GetAllTags(false);
                var model = new List<CommonDictionaryModel>(tags.Count);
                tags.ForEach(tag =>
                {
                    model.Add(new CommonDictionaryModel()
                    {
                        Id = tag.Id,
                        Name = tag.Name,
                    });
                });
                return new OperationDataResult<List<CommonDictionaryModel>>(true, model);
            }
            catch (Exception)
            {
                return new OperationDataResult<List<CommonDictionaryModel>>(false, "Error while obtaining tags");
            }
        }

        [HttpGet]
        [Route("api/tags/delete")]
        public OperationResult DeleteTag(int tagId)
        {
            try
            {
                var result = _coreHelper.GetCore().TagDelete(tagId);
                return result
                    ? new OperationResult(true, "Tag was deleted successfully")
                    : new OperationResult(false, "Error while deleted tag");
            }
            catch (Exception)
            {
                return new OperationResult(false, "Error while removing tag");
            }
        }

        [HttpPost]
        [Route("api/tags")]
        public OperationResult CreateTag(string tagName)
        {
            try
            {
                var result = _coreHelper.GetCore().TagCreate(tagName);
                return result > 0 ?
                    new OperationResult(true, $"Tag \"{tagName}\" was created successfully")
                  : new OperationResult(false, $"Error while creating \"{tagName}\" tag");
            }
            catch (Exception)
            {
                return new OperationResult(false, $"Error while creating \"{tagName}\" tag");
            }
        }

        [HttpPost]
        [Route("api/tags/template")]
        public OperationResult UpdateTemplateTags(UpdateTemplateTagsModel requestModel)
        {
            try
            {
                var result = _coreHelper.GetCore().TemplateSetTags(requestModel.TemplateId, requestModel.TagsIds);
                return result
                    ? new OperationResult(true, "Template tags was updated successfully")
                    : new OperationResult(false, "Error while updating template tags");
            }
            catch (Exception)
            {
                return new OperationResult(false, "Error while updating template tags");
            }
        }
    }
}