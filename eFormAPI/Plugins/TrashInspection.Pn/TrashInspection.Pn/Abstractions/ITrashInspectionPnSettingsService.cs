using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Abstractions
{
    public interface ITrashInspectionPnSettingsService
    {
        Task<OperationDataResult<TrashInspectionBaseSettings>> GetSettings();
        Task<OperationResult> UpdateSettings(TrashInspectionBaseSettings trashInspectionSettingsModel);
        OperationDataResult<TrashInspectionBaseToken> GetToken();
    }
}
