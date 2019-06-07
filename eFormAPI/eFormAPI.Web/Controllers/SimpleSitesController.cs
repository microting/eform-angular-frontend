/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Models;
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