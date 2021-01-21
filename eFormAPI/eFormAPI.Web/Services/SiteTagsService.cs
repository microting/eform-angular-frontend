/*
The MIT License (MIT)

Copyright (c) 2007 - 2020 Microting A/S

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

namespace eFormAPI.Web.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Abstractions;
    using Abstractions.Advanced;
    using Infrastructure.Models.Sites;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eForm.Infrastructure.Data.Entities;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    public class SiteTagsService : ISiteTagsService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;
        private readonly ILogger<SiteTagsService> _logger;

        public SiteTagsService(IEFormCoreService coreHelper,
            ILocalizationService localizationService,
            ILogger<SiteTagsService> logger)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
            _logger = logger;
        }

        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetSitesTags()
        {
            try
            {
                var core = await _coreHelper.GetCore();
                await using var dbContext = core.DbContextHelper.GetDbContext();
                var tags = await dbContext.Tags
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => new CommonDictionaryModel
                    {
                        Id = x.Id,
                        Name = x.Name
                    }).ToListAsync();

                return new OperationDataResult<List<CommonDictionaryModel>>(true, tags);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationDataResult<List<CommonDictionaryModel>>(false,
                    _localizationService.GetString("ErrorWhileObtainTags"));
            }
        }

        public async Task<OperationResult> CreateSiteTag(string tagName)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                await using var dbContext = core.DbContextHelper.GetDbContext();
                var tag = new Tag
                {
                    Name = tagName,
                };

                await tag.Create(dbContext);

                return new OperationResult(
                    true,
                    _localizationService.GetStringWithFormat(
                        "TagParamCreatedSuccessfully",
                        tagName));
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationResult(false,
                    _localizationService.GetStringWithFormat(
                        "ErrorWhileCreatingParamTag",
                        tagName));
            }
        }

        public async Task<OperationResult> UpdateSiteTags(UpdateSiteTagsModel siteTagsModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                await using var dbContext = core.DbContextHelper.GetDbContext();
                var site = await dbContext.Sites
                    .Include(x => x.SiteTags)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.Id == siteTagsModel.SiteId)
                    .FirstOrDefaultAsync();

                if (site == null)
                {
                    return new OperationResult(
                        false,
                        _localizationService.GetStringWithFormat("SiteParamNotFound", siteTagsModel.SiteId));
                }

                // Tags
                var siteTagIds = site.SiteTags
                    .Where(x=>x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.TagId != null)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => (int)x.TagId)
                    .ToList();

                var forRemove = siteTagIds
                    .Where(x => !siteTagsModel.TagsIds.Contains(x))
                    .ToList();

                foreach (var tagIdForRemove in forRemove)
                {
                    var siteTag = await dbContext.SiteTags
                        .FirstOrDefaultAsync(
                            x => x.TagId == tagIdForRemove
                                 && x.SiteId == site.Id);

                    if (siteTag != null)
                    {
                        await siteTag.Delete(dbContext);
                    }
                }

                var forCreate = siteTagsModel.TagsIds
                    .Where(x => !siteTagIds.Contains(x))
                    .ToList();

                foreach (var tagIdForCreate in forCreate)
                {
                    var siteTag = new SiteTag()
                    {
                        TagId = tagIdForCreate,
                        SiteId = site.Id,
                    };

                    await siteTag.Create(dbContext);
                }

                return new OperationResult(true, _localizationService.GetString("TagUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationResult(false,
                    _localizationService.GetString("ErrorWhileUpdatingTags"));
            }
        }

        public async Task<OperationResult> DeleteTag(int tagId)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                await using var dbContext = core.DbContextHelper.GetDbContext();
                var tag = await dbContext.Tags
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync(x => x.Id == tagId);

                if (tag == null)
                {
                    return new OperationResult(false,
                        _localizationService.GetString("TagNotFound"));
                }

                await tag.Delete(dbContext);

                return new OperationResult(
                    true,
                    _localizationService.GetString("TagDeletedSuccessfully"));
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationResult(false,
                    _localizationService.GetString("ErrorWhileDeletingTag"));
            }
        }
    }
}