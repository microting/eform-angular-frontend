using System.Collections.Generic;
using eFormShared;

namespace eFormAPI.Common.Models
{
    public class DeployToModel
    {
        public Template_Dto TemplateDto { get; set; }
        public List<SiteName_Dto> SiteNamesDto { get; set; }
    }
}