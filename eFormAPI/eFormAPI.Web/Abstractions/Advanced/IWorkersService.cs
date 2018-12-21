using System.Collections.Generic;
using eFormAPI.Web.Infrastructure.Models;
using eFormShared;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions.Advanced
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