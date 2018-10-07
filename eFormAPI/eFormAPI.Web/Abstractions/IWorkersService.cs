using System.Collections.Generic;
using eFormShared;
using Microting.eFormApi.BasePn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions
{
    public interface IWorkersService
    {
        OperationDataResult<List<Worker_Dto>> Index();
        OperationDataResult<Worker_Dto> Edit(int id);
        OperationResult Update(WorkerModel workerModel);
        OperationResult Сreate(WorkerCreateModel model);
        OperationResult Delete(int id);
    }
}