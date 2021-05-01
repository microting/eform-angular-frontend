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
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Infrastructure.Models;
    using Infrastructure.Models.Dashboards;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
    using Services.DictionaryService;

    [Authorize]
    public class DictionaryController : Controller
    {
        private readonly IDictionaryService _dictionaryService;

        public DictionaryController(IDictionaryService dictionaryService)
        {
            _dictionaryService = dictionaryService;
        }

        [HttpGet]
        [Route("api/insight-dashboard-pn/dictionary/surveys")]
        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetSurveys()
        {
            return await _dictionaryService.GetSurveys();
        }

        [HttpGet]
        [Route("api/insight-dashboard-pn/dictionary/locations-tags")]
        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetTags()
        {
            return await _dictionaryService.GetTags();
        }

        [HttpGet]
        [Route("api/insight-dashboard-pn/dictionary/locations-by-survey/{id}")]
        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetLocationsBySurveyId(int id)
        {
            return await _dictionaryService.GetLocationsBySurveyId(id);
        }

        [HttpGet]
        [Route("api/insight-dashboard-pn/dictionary/questions/{surveyId}")]
        public async Task<OperationDataResult<List<QuestionDictionaryModel>>> GetQuestions(int surveyId)
        {
            return await _dictionaryService.GetQuestions(surveyId);
        }

        [HttpGet]
        [Route("api/insight-dashboard-pn/dictionary/filter-answers")]
        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetFilterAnswers(DashboardItemAnswerRequestModel requestModel)
        {
            return await _dictionaryService.GetFilterAnswers(requestModel);
        }
    }
}