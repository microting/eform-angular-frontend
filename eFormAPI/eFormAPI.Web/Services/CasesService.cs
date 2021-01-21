/*
The MIT License (MIT)

Copyright (c) 2007 - 2020 Microting A/S

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
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormAPI.Web.Infrastructure.Models.Cases.Request;
using eFormAPI.Web.Infrastructure.Models.Cases.Response;
using Microsoft.AspNetCore.Http;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eForm.Infrastructure.Models;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Delegates.CaseUpdate;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;

namespace eFormAPI.Web.Services
{
    public class CasesService : ICasesService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;
        private readonly BaseDbContext _dbContext;
        private readonly IUserService _userService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CasesService(IEFormCoreService coreHelper,
            IUserService userService,
            ILocalizationService localizationService, BaseDbContext dbContext,
            IHttpContextAccessor httpContextAccessor)
        {
            _coreHelper = coreHelper;
            _dbContext = dbContext;
            _userService = userService;
            _localizationService = localizationService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<OperationDataResult<CaseListModel>> Index(CaseRequestModel requestModel)
        {
            try
            {
                var value = _httpContextAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                var timeZone = _dbContext.Users.Single(x => x.Id == int.Parse(value)).TimeZone;
                if (string.IsNullOrEmpty(timeZone))
                {
                    timeZone = "Europe/Copenhagen";
                }

                TimeZoneInfo timeZoneInfo;

                try
                {
                    timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
                }
                catch
                {
                    timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("E. Europe Standard Time");
                }
                var core = await _coreHelper.GetCore();
                var caseList = await core.CaseReadAll(requestModel.TemplateId, null, null,
                    Constants.WorkflowStates.NotRemoved, requestModel.NameFilter,
                    requestModel.IsSortDsc, requestModel.Sort, requestModel.PageIndex, requestModel.PageSize, timeZoneInfo);
                var model = new CaseListModel()
                {
                    NumOfElements = caseList.NumOfElements,
                    PageNum = caseList.PageNum,
                    Cases = caseList.Cases
                };

                return new OperationDataResult<CaseListModel>(true, model);
            }
            catch (Exception ex)
            {
                Log.LogException(ex.Message);
                Log.LogException(ex.StackTrace);
                return new OperationDataResult<CaseListModel>(false, _localizationService.GetString("CaseLoadingFailed") + $" Exception: {ex.Message}");
            }
        }

        public async Task<OperationDataResult<ReplyElement>> Read(int id)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var caseDto = await core.CaseReadByCaseId(id);
                var microtingUId = caseDto.MicrotingUId;
                var microtingCheckUId = caseDto.CheckUId;
                var locale = await _userService.GetCurrentUserLocale();
                Language language = core.DbContextHelper.GetDbContext().Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());
                var theCase = await core.CaseRead((int)microtingUId, (int)microtingCheckUId, language);
                theCase.Id = id;

                return !theCase.Equals(null)
                    ? new OperationDataResult<ReplyElement>(true, theCase)
                    : new OperationDataResult<ReplyElement>(false);
            }
            catch (Exception ex)
            {
                Log.LogException(ex.Message);
                Log.LogException(ex.StackTrace);
                return new OperationDataResult<ReplyElement>(false, ex.Message);
            }
        }

        public async Task<OperationResult> Delete(int id)
        {
            try
            {
                var core = await _coreHelper.GetCore();

                return await core.CaseDeleteResult(id)
                    ? new OperationResult(true, _localizationService.GetStringWithFormat("CaseParamDeletedSuccessfully", id))
                    : new OperationResult(false, _localizationService.GetString("CaseCouldNotBeRemoved"));
            }
            catch (Exception ex)
            {
                Log.LogException(ex.Message);
                Log.LogException(ex.StackTrace);
                return new OperationResult(false, _localizationService.GetString("CaseCouldNotBeRemoved") + $" Exception: {ex.Message}");
            }
        }

        public async Task<OperationResult> Update(ReplyRequest model)
        {
            var checkListValueList = new List<string>();
            var fieldValueList = new List<string>();
            var core = await _coreHelper.GetCore();
            try
            {
                model.ElementList.ForEach(element =>
                {
                    checkListValueList.AddRange(CaseUpdateHelper.GetCheckList(element));
                    fieldValueList.AddRange(CaseUpdateHelper.GetFieldList(element));
                });
            }
            catch (Exception ex)
            {
                Log.LogException(ex.Message);
                Log.LogException(ex.StackTrace);
                return new OperationResult(false, _localizationService.GetString("CaseCouldNotBeUpdated") + $" Exception: {ex.Message}");
            }

            try
            {
                await core.CaseUpdate(model.Id, fieldValueList, checkListValueList);
                await core.CaseUpdateFieldValues(model.Id);

                if (CaseUpdateDelegates.CaseUpdateDelegate != null)
                {
                    var invocationList = CaseUpdateDelegates.CaseUpdateDelegate
                        .GetInvocationList();
                    foreach (var func in invocationList)
                    {
                        func.DynamicInvoke(model.Id);
                    }
                }

                return new OperationResult(true, _localizationService.GetString("CaseHasBeenUpdated"));
            }
            catch (Exception ex)
            {
                Log.LogException(ex.Message);
                Log.LogException(ex.StackTrace);
                return new OperationResult(false, _localizationService.GetString("CaseCouldNotBeUpdated") + $" Exception: {ex.Message}");
            }
        }
    }
}