using System.Collections.Generic;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models;
using eFormShared;

namespace eFormAPI.BasePn.Abstractions
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