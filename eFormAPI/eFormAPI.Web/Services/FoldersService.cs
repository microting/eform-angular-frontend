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

using Microting.eForm.Infrastructure;

namespace eFormAPI.Web.Services
{
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
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public class FoldersService : IFoldersService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;
        private readonly ILogger<FoldersService> _logger;
        public FoldersService(IEFormCoreService coreHelper,
            ILocalizationService localizationService,
            ILogger<FoldersService> logger)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
            _logger = logger;
        }

        public async Task<OperationDataResult<List<FolderDtoModel>>> List()
        {
            try
            {
                var core = await _coreHelper.GetCore();
                await using var dbContext = core.DbContextHelper.GetDbContext();
                var folders = await dbContext.Folders
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .OrderBy(x => x.Name)
                    .Select(x => new FolderDtoModel
                    {
                        Id = x.Id,
                        CreatedAt = x.CreatedAt,
                        Description = x.Description,
                        MicrotingUId = x.MicrotingUid,
                        Name = x.Name,
                        ParentId = x.ParentId,
                        UpdatedAt = x.UpdatedAt,
                    }).ToListAsync();

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
                var folders = await dbContext.Folders
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .OrderBy(x => x.Name)
                    .Select(x => new FolderDtoModel
                    {
                        Id = x.Id,
                        CreatedAt = x.CreatedAt,
                        Description = x.Description,
                        MicrotingUId = x.MicrotingUid,
                        Name = x.Name,
                        ParentId = x.ParentId,
                        UpdatedAt = x.UpdatedAt,
                    }).ToListAsync();

                var treeResult = new List<FolderDtoModel>();

                if (folders.Count > 0)
                {
                    treeResult = folders.BuildTree().ToList();
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

                List<KeyValuePair<string, string>> names = new List<KeyValuePair<string, string>>();
                List<KeyValuePair<string, string>> descriptions = new List<KeyValuePair<string, string>>();

                names.Add(new KeyValuePair<string, string> ("da", createModel.Name));
                descriptions.Add(new KeyValuePair<string, string>("da",createModel.Description.Replace("&nbsp;", " ")));
                await core.FolderCreate(names, descriptions, createModel.ParentId); // creating the folder in Danish as default
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

        public async Task<OperationDataResult<FolderDtoModel>> Edit(int id)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                await using var dbContext = core.DbContextHelper.GetDbContext();
                var folder = await dbContext.Folders
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Where(x => x.Id == id)
                    .Select(x => new FolderDtoModel
                    {
                        Id = x.Id,
                        Name = x.Name,
                        CreatedAt = x.CreatedAt,
                        Description = x.Description,
                        MicrotingUId = x.MicrotingUid,
                        ParentId = x.ParentId,
                        UpdatedAt = x.UpdatedAt,
                    }).FirstOrDefaultAsync();

                if (folder == null)
                {
                    return new OperationDataResult<FolderDtoModel>(
                        false,
                        _localizationService.GetString("FolderNotFound"));
                }

                return new OperationDataResult<FolderDtoModel>(true, folder);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationDataResult<FolderDtoModel>(
                    false,
                    _localizationService.GetString("ErrorWhileObtainingFoldersInfo"));
            }
        }

        public async Task<OperationResult> Update(FolderUpdateModel folderUpdateModel)
        {
            var core = await _coreHelper.GetCore();
            try
            {
                List<KeyValuePair<string, string>> names = new List<KeyValuePair<string, string>>();
                List<KeyValuePair<string, string>> descriptions = new List<KeyValuePair<string, string>>();

                names.Add(new KeyValuePair<string, string> ("da", folderUpdateModel.Name));
                descriptions.Add(new KeyValuePair<string, string>("da",folderUpdateModel.Description.Replace("&nbsp;", " ")));
                await core.FolderUpdate(
                    folderUpdateModel.Id,
                    names,
                    descriptions,
                    folderUpdateModel.ParentId);

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
            try
            {
                await DeleteChildren(id);
                await core.FolderDelete(id);
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

        private async Task DeleteChildren(int id)
        {
            var core = await _coreHelper.GetCore();
            await using MicrotingDbContext dbContext = core.DbContextHelper.GetDbContext();
            var list = await dbContext.Folders.Where(x => x.ParentId == id).ToListAsync();
            foreach (var folder in list)
            {
                var sublist = await dbContext.Folders.Where(x => x.ParentId == folder.Id).ToListAsync();
                if (sublist.Any())
                {
                    foreach (var subfolder in sublist)
                    {
                        await DeleteChildren(subfolder.Id);
                    }
                }
                await core.FolderDelete(folder.Id);
            }
        }
    }
}