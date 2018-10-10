using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormShared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers
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
        public OperationDataResult<List<SiteName_Dto>> Index()
        {
            return _sitesService.Index();
        }

        [HttpGet]
        public OperationDataResult<SiteName_Dto> Edit(int id)
        {
            return _sitesService.Edit(id);
        }

        [HttpPost]
        public OperationResult Update([FromBody] SiteNameModel siteNameModel)
        {
            return _sitesService.Update(siteNameModel);
        }

        [HttpGet]
        public OperationResult Delete(int id)
        {
            return _sitesService.Delete(id);
        }
    }
}