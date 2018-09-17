using System.Collections.Generic;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models;
using eFormShared;

namespace eFormAPI.BasePn.Abstractions
{
    public interface ISitesService
    {
        OperationDataResult<List<SiteName_Dto>> Index();
        OperationDataResult<SiteName_Dto> Edit(int id);
        OperationResult Update(SiteNameModel siteNameModel);
        OperationResult Delete(int id);
    }
}