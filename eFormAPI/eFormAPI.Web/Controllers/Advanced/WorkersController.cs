using System.Collections.Generic;
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Infrastructure;
using eFormShared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers.Advanced
{
    [Authorize]
    public class WorkersController : Controller
    {
        private readonly IWorkersService _workersService;

        public WorkersController(IWorkersService workersService)
        {
            _workersService = workersService;
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.Workers.Read)]
        public OperationDataResult<List<Worker_Dto>> Index()
        {
            return _workersService.Index();
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.Workers.Update)]
        public OperationDataResult<Worker_Dto> Edit(int id)
        {
            return _workersService.Edit(id);
        }

        [HttpPost]
        [Authorize(Policy = AuthConsts.EformPolicies.Workers.Update)]
        public OperationResult Update([FromBody] WorkerModel workerModel)
        {
            return _workersService.Update(workerModel);
        }

        [HttpPost]
        [Route("api/workers/create")]
        [Authorize(Policy = AuthConsts.EformPolicies.Workers.Create)]
        public OperationResult Сreate([FromBody] WorkerCreateModel model)
        {
            return _workersService.Сreate(model);
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.Workers.Delete)]
        public OperationResult Delete(int id)
        {
            return _workersService.Delete(id);
        }
    }
}