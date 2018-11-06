using System.Collections.Generic;
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Infrastructure;
using eFormShared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers.Advanced
{
    [Authorize]
    public class UnitsController : Controller
    {
        private readonly IUnitsService _unitsService;

        public UnitsController(IUnitsService unitsService)
        {
            _unitsService = unitsService;
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.Units.Read)]
        public OperationDataResult<List<Unit_Dto>> Index()
        {
            return _unitsService.Index();
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.Units.Update)]
        public OperationDataResult<Unit_Dto> RequestOtp(int id)
        {
            return _unitsService.RequestOtp(id);
        }
    }
}