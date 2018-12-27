using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models
{
    public class EFormXmlModel
    {
        public string EFormXml { get; set; }
        public string NewTag { get; set; }
        public List<int> TagIds { get; set; }

        public EFormXmlModel()
        {
            TagIds = new List<int>();
        }
    }
}