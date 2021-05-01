namespace ItemsGroupPlanning.Pn.Infrastructure.Models.Report
{
    using System;
    using System.Collections.Generic;

    public class ReportModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public List<DateTime?> Dates { get; set; } = new List<DateTime?>();
        public List<DateTime?> DatesDoneAt { get; set; } = new List<DateTime?>();
        public List<string> Ids { get; set; } = new List<string>();
        public List<string> DoneBy { get; set; } = new List<string>();
        public List<ReportFormFieldModel> FormFields { get; set; } = new List<ReportFormFieldModel>();
    }
}
