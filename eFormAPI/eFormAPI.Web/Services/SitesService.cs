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

using eFormAPI.Web.Infrastructure.Models.Units;
using Microting.eForm.Infrastructure.Data.Entities;
using Sentry;

namespace eFormAPI.Web.Services;

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
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

public class SitesService(
    IEFormCoreService coreHelper,
    ILocalizationService localizationService,
    ILogger<SitesService> logger)
    : ISitesService
{
    public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetSitesDictionary()
    {
        try
        {
            var core = await coreHelper.GetCore();
            await using var dbContext = core.DbContextHelper.GetDbContext();
            var sites = await dbContext.Sites
                .AsNoTracking()
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Select(x => new CommonDictionaryModel
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .OrderBy(x => x.Name)
                .ToListAsync();

            return new OperationDataResult<List<CommonDictionaryModel>>(true, sites);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<List<CommonDictionaryModel>>(false,
                localizationService.GetString("ErrorWhileObtainingSites"));
        }
    }

    public async Task<OperationDataResult<List<SiteModel>>> Index()
    {
        try
        {
            var core = await coreHelper.GetCore();
            await using var dbContext = core.DbContextHelper.GetDbContext();
            var sites = await dbContext.Sites
                .AsNoTracking()
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Select(x => new SiteModel
                {
                    Id = x.Id,
                    SiteName = x.Name,
                    CreatedAt = x.CreatedAt,
                    SiteUId = (int) x.MicrotingUid,
                    UpdatedAt = x.UpdatedAt,
                    Units = x.Units.Where(z => z.SiteId == x.Id).Select(t => new UnitModel
                    {
                        Id = t.Id,
                        CreatedAt = t.CreatedAt,
                        UpdatedAt = t.UpdatedAt,
                        SiteId = (int)t.SiteId,
                        MicrotingUid = (int)t.MicrotingUid
                    }).ToList(),
                    Tags = x.SiteTags
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(y => y.Tag.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(t => (int)t.TagId).ToList(),
                    IsLocked = x.IsLocked
                }).ToListAsync();

            return new OperationDataResult<List<SiteModel>>(true, sites);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<List<SiteModel>>(false,
                localizationService.GetString("ErrorWhileObtainingSites"));
        }
    }

    public async Task<OperationDataResult<SiteModel>> Read(int id)
    {
        try
        {
            var core = await coreHelper.GetCore();
            await using var sdkDbContext = core.DbContextHelper.GetDbContext();
            var site = await sdkDbContext.Sites
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.Id == id)
                .Select(x => new SiteModel
                {
                    Id = x.Id,
                    SiteName = x.Name,
                    CreatedAt = x.CreatedAt,
                    SiteUId = (int) x.MicrotingUid,
                    UpdatedAt = x.UpdatedAt,
                    Tags = x.SiteTags
                        .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(y => y.Tag.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(t => (int)t.TagId).ToList()
                }).FirstOrDefaultAsync();

            if (site == null)
            {
                return new OperationDataResult<SiteModel>(
                    false,
                    localizationService.GetStringWithFormat("SiteParamNotFound", id));
            }

            return new OperationDataResult<SiteModel>(true, site);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<SiteModel>(false,
                localizationService.GetString("ErrorWhileObtainingSites"));
        }
    }

    public async Task<OperationResult> Update(SiteUpdateModel updateModel)
    {
        try
        {
            var core = await coreHelper.GetCore();
            await using var dbContext = core.DbContextHelper.GetDbContext();
            var site = await dbContext.Sites
                .Include(x => x.SiteTags)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.Id == updateModel.Id)
                .FirstOrDefaultAsync();

            if (site == null)
            {
                return new OperationResult(
                    false,
                    localizationService.GetStringWithFormat("SiteParamNotFound", updateModel.Id));
            }

            var language = await dbContext.Languages.SingleAsync(x => x.Id ==
                                                                      (site.LanguageId == 0 ? 1 : site.LanguageId));

            await core.Advanced_SiteItemUpdate((int)site.MicrotingUid, updateModel.SiteName, language.LanguageCode);


            // Tags
            var siteTagIds = site.SiteTags
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.TagId != null)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Select(x => (int)x.TagId)
                .ToList();

            var forRemove = siteTagIds
                .Where(x => !updateModel.Tags.Contains(x))
                .ToList();

            foreach (var tagIdForRemove in forRemove)
            {
                var siteTag = await dbContext.SiteTags
                    .Where(x => x.TagId == tagIdForRemove)
                    .Where(x => x.SiteId == site.Id)
                    .FirstOrDefaultAsync();

                if (siteTag != null)
                {
                    await siteTag.Delete(dbContext);
                }
            }

            var forCreate = updateModel.Tags
                .Where(x => !siteTagIds.Contains(x))
                .ToList();

            foreach (var tagIdForCreate in forCreate)
            {
                var siteTag = new SiteTag
                {
                    TagId = tagIdForCreate,
                    SiteId = site.Id
                };

                await siteTag.Create(dbContext);
            }

            return new OperationResult(true);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetStringWithFormat("SiteParamCouldNotBeUpdated", updateModel.Id));
        }
    }

    public async Task<OperationResult> Delete(int id)
    {
        try
        {
            var core = await coreHelper.GetCore();
            await using var dbContext = core.DbContextHelper.GetDbContext();
            var site = await dbContext.Sites
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

            if (site?.MicrotingUid == null)
            {
                return new OperationResult(false,
                    localizationService.GetStringWithFormat("SiteParamNotFound", id));
            }

            return await core.Advanced_SiteItemDelete((int)site.MicrotingUid)
                ? new OperationResult(true,
                    localizationService.GetStringWithFormat("SiteParamDeletedSuccessfully", site.Name))
                : new OperationResult(false,
                    localizationService.GetStringWithFormat("SiteParamCouldNotBeDeleted", site.Name));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetStringWithFormat("SiteParamCouldNotBeDeleted", id));
        }
    }
}