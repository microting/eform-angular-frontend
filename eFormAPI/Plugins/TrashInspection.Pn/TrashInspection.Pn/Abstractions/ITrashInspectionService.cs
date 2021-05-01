using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Abstractions
{
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    public interface ITrashInspectionService
    {
        Task<OperationDataResult<Paged<TrashInspectionModel>>> Index(TrashInspectionRequestModel requestModel);
        Task<OperationResult> Create(TrashInspectionModel model);
        Task<OperationDataResult<TrashInspectionModel>> Read(int trashInspectionId);
        Task<OperationDataResult<TrashInspectionModel>> Read(string weighingNumber, string token);
        Task<OperationResult> Update(TrashInspectionModel updateModel);
        Task<OperationResult> Delete(int trashInspectionId);
        Task<OperationResult> Delete(string weighingNumber, string token);
        Task<OperationDataResult<TrashInspectionCaseVersionsModel>> IndexVersions(int trashInspectionId);
        Task<OperationDataResult<TrashInspectionVersionsModel>> ReadVersion(int trashInspectionId);
        Task<string> DownloadEFormPdf(string weighingNumber, string token, string fileType);
    }
}
