/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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

namespace OuterInnerResource.Pn.Infrastructure.Consts
{
    public class ExcelConsts
    {
        public static int MachineAreaReportSheetNumber = 1;
        public static string ExcelTemplatesDir = "Templates";

        public static class EmployeeReport
        {
            // Period from
            public static int PeriodFromTitleRow = 2;
            public static int PeriodFromTitleCol = 2;
            public static int PeriodFromRow = 2;
            public static int PeriodFromCol = 3;

            // Period from
            public static int PeriodToTitleRow = 3;
            public static int PeriodToTitleCol = 2;
            public static int PeriodToRow = 3;
            public static int PeriodToCol = 3;

            // Period type
            public static int PeriodTypeTitleRow = 5;
            public static int PeriodTypeTitleCol = 2;
            public static int PeriodTypeRow = 5;
            public static int PeriodTypeCol = 3;

            // Report name
            public static int ReportTitleRow = 6;
            public static int ReportTitleCol = 2;
            public static int ReportNameRow = 6;
            public static int ReportNameCol = 3;

            // Entity name start position
            public static int EntityNameStartRow = 9;
            public static int EntityNameStartCol = 2;

            // Related entity name start position
            public static int RelatedEntityNameStartRow = 9;
            public static int RelatedEntityNameStartCol = 3;

            // Vertical sum start position
            public static int VerticalSumStartRow = 9;
            public static int VerticalSumStartCol = 5;
            public static int VerticalSumTitleRow = 8;
            public static int VerticalSumTitleCol = 5;

            // Horizontal sum start position
            public static int HorizontalSumStartCol = 6;

            // Header start position
            public static int HeaderStartRow = 8;
            public static int HeaderStartCol = 6;

            // Data start position
            public static int DataStartRow = 9;
            public static int DataStartCol = 6;

            // Report SUM position
            public static int TotalSumCol = 5;
            public static int TotalSumTitleCol = 4;
        }

        public static class AreaReport
        {
        }
    }
}