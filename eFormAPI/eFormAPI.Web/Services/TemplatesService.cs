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
using eFormAPI.Web.Infrastructure.Models;
using eFormAPI.Web.Infrastructure.Models.Templates;
using eFormCore;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microsoft.Extensions.Options;
using Microting.eForm.Dto;
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Field = Microting.eForm.Infrastructure.Models.Field;

namespace eFormAPI.Web.Services
{
    using System.IO;
    using Import;
    using Infrastructure.Models.Import;
    using Microsoft.Extensions.Logging;
    using Remotion.Linq.Parsing.Structure.IntermediateModel;

    public class TemplatesService : ITemplatesService
    {
        private readonly IOptions<ConnectionStringsSdk> _connectionStringsSdk;
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;
        private readonly IUserService _userService;
        private readonly BaseDbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEformExcelImportService _eformExcelImportService;
        private readonly ILogger<TemplatesService> _logger;

        public TemplatesService(
            IEFormCoreService coreHelper,
            ILocalizationService localizationService,
            IUserService userService, BaseDbContext dbContext,
            IOptions<ConnectionStringsSdk> connectionStringsSdk,
            IHttpContextAccessor httpContextAccessor,
            IEformExcelImportService eformExcelImportService,
            ILogger<TemplatesService> logger)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
            _userService = userService;
            _dbContext = dbContext;
            _connectionStringsSdk = connectionStringsSdk;
            _httpContextAccessor = httpContextAccessor;
            _eformExcelImportService = eformExcelImportService;
            _logger = logger;
        }

