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

using Microting.eForm.Infrastructure.Data.Entities;

namespace ItemsPlanning.Pn.Services.ItemsPlanningReportService
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using Infrastructure.Models.Report;
    using ItemsPlanningLocalizationService;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Application.CasePosts;
    using Microting.ItemsPlanningBase.Infrastructure.Data;
    using WordService;

    public class ItemsPlanningReportService : IItemsPlanningReportService
    {
        private readonly ILogger<ItemsPlanningReportService> _logger;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly IWordService _wordService;
        private readonly IEFormCoreService _coreHelper;
        private readonly ICasePostBaseService _casePostBaseService;
        private readonly ItemsPlanningPnDbContext _dbContext;
        private readonly IUserService _userService;

        // ReSharper disable once SuggestBaseTypeForParameter
        public ItemsPlanningReportService(
            IItemsPlanningLocalizationService itemsPlanningLocalizationService,
            ILogger<ItemsPlanningReportService> logger,
            IEFormCoreService coreHelper,
            IWordService wordService,
            ICasePostBaseService casePostBaseService,
            ItemsPlanningPnDbContext dbContext,
            IUserService userService)
        {
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
            _logger = logger;
            _coreHelper = coreHelper;
            _wordService = wordService;
            _casePostBaseService = casePostBaseService;
            _dbContext = dbContext;
            _userService = userService;
        }

        public async Task<OperationDataResult<List<ReportEformModel>>> GenerateReport(GenerateReportModel model)
        {
            try
            {
                var timeZoneInfo = await _userService.GetCurrentUserTimeZoneInfo();
                var core = await _coreHelper.GetCore();
                await using var sdkDbContext = core.DbContextHelper.GetDbContext();
                //var casesQuery = microtingDbContext.cases
                //    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                //    .Include(x => x.Site)
                //    .AsQueryable();
                var fromDate = new DateTime(model.DateFrom.Value.Year, model.DateFrom.Value.Month,
                    model.DateFrom.Value.Day, 0, 0, 0);
                var toDate = new DateTime(model.DateTo.Value.Year, model.DateTo.Value.Month,
                    model.DateTo.Value.Day, 23, 59, 59);

                var planningCasesQuery = _dbContext.PlanningCases
                    .Include(x => x.Planning)
                    .ThenInclude(x => x.PlanningsTags)
                    .Where(x => x.Status == 100)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .AsQueryable();

                if (model.DateFrom != null)
                {
                    planningCasesQuery = planningCasesQuery.Where(x =>
                        x.MicrotingSdkCaseDoneAt >= fromDate);
                }

                if (model.DateTo != null)
                {
                    planningCasesQuery = planningCasesQuery.Where(x =>
                        x.MicrotingSdkCaseDoneAt <= toDate);
                }

                if (model.TagIds.Count > 0)
                {
                    foreach (var tagId in model.TagIds)
                    {
                        planningCasesQuery = planningCasesQuery.Where(x =>
                            x.Planning.PlanningsTags.Any(y => y.PlanningTagId == tagId && y.WorkflowState != Constants.WorkflowStates.Removed));
                    }
                }
                var groupedCaseCheckListIds = planningCasesQuery.GroupBy(x => x.MicrotingSdkeFormId).Select(x => x.Key).ToList();

                List<CheckList> checkLists = new List<CheckList>();

                if (groupedCaseCheckListIds.Count > 0)
                {
                    checkLists = await sdkDbContext.CheckLists
                        .FromSqlRaw("SELECT * FROM CheckLists WHERE" +
                                    $" Id IN ({string.Join(",", groupedCaseCheckListIds)})" +
                                    "  ORDER BY ReportH1  * 1, ReportH2 * 1, ReportH3 * 1, ReportH4 * 1").ToListAsync();

                }

                var itemCases = await planningCasesQuery
                    .OrderBy(x => x.Planning.RelatedEFormName)
                    .ToListAsync();

                var groupedCases = itemCases
                    .GroupBy(x => x.MicrotingSdkeFormId)
                    .Select(x => new
                    {
                        templateId = x.Key,
                        cases = x.ToList(),
                    })
                    .ToList();


                var result = new List<ReportEformModel>();
                // Exclude field types: None, Picture, Audio, Movie, Signature, Show PDF, FieldGroup, SaveButton
                var excludedFieldTypes = new List<string>()
                {
                    Constants.FieldTypes.None,
                    Constants.FieldTypes.Picture,
                    Constants.FieldTypes.Audio,
                    Constants.FieldTypes.Movie,
                    Constants.FieldTypes.Signature,
                    Constants.FieldTypes.ShowPdf,
                    Constants.FieldTypes.FieldGroup,
                    Constants.FieldTypes.SaveButton
                };
                var localeString = await _userService.GetCurrentUserLocale();
                var language = sdkDbContext.Languages.Single(x => string.Equals(x.LanguageCode, localeString, StringComparison.CurrentCultureIgnoreCase));
                //foreach (var groupedCase in groupedCases)
                foreach (var checkList in checkLists)
                {
                    var checkListTranslation = sdkDbContext.CheckListTranslations
                        .Where(x => x.CheckListId == checkList.Id)
                        .First(x => x.LanguageId == language.Id).Text;
                    //var template = await sdkDbContext.CheckLists.SingleAsync(x => x.Id == groupedCase.templateId);
                    var groupedCase = groupedCases.SingleOrDefault(x => x.templateId == checkList.Id);

                    if (groupedCase != null)
                    {

                        var reportModel = new ReportEformModel
                        {
                            TemplateName = checkList.Label,
                            FromDate = $"{fromDate:yyyy-MM-dd}",
                            ToDate = $"{toDate:yyyy-MM-dd}",
                            TextHeaders = new ReportEformTextHeaderModel(),
                            TableName = checkListTranslation,
                        };
                        // first pass
                        if (result.Count <= 0)
                        {
                            if (checkList.ReportH1 != null)
                            {
                                reportModel.TextHeaders.Header1 = checkList.ReportH1;
                            }
                            else
                            {
                                reportModel.TextHeaders.Header1 = checkListTranslation;
                                reportModel.TableName = null;
                                reportModel.TemplateName = null;
                            }
                            reportModel.TextHeaders.Header2 = checkList.ReportH2;
                            reportModel.TextHeaders.Header3 = checkList.ReportH3;
                            reportModel.TextHeaders.Header4 = checkList.ReportH4;
                            reportModel.TextHeaders.Header5 = checkList.ReportH5;
                        }
                        else // other pass
                        {
                            var header1 = result.LastOrDefault(x => x.TextHeaders.Header1 != null)?.TextHeaders.Header1;
                            var header2 = result.LastOrDefault(x => x.TextHeaders.Header2 != null)?.TextHeaders.Header2;
                            var header3 = result.LastOrDefault(x => x.TextHeaders.Header3 != null)?.TextHeaders.Header3;
                            var header4 = result.LastOrDefault(x => x.TextHeaders.Header4 != null)?.TextHeaders.Header4;
                            var header5 = result.LastOrDefault(x => x.TextHeaders.Header5 != null)?.TextHeaders.Header5;

                            // if not find or finded and templateHeader not equal

                            if (header1 == null || checkList.ReportH1 != header1)
                            {
                                reportModel.TextHeaders.Header1 = checkList.ReportH1 ?? "";
                            }

                            if (header2 == null || checkList.ReportH2 != header2)
                            {
                                reportModel.TextHeaders.Header2 = checkList.ReportH2 ?? "";
                            }

                            if (header3 == null || checkList.ReportH3 != header3)
                            {
                                reportModel.TextHeaders.Header3 = checkList.ReportH3 ?? "";
                            }

                            if (header4 == null || checkList.ReportH4 != header4)
                            {
                                reportModel.TextHeaders.Header4 = checkList.ReportH4 ?? "";
                            }

                            if (header5 == null || checkList.ReportH5 != header5)
                            {
                                reportModel.TextHeaders.Header5 = checkList.ReportH5 ?? "";
                            }

                        }

                        var fields = await core.Advanced_TemplateFieldReadAll(
                            checkList.Id, language);

                        foreach (var fieldDto in fields)
                        {
                            if (fieldDto.FieldType == Constants.FieldTypes.None)
                            {
                                var fieldTranslation =
                                    await sdkDbContext.FieldTranslations.FirstAsync(x =>
                                        x.FieldId == fieldDto.Id && x.LanguageId == language.Id);
                                reportModel.DescriptionBlocks.Add(fieldTranslation.Description);
                            }
                            if (!excludedFieldTypes.Contains(fieldDto.FieldType))
                            {
                                var fieldTranslation =
                                    await sdkDbContext.FieldTranslations.FirstAsync(x =>
                                        x.FieldId == fieldDto.Id && x.LanguageId == language.Id);
                                var kvp = new KeyValuePair<int, string>(fieldDto.Id, fieldTranslation.Text);

                                reportModel.ItemHeaders.Add(kvp);
                            }
                        }

                        // images
                        var templateCaseIds = groupedCase.cases.Select(x => (int?)x.MicrotingSdkCaseId).ToArray();
                        var imagesForEform = await sdkDbContext.FieldValues
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.Field.FieldTypeId == 5)
                            .Where(x => templateCaseIds.Contains(x.CaseId))
                            .OrderBy(x => x.CaseId)
                            .ToListAsync();

                        foreach (var imageField in imagesForEform)
                        {
                            if (imageField.UploadedDataId != null)
                            {
                                var planningCase = groupedCase.cases.Single(x => x.MicrotingSdkCaseId == imageField.CaseId);
                                if (planningCase.PlanningId != 0)
                                {
                                    var planningNameTranslation =
                                        await _dbContext.PlanningNameTranslation.SingleOrDefaultAsync(x =>
                                            x.PlanningId == planningCase.PlanningId && x.LanguageId == language.Id);

                                    if (planningNameTranslation != null)
                                    {
                                        var label = $"{imageField.CaseId}; {planningNameTranslation.Name}";
                                        var geoTag = "";
                                        if (!string.IsNullOrEmpty((imageField.Latitude)))
                                        {
                                            geoTag =
                                                $"https://www.google.com/maps/place/{imageField.Latitude},{imageField.Longitude}";
                                        }

                                        var keyList = new List<string> {imageField.CaseId.ToString(), label};
                                        var list = new List<string>();
                                        var uploadedData =
                                            await sdkDbContext.UploadedDatas.SingleAsync(x => x.Id == imageField.UploadedDataId);
                                        list.Add(uploadedData.FileName);
                                        list.Add(geoTag);
                                        reportModel.ImageNames.Add(new KeyValuePair<List<string>, List<string>>(keyList, list));
                                    }
                                }
                            }
                        }

                        // posts
                        var casePostRequest = new CasePostsRequestCommonModel
                        {
                            Offset = 0,
                            PageSize = int.MaxValue,
                            TemplateId = checkList.Id,
                        };

                        var casePostListResult = await _casePostBaseService.GetCommonPosts(casePostRequest);

                        if (!casePostListResult.Success)
                        {
                            return new OperationDataResult<List<ReportEformModel>>(
                                false,
                                casePostListResult.Message);
                        }

                        foreach (var casePostCommonModel in casePostListResult.Model.Entities)
                        {
                            reportModel.Posts.Add(new ReportEformPostModel
                            {
                                CaseId = casePostCommonModel.CaseId,
                                PostId = casePostCommonModel.PostId,
                                Comment = casePostCommonModel.Text,
                                SentTo = casePostCommonModel.ToRecipients,
                                SentToTags = casePostCommonModel.ToRecipientsTags,
                                PostDate = casePostCommonModel.PostDate
                            });
                        }

                        // add cases
                        foreach (var planningCase in groupedCase.cases.OrderBy(x => x.MicrotingSdkCaseDoneAt))
                        {
                            var planningNameTranslation =
                                await _dbContext.PlanningNameTranslation.SingleOrDefaultAsync(x =>
                                    x.PlanningId == planningCase.PlanningId && x.LanguageId == language.Id);
                            if (planningNameTranslation != null)
                            {
                                var item = new ReportEformItemModel
                                {
                                    Id = planningCase.Id,
                                    MicrotingSdkCaseId = planningCase.MicrotingSdkCaseId,
                                    MicrotingSdkCaseDoneAt = TimeZoneInfo.ConvertTimeFromUtc((DateTime)planningCase.MicrotingSdkCaseDoneAt, timeZoneInfo),
                                    eFormId = planningCase.MicrotingSdkeFormId,
                                    DoneBy = planningCase.DoneByUserName,
                                    ItemName = planningNameTranslation.Name,
                                    ItemDescription = planningCase.Planning.Description,
                                };


                                var caseFields = await core.Advanced_FieldValueReadList(
                                    new List<int>()
                                    {
                                        planningCase.MicrotingSdkCaseId
                                    }, language);

                                foreach (var itemHeader in reportModel.ItemHeaders)
                                {
                                    var caseField = caseFields
                                        .FirstOrDefault(x => x.FieldId == itemHeader.Key);

                                    if (caseField != null)
                                    {
                                        switch (caseField.FieldType)
                                        {
                                            case Constants.FieldTypes.MultiSelect:
                                                item.CaseFields.Add(caseField.ValueReadable.Replace("|", "<br>"));
                                                break;
                                            case Constants.FieldTypes.EntitySearch:
                                            case Constants.FieldTypes.EntitySelect:
                                            case Constants.FieldTypes.SingleSelect:
                                                item.CaseFields.Add(caseField.ValueReadable);
                                                break;
                                            default:
                                                item.CaseFields.Add(caseField.Value);
                                                break;
                                        }
                                    }
                                }

                                item.ImagesCount = await sdkDbContext.FieldValues
                                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                                    .Where(x => x.Field.FieldTypeId == 5)
                                    .Where(x => x.CaseId == planningCase.MicrotingSdkCaseId)
                                    .Select(x => x.Id)
                                    .CountAsync();

                                item.PostsCount = casePostListResult.Model.Entities
                                    .Where(x => x.CaseId == planningCase.MicrotingSdkCaseId)
                                    .Select(x => x.PostId)
                                    .Count();

                                reportModel.Items.Add(item);
                            }
                        }

                        result.Add(reportModel);
                    }
                }

                if (result.Count > 0)
                {
                    return new OperationDataResult<List<ReportEformModel>>(true, result);
                }

                return new OperationDataResult<List<ReportEformModel>>(false, _itemsPlanningLocalizationService.GetString("NoDataInSelectedPeriod"));

            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<List<ReportEformModel>>(false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileGeneratingReport"));
            }
        }

        public async Task<OperationDataResult<Stream>> GenerateReportFile(GenerateReportModel model)
        {
            try
            {
                var reportDataResult = await GenerateReport(model);
                if (!reportDataResult.Success)
                {
                    return new OperationDataResult<Stream>(false, reportDataResult.Message);
                }

                var wordDataResult = await _wordService
                    .GenerateWordDashboard(reportDataResult.Model);

                if (!wordDataResult.Success)
                {
                    return new OperationDataResult<Stream>(false, wordDataResult.Message);
                }

                return new OperationDataResult<Stream>(true, wordDataResult.Model);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<Stream>(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileGeneratingReportFile"));
            }
        }
    }
}