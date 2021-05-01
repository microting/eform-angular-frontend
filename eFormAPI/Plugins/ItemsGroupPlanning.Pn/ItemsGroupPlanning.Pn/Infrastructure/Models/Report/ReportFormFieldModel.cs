namespace ItemsGroupPlanning.Pn.Infrastructure.Models.Report
{
    using System.Collections.Generic;

    public class ReportFormFieldModel
    {
        public int DataItemId { get; set; }
        public string Label { get; set; }
        public List<ReportFormFieldOptionModel> Options { get; set; } =
            new List<ReportFormFieldOptionModel>();
    }
}
