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

using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Data.Entities;

namespace ItemsGroupPlanning.Pn.Services
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using Abstractions;
    using Castle.Core.Internal;
    using Infrastructure.Models;
    using Infrastructure.Models.Report;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Infrastructure.Models;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Data;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Data.Entities;

    public class ItemsPlanningReportService : IItemsPlanningReportService
    {
        private readonly ILogger<ItemsPlanningReportService> _logger;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly IExcelService _excelService;
        private readonly IUserService _userService;
        private readonly ItemsGroupPlanningPnDbContext _dbContext;
        private readonly IEFormCoreService _coreHelper;

        // ReSharper disable once SuggestBaseTypeForParameter
        public ItemsPlanningReportService(IItemsPlanningLocalizationService itemsPlanningLocalizationService,
            IUserService userService,
            ILogger<ItemsPlanningReportService> logger, IExcelService excelService, ItemsGroupPlanningPnDbContext dbContext,
            IEFormCoreService coreHelper)
        {
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
            _logger = logger;
            _userService = userService;
            _excelService = excelService;
            _dbContext = dbContext;
            _coreHelper = coreHelper;
        }

        public async Task<OperationDataResult<ReportModel>> GenerateReport(GenerateReportModel model)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                await using var dbContext = core.dbContextHelper.GetDbContext();

                var itemList = await _dbContext.ItemLists.FirstAsync(x => x.Id == model.ItemList);
                var item = await _dbContext.Items.FirstAsync(x => x.Id == model.Item);
                var locale = await _userService.GetCurrentUserLocale();
                Language language = dbContext.Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());
                var template = await core.ReadeForm(itemList.RelatedEFormId, language);

                var casesQuery = _dbContext.ItemCases.Where(x => x.ItemId == item.Id);

                if (model.DateFrom != null)
                {
                    casesQuery = casesQuery.Where(x =>
                        x.CreatedAt >= new DateTime(model.DateFrom.Value.Year, model.DateFrom.Value.Month, model.DateFrom.Value.Day, 0, 0, 0));
                }

                if (model.DateTo != null)
                {
                    casesQuery = casesQuery.Where(x =>
                        x.CreatedAt <= new DateTime(model.DateTo.Value.Year, model.DateTo.Value.Month, model.DateTo.Value.Day, 23, 59, 59));
                }

                var itemCases = await casesQuery.ToListAsync();

                var reportModel = await GetReportData(model, item, itemCases, template);

                return new OperationDataResult<ReportModel>(true, reportModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<ReportModel>(false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileGeneratingReport"));
            }
        }

        public async Task<OperationDataResult<FileStreamModel>> GenerateReportFile(GenerateReportModel model)
        {
            string excelFile = null;
            try
            {
                OperationDataResult<ReportModel> reportDataResult = await GenerateReport(model);
                if (!reportDataResult.Success)
                {
                    return new OperationDataResult<FileStreamModel>(false, reportDataResult.Message);
                }

                excelFile = _excelService.CopyTemplateForNewAccount("report_template");
                bool writeResult = _excelService.WriteRecordsExportModelsToExcelFile(
                    reportDataResult.Model,
                    model,
                    excelFile);

                if (!writeResult)
                {
                    throw new Exception($"Error while writing excel file {excelFile}");
                }

                FileStreamModel result = new FileStreamModel()
                {
                    FilePath = excelFile,
                    FileStream = new FileStream(excelFile, FileMode.Open),
                };

                return new OperationDataResult<FileStreamModel>(true, result);
            }
            catch (Exception e)
            {
                if (!string.IsNullOrEmpty(excelFile) && File.Exists(excelFile))
                {
                    File.Delete(excelFile);
                }

                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<FileStreamModel>(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileGeneratingReportFile"));
            }
        }

        private async Task<ReportModel> GetReportData(
            GenerateReportModel model,
            Item item,
            IEnumerable<ItemCase> itemCases,
            CoreElement template)
        {
            var core = await _coreHelper.GetCore();
            await using MicrotingDbContext microtingDbContext = core.dbContextHelper.GetDbContext();

            var finalModel = new ReportModel
            {
                Name = item.Name,
                Description = item.Description,
                DateFrom = model.DateFrom,
                DateTo = model.DateTo
            };

            // Go through template elements and get fields and options labels
            foreach (var element in template.ElementList)
            {
                if (!(element is DataElement dataElement))
                    continue;

                var dataItems = dataElement.DataItemList;

                foreach (var dataItem in dataItems)
                {
                    var reportFieldModel = new ReportFormFieldModel()
                    {
                        DataItemId = dataItem.Id,
                        Label = dataItem.Label
                    };

                    switch (dataItem)
                    {
                        case MultiSelect multiSelect:
                            // Add label for each option
                            reportFieldModel.Options = multiSelect.KeyValuePairList.Select(x => new ReportFormFieldOptionModel()
                            {
                                Key = x.Key,
                                Label = x.Value
                            }).ToList();
                            break;
                        case SingleSelect singleSelect:
                        case CheckBox checkBox:
                        case Number number:
                        case Text text:
                            // No option label needed for these types
                            reportFieldModel.Options.Add(new ReportFormFieldOptionModel()
                            {
                                Key = string.Empty,
                                Label = string.Empty
                            });
                            break;
                        default:
                            continue;
                    }

                    finalModel.FormFields.Add(reportFieldModel);
                }
            }

            // Get all answered cases
            TimeZoneInfo timeZoneInfo;

            try
            {
                timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("Europe/Copenhagen");
            }
            catch
            {
                timeZoneInfo = TimeZoneInfo.Local;
            }

            var casesList = core.CaseReadAll(template.Id, null, null, timeZoneInfo).Result
                .Where(c => itemCases.Select(ic => ic.MicrotingSdkCaseId).Contains(c.Id))
                .ToList();

            // Go through all itemCases

            foreach (var ic in itemCases)
            {
                finalModel.Ids.Add($"{ic.Id} / {ic.MicrotingSdkCaseId}");
                finalModel.Dates.Add(ic.CreatedAt);

                var @case = casesList.FirstOrDefault(c => c.Id == ic.MicrotingSdkCaseId);

                // Fill with empty values, if this itemCase was not replied
                if (@case == null)
                {
                    foreach (var fieldModel in finalModel.FormFields)
                    {
                        foreach (var optionModel in fieldModel.Options)
                        {
                            optionModel.Values.Add("");
                        }
                    }

                    finalModel.DatesDoneAt.Add(null);
                    finalModel.DoneBy.Add(null);

                    continue;
                }
                else
                {
                    finalModel.DoneBy.Add(@case.WorkerName);
                    finalModel.DatesDoneAt.Add(@case.DoneAt);
                }

                // Get the reply and work with its ElementList
                var locale = await _userService.GetCurrentUserLocale();
                Language language = core.dbContextHelper.GetDbContext().Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());

                foreach (var element in core.CaseRead((int)@case.MicrotingUId, (int)@case.CheckUIid, language).Result.ElementList)
                {
                    if (!(element is CheckListValue checkListValue))
                        continue;

                    // Get the values for each field from the reply
                    foreach (var fieldModel in finalModel.FormFields)
                    {
                        if (!(checkListValue.DataItemList.First(x => x.Id == fieldModel.DataItemId) is Field field))
                            continue;

                        // Fill values for field options
                        foreach (var optionModel in fieldModel.Options)
                        {
                            if (optionModel.Key.IsNullOrEmpty())
                            {
                                optionModel.Values.Add(field.FieldValues[0].ValueReadable);
                            }
                            else
                            {
                                var selectedKeys = field.FieldValues[0].Value.Split('|');

                                optionModel.Values.Add(
                                    selectedKeys.Contains(optionModel.Key)
                                        ? _itemsPlanningLocalizationService.GetString("Yes")
                                        : ""
                                );
                            }
                        }
                    }
                }
            }

            return finalModel;
        }
    }
}