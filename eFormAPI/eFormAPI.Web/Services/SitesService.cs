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
using System;
using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Infrastructure.Models;
using eFormShared;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
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

        public OperationDataResult<List<SiteName_Dto>> Index()
        {
            var core = _coreHelper.GetCore();
            var siteNamesDto = core.Advanced_SiteItemReadAll(false);

            return new OperationDataResult<List<SiteName_Dto>>(true, siteNamesDto);
        }

        public OperationDataResult<SiteName_Dto> Edit(int id)
        {
            var core = _coreHelper.GetCore();
            var siteNameDto = core.Advanced_SiteItemRead(id);

            return !siteNameDto.Equals(null)
                ? new OperationDataResult<SiteName_Dto>(true, siteNameDto)
                : new OperationDataResult<SiteName_Dto>(false);
        }

        public OperationResult Update(SiteNameModel siteNameModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var siteNameDto = core.Advanced_SiteItemRead(siteNameModel.Id);

                if (!siteNameDto.Equals(null))
                {
                    core.Advanced_SiteItemUpdate(siteNameDto.SiteUId, siteNameModel.SiteName);
                    return new OperationResult(true);
                }

                return new OperationResult(false);
            }
            catch (Exception)
            {
                return new OperationResult(false,
                    _localizationService.GetStringWithFormat("SiteParamCouldNotBeUpdated", siteNameModel.Id));
            }
        }

        public OperationResult Delete(int id)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var siteDto = core.Advanced_SiteItemRead(id);

                if (siteDto.Equals(null))                    
                {
                    return new OperationResult(false, _localizationService.GetStringWithFormat("SiteParamNotFound", id));
                }

                return core.Advanced_SiteItemDelete(id)
                    ? new OperationResult(true,
                        _localizationService.GetStringWithFormat("SiteParamDeletedSuccessfully", siteDto.SiteName))
                    : new OperationResult(false,
                        _localizationService.GetStringWithFormat("SiteParamCouldNotBeDeleted", siteDto.SiteName));
            }

            catch (Exception)
            {
                return new OperationDataResult<SiteNameModel>(false,
                    _localizationService.GetStringWithFormat("SiteParamCouldNotBeDeleted", id));
            }
        }
    }
}