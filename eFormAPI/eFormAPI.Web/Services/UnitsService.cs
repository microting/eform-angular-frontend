using System;
using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormCore;
using eFormShared;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
    public class UnitsService : IUnitsService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;

        public UnitsService(ILocalizationService localizationService, IEFormCoreService coreHelper)
        {
            _localizationService = localizationService;
            _coreHelper = coreHelper;
        }


        public OperationDataResult<List<Unit_Dto>> Index()
        {
            Core core = _coreHelper.GetCore();
            List<Unit_Dto> unitsDto = core.Advanced_UnitReadAll();
            return new OperationDataResult<List<Unit_Dto>>(true, unitsDto);
        }

        public OperationDataResult<Unit_Dto> RequestOtp(int id)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                Unit_Dto unitDto = core.Advanced_UnitRequestOtp(id);
                return new OperationDataResult<Unit_Dto>(true, _localizationService.GetString("NewOTPCreatedSuccessfully"),
                    unitDto);
            }
            catch (Exception)
            {
                return new OperationDataResult<Unit_Dto>(false,
                    _localizationService.GetString("UnitParamOTPCouldNotCompleted", id));
            }
        }
    }
}