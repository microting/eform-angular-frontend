using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Abstractions
{
    using Infrastructure.Models.Fractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    public interface IFractionService
    {
        Task<OperationDataResult<Paged<FractionModel>>> Index(FractionRequestModel requestModel);

        Task<OperationResult> Create(FractionModel model);

        Task<OperationDataResult<FractionModel>> Read(int fractionId);

        Task<OperationResult> Update(FractionModel updateModel);

        Task<OperationResult> Delete(int id);

        Task<OperationResult> ImportFraction(FractionImportModel fractionImportModel);

        Task<OperationDataResult<Paged<StatByYearModel>>> GetFractionsStatsByYear(FractionPnYearRequestModel requestModel);

        Task<OperationDataResult<StatByMonth>> GetSingleFractionByMonth(int id, int year);
    }
}