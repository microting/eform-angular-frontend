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

using System;
using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Infrastructure.Models;
using eFormShared;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
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
        
        public OperationDataResult<List<Folder_Dto>> Index()
        {
            _coreHelper.LogEvent("");
            var core = _coreHelper.GetCore();
            var folderDtos = core.FolderGetAll(false);
            return new OperationDataResult<List<Folder_Dto>>(true, folderDtos);
        }

        public OperationResult Сreate(FolderNameModel model)
        {
            var core = _coreHelper.GetCore();
            core.FolderCreate(model.Name, model.Description, model.ParentId);
            return new OperationResult(true);
        }

        public OperationDataResult<Folder_Dto> Edit(int id)
        {
            var core = _coreHelper.GetCore();
            var folder = core.FolderRead(id);
            return new OperationDataResult<Folder_Dto>(true, folder);
        }

        public OperationResult Update(FolderNameModel folderNameModel)
        {
            var core = _coreHelper.GetCore();
            try
            {
                core.FolderUpdate(folderNameModel.Id, folderNameModel.Name, folderNameModel.Description,
                    folderNameModel.ParentId);                
                return new OperationResult(true);
            }
            catch (Exception ex)
            {   
                _coreHelper.LogException(ex.Message);
                return new OperationResult(false);
            }
        }

        public OperationResult Delete(int id)
        {
            var core = _coreHelper.GetCore();
            try
            {
                core.FolderDelete(id);
                return new OperationResult(true);
            }
            catch
            {                
                return new OperationResult(false);
            }
        }
    }
}