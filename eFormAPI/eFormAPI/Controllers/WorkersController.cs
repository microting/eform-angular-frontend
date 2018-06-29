using System;
using System.Collections.Generic;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Models;
using eFormCore;
using eFormShared;
using EformBase.Pn.Infrastructure;
using EformBase.Pn.Infrastructure.Helpers;
using EformBase.Pn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class WorkersController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpGet]
        public OperationDataResult<List<Worker_Dto>> Index()
        {
            Core core = _coreHelper.GetCore();
            var workersDto = core.Advanced_WorkerReadAll("not_removed", null, null);

            return new OperationDataResult<List<Worker_Dto>>(true, workersDto);
        }

        [HttpGet]
        public OperationDataResult<Worker_Dto> Edit(int id)
        {
            Core core = _coreHelper.GetCore();
            var workerDto = core.Advanced_WorkerRead(id);

            return new OperationDataResult<Worker_Dto>(true, workerDto);
        }

        [HttpPost]
        public OperationResult Update(WorkerModel workerModel)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                var workerDto = core.Advanced_WorkerRead(workerModel.Id);
                bool isUpdated = core.Advanced_WorkerUpdate(workerModel.Id, workerModel.UserFirstName,
                    workerModel.UserLastName, workerDto.Email);

                return isUpdated
                    ? new OperationResult(true, LocaleHelper.GetString("WorkerParamWasUpdated", workerModel.Id))
                    : new OperationResult(false, LocaleHelper.GetString("WorkerParamCantBeUpdated", workerModel.Id));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("WorkerParamCantBeUpdated", workerModel.Id));
            }
        }

        [HttpPost]
        [Route("api/workers/create")]
        public OperationResult Сreate(WorkerCreateModel model)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                var workerDto = core.Advanced_WorkerCreate(model.FirstName, model.LastName,
                    model.SiteId + "." + model.CustomerNo + "@invalid.invalid");
                var createdWorker =
                    core.Advanced_SiteWorkerCreate(new SiteName_Dto(model.SiteId, "", null, null), workerDto);

                return new OperationResult(true, LocaleHelper.GetString("WorkerWasSuccessfullyCreated"));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("ErrorWhileCreatingWorker"));
            }
        }

        [HttpGet]
        public OperationResult Delete(int id)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                var workerDto = core.Advanced_WorkerRead(id);

                if (workerDto.Equals(null))
                {
                    return new OperationDataResult<SiteNameModel>(false, LocaleHelper.GetString("SiteWithIdCouldNotBeDeleted", id));
                }

                return core.Advanced_WorkerDelete(id)
                    ? new OperationDataResult<SiteNameModel>(true,
                        LocaleHelper.GetString("WorkerParamDeletedSuccessfully", workerDto.FirstName, workerDto.LastName))
                    : new OperationDataResult<SiteNameModel>(false,
                        LocaleHelper.GetString("WorkerParamCantBeDeted", workerDto.FirstName, workerDto.LastName));
            }

            catch (Exception)
            {
                return new OperationDataResult<SiteNameModel>(false,
                    LocaleHelper.GetString("SiteWithIdCouldNotBeDeleted", id));
            }
        }
    }
}