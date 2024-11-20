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

using Microting.eForm.Infrastructure.Data.Entities;
using Sentry;

namespace eFormAPI.Web.Services;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Abstractions;
using Microting.eFormApi.BasePn.Abstractions;
using Abstractions.Eforms;
using Infrastructure.Models.ReportEformCase;
using System.Diagnostics;
using System.IO;
using Microsoft.Extensions.Logging;
using Infrastructure.Models;

public class EformCaseReportService(
    IEFormCoreService coreHelper,
    IUserService userService,
    ILocalizationService localizationService,
    ILogger<EformCaseReportService> logger,
    IWordService wordService)
    : IEformCaseReportService
{
    //private readonly BaseDbContext _dbContext;
    //private readonly ICasePostBaseService _casePostBaseService;

    //ICasePostBaseService casePostBaseService,
    //BaseDbContext dbContext,
    //_dbContext = dbContext;
    //_casePostBaseService = casePostBaseService;

    public async Task<OperationDataResult<EFormCasesReportModel>> GetReportEformCases(
        EFormCaseReportRequest eFormCaseReportRequest)
    {
        var core = await coreHelper.GetCore();
        var language = await userService.GetCurrentUserLanguage();
        var sdkDbContext = core.DbContextHelper.GetDbContext();
        var timeZoneInfo = await userService.GetCurrentUserTimeZoneInfo();
        var template = await core.TemplateItemRead(eFormCaseReportRequest.TemplateId, language);
        if (template == null)
        {
            return new OperationDataResult<EFormCasesReportModel>(false,
                localizationService.GetString("TemplateNotFound"));
        }

        var casesQueryable = sdkDbContext.Cases
            .Include(x => x.Worker)
            .Where(x => x.DoneAt != null)
            .OrderBy(x => x.DoneAt)
            .Where(x => x.CheckListId == template.Id)
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed);

        if (DateTime.TryParse(eFormCaseReportRequest.DateFrom, out var dateFrom))
        {
            casesQueryable = casesQueryable.Where(x => x.DoneAt >= dateFrom);
        }

        if (DateTime.TryParse(eFormCaseReportRequest.DateTo, out var dateTo))
        {
            dateTo = dateTo.AddHours(23).AddMinutes(59).AddSeconds(59);
            casesQueryable = casesQueryable.Where(x => x.DoneAt <= dateTo);
        }

        if (!casesQueryable.Any()) // if count <= 0
        {
            return new OperationDataResult<EFormCasesReportModel>(false,
                localizationService.GetString("CasesNotFound"));
        }

        var cases = casesQueryable.ToList();

        var casesIds = cases.Select(x => x.Id).ToList();

        // Exclude field types: None, Picture, Audio, Movie, Signature, Show PDF, FieldGroup, SaveButton
        var excludedFieldTypeIds = new List<string>()
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

        var templateName = sdkDbContext.CheckListTranslations
            .Single(x => x.CheckListId == template.Id && x.LanguageId == language.Id).Text;
        var result = new EFormCasesReportModel()
        {
            TemplateName = templateName,
            TextHeaders = new EformReportHeaders()
            {
                Header1 = template.ReportH1 ?? templateName,
                Header2 = template.ReportH2 == template.ReportH1 ? null : template.ReportH2,
                Header3 = template.ReportH3 == template.ReportH2 ? null : template.ReportH3,
                Header4 = template.ReportH4 == template.ReportH3 ? null : template.ReportH4,
                Header5 = template.ReportH5 == template.ReportH4 ? null : template.ReportH5
            },
            DescriptionBlocks = new List<string>(),
            Items = new List<ReportEformCaseModel>(),
            ImageNames = new List<KeyValuePair<List<string>, List<string>>>(),
            ItemHeaders = new List<KeyValuePair<int, string>>(),
            FromDate = dateFrom,
            ToDate = dateTo
        };

        var fields = await core.Advanced_TemplateFieldReadAll(template.Id, language);

        foreach (var fieldDto in fields)
        {
            if (fieldDto.FieldType == Constants.FieldTypes.None)
            {
                result.DescriptionBlocks.Add(fieldDto.Label);
            }

            if (!excludedFieldTypeIds.Contains(fieldDto.FieldType))
            {
                var kvp = new KeyValuePair<int, string>(fieldDto.Id, fieldDto.Label);

                result.ItemHeaders.Add(kvp);
            }
        }

        var imagesForEform = await sdkDbContext.FieldValues
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.Field.FieldTypeId == 5)
            .Where(x => casesIds.Contains((int) x.CaseId))
            .OrderBy(x => x.CaseId)
            .ToListAsync();

        foreach (var imageField in imagesForEform)
        {
            if (imageField.UploadedDataId != null)
            {
                var singleCase = cases.Single(x => x.Id == imageField.CaseId);
                if (singleCase.DoneAt != null)
                {
                    var doneAt = (DateTime) singleCase.DoneAt;
                    doneAt = TimeZoneInfo.ConvertTimeFromUtc(doneAt, timeZoneInfo);
                    var label = $"{imageField.CaseId} - {doneAt:yyyy-MM-dd HH:mm:ss};";
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
                    if (!string.IsNullOrEmpty(uploadedData.FileName))
                    {
                        list.Add(uploadedData.FileName);
                        list.Add(geoTag);
                        result.ImageNames.Add(new KeyValuePair<List<string>, List<string>>(keyList, list));
                    }
                }
            }
        }

        // add cases
        foreach (var caseDto in cases)
        {
            var reportEformCaseModel = new ReportEformCaseModel
            {
                Id = caseDto.Id,
                MicrotingSdkCaseId = caseDto.Id,
                MicrotingSdkCaseDoneAt = TimeZoneInfo.ConvertTimeFromUtc((DateTime) caseDto.DoneAt, timeZoneInfo),
                EFormId = caseDto.CheckListId,
                DoneBy = $"{caseDto.Worker.FirstName} {caseDto.Worker.LastName}"
            };

            var fieldValues = sdkDbContext.FieldValues
                .Where(x => x.CaseId == caseDto.Id)
                .Include(x => x.Field)
                .Include(x => x.Field.FieldType)
                .Include(x => x.Field.FieldOptions)
                .AsNoTracking()
                .ToList();


            foreach (var itemHeader in result.ItemHeaders)
            {
                var caseField = fieldValues
                    .FirstOrDefault(x => x.FieldId == itemHeader.Key);

                if (caseField != null)
                {
                    switch (caseField.Field.FieldType.Type)
                    {
                        case Constants.FieldTypes.MultiSelect:
                        {
                            string readableValue = "";
                            foreach (string s in caseField.Value.Split("|"))
                            {
                                FieldOption fieldOption = caseField.Field.FieldOptions.Single(x => x.Key == s);
                                FieldOptionTranslation fieldOptionTranslation =
                                    await sdkDbContext.FieldOptionTranslations.SingleAsync(x =>
                                        x.FieldOptionId == fieldOption.Id && x.LanguageId == language.Id);
                                if (!string.IsNullOrEmpty(readableValue))
                                {
                                    readableValue += "<br>";
                                }

                                readableValue += fieldOptionTranslation.Text;
                            }

                            reportEformCaseModel.CaseFields.Add(readableValue);
                            break;
                        }

                        case Constants.FieldTypes.EntitySearch:
                        case Constants.FieldTypes.EntitySelect:
                        {
                            try
                            {
                                if (caseField.Value != "null")
                                {
                                    EntityItem entityItem =
                                        await sdkDbContext.EntityItems.AsNoTracking().SingleOrDefaultAsync(x => x.Id == int.Parse(caseField.Value));
                                    reportEformCaseModel.CaseFields.Add(entityItem.Name);
                                }
                                else
                                {
                                    reportEformCaseModel.CaseFields.Add("");
                                }
                            }
                            catch (Exception exception)
                            {
                                Console.WriteLine(exception.Message);
                            }

                            break;
                        }
                        case Constants.FieldTypes.SingleSelect:
                        {
                            FieldOption fieldOption =
                                caseField.Field.FieldOptions.SingleOrDefault(x => x.Key == caseField.Value);
                            if (fieldOption != null)
                            {
                                FieldOptionTranslation fieldOptionTranslation =
                                    await sdkDbContext.FieldOptionTranslations.SingleAsync(x =>
                                        x.FieldOptionId == fieldOption.Id && x.LanguageId == language.Id);
                                reportEformCaseModel.CaseFields.Add(fieldOptionTranslation.Text);
                            }
                            else
                            {
                                reportEformCaseModel.CaseFields.Add("");
                            }
                            break;
                        }
                        default:
                            reportEformCaseModel.CaseFields.Add(caseField.Value);
                            break;
                    }
                }
            }

            reportEformCaseModel.ImagesCount = await sdkDbContext.FieldValues
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.Field.FieldTypeId == 5)
                .Where(x => x.CaseId == caseDto.Id)
                .Select(x => x.Id)
                .CountAsync();

            result.Items.Add(reportEformCaseModel);
        }

        return new OperationDataResult<EFormCasesReportModel>(true, result);
    }

    public async Task<OperationDataResult<Stream>> GenerateReportFile(EFormCaseReportRequest model)
    {
        try
        {
            var reportDataResult = await GetReportEformCases(model);
            if (!reportDataResult.Success)
            {
                return new OperationDataResult<Stream>(false, reportDataResult.Message);
            }

            var wordDataResult = await wordService
                .GenerateWordDashboard(reportDataResult.Model);

            if (!wordDataResult.Success)
            {
                return new OperationDataResult<Stream>(false, wordDataResult.Message);
            }

            return new OperationDataResult<Stream>(true, wordDataResult.Model);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<Stream>(
                false,
                localizationService.GetString("ErrorWhileGeneratingReportFile"));
        }
    }

    public async Task<OperationResult> UpdateReportHeaders(EformDocxReportHeadersModel eformDocxReportHeadersModel)
    {

        var core = await coreHelper.GetCore();
        var sdkDbContext = core.DbContextHelper.GetDbContext();
        var template = await sdkDbContext.CheckLists.Where(x => x.Id == eformDocxReportHeadersModel.TemplateId)
            .FirstOrDefaultAsync();
        if (template == null)
        {
            return new OperationResult(false, localizationService.GetString("TemplateNotFound"));
        }

        if (!string.IsNullOrEmpty(eformDocxReportHeadersModel.H1))
        {
            template.ReportH1 = eformDocxReportHeadersModel.H1.Trim(); // delete whitespaces in start & end string
        }

        if (!string.IsNullOrEmpty(eformDocxReportHeadersModel.H2))
        {
            template.ReportH2 = eformDocxReportHeadersModel.H2.Trim();
        }

        if (!string.IsNullOrEmpty(eformDocxReportHeadersModel.H3))
        {
            template.ReportH3 = eformDocxReportHeadersModel.H3.Trim();
        }

        if (!string.IsNullOrEmpty(eformDocxReportHeadersModel.H4))
        {
            template.ReportH4 = eformDocxReportHeadersModel.H4.Trim();
        }

        if (!string.IsNullOrEmpty(eformDocxReportHeadersModel.H5))
        {
            template.ReportH5 = eformDocxReportHeadersModel.H5.Trim();
        }

        await template.Update(sdkDbContext);

        return new OperationResult(true);
    }

    public async Task<OperationDataResult<EformDocxReportHeadersModel>> GetReportHeadersByTemplateId(int templateId)
    {
        var core = await coreHelper.GetCore();
        var language = await userService.GetCurrentUserLanguage();
        var template = await core.TemplateItemRead(templateId, language);
        if (template == null)
        {
            return new OperationDataResult<EformDocxReportHeadersModel>(false, localizationService.GetString("TemplateNotFound"));
        }

        return new OperationDataResult<EformDocxReportHeadersModel>(true,
            new EformDocxReportHeadersModel
            {
                H1 = template.ReportH1,
                H2 = template.ReportH2,
                H3 = template.ReportH3,
                H4 = template.ReportH4,
                H5 = template.ReportH5,
                TemplateId = template.Id
            });
    }
}