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

using Sentry;

namespace eFormAPI.Web.Services;

using Abstractions;
using Abstractions.Eforms;
using eFormCore;
using Import;
using Infrastructure.Models;
using Infrastructure.Models.Import;
using Infrastructure.Models.Templates;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microting.eForm.Dto;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Extensions;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using Field = Microting.eForm.Infrastructure.Models.Field;
using Microting.eForm.Infrastructure.Data.Entities;

public class TemplatesService(
    IEFormCoreService coreHelper,
    ILocalizationService localizationService,
    IUserService userService,
    BaseDbContext context,
    IOptions<ConnectionStringsSdk> connectionStringsSdk,
    IEformExcelImportService eformExcelImportService,
    ILogger<TemplatesService> logger)
    : ITemplatesService
{
    public async Task<OperationDataResult<TemplateListModel>> Index(TemplateRequestModel templateRequestModel)
    {
        var timeZoneInfo = await userService.GetCurrentUserTimeZoneInfo();
        Log.LogEvent("TemplateService.Index: called");
        try
        {
            var core = await coreHelper.GetCore();
            await using var sdkDbContext = core.DbContextHelper.GetDbContext();
            Log.LogEvent("TemplateService.Index: try section");

            var language = await userService.GetCurrentUserLanguage();
            if (language == null)
            {
                language = await sdkDbContext.Languages.SingleOrDefaultAsync(x => x.Name == "Danish");
                if (language != null)
                {
                    language.LanguageCode = "da";
                    await language.Update(sdkDbContext);
                }
            }

            var query = sdkDbContext.CheckListTranslations
                .Include(x => x.CheckList)
                .ThenInclude(x => x.Taggings)
                .ThenInclude(x => x.Tag)
                .Include(x => x.CheckList.CheckListSites)
                .ThenInclude(x => x.Site)
                .Include(x => x.CheckList.Cases)
                .Where(x => x.CheckList.ParentId == null)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.CheckList.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.CheckList.IsHidden == false)
                .Where(x => x.LanguageId == language.Id);

            query = QueryHelper.AddFilterAndSortToQuery(query, templateRequestModel, new List<string> { "Text" },
                new List<string> { "Id", "CreatedAt" });

            if (templateRequestModel.Sort is "Id" or "CreatedAt")
            {
                if (templateRequestModel.IsSortDsc)
                {
                    query = query
                        .CustomOrderByDescending(templateRequestModel.Sort);
                }
                else
                {
                    query = query
                        .CustomOrderBy(templateRequestModel.Sort);
                }
            }

            if (templateRequestModel.TagIds.Any())
            {
                query = query.Where(x => x.CheckList.Taggings
                    .Where(y => y.Tag.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                    .Any(y => templateRequestModel.TagIds.Contains((int)y.TagId)));
            }

            var templatesDto = await query.Select(x => new TemplateDto
            {
                Id = x.CheckListId,
                CreatedAt =
                    TimeZoneInfo.ConvertTimeFromUtc((DateTime)x.CheckList.CreatedAt, timeZoneInfo),
                DeployedSites = x.CheckList.CheckListSites
                    .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(y => new SiteNameDto
                    {
                        SiteUId = (int)y.Site.MicrotingUid,
                        SiteName = y.Site.Name,
                        CreatedAt = y.Site.CreatedAt,
                        UpdatedAt = y.Site.UpdatedAt
                    })
                    .ToList(),
                Description = x.Description,
                Label = x.Text,
                Repeated = (int)x.CheckList.Repeated,
                FolderName = x.CheckList.FolderName,
                WorkflowState = x.CheckList.WorkflowState,
                HasCases = x.CheckList.Cases
                    .Any(y => y.WorkflowState != Constants.WorkflowStates.Removed && y.Status == 100),
                DisplayIndex = x.CheckList.DisplayIndex,
                Tags = x.CheckList.Taggings
                    .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(y => y.Tag.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(y => new KeyValuePair<int, string>(y.Tag.Id, y.Tag.Name))
                    .ToList(),
                FolderId = x.CheckList.CheckListSites
                    .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(y => y.FolderId)
                    .FirstOrDefault(),
                IsLocked = x.CheckList.IsLocked,
                IsEditable = x.CheckList.IsEditable,
                DocxExportEnabled = x.CheckList.DocxExportEnabled,
                JasperExportEnabled = x.CheckList.JasperExportEnabled,
                ExcelExportEnabled = x.CheckList.ExcelExportEnabled,
                IsAchievable = x.CheckList.IsAchievable,
                IsDoneAtEditable = x.CheckList.IsDoneAtEditable,
                QuickSyncEnabled = x.CheckList.QuickSyncEnabled != null && x.CheckList.QuickSyncEnabled == 1
            }).ToListAsync();

            //var templatesDto = await core.TemplateItemReadAll(false,
            //    "",
            //    templateRequestModel.NameFilter,
            //    templateRequestModel.IsSortDsc,
            //    templateRequestModel.Sort,
            //    templateRequestModel.TagIds,
            //    timeZoneInfo, language);

            var model = new TemplateListModel
            {
                NumOfElements = await query.Where(y => y.CheckList.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => x.CheckListId).CountAsync(),
                //PageNum = templateRequestModel.PageIndex,
                Templates = new List<TemplateDto>()
            };

            var pluginIds = await context.EformPlugins
                .Select(x => x.PluginId)
                .ToListAsync();
            if (!userService.IsAdmin())
            {
                var isEformsInGroups = await context.SecurityGroupUsers
                    .Where(x => x.EformUserId == userService.UserId)
                    .Where(x => x.SecurityGroup.EformsInGroup.Any())
                    .AnyAsync();
                if (isEformsInGroups)
                {
                    var eformIds = context.EformInGroups
                        .Where(x =>
                            x.SecurityGroup.SecurityGroupUsers.Any(y => y.EformUserId == userService.UserId))
                        .Select(x => x.TemplateId)
                        .ToList();

                    foreach (var templateDto in templatesDto.Where(templateDto => eformIds.Contains(templateDto.Id)))
                    {
                        await templateDto.CheckForLock(context);
                        model.Templates.Add(templateDto);
                    }
                }
                else
                {
                    foreach (var templateDto in templatesDto)
                    {
                        await templateDto.CheckForLock(context, pluginIds);
                        model.Templates.Add(templateDto);
                    }
                }
            }
            else
            {
                foreach (var templateDto in templatesDto)
                {
                    await templateDto.CheckForLock(context, pluginIds);
                    model.Templates.Add(templateDto);
                }
            }

            //foreach (var template in model.Templates)
            //{
            //    var tagsForRemove = new List<KeyValuePair<int, string>>();
            //    foreach (var tag in template.Tags)
            //    {
            //        if (await sdkDbContext.Tags
            //            .Where(y => y.WorkflowState == Constants.WorkflowStates.Removed)
            //            .AnyAsync(x => x.Id == tag.Key))
            //        {
            //            tagsForRemove.Add(tag);
            //        }
            //    }

            //    foreach (var tag in tagsForRemove)
            //    {
            //        template.Tags.Remove(tag);
            //    }
            //}

            return new OperationDataResult<TemplateListModel>(true, model);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            if (e.Message.Contains("PrimeDb"))
            {
                var sdkConnectionString = connectionStringsSdk.Value.SdkConnection;
                var adminTool = new AdminTools(sdkConnectionString);
                await adminTool.DbSettingsReloadRemote();
                return new OperationDataResult<TemplateListModel>(false,
                    localizationService.GetString("CheckConnectionString"));
            }

            if (e.InnerException != null && e.InnerException.Message.Contains("Cannot open database"))
            {
                try
                {
                    var _ = await coreHelper.GetCore();
                }
                catch (Exception ex2)
                {
                    return new OperationDataResult<TemplateListModel>(false,
                        localizationService.GetString("CoreIsNotStarted") + " " + ex2.Message);
                }

                return new OperationDataResult<TemplateListModel>(false,
                    localizationService.GetString("CheckSettingsBeforeProceed"));
            }

            return new OperationDataResult<TemplateListModel>(false,
                localizationService.GetString("CheckSettingsBeforeProceed"));
        }
    }

    public async Task<OperationDataResult<Template_Dto>> Get(int id)
    {
        try
        {
            var core = await coreHelper.GetCore();

            var language = await userService.GetCurrentUserLanguage();
            var templateDto = await core.TemplateItemRead(id, language);
            return new OperationDataResult<Template_Dto>(true, templateDto);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            if (e.Message.Contains("PrimeDb"))
            {
                var sdkConnectionString = connectionStringsSdk.Value.SdkConnection;
                var adminTool = new AdminTools(sdkConnectionString);
                await adminTool.DbSettingsReloadRemote();
                return new OperationDataResult<Template_Dto>(false,
                    localizationService.GetString("CheckConnectionString"));
            }

            if (e.InnerException.Message.Contains("Cannot open database"))
            {
                try
                {
                    var core = await coreHelper.GetCore();
                }
                catch (Exception)
                {
                    return new OperationDataResult<Template_Dto>(false,
                        localizationService.GetString("CoreIsNotStarted"));
                }

                return new OperationDataResult<Template_Dto>(false,
                    localizationService.GetString("CheckSettingsBeforeProceed"));
            }

            return new OperationDataResult<Template_Dto>(false,
                localizationService.GetString("CheckSettingsBeforeProceed"));
        }
    }

    public async Task<OperationResult> Create(EFormXmlModel eFormXmlModel)
    {
        try
        {
            var core = await coreHelper.GetCore();
            var sdkDbContext = core.DbContextHelper.GetDbContext();
            // Create tags
            if (eFormXmlModel.NewTag != null)
            {
                var tagList = eFormXmlModel.NewTag.Replace(" ", "").Split(',');
                foreach (var tag in tagList)
                {
                    eFormXmlModel.TagIds.Add(await core.TagCreate(tag));
                }
            }

            // Create eform
            var newTemplate = await core.TemplateFromXml(eFormXmlModel.EFormXml);
            newTemplate = await core.TemplateUploadData(newTemplate);
            // Check errors
            var errors = await core.TemplateValidation(newTemplate);
            if (errors.Any())
            {
                var message = errors.Aggregate("", (current, str) => current + ("<br>" + str));
                throw new Exception(localizationService.GetString("eFormCouldNotBeCreated") + message);
            }

            if (newTemplate == null) throw new Exception(localizationService.GetString("eFormCouldNotBeCreated"));
            // Set tags to eform
            var clId = await core.TemplateCreate(newTemplate);
            var cl = await sdkDbContext.CheckLists.SingleOrDefaultAsync(x => x.Id == clId);
            cl.IsEditable = true;
            await cl.Update(sdkDbContext);
            if (eFormXmlModel.TagIds != null)
            {
                await core.TemplateSetTags(newTemplate.Id, eFormXmlModel.TagIds);
            }

            return new OperationResult(true,
                localizationService.GetStringWithFormat("eFormParamCreatedSuccessfully", newTemplate.Label));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false, e.Message);
        }
    }

    public async Task<OperationDataResult<ExcelParseResult>> Import(Stream excelStream)
    {
        try
        {
            var result = new ExcelParseResult();
            var core = await coreHelper.GetCore();
            await using var dbContext = core.DbContextHelper.GetDbContext();
            var language = await userService.GetCurrentUserLanguage();

            var timeZone = await userService.GetCurrentUserTimeZoneInfo();
            var templatesDto = await core.TemplateItemReadAll(
                false,
                "",
                "",
                false,
                "",
                new List<int>(),
                timeZone, language);

            // Read file
            var fileResult = eformExcelImportService.EformImport(excelStream);

            // Validation
            var excelErrors = new List<ExcelParseErrorModel>();

            foreach (var excelModel in fileResult)
            {
                var templateByName = templatesDto
                    .FirstOrDefault(x => string.Equals(
                        x.Label,
                        excelModel.Name,
                        StringComparison.CurrentCultureIgnoreCase));

                if (templateByName != null)
                {
                    var error = new ExcelParseErrorModel
                    {
                        Row = excelModel.ExcelRow,
                        Message = localizationService.GetStringWithFormat(
                            "EFormWithNameAlreadyExists",
                            excelModel.Name)
                    };

                    excelErrors.Add(error);
                }
            }

            var duplicates = fileResult
                .GroupBy(x => x.Name.ToLower())
                .Select(x => new
                {
                    x.Key,
                    Count = x.Count()
                })
                .Where(x => x.Count > 1)
                .ToList();

            foreach (var duplicateObject in duplicates)
            {
                var error = new ExcelParseErrorModel
                {
                    Row = 0,
                    Message = localizationService.GetStringWithFormat(
                        "EFormWithNameAlreadyExistsInTheImportedDocument",
                        duplicateObject.Key)
                };

                excelErrors.Add(error);
            }


            result.Errors = excelErrors;

            if (excelErrors.Any())
            {
                return new OperationDataResult<ExcelParseResult>(
                    true,
                    result);
            }

            // Process file result
            foreach (var importExcelModel in fileResult)
            {
                if (!string.IsNullOrEmpty(importExcelModel.Name) ||
                    !string.IsNullOrEmpty(importExcelModel.EformXML))
                {
                    var tags = await core.GetAllTags(false);
                    var tagIds = new List<int>();

                    // Process tags
                    foreach (var tag in importExcelModel.Tags)
                    {
                        var tagId = tags
                            .Where(x => string.Equals(x.Name, tag, StringComparison.CurrentCultureIgnoreCase))
                            .Select(x => x.Id)
                            .FirstOrDefault();

                        if (tagId < 1)
                        {
                            tagId = await core.TagCreate(tag);
                        }

                        tagIds.Add(tagId);
                    }

                    // Create eform
                    var newTemplate = await core.TemplateFromXml(importExcelModel.EformXML);
                    newTemplate = await core.TemplateUploadData(newTemplate);

                    if (newTemplate == null)
                        throw new Exception(localizationService.GetString("eFormCouldNotBeCreated"));

                    // Set tags to eform
                    var eFormId = await core.TemplateCreate(newTemplate);
                    var eForm = await dbContext.CheckLists.SingleAsync(x => x.Id == eFormId);

                    eForm.ReportH1 = importExcelModel.ReportH1;
                    eForm.ReportH2 = importExcelModel.ReportH2;
                    eForm.ReportH3 = importExcelModel.ReportH3;
                    eForm.ReportH4 = importExcelModel.ReportH4;

                    await eForm.Update(dbContext);

                    if (tagIds.Any())
                    {
                        await core.TemplateSetTags(newTemplate.Id, tagIds);
                    }
                }
            }

            result.Message = localizationService.GetString("ImportFinishedSuccessfully");

            return new OperationDataResult<ExcelParseResult>(true, result);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<ExcelParseResult>(false, e.Message);
        }
    }

    public async Task<OperationResult> Delete(int id)
    {
        try
        {
            var core = await coreHelper.GetCore();

            await using var dbContext = core.DbContextHelper.GetDbContext();
            var checkListSites =
                await dbContext.CheckListSites.Where(x => x.CheckListId == id).ToListAsync();
            foreach (var checkListSite in checkListSites)
            {
                await core.CaseDelete(checkListSite.MicrotingUid);
            }

            var checkList = await dbContext.CheckLists.SingleAsync(x => x.Id == id);
            await checkList.Delete(dbContext);

            var eformReport = context.EformReports
                .FirstOrDefault(x => x.TemplateId == id);

            if (eformReport != null)
            {
                context.EformReports.Remove(eformReport);
                await context.SaveChangesAsync();
            }

            return new OperationResult(true,
                localizationService.GetStringWithFormat("eFormParamDeletedSuccessfully", id));
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(false,
                localizationService.GetStringWithFormat("eFormParamCouldNotBeDeleted", id));
        }
    }

    public async Task<OperationDataResult<DeployToModel>> DeployTo(int id)
    {
        var core = await coreHelper.GetCore();

        var language = await userService.GetCurrentUserLanguage();
        var templateDto = await core.TemplateItemRead(id, language);
        var siteNamesDto = await core.Advanced_SiteItemReadAll();

        var deployToMode = new DeployToModel
        {
            SiteNamesDto = siteNamesDto,
            TemplateDto = templateDto
        };
        return new OperationDataResult<DeployToModel>(true, deployToMode);
    }

    public async Task<OperationResult> Deploy(DeployModel deployModel)
    {
        var sitesToBeRetractedFrom = new List<int>();
        var sitesToBeDeployedTo = new List<int>();

        var core = await coreHelper.GetCore();

        await using var dbContext = core.DbContextHelper.GetDbContext();
        var language = await userService.GetCurrentUserLanguage();
        var templateDto = await core.TemplateItemRead(deployModel.Id, language);

        var deployedSiteIds = templateDto.DeployedSites.Select(site => site.SiteUId).ToList();

        var requestedSiteIds = deployModel
            .DeployCheckboxes
            .Select(deployCheckbox => deployCheckbox.Id)
            .ToList();

        if (requestedSiteIds.Count == 0)
        {
            sitesToBeRetractedFrom.AddRange(templateDto.DeployedSites.Select(site => site.SiteUId));
        }
        else
        {
            sitesToBeDeployedTo.AddRange(requestedSiteIds.Where(siteId => !deployedSiteIds.Contains(siteId)));
        }

        if (deployedSiteIds.Count != 0)
        {
            foreach (var site in templateDto.DeployedSites)
            {
                if (!requestedSiteIds.Contains(site.SiteUId))
                {
                    if (!sitesToBeRetractedFrom.Contains(site.SiteUId))
                    {
                        sitesToBeRetractedFrom.Add(site.SiteUId);
                    }
                }
            }
        }

        if (sitesToBeDeployedTo.Any())
        {
            foreach (var i in sitesToBeDeployedTo)
            {
                var site = await dbContext.Sites.SingleAsync(x => x.MicrotingUid == i);
                language = await dbContext.Languages.SingleAsync(x => x.Id == site.LanguageId);
                var mainElement = await core.ReadeForm(deployModel.Id, language);
                mainElement.Repeated = 0;
                // We set this right now hardcoded,
                // this will let the eForm be deployed until end date or we actively retract it.
                if (deployModel.FolderId != null)
                {
                    mainElement.CheckListFolderName = dbContext.Folders.Single(x => x.Id == deployModel.FolderId)
                        .MicrotingUid.ToString();
                }

                mainElement.EndDate = DateTime.Now.AddYears(10).ToUniversalTime();
                mainElement.StartDate = DateTime.Now.ToUniversalTime();
                await core.CaseCreate(mainElement, "", i, deployModel.FolderId);

            }
        }

        foreach (var siteUId in sitesToBeRetractedFrom)
        {
            await core.CaseDelete(deployModel.Id, siteUId);
        }

        return new OperationResult(true,
            localizationService.GetStringWithFormat("ParamPairedSuccessfully", templateDto.Label));
    }

    public async Task<OperationDataResult<int>> Duplicate(TemplateDuplicateRequestModel requestModel)
    {
        try
        {
            var core = await coreHelper.GetCore();
            await using var sdkDbContext = core.DbContextHelper.GetDbContext();

            var duplicateEform = await FindTemplates(requestModel.TemplateId, sdkDbContext);
            await CreateCheckList(sdkDbContext, duplicateEform);

            return new OperationDataResult<int>(true, duplicateEform.Id);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<int>(false,
                localizationService.GetStringWithFormat("ErrorWhileDuplicateEform"));
        }
    }

    public async Task<OperationDataResult<List<Field>>> GetFields(int id)
    {
        var core = await coreHelper.GetCore();

        var language = await userService.GetCurrentUserLanguage();
        var fields = core.Advanced_TemplateFieldReadAll(id, language).Result
            .Select(f => core.Advanced_FieldRead(f.Id, language).Result).ToList();

        return new OperationDataResult<List<Field>>(true, fields);
    }

    public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetDictionaryTemplates(string nameFilter,
        int idFilter)
    {
        var core = await coreHelper.GetCore();
        await using var sdkDbContext = core.DbContextHelper.GetDbContext();
        var language = await userService.GetCurrentUserLanguage();
        var query = sdkDbContext.CheckListTranslations
            .Include(x => x.CheckList)
            .Where(x => x.LanguageId == language.Id)
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Where(x => x.CheckList.ParentId != null)
            .Where(x => x.CheckList.WorkflowState != Constants.WorkflowStates.Removed);

        if (!string.IsNullOrEmpty(nameFilter))
        {
            query = query.Where(x => x.Text.Contains(nameFilter));
        }

        if (idFilter > 0)
        {
            query = query.Where(x => x.CheckListId == idFilter);
        }

        var templates = await query
            .Select(x => new CommonDictionaryModel
            {
                Id = x.CheckList.Id,
                Name = x.Text
            })
            .ToListAsync();

        return new OperationDataResult<List<CommonDictionaryModel>>(true, templates);
    }

    private static async Task<CheckList> FindTemplates(int idEform, MicrotingDbContext sdkDbContext)
    {
        var query = sdkDbContext.CheckLists
            .Include(x => x.Translations)
            .Include(x => x.Taggings)
            .Where(x => x.Id == idEform)
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .AsNoTracking();

        var eform = await query
            .Select(x => new CheckList
            {
                Version = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                WorkflowState = Constants.WorkflowStates.Created,
                Label = x.Label,
                Description = x.Description,
                Custom = x.Custom,
                ParentId = x.ParentId,
                Repeated = x.Repeated,
                DisplayIndex = x.DisplayIndex,
                CaseType = x.CaseType,
                FolderName = x.FolderName,
                ReviewEnabled = x.ReviewEnabled,
                ManualSync = x.ManualSync,
                ExtraFieldsEnabled = x.ExtraFieldsEnabled,
                DoneButtonEnabled = x.DoneButtonEnabled,
                ApprovalEnabled = x.ApprovalEnabled,
                MultiApproval = x.MultiApproval,
                FastNavigation = x.FastNavigation,
                DownloadEntities = x.DownloadEntities,
                Field1 = x.Field1,
                Field2 = x.Field2,
                Field3 = x.Field3,
                Field4 = x.Field4,
                Field5 = x.Field5,
                Field6 = x.Field6,
                Field7 = x.Field7,
                Field8 = x.Field8,
                Field9 = x.Field9,
                Field10 = x.Field10,
                QuickSyncEnabled = x.QuickSyncEnabled,
                Color = x.Color,
                JasperExportEnabled = x.JasperExportEnabled,
                DocxExportEnabled = x.DocxExportEnabled,
                ExcelExportEnabled = x.ExcelExportEnabled,
                //ReportH1 = x.ReportH1,
                //ReportH2 = x.ReportH2,
                //ReportH3 = x.ReportH3,
                //ReportH4 = x.ReportH4,
                //ReportH5 = x.ReportH5,
                IsLocked = false,
                IsEditable = true,
                IsHidden = false,
                IsAchievable = x.IsAchievable,
                IsDoneAtEditable = x.IsDoneAtEditable,
                Taggings = x.Taggings.Select(y => new Tagging
                {
                    Version = 1,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    WorkflowState = Constants.WorkflowStates.Created,
                    TagId = y.TagId
                }).ToList(),
                Translations = x.Translations.Select(y => new CheckListTranslation
                {
                    Version = 1,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    WorkflowState = Constants.WorkflowStates.Created,
                    LanguageId = y.LanguageId,
                    Text = y.Text,
                    Description = y.Description
                }).ToList(),
                Children = new List<CheckList>()
            })
            .FirstOrDefaultAsync();
        if (eform == null)
        {
            throw new Exception("EformNotFound");
        }

        // add fields
        eform.Fields = await FindFields(idEform, sdkDbContext);

        // add eforms
        var childrenCheckListIds = await query
            .Include(x => x.Children)
            .Select(x => x.Children.Select(y => y.Id).ToList())
            .FirstAsync();

        foreach (var checkListId in childrenCheckListIds)
        {
            eform.Children.Add(await FindTemplates(checkListId, sdkDbContext));
        }

        return eform;
    }

    private static async Task<List<Microting.eForm.Infrastructure.Data.Entities.Field>> FindFields(int eformId,
        MicrotingDbContext sdkDbContext, int parentFieldId = -1)
    {
        var findFields = new List<Microting.eForm.Infrastructure.Data.Entities.Field>();
        var fieldQuery = sdkDbContext.Fields
            .Where(x => x.CheckListId == eformId)
            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
            .Include(x => x.FieldType)
            .Include(x => x.Translations)
            .Include(x => x.FieldOptions)
            .ThenInclude(x => x.FieldOptionTranslations)
            .AsNoTracking();
        // ReSharper disable once ConvertIfStatementToConditionalTernaryExpression
        if (parentFieldId != -1)
        {
            fieldQuery = fieldQuery.Where(x => x.ParentFieldId == parentFieldId);
        }
        else
        {
            fieldQuery = fieldQuery.Where(x => x.ParentFieldId == null);
        }

        var fields = await fieldQuery
            .ToListAsync();

        foreach (var field in fields)
        {
            var editorField = new Microting.eForm.Infrastructure.Data.Entities.Field
            {
                Color = field.Color,
                FieldTypeId = field.FieldTypeId,
                DisplayIndex = field.DisplayIndex,
                Translations = field.Translations.Select(x =>
                    new FieldTranslation
                    {
                        Description = x.Description,
                        Text = x.Text,
                        LanguageId = x.LanguageId,
                        DefaultValue = x.DefaultValue,
                        UploadedDataId = x.UploadedDataId,
                        Version = 1,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        WorkflowState = Constants.WorkflowStates.Created
                    }).ToList(),
                Mandatory = field.Mandatory,
                EntityGroupId = field.EntityGroupId,
                BarcodeEnabled = field.BarcodeEnabled,
                BarcodeType = field.BarcodeType,
                Custom = field.Custom,
                DecimalCount = field.DecimalCount,
                DefaultValue = field.DefaultValue,
                Description = field.Description,
                Dummy = field.Dummy,
                MinValue = field.MinValue,
                MaxValue = field.MaxValue,
                UnitName = field.UnitName,
                FieldOptions = field.FieldOptions.Select(x =>
                    new FieldOption
                    {
                        DisplayOrder = x.DisplayOrder,
                        Key = x.Key,
                        Selected = x.Selected,
                        FieldOptionTranslations = x.FieldOptionTranslations
                            .Select(y =>
                                new FieldOptionTranslation
                                {
                                    Text = y.Text,
                                    LanguageId = y.LanguageId,
                                    Version = 1,
                                    CreatedAt = DateTime.UtcNow,
                                    UpdatedAt = DateTime.UtcNow,
                                    WorkflowState = Constants.WorkflowStates.Created
                                }).ToList(),
                        Version = 1,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        WorkflowState = Constants.WorkflowStates.Created
                    }).ToList(),
                GeolocationEnabled = field.GeolocationEnabled,
                GeolocationForced = field.GeolocationForced,
                GeolocationHidden = field.GeolocationHidden,
                IsNum = field.IsNum,
                StopOnSave = field.StopOnSave,
                Multi = field.Multi,
                MaxLength = field.MaxLength,
                Label = field.Label,
                Optional = field.Optional,
                QueryType = field.QueryType,
                KeyValuePairList = field.KeyValuePairList,
                Split = field.Split,
                Selected = field.Selected,
                ReadOnly = field.ReadOnly,
                Version = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                WorkflowState = Constants.WorkflowStates.Created
            };


            if (field.FieldType.Type == Constants.FieldTypes.FieldGroup)
            {
                editorField.Children = await FindFields(eformId, sdkDbContext, field.Id);
            }

            findFields.Add(editorField);
        }

        return findFields;
    }

    private static async Task CreateFields(int eformId, MicrotingDbContext sdkDbContext,
        List<Microting.eForm.Infrastructure.Data.Entities.Field> fieldsList)
    {
        foreach (var field in fieldsList)
        {
            field.CheckListId = eformId;
            if (field.FieldTypeId == 17) // field group
            {
                foreach (var fieldChild in field.Children)
                {
                    fieldChild.CheckListId = eformId;
                }
            }

            await field.Create(sdkDbContext);
        }
    }

    private static async Task CreateCheckList(MicrotingDbContext sdkDbContext,
        CheckList checkList, int? parentId = null)
    {
        checkList.ParentId = parentId;
        var children = checkList.Children.ToList();
        var fields = checkList.Fields.ToList();
        checkList.Children = new List<CheckList>();
        checkList.Fields = new List<Microting.eForm.Infrastructure.Data.Entities.Field>();
        await checkList.Create(sdkDbContext);
        await CreateFields(checkList.Id, sdkDbContext, fields);
        foreach (var childCheckList in children)
        {
            await CreateCheckList(sdkDbContext, childCheckList, checkList.Id);
        }
    }
}