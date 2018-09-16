using System;
using System.Collections.Generic;
using eFormAPI.Common.Infrastructure;
using eFormAPI.Common.Infrastructure.Helpers;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Core.Abstractions;
using eFormShared;

namespace eFormAPI.Core.Services
{
    public class UnitsService : IUnitsService
    {
        private readonly IEFormCoreService _coreHelper;

        public UnitsService(IEFormCoreService coreHelper)
        {
            _coreHelper = coreHelper;
        }

        public OperationDataResult<List<Unit_Dto>> Index()
        {
            var core = _coreHelper.GetCore();
            var unitsDto = core.Advanced_UnitReadAll();
            return new OperationDataResult<List<Unit_Dto>>(true, unitsDto);
        }
        
        public OperationDataResult<Unit_Dto> RequestOtp(int id)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var unitDto = core.Advanced_UnitRequestOtp(id);
                return new OperationDataResult<Unit_Dto>(true, LocaleHelper.GetString("NewOTPCreatedSuccessfully"), unitDto);
            }
            catch (Exception)
            {
                return new OperationDataResult<Unit_Dto>(false, LocaleHelper.GetString("UnitParamOTPCouldNotCompleted", id));
            }
        }
    }
}
