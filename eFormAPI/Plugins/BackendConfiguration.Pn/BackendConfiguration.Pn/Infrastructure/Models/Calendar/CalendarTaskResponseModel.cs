using System;
using System.Collections.Generic;

namespace BackendConfiguration.Pn.Infrastructure.Models.Calendar;

public class CalendarTaskResponseModel
{
    public int Id { get; set; }
    public string Title { get; set; }
    public double StartHour { get; set; }
    public double Duration { get; set; }
    public string TaskDate { get; set; }
    public List<string> Tags { get; set; } = [];
    public List<int> AssigneeIds { get; set; } = [];
    public int? BoardId { get; set; }
    public string Color { get; set; }
    public int RepeatType { get; set; }
    public int RepeatEvery { get; set; }
    public bool Completed { get; set; }
    public int PropertyId { get; set; }
    public int? ComplianceId { get; set; }
    public bool IsFromCompliance { get; set; }
    public DateTime? Deadline { get; set; }
    public DateTime? NextExecutionTime { get; set; }
    public int? PlanningId { get; set; }
    public bool IsAllDay { get; set; }
    public int? ExceptionId { get; set; }
    public int? EformId { get; set; }
    public int? SdkCaseId { get; set; }
    public int? ItemPlanningTagId { get; set; }
}
