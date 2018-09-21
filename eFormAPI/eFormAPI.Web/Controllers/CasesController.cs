using eFormData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Models.Cases.Request;
using Microting.eFormApi.BasePn.Models.Cases.Response;

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
        public OperationDataResult<CaseListModel> Index([FromBody] CaseRequestModel requestModel)
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
        public OperationResult Update([FromBody] ReplyRequest model)
        {
            return _casesService.Update(model);
        }
    }
}