using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Reports
{
    public class EformReportElementsModel
    {
        public int Id { get; set; }
        public int ElementId { get; set; }
        public int Position { get; set; }
        public bool Visibility { get; set; }

        public List<EformReportElementsModel> NestedElements { get; set; }
            = new List<EformReportElementsModel>();
    }
}
