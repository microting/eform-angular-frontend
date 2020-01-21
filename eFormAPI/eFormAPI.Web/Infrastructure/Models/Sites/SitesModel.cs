namespace eFormAPI.Web.Infrastructure.Models.Sites
{
    using System.Collections.Generic;

    public class SitesModel
    {
        public int Total { get; set; }

        public List<SiteModel> Entities { get; set; }
            = new List<SiteModel>();
    }
}