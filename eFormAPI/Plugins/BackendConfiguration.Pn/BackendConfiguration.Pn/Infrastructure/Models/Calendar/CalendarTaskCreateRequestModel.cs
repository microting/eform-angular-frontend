using System;
using System.Collections.Generic;
using Microting.eForm.Infrastructure.Models;

namespace BackendConfiguration.Pn.Infrastructure.Models.Calendar;

public class CalendarTaskCreateRequestModel
{
    public int PropertyId { get; set; }
    public int? FolderId { get; set; }
    public int? ItemPlanningTagId { get; set; }
    public List<int> TagIds { get; set; } = [];
    public List<CommonTranslationsModel> Translates { get; set; } = [];
    public int EformId { get; set; }
    public DateTime StartDate { get; set; }
    public int RepeatType { get; set; }
    public int RepeatEvery { get; set; }
    public int Status { get; set; }
    public List<int> Sites { get; set; } = [];
    public bool ComplianceEnabled { get; set; }
    public double StartHour { get; set; }
    public double Duration { get; set; }
    public int? BoardId { get; set; }
    public string Color { get; set; }
    public int? RepeatEndMode { get; set; }
    public int? RepeatOccurrences { get; set; }
    public DateTime? RepeatUntilDate { get; set; }
}
