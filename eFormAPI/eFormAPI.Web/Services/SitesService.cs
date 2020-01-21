/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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
    using Infrastructure.Models;
    using Infrastructure.Models.Sites;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eForm.Infrastructure.Data.Entities;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public class SitesService : ISitesService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;
        private readonly ILogger<SitesService> _logger;

        public SitesService(IEFormCoreService coreHelper,
            ILocalizationService localizationService,
            ILogger<SitesService> logger)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
            _logger = logger;
        }

        public async Task<OperationDataResult<List<SiteModel>>> Index()
        {
            try
            {
                var core = await _coreHelper.GetCore();
                using (var dbContext = core.dbContextHelper.GetDbContext())
                {
                    var sites = await dbContext.sites
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(x => new SiteModel
                        {
                            Id = x.Id,
                            SiteName = x.Name,
                            CreatedAt = x.CreatedAt,
                            SiteUId = (int) x.MicrotingUid,
                            UpdatedAt = x.UpdatedAt,
                            Tags = x.SiteTags.Select(t => new KeyValueModel
                            {
                                Key = (int) t.TagId,
                                Value = t.Tag.Name,
                            }).ToList(),
                        }).ToListAsync();

                    return new OperationDataResult<List<SiteModel>>(true, sites);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationDataResult<List<SiteModel>>(false,
                    _localizationService.GetString("ErrorWhileObtainingSites"));
            }
        }

        public async Task<OperationDataResult<SiteModel>> Read(int id)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                using (var dbContext = core.dbContextHelper.GetDbContext())
                {
                    var site = await dbContext.sites
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.Id == id)
                        .Select(x => new SiteModel
                        {
                            Id = x.Id,
                            SiteName = x.Name,
                            CreatedAt = x.CreatedAt,
                            SiteUId = (int) x.MicrotingUid,
                            UpdatedAt = x.UpdatedAt,
                            Tags = x.SiteTags.Select(t => new KeyValueModel
                            {
                                Key = (int) t.TagId,
                                Value = t.Tag.Name,
                            }).ToList(),
                        }).FirstOrDefaultAsync();

                    if (site == null)
                    {
                        return new OperationDataResult<SiteModel>(
                            false,
                            _localizationService.GetStringWithFormat("SiteParamNotFound", id));
                    }

                    return new OperationDataResult<SiteModel>(true, site);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationDataResult<SiteModel>(false,
                    _localizationService.GetString("ErrorWhileObtainingSites"));
            }
        }

        public async Task<OperationResult> Update(SiteUpdateModel updateModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                using (var dbContext = core.dbContextHelper.GetDbContext())
                {
                    using (var transaction = await dbContext.Database.BeginTransactionAsync())
                    {
                        try
                        {
                            var site = await dbContext.sites
                                .Include(x => x.SiteTags)
                                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                .Where(x => x.Id == updateModel.Id)
                                .FirstOrDefaultAsync();

                            if (site == null)
                            {
                                transaction.Rollback();
                                return new OperationResult(
                                    false,
                                    _localizationService.GetStringWithFormat("SiteParamNotFound", updateModel.Id));
                            }

                            site.Name = updateModel.Name;

                            await site.Update(dbContext);

                            // Tags
                            var siteTagIds = site.SiteTags
                                .Where(x => x.TagId != null)
                                .Select(x => (int) x.TagId)
                                .ToList();

                            var forRemove = siteTagIds
                                .Where(x => !updateModel.TagIds.Contains(x))
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

                            var forCreate = updateModel.TagIds
                                .Where(x => !siteTagIds.Contains(x))
                                .ToList();

                            foreach (var tagIdForCreate in forCreate)
                            {
                                var siteTag = new site_tags()
                                {
                                    TagId = tagIdForCreate,
                                    SiteId = site.Id,
                                };

                                await siteTag.Create(dbContext);
                            }

                            transaction.Commit();
                        }
                        catch (Exception)
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }

                return new OperationResult(true);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationResult(false,
                    _localizationService.GetStringWithFormat("SiteParamCouldNotBeUpdated", updateModel.Id));
            }
        }

        public async Task<OperationResult> Delete(int id)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                using (var dbContext = core.dbContextHelper.GetDbContext())
                {
                    var site = await dbContext.sites
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.Id == id)
                        .FirstOrDefaultAsync();

                    if (site.Equals(null))
                    {
                        return new OperationResult(false,
                            _localizationService.GetStringWithFormat("SiteParamNotFound", id));
                    }

                    await site.Delete(dbContext);

                    return new OperationResult(true,
                        _localizationService.GetStringWithFormat("SiteParamDeletedSuccessfully", site.Name));
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationResult(false,
                    _localizationService.GetStringWithFormat("SiteParamCouldNotBeDeleted", id));
            }
        }
    }
}