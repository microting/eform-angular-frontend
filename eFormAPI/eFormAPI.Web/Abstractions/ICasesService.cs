using eFormData;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Cases.Request;
using Microting.eFormApi.BasePn.Infrastructure.Models.Cases.Response;

namespace eFormAPI.Web.Abstractions
{
    public interface ICasesService
    {
        OperationDataResult<CaseListModel> Index(CaseRequestModel requestModel);
        OperationDataResult<ReplyElement> GetCase(int id);
        OperationResult Delete(int id);
        OperationResult Update(ReplyRequest model);
    }
}