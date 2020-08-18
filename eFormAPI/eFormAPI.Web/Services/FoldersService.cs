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
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public class FoldersService : IFoldersService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;
        
        public FoldersService(IEFormCoreService coreHelper, 
            ILocalizationService localizationService)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
        }

        public async Task<OperationDataResult<List<FolderDtoModel>>> List()
        {
            try
            {
                var core = await _coreHelper.GetCore();
                await using var dbContext = core.dbContextHelper.GetDbContext();
                var folders = await dbContext.folders
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
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
                Console.WriteLine(e);
                throw;
            }
        }

        public async Task<OperationDataResult<List<FolderDtoModel>>> Index()
        {
            try
            {
                var core = await _coreHelper.GetCore();
                await using var dbContext = core.dbContextHelper.GetDbContext();
                var folders = await dbContext.folders
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
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

                var treeResult = folders.BuildTree().ToList();
                return new OperationDataResult<List<FolderDtoModel>>(true, treeResult);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public async Task<OperationResult> Create(FolderCreateModel createModel)
        {
            var core = await _coreHelper.GetCore();
            await core.FolderCreate(createModel.Name, createModel.Description, createModel.ParentId);
            return new OperationResult(true);
        }

        public async Task<OperationDataResult<FolderDtoModel>> Edit(int id)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                await using var dbContext = core.dbContextHelper.GetDbContext();
                var folder = await dbContext.folders
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
                        _localizationService.GetString(""));
                }

                return new OperationDataResult<FolderDtoModel>(true, folder);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return new OperationDataResult<FolderDtoModel>(
                    false,
                    _localizationService.GetString(""));
            }
        }

        public async Task<OperationResult> Update(FolderUpdateModel folderUpdateModel)
        {
            var core = await _coreHelper.GetCore();
            try
            {
                await core.FolderUpdate(
                    folderUpdateModel.Id,
                    folderUpdateModel.Name,
                    folderUpdateModel.Description,
                    folderUpdateModel.ParentId);

                return new OperationResult(true);
            }
            catch (Exception ex)
            {   
                _coreHelper.LogException(ex.Message);
                return new OperationResult(false);
            }
        }

        public async Task<OperationResult> Delete(int id)
        {
            var core = await _coreHelper.GetCore();
            try
            {
                await core.FolderDelete(id);
                return new OperationResult(true);
            }
            catch
            {                
                return new OperationResult(false);
            }
        }
    }
}