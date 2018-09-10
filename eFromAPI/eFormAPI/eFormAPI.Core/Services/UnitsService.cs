using System;
using System.Collections.Generic;
using eFormAPI.Common.Infrastructure;
using eFormAPI.Common.Infrastructure.Helpers;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormShared;

namespace eFormAPI.Core.Services
{
    public interface IUnitsService
    {
        OperationDataResult<List<Unit_Dto>> Index();
        OperationDataResult<Unit_Dto> RequestOtp(int id);
    }

    public class UnitsService : IUnitsService
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

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
