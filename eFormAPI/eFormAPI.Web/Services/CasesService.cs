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

using Microsoft.Extensions.Logging;
using Sentry;

namespace eFormAPI.Web.Services;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abstractions;
using Abstractions.Eforms;
using Infrastructure.Models.Cases.Request;
using Infrastructure.Models.Cases.Response;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Dto;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Models;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Delegates.CaseUpdate;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application.Case.CaseEdit;

public class CasesService(
    IEFormCoreService coreHelper,
    IUserService userService,
    ILocalizationService localizationService,
    ILogger<CasesService> logger)
    : ICasesService
{
    public async Task<OperationDataResult<CaseListModel>> Index(CaseRequestModel requestModel)
    {
        try
        {
            var core = await coreHelper.GetCore();
            var sdkDbContext = core.DbContextHelper.GetDbContext();

            // get base query
            var query = sdkDbContext.Cases.Join(sdkDbContext.Sites, c => c.SiteId, s => s.Id, (
                    (c, s) => new
                    {
                        c.Id,
                        c.DoneAt,
                        SiteName = s.Name,
                        SiteId = s.Id,
                        c.WorkflowState,
                        c.CheckListId,
                        c.FieldValue1,
                        c.FieldValue2,
                        c.FieldValue3,
                        c.FieldValue4,
                        c.FieldValue5,
                        c.FieldValue6,
                        c.FieldValue7,
                        c.FieldValue8,
                        c.FieldValue9,
                        c.FieldValue10,
                        c.Type,
                        c.Status,
                        c.IsArchived,
                        c.CaseUid,
                        c.MicrotingUid,
                        c.MicrotingCheckUid,
                        c.CreatedAt,
                        c.DoneAtUserModifiable,
                        c.Custom,
                        c.Version,
                        c.UpdatedAt,
                        c.UnitId
                    }))
                //.Include(x => x.Worker)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.DoneAtUserModifiable != null)
                .Where(x => x.CheckListId == requestModel.TemplateId);

            // add sort and filtering
            var nameFields = new List<string>
            {
                "FieldValue1", "FieldValue2", "FieldValue3", "FieldValue4", "FieldValue5", "FieldValue6", "FieldValue7",
                "FieldValue8", "FieldValue9", "FieldValue10", "Id", "DoneAt", "SiteName"
            };
            query = QueryHelper.AddFilterAndSortToQuery(query, requestModel, nameFields);

            //get total
            var total = await query.Select(x => x.Id).CountAsync();

            // pagination
            query = query
                .Skip(requestModel.Offset)
                .Take(requestModel.PageSize);

            // select cases
            var cases = await query.Select(x => new Case
                {
                    FieldValue1 = x.FieldValue1,
                    FieldValue2 = x.FieldValue2,
                    FieldValue3 = x.FieldValue3,
                    FieldValue4 = x.FieldValue4,
                    FieldValue5 = x.FieldValue5,
                    FieldValue6 = x.FieldValue6,
                    FieldValue7 = x.FieldValue7,
                    FieldValue8 = x.FieldValue8,
                    FieldValue9 = x.FieldValue9,
                    FieldValue10 = x.FieldValue10,
                    CaseType = x.Type,
                    CaseUId = x.CaseUid,
                    CheckUIid = x.MicrotingCheckUid,
                    CreatedAt = x.CreatedAt,
                    Custom = x.Custom,
                    DoneAt = x.DoneAt,
                    DoneAtUserModifiable = x.DoneAtUserModifiable,
                    Id = x.Id,
                    IsArchived = x.IsArchived,
                    MicrotingUId = x.MicrotingUid,
                    SiteId = x.SiteId,
                    Status = x.Status,
                    TemplatId = x.CheckListId,
                    UnitId = x.UnitId,
                    UpdatedAt = x.UpdatedAt,
                    Version = x.Version,
                    WorkflowState = x.WorkflowState,
                    SiteName = x.SiteName,
                    WorkerName = x.SiteName
                })
                .ToListAsync();

            var model = new CaseListModel
            {
                NumOfElements = total,
                Cases = cases
            };

            return new OperationDataResult<CaseListModel>(true, model);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            ;
            return new OperationDataResult<CaseListModel>(false,
                localizationService.GetString("CaseLoadingFailed") + $" Exception: {e.Message}");
        }
    }

    public async Task<OperationDataResult<ReplyElement>> Read(int id)
    {
        try
        {
            var core = await coreHelper.GetCore();
            var sdkDbContext = core.DbContextHelper.GetDbContext();
            var caseDto = await sdkDbContext.Cases.SingleOrDefaultAsync(x => x.Id == id);
            if (caseDto == null)
            {
                return new OperationDataResult<ReplyElement>(false, localizationService.GetString("CaseNotFound"));
            }

            var language = await userService.GetCurrentUserLanguage();
            var theCase = await core.CaseRead(caseDto.Id, language);
            theCase.Id = id;

            return !theCase.Equals(null)
                ? new OperationDataResult<ReplyElement>(true, theCase)
                : new OperationDataResult<ReplyElement>(false);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<ReplyElement>(false, e.Message);
        }
    }

    public async Task<OperationResult> Delete(int id)
    {
        try
        {
            var core = await coreHelper.GetCore();

            return await core.CaseDeleteResult(id)
                ? new OperationResult(true, localizationService.GetStringWithFormat("CaseParamDeletedSuccessfully", id))
                : new OperationResult(false, localizationService.GetString("CaseCouldNotBeRemoved"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                $"{localizationService.GetString("CaseCouldNotBeRemoved")} Exception: {e.Message}");
        }
    }

    public async Task<OperationResult> Update(ReplyRequest model)
    {
        var checkListValueList = new List<string>();
        var fieldValueList = new List<string>();
        var core = await coreHelper.GetCore();
        var language = await userService.GetCurrentUserLanguage();
        try
        {
            model.ElementList.ForEach(element =>
            {
                checkListValueList.AddRange(CaseUpdateHelper.GetCheckList(element));
                fieldValueList.AddRange(CaseUpdateHelper.GetFieldList(element));
            });
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                $"{localizationService.GetString("CaseCouldNotBeUpdated")} Exception: {e.Message}");
        }

        try
        {
            await core.CaseUpdate(model.Id, fieldValueList, checkListValueList);
            await core.CaseUpdateFieldValues(model.Id, language);

            if (model.IsDoneAtEditable)
            {
                var sdkDbContext = core.DbContextHelper.GetDbContext();

                var foundCase = await sdkDbContext.Cases
                    .Where(x => x.Id == model.Id
                                && x.WorkflowState != Constants.WorkflowStates.Removed)
                    .FirstOrDefaultAsync();

                if (foundCase != null)
                {
                    if (foundCase.DoneAt != null)
                    {
                        var newDoneAt = new DateTime(model.DoneAt.Year, model.DoneAt.Month, model.DoneAt.Day,
                            foundCase.DoneAt.Value.Hour, foundCase.DoneAt.Value.Minute, foundCase.DoneAt.Value.Second);
                        foundCase.DoneAtUserModifiable = newDoneAt;
                    }

                    await foundCase.Update(sdkDbContext);
                }
                else
                {
                    return new OperationResult(false, localizationService.GetString("CaseNotFound"));
                }
            }

            if (CaseUpdateDelegates.CaseUpdateDelegate != null)
            {
                var invocationList = CaseUpdateDelegates.CaseUpdateDelegate
                    .GetInvocationList();
                foreach (var func in invocationList)
                {
                    func.DynamicInvoke(model.Id);
                }
            }

            return new OperationResult(true, localizationService.GetString("CaseHasBeenUpdated"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetString("CaseCouldNotBeUpdated") + $" Exception: {e.Message}");
        }
    }

    public async Task<OperationResult> Archive(int caseId)
    {
        var core = await coreHelper.GetCore();
        var sdkDbContext = core.DbContextHelper.GetDbContext();
        try
        {
            var caseDb = await sdkDbContext.Cases
                .Where(x => x.Id == caseId)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => !x.IsArchived)
                .FirstOrDefaultAsync();
            if (caseDb == null)
            {
                return new OperationResult(false, localizationService.GetString("CaseNotFound"));
            }

            caseDb.IsArchived = true;
            await caseDb.Update(sdkDbContext);

            if (CaseUpdateDelegates.CaseUpdateDelegate != null)
            {
                var invocationList = CaseUpdateDelegates.CaseUpdateDelegate
                    .GetInvocationList();
                foreach (var func in invocationList)
                {
                    func.DynamicInvoke(caseId);
                }
            }

            return new OperationResult(true, localizationService.GetString("CaseHasBeenArchived"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                $"{localizationService.GetString("CaseCouldNotBeArchived")} Exception: {e.Message}");
        }
    }

    public async Task<OperationResult> Unarchive(int caseId)
    {
        var core = await coreHelper.GetCore();
        var sdkDbContext = core.DbContextHelper.GetDbContext();
        try
        {
            var caseDb = await sdkDbContext.Cases
                .Where(x => x.Id == caseId)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.IsArchived)
                .FirstOrDefaultAsync();
            if (caseDb == null)
            {
                return new OperationResult(false, localizationService.GetString("CaseNotFound"));
            }

            caseDb.IsArchived = false;
            await caseDb.Update(sdkDbContext);

            return new OperationResult(true, localizationService.GetString("CaseHasBeenUnarchived"));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                $"{localizationService.GetString("CaseCouldNotBeUnarchived")} Exception: {e.Message}");
        }
    }

    public async Task<OperationDataResult<LatestCaseActivity>> GetLatestActivity()
    {
        var core = await coreHelper.GetCore();
        var sdkDbContext = core.DbContextHelper.GetDbContext();
        try
        {
            var latestActivity = await sdkDbContext.Cases
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .OrderByDescending(x => x.UpdatedAt)
                .Select(x => new { x.Id, x.UpdatedAt, x.CheckListId })
                .FirstOrDefaultAsync();

            if (latestActivity == null)
            {
                return new OperationDataResult<LatestCaseActivity>(false,
                    localizationService.GetString("CouldNotGetLatestActivity"));
            }

            var eFormText = await sdkDbContext.CheckListTranslations
                .Where(x => x.CheckListId == latestActivity.CheckListId)
                .Select(x => x.Text)
                .FirstOrDefaultAsync();
            if (eFormText == null)
            {
                return new OperationDataResult<LatestCaseActivity>(false,
                    localizationService.GetString("CouldNotGetLatestActivity"));
            }

            return new OperationDataResult<LatestCaseActivity>(true,
                new LatestCaseActivity()
                {
                    Id = latestActivity.Id,
                    UpdatedAt = latestActivity.UpdatedAt,
                    CheckListId = latestActivity.CheckListId,
                    CheckListText = eFormText
                }
            );
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<LatestCaseActivity>(false,
                $"{localizationService.GetString("CouldNotGetLatestActivity")} Exception: {e.Message}");
        }
    }
}