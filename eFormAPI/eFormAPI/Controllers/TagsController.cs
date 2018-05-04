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

        [HttpDelete]
        [Route("api/tags")]
        public OperationResult DeleteTag(int tagId)
        {
            try
            {
                var result = _coreHelper.GetCore().TagDelete(tagId);
                return new OperationResult(result);
            }
            catch (Exception)
            {
                return new OperationResult(false, "Error while deleting tags");
            }
        }

        [HttpPost]
        [Route("api/tags")]
        public OperationResult CreateTag(string tagName)
        {
            try
            {
                var result = _coreHelper.GetCore().TagCreate(tagName);
                if (result > 0)
                {
                    return new OperationResult(true);
                }
                return new OperationResult(false);
            }
            catch (Exception)
            {
                return new OperationResult(false, "Error while creating tag");
            }
        }

        [HttpPost]
        [Route("api/tags/eform")]
        public OperationResult UpdateEformTags(UpdateEformTagsModel requestModel)
        {
            try
            {
                var result = _coreHelper.GetCore().TemplateSetTags(requestModel.EformId, requestModel.TagsIds);
                return new OperationResult(result);
            }
            catch (Exception)
            {
                return new OperationResult(false, "Error while updating eform tags");
            }
        }
    }
}