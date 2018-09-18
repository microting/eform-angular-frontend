using System.Collections.Generic;
using eFormShared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers
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
        public OperationDataResult<List<Unit_Dto>> Index()
        {
            return _unitsService.Index();
        }

        [HttpGet]
        public OperationDataResult<Unit_Dto> RequestOtp(int id)
        {
            return _unitsService.RequestOtp(id);
        }
    }
}