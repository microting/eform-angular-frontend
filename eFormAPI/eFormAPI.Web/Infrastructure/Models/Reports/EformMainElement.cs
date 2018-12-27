using System.Collections.Generic;
using eFormAPI.Web.Infrastructure.Database.Entities;

namespace eFormAPI.Web.Infrastructure.Models.Reports
{
    public class EformMainElement
    {
        public int Id { get; set; }
        public string Label { get; set; }

        public List<EformReportElementsModel> ElementList { get; set; }
            = new List<EformReportElementsModel>();
    }
}