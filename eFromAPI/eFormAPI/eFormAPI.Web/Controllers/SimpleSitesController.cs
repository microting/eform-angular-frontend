using System.Collections.Generic;
using eFormAPI.Common.Infrastructure.Helpers;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models;
using eFormAPI.Core.Abstractions;
using eFormShared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class SimpleSitesController : Controller
    {
        private readonly ISimpleSitesService _simpleSitesService;

        public SimpleSitesController(ISimpleSitesService simpleSitesService)
        {
            _simpleSitesService = simpleSitesService;
        }

        [HttpGet]
        public OperationDataResult<List<Site_Dto>> Index()
        {
            return _simpleSitesService.Index();
        }

        [HttpPost]
        public OperationResult Create([FromBody] SimpleSiteModel simpleSiteModel)
        {
            if (!ModelState.IsValid)
                return new OperationResult(false,
                    LocaleHelper.GetString("DeviceUserCouldNotBeCreated"));

            return _simpleSitesService.Create(simpleSiteModel);
        }

        [HttpGet]
        public OperationDataResult<Site_Dto> Edit(int id)
        {
            return _simpleSitesService.Edit(id);
        }

        [HttpPost]
        public OperationResult Update([FromBody] SimpleSiteModel simpleSiteModel)
        {
            return _simpleSitesService.Update(simpleSiteModel);
        }

        [HttpGet]
        public OperationResult Delete(int id)
        {
            return _simpleSitesService.Delete(id);
        }
    }
}