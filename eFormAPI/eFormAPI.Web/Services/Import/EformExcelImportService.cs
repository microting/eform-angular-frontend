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

using ClosedXML.Graphics;

namespace eFormAPI.Web.Services.Import;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ClosedXML.Excel;
using Export;
using Infrastructure.Models.Import;
using Microsoft.Extensions.Logging;
using Microting.EformAngularFrontendBase.Infrastructure.Const.Import;

public class EformExcelImportService : IEformExcelImportService
{
    private readonly ILogger<EformExcelExportService> _logger;

    public EformExcelImportService(ILogger<EformExcelExportService> logger)
    {
        _logger = logger;
    }


    public List<EformImportExcelModel> EformImport(Stream excelStream)
    {
        try
        {
            var result = new List<EformImportExcelModel>();
            foreach (var fontFamily in SixLabors.Fonts.SystemFonts.Collection.Families)
                Console.WriteLine(fontFamily.Name);
            LoadOptions.DefaultGraphicEngine = new DefaultGraphicEngine("Carlito");
            var workbook = new XLWorkbook(excelStream);
            var worksheet = workbook.Worksheet(EformImportExcelConsts.EformsWorksheet);
            var rows = worksheet.RangeUsed().RowsUsed();

            foreach (var row in rows.Skip(1)) // Skip header
            {
                var name = row.Cell(EformImportExcelConsts.EformNameCol).Value.ToString();

                var tag1 = row.Cell(EformImportExcelConsts.Tag1Col).Value.ToString();
                var tag2 = row.Cell(EformImportExcelConsts.Tag2Col).Value.ToString();
                var tag3 = row.Cell(EformImportExcelConsts.Tag3Col).Value.ToString();
                var tag4 = row.Cell(EformImportExcelConsts.Tag4Col).Value.ToString();
                var tag5 = row.Cell(EformImportExcelConsts.Tag5Col).Value.ToString();
                var tag6 = row.Cell(EformImportExcelConsts.Tag6Col).Value.ToString();
                var tag7 = row.Cell(EformImportExcelConsts.Tag7Col).Value.ToString();
                var tag8 = row.Cell(EformImportExcelConsts.Tag8Col).Value.ToString();
                var tag9 = row.Cell(EformImportExcelConsts.Tag9Col).Value.ToString();
                var tag10 = row.Cell(EformImportExcelConsts.Tag10Col).Value.ToString();

                var xml = row.Cell(EformImportExcelConsts.EformXMLCol).Value.ToString();

                var item = new EformImportExcelModel
                {
                    Name = name,
                    EformXML = xml,
                    ExcelRow = row.RowNumber()
                };

                if (!string.IsNullOrEmpty(tag1))
                {
                    item.Tags.Add(tag1);
                }

                if (!string.IsNullOrEmpty(tag2))
                {
                    item.Tags.Add(tag2);
                }

                if (!string.IsNullOrEmpty(tag3))
                {
                    item.Tags.Add(tag3);
                }

                if (!string.IsNullOrEmpty(tag4))
                {
                    item.Tags.Add(tag4);
                }

                if (!string.IsNullOrEmpty(tag5))
                {
                    item.Tags.Add(tag5);
                }

                if (!string.IsNullOrEmpty(tag6))
                {
                    item.Tags.Add(tag6);
                }

                if (!string.IsNullOrEmpty(tag7))
                {
                    item.Tags.Add(tag7);
                }

                if (!string.IsNullOrEmpty(tag8))
                {
                    item.Tags.Add(tag8);
                }

                if (!string.IsNullOrEmpty(tag9))
                {
                    item.Tags.Add(tag9);
                }

                if (!string.IsNullOrEmpty(tag10))
                {
                    item.Tags.Add(tag10);
                }

                item.ReportH1 = row.Cell(EformImportExcelConsts.ReportH1).Value.ToString();
                item.ReportH2 = row.Cell(EformImportExcelConsts.ReportH2).Value.ToString();
                item.ReportH3 = row.Cell(EformImportExcelConsts.ReportH3).Value.ToString();
                item.ReportH4 = row.Cell(EformImportExcelConsts.ReportH4).Value.ToString();

                result.Add(item);
            }

            return result;
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);
            throw;
        }
    }
}