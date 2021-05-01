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

namespace InsightDashboard.Pn.Services.DictionaryService
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Threading.Tasks;
    using Common.InsightDashboardLocalizationService;
    using Infrastructure.Extensions;
    using Infrastructure.Helpers;
    using Infrastructure.Models;
    using Infrastructure.Models.Dashboards;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

    public class DictionaryService : IDictionaryService
    {
        private readonly ILogger<DictionaryService> _logger;
        private readonly IInsightDashboardLocalizationService _localizationService;
        private readonly IEFormCoreService _coreHelper;

        public DictionaryService(
            ILogger<DictionaryService> logger,
            IInsightDashboardLocalizationService localizationService,
            IEFormCoreService coreHelper)
        {
            _logger = logger;
            _localizationService = localizationService;
            _coreHelper = coreHelper;
        }

        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetSurveys()
        {
            try
            {
                var core = await _coreHelper.GetCore();
                using (var sdkContext = core.DbContextHelper.GetDbContext())
                {
                    var surveys = await sdkContext.QuestionSets
                        .AsNoTracking()
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(x => new CommonDictionaryModel()
                        {
                            Id = x.Id,
                            Name = x.Name,
                        }).ToListAsync();

                    return new OperationDataResult<List<CommonDictionaryModel>>(true, surveys);
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<List<CommonDictionaryModel>>(false,
                    _localizationService.GetString("ErrorWhileObtainingSurveys"));
            }
        }
        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetTags()
        {
            try
            {
                var core = await _coreHelper.GetCore();
                using (var sdkContext = core.DbContextHelper.GetDbContext())
                {
                    var surveys = await sdkContext.Tags
                        .AsNoTracking()
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Select(x => new CommonDictionaryModel()
                        {
                            Id = x.Id,
                            Name = x.Name,
                        }).ToListAsync();

                    return new OperationDataResult<List<CommonDictionaryModel>>(true, surveys);
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<List<CommonDictionaryModel>>(false,
                    _localizationService.GetString("ErrorWhileObtainingTags"));
            }
        }

        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetLocationsBySurveyId(int surveyId)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                using (var dbContext = core.DbContextHelper.GetDbContext())
                {
                    var sites = await dbContext.SiteSurveyConfigurations
                        .AsNoTracking()
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.Site.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.SurveyConfiguration.QuestionSet.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.SurveyConfiguration.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.SurveyConfiguration.QuestionSetId == surveyId)
                        .GroupBy(x => new
                        {
                            Id = x.SiteId,
                            x.Site.Name,
                        })
                        .Select(x => new CommonDictionaryModel
                        {
                            Id = x.Key.Id,
                            Name = x.Key.Name,
                        }).ToListAsync();

                    return new OperationDataResult<List<CommonDictionaryModel>>(true, sites);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationDataResult<List<CommonDictionaryModel>>(false,
                    _localizationService.GetString("ErrorWhileObtainingSites"));
            }
        }

        public async Task<OperationDataResult<List<QuestionDictionaryModel>>> GetQuestions(int surveyId)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                using (var sdkContext = core.DbContextHelper.GetDbContext())
                {
                    var languages = await sdkContext.Languages.ToListAsync();
                    var questionsResult = new List<QuestionDictionaryModel>();
                    foreach (var language in languages)
                    {
                        // TODO take by language
                        var questions = await sdkContext.Questions
                            .AsNoTracking()
                            //.Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.QuestionSetId == surveyId)
                            .OrderBy(x => x.QuestionIndex)
                            .Select(x => new QuestionDictionaryModel()
                            {
                                Id = x.Id,
                                Type = x.GetQuestionType(),
                                WorkflowState = x.WorkflowState,
                                Name = x.QuestionTranslationses
                                    .Where(qt => qt.WorkflowState != Constants.WorkflowStates.Removed)
                                    .Where(qt => qt.Language.Id == language.Id)
                                    .Select(qt => qt.Name)
                                    .FirstOrDefault(),
                            }).ToListAsync();

                        if (questions.Any())
                        {
                            int i = 1;
                            foreach (var question in questions)
                            {
                                question.Name = $"{i} - {question.Name}";
                                i += 1;
                                if (question.WorkflowState == Constants.WorkflowStates.Removed)
                                {
                                    var qt = sdkContext.QuestionTranslations.First(x => x.QuestionId == question.Id);
                                    question.Name = $"{qt.Name} - removed - questionId({question.Id})";
                                }
                            }
                            questionsResult.AddRange(questions);
                            break;
                        }
                    }

                    return new OperationDataResult<List<QuestionDictionaryModel>>(
                        true,
                        questionsResult);
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<List<QuestionDictionaryModel>>(false,
                    _localizationService.GetString("ErrorWhileObtainingQuestions"));
            }
        }


        public async Task<OperationDataResult<List<CommonDictionaryModel>>> GetFilterAnswers(DashboardItemAnswerRequestModel requestModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                using (var sdkContext = core.DbContextHelper.GetDbContext())
                {
                    var languages = await sdkContext.Languages.ToListAsync();
                    var answersResult = new List<CommonDictionaryModel>();
                    bool isSmileyQuestion = false;
                    foreach (var language in languages)
                    {
                        isSmileyQuestion = await sdkContext.Questions
                            .Where(x => x.Id == requestModel.FilterQuestionId)
                            .Select(x => x.IsSmiley())
                            .FirstOrDefaultAsync();

                        // TODO take by language
                        var answers = await sdkContext.Options
                            .AsNoTracking()
                            .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                            .Where(x => x.QuestionId == requestModel.FilterQuestionId)
                            .Select(x => new CommonDictionaryModel()
                            {
                                Id = x.Id,
                                Name = x.OptionTranslationses
                                    .Where(qt => qt.WorkflowState != Constants.WorkflowStates.Removed)
                                    .Where(qt => qt.Language.Id == language.Id)
                                    .Select(qt => qt.Name)
                                    .FirstOrDefault(),
                            }).ToListAsync();

                        if (answers.Any())
                        {
                            answersResult.AddRange(answers);
                            break;
                        }
                    }

                    if (isSmileyQuestion)
                    {
                        var result = new List<CommonDictionaryModel>();

                        foreach (var dictionaryModel in answersResult)
                        {
                            result.Add(new CommonDictionaryModel
                            {
                                Id = dictionaryModel.Id,
                                Name = ChartHelpers.GetSmileyLabel(dictionaryModel.Name),
                                Description = dictionaryModel.Description,
                            });
                        }

                        return new OperationDataResult<List<CommonDictionaryModel>>(
                            true,
                            result);
                    }


                    return new OperationDataResult<List<CommonDictionaryModel>>(
                        true,
                        answersResult);
                }
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<List<CommonDictionaryModel>>(false,
                    _localizationService.GetString("ErrorWhileObtainingAnswers"));
            }
        }
    }
}
