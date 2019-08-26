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
using System;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Models;
using eFormAPI.Web.Infrastructure.Models.Templates;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers.Eforms
{
    [Authorize]
    public class TemplatesController : Controller
    {
        private readonly ITemplatesService _templatesService;

        public TemplatesController(ITemplatesService templatesService)
        {
            _templatesService = templatesService;
        }

        [HttpPost]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.Read)]
        public async Task<IActionResult> Index([FromBody] TemplateRequestModel templateRequestModel)
        {
            try
            {
                return Ok(await _templatesService.Index(templateRequestModel));
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.Read)]
        public IActionResult Get(int id)
        {
            try
            {
                return Ok(_templatesService.Get(id));
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }

        [HttpGet]
        [Route("api/templates/get-fields/{id}")]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.Read)]
        public IActionResult GetDataItems(int id)
        {
            try
            {
                return Ok(_templatesService.GetFields(id));
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }

        [HttpPost]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.Create)]
        public OperationResult Create([FromBody] EFormXmlModel eFormXmlModel)
        {
            return _templatesService.Create(eFormXmlModel);
        }

        [HttpGet]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.Delete)]
        public OperationResult Delete(int id)
        {
            return _templatesService.Delete(id);
        }

        [HttpPost]
        [Authorize(Policy = AuthConsts.EformPolicies.Eforms.PairingUpdate)]
        public OperationResult Deploy([FromBody] DeployModel deployModel)
        {
            return _templatesService.Deploy(deployModel);
        }
    }
}