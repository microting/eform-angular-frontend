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
using eFormAPI.Web.Infrastructure.Models.Templates;
using Microsoft.AspNetCore.Http;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
    public class TemplateColumnsService : ITemplateColumnsService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUserService _userService;
        private readonly BaseDbContext _dbContext;

        public TemplateColumnsService(ILocalizationService localizationService,
            IHttpContextAccessor httpContextAccessor,
            BaseDbContext dbContext,
            IUserService userService,
            IEFormCoreService coreHelper)
        {
            _localizationService = localizationService;
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
            _userService = userService;
            _coreHelper = coreHelper;
        }


        public async Task<OperationDataResult<List<TemplateColumnModel>>> GetAvailableColumns(int templateId)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var fields = await core.Advanced_TemplateFieldReadAll(templateId);
                var templateColumns = new List<TemplateColumnModel>();
                foreach (var field in fields)
                {
                    if (field.FieldType != "Picture"
                        && field.FieldType != "Audio"
                        && field.FieldType != "Movie"
                        && field.FieldType != "Signature"
                        && field.FieldType != "SaveButton")
                        templateColumns.Add(new TemplateColumnModel()
                        {
                            Id = field.Id,
                            Label = field.ParentName + " - " + field.Label
                        });
                }

                return new OperationDataResult<List<TemplateColumnModel>>(true, templateColumns);
            }
            catch (Exception)
            {
                return new OperationDataResult<List<TemplateColumnModel>>(false,
                    _localizationService.GetString("ErrorWhileObtainColumns"));
            }
        }


        public async Task<OperationDataResult<DisplayTemplateColumnsModel>> GetCurrentColumns(int templateId)
        {
            try
            {
                var core = await _coreHelper.GetCore();

                var value = _httpContextAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                var localeString = await _userService.GetUserLocale(int.Parse(value));
                Language language = core.dbContextHelper.GetDbContext().Languages.Single(x => x.LanguageCode.ToLower() == localeString.ToLower());
                var template = await core.TemplateItemRead(templateId, language);
                var model = new DisplayTemplateColumnsModel()
                {
                    TemplateId = template.Id,
                    FieldId1 = template.Field1?.Id,
                    FieldId2 = template.Field2?.Id,
                    FieldId3 = template.Field3?.Id,
                    FieldId4 = template.Field4?.Id,
                    FieldId5 = template.Field5?.Id,
                    FieldId6 = template.Field6?.Id,
                    FieldId7 = template.Field7?.Id,
                    FieldId8 = template.Field8?.Id,
                    FieldId9 = template.Field9?.Id,
                    FieldId10 = template.Field10?.Id
                };

                return new OperationDataResult<DisplayTemplateColumnsModel>(true, model);
            }
            catch (Exception)
            {
                return new OperationDataResult<DisplayTemplateColumnsModel>(false,
                    _localizationService.GetString("ErrorWhileObtainColumns"));
            }
        }

        public async Task<OperationResult> UpdateColumns(UpdateTemplateColumnsModel model)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var columnsList = new List<int?>
                {
                    model.FieldId1,
                    model.FieldId2,
                    model.FieldId3,
                    model.FieldId4,
                    model.FieldId5,
                    model.FieldId6,
                    model.FieldId7,
                    model.FieldId8,
                    model.FieldId9,
                    model.FieldId10
                };
                columnsList = columnsList.OrderBy(x => x == null).ToList();
                var columnsUpdateResult = await core.Advanced_TemplateUpdateFieldIdsForColumns(
                    (int) model.TemplateId,
                    columnsList[0], columnsList[1], columnsList[2], columnsList[3],
                    columnsList[4], columnsList[5], columnsList[6], columnsList[7],
                    columnsList[8], columnsList[9]);
                TimeZoneInfo timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("Europe/Copenhagen");

                var allCases = await core.CaseReadAll(model.TemplateId, null, null, timeZoneInfo);
                foreach (var caseObject in allCases)
                {
                    await core.CaseUpdateFieldValues(caseObject.Id);
                }

                return columnsUpdateResult
                    ? new OperationResult(true, _localizationService.GetString("ColumnsWereUpdated"))
                    : new OperationResult(false, _localizationService.GetString("ErrorWhileUpdatingColumns"));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("ErrorWhileUpdatingColumns"));
            }
        }
    }
}