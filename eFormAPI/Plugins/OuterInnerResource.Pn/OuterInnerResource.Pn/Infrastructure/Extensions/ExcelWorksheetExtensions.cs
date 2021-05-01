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

using System.Drawing;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace OuterInnerResource.Pn.Infrastructure.Extensions
{
    public static class ExcelWorksheetExtensions
    {
        public static void UpdateValue(
            this ExcelWorksheet excelWorksheet,
            int row,
            int col,
            object value,
            string defaultValue = null)
        {
            excelWorksheet.UpdateValue(row, col, value, false, false, Color.Empty);
        }

        public static void UpdateValue(
            this ExcelWorksheet excelWorksheet,
            int row,
            int col,
            object value,
            bool addBorders,
            string defaultValue = null)
        {
            excelWorksheet.UpdateValue(row, col, value, addBorders, false, Color.Empty);
        }

        public static void UpdateValue(
            this ExcelWorksheet excelWorksheet,
            int row,
            int col,
            object value,
            bool addBorders,
            bool autoFit,
            string defaultValue = null)
        {
            excelWorksheet.UpdateValue(row, col, value, addBorders, autoFit, Color.Empty);
        }

        public static void UpdateValue(
            this ExcelWorksheet excelWorksheet,
            int row,
            int col,
            object value,
            bool addBorders,
            bool autoFit,
            Color color,
            string defaultValue = null)
        {
            excelWorksheet.Cells[row, col].Value = value ?? defaultValue;

            if (value?.GetType() == typeof(decimal))
            {
                excelWorksheet.Cells[row, col].Style.Numberformat.Format = "0.00";
            }

            if (addBorders)
            {
                excelWorksheet.Cells[row, col].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                excelWorksheet.Cells[row, col].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                excelWorksheet.Cells[row, col].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                excelWorksheet.Cells[row, col].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            }

            if (autoFit)
            {
                excelWorksheet.Cells[row, col].AutoFitColumns();
            }

            if (!color.IsEmpty)
            {
                excelWorksheet.Cells[row, col].Style.Fill.PatternType = ExcelFillStyle.Solid;
                excelWorksheet.Cells[row, col].Style.Fill.BackgroundColor.SetColor(color);
            }
        }
    }
}