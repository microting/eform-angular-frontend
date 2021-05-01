using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Abstractions
{
    public interface IInstallationService
    {
        Task<OperationDataResult<InstallationsModel>> Index(InstallationRequestModel requestModel);
        Task<OperationResult> Create(InstallationModel model);
        Task<OperationDataResult<InstallationModel>> Read(int installationId);
        Task<OperationResult> Update(InstallationModel updateModel);
        Task<OperationResult> Delete(int id);
    }
}
