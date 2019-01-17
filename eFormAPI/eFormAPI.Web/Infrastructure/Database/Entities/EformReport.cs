using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class EformReport : BaseEntity
    {
        [Required]
        public int TemplateId { get; set; }
        public string Description { get; set; }
        public byte[] HeaderImage { get; set; }
        public string HeaderVisibility { get; set; }
        public bool IsDateVisible { get; set; }
        public bool IsWorkerNameVisible { get; set; }

        public virtual ICollection<EformReportElement> ReportElements { get; set; } = new List<EformReportElement>();
    }
}