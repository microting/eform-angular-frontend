using System.Collections.Generic;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models;
using eFormShared;

namespace eFormAPI.BasePn.Abstractions
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