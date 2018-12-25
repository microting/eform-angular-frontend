using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Models.Tags;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using Microting.eFormApi.BasePn.Infrastructure.Models.Tags;

namespace eFormAPI.Web.Services
{
    public class TagsService : ITagsService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly IUserService _userService;
        private readonly BaseDbContext _dbContext;
        private readonly ILogger<TagsService> _logger;
        private readonly ILocalizationService _localizationService;

        public TagsService(ILogger<TagsService> logger,
            IEFormCoreService coreHelper,
            ILocalizationService localizationService,
            IUserService userService,
            BaseDbContext dbContext)
        {
            _logger = logger;
            _coreHelper = coreHelper;
            _localizationService = localizationService;
            _userService = userService;
            _dbContext = dbContext;
        }

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
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<List<CommonDictionaryModel>>(false,
                    _localizationService.GetString("ErrorWhileObtainTags"));
            }
        }

        public async Task<OperationResult> DeleteTag(int tagId)
        {
            try
            {
                var result = _coreHelper.GetCore().TagDelete(tagId);
                if (result)
                {
                    var savedTags = _dbContext.SavedTags.Where(x => x.TagId == tagId).ToList();
                    if (savedTags.Any())
                    {
                        _dbContext.SavedTags.RemoveRange(savedTags);
                        await _dbContext.SaveChangesAsync();
                    }
                }

                return result
                    ? new OperationResult(true, _localizationService.GetString("TagDeletedSuccessfully"))
                    : new OperationResult(false, _localizationService.GetString("ErrorWhileDeletingTag"));
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationResult(false, _localizationService.GetString("ErrorWhileDeletingTag"));
            }
        }

        public OperationResult CreateTag(string tagName)
        {
            try
            {
                var result = _coreHelper.GetCore().TagCreate(tagName);
                return result > 0
                    ? new OperationResult(true, _localizationService.GetString("TagParamCreatedSuccessfully", tagName))
                    : new OperationResult(false, _localizationService.GetString("ErrorWhileCreatingParamTag", tagName));
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString("ErrorWhileCreatingParamTag", tagName));
            }
        }

        public OperationResult UpdateTemplateTags(UpdateTemplateTagsModel requestModel)
        {
            try
            {
                var result = _coreHelper.GetCore().TemplateSetTags(requestModel.TemplateId, requestModel.TagsIds);
                return result
                    ? new OperationResult(true, _localizationService.GetString("TemplateTagUpdatedSuccessfully"))
                    : new OperationResult(false, _localizationService.GetString("ErrorWhileUpdatingTemplateTags"));
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationResult(false, _localizationService.GetString("ErrorWhileUpdatingTemplateTags"));
            }
        }

        public async Task<OperationDataResult<SavedTagsModel>> GetSavedTags()
        {
            try
            {
                var savedTags = await _dbContext.SavedTags
                    .Where(x => x.EformUserId == _userService.UserId)
                    .Select(x => new SavedTagModel()
                    {
                        TagId = x.TagId,
                        TagName = x.TagName,
                    }).ToListAsync();
                var result = new SavedTagsModel()
                {
                    TagList = savedTags,
                };
                return new OperationDataResult<SavedTagsModel>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<SavedTagsModel>(false,
                    _localizationService.GetString("ErrorWhileObtainingSavedTags"));
            }
        }


        public async Task<OperationResult> RemoveTagFromSaved(int tagId)
        {
            try
            {
                var savedTag = await _dbContext.SavedTags.FirstOrDefaultAsync(x =>
                    x.TagId == tagId && x.EformUserId == _userService.UserId);
                if (savedTag == null)
                {
                    return new OperationResult(false,
                        _localizationService.GetString("SavedTagNotFound"));
                }

                _dbContext.Remove(savedTag);
                await _dbContext.SaveChangesAsync();
                return new OperationResult(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString("ErrorWhileRemovingSavedTags"));
            }
        }

        public async Task<OperationResult> AddTagToSaved(SavedTagModel requestModel)
        {
            try
            {
                if (requestModel.TagId <= 0)
                {
                    return new OperationResult(false,
                        _localizationService.GetString("InvalidTagId"));
                }

                if (string.IsNullOrEmpty(requestModel.TagName))
                {
                    return new OperationResult(false,
                        _localizationService.GetString("InvalidTagName"));
                }

                if (_dbContext.SavedTags.Any(x =>
                    x.EformUserId == _userService.UserId && x.TagId == requestModel.TagId))
                {
                    return new OperationResult(false,
                        _localizationService.GetString("TagAlreadySaved"));
                }

                var savedTag = new SavedTag()
                {
                    EformUserId = _userService.UserId,
                    TagId = requestModel.TagId,
                    TagName = requestModel.TagName
                };
                _dbContext.SavedTags.Add(savedTag);
                await _dbContext.SaveChangesAsync();
                return new OperationResult(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _localizationService.GetString("ErrorWhileSavingTag"));
            }
        }
    }
}