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



namespace InsightDashboard.Pn.Services.AnswersService
{
    using System;
    using System.Linq;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure.Constants;
    using Common.InsightDashboardLocalizationService;
    using Microsoft.Extensions.Logging;
    using Microting.eFormApi.BasePn.Abstractions;
    using System.Threading.Tasks;
    using Infrastructure.Models.Answers;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using System.Diagnostics;
    using Infrastructure.Helpers;

    public class AnswersService : IAnswersService
    {
        private readonly ILogger<AnswersService> _logger;
        private readonly IInsightDashboardLocalizationService _localizationService;
        private readonly IEFormCoreService _coreHelper;

        public AnswersService(
            ILogger<AnswersService> logger,
            IInsightDashboardLocalizationService localizationService,
            IEFormCoreService coreHelper)
        {
            _logger = logger;
            _localizationService = localizationService;
            _coreHelper = coreHelper;
        }

        public async Task<OperationDataResult<AnswerViewModel>> GetAnswerByMicrotingUid(int microtingUid)
        {
            try
            {
                    var core = await _coreHelper.GetCore();
                AnswerViewModel result;
                await using (var sdkContext = core.DbContextHelper.GetDbContext())
                {
                    var answersQueryable = AnswerHelper.GetAnswerQueryByMicrotingUid(microtingUid, sdkContext);

                    result = answersQueryable.FirstOrDefault();
                }

                if (result == null)
                {
                    return new OperationDataResult<AnswerViewModel>(
                        false,
                        _localizationService.GetString("AnswerNotFound"));
                }

                if (result.AnswerValues == null)
                {
                    return new OperationDataResult<AnswerViewModel>(
                        false,
                        _localizationService.GetString("AnswerValuesNotFound"));
                }

                return new OperationDataResult<AnswerViewModel>(true, result);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<AnswerViewModel>(false,
                    _localizationService.GetString("ErrorWhileObtainingGetAnswer"));
            }
        }

        public async Task<OperationResult> DeleteAnswerByMicrotingUid(int microtingUid)
        {
            try
            {
                var core = await _coreHelper.GetCore();

                using (var sdkContext = core.DbContextHelper.GetDbContext())
                {
                    var answer = await AnswerHelper.GetAnswerQueryByMicrotingUidForDelete(microtingUid, sdkContext)
                        .FirstOrDefaultAsync();

                    if (answer == null)
                    {
                        return new OperationResult(
                            false,
                            _localizationService.GetString("AnswerNotFound"));
                    }

                    var answersValues = await AnswerHelper.GetAnswerValuesQueryByAnswerIdForDelete(answer.Id, sdkContext)
                        .ToListAsync();

                    if (answer.WorkflowState == Constants.WorkflowStates.Removed)
                    {
                        return new OperationResult(
                            false,
                            _localizationService.GetString("AnswerRemoved"));
                    }

                    if (answersValues == null)
                    {
                        return new OperationResult(
                            false,
                            _localizationService.GetString("AnswerValuesNotFound"));
                    }

                    foreach (var answersValue in answersValues)
                    {
                        await answersValue.Delete(sdkContext);
                    }

                    await answer.Delete(sdkContext);

                    return new OperationResult(
                        true,
                        _localizationService.GetString("AnswerAndAnswerValuesHasBeenRemoved"));
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(
                    false,
                    _localizationService.GetString("ErrorWhileRemovingAnswerAndAnswerValues"));
            }
        }
    }
}
