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

namespace InsightDashboard.Pn.Test.Helpers
{
    using eFormCore;
    using Microting.eForm.Infrastructure;
    using Moq;
    using Services.Common.InsightDashboardLocalizationService;

    public static class MockHelper
    {
        public static Core GetCore()
        {
            var coreMock = new Mock<Core>();

            coreMock
                .Setup(x => x.DbContextHelper.GetDbContext())
                .Returns(new MicrotingDbContext());

            return coreMock.Object;
        }

        public static MicrotingDbContext GetMicrotingDbContext()
        {
            var coreMock = new Mock<MicrotingDbContext>();

            return coreMock.Object;
        }

        public static IInsightDashboardLocalizationService GetLocalizationService()
        {
            var localizationServiceMock = new Mock<IInsightDashboardLocalizationService>();

            localizationServiceMock
                .Setup(x => x.GetString("TotalPeriod"))
                .Returns("Samlet periode");

            localizationServiceMock
                .Setup(x => x.GetString("Total"))
                .Returns("Total");

            localizationServiceMock
                .Setup(x => x.GetString("NoData"))
                .Returns("Ingen data");

            return localizationServiceMock.Object;
        }
    }
}
