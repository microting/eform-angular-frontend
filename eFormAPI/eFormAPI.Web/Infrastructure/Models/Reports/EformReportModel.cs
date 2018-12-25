using System.Collections.Generic;
using eFormAPI.Web.Infrastructure.Database.Entities;

namespace eFormAPI.Web.Infrastructure.Models.Reports
{
    public class EformReportModel
    {
        public int Id { get; set; }
        public int TemplateId { get; set; }
        public string Description { get; set; }
        public string HeaderImage { get; set; }
        public string HeaderVisibility { get; set; }
        public bool IsDateVisible { get; set; }
        public bool IsWorkerNameVisible { get; set; }

        public List<EformReportElementsModel> Elements { get; set; }
            = new List<EformReportElementsModel>();
    }
}