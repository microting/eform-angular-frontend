using System.Collections.Generic;
using eFormShared;

namespace eFormAPI.BasePn.Models.Templates
{
    public class DeployToModel
    {
        public Template_Dto TemplateDto { get; set; }
        public List<SiteName_Dto> SiteNamesDto { get; set; }
    }
}