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
    using System;
    using System.Globalization;
    using System.Threading.Tasks;
    using Base;
    using Helpers;
    using Infrastructure.Helpers;
    using NUnit.Framework;

    [TestFixture]
    public class ChartDataUTests : DbTestFixture
    {
        /// <summary>
        /// Raw chart data calculate correct.
        /// </summary>
        [Test]
        public async Task ChartData_Calculate_Correct()
        {
            // Settings
            CultureInfo.CurrentCulture = new CultureInfo("da");

            // Add total tag
            await DatabaseHelper.AddTotalTag(DbContext);

            // Arrange
            var localizationService = MockHelper.GetLocalizationService();
            var dashboardViews = DashboardHelpers.GetChartDataDashBoards();

            foreach (var (key, value) in dashboardViews)
            {
                Console.WriteLine($"Check template: {value}");

                // Act
                foreach (var itemViewModel in key.Items)
                {
                    var newItemViewModel = DashboardHelpers.CopyDashboardItem(itemViewModel);
                    var dashboardItem = DashboardHelpers.GetDashboardItemFromModel(itemViewModel);

                    await ChartDataHelpers.CalculateDashboardItem(
                        newItemViewModel,
                        DbContext,
                        dashboardItem,
                        localizationService,
                        key.LocationId,
                        key.TagId,
                        key.SurveyId,
                        key.AnswerDates);

                    DashboardHelpers.CheckData(itemViewModel, newItemViewModel, key, value);
                }
            }
        }
    }
}