        public async Task<OperationDataResult<TemplateListModel>> Index(TemplateRequestModel templateRequestModel)
        {
            var timeZoneInfo = await _userService.GetCurrentUserTimeZoneInfo();
            Log.LogEvent("TemplateService.Index: called");
            try
            {
                Log.LogEvent("TemplateService.Index: try section");
                var core = await _coreHelper.GetCore();
                var locale = await _userService.GetCurrentUserLocale();
                var language = core.dbContextHelper.GetDbContext().Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());
                var templatesDto = await core.TemplateItemReadAll(false,
                    "",
                    templateRequestModel.NameFilter,
                    templateRequestModel.IsSortDsc,
                    templateRequestModel.Sort,
                    templateRequestModel.TagIds,
                    timeZoneInfo, language);

                var model = new TemplateListModel
                {
                    NumOfElements = 40,
                    PageNum = templateRequestModel.PageIndex,
                    Templates = new List<TemplateDto>()
                };

                var eformIds = new List<int>();
                //List<string> plugins = await _dbContext.EformPlugins.Select(x => x.PluginId).ToListAsync();

                if (!_userService.IsAdmin())
                {
                    var isEformsInGroups = await _dbContext.SecurityGroupUsers
                        .Where(x => x.EformUserId == _userService.UserId)
                        .Where(x => x.SecurityGroup.EformsInGroup.Any())
                        .AnyAsync();
                    if (isEformsInGroups)
                    {
                        eformIds = _dbContext.EformInGroups
                            .Where(x =>
                                x.SecurityGroup.SecurityGroupUsers.Any(y => y.EformUserId == _userService.UserId))
                            .Select(x => x.TemplateId)
                            .ToList();

                        foreach (TemplateDto templateDto in templatesDto)
                        {
                            if (eformIds.Contains(templateDto.Id))
                            {
                                await templateDto.CheckForLock(_dbContext);
                                templateDto.CreatedAt = TimeZoneInfo.ConvertTimeFromUtc((DateTime)templateDto.CreatedAt, timeZoneInfo);
                                model.Templates.Add(templateDto);
                            }
                        }
                    }
                    else
                    {
                        foreach (TemplateDto templateDto in templatesDto)
                        {
                            await templateDto.CheckForLock(_dbContext);
                            templateDto.CreatedAt = TimeZoneInfo.ConvertTimeFromUtc((DateTime)templateDto.CreatedAt, timeZoneInfo);
                            model.Templates.Add(templateDto);
                        }
                    }
                }
                else
                {
                    foreach (TemplateDto templateDto in templatesDto)
                    {
                        await templateDto.CheckForLock(_dbContext);
                        templateDto.CreatedAt = TimeZoneInfo.ConvertTimeFromUtc((DateTime)templateDto.CreatedAt, timeZoneInfo);
                        model.Templates.Add(templateDto);
                    }
                }
                return new OperationDataResult<TemplateListModel>(true, model);
            }
            catch (Exception ex)
            {
                Log.LogEvent("TemplateService.Index: catch section");
                Log.LogException($"TemplatesService.Index: Got exception {ex.Message}");
                Log.LogException($"TemplatesService.Index: Got stacktrace {ex.StackTrace}");
                if (ex.Message.Contains("PrimeDb"))
                {
                    var sdkConnectionString = _connectionStringsSdk.Value.SdkConnection;
                    var adminTool = new AdminTools(sdkConnectionString);
                    await adminTool.DbSettingsReloadRemote();
                    return new OperationDataResult<TemplateListModel>(false,
                        _localizationService.GetString("CheckConnectionString"));
                }

                if (ex.InnerException != null && ex.InnerException.Message.Contains("Cannot open database"))
                {
                    try
                    {
                        var core = await _coreHelper.GetCore();
                    }
                    catch (Exception ex2)
                    {
                        return new OperationDataResult<TemplateListModel>(false,
                            _localizationService.GetString("CoreIsNotStarted") +" " + ex2.Message);
                    }

                    return new OperationDataResult<TemplateListModel>(false,
                        _localizationService.GetString("CheckSettingsBeforeProceed"));
                }

                return new OperationDataResult<TemplateListModel>(false,
                    _localizationService.GetString("CheckSettingsBeforeProceed"));
            }
        }

        public async Task<OperationDataResult<Template_Dto>> Get(int id)
        {
            try
            {
                var core = await _coreHelper.GetCore();

                var locale = await _userService.GetCurrentUserLocale();

                Language language = core.dbContextHelper.GetDbContext().Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());
                var templateDto = await core.TemplateItemRead(id, language);
                return new OperationDataResult<Template_Dto>(true, templateDto);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("PrimeDb"))
                {
                    var sdkConnectionString = _connectionStringsSdk.Value.SdkConnection;
                    var adminTool = new AdminTools(sdkConnectionString);
                    await adminTool.DbSettingsReloadRemote();
                    return new OperationDataResult<Template_Dto>(false,
                        _localizationService.GetString("CheckConnectionString"));
                }

                if (ex.InnerException.Message.Contains("Cannot open database"))
                {
                    try
                    {
                        var core = await _coreHelper.GetCore();
                    }
                    catch (Exception)
                    {
                        return new OperationDataResult<Template_Dto>(false,
                            _localizationService.GetString("CoreIsNotStarted"));
                    }

                    return new OperationDataResult<Template_Dto>(false,
                        _localizationService.GetString("CheckSettingsBeforeProceed"));
                }

                return new OperationDataResult<Template_Dto>(false,
                    _localizationService.GetString("CheckSettingsBeforeProceed"));
            }
        }

        public async Task<OperationResult> Create(EFormXmlModel eFormXmlModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
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
                    throw new Exception(_localizationService.GetString("eFormCouldNotBeCreated") + message);
                }

                if (newTemplate == null) throw new Exception(_localizationService.GetString("eFormCouldNotBeCreated"));
                // Set tags to eform
                await core.TemplateCreate(newTemplate);
                if (eFormXmlModel.TagIds != null)
                {
                    await core.TemplateSetTags(newTemplate.Id, eFormXmlModel.TagIds);
                }

                return new OperationResult(true,
                    _localizationService.GetStringWithFormat("eFormParamCreatedSuccessfully", newTemplate.Label));
            }
            catch (Exception e)
            {
                return new OperationResult(false, e.Message);
            }
        }

        public async Task<OperationDataResult<ExcelParseResult>> Import(Stream excelStream)
        {
            try
            {
                var result = new ExcelParseResult();
                var core = await _coreHelper.GetCore();
                await using MicrotingDbContext dbContext = core.dbContextHelper.GetDbContext();
                var locale = await _userService.GetCurrentUserLocale();
                Language language = dbContext.Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());

                var timeZone = await _userService.GetCurrentUserTimeZoneInfo();
                var templatesDto = await core.TemplateItemReadAll(
                    false,
                    "",
                    "",
                    false,
                    "",
                    new List<int>(),
                    timeZone, language);

                // Read file
                var fileResult = _eformExcelImportService.EformImport(excelStream);

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
                            Message = _localizationService.GetStringWithFormat(
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
                        Count = x.Count(),
                    })
                    .Where(x => x.Count > 1)
                    .ToList();

                foreach (var duplicateObject in duplicates)
                {
                    var error = new ExcelParseErrorModel
                    {
                        Row = 0,
                        Message = _localizationService.GetStringWithFormat(
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
                    if (!string.IsNullOrEmpty(importExcelModel.Name) || !string.IsNullOrEmpty(importExcelModel.EformXML))
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
                            throw new Exception(_localizationService.GetString("eFormCouldNotBeCreated"));

                        // Set tags to eform
                        int eFormId = await core.TemplateCreate(newTemplate);
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

                result.Message = _localizationService.GetString("ImportFinishedSuccessfully");

                return new OperationDataResult<ExcelParseResult>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationDataResult<ExcelParseResult>(false, e.Message);
            }
        }

        public async Task<OperationResult> Delete(int id)
        {
            try
            {
                var core = await _coreHelper.GetCore();

                await using var dbContext = core.dbContextHelper.GetDbContext();
                List<CheckListSite> checkListSites = await dbContext.CheckListSites.Where(x => x.CheckListId == id).ToListAsync();
                foreach (var checkListSite in checkListSites)
                {
                    await core.CaseDelete(checkListSite.MicrotingUid);
                }

                CheckList checkList = await dbContext.CheckLists.SingleAsync(x => x.Id == id);
                await checkList.Delete(dbContext);

                var eformReport = _dbContext.EformReports
                    .FirstOrDefault(x => x.TemplateId == id);

                if (eformReport != null)
                {
                    _dbContext.EformReports.Remove(eformReport);
                    await _dbContext.SaveChangesAsync();
                }

                return new OperationResult(true,
                    _localizationService.GetStringWithFormat("eFormParamDeletedSuccessfully", id));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetStringWithFormat("eFormParamCouldNotBeDeleted", id));
            }
        }

        public async Task<OperationDataResult<DeployToModel>> DeployTo(int id)
        {
            var core = await _coreHelper.GetCore();

            await using MicrotingDbContext dbContext = core.dbContextHelper.GetDbContext();
            var locale = await _userService.GetCurrentUserLocale();
            Language language = dbContext.Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());
            var templateDto = await core.TemplateItemRead(id, language);
            var siteNamesDto = await core.Advanced_SiteItemReadAll();

            var deployToMode = new DeployToModel()
            {
                SiteNamesDto = siteNamesDto,
                TemplateDto = templateDto
            };
            return new OperationDataResult<DeployToModel>(true, deployToMode);
        }

        public async Task<OperationResult> Deploy(DeployModel deployModel)
        {
            var deployedSiteIds = new List<int>();

            var sitesToBeRetractedFrom = new List<int>();
            var sitesToBeDeployedTo = new List<int>();

            var core = await _coreHelper.GetCore();

            await using MicrotingDbContext dbContext = core.dbContextHelper.GetDbContext();
            var locale = await _userService.GetCurrentUserLocale();
            Language language = dbContext.Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());
            var templateDto = await core.TemplateItemRead(deployModel.Id, language);

            foreach (var site in templateDto.DeployedSites)
            {
                deployedSiteIds.Add(site.SiteUId);
            }

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
                foreach (int i in sitesToBeDeployedTo)
                {
                    Site site = await dbContext.Sites.SingleAsync(x => x.MicrotingUid == i);
                    language = await dbContext.Languages.SingleAsync(x => x.Id == site.LanguageId);
                    var mainElement = await core.ReadeForm(deployModel.Id, language);
                    mainElement.Repeated = 0;
                    // We set this right now hardcoded,
                    // this will let the eForm be deployed until end date or we actively retract it.
                    if (deployModel.FolderId != null)
                    {
                        mainElement.CheckListFolderName = dbContext.Folders.Single(x => x.Id == deployModel.FolderId).MicrotingUid.ToString();
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
                _localizationService.GetStringWithFormat("ParamPairedSuccessfully", templateDto.Label));
        }

        public async Task<OperationDataResult<List<Field>>> GetFields(int id)
        {
            var core = await _coreHelper.GetCore();

            await using MicrotingDbContext dbContext = core.dbContextHelper.GetDbContext();
            var locale = await _userService.GetCurrentUserLocale();
            Language language = dbContext.Languages.Single(x => x.LanguageCode.ToLower() == locale.ToLower());
            var fields = core.Advanced_TemplateFieldReadAll(id).Result.Select(f => core.Advanced_FieldRead(f.Id, language).Result).ToList();

            return new OperationDataResult<List<Field>>(true, fields);
        }
    }
}