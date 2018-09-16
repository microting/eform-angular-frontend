using System;
using System.Collections.Generic;
using eFormAPI.Common.Infrastructure;
using eFormAPI.Common.Infrastructure.Helpers;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models;
using eFormAPI.Core.Abstractions;
using eFormShared;
using Microsoft.AspNetCore.Mvc;

namespace eFormAPI.Core.Services
{
    public class WorkersService : IWorkersService
    {
        private readonly IEFormCoreService _coreHelper;

        public WorkersService(IEFormCoreService coreHelper)
        {
            _coreHelper = coreHelper;
        }

        public OperationDataResult<List<Worker_Dto>> Index()
        {
            var core = _coreHelper.GetCore();
            var workersDto = core.Advanced_WorkerReadAll("not_removed", null, null);

            return new OperationDataResult<List<Worker_Dto>>(true, workersDto);
        }

        public OperationDataResult<Worker_Dto> Edit(int id)
        {
            var core = _coreHelper.GetCore();
            var workerDto = core.Advanced_WorkerRead(id);

            return new OperationDataResult<Worker_Dto>(true, workerDto);
        }

        public OperationResult Update(WorkerModel workerModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var workerDto = core.Advanced_WorkerRead(workerModel.Id);
                var isUpdated = core.Advanced_WorkerUpdate(workerModel.Id, workerModel.UserFirstName,
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


        public OperationResult Сreate(WorkerCreateModel model)
        {
            try
            {
                var core = _coreHelper.GetCore();
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
                var core = _coreHelper.GetCore();
                var workerDto = core.Advanced_WorkerRead(id);

                if (workerDto.Equals(null))
                {
                    return new OperationDataResult<SiteNameModel>(false,
                        LocaleHelper.GetString("SiteWithIdCouldNotBeDeleted", id));
                }

                return core.Advanced_WorkerDelete(id)
                    ? new OperationDataResult<SiteNameModel>(true,
                        LocaleHelper.GetString("WorkerParamDeletedSuccessfully", workerDto.FirstName,
                            workerDto.LastName))
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