using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Abstractions
{
    public interface ISegmentService
    {
        Task<OperationDataResult<SegmentsModel>> Index(SegmentRequestModel requestModel);
        Task<OperationResult> Create(SegmentModel model);
        Task<OperationDataResult<SegmentModel>> Read(int fractionId);
        Task<OperationResult> Update(SegmentModel updateModel);
        Task<OperationResult> Delete(int id);
    }
}