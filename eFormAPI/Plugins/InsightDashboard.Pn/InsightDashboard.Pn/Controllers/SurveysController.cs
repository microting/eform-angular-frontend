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

namespace InsightDashboard.Pn.Controllers
{
    using System.Threading.Tasks;
    using Infrastructure.Models.Surveys;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Services.SurveysService;

    [Authorize]
    public class SurveysController : Controller
    {
        private readonly ISurveysService _surveysService;

        public SurveysController(ISurveysService surveysService)
        {
            _surveysService = surveysService;
        }

        [HttpPost]
        [Route("api/insight-dashboard-pn/survey-configs")]
        public async Task<OperationDataResult<SurveyConfigsListModel>> GetSettings(
            [FromBody] SurveyConfigsRequestModel requestModel)
        {
            return await _surveysService.Get(requestModel);
        }

        [HttpPost]
        [Route("api/insight-dashboard-pn/survey-configs/create")]
        public async Task<OperationResult> Create([FromBody] SurveyConfigCreateModel createModel)
        {
            return await _surveysService.Create(createModel);
        }

        [HttpPost]
        [Route("api/insight-dashboard-pn/survey-configs/status")]
        public async Task<OperationResult> ChangeStatus([FromBody] SurveyConfigUpdateStatusModel configUpdateStatusModel)
        {
            return await _surveysService.ChangeStatus(configUpdateStatusModel);
        }

        [HttpPost]
        [Route("api/insight-dashboard-pn/survey-configs/update")]
        public async Task<OperationResult> Update([FromBody] SurveyConfigUpdateModel updateModel)
        {
            return await _surveysService.Update(updateModel);
        }

        [HttpPost]
        [Route("api/insight-dashboard-pn/survey-configs/delete")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _surveysService.Delete(id);
        }
    }
}