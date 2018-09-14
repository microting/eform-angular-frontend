using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Cases.Request;
using eFormAPI.Common.Models.Cases.Response;
using eFormData;

namespace eFormAPI.Core.Abstractions
{
    public interface ICasesService
    {
        OperationDataResult<CaseListModel> Index(CaseRequestModel requestModel);
        OperationDataResult<ReplyElement> Edit(int id);
        OperationResult Delete(int id);
        OperationResult Update(ReplyRequest model);
    }
}