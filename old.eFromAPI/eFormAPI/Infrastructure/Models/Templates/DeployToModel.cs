using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Templates
{
    public class DeployToModel
    {
        public Template_Dto TemplateDto { get; set; }
        public List<SiteName_Dto> SiteNamesDto { get; set; }
    }
}