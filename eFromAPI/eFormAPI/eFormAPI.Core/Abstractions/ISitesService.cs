using System.Collections.Generic;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models;
using eFormShared;

namespace eFormAPI.Core.Abstractions
{
    public interface ISitesService
    {
        OperationDataResult<List<SiteName_Dto>> Index();
        OperationDataResult<SiteName_Dto> Edit(int id);
        OperationResult Update(SiteNameModel siteNameModel);
        OperationResult Delete(int id);
    }
}