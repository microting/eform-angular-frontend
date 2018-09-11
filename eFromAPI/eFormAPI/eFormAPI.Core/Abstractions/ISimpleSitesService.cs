using System.Collections.Generic;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models;
using eFormShared;

namespace eFormAPI.Core.Abstractions
{
    public interface ISimpleSitesService
    {
        OperationDataResult<List<Site_Dto>> Index();
        OperationResult Create(SimpleSiteModel simpleSiteModel);
        OperationDataResult<Site_Dto> Edit(int id);
        OperationResult Update(SimpleSiteModel simpleSiteModel);
        OperationResult Delete(int id);
    }
}