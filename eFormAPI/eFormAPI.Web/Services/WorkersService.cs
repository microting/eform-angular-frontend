using System;
using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormCore;
using eFormShared;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
    public class WorkersService : IWorkersService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;

        public WorkersService(IEFormCoreService coreHelper, 
            ILocalizationService localizationService)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
        }

        public OperationDataResult<List<Worker_Dto>> Index()
        {
            Core core = _coreHelper.GetCore();
            List<Worker_Dto> workersDto = core.Advanced_WorkerReadAll("not_removed", null, null);

            return new OperationDataResult<List<Worker_Dto>>(true, workersDto);
        }

        public OperationDataResult<Worker_Dto> Edit(int id)
        {
            Core core = _coreHelper.GetCore();
            Worker_Dto workerDto = core.Advanced_WorkerRead(id);

            return new OperationDataResult<Worker_Dto>(true, workerDto);
        }

        public OperationResult Update(WorkerModel workerModel)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                Worker_Dto workerDto = core.Advanced_WorkerRead(workerModel.Id);
                bool isUpdated = core.Advanced_WorkerUpdate(workerModel.Id, workerModel.UserFirstName,
                    workerModel.UserLastName, workerDto.Email);

                return isUpdated
                    ? new OperationResult(true, _localizationService.GetString("WorkerParamWasUpdated", workerModel.Id))
                    : new OperationResult(false, _localizationService.GetString("WorkerParamCantBeUpdated", workerModel.Id));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("WorkerParamCantBeUpdated", workerModel.Id));
            }
        }


        public OperationResult Сreate(WorkerCreateModel model)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                Worker_Dto workerDto = core.Advanced_WorkerCreate(model.FirstName, model.LastName,
                    model.SiteId + "." + model.CustomerNo + "@invalid.invalid");
                Site_Worker_Dto createdWorker =
                    core.Advanced_SiteWorkerCreate(new SiteName_Dto(model.SiteId, "", null, null), workerDto);

                return new OperationResult(true, _localizationService.GetString("WorkerWasSuccessfullyCreated"));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("ErrorWhileCreatingWorker"));
            }
        }

        [HttpGet]
        public OperationResult Delete(int id)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                Worker_Dto workerDto = core.Advanced_WorkerRead(id);

                if (workerDto.Equals(null))
                {
                    return new OperationDataResult<SiteNameModel>(false,
                        _localizationService.GetString("SiteWithIdCouldNotBeDeleted", id));
                }

                return core.Advanced_WorkerDelete(id)
                    ? new OperationDataResult<SiteNameModel>(true,
                        _localizationService.GetString("WorkerParamDeletedSuccessfully", workerDto.FirstName,
                            workerDto.LastName))
                    : new OperationDataResult<SiteNameModel>(false,
                        _localizationService.GetString("WorkerParamCantBeDeted", workerDto.FirstName, workerDto.LastName));
            }

            catch (Exception)
            {
                return new OperationDataResult<SiteNameModel>(false,
                    _localizationService.GetString("SiteWithIdCouldNotBeDeleted", id));
            }
        }
    }
}