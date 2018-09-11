using System.Collections.Generic;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormShared;

namespace eFormAPI.Core.Abstractions
{
    public interface IUnitsService
    {
        OperationDataResult<List<Unit_Dto>> Index();
        OperationDataResult<Unit_Dto> RequestOtp(int id);
    }
}