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

namespace ItemsPlanning.Pn.Services.PlanningService
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using ItemsPlanningLocalizationService;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Extensions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
    using Microting.ItemsPlanningBase.Infrastructure.Data;
    using Microting.ItemsPlanningBase.Infrastructure.Data.Entities;
    using Infrastructure.Models.Planning;
    using Microting.eForm.Infrastructure.Data.Entities;
    using PnBase = Microting.ItemsPlanningBase.Infrastructure.Data.Entities.PnBase;


    public class PlanningService : IPlanningService
    {
        private readonly ItemsPlanningPnDbContext _dbContext;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly IUserService _userService;
        private readonly IEFormCoreService _coreService;

        public PlanningService(
            ItemsPlanningPnDbContext dbContext,
            IItemsPlanningLocalizationService itemsPlanningLocalizationService,
            IUserService userService,
            IEFormCoreService coreService)
        {
            _dbContext = dbContext;
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
            _coreService = coreService;
            _userService = userService;
        }

        public async Task<OperationDataResult<Paged<PlanningPnModel>>> Index(PlanningsRequestModel pnRequestModel)
        {
            try
            {
                var sdkCore =
                    await _coreService.GetCore();
                await using var sdkDbContext = sdkCore.DbContextHelper.GetDbContext();

                var planningsQuery = _dbContext.Plannings
                    .AsQueryable();

                if (!string.IsNullOrEmpty(pnRequestModel.NameFilter))
                {
                    planningsQuery = planningsQuery.Where(x =>
                        x.NameTranslations.Any(y => y.Name.Contains(pnRequestModel.NameFilter, StringComparison.CurrentCultureIgnoreCase)));
                }

                if (!string.IsNullOrEmpty(pnRequestModel.DescriptionFilter))
                {
                    planningsQuery = planningsQuery.Where(x =>
                        x.Description.Contains(pnRequestModel.DescriptionFilter,
                            StringComparison.CurrentCultureIgnoreCase));
                }

                // sort
                if (!string.IsNullOrEmpty(pnRequestModel.Sort) && pnRequestModel.Sort != "TranslatedName")
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        planningsQuery = planningsQuery
                            .CustomOrderByDescending(pnRequestModel.Sort);
                    }
                    else
                    {
                        planningsQuery = planningsQuery
                            .CustomOrderBy(pnRequestModel.Sort);
                    }
                }
                else
                {
                    planningsQuery = planningsQuery
                        .OrderBy(x => x.Id);
                }

                if (pnRequestModel.TagIds.Any())
                {
                    // ReSharper disable once ForeachCanBeConvertedToQueryUsingAnotherGetEnumerator
                    foreach (var tagId in pnRequestModel.TagIds)
                    {
                        planningsQuery = planningsQuery.Where(x => x.PlanningsTags.Any(y =>
                            y.PlanningTagId == tagId && y.WorkflowState != Constants.WorkflowStates.Removed));
                    }
                }

                planningsQuery = planningsQuery
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed);

                // calculate total before pagination
                var total = await planningsQuery.CountAsync();

                // add select
                var localeString = await _userService.GetCurrentUserLocale();
                if (string.IsNullOrEmpty(localeString))
                {
                    return new OperationDataResult<Paged<PlanningPnModel>>(false,
                        _itemsPlanningLocalizationService.GetString("LocaleDoesNotExist"));
                }
                var language = sdkDbContext.Languages.Single(x => string.Equals(x.LanguageCode, localeString, StringComparison.CurrentCultureIgnoreCase));
                var languageIemPlanning = _dbContext.Languages.Single(x => x.Id == language.Id);
                var planningQueryWithSelect = AddSelectToPlanningQuery(planningsQuery, languageIemPlanning);


                if (pnRequestModel.Sort == "TranslatedName")
                {
                    planningQueryWithSelect = pnRequestModel.IsSortDsc
                        ? planningQueryWithSelect.OrderByDescending(x => x.TranslatedName)
                        : planningQueryWithSelect.OrderBy(x => x.TranslatedName);
                }

                planningQueryWithSelect
                    = planningQueryWithSelect
                        .Skip(pnRequestModel.Offset)
                        .Take(pnRequestModel.PageSize);

                var checkListIds = await planningsQuery.Select(x => x.RelatedEFormId).ToListAsync();
                var checkListWorkflowState = sdkDbContext.CheckLists.Where(x => checkListIds.Contains(x.Id))
                    .Select(checkList => new KeyValuePair<int, string>(checkList.Id, checkList.WorkflowState))
                    .ToList();

                // add select and take objects from db
                var plannings = await planningQueryWithSelect.ToListAsync();

                // get site names

                var assignedSitesFromPlanning = plannings.SelectMany(y => y.AssignedSites).ToList();

                var sites = await sdkDbContext.Sites
                    .AsNoTracking()
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => assignedSitesFromPlanning.Select(y => y.SiteId).Contains(x.Id))
                    .Select(x => new CommonDictionaryModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                    }).ToListAsync();

                foreach (var planning in plannings)
                {
                    foreach (var assignedSite in assignedSitesFromPlanning)
                    {
                        foreach (var site in sites.Where(site => site.Id == assignedSite.SiteId))
                        {
                            assignedSite.Name = site.Name;
                        }
                    }

                    var (_, value) = checkListWorkflowState.SingleOrDefault(x => x.Key == planning.BoundEform.RelatedEFormId);
                    planning.BoundEform.IsEformRemoved = value == Constants.WorkflowStates.Removed;

                    // This is done to update existing Plannings to using EFormSdkFolderId instead of EFormSdkFolderName
                    if ((planning.Folder.EFormSdkFolderId == 0 || planning.Folder.EFormSdkFolderId == null) && planning.Folder.EFormSdkFolderName != null)
                    {
                        var locateFolder = await sdkDbContext.Folders
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.Name == planning.Folder.EFormSdkFolderName)
                            .FirstOrDefaultAsync();

                        if (locateFolder != null)
                        {
                            var thePlanning = await _dbContext.Plannings.SingleAsync(x => x.Id == planning.Id);
                            thePlanning.SdkFolderId = locateFolder.Id;
                            await thePlanning.Update(_dbContext);
                            planning.Folder.EFormSdkFolderId = locateFolder.Id;
                        }
                    }

                    var folder = await sdkDbContext.Folders
                        .Include(x => x.Parent)
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(y => y.Id == planning.Folder.EFormSdkFolderId)
                        .Select(x => new
                        {
                            x.Name,
                            x.Parent,
                            x.Id,
                        })
                        .FirstOrDefaultAsync();
                    if (folder != null)
                    {
                        planning.Folder.EFormSdkFolderId = folder.Id;
                        if (folder.Parent != null)
                        {
                            planning.Folder.EFormSdkParentFolderName = folder.Parent.Name;
                        }
                        else
                        {
                            planning.Folder.EFormSdkFolderName = null;
                        }
                    }
                }

                var planningsModel = new Paged<PlanningPnModel>
                {
                    Total = total,
                    Entities = plannings
                };

                return new OperationDataResult<Paged<PlanningPnModel>>(true, planningsModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<Paged<PlanningPnModel>>(false,
                    _itemsPlanningLocalizationService.GetString("ErrorObtainingLists"));
            }
        }

        public async Task<OperationResult> Create(PlanningCreateModel model)
        {
            //await using var transaction = await _dbContext.Database.BeginTransactionAsync();
            var sdkCore =
                await _coreService.GetCore();
            await using var sdkDbContext = sdkCore.DbContextHelper.GetDbContext();
            try
            {
                var tagIds = new List<int>();

                tagIds.AddRange(model.TagsIds);

                var localeString = await _userService.GetCurrentUserLocale();
                if (string.IsNullOrEmpty(localeString))
                {
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("LocaleDoesNotExist"));
                }
                var language = sdkDbContext.Languages.Single(x => string.Equals(x.LanguageCode, localeString, StringComparison.CurrentCultureIgnoreCase));
                if (model.BoundEform == null)
                {
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("InfoAboutEformIsNull"));
                }
                var template = await _coreService.GetCore().Result.TemplateItemRead(model.BoundEform.RelatedEFormId, language);
                if (template == null)
                {
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("EformNotFound"));
                }
                if (model.Folder == null)
                {
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("InfoAboutFolderIsNull"));
                }
                var sdkFolder = await sdkDbContext.Folders
                    .Include(x => x.Parent)
                    .FirstOrDefaultAsync(x => x.Id == model.Folder.EFormSdkFolderId);

                if (sdkFolder == null)
                {
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("FolderNotFound"));
                }

                var planning = new Planning
                {
                    Description = model.Description,
                    BuildYear = model.BuildYear,
                    Type = model.Type,
                    LocationCode = model.LocationCode,
                    CreatedByUserId = _userService.UserId,
                    CreatedAt = DateTime.UtcNow,
                    RepeatEvery = model.Reiteration.RepeatEvery,
                    RepeatUntil = model.Reiteration.RepeatUntil,
                    RepeatType = model.Reiteration.RepeatType,
                    DayOfWeek = model.Reiteration.DayOfWeek,
                    DayOfMonth = model.Reiteration.DayOfMonth,
                    Enabled = true,
                    RelatedEFormId = model.BoundEform.RelatedEFormId,
                    RelatedEFormName = template.Label,
                    SdkFolderName = sdkFolder.Name,
                    SdkFolderId = model.Folder.EFormSdkFolderId,
                    PlanningsTags = new List<PlanningsTags>()
                };

                if (model.Reiteration.StartDate.HasValue)
                {
                    planning.StartDate = model.Reiteration.StartDate.Value;
                }
                else
                {
                    planning.StartDate = DateTime.UtcNow;
                }

                foreach (var tagId in tagIds)
                {
                    planning.PlanningsTags.Add(
                        new PlanningsTags
                        {
                            CreatedByUserId = _userService.UserId,
                            UpdatedByUserId = _userService.UserId,
                            PlanningTagId = tagId
                        });
                }

                await planning.Create(_dbContext);
                var languages = await _dbContext.Languages.ToListAsync();
                foreach (var translation in model.TranslationsName)
                {
                    var languageId = languages.Where(x => x.Name == translation.Language || x.LanguageCode == translation.LocaleName)
                        .Select(x => x.Id)
                        .FirstOrDefault();
                    if (languageId == default)
                    {
                        return new OperationResult(
                            true,
                            _itemsPlanningLocalizationService.GetString("LocaleDoesNotExist"));
                    }

                    var planningNameTranslations = new PlanningNameTranslation()
                    {
                        LanguageId = languageId,
                        PlanningId = planning.Id,
                        Name = translation.Name,
                        CreatedByUserId = _userService.UserId,
                        UpdatedByUserId = _userService.UserId
                    };
                    await planningNameTranslations.Create(_dbContext);
                }

                //await transaction.CommitAsync();
                return new OperationResult(
                    true,
                    _itemsPlanningLocalizationService.GetString("ListCreatedSuccessfully"));
            }
            catch (Exception e)
            {
                //await transaction.RollbackAsync();
                Trace.TraceError(e.Message);
                return new OperationResult(false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileCreatingList"));
            }
        }

        public async Task<OperationDataResult<PlanningPnModel>> Read(int planningId)
        {
            try
            {
                var sdkCore =
                    await _coreService.GetCore();
                await using var sdkDbContext = sdkCore.DbContextHelper.GetDbContext();
                var localeString = await _userService.GetCurrentUserLocale();
                if (string.IsNullOrEmpty(localeString))
                {
                    return new OperationDataResult<PlanningPnModel>(
                        false,
                        _itemsPlanningLocalizationService.GetString("LocaleDoesNotExist"));
                }
                var language = sdkDbContext.Languages.Single(x => string.Equals(x.LanguageCode, localeString, StringComparison.CurrentCultureIgnoreCase));
                var planningQuery = _dbContext.Plannings
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed && x.Id == planningId);
                var planning = await AddSelectToPlanningQuery(planningQuery, language).FirstOrDefaultAsync();

                if (planning == null)
                {
                    return new OperationDataResult<PlanningPnModel>(
                        false,
                        _itemsPlanningLocalizationService.GetString("ListNotFound"));
                }

                // get folder
                var folder = sdkDbContext.Folders
                    .Include(x => x.Parent)
                    .Select(x => new
                    {
                        x.Name,
                        x.Parent,
                        x.Id,
                    })
                    .FirstOrDefault(y => y.Id == planning.Folder.EFormSdkFolderId);
                if (folder != null)
                {
                    planning.Folder.EFormSdkFolderId = folder.Id;
                    if (folder.Parent != null)
                    {
                        planning.Folder.EFormSdkParentFolderName = folder.Parent.Name;
                    }
                    else
                    {
                        planning.Folder.EFormSdkFolderName = null;
                    }
                }

                // get site names
                var sites = await sdkDbContext.Sites
                    .AsNoTracking()
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => new CommonDictionaryModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                    }).ToListAsync();

                foreach (var assignedSite in planning.AssignedSites)
                {
                    foreach (var site in sites.Where(site => site.Id == assignedSite.SiteId))
                    {
                        assignedSite.Name = site.Name;
                    }
                }

                return new OperationDataResult<PlanningPnModel>(
                    true,
                    planning);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<PlanningPnModel>(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileObtainingList"));
            }
        }

        public async Task<OperationResult> Update(PlanningUpdateModel updateModel)
        {
            // await using var transaction = await _dbContext.Database.BeginTransactionAsync();
            var sdkCore =
                await _coreService.GetCore();
            await using var sdkDbContext = sdkCore.DbContextHelper.GetDbContext();
            try
            {
                var localeString = await _userService.GetCurrentUserLocale();
                if (string.IsNullOrEmpty(localeString))
                {
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("LocaleDoesNotExist"));
                }
                var language = sdkDbContext.Languages.Single(x => string.Equals(x.LanguageCode, localeString, StringComparison.CurrentCultureIgnoreCase));

                if (updateModel.BoundEform == null)
                {
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("InfoAboutEformIsNull"));
                }

                var template = await sdkCore.TemplateItemRead(updateModel.BoundEform.RelatedEFormId, language);

                if (template == null)
                {
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("EformNotFound"));
                }

                if (updateModel.Folder == null)
                {
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("InfoAboutFolderIsNull"));
                }

                var sdkFolder = await sdkDbContext.Folders
                    .Include(x => x.Parent)
                    .FirstOrDefaultAsync(x => x.Id == updateModel.Folder.EFormSdkFolderId);

                if (sdkFolder == null)
                {
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("FolderNotFound"));
                }

                var planning = await _dbContext.Plannings
                                            .Include(x => x.PlanningsTags)
                                            .FirstOrDefaultAsync(x => x.Id == updateModel.Id);

                if (planning == null)
                {
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("PlanningNotFound"));
                }

                var translationsPlanning = _dbContext.PlanningNameTranslation
                    .Where(x => x.Planning.Id == planning.Id)
                    .ToList();
                foreach (var translation in updateModel.TranslationsName)
                {
                    var updateTranslation = translationsPlanning
                        .FirstOrDefault(x => x.Id == translation.Id);
                    if (updateTranslation != null)
                    {
                        updateTranslation.Name = translation.Name;
                        await updateTranslation.Update(_dbContext);
                    }
                }

                planning.DoneByUserNameEnabled = updateModel.EnabledFields.DoneByUserNameEnabled;
                planning.NumberOfImagesEnabled = updateModel.EnabledFields.NumberOfImagesEnabled;
                planning.PlanningNumberEnabled = updateModel.EnabledFields.PlanningNumberEnabled;
                planning.UploadedDataEnabled = updateModel.EnabledFields.UploadedDataEnabled;
                planning.LocationCodeEnabled = updateModel.EnabledFields.LocationCodeEnabled;
                planning.DescriptionEnabled = updateModel.EnabledFields.DescriptionEnabled;
                planning.StartDate = updateModel.Reiteration.StartDate ?? DateTime.UtcNow;
                planning.DeployedAtEnabled = updateModel.EnabledFields.DeployedAtEnabled;
                planning.BuildYearEnabled = updateModel.EnabledFields.BuildYearEnabled;
                planning.DoneAtEnabled = updateModel.EnabledFields.DoneAtEnabled;
                planning.RelatedEFormId = updateModel.BoundEform.RelatedEFormId;
                planning.LabelEnabled = updateModel.EnabledFields.LabelEnabled;
                planning.TypeEnabled = updateModel.EnabledFields.TypeEnabled;
                planning.RepeatUntil = updateModel.Reiteration.RepeatUntil;
                planning.RepeatEvery = updateModel.Reiteration.RepeatEvery;
                planning.RepeatType = updateModel.Reiteration.RepeatType;
                planning.DayOfMonth = updateModel.Reiteration.DayOfMonth;
                planning.DayOfWeek = updateModel.Reiteration.DayOfWeek;
                planning.LocationCode = updateModel.LocationCode;
                planning.Description = updateModel.Description;
                planning.UpdatedByUserId = _userService.UserId;
                planning.BuildYear = updateModel.BuildYear;
                planning.RelatedEFormName = template.Label;
                planning.SdkFolderName = sdkFolder.Name;
                planning.SdkFolderId = updateModel.Folder.EFormSdkFolderId;
                planning.UpdatedAt = DateTime.UtcNow;
                planning.Type = updateModel.Type;

                var tagIds = planning.PlanningsTags
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => x.PlanningTagId)
                    .ToList();

                var tagsForDelete = planning.PlanningsTags
                        .Where(x => !updateModel.TagsIds.Contains(x.PlanningTagId))
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .ToList();

                var tagsForCreate = updateModel.TagsIds
                    .Where(x => !tagIds.Contains(x))
                    .ToList();

                foreach (var tag in tagsForDelete)
                {
                    _dbContext.PlanningsTags.Remove(tag);
                }

                foreach (var tagId in tagsForCreate)
                {
                    var planningsTags = new PlanningsTags
                    {
                        CreatedByUserId = _userService.UserId,
                        UpdatedByUserId = _userService.UserId,
                        PlanningId = planning.Id,
                        PlanningTagId = tagId,
                    };

                    await _dbContext.PlanningsTags.AddAsync(planningsTags);
                }

                await planning.Update(_dbContext);

                // transaction.Commit();
                return new OperationResult(
                    true,
                    _itemsPlanningLocalizationService.GetString("ListUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                // transaction.Rollback();
                return new OperationResult(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileUpdatingList"));
            }
        }

        public async Task<OperationResult> Delete(int id)
        {
            try
            {
                var planning = await _dbContext.Plannings
                    .SingleAsync(x => x.Id == id);

                if (planning == null)
                {
                    return new OperationResult(false,
                        _itemsPlanningLocalizationService.GetString("PlanningNotFound"));
                }

                await DeleteOnePlanning(planning);

                return new OperationResult(
                    true,
                    _itemsPlanningLocalizationService.GetString("ListDeletedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationResult(
                    false,
                    _itemsPlanningLocalizationService.GetString("ErrorWhileRemovingList"));
            }

        }

        private static IQueryable<PlanningPnModel> AddSelectToPlanningQuery(IQueryable<Planning> planningQueryable, Language languageIemPlanning)
        {
            return planningQueryable.Select(x => new PlanningPnModel
            {
                Id = x.Id,
                Description = x.Description,
                BuildYear = x.BuildYear,
                Type = x.Type,
                LocationCode = x.LocationCode,
                PlanningNumber = x.PlanningNumber,
                TranslationsName = x.NameTranslations.Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(y => new PlanningNameTranslations
                    {
                        Id = y.Id,
                        Language = y.Language.LanguageCode,
                        Name = y.Name,
                        LocaleName = y.Language.Name
                    }).ToList(),
                TranslatedName = x.NameTranslations
                    .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(y => y.Language.Id == languageIemPlanning.Id)
                    .Select(y => y.Name)
                    .FirstOrDefault(),
                Reiteration = new PlanningReiterationModel
                {
                    RepeatEvery = x.RepeatEvery,
                    RepeatType = x.RepeatType,
                    RepeatUntil = x.RepeatUntil,
                    DayOfWeek = x.DayOfWeek,
                    DayOfMonth = (int)x.DayOfMonth,
                    StartDate = x.StartDate,
                },
                BoundEform = new PlanningEformModel
                {
                    RelatedEFormId = x.RelatedEFormId,
                    RelatedEFormName = x.RelatedEFormName,
                },
                Folder = new PlanningFolderModel
                {
                    EFormSdkFolderName = x.SdkFolderName,
                    EFormSdkFolderId = x.SdkFolderId
                },
                AssignedSites = x.PlanningSites
                    .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(y => new PlanningAssignedSitesModel
                    {
                        Id = y.Id,
                        SiteId = y.SiteId,
                    }).ToList(),
                Tags = x.PlanningsTags
                    .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(y => new CommonDictionaryModel
                    {
                        Id = y.PlanningTagId,
                        Name = y.PlanningTag.Name
                    }).ToList(),
                TagsIds = x.PlanningsTags
                    .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(y => y.PlanningTagId).ToList(),
                EnabledFields = new PlanningFieldsModel
                {
                    PlanningNumberEnabled = x.PlanningNumberEnabled,
                    BuildYearEnabled = x.BuildYearEnabled,
                    DeployedAtEnabled = x.DeployedAtEnabled,
                    DescriptionEnabled = x.DescriptionEnabled,
                    DoneAtEnabled = x.DoneAtEnabled,
                    DoneByUserNameEnabled = x.DoneByUserNameEnabled,
                    LabelEnabled = x.LabelEnabled,
                    LocationCodeEnabled = x.LocationCodeEnabled,
                    NumberOfImagesEnabled = x.NumberOfImagesEnabled,
                    TypeEnabled = x.TypeEnabled,
                    UploadedDataEnabled = x.UploadedDataEnabled,
                }
            });
        }

        public async Task<OperationResult> MultipleDeletePlannings(List<int> planningIds)
        {
            foreach (var planningId in planningIds)
            {
                try
                {
                    var planning = await _dbContext.Plannings
                        .SingleAsync(x => x.Id == planningId);

                    if (planning == null)
                    {
                        return new OperationResult(false,
                            _itemsPlanningLocalizationService.GetString("PlanningNotFound"));
                    }

                    await DeleteOnePlanning(planning);
                }
                catch (Exception e)
                {
                    Trace.TraceError(e.Message);
                    return new OperationResult(
                        false,
                        _itemsPlanningLocalizationService.GetString("ErrorWhileRemovingList"));
                }
            }
            return new OperationResult(
                true,
                _itemsPlanningLocalizationService.GetString("ListDeletedSuccessfully"));
        }

        private async Task DeleteOnePlanning(PnBase planning)
        {
            var core = await _coreService.GetCore();
            await using var sdkDbContext = core.DbContextHelper.GetDbContext();
            var planningCases = await _dbContext.PlanningCases
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.PlanningId == planning.Id)
                .ToListAsync();

            foreach (var planningCase in planningCases)
            {
                var planningCaseSites = await _dbContext.PlanningCaseSites
                    .Where(x => x.PlanningCaseId == planningCase.Id).ToListAsync();
                foreach (var planningCaseSite in planningCaseSites
                    .Where(planningCaseSite => planningCaseSite.MicrotingSdkCaseId != 0)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed))
                {
                    var result = await sdkDbContext.Cases.SingleAsync(x => x.Id == planningCaseSite.MicrotingSdkCaseId);
                    if (result.MicrotingUid != null)
                    {
                        await core.CaseDelete((int)result.MicrotingUid);
                    }
                }
                // Delete planning case
                await planningCase.Delete(_dbContext);
            }

            var planningSites = await _dbContext.PlanningSites
                .Where(x => x.PlanningId == planning.Id)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .ToListAsync();
            foreach (var planningSite in planningSites)
            {
                await planningSite.Delete(_dbContext);
            }

            var nameTranslationsPlanning =
                await _dbContext.PlanningNameTranslation
                    .Where(x => x.Planning.Id == planning.Id)
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .ToListAsync();

            foreach (var translation in nameTranslationsPlanning)
            {
                await translation.Delete(_dbContext);
            }

            // Delete planning
            await planning.Delete(_dbContext);
        }
    }
}