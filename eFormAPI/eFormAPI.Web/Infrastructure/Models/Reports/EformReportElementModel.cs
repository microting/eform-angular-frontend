using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Reports
{
    public class EformReportElementModel
    {
        public int Id { get; set; }
        public int ElementId { get; set; }
        public string Label { get; set; }

        public List<EformReportDataItemModel> DataItemList { get; set; }
            = new List<EformReportDataItemModel>();

        public List<EformReportElementModel> ElementList { get; set; }
            = new List<EformReportElementModel>();
    }
}