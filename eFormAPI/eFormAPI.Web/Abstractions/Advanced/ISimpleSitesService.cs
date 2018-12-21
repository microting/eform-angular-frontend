using System.Collections.Generic;
using eFormAPI.Web.Infrastructure.Models;
using eFormShared;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions.Advanced
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