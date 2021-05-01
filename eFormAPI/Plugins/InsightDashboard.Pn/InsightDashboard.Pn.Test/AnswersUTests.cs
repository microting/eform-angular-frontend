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

namespace InsightDashboard.Pn.Test
{
    using Base;
    using NUnit.Framework;
    using System.Linq;
    using Infrastructure.Models.Answers;
    using Microting.eForm.Infrastructure.Constants;
    using Newtonsoft.Json;
    using System.Threading.Tasks;
    using Helpers;
    using Microsoft.EntityFrameworkCore;
    using InsightDashboard.Pn.Infrastructure.Helpers;

    [TestFixture]
    public class AnswersUTests : DbTestFixture
    {
        private const int MicrotingUid = 1413005;
        private AnswerViewModel _answerForTest;
        protected override void DoSetup()
        {
            _answerForTest = JsonConvert.DeserializeObject<AnswerViewModel>(FileHelper.ReadFileFromResources("TestAnswer"));
        }

        [Test]
        public void Answer_Get()
        {
            var answer = AnswerHelper.GetAnswerQueryByMicrotingUid(MicrotingUid, DbContext).FirstOrDefault();

            Assert.NotNull(answer);
            Assert.AreEqual(answer.Id, _answerForTest.Id);
            Assert.AreEqual(answer.MicrotingUid, _answerForTest.MicrotingUid);
            for(var i = 0; i < _answerForTest.AnswerValues.Count; i++)
            {
                var answerValues = answer.AnswerValues[i];
                var answerValuesForTest = _answerForTest.AnswerValues[i];
                Assert.AreEqual(answerValues.Id, answerValuesForTest.Id);
                Assert.AreEqual(answerValues.Value, answerValuesForTest.Value);
                for(var j = 0; j < answerValuesForTest.Translations.Count; j++)
                {
                    var translationsForTest = answerValuesForTest.Translations[j];
                    var translations = answerValues.Translations[j];
                    Assert.AreEqual(translations.LanguageId, translationsForTest.LanguageId);
                    Assert.AreEqual(translations.LanguageName, translationsForTest.LanguageName);
                    Assert.AreEqual(translations.Value, translationsForTest.Value);
                }
            }
        }

        [Test]
        public async Task Delete_Answer()
        {
            var answerBeforeDelete = await AnswerHelper.GetAnswerQueryByMicrotingUidForDelete(MicrotingUid, DbContext)
                .FirstOrDefaultAsync();

            var answerForBackup = await AnswerHelper.GetAnswerQueryByMicrotingUidForDelete(MicrotingUid, DbContext)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            var answersValuesBeforeDelete = await AnswerHelper.GetAnswerValuesQueryByAnswerIdForDelete(1, DbContext)
                .ToListAsync();
            var answerValuesForBackup = await AnswerHelper.GetAnswerValuesQueryByAnswerIdForDelete(1, DbContext)
                .AsNoTracking()
                .ToListAsync();
            Assert.IsNotEmpty(answersValuesBeforeDelete);

            foreach(var answersValue in answersValuesBeforeDelete)
            {
                await answersValue.Delete(DbContext);
            }

            Assert.AreNotEqual(answerBeforeDelete, default);
            await answerBeforeDelete.Delete(DbContext);

            var answerAfterDelete = await AnswerHelper.GetAnswerQueryByMicrotingUidForDelete(MicrotingUid, DbContext)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed).AsNoTracking()
                .FirstOrDefaultAsync();

            var answersValuesAfterDelete = await AnswerHelper.GetAnswerValuesQueryByAnswerIdForDelete(1, DbContext)
                .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed).AsNoTracking()
                .ToListAsync();

            Assert.IsEmpty(answersValuesAfterDelete);
            Assert.AreEqual(answerAfterDelete, default);

            answerBeforeDelete.Version = answerForBackup.Version;
            answerBeforeDelete.WorkflowState = answerForBackup.WorkflowState;
            answerBeforeDelete.UpdatedAt = answerForBackup.UpdatedAt;
            DbContext.Answers.Update(answerBeforeDelete);
            for (var i = 0; i < answersValuesBeforeDelete.Count; i++)
            {
                answersValuesBeforeDelete[i].Version = answerValuesForBackup[i].Version;
                answersValuesBeforeDelete[i].WorkflowState = answerValuesForBackup[i].WorkflowState;
                answersValuesBeforeDelete[i].UpdatedAt = answerValuesForBackup[i].UpdatedAt;
                DbContext.AnswerValues.Update(answersValuesBeforeDelete[i]);
            }

            await DbContext.SaveChangesAsync();
        }
    }
}
