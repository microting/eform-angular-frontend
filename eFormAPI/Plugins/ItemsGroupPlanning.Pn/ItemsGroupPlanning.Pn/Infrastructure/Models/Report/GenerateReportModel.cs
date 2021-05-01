namespace ItemsGroupPlanning.Pn.Infrastructure.Models.Report
{
    using System;

    public class GenerateReportModel
    {
        public int ItemList { get; set; }
        public int Item { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
