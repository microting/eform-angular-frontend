using System;
using System.Collections.Generic;
using AutoMapper;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Advanced;
using eFormShared;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models;
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
                    _localizationService.GetString("SiteParamCouldNotBeUpdated", siteNameModel.Id));
            }
        }

        public OperationResult Delete(int id)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var siteDto = core.Advanced_SiteItemRead(id);
                SiteNameModel siteNameModel;

                if (!siteDto.Equals(null))
                {
                    Mapper.Initialize(cfg => cfg.CreateMap<SiteName_Dto, SiteNameModel>());
                    siteNameModel =
                        Mapper.Map<SiteName_Dto, SiteNameModel>(siteDto);
                }
                else
                {
                    return new OperationResult(false, _localizationService.GetString("SiteParamNotFound", id));
                }

                return core.Advanced_SiteItemDelete(id)
                    ? new OperationResult(true,
                        _localizationService.GetString("SiteParamDeletedSuccessfully", siteNameModel.SiteName))
                    : new OperationResult(false,
                        _localizationService.GetString("SiteParamCouldNotBeDeleted", siteNameModel.SiteName));
            }

            catch (Exception)
            {
                return new OperationDataResult<SiteNameModel>(false,
                    _localizationService.GetString("SiteParamCouldNotBeDeleted", id));
            }
        }
    }
}