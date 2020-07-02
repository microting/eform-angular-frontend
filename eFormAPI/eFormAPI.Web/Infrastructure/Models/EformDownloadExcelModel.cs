using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eFormAPI.Web.Infrastructure.Models
{
    public class EformDownloadExcelModel
    {
        public int TemplateId { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
