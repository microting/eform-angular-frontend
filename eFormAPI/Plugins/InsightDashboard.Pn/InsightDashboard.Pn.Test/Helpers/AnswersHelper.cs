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

using System.Linq;
using System.Threading.Tasks;
using InsightDashboard.Pn.Infrastructure.Models.Answers;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Constants;

namespace InsightDashboard.Pn.Test.Helpers
{
    public class AnswersHelper
    {
        public static IQueryable<AnswerViewModel> GetAnswerByMicrotingUid(int microtingUid,
            MicrotingDbContext dbContext)
        {
            var answersQueryable = dbContext.Answers
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(x => x.MicrotingUid == microtingUid)
                .AsNoTracking()
                .AsQueryable()
                .Select(answers => new AnswerViewModel()
                {
                    MicrotingUid = (int)answers.MicrotingUid,
                    Id = answers.Id,
                    AnswerValues = dbContext.AnswerValues
                        .Where(answerValues => answerValues.AnswerId == answers.Id)
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .AsQueryable()
                        .Select(a => new AnswerValuesViewModel()
                        {
                            Value = a.Value,
                            Id = a.Id,
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
    }
}