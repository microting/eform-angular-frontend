using System.Collections.Generic;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models;
using eFormAPI.Core.Abstractions;
using eFormShared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eFormAPI.Web.Controllers
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
        public OperationDataResult<List<Worker_Dto>> Index()
        {
            return _workersService.Index();
        }

        [HttpGet]
        public OperationDataResult<Worker_Dto> Edit(int id)
        {
            return _workersService.Edit(id);
        }

        [HttpPost]
        public OperationResult Update([FromBody] WorkerModel workerModel)
        {
            return _workersService.Update(workerModel);
        }

        [HttpPost]
        [Route("api/workers/create")]
        public OperationResult Сreate([FromBody] WorkerCreateModel model)
        {
            return _workersService.Сreate(model);
        }

        [HttpGet]
        public OperationResult Delete(int id)
        {
            return _workersService.Delete(id);
        }
    }
}