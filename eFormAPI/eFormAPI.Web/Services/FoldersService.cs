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


namespace eFormAPI.Web.Services;

using System.Linq;
using Infrastructure.Helpers;
using Infrastructure.Models.Folders;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure.Constants;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abstractions;
using Abstractions.Advanced;
using Microsoft.Extensions.Logging;
using Microting.eForm.Infrastructure.Models;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eForm.Infrastructure.Data.Entities;

public class FoldersService : IFoldersService
{
    private readonly IEFormCoreService _coreHelper;
    private readonly ILocalizationService _localizationService;
    private readonly ILogger<FoldersService> _logger;
    private readonly IUserService _userService;
    public FoldersService(IEFormCoreService coreHelper,
        ILocalizationService localizationService,
        IUserService userService,
        ILogger<FoldersService> logger)
    {
        _coreHelper = coreHelper;
        _localizationService = localizationService;
        _userService = userService;
        _logger = logger;
    }

    public async Task<OperationDataResult<List<FolderDtoModel>>> List()
    {
        try
        {
            var core = await _coreHelper.GetCore();
            await using var dbContext = core.DbContextHelper.GetDbContext();
            var language = await _userService.GetCurrentUserLanguage();
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
            _logger.LogError(e, e.Message);
            return new OperationDataResult<List<FolderDtoModel>>(
                false,
                _localizationService.GetString("ErrorWhileObtainingFoldersInfo"));
        }
    }

    public async Task<OperationDataResult<List<FolderDtoModel>>> Index()
    {
        try
        {
            var core = await _coreHelper.GetCore();
            await using var dbContext = core.DbContextHelper.GetDbContext();
            var language = await _userService.GetCurrentUserLanguage();
            var folderQuery = dbContext.Folders
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.FolderTranslations.Any(y =>
                    y.LanguageId == language.Id && !string.IsNullOrEmpty(y.Name)));
            var folders = await AddSelectToQueryForList(folderQuery, language.Id)
                .OrderBy(x => x.Name)
                .ToListAsync();

            var treeResult = new List<FolderDtoModel>();

            if (folders.Count > 0)
            {
                treeResult = FoldersHelper.BuildTreeV2(folders);
                //treeResult = folders.BuildTree().ToList();
            }
            return new OperationDataResult<List<FolderDtoModel>>(true, treeResult);
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);
            return new OperationDataResult<List<FolderDtoModel>>(
                false,
                _localizationService.GetString("ErrorWhileObtainingFoldersInfo"));
        }
    }

    public async Task<OperationResult> Create(FolderCreateModel createModel)
    {
        try
        {
            var core = await _coreHelper.GetCore();

            //var names = new List<KeyValuePair<string, string>>();
            //var descriptions = new List<KeyValuePair<string, string>>();
            //await using var sdkDbContext = core.DbContextHelper.GetDbContext();

            //var languages = await sdkDbContext.Languages
            //    .Select(x => new { x.LanguageCode, x.Id })
            //    .ToListAsync();

            //foreach (var folderTranslationModel in createModel.Translations)
            //{
            //    var languageCode = languages
            //        .First(y => y.Id == folderTranslationModel.LanguageId).LanguageCode;
            //    names.Add(new KeyValuePair<string, string>(languageCode, folderTranslationModel.Name));
            //    descriptions.Add(
            //        new KeyValuePair<string, string>(languageCode, folderTranslationModel.Description));
            //}

            //await core.FolderCreate(names, descriptions, createModel.ParentId); // creating the folder in Danish as default

            var folderTranslations = createModel.Translations
                .Select(x => new CommonTranslationsModel
                {
                    Name = x.Name,
                    Description = x.Description,
                    LanguageId = x.LanguageId
                }).ToList();

            await core.FolderCreate(folderTranslations, createModel.ParentId); // creating the folder in Danish as default
            return new OperationResult(true);
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);
            return new OperationResult(
                false,
                _localizationService.GetString("ErrorWhileCreatingFolder"));
        }
    }

    public async Task<OperationDataResult<FolderModel>> Read(int id)
    {
        try
        {
            var core = await _coreHelper.GetCore();
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
                    _localizationService.GetString("FolderNotFound"));
            }

            return new OperationDataResult<FolderModel>(true, folder);
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);
            return new OperationDataResult<FolderModel>(
                false,
                _localizationService.GetString("ErrorWhileObtainingFoldersInfo"));
        }
    }

    public async Task<OperationResult> Update(FolderUpdateModel folderUpdateModel)
    {
        var core = await _coreHelper.GetCore();
        try
        {
            await using var sdkDbContext = core.DbContextHelper.GetDbContext();
            //var names = new List<KeyValuePair<string, string>>();
            //var descriptions = new List<KeyValuePair<string, string>>();
            //var languages = await sdkDbContext.Languages
            //    .Select(x => new {x.LanguageCode, x.Id})
            //    .ToListAsync();

            //foreach (var folderTranslationModel in folderUpdateModel.Translations)
            //{
            //    var languageCode = languages
            //        .First(y => y.Id == folderTranslationModel.LanguageId).LanguageCode;
            //    names.Add(new KeyValuePair<string, string>(languageCode, folderTranslationModel.Name));
            //    descriptions.Add(
            //        new KeyValuePair<string, string>(languageCode, folderTranslationModel.Description));
            //}

            var folder = await sdkDbContext.Folders.SingleOrDefaultAsync(x => x.Id == folderUpdateModel.Id);

            //await core.FolderUpdate(
            //    folderUpdateModel.Id,
            //    names,
            //    descriptions,
            //    folder.ParentId);

            var folderTranslations = folderUpdateModel.Translations
                .Select(x => new CommonTranslationsModel
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
            _coreHelper.LogException(e.Message);
            _logger.LogError(e, e.Message);
            return new OperationResult(
                false,
                _localizationService.GetString("ErrorWhileUpdatingFolder"));
        }
    }

    public async Task<OperationResult> Delete(int id)
    {
        var core = await _coreHelper.GetCore();
        var sdkDbContext = core.DbContextHelper.GetDbContext();
        try
        {
            await FoldersHelper.DeleteFolder(core, sdkDbContext, id);
            //await DeleteChildren(id);
            //await core.FolderDelete(id);
            return new OperationResult(true);
        }
        catch (Exception e)
        {
            _coreHelper.LogException(e.Message);
            _logger.LogError(e, e.Message);
            return new OperationResult(
                false,
                _localizationService.GetString("ErrorWhileRemovingFolder"));
        }
    }

    //private async Task DeleteChildren(int id)
    //{
    //    var core = await _coreHelper.GetCore();
    //    await using MicrotingDbContext dbContext = core.DbContextHelper.GetDbContext();
    //    var list = await dbContext.Folders.Where(x => x.ParentId == id).ToListAsync();
    //    foreach (var folder in list)
    //    {
    //        var sublist = await dbContext.Folders.Where(x => x.ParentId == folder.Id).ToListAsync();
    //        if (sublist.Any())
    //        {
    //            foreach (var subfolder in sublist)
    //            {
    //                await DeleteChildren(subfolder.Id);
    //            }
    //        }
    //        await core.FolderDelete(folder.Id);
    //    }
    //}

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
}