using System.Collections.Generic;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormShared;

namespace eFormAPI.BasePn.Abstractions
{
    public interface IUnitsService
    {
        OperationDataResult<List<Unit_Dto>> Index();
        OperationDataResult<Unit_Dto> RequestOtp(int id);
    }
}