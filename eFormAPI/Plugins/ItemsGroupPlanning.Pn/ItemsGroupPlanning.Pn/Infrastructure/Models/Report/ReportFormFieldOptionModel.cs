namespace ItemsGroupPlanning.Pn.Infrastructure.Models.Report
{
    using System.Collections.Generic;

    public class ReportFormFieldOptionModel
    {
        public string Key { get; set; }
        public string Label { get; set; }
        public List<string> Values { get; set; } = new List<string>();
    }
}
