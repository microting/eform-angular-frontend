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
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public class KeyValueModel
    {
        public int Key { get; set; }
        public string Value { get; set; }
    }

    public class SitesModel
    {
        public int Total { get; set; }

        public List<SiteModel> Entities { get; set; }
            = new List<SiteModel>();
    }

    public class SiteModel
    {
        public int Id { get; set; }
        public int SiteUId { get; set; }

        public string SiteName { get; set; }
            
        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public List<KeyValueModel> Tags { get; set; }
            = new List<KeyValueModel>();
    }


    public class SiteUpdateModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class SitesService : ISitesService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;

        public SitesService(IEFormCoreService coreHelper, 
           ILocalizationService localizationService)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
        }

        public async Task<OperationDataResult<SitesModel>> Index()
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
                            //       Tags = x.
                        }).ToListAsync();

                    var count = await dbContext.sites
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(x => x.Id)
                        .CountAsync();

                    var result = new SitesModel
                    {
                        Entities = sites,
                        Total = count,
                    };

                    return new OperationDataResult<SitesModel>(true, result);
                }
            }
            catch (Exception e)
            {
                return new OperationDataResult<SitesModel>(false,
                    _localizationService.GetString(""));
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
                            //       Tags = x.
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
                return new OperationDataResult<SiteModel>(false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> Update(SiteUpdateModel updateModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                using (var dbContext = core.dbContextHelper.GetDbContext())
                {
                    var site = await dbContext.sites
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.Id == updateModel.Id)
                        .FirstOrDefaultAsync();

                    if (site == null)
                    {
                        return new OperationResult(
                            false,
                            _localizationService.GetStringWithFormat("SiteParamNotFound", updateModel.Id));
                    }

                    site.Name = updateModel.Name;

                    await site.Update(dbContext);
                }

                return new OperationResult(
                    true,
                    _localizationService.GetString(""));
            }
            catch (Exception)
            {
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
                        return new OperationResult(false, _localizationService.GetStringWithFormat("SiteParamNotFound", id));
                    }

                    await site.Delete(dbContext);

                    return new OperationResult(true,
                        _localizationService.GetStringWithFormat("SiteParamDeletedSuccessfully", site.Name));
                }
            }
            catch (Exception)
            {
                return new OperationResult(false,
                    _localizationService.GetStringWithFormat("SiteParamCouldNotBeDeleted", id));
            }
        }
    }
}