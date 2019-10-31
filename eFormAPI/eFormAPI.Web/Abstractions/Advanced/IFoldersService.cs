using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions.Advanced
{
    public interface IFoldersService
    {
        Task<OperationDataResult<List<Folder_Dto>>> Index();
        Task<OperationResult> Сreate(FolderNameModel model);
        Task<OperationDataResult<Folder_Dto>> Edit(int id);
        Task<OperationResult> Update(FolderNameModel folderNameModel);
        Task<OperationResult> Delete(int id);
        
    }
}