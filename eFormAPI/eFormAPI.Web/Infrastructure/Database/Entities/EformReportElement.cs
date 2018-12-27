using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using eFormAPI.Web.Infrastructure.Models.Reports;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class EformReportElement : BaseEntity
    {        
        [Required]
        public int ElementId { get; set; }

        public int EformReportId { get; set; }
        public EformReport EformReport { get; set; }

        public int? ParentId { get; set; }
        public EformReportElement Parent { get; set; }

        public ICollection<EformReportElement> NestedElements { get; set; }
        public ICollection<EformReportDataItem> DataItems { get; set; }
    }
}