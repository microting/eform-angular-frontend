using eFormAPI.Web.Infrastructure.Models.Cases.Request;
using eFormAPI.Web.Infrastructure.Models.Cases.Response;
using eFormData;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions.Eforms
{
    public interface ICasesService
    {
        OperationDataResult<CaseListModel> Index(CaseRequestModel requestModel);
        OperationDataResult<ReplyElement> GetCase(int id);
        OperationResult Delete(int id);
        OperationResult Update(ReplyRequest model);
    }
}