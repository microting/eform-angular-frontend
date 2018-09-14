using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Cases.Request;
using eFormAPI.Common.Models.Cases.Response;
using eFormAPI.Core.Abstractions;
using eFormData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class CasesController : Controller
    {
        private readonly ICasesService _casesService;

        public CasesController(ICasesService casesService)
        {
            _casesService = casesService;
        }

        [HttpPost]
        public OperationDataResult<CaseListModel> Index(CaseRequestModel requestModel)
        {
            return _casesService.Index(requestModel);
        }

        [HttpGet]
        public OperationDataResult<ReplyElement> Edit(int id)
        {
            return _casesService.Edit(id);
        }

        [HttpGet]
        public OperationResult Delete(int id)
        {
            return _casesService.Delete(id);
        }

        [HttpPost]
        public OperationResult Update(ReplyRequest model)
        {
            return _casesService.Update(model);
        }
    }
}