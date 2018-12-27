using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Reports
{
    public class EformReportDataItemModel
    {
        public int Id { get; set; }
        public int DataItemId { get; set; }

        public string Label { get; set; }
        public string FieldType { get; set; }

        public int Position { get; set; }
        public bool Visibility { get; set; }

        public List<EformReportDataItemModel> DataItemList =
            new List<EformReportDataItemModel>();
    }
}