/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

namespace eFormAPI.Web.Services;

using Microting.eForm.Infrastructure.Constants;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abstractions;
using Abstractions.Eforms;
using Infrastructure.Models.Tags;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

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

    public async Task<OperationDataResult<List<CommonDictionaryModel>>> Index()
    {
        try
        {
            var core = await _coreHelper.GetCore();
            var tags = await core.GetAllTags(false);
            var model = new List<CommonDictionaryModel>(tags.Count);
            tags.ForEach(tag =>
            {
                model.Add(new CommonDictionaryModel()
                {
                    Id = tag.Id,
                    Name = tag.Name
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

    public async Task<OperationResult> Create(string tagName)
    {
        try
        {
            var result = await _coreHelper.GetCore().Result.TagCreate(tagName);
            return result > 0
                ? new OperationResult(true, _localizationService.GetStringWithFormat("TagParamCreatedSuccessfully", tagName))
                : new OperationResult(false, _localizationService.GetStringWithFormat("ErrorWhileCreatingParamTag", tagName));
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return new OperationResult(false,
                _localizationService.GetStringWithFormat("ErrorWhileCreatingParamTag", tagName));
        }
    }

    public async Task<OperationResult> Update(UpdateTemplateTagsModel requestModel)
    {
        try
        {
            var result = await _coreHelper.GetCore().Result.TemplateSetTags(requestModel.TemplateId, requestModel.TagsIds);
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

    public async Task<OperationResult> Delete(int tagId)
    {
        try
        {
            var core = await _coreHelper.GetCore();
            var sdkDbContext = core.DbContextHelper.GetDbContext();
            var tagFromDb = await sdkDbContext.Tags
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.Id == tagId)
                .FirstOrDefaultAsync();

            if (tagFromDb == null)
            {
                return new OperationResult(
                    false,
                    _localizationService.GetString("TagNotFound"));
            }

            var taggingFromDb = await sdkDbContext.Taggings
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.Id == tagId)
                .ToListAsync();

            foreach (var tagging in taggingFromDb)
            {
                await tagging.Delete(sdkDbContext);
            }

            var sitesTags = await sdkDbContext.SiteTags
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.TagId == tagId)
                .ToListAsync();

            foreach (var siteTag in sitesTags)
            {
                await siteTag.Delete(sdkDbContext);
            }

            await tagFromDb.Delete(sdkDbContext);

            var savedTags = await _dbContext.SavedTags.Where(x => x.TagId == tagId).FirstOrDefaultAsync();
            if (savedTags != null)
            {
                _dbContext.SavedTags.Remove(savedTags);
                await _dbContext.SaveChangesAsync();
            }

            return new OperationResult(true, _localizationService.GetString("TagDeletedSuccessfully"));
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return new OperationResult(false, _localizationService.GetString("ErrorWhileDeletingTag"));
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
                    TagName = x.TagName
                }).ToListAsync();
            var result = new SavedTagsModel()
            {
                TagList = savedTags
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

    public async Task<OperationResult> UpdateTag(CommonTagModel commonTagModel)
    {

        try
        {
            var core = await _coreHelper.GetCore();
            var sdkDbContext = core.DbContextHelper.GetDbContext();
            var tagFromDb = await sdkDbContext.Tags
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.Id == commonTagModel.Id)
                .FirstOrDefaultAsync();

            if (tagFromDb == null)
            {
                return new OperationResult(
                    false,
                    _localizationService.GetString("TagNotFound"));
            }

            tagFromDb.Name = commonTagModel.Name;
            await tagFromDb.Update(sdkDbContext);

            var savedTagFromDb = await _dbContext.SavedTags
                //.Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.TagId == commonTagModel.Id)
                .FirstOrDefaultAsync();

            if (savedTagFromDb != null)
            {
                savedTagFromDb.TagName = commonTagModel.Name;
                savedTagFromDb.UpdatedByUserId = _userService.UserId;
                await _dbContext.SaveChangesAsync();
            }

            return new OperationResult(true, _localizationService.GetString("TagUpdatedSuccessfully"));
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return new OperationResult(false, _localizationService.GetString("ErrorWhileUpdateTag"));
        }
    }
}