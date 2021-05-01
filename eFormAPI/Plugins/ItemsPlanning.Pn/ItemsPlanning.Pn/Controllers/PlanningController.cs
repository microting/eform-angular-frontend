/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

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

namespace ItemsPlanning.Pn.Controllers
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using DocumentFormat.OpenXml.Spreadsheet;
    using Infrastructure.Models.Import;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.ItemsPlanningBase.Infrastructure.Const;
    using Infrastructure.Models.Planning;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
    using Services.PlanningImportService;
    using Services.PlanningService;

    [Authorize]
    public class PlanningController : Controller
    {
        private readonly IPlanningService _planningService;
        private readonly IPlanningImportService _planningImportService;

        public PlanningController(
            IPlanningService planningService,
            IPlanningImportService planningImportService)
        {
            _planningService = planningService;
            _planningImportService = planningImportService;
        }

        [HttpPost]
        [Route("api/items-planning-pn/plannings/index")]
        public async Task<OperationDataResult<Paged<PlanningPnModel>>> Index([FromBody] PlanningsRequestModel requestModel)
        {
            return await _planningService.Index(requestModel);
        }

        [HttpPost]
        [Route("api/items-planning-pn/plannings")]
        [Authorize(Policy = ItemsPlanningClaims.CreatePlannings)]
        public async Task<OperationResult> Create([FromBody] PlanningCreateModel createModel)
        {
            return await _planningService.Create(createModel);
        }

        [HttpGet]
        [Route("api/items-planning-pn/plannings/{id}")]
        public async Task<OperationDataResult<PlanningPnModel>> Read(int id)
        {
            return await _planningService.Read(id);
        }

        [HttpPut]
        [Route("api/items-planning-pn/plannings")]
        public async Task<OperationResult> Update([FromBody] PlanningUpdateModel updateModel)
        {
            return await _planningService.Update(updateModel);
        }

        [HttpDelete]
        [Route("api/items-planning-pn/plannings/{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _planningService.Delete(id);
        }

        /// <summary>
        /// import plannings from xlsx file (excel)
        /// </summary>
        /// <param name="uploadModel">excel file</param>
        /// <returns>operation result, true or false</returns>
        [HttpPost]
        [Route("api/items-planning-pn/plannings/import")]
        public async Task<OperationResult> Import(PlanningExcelUploadModel uploadModel)
        {
            return await _planningImportService.ImportPlannings(uploadModel.File.OpenReadStream());
        }

        /// <summary>
        /// multiple delete plannings
        /// </summary>
        /// <param name="planningIds">array witch planning ids</param>
        /// <returns>operation result, true or false</returns>
        [HttpPost]
        [Route("api/items-planning-pn/plannings/delete-multiple")]
        public async Task<OperationResult> MultipleDelete([FromBody] List<int> planningIds)
        {
            return await _planningService.MultipleDeletePlannings(planningIds);
        }
    }
}