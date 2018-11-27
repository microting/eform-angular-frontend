using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Data;
using eFormAPI.Web.Infrastructure.Data.Entities;
using eFormAPI.Web.Infrastructure.Models.Common;
using eFormAPI.Web.Infrastructure.Models.Tags;
using Microsoft.AspNet.Identity;
using Microting.eFormApi.BasePn.Infrastructure;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using NLog;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class TagsController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();
        private readonly BaseDbContext _dbContext;
        private readonly Logger _logger = LogManager.GetCurrentClassLogger();

        public TagsController(BaseDbContext dbContext)
        {
            _dbContext = dbContext;
        }

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
                return new OperationDataResult<List<CommonDictionaryModel>>(false, LocaleHelper.GetString("ErrorWhileObtainTags"));
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
                    ? new OperationResult(true, LocaleHelper.GetString("TagDeletedSuccessfully"))
                    : new OperationResult(false, LocaleHelper.GetString("ErrorWhileDeletingTag"));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileDeletingTag"));
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
                    new OperationResult(true, LocaleHelper.GetString("TagParamCreatedSuccessfully", tagName))
                  : new OperationResult(false, LocaleHelper.GetString("ErrorWhileCreatingParamTag", tagName));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileCreatingParamTag", tagName));
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
                    ? new OperationResult(true, LocaleHelper.GetString("TemplateTagUpdatedSuccessfully"))
                    : new OperationResult(false, LocaleHelper.GetString("ErrorWhileUpdatingTemplateTags"));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileUpdatingTemplateTags"));
            }
        }

        [HttpGet]
        [Route("api/tags/saved")]
        public OperationDataResult<SavedTagsModel> GetSavedTags()
        {
            try
            {
                var userId = User.Identity.GetUserId<int>();
                var savedTags =  _dbContext.SavedTags
                    .Where(x => x.EformUserId == userId)
                    .Select(x => new SavedTagModel()
                    {
                        TagId = x.TagId,
                        TagName = x.TagName,
                    }).ToList();
                var result = new SavedTagsModel()
                {
                    TagList = savedTags,
                };
                return new OperationDataResult<SavedTagsModel>(true, result);
            }
            catch (Exception e)
            {
                _logger.Error(e);
                return new OperationDataResult<SavedTagsModel>(false,
                    LocaleHelper.GetString("ErrorWhileObtainingSavedTags"));
            }
        }

        [HttpDelete]
        [Route("api/tags/saved")]
        public async Task<OperationResult> RemoveTagFromSaved(int tagId)
        {
            try
            {
                var userId = User.Identity.GetUserId<int>();
                var savedTag = await _dbContext.SavedTags.FirstOrDefaultAsync(x =>
                    x.TagId == tagId && x.EformUserId == userId);
                if (savedTag == null)
                {
                    return new OperationResult(false,
                        LocaleHelper.GetString("SavedTagNotFound"));
                }

                _dbContext.SavedTags.Remove(savedTag);
                await _dbContext.SaveChangesAsync();
                return new OperationResult(true);
            }
            catch (Exception e)
            {
                _logger.Error(e);
                return new OperationResult(false,
                    LocaleHelper.GetString("ErrorWhileRemovingSavedTags"));
            }
        }

        [HttpPut]
        [Route("api/tags/saved")]
        public async Task<OperationResult> AddTagToSaved(SavedTagModel requestModel)
        {
            try
            {
                if (requestModel.TagId <= 0)
                {
                    return new OperationResult(false,
                        LocaleHelper.GetString("InvalidTagId"));
                }

                if (string.IsNullOrEmpty(requestModel.TagName))
                {
                    return new OperationResult(false,
                        LocaleHelper.GetString("InvalidTagName"));
                }
                var userId = User.Identity.GetUserId<int>();

                if (_dbContext.SavedTags.Any(x =>
                    x.EformUserId == userId && x.TagId == requestModel.TagId))
                {
                    return new OperationResult(false,
                        LocaleHelper.GetString("TagAlreadySaved"));
                }

                var savedTag = new SavedTag()
                {
                    EformUserId = userId,
                    TagId = requestModel.TagId,
                    TagName = requestModel.TagName
                };
                _dbContext.SavedTags.Add(savedTag);
                await _dbContext.SaveChangesAsync();
                return new OperationResult(true);
            }
            catch (Exception e)
            {
                _logger.Error(e);
                return new OperationResult(false,
                    LocaleHelper.GetString("ErrorWhileSavingTag"));
            }
        }
    }
}