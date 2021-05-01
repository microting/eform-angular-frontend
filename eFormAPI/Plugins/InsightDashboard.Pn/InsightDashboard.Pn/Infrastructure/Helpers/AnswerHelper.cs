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


namespace InsightDashboard.Pn.Infrastructure.Helpers
{
    using System.Linq;
    using Models.Answers;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eForm.Infrastructure.Data.Entities;

    public class AnswerHelper
    {
        public static IQueryable<AnswerViewModel> GetAnswerQueryByMicrotingUid(int microtingUid,
            MicrotingDbContext dbContext)
        {
            var answersQueryable = dbContext.Answers.Join(dbContext.Sites,
                    answer => answer.SiteId,
                    site => site.Id,
                    (newAnswer, site) => new
                    {
                        newAnswer.WorkflowState,
                        newAnswer.MicrotingUid,
                        newAnswer.UnitId,
                        newAnswer.FinishedAt,
                        newAnswer.AnswerDuration,
                        newAnswer.Id,
                        site.Name
                    }).Join(dbContext.Units,
                    answer => answer.UnitId,
                    unit => unit.Id,
                    (answer, unit) => new
                    {
                        answer.WorkflowState,
                        answer.MicrotingUid,
                        answer.Id,
                        answer.UnitId,
                        answer.FinishedAt,
                        answer.AnswerDuration,
                        answer.Name,
                        UnitUid = unit.MicrotingUid
                    })
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.MicrotingUid == microtingUid)
                .AsQueryable()
                .Select(answers => new AnswerViewModel()
                {
                    Id = answers.Id,
                    MicrotingUid = (int)answers.MicrotingUid,
                    UnitId = (int)answers.UnitUid,
                    FinishedAt = answers.FinishedAt,
                    AnswerDuration = answers.AnswerDuration,
                    SiteName = answers.Name,
                    AnswerValues = dbContext.AnswerValues.Join(dbContext.QuestionTranslations,
                            value => value.QuestionId,
                            questionTranslation => questionTranslation.Id,
                            (value, questionTranslation) => new
                            {
                                value.AnswerId,
                                value.WorkflowState,
                                value.Value,
                                value.Id,
                                value.OptionId,
                                questionTranslation.Name
                            })
                        .Where(answerValues => answerValues.AnswerId == answers.Id)
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .AsQueryable()
                        .Select(a => new AnswerValuesViewModel()
                        {
                            Value = a.Value,
                            Id = a.Id,
                            Question = a.Name,
                            Translations = dbContext.OptionTranslations
                                .Where(x => x.OptionId == a.OptionId)
                                .AsQueryable()
                                .Select(translations => new AnswerValueTranslationModel()
                                {
                                    Value = translations.Name,
                                    LanguageId = translations.LanguageId,
                                    LanguageName = dbContext.Languages
                                        .FirstOrDefault(x => x.Id == translations.LanguageId).Name
                                }).ToList()
                        }).ToList()
                });
            return answersQueryable;
        }

        public static IQueryable<Answer> GetAnswerQueryByMicrotingUidForDelete(int microtingUid,
            MicrotingDbContext dbContext)
        {
            var answerQuery = dbContext.Answers
                .Where(x => x.MicrotingUid == microtingUid);

            return answerQuery;
        }

        public static IQueryable<AnswerValue> GetAnswerValuesQueryByAnswerIdForDelete(int answerId,
            MicrotingDbContext dbContext)
        {
            var answersValuesQuery = dbContext.AnswerValues
                .Where(x => x.AnswerId == answerId);

            return answersValuesQuery;
        }
    }
}
