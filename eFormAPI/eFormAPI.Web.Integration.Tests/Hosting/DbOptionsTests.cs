/*
The MIT License (MIT)

Copyright (c) 2007 - 2026 Microting A/S

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
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Hosting
{
    [TestFixture]
    public class DbOptionsTests : DbTestFixture
    {
        // EformAngularFrontendBase 10.0.41 deletes the ApplicationSettings:UserbackToken
        // row, so the property binds as null. Saving the other settings (as the initial
        // connection-string setup does) must still work.
        [Test]
        public async Task UpdateDb_WithANullStringSetting_SavesTheOtherSettings()
        {
            const string key = "ApplicationSettings:DefaultLocale";
            // ClearDb does not reset ConfigurationValues, so the row is put back afterwards.
            var original = await DbContext.ConfigurationValues.AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == key);
            await SetRow(key, "en-US");
            try
            {
                var monitor = Substitute.For<IOptionsMonitor<ApplicationSettings>>();
                monitor.CurrentValue.Returns(new ApplicationSettings
                {
                    DefaultLocale = "en-US",
                    SiteLink = "",
                    SecurityCode = "",
                    DefaultPassword = "",
                    UserbackToken = null
                });
                var options = new DbOptions<ApplicationSettings>(monitor);

                await options.UpdateDb(x => x.DefaultLocale = "da-DK", DbContext);

                var saved = await DbContext.ConfigurationValues.AsNoTracking()
                    .SingleAsync(x => x.Id == key);
                Assert.That(saved.Value, Is.EqualTo("da-DK"));
            }
            finally
            {
                if (original == null)
                {
                    await DbContext.ConfigurationValues.Where(x => x.Id == key).ExecuteDeleteAsync();
                }
                else
                {
                    await SetRow(key, original.Value);
                }
            }
        }

        private async Task SetRow(string key, string value)
        {
            var row = await DbContext.ConfigurationValues.SingleOrDefaultAsync(x => x.Id == key);
            if (row == null)
            {
                DbContext.ConfigurationValues.Add(new EformConfigurationValue { Id = key, Value = value });
            }
            else
            {
                row.Value = value;
            }
            await DbContext.SaveChangesAsync();
        }
    }
}
