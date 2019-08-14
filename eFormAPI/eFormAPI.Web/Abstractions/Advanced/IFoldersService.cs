using System.Collections.Generic;
using eFormAPI.Web.Infrastructure.Models;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions.Advanced
{
    public interface IFoldersService
    {
        OperationDataResult<List<Folder_Dto>> Index();
        OperationResult Сreate(FolderNameModel model);
        OperationDataResult<Folder_Dto> Edit(int id);
        OperationResult Update(FolderNameModel folderNameModel);
        OperationResult Delete(int id);
        
    }
}