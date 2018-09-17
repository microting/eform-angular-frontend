using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models.Cases.Request;
using eFormAPI.BasePn.Models.Cases.Response;
using eFormData;

namespace eFormAPI.BasePn.Abstractions
{
    public interface ICasesService
    {
        OperationDataResult<CaseListModel> Index(CaseRequestModel requestModel);
        OperationDataResult<ReplyElement> Edit(int id);
        OperationResult Delete(int id);
        OperationResult Update(ReplyRequest model);
    }
}