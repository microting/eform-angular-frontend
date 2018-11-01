using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure;
using eFormShared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers.Advanced
{
    [Authorize]
    public class SitesController : Controller
    {
        private readonly ISitesService _sitesService;

        public SitesController(ISitesService sitesService)
        {
            _sitesService = sitesService;
        }

        [HttpGet]
        [Route("api/sites/index")]
        [Authorize(Policy = AuthConsts.EformPolicies.Sites.Read)]
        public OperationDataResult<List<SiteName_Dto>> Index()
        {
            return _sitesService.Index();
        }
        [HttpGet]
        [Route("api/sites/pairing")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.PairingRead)]
        public OperationDataResult<List<SiteName_Dto>> ReadPairing()
        {
            return _sitesService.Index();
        }

        [HttpGet]
        [Route("api/sites/edit")]
        [Authorize(Policy = AuthConsts.EformPolicies.Sites.Update)]
        public OperationDataResult<SiteName_Dto> Edit(int id)
        {
            return _sitesService.Edit(id);
        }

        [HttpPost]
        [Route("api/sites/update")]
        [Authorize(Policy = AuthConsts.EformPolicies.Sites.Update)]
        public OperationResult Update([FromBody] SiteNameModel siteNameModel)
        {
            return _sitesService.Update(siteNameModel);
        }

        [HttpGet]
        [Route("api/sites/delete")]
        [Authorize(Policy = AuthConsts.EformPolicies.Sites.Delete)]
        public OperationResult Delete(int id)
        {
            return _sitesService.Delete(id);
        }
    }
}