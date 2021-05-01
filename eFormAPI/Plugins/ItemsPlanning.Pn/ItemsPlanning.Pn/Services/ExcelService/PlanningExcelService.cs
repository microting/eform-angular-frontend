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

namespace ItemsPlanning.Pn.Services.ExcelService
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using ClosedXML.Excel;
    using Infrastructure.Consts;
    using Infrastructure.Models.Import;
    using Microsoft.Extensions.Logging;
    using Microting.ItemsPlanningBase.Infrastructure.Enums;

    public class PlanningExcelService : IPlanningExcelService
    {
        private readonly ILogger<PlanningExcelService> _logger;

        public PlanningExcelService(ILogger<PlanningExcelService> logger)
        {
            _logger = logger;
        }

        public List<PlanningImportExcelModel> ParsePlanningImportFile(Stream excelStream)
        {
            try
            {
                var result = new List<PlanningImportExcelModel>();
                var workbook = new XLWorkbook(excelStream);
                var worksheet = workbook.Worksheet(PlanningImportExcelConsts.EformsWorksheet);
                var rows = worksheet.RangeUsed()
                    .RowsUsed();

                foreach (var row in rows.Skip(1)) // Skip header
                {
                    // Folders
                    var folders = new List<PlanningImportFolderModel>();
                    var item = new PlanningImportExcelModel
                    {
                        ExcelRow = row.RowNumber()
                    };

                    // Folder 1
                    var folder1Label = row.Cell(PlanningImportExcelConsts.Folder1Label).Value.ToString().Trim();
                    var folder1Description = row.Cell(PlanningImportExcelConsts.Folder1Description).Value.ToString().Trim();

                    if (!string.IsNullOrEmpty(folder1Label) && !string.IsNullOrEmpty(folder1Label.Trim()))
                    {
                        var folderModel = new PlanningImportFolderModel
                        {
                            Label = folder1Label,
                            Description = folder1Description,
                            Level = 1,
                        };

                        folders.Add(folderModel);
                    }

                    // Folder 2
                    var folder2Label = row.Cell(PlanningImportExcelConsts.Folder2Label).Value.ToString().Trim();
                    var folder2Description = row.Cell(PlanningImportExcelConsts.Folder2Description).Value.ToString().Trim();

                    if (!string.IsNullOrEmpty(folder2Label) && !string.IsNullOrEmpty(folder2Label.Trim()))
                    {
                        var folderModel = new PlanningImportFolderModel
                        {
                            Label = folder2Label,
                            Description = folder2Description,
                            Level = 2,
                        };

                        folders.Add(folderModel);
                    }

                    // Folder 3
                    var folder3Label = row.Cell(PlanningImportExcelConsts.Folder3Label).Value.ToString().Trim();
                    var folder3Description = row.Cell(PlanningImportExcelConsts.Folder3Description).Value.ToString().Trim();

                    if (!string.IsNullOrEmpty(folder3Label) && !string.IsNullOrEmpty(folder3Label.Trim()))
                    {
                        var folderModel = new PlanningImportFolderModel
                        {
                            Label = folder3Label,
                            Description = folder3Description,
                            Level = 3,
                        };

                        folders.Add(folderModel);
                    }

                    // Folder 4
                    var folder4Label = row.Cell(PlanningImportExcelConsts.Folder4Label).Value.ToString().Trim();
                    var folder4Description = row.Cell(PlanningImportExcelConsts.Folder4Description).Value.ToString().Trim();

                    if (!string.IsNullOrEmpty(folder4Label) && !string.IsNullOrEmpty(folder4Label.Trim()))
                    {
                        var folderModel = new PlanningImportFolderModel
                        {
                            Label = folder4Label,
                            Description = folder4Description,
                            Level = 4,
                        };

                        folders.Add(folderModel);
                    }

                    // Folder 5
                    var folder5Label = row.Cell(PlanningImportExcelConsts.Folder5Label).Value.ToString().Trim();
                    var folder5Description = row.Cell(PlanningImportExcelConsts.Folder5Description).Value.ToString().Trim();

                    if (!string.IsNullOrEmpty(folder5Label) && !string.IsNullOrEmpty(folder5Label.Trim()))
                    {
                        var folderModel = new PlanningImportFolderModel
                        {
                            Label = folder5Label,
                            Description = folder5Description,
                            Level = 5,
                        };

                        folders.Add(folderModel);
                    }

                    // Folder 6
                    var folder6Label = row.Cell(PlanningImportExcelConsts.Folder6Label).Value.ToString().Trim();
                    var folder6Description = row.Cell(PlanningImportExcelConsts.Folder6Description).Value.ToString().Trim();

                    if (!string.IsNullOrEmpty(folder6Label) && !string.IsNullOrEmpty(folder6Label.Trim()))
                    {
                        var folderModel = new PlanningImportFolderModel
                        {
                            Label = folder6Label,
                            Description = folder6Description,
                            Level = 6,
                        };

                        folders.Add(folderModel);
                    }

                    // Folder 7
                    var folder7Label = row.Cell(PlanningImportExcelConsts.Folder7Label).Value.ToString().Trim();
                    var folder7Description = row.Cell(PlanningImportExcelConsts.Folder7Description).Value.ToString().Trim();

                    if (!string.IsNullOrEmpty(folder7Label) && !string.IsNullOrEmpty(folder7Label.Trim()))
                    {
                        var folderModel = new PlanningImportFolderModel
                        {
                            Label = folder7Label,
                            Description = folder7Description,
                            Level = 7,
                        };

                        folders.Add(folderModel);
                    }

                    // Folder 8
                    var folder8Label = row.Cell(PlanningImportExcelConsts.Folder8Label).Value.ToString().Trim();
                    var folder8Description = row.Cell(PlanningImportExcelConsts.Folder8Description).Value.ToString().Trim();

                    if (!string.IsNullOrEmpty(folder8Label) && !string.IsNullOrEmpty(folder8Label.Trim()))
                    {
                        var folderModel = new PlanningImportFolderModel
                        {
                            Label = folder8Label,
                            Description = folder8Description,
                            Level = 8,
                        };

                        folders.Add(folderModel);
                    }

                    // Folder 9
                    var folder9Label = row.Cell(PlanningImportExcelConsts.Folder9Label).Value.ToString().Trim();
                    var folder9Description = row.Cell(PlanningImportExcelConsts.Folder9Description).Value.ToString().Trim();

                    if (!string.IsNullOrEmpty(folder9Label) && !string.IsNullOrEmpty(folder9Label.Trim()))
                    {
                        var folderModel = new PlanningImportFolderModel
                        {
                            Label = folder9Label,
                            Description = folder9Description,
                            Level = 9,
                        };

                        folders.Add(folderModel);
                    }

                    // Folder 10
                    var folder10Label = row.Cell(PlanningImportExcelConsts.Folder10Label).Value.ToString().Trim();
                    var folder10Description = row.Cell(PlanningImportExcelConsts.Folder10Description).Value.ToString().Trim();

                    if (!string.IsNullOrEmpty(folder10Label) && !string.IsNullOrEmpty(folder10Label.Trim()))
                    {
                        var folderModel = new PlanningImportFolderModel
                        {
                            Label = folder10Label,
                            Description = folder10Description,
                            Level = 10,
                        };

                        folders.Add(folderModel);
                    }

                    item.Folders = folders;

                    // Planning info
                    item.PlanningName = row.Cell(PlanningImportExcelConsts.PlanningItemNameCol).Value.ToString();

                    var repeatEveryString = row.Cell(PlanningImportExcelConsts.PlanningRepeatEveryCol).Value.ToString();
                    var repeatEveryParseResult = int.TryParse(repeatEveryString, out var repeatEvery);
                    if (repeatEveryParseResult)
                    {
                        item.RepeatEvery = repeatEvery;
                    }
                    else
                    {
                        item.RepeatEvery = null;
                    }

                    var repeatTypeString = row.Cell(PlanningImportExcelConsts.PlanningRepeatTypeCol).Value.ToString();
                    var repeatTypeParseResult = int.TryParse(repeatTypeString, out var repeatType);
                    if (repeatTypeParseResult)
                    {
                        item.RepeatType = (RepeatType) repeatType;
                    }
                    else
                    {
                        item.RepeatType = repeatTypeString.ToLower() == "month"
                            ? RepeatType.Month
                            : (repeatTypeString.ToLower() == "week" ? RepeatType.Week : RepeatType.Day);
                    }

                    var repeatUntilString = row.Cell(PlanningImportExcelConsts.PlanningRepeatUntilCol).Value.ToString();

                    if (!string.IsNullOrEmpty(repeatUntilString))
                    {
                        var dateTime = DateTime.ParseExact(
                            repeatUntilString,
                            "dd.MM.yyyy",
                            CultureInfo.InvariantCulture);

                        if (dateTime != null)
                        {
                            item.RepeatUntil = dateTime;
                        }
                        else
                        {
                            item.RepeatUntil = null;
                        }
                    }
                    else
                    {
                        item.RepeatUntil = null;
                    }

                    var dayOfWeekString = row.Cell(PlanningImportExcelConsts.PlanningDayOfWeekCol).Value.ToString();
                    var dayOfWeekParseResult = int.TryParse(dayOfWeekString, out var dayOfWeekValue);
                    if (dayOfWeekParseResult)
                    {
                        item.DayOfWeek = (DayOfWeek)dayOfWeekValue;
                    }
                    else
                    {
                        switch (dayOfWeekString.ToLower())
                        {
                            case "mon":
                                item.DayOfWeek = DayOfWeek.Monday;
                                break;
                            case "tue":
                                item.DayOfWeek = DayOfWeek.Tuesday;
                                break;
                            case "wed":
                                item.DayOfWeek = DayOfWeek.Wednesday;
                                break;
                            case "thu":
                                item.DayOfWeek = DayOfWeek.Thursday;
                                break;
                            case "fri":
                                item.DayOfWeek = DayOfWeek.Friday;
                                break;
                            case "sat":
                                item.DayOfWeek = DayOfWeek.Saturday;
                                break;
                            case "sun":
                                item.DayOfWeek = DayOfWeek.Sunday;
                                break;
                            default:
                                item.DayOfWeek = null;
                                break;
                        }
                    }

                    var dayOfMonthString = row.Cell(PlanningImportExcelConsts.PlanningDayOfMonthCol).Value.ToString();
                    var dayOfMonthParseResult = int.TryParse(dayOfMonthString, out var dayOfMonth);
                    if (dayOfMonthParseResult)
                    {
                        item.DayOfMonth = dayOfMonth;
                    }
                    else
                    {
                        item.DayOfMonth = null;
                    }


                    // EForm name
                    item.EFormName = row.Cell(PlanningImportExcelConsts.EformNameCol).Value.ToString();

                    // EForm tags
                    var tag1 = row.Cell(PlanningImportExcelConsts.Tag1Col).Value.ToString();
                    var tag2 = row.Cell(PlanningImportExcelConsts.Tag2Col).Value.ToString();
                    var tag3 = row.Cell(PlanningImportExcelConsts.Tag3Col).Value.ToString();
                    var tag4 = row.Cell(PlanningImportExcelConsts.Tag4Col).Value.ToString();
                    var tag5 = row.Cell(PlanningImportExcelConsts.Tag5Col).Value.ToString();
                    var tag6 = row.Cell(PlanningImportExcelConsts.Tag6Col).Value.ToString();
                    var tag7 = row.Cell(PlanningImportExcelConsts.Tag7Col).Value.ToString();
                    var tag8 = row.Cell(PlanningImportExcelConsts.Tag8Col).Value.ToString();
                    var tag9 = row.Cell(PlanningImportExcelConsts.Tag9Col).Value.ToString();
                    var tag10 = row.Cell(PlanningImportExcelConsts.Tag10Col).Value.ToString();

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
}