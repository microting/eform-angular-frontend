using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class EformReportDataItem : BaseEntity
    {
        [Required]
        public int DataItemId { get; set; }

        public int Position { get; set; }
        public bool Visibility { get; set; }

        public int EformReportElementId { get; set; }
        public virtual EformReportElement EformReportElement { get; set; }

        public int? ParentId { get; set; }
        public virtual EformReportDataItem Parent { get; set; }

        public virtual ICollection<EformReportDataItem> NestedDataItems { get; set; } = new List<EformReportDataItem>();
    }
}