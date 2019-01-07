using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Reports
{
    public class EformReportElementsModel
    {
        public int Id { get; set; }
        public int ElementId { get; set; }
        public string Label { get; set; }

        public List<EformReportDataItemModel> DataItemList { get; set; }
            = new List<EformReportDataItemModel>();

        public List<EformReportElementsModel> ElementList { get; set; }
            = new List<EformReportElementsModel>();
    }
}