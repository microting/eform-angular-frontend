using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class EformReportElement : BaseEntity
    {        
        [Required]
        public int ElementId { get; set; }
        public int Position { get; set; }
        public bool Visibility { get; set; }

        public int EformReportId { get; set; }
        public EformReport EformReport { get; set; }

        public int? ParentId { get; set; }
        public EformReportElement Parent { get; set; }

        public List<EformReportElement> NestedElements { get; set; }
            = new List<EformReportElement>();
    }
}