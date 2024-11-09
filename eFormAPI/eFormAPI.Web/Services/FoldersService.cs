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
using Abstractions.Advanced;
using Infrastructure.Helpers;
using Infrastructure.Models.Folders;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class FoldersService(
    IEFormCoreService coreHelper,
    ILocalizationService localizationService,
    IUserService userService,
    ILogger<FoldersService> logger)
    : IFoldersService
{
    public async Task<OperationDataResult<List<FolderDtoModel>>> List()
    {
        try
        {
            var core = await coreHelper.GetCore();
            await using var dbContext = core.DbContextHelper.GetDbContext();
            var language = await userService.GetCurrentUserLanguage();
            var folderQuery = dbContext.Folders
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.FolderTranslations.Any(y =>
                    y.LanguageId == language.Id && !string.IsNullOrEmpty(y.Name)));
            var folders = await AddSelectToQueryForList(folderQuery, language.Id)
                .OrderBy(x => x.Name)
                .ToListAsync();

            return new OperationDataResult<List<FolderDtoModel>>(true, folders);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<List<FolderDtoModel>>(
                false,
                localizationService.GetString("ErrorWhileObtainingFoldersInfo"));
        }
    }

    public async Task<OperationDataResult<List<FolderDtoModel>>> Index()
    {
        try
        {
            var core = await coreHelper.GetCore();
            await using var dbContext = core.DbContextHelper.GetDbContext();
            var language = await userService.GetCurrentUserLanguage();
            var folders = await dbContext.Folders
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Include(x => x.FolderTranslations)
                .Where(x => x.FolderTranslations.Any(y =>
                    y.LanguageId == language.Id && !string.IsNullOrEmpty(y.Name)))
                .ToListAsync();

            var treeResult = folders
                .Where(f => f.ParentId == null)
                .Select(f => MapFolder(f, folders, language))
                .OrderBy(x => x.Name)
                .ToList();
            return new OperationDataResult<List<FolderDtoModel>>(true, treeResult);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<List<FolderDtoModel>>(
                false,
                localizationService.GetString("ErrorWhileObtainingFoldersInfo"));
        }
    }

    public async Task<OperationResult> Create(FolderCreateModel createModel)
    {
        try
        {
            var core = await coreHelper.GetCore();

            var folderTranslations = createModel.Translations
                .Select(x => new Microting.eForm.Infrastructure.Models.CommonTranslationsModel
                {
                    Name = x.Name,
                    Description = x.Description,
                    LanguageId = x.LanguageId
                }).ToList();

            await core.FolderCreate(folderTranslations,
                createModel.ParentId); // creating the folder in Danish as default
            return new OperationResult(true);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(
                false,
                localizationService.GetString("ErrorWhileCreatingFolder"));
        }
    }

    public async Task<OperationDataResult<FolderModel>> Read(int id)
    {
        try
        {
            var core = await coreHelper.GetCore();
            await using var sdkDbContext = core.DbContextHelper.GetDbContext();

            var query = sdkDbContext.Folders
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.Id == id);

            var folder = await AddSelectToQueryForRead(query)
                .FirstOrDefaultAsync();

            if (folder == null)
            {
                return new OperationDataResult<FolderModel>(
                    false,
                    localizationService.GetString("FolderNotFound"));
            }

            return new OperationDataResult<FolderModel>(true, folder);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<FolderModel>(
                false,
                localizationService.GetString("ErrorWhileObtainingFoldersInfo"));
        }
    }

    public async Task<OperationResult> Update(FolderUpdateModel folderUpdateModel)
    {
        var core = await coreHelper.GetCore();
        try
        {
            await using var sdkDbContext = core.DbContextHelper.GetDbContext();

            var folder = await sdkDbContext.Folders.SingleOrDefaultAsync(x => x.Id == folderUpdateModel.Id);

            var folderTranslations = folderUpdateModel.Translations
                .Select(x => new Microting.eForm.Infrastructure.Models.CommonTranslationsModel
                {
                    Name = x.Name,
                    Description = x.Description,
                    LanguageId = x.LanguageId
                }).ToList();

            await core.FolderUpdate(folderUpdateModel.Id, folderTranslations, folder.ParentId);

            return new OperationResult(true);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(
                false,
                localizationService.GetString("ErrorWhileUpdatingFolder"));
        }
    }

    public async Task<OperationResult> Delete(int id)
    {
        var core = await coreHelper.GetCore();
        var sdkDbContext = core.DbContextHelper.GetDbContext();
        try
        {
            await FoldersHelper.DeleteFolder(core, sdkDbContext, id);
            return new OperationResult(true);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationResult(
                false,
                localizationService.GetString("ErrorWhileRemovingFolder"));
        }
    }

    public async Task<OperationDataResult<List<CommonDictionaryModel>>> CommonDictionaryModel(bool fullname,
        List<int> filterFolderIds, bool getOnlyChildFolders)
    {
        try
        {
            var core = await coreHelper.GetCore();
            await using var sdkDbContext = core.DbContextHelper.GetDbContext();
            var userLanguage = await userService.GetCurrentUserLanguage();
            var folders = await sdkDbContext.Folders
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Include(x => x.FolderTranslations)
                .ToListAsync();

            var folderList = folders
                .Where(f => f.ParentId == null)
                .Select(f => MapFolder(f, folders, userLanguage))
                .Where(x => !filterFolderIds.Any() || HaveFolderWithId(filterFolderIds, x))
                .SelectMany(x => MapFolder(x, fullname, getOnlyChildFolders))
                .ToList();
            return new OperationDataResult<List<CommonDictionaryModel>>(true, folderList);
        }
        catch (Exception e)
        {
            SentrySdk.CaptureException(e);
            logger.LogError(e.Message);
            logger.LogTrace(e.StackTrace);
            return new OperationDataResult<List<CommonDictionaryModel>>(
                false,
                localizationService.GetString("ErrorWhileObtainingFoldersInfo"));
        }
    }

    private static IQueryable<FolderModel> AddSelectToQueryForRead(IQueryable<Folder> query)
    {
        return query.Select(x => new FolderModel
        {
            Id = x.Id,
            ParentId = x.ParentId,
            Translations = x.FolderTranslations
                .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                .OrderBy(y => y.LanguageId)
                .Select(y => new FolderTranslationModel
                {
                    Name = y.Name,
                    Description = y.Description,
                    LanguageId = y.LanguageId
                }).ToList()
        });
    }

    private static IQueryable<FolderDtoModel> AddSelectToQueryForList(IQueryable<Folder> query, int languageId)
    {
        return query.Select(x => new FolderDtoModel
        {
            Id = x.Id,
            CreatedAt = x.CreatedAt,
            Description = x.FolderTranslations
                .First(y => y.LanguageId == languageId)
                .Description,
            MicrotingUId = x.MicrotingUid,
            Name = x.FolderTranslations
                .First(y => y.LanguageId == languageId)
                .Name,
            ParentId = x.ParentId,
            UpdatedAt = x.UpdatedAt
        });
    }

    private static FolderDtoModel MapFolder(Folder folder, List<Folder> allFolders, Language userLanguage)
    {
        var propertyFolderModel = new FolderDtoModel
        {
            Id = folder.Id,
            Name = folder.FolderTranslations
                .Where(x => x.LanguageId == userLanguage.Id)
                .Select(x => x.Name)
                .FirstOrDefault(),
            Description = folder.FolderTranslations
                .Where(x => x.LanguageId == userLanguage.Id)
                .Select(x => x.Description)
                .FirstOrDefault(),
            MicrotingUId = folder.MicrotingUid,
            ParentId = folder.ParentId,
            Children = new List<FolderDtoModel>(),
        };

        foreach (var childFolder in allFolders.Where(f => f.ParentId == folder.Id))
        {
            propertyFolderModel.Children.Add(MapFolder(childFolder, allFolders, userLanguage));
        }

        return propertyFolderModel;
    }

    private static List<CommonDictionaryModel> MapFolder(FolderDtoModel folder, bool useFullName = true,
        bool getOnlyChildFolders = true, string rootFolderName = "")
    {
        var result = new List<CommonDictionaryModel>();
        var fullName = useFullName
            ? string.IsNullOrEmpty(rootFolderName)
                ? folder.Name
                : $"{rootFolderName} - {folder.Name}"
            : folder.Name;

        if (!getOnlyChildFolders || !folder.Children.Any())
        {
            result.Add(new CommonDictionaryModel
            {
                Id = folder.Id,
                Description = folder.Description,
                Name = fullName
            });
        }

        foreach (var childFolder in folder.Children)
        {
            result.AddRange(MapFolder(childFolder, useFullName, getOnlyChildFolders, fullName));
        }

        return result;
    }

    private static bool HaveFolderWithId(List<int> folderIds, FolderDtoModel folder)
    {
        return folderIds.Contains(folder.Id) || folder.Children.Any(f => HaveFolderWithId(folderIds, f));
    }
}