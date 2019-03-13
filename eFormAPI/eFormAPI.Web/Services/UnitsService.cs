/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 microting

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
                return new OperationDataResult<Unit_Dto>(true, _localizationService.GetString("NewOTPCreatedSuccessfully"),
                    unitDto);
            }
            catch (Exception)
            {
                return new OperationDataResult<Unit_Dto>(false,
                    _localizationService.GetStringWithFormat("UnitParamOTPCouldNotCompleted", id));
            }
        }
    }
}