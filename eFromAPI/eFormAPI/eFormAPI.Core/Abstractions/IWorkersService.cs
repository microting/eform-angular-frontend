using System.Collections.Generic;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models;
using eFormShared;

namespace eFormAPI.Core.Abstractions
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