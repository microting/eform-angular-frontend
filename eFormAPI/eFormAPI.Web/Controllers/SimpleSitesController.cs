using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Infrastructure;
using eFormShared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class SimpleSitesController : Controller
    {
        private readonly ISimpleSitesService _simpleSitesService;
        private readonly ILocalizationService _localizationService;

        public SimpleSitesController(ISimpleSitesService simpleSitesService, 
            ILocalizationService localizationService)
        {
            _simpleSitesService = simpleSitesService;
            _localizationService = localizationService;
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.DeviceUsers.Read)]
        public OperationDataResult<List<Site_Dto>> Index()
        {
            return _simpleSitesService.Index();
        }

        [HttpPost]
        [Authorize(Policy = AuthConsts.EformPolicies.DeviceUsers.Create)]
        public OperationResult Create([FromBody] SimpleSiteModel simpleSiteModel)
        {
            if (!ModelState.IsValid)
                return new OperationResult(false,
                    _localizationService.GetString("DeviceUserCouldNotBeCreated"));

            return _simpleSitesService.Create(simpleSiteModel);
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.DeviceUsers.Update)]
        public OperationDataResult<Site_Dto> Edit(int id)
        {
            return _simpleSitesService.Edit(id);
        }

        [HttpPost]
        [Authorize(Policy = AuthConsts.EformPolicies.DeviceUsers.Update)]
        public OperationResult Update([FromBody] SimpleSiteModel simpleSiteModel)
        {
            return _simpleSitesService.Update(simpleSiteModel);
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.DeviceUsers.Delete)]
        public OperationResult Delete(int id)
        {
            return _simpleSitesService.Delete(id);
        }
    }
}