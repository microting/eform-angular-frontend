using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure;
using eFormData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Cases.Request;
using Microting.eFormApi.BasePn.Infrastructure.Models.Cases.Response;

namespace eFormAPI.Web.Controllers.Eforms
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
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.CasesRead)]
        public OperationDataResult<CaseListModel> Index([FromBody] CaseRequestModel requestModel)
        {
            return _casesService.Index(requestModel);
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.CaseRead)]
        public OperationDataResult<ReplyElement> GetCase(int id)
        {
            return _casesService.GetCase(id);
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.CasesDelete)]
        public OperationResult Delete(int id)
        {
            return _casesService.Delete(id);
        }

        [HttpPost]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.CasesUpdate)]
        public OperationResult Update([FromBody] ReplyRequest model)
        {
            return _casesService.Update(model);
        }
    }
}