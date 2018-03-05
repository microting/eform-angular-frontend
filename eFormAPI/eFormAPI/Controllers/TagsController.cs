using System;
using System.Collections.Generic;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormAPI.Web.Infrastructure.Models.API;
using eFormAPI.Web.Infrastructure.Models.Common;

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
            catch (Exception ex)
            {
                return new OperationDataResult<List<CommonDictionaryModel>>(false, "Error while obtaining tags");
            }
        }

        [HttpDelete]
        [Route("api/tags")]
        public OperationDataResult<bool> DeleteTag(int tagId)
        {
            try
            {
                var result = _coreHelper.GetCore().TagDelete(tagId);
                return new OperationDataResult<bool>(result, result);
            }
            catch (Exception ex)
            {
                return new OperationDataResult<bool>(false, "Error while deleting tags");
            }
        }
    }
}